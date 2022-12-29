<template>
    <div class="flex justify-center mt-40">
        <div class="flex-row w-full">
            <div class="flex justify-center">Français</div>
            <div class="flex justify-center">
                <div class="flex flex-col w-1/2">
                    <div class="ml-8">
                        <TimerVue />
                    </div>
                    <div id="InputContainer" class="mt-2 flex justify-center h-64 overflow-hidden">
                        <TyperVue />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import TyperVue from "./Typer.vue";
import TimerVue from "./Timer.vue";
import { useGameStore } from "../store/game";
import scriptFile from "../scripts/words";

export default {
    setup() {
        const game = useGameStore();
        return { game };
    },
    components: {
        TyperVue,
        TimerVue,
    },
    created() {
        this.game.words = scriptFile.makeWordsList();
        this.game.letters = scriptFile.makeColors(this.game.words)
    },
};
</script>
<style scoped>
#InputContainer {
    background-color: #2c2e31;
    border-radius: 10px;
}
</style>
