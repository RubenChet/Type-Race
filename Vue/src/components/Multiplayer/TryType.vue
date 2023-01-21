<template>
	<div class="mt-10">
		<H1 class="ml-5">{{ word_index }}/{{ words_list_copy.length }}</H1>
		<div id="InputContainer" class="mt-2 flex justify-center overflow-hidden mx-auto">
			<div class="flex justify-center flex-wrap m-7 overflow-hidden w-full h-14" ref="flexWrapContainer">
				<div v-for="(word, index) in game.words" :key="index" class="flex mr-2" v-bind:class="{ hidden: index < minIdx }">
					<p
						v-for="(letter, idx) in word"
						:key="idx"
						v-bind:class="{
							cursor: idx === currentLetter && index === word_index,
							underline: idx === currentLetter && index === word_index && caretTyped == true,
							cursor_next: idx === word.length - 1 && idx === currentLetter - 1 && index === word_index,
						}"
						:style="{ color: game.letters[index][idx] }"
					>
					{{ letter }}
				</p>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import { useGameStore } from "../../store/game"
	import "animate.css"
	export default {
		setup() {
			const game = useGameStore()
			return { game }
		},
		data() {
			return {
				currentLetter: 0,
				word_index: 0,
				words_list_copy: [],
				word_is_valid: [],
				caretTyped: false,
				interval: null,
				underlineRed: false,
				elementCountsFRow: 0,
				minIdx: 0,
				maxIdx: 0,
				elemIndex: 0,
			}
		},
		methods: {
			typing_test(e) {
				if (this.word_index == this.elementCountsFRow && this.currentLetter == 0) {
					this.Check_elements()
				}
				this.caretTyped = false
				if (e.key === "Backspace") {
					// Supprime le dernier caractère de la chaîne de caractères
					if (this.game.words[this.word_index] === this.words_list_copy[this.word_index]) {
						if (this.currentLetter > 0) {
							this.currentLetter--
							this.game.letters[this.word_index][this.currentLetter] = "#646669"
						}
						if (this.word_index > 0) {
							if (this.word_is_valid[this.word_index - 1] == false && this.currentLetter == 0) {
								this.word_index--
								this.currentLetter = this.game.words[this.word_index].length
								this.word_is_valid.pop()
							}
						}
					} else {
						this.game.words[this.word_index] = this.game.words[this.word_index].substring(0, this.game.words[this.word_index].length - 1)
						this.currentLetter--
						this.game.letters[this.word_index].pop()
					}
				} else if (e.key == "Dead") {
					this.caretTyped = true
				} else {
					window.addEventListener("keypress", this.letter_listener)
				}
			},
			letter_listener(elem) {
				const typedLetter = elem.key
				const displayedLetter = this.game.words[this.word_index][this.currentLetter]
				// On vérifie si la bonne lettre à été tapé
				if (typedLetter == "Delete") {
					this.currentLetter = 0
					this.game.words[this.word_index] = this.words_list_copy[this.word_index]
					this.game.letters[this.word_index].splice(3)
					this.game.letters[this.word_index].fill("#646669")
				} else if (this.currentLetter >= this.words_list_copy[this.word_index].length) {
					if (typedLetter === " ") {
						const w_status = this.check_letter_value(this.game.letters[this.word_index], this.word_index)
						if (w_status == true) {
							this.word_is_valid.push(w_status)
							this.word_index++
							this.elemCount++
							this.currentLetter = 0
							this.game.socket.emit("client-wordstate", this.word_is_valid, this.game.game_time)
						}
					} else {
						this.game.letters[this.word_index].push("red")
						this.game.words[this.word_index] += typedLetter
						this.currentLetter++
					}
				} else {
					if (typedLetter === displayedLetter) {
						this.game.letters[this.word_index][this.currentLetter] = "white"
						this.currentLetter++
					} else {
						if (typedLetter == " ") {
							// this.underlineRed = true
						} else {
							this.game.letters[this.word_index][this.currentLetter] = "red"
							this.currentLetter++
						}
					}
				}
				window.removeEventListener("keypress", this.letter_listener)
				if (
					this.word_index + 1 == this.game.words.length &&
					this.currentLetter == this.words_list_copy[this.word_index].length &&
					this.game.letters[this.word_index].includes("red") == false
				) {
					this.word_is_valid.push(true)
					this.game.socket.emit("client-wordstate", this.word_is_valid, this.game.game_time)
					this.game.socket.emit("client-finish", this.word_is_valid, this.game.game_time)
					this.game.isRunning = false
				}
			},
			check_letter_value(arr, idx) {
				for (let i = 0; i < arr.length; i++) {
					if (arr[i] !== "white") {
						return false
					}
				}
				if (arr.length == this.words_list_copy[idx].length) {
					return true
				} else {
					return false
				}
			},
			clock() {
				this.game.game_time = 0
				this.interval = setInterval(() => {
					this.game.game_time+=0.01
					if (this.game.isRunning == false) {
						clearInterval(this.interval)
					}
				}, 10)
			},
			Check_elements() {
				const parent = this.$refs.flexWrapContainer // recupère les caractèristiques de l'élement contenant la liste de mots
				const children = parent.children

				let currentRowWidth = 0
				let rows = 0

				this.minIdx = this.elementCountsFRow
				this.elemIndex = this.elementCountsFRow
				while (rows < 2) {
					//On calcule la largeur de la ligne
					if (children[this.elemIndex]) {
						const marginRight = parseInt(window.getComputedStyle(children[this.elemIndex]).marginRight)
						const marginLeft = parseInt(window.getComputedStyle(children[this.elemIndex]).marginLeft)
						currentRowWidth += children[this.elemIndex].offsetWidth + marginRight + marginLeft
					} else {
						break
					}

					if (currentRowWidth > parent.offsetWidth) {
						this.elemIndex - 1
						if (rows == 0) {
							this.elementCountsFRow = this.elemIndex
						}
						currentRowWidth = 0
						rows++
					} else if (currentRowWidth == parent.offsetWidth) {
						this.elemIndex - 1
						if (rows == 0) {
							this.elementCountsFRow = this.elemIndex
						}
						currentRowWidth = 0
						rows++
					} else {
						this.elemIndex++
					}
				}
				this.maxIdx = this.elemIndex - 1
			},
		},
		created() {
			this.words_list_copy = this.game.words.slice()

			this.game.socket.on("game-finished", () => {
				window.removeEventListener("keydown", this.typing_test)
				this.game.words_state = this.word_is_valid
			})
		},
		mounted() {
			this.minIdx = 0
			this.maxIdx = 0
			window.addEventListener("keydown", this.typing_test)
			this.clock()
			this.Check_elements()
		},
		unmounted() {
			window.removeEventListener("keydown", this.typing_test)
		},
	}
</script>
<style scoped>
	p {
		font-size: 1.2em;
		/* border: 1px solid transparent; */
	}

	.cursor::before,
	.cursor_next::after {
		content: "|";
		animation: blink 1s 0.6s infinite;
		color: white;
		position: absolute;
		margin-left: -3px;
		margin-top: -1px;
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
</style>
