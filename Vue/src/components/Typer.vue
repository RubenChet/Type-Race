<template>
    <div class="flex justify-center flex-wrap m-7 overflow-hidden w-full">
        <div v-if="game.isFinished == true" class="text-center justify-center w-2/3">
            <ResultVue />
        </div>
        <div v-else v-for="(word, index) in game.words" :key="index" class="flex mr-2"
            v-bind:class="{ 'active': index === wordIdx, 'underline decoration-red-500': letterColors[index].includes('red') && spacePressed[index] }">
            <p v-for="(letter, idx) in word" :key="idx"
                v-bind:class="{ 'cursor': idx === currentLetter, 'aimer': idx === word.length - 1 && idx === currentLetter - 1 }"
                :style="{ color: letterColors[index][idx] }">
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
            wordIdx: 0,
            letterColors: [],
            validate: [],
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
                if (this.game.words[this.wordIdx] === this.validate[this.wordIdx]) {
                    if (this.currentLetter > 0) {
                        this.currentLetter--
                        this.letterColors[this.wordIdx][this.currentLetter] = "#646669"
                    }
                    if (this.wordIdx > 0) {
                        if (this.word_is_valid[this.wordIdx - 1] == false && this.currentLetter == 0) {
                            this.wordIdx--
                            this.currentLetter = this.game.words[this.wordIdx].length
                            this.word_is_valid.pop()
                            this.spacePressed.pop()
                        }
                    }
                }
                else {
                    this.game.words[this.wordIdx] = this.game.words[this.wordIdx].substring(0, this.game.words[this.wordIdx].length - 1);
                    this.currentLetter--
                    this.letterColors[this.wordIdx].pop()
                }
            }
            else {
                window.addEventListener("keypress", this.letter_listener)

            }
        },
        letter_listener(elem) {
            const typedLetter = elem.key;
            const displayedLetter = this.game.words[this.wordIdx][this.currentLetter];
            // On vérifie si la bonne lettre à été tapé
            if (this.currentLetter >= this.validate[this.wordIdx].length) {
                if (typedLetter === " ") {
                    this.spacePressed.push(true);
                    this.word_is_valid.push(this.check_letter_value(this.letterColors[this.wordIdx], this.wordIdx))
                    this.wordIdx++;
                    this.currentLetter = 0;
                }
                else {
                    this.letterColors[this.wordIdx].push("red")
                    this.game.words[this.wordIdx] += typedLetter
                    this.currentLetter++
                }

            } else {
                if (typedLetter === displayedLetter) {
                    this.letterColors[this.wordIdx][this.currentLetter] = "white";
                    this.currentLetter++;
                }
                else {
                    this.letterColors[this.wordIdx][this.currentLetter] = "red";
                    this.currentLetter++;
                }
            }
            if (this.wordIdx + 1 == this.game.words.length && this.currentLetter == this.game.words[this.wordIdx].length) {
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
            if (arr.length == this.validate[idx].length) {
                return true;
            } else {
                return false
            }

        },
    },
    created() {
        this.letterColors = this.game.letters
        this.validate = this.game.words.slice()
    },
    mounted() {
        window.addEventListener('keydown', this.typing_test)
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
            this.wordIdx = 0
            this.letterColors = []
            this.validate = []
            this.word_is_valid = []
            this.spacePressed = []
            this.letterColors = scriptFile.makeColors(this.game.words)
            this.validate = this.game.words.slice()
            window.addEventListener('keydown', this.typing_test)
        }
    }
};
</script>

  