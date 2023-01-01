<template>
    <div class="flex-col">
        <h1>Logo</h1>
        <div v-for="(player, index) in sortedPlayers" :key="index" class="flex">
            <p>{{ player.nickname }}</p>
            <p>WPM : {{ player.wpm }}</p>
            <p>Time : {{ player.chrono }}</p>
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