const scriptFile = require("./scripts");

const io = require("socket.io")(3000, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

const rooms_list = {}; // Dictionnarie permettant de compter le nombre de clients ready dans une room spécifique
const clients = {};

io.on("connection", (socket) => {
  clients[socket.id] = socket;
  socket.on("modify-nickname", (nickname) => {
    // socket.nickname = nickname;
    // rooms_list[room].players.push(socket.nickname)
    // this.game.socket.emit("someone-joined", rooms_list[room].players);
    // console.log(socket.nickname + " joined room " + room);
  });

  socket.on("join-room", (room, nickname, cb) => {
    socket.room = room
    socket.join(room);
    if (!(room in rooms_list)) {
      rooms_list[room] = {
        ready: 0,
        wordlist: scriptFile.makeWordsList(),
        letters: "",
        players: {},
      };
      rooms_list[room].letters = scriptFile.makeColors(
        rooms_list[room].wordlist
      );
    }
    // if (rooms_list[room].players.includes(nickname)){
    //   nickname = 'already_taken'
    // }
    socket.nickname = nickname;

    rooms_list[room].players[socket.id] = {
      nickname: socket.nickname,
      isReady: false,
      id: socket.id
    }
    io.to(room).emit("playerslist-update", rooms_list[room].players);
    cb(nickname)
    console.log(socket.nickname + " joined room " + room);
  });

  socket.on("client-ready", (room) => {
    rooms_list[room].players[socket.id].isReady = true
    io.to(room).emit("playerslist-update", rooms_list[room].players);
    rooms_list[room].ready++;
    if (
      rooms_list[room].ready > 1 &&
      rooms_list[room].ready == io.sockets.adapter.rooms.get(room).size
    ) {
      io.to(room).emit("game-ready", rooms_list[room]);
      Object.values(rooms_list[room].players).map(player => {
        player.isReady = false;
      });
      io.to(socket.room).emit("playerslist-update", rooms_list[socket.room].players);
      rooms_list[room].ready = 0;
    }
  });
  socket.on("ask-kick", (id) => {
    delete rooms_list[socket.room].players[id]
    const socketToKick = clients[id];
    socketToKick.leaveAll()
    socketToKick.emit('got-kick')
    io.to(socket.room).emit("playerslist-update", rooms_list[socket.room].players);
  });

  socket.on("client-finish", (room, cb) => {
    cb("vous avez fini");
    io.to(room).emit("game-finished", "some1 a fini");
  });

  socket.on("disconnect", () => {
    try {
      delete rooms_list[socket.room].players[socket.id]
      io.to(socket.room).emit("playerslist-update", rooms_list[socket.room].players);
    }
    catch{
      console.log('e')
      return
    }
    
  });
});
