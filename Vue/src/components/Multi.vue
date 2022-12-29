<template>
    <div class="flex-col">
        <div id="InputContainer" class="flex justify-center h-28 overflow-hidden w-4/12 mx-auto">
            first thing
        </div>
        <div id="InputContainer" class="mt-10 flex justify-center h-64 overflow-hidden w-1/2 mx-auto">
            <MultiTyperVue />
        </div>
    </div>

</template>
<script>
import MultiTyperVue from "./MultiTyper.vue";
export default {
    data() {
        return {
            clicked: false
        }
    },
    components: {
        MultiTyperVue,
    },

}
</script>
<style>
#InputContainer {
    background-color: #2c2e31;
    border-radius: 10px;
}
</style>