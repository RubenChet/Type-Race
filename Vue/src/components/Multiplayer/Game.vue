<template>
	<div class="flex-col w-3/5 mx-auto">
		<div id="InputContainer" class="flex justify-center w-fit mx-auto">
			<PandaVue />
		</div>
		<TryTyperVue />
	</div>
</template>
<script>
	import TryTyperVue from "./TryType.vue"
	import PandaVue from "./Panda.vue"
	import { useGameStore } from "../../store/game"
	export default {
		setup() {
			const game = useGameStore()
			return { game }
		},
		components: {
			TryTyperVue,
			PandaVue,
		},
		created() {
			this.game.socket.on("playerslist-update", (val) => {
				this.game.playerslist = val
			})
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
	#noMargin {
		margin: 0;
		margin-top: 2px;
	}
</style>
