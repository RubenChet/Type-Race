<template>
	<div class="flex-col m-8 w-full">
		<div class="flex items-center justify-center -mt-4">
			<img src="../assets/logo.png" alt="" class="w-12" />
			<h1>TypeZone</h1>
		</div>
		<div class="flex mt-4">
			<div class="flex-col overflow-auto">
				<div v-for="(player, index) in sortedPlayers" :key="index">
					<div
						class="flex space-x-8 items-center"
						v-bind:class="{ 'text-amber-300': player.rank === 1, 'text-neutral-100': player.rank === 2, 'text-[#CD7F32]': player.rank === 3 }"
					>
						<p v-if="player.isTyping == false && player.rank != 0">{{ player.rank }}-</p>
						<div class="flex-col text-center">
							<p>{{ player.nickname }}</p>
							<p v-if="player.isTyping == true" class="text-blue-500 text-[10px]">Typing ...</p>
						</div>
						<p>WPM : {{ player.wpm }}</p>
						<p>Time : {{ player.chrono }}</p>
					</div>
				</div>
			</div>
			<Divider layout="vertical" />
			<div class="mx-auto flex-col">
				<h1>graph</h1>
				<div class="flex justify-center items-center space-x-10">
					<i class="pi pi-replay"></i>
					<i class="pi pi-images"></i>
				</div>
			</div>
		</div>
		<div v-if="players_active == 0 || showInput == true" class="mt-4">
			Input History :
			<div class="flex flex-wrap justify-center space-x-2 mx-auto">
				<p v-for="(words, index) in game.words" :key="index">
					{{ words }}
				</p>
			</div>
		</div>
		<div class="h-[13vh] overflow-auto" v-else>
			<div class="mx-4 justify-center">
				<div v-for="(player, index) in sortedPanda" :key="index" class="mx-auto">
					<div v-if="player.isTyping == true" class="flex justify-center items-center h-20 relative" id="rank_div">
						<div class="flex-col">
							<p>{{ player.nickname }}</p>
							<p>{{ player.percentage }}%</p>
						</div>
						<img src="../assets/panda.png" alt="" class="w-24 absolute" :style="{ left: player.panda + 'vh' }" />
						<p>wpm : {{ player.wpm }}</p>
					</div>
					<div v-else>Fini</div>
					<Divider type="dashed" id="noMargin" />
				</div>
				<div class="mb-2"></div>
			</div>
		</div>
	</div>
</template>
<script>
	import { useGameStore } from "../store/game"
	import PandaVue from "./Multiplayer/Panda.vue"
	export default {
		setup() {
			const game = useGameStore()
			return { game }
		},
		data() {
			return {
				players_active: 0,
				showInput: false,
			}
		},
		components: {
			PandaVue,
		},
		methods: {
			toWpm(val) {
				if (val === undefined) {
					return 0
				} else {
					return (val.filter((item) => item == true).length / (this.game.game_time / 60)).toFixed(0)
				}
			},
		},
		computed: {
			sortedPlayers() {
				return Object.values(this.game.playerslist).sort((a, b) => b.wpm - a.wpm)
			},
			sortedPanda() {
				return Object.values(this.game.playerslist).filter((player) => player.isTyping == true)
			},
		},
		watch: {
			"game.playerslist": {
				handler() {
					this.players_active = Object.values(this.game.playerslist).filter((player) => player.isTyping == true).length
				},
				deep: true,
			},
		},
	}
</script>
