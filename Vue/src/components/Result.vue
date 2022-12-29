<template>
    <h1>Logo</h1>
    <div class="flex items-center justify-between">
        <span>WPM : {{ wpm }}</span>
        <div class="flex flex-col">
            <span>Correct Words: {{ correct }}</span>
            <span>Incorrect Words: {{ incorrect }}</span>
        </div>
    </div>
    <div class="flex justify-around">
        <span>retry</span>
        <span @click="next()">next</span>
        <span>replay</span>
    </div>
</template>
<script>
import { useGameStore } from '../store/game'
import scriptFile from '../scripts/words'
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
            test: this.game.num_game
        }
    },
    methods: {
        toWPM() {
            const minutes = this.game.game_time / 60;
            // Calcule le nombre de mots par minute
            const wordsPerMinute = this.correct / minutes;
            // Retourne le résultat
            return wordsPerMinute;
        },
        next(){
            this.game.isFinished = !this.game.isFinished
            this.game.num_game ++
        }
    },
    mounted(){
        this.wpm = this.toWPM()
    }
}
</script>