<template>
	<Dialog header="Change Nickname" v-model:visible="display" :closable="false">
		<p class="italic">You need a nickname to join a room !</p>
		<div class="flex items-center justify-center space-x-2 mt-2">
			<div>
				<span class="p-float-label">
					<InputText id="nickname" type="text" class="p-inputtext-sm" v-model="nickname" @keyup.enter=";(display = false), joinRoom()" />
					<label for="nickname">Nickname :</label>
				</span>
			</div>
			<div>
				<Tag class="mr-2" value="Set Nickname" rounded @click=";(display = false), joinRoom()"></Tag>
			</div>
		</div>
	</Dialog>
	<div class="flex justify-center mt-8">
		<div v-if="!game.roomState" class="flex justify-center">
			<div id="InputContainer">
				<div class="m-4">
					<H1 class="flex items-start italic -mt-2">Public Room's list :</H1>
					<div v-for="(room, index) in pubRooms" :key="index" class="mt-2 flex space-x-4 justify-between items-center">
						<p>{{ room.language }}</p>
						<p>{{ room.id }}</p>
						<Knob v-model="room.players" :min="0" :max="10" readonly id="circle" />
						<div>
							<Button label="Join" @click=";(game.room = room.id), joinRoom()" class="p-button-info p-button-sm p-button-rounded h-6" />
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
						<Button label="Create" @click="joinRoom()" class="p-button-secondary p-button-sm p-button-rounded h-6" />
					</div>
					<div class="mt-4">
						<H1 class="flex items-start italic">Join a Private Room :</H1>
						<div class="mt-2 flex justify-center items-center space-x-2 text-xs">
							<span class="p-float-label">
								<InputText id="room" type="text" class="p-inputtext-sm" v-model="game.room" @keyup.enter="joinRoom()" />
								<label for="room">Room Code :</label>
							</span>
							<Button label="Join" @click="joinRoom()" class="p-button-info p-button-sm p-button-rounded" />
						</div>
					</div>
				</div>
			</div>
		</div>
		<WaitRoomVue v-else />
	</div>
</template>
<script>
	import WaitRoomVue from "./WaitRoom.vue"
	import io from "socket.io-client"
	import { useGameStore } from "../store/game"
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
				roomType: "",
				nickname: "",
				isPublic: true,
				display: false,
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
			WaitRoomVue,
			InputText,
			Button,
			Tag,
			Knob,
			Dialog,
		},
		mounted() {
			this.game.nickname = localStorage.nickname
		},
		created() {
			this.game.socket = io("http://localhost:3000")
			this.game.socket.on("connect", () => {})
		},
		methods: {
			joinRoom() {
				if (localStorage.nickname != undefined) {
					this.chgNameJoin()
				} else if (this.nickname == "") {
					this.display = true
				} else if (this.game.room == "") {
					alert("Please enter a room code")
				} else {
					this.chgNameJoin()
				}
			},
			chgNameJoin() {
				this.game.nickname = this.nickname
				localStorage.nickname = this.game.nickname
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
