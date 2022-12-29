const scriptFile = require("./scripts");

const io = require("socket.io")(3000, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

let rooms_list = {}; // Dictionnarie permettant de compter le nombre de clients ready dans une room spécifique

io.on("connection", (socket) => {
  socket.on("join-room", (room, cb) => {
    socket.join(room);
    if (!(room in rooms_list)) {
      rooms_list[room] = {
        ready: 0,
        wordlist: scriptFile.makeWordsList(),
        letters: "",
      };
      rooms_list[room].letters = scriptFile.makeColors(
        rooms_list[room].wordlist
      );
    }
    cb(socket.id + " joined room " + room);
  });

  socket.on("client-ready", (room, cb) => {
    cb(socket.id + " is ready in room " + room);
    rooms_list[room].ready++;
    if (
      rooms_list[room].ready > 1 &&
      rooms_list[room].ready == io.sockets.adapter.rooms.get(room).size
    ) {
      io.to(room).emit("game-ready", rooms_list[room]);
      rooms_list[room].ready = 0;
    }
  });

  socket.on("client-finish", (room, cb) => {
    cb('vous avez fini')
    io.to(room).emit('game-finished', 'some1 a fini')
  });
});
