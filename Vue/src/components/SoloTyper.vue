<template>
    <div class="flex justify-center flex-wrap m-7 overflow-hidden w-full">
        <div v-if="game.isFinished == true" class="text-center justify-center w-2/3">
            <ResultVue />
        </div>
        <div v-else v-for="(word, index) in game.words" :key="index" class="flex mr-2"
            v-bind:class="{ 'active': index === word_index, 'underline decoration-red-500': game.letters[index].includes('red') && spacePressed[index] }">
            <p v-for="(letter, idx) in word" :key="idx"
                v-bind:class="{ 'cursor': idx === currentLetter, 'aimer': idx === word.length - 1 && idx === currentLetter - 1 }"
                :style="{ color: game.letters[index][idx] }">
                {{ letter }}
            </p>
        </div>
    </div>
</template>
  
<style scoped>
p {
    font-size: 1.2em;
    /* border: 1px solid transparent; */

}

.active::before {
    content: "";
    animation: blink 2s 0.2s infinite;
    /* border-left: 1px solid white; */
    position: absolute;
}

.active>.cursor::before,
.active>.aimer::after {
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
  
<script>
import ResultVue from './Result.vue'
import { useGameStore } from '../store/game'
import scriptFile from '../scripts/words'
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
            spacePressed: [],
        };
    },
    components: {
        ResultVue,
    },
    methods: {
        typing_test(e) {
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
                            this.spacePressed.pop()
                        }
                    }
                }
                else {
                    this.game.words[this.word_index] = this.game.words[this.word_index].substring(0, this.game.words[this.word_index].length - 1);
                    this.currentLetter--
                    this.game.letters[this.word_index].pop()
                }
            }
            else {
                window.addEventListener("keypress", this.letter_listener)

            }
        },
        letter_listener(elem) {
            const typedLetter = elem.key;
            const displayedLetter = this.game.words[this.word_index][this.currentLetter];
            // On vérifie si la bonne lettre à été tapé
            if (this.currentLetter >= this.words_list_copy[this.word_index].length) {
                if (typedLetter === " ") {
                    this.spacePressed.push(true);
                    this.word_is_valid.push(this.check_letter_value(this.game.letters[this.word_index], this.word_index))
                    this.word_index++;
                    this.currentLetter = 0;
                }
                else {
                    this.game.letters[this.word_index].push("red")
                    this.game.words[this.word_index] += typedLetter
                    this.currentLetter++
                }

            } else {
                if (typedLetter === displayedLetter) {
                    this.game.letters[this.word_index][this.currentLetter] = "white";
                    this.currentLetter++;
                }
                else {
                    this.game.letters[this.word_index][this.currentLetter] = "red";
                    this.currentLetter++;
                }
            }
            if (this.word_index + 1 == this.game.words.length && this.currentLetter == this.game.words[this.word_index].length) {
                this.game.isFinished = true
            }
            window.removeEventListener("keypress", this.letter_listener)
        },
        check_letter_value(arr, idx) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] !== 'white') {
                    return false;
                }
            }
            if (arr.length == this.words_list_copy[idx].length) {
                return true;
            } else {
                return false
            }

        },
    },
    created() {
        this.game.letters = this.game.letters
        this.words_list_copy = this.game.words.slice()
    },
    mounted() {
        window.addEventListener('keydown', this.typing_test)
    },
    unmounted() {
        window.removeEventListener('keydown', this.typing_test)
    },
    watch: {
        'game.isFinished': function (val) {
            if (val == true) {
                window.removeEventListener('keydown', this.typing_test)
                this.game.words_state = this.word_is_valid
            }
        },
        'game.num_game': function () {
            this.game.words = scriptFile.makeWordsList();
            this.game.timer = this.game.game_time
            this.currentLetter = 0
            this.word_index = 0
            this.game.letters = []
            this.words_list_copy = []
            this.word_is_valid = []
            this.spacePressed = []
            this.game.letters = scriptFile.makeColors(this.game.words)
            this.words_list_copy = this.game.words.slice()
            window.addEventListener('keydown', this.typing_test)
        },
    }
};
</script>

  