<template>
    <h1>Logo</h1>
    <div class="flex items-center justify-between">
        <span>WPM : {{ wpm }}</span>
        <div class="flex flex-col">
            <span>Correct Words: {{ correct }}</span>
            <span>Incorrect Words: {{ incorrect }}</span>
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
            correct: this.game.words_state.filter(item => item == true).length,
            incorrect: this.game.words_state.filter(item => item == false).length,
            wpm: 0,
        }
    },
    mounted() {
        if (this.game.words_state.length) {
            this.wpm = (this.correct / (this.game.game_time / 60)).toFixed(0)
        }
    }
}
</script>