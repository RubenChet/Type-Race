<template>
    <div class="flex justify-center mt-10">
        <div id="MainBar" class="flex p-2">
            <div id="Mode" class="flex">
                <p @click="this.game.mode = 'solo'">Solo</p>
                <p @click="this.game.mode = 'multi'">Multiplayer</p>
            </div>
            <div id="Type" class="flex">
                <p>Time</p>
                <p>Words</p>
                <p>Custom</p>
            </div>
            <div id="Lenght" class="flex">
                <p>15</p>
                <p>30</p>
                <p>60</p>
                <p>120</p>
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
}
</script>
<style scoped>
#MainBar {
    background-color: #2C2E31;
    border-radius: 10px;
}
p{
    margin: 0 10px;
}
</style>