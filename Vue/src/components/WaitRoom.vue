<template>
    <div v-if="clicked && seconds > 0">{{ seconds }}</div>
    <div v-else-if="game.isRunning == true">
        <MultiVue />
    </div>
    <div id="WaitRoom" v-else class="flex justify-center space-x-48">
        <div id="InputContainer">Chat</div>
        <div>
            <div id="InputContainer" class="flex justify-center">
                <ResultVue />
            </div>
            <div class="flex place-content-around mt-5">
                <div id="InputContainer" class="flex">
                    <div class="flex-col">
                        <div v-for="(player, index) in game.playerslist" :key="index" class="flex">
                            <p>{{ player.nickname }}</p>
                            <p v-if="player.isTyping == true" class="text-blue-500">Is Typing</p>
                            <p v-else-if="player.isReady == false" class="text-red-500">Not Ready</p>
                            <p v-if="player.isReady == true" class="text-green-500">Is Ready</p>
                            <p  v-if="game.socket.id != player.id" @click="kickPlayer(player.id)">Kick</p>
                        </div>
                    </div>
                </div>

                <button @click="isReady(), clicked = !clicked"
                    v-bind:class="{ 'text-red-500': !clicked, 'text-green-500': clicked }">Ready</button>
            </div>

        </div>

    </div>

</template>
<script>
import MultiVue from "./Multi.vue";
import ResultVue from './Result.vue'
import { useGameStore } from '../store/game'
export default {
    setup() {
        const game = useGameStore()
        return { game }
    },
    data() {
        return {
            clicked: false,
            interval: null,
            seconds: null,
        }
    },
    components: {
        MultiVue,
        ResultVue,
    },
    methods: {
        isReady() {
            this.game.socket.emit("client-ready")
        },
        clock() {
            this.interval = setInterval(() => {
                this.seconds--;
                if (this.seconds === 0) {
                    clearInterval(this.interval);
                    this.game.isRunning = true
                    this.clicked = false
                }
            }, 1000);
        },
        kickPlayer(val) {
            this.game.socket.emit("ask-kick", val)
        }
    },
    created() {
        this.game.socket.on('game-ready', (val) => {
            this.game.words = val.wordlist
            this.game.letters = val.letters
            this.seconds = 3
            this.clock()
        })
        this.game.socket.on('playerslist-update', (val) => {
            this.game.playerslist = val
        })
        this.game.socket.on('got-kick', () => {
            alert("This is an alert dialog box");
        })
    },
}
</script>
<style>

</style>