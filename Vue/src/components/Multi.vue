<template>
    <div class="flex-col justify-center border">
        <div>race</div>
        <div id="InputContainer" class="mt-2 flex justify-center h-64 overflow-hidden">
            <TyperVue />
        </div>
    </div>
</template>
<script>
import TyperVue from "./Typer.vue";
export default {
    data() {
        return {
            clicked: false
        }
    },
    components: {
        TyperVue,
    },

}
</script>
<style>
#InputContainer {
    background-color: #2c2e31;
    border-radius: 10px;
}
</style>