const { createServer } = require("http");
const { Server } = require("socket.io");
const CA = require("node-epics-ca");

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
    this.prefix = `IN:${this.inst_name.toUpperCase()}:`;
    this.activeSockets = [];
    // TODO we are going to need to get the block names here
    // TODO we should subclass this or something for the central PVs so we dont make unnecessary monitors 
    this.pvMap = new Map(
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
    for (const [pvName, turnEnumToString] of this.pvMap.entries()) {
      console.log(`setting up monitor for ${pvName}`);
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
  }
}


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
  "iris_setup",
  "osiris",
  "tosca",
  "vesuvio",
  "emu",
];
const instruments = [];

for (inst of instrumentNames) {
  // add all monitors here with callbacks that may do something
  instruments.push(new Instrument(inst));
}

// var pvMonitors = new Map();

io.on("connection", async (socket) => {
  console.log(`A user connected with id: ${socket.id}`);

  socket.on("intitalRequest", (data) => {
    console.log(`User ${socket.id} requests ${data}`);
    sockets.set(socket, data);

    //console.log(`getting cached values for ${data}`);
    //console.log(`instruments size${instruments.length}`);

    instruments.forEach((inst) => {
      //console.log(inst);
      if (inst.inst_name == data) {
        console.log(`found instrument ${inst.inst_name}getting cached values`);
        inst.getCachedValuesForSocket(socket);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    sockets.delete(socket);
  });
});

httpServer.listen(5000, () => {
  console.log("listening on *:5000");
});
