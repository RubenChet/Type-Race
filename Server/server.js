const scriptFile = require("./scripts");

const io = require("socket.io")(3000, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

const rooms_list = {}; // Dictionnarie permettant de compter le nombre de clients ready dans une room spécifique
const clients = {};
let rank = 1;

io.on("connection", (socket) => {
  clients[socket.id] = socket;

  socket.on("join-room", (room, nickname, cb) => {
    socket.room = room;
    socket.join(room);
    if (!(room in rooms_list)) {
      rooms_list[room] = {
        ready: 0,
        wordlist: "",
        letters: "",
        has_finished: 0,
        arePlaying: 0,
        messages: [],
        players: {},
      };
    }
    // nickname is already taken
    if (Object.values(rooms_list[room].players).some((player) => player.nickname == nickname)){
      nickname += '-' + Math.random().toString(36).slice(-3)
    }

    socket.nickname = nickname;

    rooms_list[room].players[socket.id] = {
      nickname: socket.nickname,
      isReady: false,
      id: socket.id,
    };
    io.to(room).emit("playerslist-update", rooms_list[room].players);
    cb(rooms_list[socket.room].players);
    console.log(socket.nickname + " joined room " + room);
  });

  socket.on("send-message", (val, cb) => {
    rooms_list[socket.room].messages.push({
      sender: socket.nickname,
      message: val,
    });
    io.to(socket.room).emit("message-update", rooms_list[socket.room].messages);
  });

  socket.on("client-ready", () => {
    if (rooms_list[socket.room].players[socket.id].isReady == true) {
      rooms_list[socket.room].players[socket.id].isReady = false;
      io.to(socket.room).emit(
        "playerslist-update",
        rooms_list[socket.room].players
      );
      rooms_list[socket.room].ready--;
    } else {
      rooms_list[socket.room].players[socket.id].isReady = true;
      io.to(socket.room).emit(
        "playerslist-update",
        rooms_list[socket.room].players
      );
      rooms_list[socket.room].ready++;
      rooms_list[socket.room].arePlaying++;
      rooms_list[socket.room].players[socket.id].valid_list = undefined;
      rooms_list[socket.room].players[socket.id].chrono = 0;
      rooms_list[socket.room].players[socket.id].wpm = 0;
      if (
        rooms_list[socket.room].ready > 1 &&
        rooms_list[socket.room].ready ==
          io.sockets.adapter.rooms.get(socket.room).size
      ) {
        rooms_list[socket.room].wordlist = scriptFile.makeWordsList();
        rooms_list[socket.room].letters = scriptFile.makeColors(
          rooms_list[socket.room].wordlist
        );
        io.to(socket.room).emit("game-ready", rooms_list[socket.room]);
        Object.values(rooms_list[socket.room].players).map((player) => {
          player.isReady = false;
          player.isTyping = true
        });
        io.to(socket.room).emit(
          "playerslist-update",
          rooms_list[socket.room].players
        );
        rooms_list[socket.room].ready = 0;
        rank = 1;
      }
    }
  });
  socket.on("ask-kick", (id) => {
    delete rooms_list[socket.room].players[id];
    const socketToKick = clients[id];
    socketToKick.leaveAll();
    socketToKick.emit("got-kick");
    io.to(socket.room).emit(
      "playerslist-update",
      rooms_list[socket.room].players
    );
  });

  socket.on("client-wordstate", (val, time) => {
    rooms_list[socket.room].players[socket.id].valid_list = val;
    rooms_list[socket.room].players[socket.id].chrono = time;
    rooms_list[socket.room].players[socket.id].wpm = (
      val.length /
      (time / 60)
    ).toFixed(0);
    if (val.length < rooms_list[socket.room].wordlist.length) {
      io.to(socket.room).emit(
        "playerslist-update",
        rooms_list[socket.room].players
      );
    }
  });

  socket.on("client-finish", () => {
    rooms_list[socket.room].players[socket.id].isTyping = false;
    rooms_list[socket.room].has_finished++;
    rooms_list[socket.room].players[socket.id].rank = rank;
    rank++;
    io.to(socket.room).emit(
      "playerslist-update",
      rooms_list[socket.room].players
    );
    if (
      rooms_list[socket.room].has_finished == rooms_list[socket.room].arePlaying
    ) {
      rooms_list[socket.room].ready = 0;
    }
  });

  socket.on("disconnect", () => {
    try {
      delete rooms_list[socket.room].players[socket.id];
      io.to(socket.room).emit(
        "playerslist-update",
        rooms_list[socket.room].players
      );
    } catch {
      return;
    }
    if (io.sockets.adapter.rooms.get(socket.room) == undefined) {
      delete rooms_list[socket.room];
      console.log('room deleted')
    }
  });
});
