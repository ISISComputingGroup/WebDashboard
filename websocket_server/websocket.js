const { createServer } = require("http");
const { Server } = require("socket.io");
const CA = require("node-epics-ca");
const { exec } = require("child_process");
const util = require("util");
const { copyFileSync } = require("fs");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const sockets = new Map();

class Instrument {
  /**
   * Instrument object containing the map of instrument PVs
   * @param {*} name
   */
  constructor(name) {
    this.inst_name = name;
    // need this as the callback cant do stuff outside
    const inst_name = name;
    const cache = new Map();
    this.cache = cache;
    const groupCache = new Map();
    this.groupCache = groupCache;
    this.prefix = `IN:${this.inst_name.toUpperCase()}:`;
    this.activeSockets = [];
    // TODO we are going to need to get the block names here
    // TODO we should subclass this or something for the central PVs so we dont make unnecessary monitors

    this.topBarMap = new Map(
      Object.entries({
        "AC:TS1:BEAM:CURR": false,
        "AC:TS2:BEAM:CURR": false,
        [`${this.prefix}DAE:RUNSTATE`]: true,
        [`${this.prefix}DAE:RUNNUMBER`]: false,
        [`${this.prefix}DAE:STARTTIME`]: false,
        [`${this.prefix}DAE:TITLE`]: false,
        [`${this.prefix}DAE:GOODFRAMES`]: false,
        [`${this.prefix}DAE:GOODFRAMES_PD`]: false,
        [`${this.prefix}DAE:MONITORCOUNTS`]: false,
        [`${this.prefix}DAE:RUNDURATION`]: false,
        [`${this.prefix}DAE:RUNDURATION_PD`]: false,
        [`${this.prefix}DAE:RAWFRAMES`]: false,
        [`${this.prefix}DAE:RAWFRAMES_PD`]: false,
        [`${this.prefix}DAE:PERIOD`]: false,
        [`${this.prefix}DAE:NUMPERIODS`]: false,
        [`${this.prefix}DAE:GOODUAH`]: false,
        [`${this.prefix}DAE:GOODUAH_PD`]: false,
        [`${this.prefix}DAE:COUNTRATE`]: false,
        [`${this.prefix}DAE:MONITORSPECTRUM`]: false,
        [`${this.prefix}DAE:MONITORFROM`]: false,
        [`${this.prefix}DAE:MONITORTO`]: false,
        [`${this.prefix}DAE:NUMSPECTRA`]: false,
        [`${this.prefix}DAE:NUMTIMECHANNELS`]: false,
        //todo users and title - these might not be available over CA?
      })
    );

    for (const [pvName, turnEnumToString] of this.topBarMap.entries()) {
      console.log(`setting up monitor for ${pvName}`);

      // CA.get(pvName, turnEnumToString).then((data) => {
      //   console.log(`value for ${pvName} is ${data}`);
      //   // cache.set(pvName, data);
      //   const pvInfo = {
      //     pvName,
      //     value: data,
      //     // Add more information as needed. We might need to do another CA.get here to find out things like run control values
      //   };
      //   for (const [socket, inst] of sockets.entries()) {
      //     // console.log("socket "+socket+" inst "+inst+" data "+data + "this inst "+this.inst_name)
      //     if (inst == inst_name) {
      //       //console.log(`emitting ${pvInfo.pvName}value ${data}`);
      //       socket.emit("instData", pvInfo);
      //     }
      //   }
      // });

      CA.monitor(
        pvName,
        (data) => {
          console.log(`value for ${pvName} is ${data}`);
          cache.set(pvName, data);
          const pvInfo = {
            pvName,
            value: data,
            // Add more information as needed. We might need to do another CA.get here to find out things like run control values
          };
          for (const [socket, inst] of sockets.entries()) {
            // console.log("socket "+socket+" inst "+inst+" data "+data + "this inst "+this.inst_name)
            if (inst == inst_name) {
              //console.log(`emitting ${pvInfo.pvName}value ${data}`);
              socket.emit("instData", pvInfo);
            }
          }
        },
        turnEnumToString
      );
    }

    // this.pvMap = new Map(
    //   Object.entries({
    //     "AC:TS1:BEAM:CURR": false,
    //     "AC:TS2:BEAM:CURR": false,
    //     [`${this.prefix}DAE:RUNSTATE`]: true,
    //     [`${this.prefix}DAE:RUNNUMBER`]: false,
    //     [`${this.prefix}DAE:STARTTIME`]: false,
    //     [`${this.prefix}DAE:TITLE`]: false,
    //     [`${this.prefix}DAE:GOODFRAMES`]: false,
    //     [`${this.prefix}DAE:GOODFRAMES_PD`]: false,
    //     [`${this.prefix}DAE:MONITORCOUNTS`]: false,
    //     [`${this.prefix}DAE:RUNDURATION`]: false,
    //     [`${this.prefix}DAE:RUNDURATION_PD`]: false,
    //     [`${this.prefix}DAE:RAWFRAMES`]: false,
    //     [`${this.prefix}DAE:RAWFRAMES_PD`]: false,
    //     [`${this.prefix}DAE:PERIOD`]: false,
    //     [`${this.prefix}DAE:NUMPERIODS`]: false,
    //     [`${this.prefix}DAE:GOODUAH`]: false,
    //     [`${this.prefix}DAE:GOODUAH_PD`]: false,
    //     [`${this.prefix}DAE:COUNTRATE`]: false,
    //     [`${this.prefix}DAE:MONITORSPECTRUM`]: false,
    //     [`${this.prefix}DAE:MONITORFROM`]: false,
    //     [`${this.prefix}DAE:MONITORTO`]: false,
    //     [`${this.prefix}DAE:NUMSPECTRA`]: false,
    //     [`${this.prefix}DAE:NUMTIMECHANNELS`]: false,
    //     //todo users and title - these might not be available over CA?
    //   })
    // );
  }

