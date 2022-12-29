<template>
    <div class="flex justify-center mt-20 ">
        <div id="WaitRoom" v-if="!countdown">
            <button @click="isReady(game.room), clicked = !clicked"
                v-bind:class="{ 'text-red-500': !clicked, 'text-green-500': clicked }">Ready</button>
        </div>
        <div v-else-if="countdown && seconds > 0">{{ seconds }}</div>
        <div v-else-if="seconds == 0">
            <MultiVue class="flex w-1/2" />
        </div>
    </div>
</template>
<script>
import MultiVue from "./Multi.vue";
import { useGameStore } from '../store/game'
export default {
    setup() {
        const game = useGameStore()
        return { game }
    },
    data() {
        return {
            clicked: false,
            countdown: false,
            interval: null,
            seconds: 3,
        }
    },
    components: {
        MultiVue,
    },
    methods: {
        isReady(val) {
            this.game.socket.emit("client-ready", val, callback => {
                console.log(callback)
            })
        },
        clock() {
            this.interval = setInterval(() => {
                this.seconds--;
                if (this.seconds === 0) {
                    clearInterval(this.interval);
                }
            }, 1000);
        }
    },
    created() {
        this.game.socket.on('game-ready', (val) => {
            this.game.words = val.wordlist
            // this.game.letters = val.letters
            this.countdown = true
            this.clock()
        })
    },
}
</script>
<style>

</style>