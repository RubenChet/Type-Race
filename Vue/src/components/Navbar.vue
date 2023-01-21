<template>
    <div class="flex justify-center mt-10 items-center space-x-20">
        <div id="MainBar" class="flex p-2">
            <div id="Mode" class="flex">
                <p class="cursor-pointer">Solo</p>
                <p class="cursor-pointer" @click="game.mode = 'multi'" :class="{ 'text-white': game.mode === 'multi' }">Multiplayer</p>
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