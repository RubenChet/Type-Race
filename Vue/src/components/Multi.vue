<template>
    <div class="flex-col">
        <div id="InputContainer" class="flex justify-center w-fit mx-auto">
            <div class="m-1">
                <div v-for="(player, index) in sortedPlayers" :key="index" class="flex justify-center">
                    <p>{{ player.nickname }}</p>
                    <p>{{ percentage(player.valid_list) }}</p>
                    <p>wpm : {{ player.wpm }}</p>
                </div>
            </div>

        </div>
        <div id="InputContainer" class="mt-10 flex justify-center h-64 overflow-hidden w-1/2 mx-auto">
            <MultiTyperVue />
        </div>
    </div>

</template>
<script>
import MultiTyperVue from "./MultiTyper.vue";
import { useGameStore } from '../store/game'
export default {
    setup() {
        const game = useGameStore()
        return { game }
    },
    data() {
        return {
            clicked: false
        }
    },
    components: {
        MultiTyperVue,
    },
    created() {
        this.game.socket.on('playerslist-update', (val) => {
            this.game.playerslist = val
        })
    },
    methods: {
        percentage(val) {
            if (val === undefined) {
                return 0+'%';
            }
            else{
                return ((val.length / this.game.words.length)*100).toFixed(0)+'%'
            }
        },
    },
    computed: {
        sortedPlayers() {
            return Object.values(this.game.playerslist).sort((a, b) => b.wpm - a.wpm)
        }
    },

}
</script>
<style>
#InputContainer {
    background-color: #2c2e31;
    border-radius: 10px;
}
</style>