  async setGroupMap() {
    console.log("setting group map");
    const command = `C:\\Instrument\\Apps\\EPICS\\config_env.bat && caget -tS ${this.prefix}CS:BLOCKSERVER:GET_CURR_CONFIG_DETAILS | uzhex`;

    // Promisify the exec function to use async/await
    const execAsync = util.promisify(exec);

    try {
      // Run the command
      const { stdout, stderr } = await execAsync(command);

      // Check for any errors
      if (stderr) {
        console.error(`Error: ${stderr}`);
        return null; // or throw an error, depending on your use case
      }

      // Store the output in a variable
      // index 18  onwards
      const ConfigOutput = JSON.parse(stdout.trim().split("\n").slice(19)[1]);
      const blocks = ConfigOutput.blocks;
      const groups = ConfigOutput.groups;
      this.groupMap = [];

      // console.log("Group output:", groups[0]);

      for (const group of groups) {
        const groupName = group.name;
        const groupBlocks = group.blocks;
        const groupComponent = group.component;

        this.groupMap.push({
          name: groupName,
          blocks: [],
        });

        for (const block of groupBlocks) {
          console.log("Block:", block);
          const newBlock = blocks.find((b) => b.name === block);
          console.log("NewBlock:", newBlock);

          this.groupMap[this.groupMap.length - 1].blocks.push({
            name: newBlock.name,
            pv: newBlock.pv,
            rc: newBlock.runcontrol,
            lowlimit: newBlock.lowlimit,
            highlimit: newBlock.highlimit,
          });
        }
      }

      console.log("GroupMap:", this.groupMap);
      // prefix inst rexif on each block of the groupMap

      // for (const group of this.groupMap) {
      //   group.blocks = group.blocks.map((block) => {
      //     return `${this.prefix}${block}`;
      //   });
      // }

      for (const group of this.groupMap) {
        // console.log(`setting up monitor for ${pvName}`);
        for (const block of group.blocks) {
          //   CA.get(block.pv, true).then((data) => {
          //     console.log(`value for ${block.pv} is ${data}`);
          //     cache.set(block.pv, data);
          //     const pvInfo = {
          //       pvName: block.pv,
          //       value: data,
          //       // Add more information as needed. We might need to do another CA.get here to find out things like run control values
          //     };
          //     for (const [socket, inst] of sockets.entries()) {
          //       // console.log("socket "+socket+" inst "+inst+" data "+data + "this inst "+this.inst_name)
          //       if (inst == this.inst_name) {
          //         //console.log(`emitting ${pvInfo.pvName}value ${data}`);
          //         socket.emit("groupPV", pvInfo);
          //       }
          //     }
          // });

          CA.monitor(
            block.pv,
            (data) => {
              console.log(`value for ${block.pv} is ${data}`);
              const pvInfo = {
                pvName: block.pv,
                value: data,
                runcontrol: block.rc,
                lowlimit: block.lowlimit,
                highlimit: block.highlimit,
                // Add more information as needed. We might need to do another CA.get here to find out things like run control values
              };
              this.groupCache.set(block.pv, pvInfo);
              for (const [socket, inst] of sockets.entries()) {
                // console.log("socket "+socket+" inst "+inst+" data "+data + "this inst "+this.inst_name)
                if (inst == this.inst_name) {
                  //console.log(`emitting ${pvInfo.pvName}value ${data}`);
                  socket.emit("groupPV", pvInfo);
                }
              }
            },
            true
          );
        }
      }
      // console.log("Command output:", this.groupMap);

      // this.groupMap = output;

      // for (const [] of this.groupMap.entries()) {
      //   // console.log(`setting up monitor for ${pvName}`);
      //   CA.monitor(
    } catch (error) {
      console.error("Error:", error.message);
      return null; // or throw an error, depending on your use case
    }
  }

