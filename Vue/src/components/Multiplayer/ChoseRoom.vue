<template>
	<Dialog header="Set Nickname !" v-model:visible="display" :closable="false">
		<p class="italic">You need a nickname to join a room</p>
		<div class="flex items-center justify-center space-x-2 mt-2">
			<div>
				<span class="p-float-label">
					<InputText id="nickname" type="text" class="p-inputtext-sm" v-model="nickname" @keyup.enter=";(display = false), verifJoinRoom(roomName)" />
					<label for="nickname">Nickname :</label>
				</span>
			</div>
			<div>
				<Tag class="mr-2" value="Set Nickname" rounded @click=";(display = false), verifJoinRoom(roomName)"></Tag>
			</div>
		</div>
	</Dialog>
	<Dialog header="Warning" v-model:visible="displaykicked">
		<p class="italic">You can't join this room !</p>
	</Dialog>
	<div class="flex justify-center">
		<div id="InputContainer">
			<div class="m-4">
				<H1 class="flex items-start italic -mt-2">Public Room's list :</H1>
				<div v-for="(room, index) in pubRooms" :key="index" class="mt-2 flex space-x-4 justify-between items-center">
					<p>{{ room.language }}</p>
					<p>{{ room.id }}</p>
					<Knob v-model="room.players" :min="0" :max="10" readonly id="circle" />
					<div>
						<Button label="Join" @click="verifJoinRoom(room.id)" class="p-button-info p-button-sm p-button-rounded h-6" />
					</div>
				</div>
			</div>
		</div>
		<Divider layout="vertical" />
		<div id="InputContainer">
			<div class="m-4">
				<H1 class="flex items-start italic -mt-2">Create a Private Room :</H1>
				<div class="mt-3 flex justify-center items-center space-x-3">
					<button @click="isPublic = true" :class="{ 'line-through': isPublic == false, 'text-white': isPublic == true }">Public</button>
					<button @click="isPublic = false" :class="{ 'line-through': isPublic == true, 'text-white': isPublic == false }">Private</button>
					<Button label="Create" @click="CreateRoom()" class="p-button-secondary p-button-sm p-button-rounded h-6" />
				</div>
				<div class="mt-4">
					<H1 class="flex items-start italic">Join a Private Room :</H1>
					<div class="mt-2 flex justify-center items-center space-x-2 text-xs">
						<span class="p-float-label">
							<InputText id="room" type="text" class="p-inputtext-sm" v-model="roomName" @keyup.enter="verifJoinRoom(roomName)" />
							<label for="room">Room Code :</label>
						</span>
						<Button label="Join" @click="verifJoinRoom(roomName)" class="p-button-info p-button-sm p-button-rounded" />
					</div>
					<div class="flex items-center">
						<img src="../../assets/panda_typing.png" class="h-32" alt="" />
						<div class="text-xl flex-col text-center">
							<p>Have fun !</p>
							<span>🐼🐼</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import { useGameStore } from "../../store/game"
	import InputText from "primevue/inputtext"
	import Button from "primevue/button"
	import Tag from "primevue/tag"
	import Knob from "primevue/knob"
	import Dialog from "primevue/dialog"
	export default {
		setup() {
			const game = useGameStore()
			return { game }
		},
		data() {
			return {
				roomName: "",
				nickname: "",
				isPublic: true,
				display: false,
				displaykicked: false,
				pubRooms: [
					{
						id: "Room-fr",
						language: "French",
						players: 10,
					},
					{
						id: "Room-en",
						language: "English",
						players: 8,
					},
					{
						id: "Room-js",
						language: "JavaScript",
						players: 6,
					},
					{
						id: "Room-py",
						language: "Python",
						players: 6,
					},
				],
			}
		},
		components: {
			InputText,
			Button,
			Tag,
			Knob,
			Dialog,
		},
		methods: {
			CreateRoom() {
				const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
				const numbers = "0123456789"
				let randomString = ""
				for (let i = 0; i < 2; i++) {
					randomString += letters.charAt(Math.floor(Math.random() * letters.length))
				}
				for (var i = 0; i < 3; i++) {
					randomString += numbers.charAt(Math.floor(Math.random() * numbers.length))
				}
				this.verifJoinRoom(randomString)
			},
			verifJoinRoom(val) {
				this.game.room = val
				if (this.game.kickedList.includes(this.game.room)) {
					this.displaykicked = true
				} else {
					if (localStorage.nickname != undefined) {
						if (this.game.room == "") {
							alert("Please enter a room code")
						} else {
							this.Join()
						}
					} else if (this.nickname == "") {
						this.display = true
					} else {
						console.log(this.game.room)
						if (this.game.room == "") {
							alert("Please enter a room code")
						} else {
							this.Join()
						}
					}
				}
			},
			Join() {
				if (this.nickname != "") {
					this.game.nickname = this.nickname
					localStorage.nickname = this.game.nickname
				} else {
					this.game.nickname = localStorage.nickname
				}
				this.game.socket.emit("join-room", this.game.room, this.game.nickname)
				this.game.roomState = !this.game.roomState
			},
		},
		beforeDestroy() {
			t.disconnect()
		},
	}
</script>
<style>
	#circle > svg {
		height: 50px;
	}
</style>
