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

  (async () => {
    const pv = await CA.monitor("AC:TS1:BEAM:CURR");
    // Handle PV value changes
    function handlePVChange(data) {
      socket.emit("instData", data);
    }

    pv.on("value", handlePVChange);
  })();

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

httpServer.listen(5000, () => {
  console.log("listening on *:5000");
});