  outputGroupMap(sock) {
    for (const group of this.groupMap) {
      const groupInfo = {
        name: group.name,
        blocks: group.blocks,
      };
      // console.log(
      //   `emitting group ${groupInfo.name} with blocks ${groupInfo.blocks}`
      // );
      sock.emit("groupData", groupInfo);
    }
  }

  async outputTopBarMap(sock) {
    for (const [pvName, turnEnumToString] of this.topBarMap.entries()) {
      let data = await CA.get(pvName, turnEnumToString);
      const pvInfo = {
        pvName,
        value: data,
        // Add more information as needed. We might need to do another CA.get here to find out things like run control values
      };
      sock.emit("instData", pvInfo);
    }
  }

  getCachedValuesForSocket(sock) {
    //console.log(`cache size ${this.cache.size}`);
    for (const [pvName, data] of this.cache.entries()) {
      const pvInfo = {
        pvName,
        value: data,
        // Add more information as needed. We might need to do another CA.get here to find out things like run control values
      };
      //console.log(`emitting ${pvName} value of ${data}`);
      sock.emit("instData", pvInfo);
    }

    for (const [pvName, data] of this.groupCache.entries()) {
      console.log(`emitting FROM CACHE ${pvName} value of ${data}`);
      const pvInfo = {
        pvName: data.pvName,
        value: data.value,
        runcontrol: data.runcontrol,
        lowlimit: data.lowlimit,
        highlimit: data.highlimit,
        // Add more information as needed. We might need to do another CA.get here to find out things like run control values
      };
      //console.log(`emitting ${pvName} value of ${data}`);
      sock.emit("groupPV", pvInfo);
    }
  }

  // async outPutTopBarPvs(sock) {
  //   for (const [pvName, turnEnumToString] of this.topBarMap.entries()) {
  //     let data = await CA.get(pvName, turnEnumToString);
  //     const pvInfo = {
  //       pvName,
  //       value: data,
  //       // Add more information as needed. We might need to do another CA.get here to find out things like run control values
  //     };
  //     sock.emit("instData", pvInfo);
  //   }
  // }

  // async outputGroupPvs(sock) {
  //   for (const group of this.groupMap) {
  //     for (const block of group.blocks) {
  //       let data = await CA.get(block.pv, true);
  //       const pvInfo = {
  //         pvName: block.pv,
  //         value: data,
  //         // Add more information as needed. We might need to do another CA.get here to find out things like run control values
  //       };
  //       sock.emit("groupPV", pvInfo);
  //     }
  //     // console.log(
  //     //   `emitting group ${groupInfo.name} with blocks ${groupInfo.blocks}`
  //     // );
  //     sock.emit("groupPV", groupInfo);
  //   }
  // }
}

async function startUp() {
  //TODO use the CS:INSTLIST for this and group appropriately
  const instrumentNames = [
    "imat",
    "inter",
    "let",
    "sandals",
    "polref",
    "larmor",
    "wish",
    "enginx",
    "gem",
    "ines",
    "pearl",
    "polaris",
    "alf",
    "crisp",
    "loq",
    "sans2d",
    "offspec",
    "surf",
    "zoom",
    "iris",
    // "iris_setup",
    "osiris",
    "tosca",
    "vesuvio",
    "emu",
  ];
  const instruments = [];

  for (inst of instrumentNames) {
    // add all monitors here with callbacks that may do something
    instruments.push(new Instrument(inst));
    await instruments[instruments.length - 1].setGroupMap();
    console.log("Setup");
  }

  // var pvMonitors = new Map();

  io.on("connection", async (socket) => {
    console.log(`A user connected with id: ${socket.id}`);

    socket.on("intitalRequest", (data) => {
      console.log(`User ${socket.id} requests ${data}`);
      sockets.set(socket, data);

      //console.log(`getting cached values for ${data}`);
      //console.log(`instruments size${instruments.length}`);

      instruments.forEach(async (inst) => {
        //console.log(inst);
        if (inst.inst_name == data) {
          // console.log(
          //   `found instrument ${inst.inst_name}getting cached values`
          // );
          // console.log(`found instrument ${inst.inst_name}getting cached values`);

          // inst.outputTopBarMap(socket);
          await inst.outputGroupMap(socket);
          await inst.getCachedValuesForSocket(socket);
        }
      });
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
      sockets.delete(socket);
    });
  });
}
httpServer.listen(5000, () => {
  console.log("listening on *:5000");
  startUp();
});
