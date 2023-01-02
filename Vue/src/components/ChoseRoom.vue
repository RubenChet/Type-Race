<template>
    <div class="flex justify-center mt-20">
        <div v-if="!roomState" class="flex flex-col text-center">
            <input type="text" v-model="nickname" placeholder="Choose a nickname" />
            <div>
                <input type="text" v-model="game.room" placeholder="Enter the RoomTag" />
                <button @click="joinRoom(game.room)">Join</button>
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
            roomType: "",
            nickname: "",
        }
    },
    components: {
        WaitRoomVue,
    },
    mounted() {

    },
    created() {

    },
    methods: {
        joinRoom() {
            this.game.socket = io('http://localhost:3000');
            this.game.socket.on('connect', () => { });
            this.game.socket.emit("join-room", this.game.room, this.nickname, callback => {
                this.game.playerslist = callback
            })
            this.roomState = !this.roomState
        },
    },
    beforeDestroy() {
        this.game.socket.disconnect()
    },
}
</script>
<style>

</style>