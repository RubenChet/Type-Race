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
            correct: this.game.words_state.filter(item => item === true).length,
            incorrect: this.game.words_state.filter(item => item === false).length,
            wpm: 0,
        }
    },
    methods: {
        toWPM() {
            const minutes = 0
            minutes = this.game.game_time / 60;
            // Calcule le nombre de mots par minute
            const wordsPerMinute = this.correct / minutes;
            // Retourne le résultat
            return wordsPerMinute;
        },
        next() {
            this.game.isFinished = !this.game.isFinished
            this.game.num_game++
        }
    },
    mounted() {
        // if (this.game.words_state) {
        //     this.wpm = this.toWPM()
        // }
    }
}
</script>