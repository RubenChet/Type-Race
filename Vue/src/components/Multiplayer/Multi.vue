<template>
	<div class="flex-col w-3/5 mx-auto">
		<div id="InputContainer" class="flex justify-center w-fit mx-auto">
			<div class="mx-4 justify-center w-[65vh]">
				<div v-for="(player, index) in sortedPlayers" :key="index" class="mx-auto">
					<div class="flex justify-center items-center h-20 relative" id="rank_div">
						<div class="flex-col">
							<p>{{ player.nickname }}</p>
							<p>{{ (player.percentage, test(player)) }}</p>
						</div>
						<img src="../../assets/panda.png" alt="" class="w-24 absolute" :style="{ left: player.panda + 'vh' }" />
						<p>wpm : {{ player.wpm }}</p>
					</div>
					<Divider type="dashed" id="noMargin" />
				</div>
				<div class="mb-2"></div>
			</div>
		</div>
		<TryTyperVue />
	</div>
</template>
<script>
	import MultiTyperVue from "./MultiTyper.vue"
	import TryTyperVue from "./TryType.vue"
	import { useGameStore } from "../../store/game"
	export default {
		setup() {
			const game = useGameStore()
			return { game }
		},
		data() {
			return {
				clicked: false,
			}
		},
		components: {
			MultiTyperVue,
			TryTyperVue,
		},
		created() {
			this.game.socket.on("playerslist-update", (val) => {
				this.game.playerslist = val
			})
		},
		methods: {
			test(val) {
				console.log(typeof val.panda)
				console.log(val.panda)
			},
		},
		computed: {
			sortedPlayers() {
				return Object.values(this.game.playerslist).sort((a, b) => b.wpm - a.wpm)
			},
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
