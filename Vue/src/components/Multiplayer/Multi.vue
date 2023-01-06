<template>
    <div class="flex-col w-3/5 mx-auto">
        <div id="InputContainer" class="flex justify-center w-fit mx-auto">
            <div class="mx-4">
                <div v-for="(player, index) in sortedPlayers" :key="index" class=" w-96">
                    <div class="flex justify-center" id="rank_div">
                        <p>{{ player.nickname }}</p>
                        <p>{{ percentage(player.valid_list) }}</p>
                        <p>wpm : {{ player.wpm }}</p>
                    </div>
                    <Divider type="dashed" id="noMargin" />
                </div>
                <div class="mb-2"></div>
            </div>

        </div>
        <div id="InputContainer" class="mt-10 flex justify-center overflow-hidden mx-auto">
            <!-- <MultiTyperVue /> -->
            <TryTyperVue />
        </div>
    </div>

</template>
<script>
import MultiTyperVue from "./MultiTyper.vue";
import TryTyperVue from "./TryType.vue";
import { useGameStore } from '../../store/game'
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
        TryTyperVue,
    },
    created() {
        this.game.socket.on('playerslist-update', (val) => {
            this.game.playerslist = val
        })
    },
    methods: {
        percentage(val) {
            if (val === undefined) {
                return 0 + '%';
            }
            else {
                return ((val.length / this.game.words.length) * 100).toFixed(0) + '%'
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

#rank_div {
    justify-content: space-between;
}
#noMargin{
    margin: 0;
    margin-top: 2px;
}
</style>