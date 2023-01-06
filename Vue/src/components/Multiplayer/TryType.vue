<template>
    <div class="flex justify-center flex-wrap m-7 overflow-hidden w-full" ref="flexWrapContainer">
        <div v-for="(word, index) in game.words" :key="index" class="flex mr-2"
            v-bind:class="{ 'animate__animated animate__headShake': index === word_index && makeBounce == true, 'underline decoration-red-500': index === word_index && underlineRed == true }"
            @animationend="makeBounce = false, underlineRed = false">
            <p v-for="(letter, idx) in word" :key="idx"
                v-bind:class="{ 'cursor': idx === currentLetter && index === word_index, 'underline': idx === currentLetter && index === word_index && caretTyped == true, 'cursor_next': idx === word.length - 1 && idx === currentLetter - 1 && index === word_index }"
                :style="{ color: game.letters[index][idx] }">
                {{ letter }}
            </p>
        </div>
    </div>
</template>
<script>
import { useGameStore } from '../../store/game'
import 'animate.css'
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
            makeBounce: false,
            underlineRed: false
        };
    },
    methods: {
        typing_test(e) {
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
                }
                else {
                    this.game.words[this.word_index] = this.game.words[this.word_index].substring(0, this.game.words[this.word_index].length - 1);
                    this.currentLetter--
                    this.game.letters[this.word_index].pop()
                }
            }
            else if (e.key == "Dead") {
                this.caretTyped = true
            }
            else {
                window.addEventListener("keypress", this.letter_listener)

            }
        },
        letter_listener(elem) {
            const typedLetter = elem.key;
            const displayedLetter = this.game.words[this.word_index][this.currentLetter];
            // On vérifie si la bonne lettre à été tapé
            if (typedLetter == "Delete") {
                this.currentLetter = 0
                this.game.words[this.word_index] = this.words_list_copy[this.word_index]
                this.game.letters[this.word_index].splice(3);
                this.game.letters[this.word_index].fill('#646669')
            }
            else if (this.currentLetter >= this.words_list_copy[this.word_index].length) {
                if (typedLetter === " ") {
                    const w_status = this.check_letter_value(this.game.letters[this.word_index], this.word_index)
                    if (w_status == true) {
                        this.word_is_valid.push(w_status)
                        this.word_index++;
                        this.currentLetter = 0;
                        this.game.socket.emit('client-wordstate', this.word_is_valid, this.game.game_time)
                    } else {
                        this.makeBounce = true
                        this.underlineRed = true
                    }

                }
                else {
                    this.game.letters[this.word_index].push("red")
                    this.game.words[this.word_index] += typedLetter
                    this.currentLetter++
                }

            }
            else {
                if (typedLetter === displayedLetter) {
                    this.game.letters[this.word_index][this.currentLetter] = "white";
                    this.currentLetter++;
                }
                else {
                    if (typedLetter == " ") {
                        this.makeBounce = true
                    }
                    else {
                        this.game.letters[this.word_index][this.currentLetter] = "red";
                        this.currentLetter++;
                    }
                }
            }
            window.removeEventListener("keypress", this.letter_listener)
            if (this.word_index + 1 == this.game.words.length && this.currentLetter == this.words_list_copy[this.word_index].length) {
                this.word_is_valid.push(true)
                this.game.socket.emit('client-wordstate', this.word_is_valid, this.game.game_time)
                this.game.socket.emit("client-finish", this.word_is_valid, this.game.game_time)
                this.game.isRunning = false
            }
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
        clock() {
            this.game.game_time = 0
            this.interval = setInterval(() => {
                this.game.game_time++;
                if (this.game.isRunning == false) {
                    clearInterval(this.interval);
                }
            }, 1000);
        },
        Check_elements() {
            const parent = this.$refs.flexWrapContainer;
            const children = parent.children;

            let elementCount = 0;
            let currentRowWidth = 0;
            const elementCountsPerRow = [];

            for (let i = 0; i < children.length; i++) {
                const marginRight = parseInt(window.getComputedStyle(children[i]).marginRight, 10);
                const marginLeft = parseInt(window.getComputedStyle(children[i]).marginLeft, 10);
                currentRowWidth += children[i].offsetWidth + marginRight + marginLeft;
                elementCount++;
                if (currentRowWidth > parent.offsetWidth) {
                    elementCountsPerRow.push(elementCount - 1);
                    currentRowWidth = 0;
                    elementCount = 0;
                }
                else if (currentRowWidth == parent.offsetWidth) {
                    elementCountsPerRow.push(elementCount);
                    currentRowWidth = 0;
                    elementCount = 0;
                }
            }
            console.log(`Number of elements per row: ${elementCountsPerRow}`);
        }

    },
    created() {
        this.words_list_copy = this.game.words.slice()

        this.game.socket.on('game-finished', () => {
            window.removeEventListener("keydown", this.typing_test)
            this.game.words_state = this.word_is_valid
        })
    },
    mounted() {
        window.addEventListener('keydown', this.typing_test)
        this.clock()
        this.Check_elements()
    },
    unmounted() {
        window.removeEventListener("keydown", this.typing_test)
    }
};
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