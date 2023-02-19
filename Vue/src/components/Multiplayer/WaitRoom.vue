<template>
	<Toast class="w-[38vh] h-[22vh]" />
	<div v-if="rdy && seconds > 0">{{ seconds }}</div>
	<GameVue v-else-if="game.isRunning == true" />
	<div id="WaitRoom" v-else class="flex justify-center space-x-48 -mt-8">
		<div id="InputContainer">
			<div id="chat" class="m-4">
				<div class="flex justify-center space-x-2">
					<p>Welcome to room :</p>
					<p class="text-green-500">{{ game.room }}</p>
				</div>
				<div id="chatContainer" class="overflow-auto mx-auto mt-2">
					<div v-for="(msg, index) in game.messages" :key="index" class="flex">
						<p>{{ msg.sender }} : {{ msg.message }}</p>
					</div>
				</div>
				<Divider />
				<div id="send" class="flex justify-center mt-4 space-x-4">
					<InputText id="input_chat" type="text" v-model="msg" placeholder="Chat" class="p-inputtext-sm" @keyup.enter="send_msg(msg)" />
					<Button id="btn_chat" label="Send" class="p-button-rounded p-button-info" @click="send_msg(msg)" />
				</div>
			</div>
		</div>
		<div>
			<div id="InputContainer" class="flex justify-center ResultPannel">
				<ResultVue />
			</div>
			<div class="flex place-content-around mt-5">
				<div id="InputContainer" class="flex-col text-center PlayerPanel">
					<div id="Content" class="m-3">
						<h1>Players List :</h1>
						<div id="players_container" class="overflow-auto">
							<div v-for="(player, index) in game.playerslist" :key="index" class="mt-2">
								<div id="players" class="flex mx-2 items-center">
									<p>{{ player.nickname }} :</p>
									<p v-if="player.isTyping == true" class="text-blue-500">Typing ...</p>
									<p v-else-if="player.isReady == false" class="text-red-500">Not Ready</p>
									<p v-if="player.isReady == true" class="text-green-500">Is Ready</p>
									<p v-if="game.playerslist[game.socket.id].isAdmin == true && player.isAdmin == false" @click="kickPlayer(player.id)" class="cursor-pointer">Kick</p>
									<div class="flex">
										<p v-if="player.isAdmin == true" class="text-green-500">Admin</p>
										<p v-if="player.isAdmin == true && game.socket.id == player.id">/</p>
										<p v-if="game.socket.id == player.id" class="text-blue-500">You</p>
									</div>
								</div>
							</div>
						</div>
						<div class="mt-2 mx-6 flex items-center justify-end">
							<p>Invite Friends<i class="cursor-pointer ml-3 pi pi-external-link"></i></p>
						</div>
					</div>
				</div>
				<div id="InputContainer" class="flex-col text-center PlayerPanel">
					<div id="Content" class="m-3">
						<h1>Game Settings :</h1>
						<div class="flex space-x-6 items-center mt-4">
							<p>Language :</p>
							<Dropdown v-model="game.roomSettigns.langue" :options="languages" placeholder="French" />
						</div>
						<table class="flex justify-around items-center mt-5">
							<h1>Words :</h1>
							<td v-for="value of chose_length" :key="chose_length.key" class="text-[1.05em]">
								<tr>
									{{
										value.name
									}}
								</tr>
								<tr class="flex justify-center mt-[2px]">
									<RadioButton :inputId="value.key" name="value" :value="value.name" v-model="game.roomSettigns.nbWords" />
								</tr>
							</td>
						</table>
						<div id="players" class="flex mx-4 mt-7">
							<button
								@click="game.roomSettigns.punctuation = false"
								:class="{ 'line-through': game.roomSettigns.punctuation == false, 'text-white': game.roomSettigns.punctuation == true }"
							>
								Punctuation
							</button>
							<button
								@click="game.roomSettigns.numbers = false"
								:class="{ 'line-through': game.roomSettigns.numbers == false, 'text-white': game.roomSettigns.numbers == true }"
							>
								Numbers
							</button>
						</div>
						<div class="flex justify-center mt-4">
							<Button v-if="rdy == true" id="btn_chat" label="UnReady" class="p-button-rounded p-button-info" @click="isReady()" />
							<Button v-else id="btn_chat" label="Ready" class="p-button-rounded p-button-help" @click="isReady()" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import GameVue from "./Game.vue"
	import ResultVue from "../Result.vue"
	import { useGameStore } from "../../store/game"
	import InputText from "primevue/inputtext"
	import Button from "primevue/button"
	import Dropdown from "primevue/dropdown"
	import RadioButton from "primevue/radiobutton"
	import Toast from "primevue/toast"
	import _ from "lodash"

	export default {
		setup() {
			const game = useGameStore()
			return { game }
		},
		data() {
			return {
				interval: null,
				seconds: null,
				rdy: false,
				msg: "",
				selectedLength: 0,
				chose_length: [
					{ name: 10, key: "10" },
					{ name: 25, key: "25" },
					{ name: 50, key: "50" },
					{ name: 100, key: "100" },
				],
				languages: ["French", "English", "JavaScript", "Python"],
				oldSettigns: [],
			}
		},
		components: {
			GameVue,
			ResultVue,
			InputText,
			Button,
			Dropdown,
			RadioButton,
			Toast,
		},
		methods: {
			isReady() {
				this.game.socket.emit("client-ready")
				this.rdy = !this.rdy
			},
			clock() {
				this.interval = setInterval(() => {
					this.seconds--
					if (this.seconds === 0) {
						clearInterval(this.interval)
						this.game.isRunning = true
						this.rdy = false
					}
				}, 1000)
			},
			kickPlayer(id) {
				this.game.socket.emit("ask-kick", id, this.game.room)
			},
			send_msg(val) {
				this.game.socket.emit("send-message", val)
				this.msg = ""
			},
			changeSettigns() {
				this.game.socket.emit("settings-changed", this.game.roomSettigns)
			},
		},
		created() {
			this.game.socket.on("game-ready", (val) => {
				this.game.words = val.wordlist
				this.game.letters = val.letters
				this.game.playerslist = val.players
				this.seconds = 3
				this.clock()
			})
			this.game.socket.on("playerslist-update", (val) => {
				const oldVal = Object.keys(this.game.playerslist)
				const newVal = Object.keys(val)
				if (newVal.length > oldVal.length) {
					const idx = Object.keys(val).length - 1
					this.$toast.add({ severity: "info", summary: "User Join", detail: Object.values(val)[idx].nickname + " Join the Room", life: 2000 })
				} else if (newVal.length < oldVal.length) {
					const difference = _.differenceWith(oldVal, newVal, _.isEqual)[0]
					const index = oldVal.findIndex((item) => item === difference)
					this.$toast.add({ severity: "error", summary: "User Left", detail: Object.values(this.game.playerslist)[index].nickname + " Left the Room", life: 2000 })
				} else {
				}
				this.game.playerslist = val
			})
			this.game.socket.on("got-kick", () => {
				this.game.kickedList.push(this.game.room)
				this.game.playerslist = []
				this.game.roomState = false
			})
			this.game.socket.on("message-update", (val) => {
				this.game.messages = val
			})
			this.game.socket.on("settings-update", (val) => {
				this.game.roomSettigns = val
			})
		},
		mounted() {
			this.oldSettigns = { ...this.game.roomSettigns }
		},
		watch: {
			"game.roomSettigns": {
				handler() {
					if (this.game.playerslist[this.game.socket.id].isAdmin == true) {
						this.game.socket.emit("settings-changed", this.game.roomSettigns)
						this.oldSettigns = { ...this.game.roomSettigns }
					}
				},
				deep: true,
			},
		},
	}
</script>
<style>
	#chat {
		width: 27vh;
		height: 56vh;
	}

	#chatContainer {
		height: 100%;
	}

	#input_chat,
	#btn_chat {
		font-size: 12px;
		height: 35px;
	}

	.ResultPannel {
		width: 74vh;
		height: 35vh;
	}

	.PlayerPanel {
		width: 34vh;
		height: 34vh;
	}

	#you {
		margin: 0;
	}

	#players {
		justify-content: space-between;
	}

	#players_container {
		height: 25vh;
	}
</style>
