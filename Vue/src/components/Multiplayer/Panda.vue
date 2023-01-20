<template>
	<div class="mx-4 justify-center w-[65vh]">
		<div v-for="(player, index) in sortedPlayers" :key="index" class="mx-auto">
			<div v-if="player.isTyping == true" class="flex justify-center items-center h-20 relative" id="rank_div">
				<div class="flex-col">
					<p>{{ player.nickname }}</p>
					<p>{{ player.percentage }}%</p>
				</div>
				<img src="../../assets/panda.png" alt="" class="w-24 absolute" :style="{ left: player.panda + 'vh' }" />
				<p>wpm : {{ player.wpm }}</p>
			</div>
			<div v-else>Fini</div>
			<Divider type="dashed" id="noMargin" />
		</div>
		<div class="mb-2"></div>
	</div>
</template>
<script>
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
		computed: {
			sortedPlayers() {
				return Object.values(this.game.playerslist).sort((a, b) => b.wpm - a.wpm)
			},
		},
	}
</script>
<style></style>
