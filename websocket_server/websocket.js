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

io.on("connection", async (socket) => {
  console.log("A user connected with id: " + socket.id);

  socket.on("intitalRequest", (data) => {
    console.log("User " + socket.id + " requests " + data);
  });

  // List of PV names to monitor
  const pvList = [
    "AC:TS1:BEAM:CURR",
    "AC:TS2:BEAM:CURR",
    "IN:INTER:MOT:MTR0505.RBV",
    "IN:INTER:MOT:MTR0604.RBV",
    "IN:INTER:MOT:MTR0506.RBV",
  ];

  // Create monitors for each PV in the list
  const pvMonitors = await Promise.all(
    pvList.map((pvName) => CA.monitor(pvName))
  );

  // Handle PV value changes for each monitor
  function handlePVChange(index) {
    return function (data) {
      const pvInfo = {
        pvName: pvList[index],
        value: data,
        // Add more information as needed
      };
      socket.emit("instData", pvInfo);
    };
  }

  // Attach event listeners for value changes for each PV
  pvMonitors.forEach((pvMonitor, index) => {
    pvMonitor.on("value", handlePVChange(index));
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

httpServer.listen(5000, () => {
  console.log("listening on *:5000");
});
