<template>
	<Dialog header="Change Nickname" v-model:visible="display" :closable="false">
		<div class="flex items-center justify-center space-x-2 mt-2">
			<div>
				<span class="p-float-label">
					<InputText id="nickname" type="text" class="p-inputtext-sm" v-model="nickname" @keyup.enter=";(display = false), joinRoom()" />
					<label for="nickname">Nickname :</label>
				</span>
			</div>
			<div>
				<Tag class="mr-2" value="Change" rounded @click=";(display = false), joinRoom()"></Tag>
			</div>
		</div>
	</Dialog>
	<div class="flex justify-center mt-14">
		<ChoseRoomVue v-if="!game.roomState" />
		<WaitRoomVue v-else />
	</div>
	<Dialog header="Warning" v-model:visible="displaykicked">
		<p class="italic">You got kicked from this room !</p>
	</Dialog>
</template>
<script>
	import io from "socket.io-client"
	import { useGameStore } from "../../store/game"
	import WaitRoomVue from "./WaitRoom.vue"
	import ChoseRoomVue from "./ChoseRoom.vue"
	import Dialog from "primevue/dialog"
	export default {
		setup() {
			const game = useGameStore()
			return { game }
		},
		data() {
			return {
				display: false,
				displaykicked: false,
			}
		},
		components: {
			WaitRoomVue,
			ChoseRoomVue,
			Dialog,
		},
		mounted() {
			this.game.nickname = localStorage.nickname
		},
		created() {
			this.game.socket = io("http://localhost:3000")
			this.game.socket.on("connect", () => {})
		},
		watch: {
			"game.kickedList": {
				// This will let Vue know to look inside the array
				deep: true,
				// We have to move our method to a handler field
				handler() {
					this.displaykicked = true
				},
			},
		},
	}
</script>
