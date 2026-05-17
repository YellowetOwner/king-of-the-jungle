const { Server } = require("socket.io");

const io = new Server();

io.on("connection", (socket) => {
  console.log(`Client Connected, SID:${socket.sid}`)
});

io.listen(3000);