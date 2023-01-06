<template>
    <div class="flex-col m-8 w-full">
        <h1 class="text-center">Logo</h1>
        <div class="flex mt-4">
            <div class="flex-col overflow-auto border">
                <div v-for="(player, index) in sortedPlayers" :key="index">
                    <div class="flex space-x-8"
                        v-bind:class="{ 'text-amber-300': player.rank === 1, 'text-neutral-100': player.rank === 2, 'text-amber-300': index + 1 === 3 }">
                        <p>{{ index + 1 }}-</p>
                        <p>{{ player.nickname }}</p>
                        <p>WPM : {{ player.wpm }}</p>
                        <p>Time : {{ player.chrono }}</p>
                    </div>
                </div>
            </div>
            <Divider layout="vertical" />
            <div class="mx-auto flex-col">
                <h1>graph</h1>
                <div class="flex justify-center">
                    <p>replay</p>
                    <p>Screenshot</p>
                </div>
            </div>
        </div>
        <div class="mt-4">
            Input History :
            <div class="flex flex-wrap justify-center space-x-2 mx-auto">
                <p v-for="(words, index) in game.words" :key="index">
                    {{ words }}
                </p>
            </div>
        </div>
    </div>

</template>
<script>
import { useGameStore } from '../store/game'
export default {
    setup() {
        const game = useGameStore()
        return { game }
    },
    data() {
        return {
            wpm: 0,
        }
    },
    methods: {
        toWpm(val) {
            if (val === undefined) {
                return 0;
            }
            else {
                return (val.filter(item => item == true).length / (this.game.game_time / 60)).toFixed(0)
            }

        }
    },
    computed: {
        sortedPlayers() {
            return Object.values(this.game.playerslist).sort((a, b) => b.wpm - a.wpm)
        }
    },
}
</script>