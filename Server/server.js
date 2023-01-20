const scriptFile = require("./scripts")

const io = require("socket.io")(3000, {
	cors: {
		origin: "*",
	},
})

const rooms_list = {} // Dictionnarie permettant de compter le nombre de clients ready dans une room spécifique
const clients = {}
let rank = 1

io.on("connection", (socket) => {
	clients[socket.id] = socket

	socket.on("join-room", (room, nickname, cb) => {
		socket.room = room
		socket.join(room)
		if (!(room in rooms_list)) {
			rooms_list[room] = {
				ready: 0,
				wordlist: "",
				letters: "",
				has_finished: 0,
				arePlaying: 0,
				messages: [],
				players: {},
			}
		}
		// nickname is already taken
		if (Object.values(rooms_list[room].players).some((player) => player.nickname == nickname)) {
			nickname += "-" + Math.random().toString(36).slice(-3)
		}

		socket.nickname = nickname

		rooms_list[room].players[socket.id] = {
			nickname: socket.nickname,
			isReady: false,
			id: socket.id,
			wpm: 0,
			percentage: 0,
			chrono: 0,
			panda: "5",
			isAdmin: false,
			isTyping: false,
			rank: 0,
			inGame: false,
		}
		if (Object.keys(rooms_list[room].players).length == 1) {
			rooms_list[room].players[socket.id].isAdmin = true
		}
		io.to(room).emit("playerslist-update", rooms_list[room].players)
		console.log(socket.nickname + " joined room: " + room)
	})

	socket.on("send-message", (val, cb) => {
		rooms_list[socket.room].messages.push({
			sender: socket.nickname,
			message: val,
		})
		io.to(socket.room).emit("message-update", rooms_list[socket.room].messages)
	})

	socket.on("client-ready", async () => {
		if (rooms_list[socket.room].players[socket.id].isReady == true) {
			rooms_list[socket.room].players[socket.id].isReady = false
			io.to(socket.room).emit("playerslist-update", rooms_list[socket.room].players)
			rooms_list[socket.room].ready--
		} else {
			rooms_list[socket.room].players[socket.id].isReady = true
			io.to(socket.room).emit("playerslist-update", rooms_list[socket.room].players)
			rooms_list[socket.room].ready++
			rooms_list[socket.room].arePlaying++
			if (rooms_list[socket.room].ready > 1 && rooms_list[socket.room].ready == io.sockets.adapter.rooms.get(socket.room).size) {
				rooms_list[socket.room].wordlist = await scriptFile.makeWordsList()
				rooms_list[socket.room].letters = await scriptFile.makeColors(rooms_list[socket.room].wordlist)
				Object.values(rooms_list[socket.room].players).map((player) => {
					player.isReady = false
					player.isTyping = true
					player.valid_list = undefined
					player.chrono = 0
					player.wpm = 0
					player.rank = 0
					player.inGame = true
				})
				io.to(socket.room).emit("game-ready", rooms_list[socket.room])
				rooms_list[socket.room].ready = 0
				rank = 1
			}
		}
	})
	socket.on("ask-kick", (id, room) => {
		delete rooms_list[socket.room].players[id]
		const socketToKick = clients[id]
		socketToKick.leave(room)
		socketToKick.emit("got-kick")
		io.to(socket.room).emit("playerslist-update", rooms_list[socket.room].players)
	})
	socket.on("goHome", () => {
		if (socket.room) {
			delete rooms_list[socket.room].players[socket.id]
			socket.leave(socket.room)
			console.log(socket.nickname + " leaved room: " + socket.room)
			let gameHasAdmin = false
			//vérifier si un autre joueur est administrateur
			for (let player of Object.values(rooms_list[socket.room].players)) {
				if (player.isAdmin) {
					gameHasAdmin = true
					break
				}
			}
			//si aucun joueur n'est administrateur, définir le premier joueur comme administrateur
			if (!gameHasAdmin && Object.keys(rooms_list[socket.room].players).length > 0) {
				rooms_list[socket.room].players[Object.keys(rooms_list[socket.room].players)[0]].isAdmin = true
				io.to(socket.room).emit("playerslist-update", rooms_list[socket.room].players)
			} else if (Object.keys(rooms_list[socket.room].players).length == 0) {
				delete rooms_list[socket.room]
				console.log("room: " + socket.room + " deleted")
			}
		}
	})

	socket.on("client-wordstate", (val, time) => {
		rooms_list[socket.room].players[socket.id].valid_list = val
		rooms_list[socket.room].players[socket.id].chrono = time.toFixed(2)
		rooms_list[socket.room].players[socket.id].wpm = (val.length / (time / 60)).toFixed(0)
		rooms_list[socket.room].players[socket.id].percentage = ((val.length / rooms_list[socket.room].wordlist.length) * 100).toFixed(0)
		rooms_list[socket.room].players[socket.id].panda = 5 + (rooms_list[socket.room].players[socket.id].percentage * (50 - 5)) / 100
		if (val.length < rooms_list[socket.room].wordlist.length) {
			io.to(socket.room).emit("playerslist-update", rooms_list[socket.room].players)
		}
	})

	socket.on("client-finish", () => {
		rooms_list[socket.room].players[socket.id].isTyping = false
		rooms_list[socket.room].has_finished++
		rooms_list[socket.room].players[socket.id].rank = rank
		rooms_list[socket.room].players[socket.id].panda = "5"
		
		rank++
		io.to(socket.room).emit("playerslist-update", rooms_list[socket.room].players)
		if (rooms_list[socket.room].has_finished == rooms_list[socket.room].arePlaying) {
			rooms_list[socket.room].ready = 0
			rooms_list[socket.room].players[socket.id].inGame = false
		}
	})

	socket.on("disconnect", () => {
		if (socket.room) {
			try {
				//supprimer le joueur déconnecté de la liste des joueurs de la salle
				delete rooms_list[socket.room].players[socket.id]
				let gameHasAdmin = false
				//vérifier si un autre joueur est administrateur
				for (let player of Object.values(rooms_list[socket.room].players)) {
					if (player.isAdmin) {
						gameHasAdmin = true
						break
					}
				}
				//si aucun joueur n'est administrateur, définir le premier joueur comme administrateur
				if (!gameHasAdmin && Object.keys(rooms_list[socket.room].players).length > 0) {
					rooms_list[socket.room].players[Object.keys(rooms_list[socket.room].players)[0]].isAdmin = true
				}
				//envoyer une mise à jour de la liste des joueurs à tous les joueurs de la salle
				io.to(socket.room).emit("playerslist-update", rooms_list[socket.room].players)
				console.log(socket.nickname + " leaved room: " + socket.room)
			} catch (err) {
				console.log(err)
			}
			//vérifier si la salle est vide
			if (io.sockets.adapter.rooms.get(socket.room) == undefined) {
				//supprimer la salle
				room = socket.room
				delete rooms_list[socket.room]
				console.log("room: " + room + " deleted")
			}
		}
	})
})
