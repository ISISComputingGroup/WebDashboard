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

var sockets = new Map();

class Instrument {
  constructor(name) {
    this.inst_name = name;
    // need this as the callback cant do stuff outside
    var inst_name = name;
    var cache = new Map();
    this.cache = cache;
    this.prefix = `IN:${this.inst_name.toUpperCase()}:`;
    this.activeSockets = [];
    this.pvMap = new Map(
      Object.entries({
        "AC:TS1:BEAM:CURR": false,
        "AC:TS2:BEAM:CURR": false,
        [`${this.prefix}MOT:MTR0505.RBV`]: false,
        [`${this.prefix}MOT:MTR0604.RBV`]: false,
        [`${this.prefix}MOT:MTR0506.RBV`]: false,
        [`${this.prefix}DAE:RUNSTATE`]: true,
        [`${this.prefix}DAE:RUNNUMBER`]: false,
        [`${this.prefix}DAE:STARTTIME`]: false,
        [`${this.prefix}DAE:TITLE`]: false,
        [`${this.prefix}DAE:GOODFRAMES`]: false,
      })
    );

    this.monitors = new Map();
    for (const [pvName, turnEnumToString] of this.pvMap.entries()) {
      console.log("setting up monitor for " + pvName);

      // CA.get(pvName, turnEnumToString).then((data) => {
      //   console.log("TEST ENUM value for " + pvName + " is " + data);
      // });
      CA.monitor(
        pvName,
        function (data) {
          console.log("value for " + pvName + " is " + data);
          cache.set(pvName, data);
          const pvInfo = {
            pvName: pvName,
            value: data,
            // Add more information as needed. We might need to do another CA.get here to find out things like run control values
          };
          for (let [socket, inst] of sockets.entries()) {
            //console.log("socket "+socket+" inst "+inst+" data "+data + "this inst "+this.inst_name)
            if (inst == inst_name) {
              console.log("emitting " + pvInfo.pvName + "value " + data);
              socket.emit("instData", pvInfo);
            }
          }
        },
        turnEnumToString
      );
    }
  }

  getCachedValuesForSocket(sock) {
    console.log("cache size " + this.cache.size);
    for (let [pvName, data] of this.cache.entries()) {
      const pvInfo = {
        pvName: pvName,
        value: data,
        // Add more information as needed. We might need to do another CA.get here to find out things like run control values
      };
      console.log("emitting " + pvName + " value of " + data);
      sock.emit("instData", pvInfo);
    }
  }
}

var instrumentNames = ["imat", "inter", "let"];
let instruments = [];

for (inst of instrumentNames) {
  // add all monitors here with callbacks that may do something
  instruments.push(new Instrument(inst));
}

// var pvMonitors = new Map();

io.on("connection", async (socket) => {
  console.log("A user connected with id: " + socket.id);

  socket.on("intitalRequest", (data) => {
    console.log("User " + socket.id + " requests " + data);
    sockets.set(socket, data);

    console.log("getting cached values for " + data);
    console.log("instruments size" + instruments.length);

    instruments.forEach((inst) => {
      //TODO this does not work
      console.log(inst);
      if (inst.inst_name == data) {
        console.log(
          "found instrument " + inst.inst_name + "getting cached values"
        );
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
