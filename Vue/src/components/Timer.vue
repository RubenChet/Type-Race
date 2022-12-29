<template>
    <div>{{ this.game.timer }}</div>
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
            minutes: 0,
            interval: null,
            isRunning: false // Ajout de la variable booléenne
        }
    },
    methods: {
        clock(e) {
            if (!this.isRunning) {
                this.interval = setInterval(() => {
                    if (this.game.timer > 0) {
                        this.game.timer--
                    } else if (this.minutes > 0) {
                        this.minutes--
                        this.game.timer = 59
                    } else {
                        clearInterval(this.interval)
                        this.game.isFinished = !this.game.isFinished
                    }
                }, 1000)
                this.isRunning = true // Mise à jour de la variable booléenne
            }
        }
    },
    mounted() {
        this.game.timer = this.game.game_time
        window.addEventListener("keypress", this.clock)
    },
    watch: {
        'game.isFinished': function (val) {
            if (val == true) {
                window.removeEventListener('keypress', this.clock)
                this.isRunning = false
            } else {
                this.game.timer = this.game.game_time
                window.addEventListener('keypress', this.clock)
            }

        }

    }
}
</script>