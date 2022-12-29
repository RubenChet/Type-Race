<template>
    <div class="justify-center mt-20">
        <div v-if="!roomState" class="flex flex-row text-center">
            <input type="text" v-model="name" placeholder="Choisir un Pseudo" />
            <H1>Join a Public Room</H1>
            <div class="room-div">
                <input type="text" v-model="room" placeholder="Enter the RoomNumber" />
                <button @click="joinRoom(this.room)">Join</button>
            </div>
        </div>
        
        <div v-else>
            <WaitRoomVue />
        </div>
    </div>

</template>
<script>
import WaitRoomVue from "./WaitRoom.vue";
import io from 'socket.io-client';
import { useGameStore } from '../store/game'
export default {
    setup() {
        const game = useGameStore()
        return { game }
    },
    data() {
        return {
            roomState: false,
        }
    },
    components: {
        WaitRoomVue,
    },
    created() {
        this.game.socket = io('http://localhost:3000');
        this.game.socket.on('connect', () => { });
    },
    methods: {
        joinRoom(val) {
            this.game.socket.emit("join-room", val, callback => {})
            this.game.room = val
            this.roomState = !this.roomState
        }
    },
}
</script>
<style>

</style>