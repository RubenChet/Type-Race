<template>
    <div>Room : {{ game.room }}</div>
    <div v-if="rdy && seconds > 0">{{ seconds }}</div>
    <div v-else-if="game.isRunning == true">
        <MultiVue />
    </div>
    <div id="WaitRoom" v-else class="flex justify-center space-x-48 ">
        <div id="InputContainer">
            <div id="chat" class="m-4">
                <div id="chatContainer" class="overflow-auto">
                    <div v-for="(msg, index) in game.messages" :key="index" class="flex">
                        <p>{{ msg.sender }} : {{ msg.message }}</p>
                    </div>
                </div>
                <Divider />
                <div id="send" class="flex justify-center mt-4 space-x-4">
                    <InputText id="input_chat" type="text" v-model="msg" placeholder="Chat" class="p-inputtext-sm" />
                    <Button id="btn_chat" label="Send" class=" p-button-rounded p-button-info" @click="send_msg(msg)" />
                </div>
            </div>

        </div>
        <div>
            <div id="InputContainer" class="flex justify-center ResultPannel">
                <ResultVue />
            </div>
            <div class="flex place-content-around mt-5">
                <div id="InputContainer" class="flex-col text-center PlayerPanel">
                    <div id="Content" class="m-3">
                        <h1>Players List :</h1>
                        <div v-for="(player, index) in game.playerslist" :key="index" class="mt-2">
                            <Divider id="you" />
                            <div class="flex space-x-3">
                                <p>{{ player.nickname }} :</p>
                                <p v-if="player.isTyping == true" class="text-blue-500">Is Typing</p>
                                <p v-else-if="player.isReady == false" class="text-red-500">Not Ready</p>
                                <p v-if="player.isReady == true" class="text-green-500">Is Ready</p>
                                <p v-if="game.socket.id != player.id" @click="kickPlayer(player.id)">Kick</p>
                            </div>
                            
                        </div>
                        
                    </div>
                </div>
                <div id="InputContainer" class="flex-col text-center PlayerPanel">
                    <div id="Content" class="m-3">
                        <h1>Game Settings :</h1>
                        <div class="flex justify-center mt-4">
                            <Dropdown v-model="selectedLang" :options="languages" placeholder="French" />
                        </div>
                        <div class="flex space-x-6 items-center mt-3">
                            <p>Words :</p>
                            <div class="flex flex-col">
                                <label for="rb1">10</label>
                                <RadioButton value=10 v-model="words_length" />
                            </div>
                            <div class="flex flex-col">
                                <label for="rb1">25</label>
                                <RadioButton value=25 v-model="words_length" />
                            </div>
                            <div class="flex flex-col">
                                <label for="rb1">50</label>
                                <RadioButton value=50 v-model="words_length" />
                            </div>
                        </div>

                    </div>
                </div>
                <div class="flex items-center">
                    <Button v-if="rdy == true" id="btn_chat" label="UnReady" class="p-button-rounded p-button-info"
                        @click="isReady()" />
                    <Button v-else id="btn_chat" label="Ready" class="p-button-rounded p-button-help"
                        @click="isReady()" />
                </div>

            </div>

        </div>

    </div>

</template>
<script>
import MultiVue from "./Multi.vue";
import ResultVue from './Result.vue'
import { useGameStore } from '../store/game'
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import RadioButton from 'primevue/radiobutton';

export default {
    setup() {
        const game = useGameStore()
        return { game }
    },
    data() {
        return {
            interval: null,
            seconds: null,
            rdy: false,
            msg: '',
            words_length: null,
        }
    },
    components: {
        MultiVue,
        ResultVue,
        InputText,
        Button,
        Dropdown,
        RadioButton,
    },
    methods: {
        isReady() {
            this.game.socket.emit("client-ready")
            this.rdy = !this.rdy
        },
        clock() {
            this.interval = setInterval(() => {
                this.seconds--;
                if (this.seconds === 0) {
                    clearInterval(this.interval);
                    this.game.isRunning = true
                    this.rdy = false
                }
            }, 1000);
        },
        kickPlayer(val) {
            this.game.socket.emit("ask-kick", val)
        },
        send_msg(val) {
            this.game.socket.emit("send-message", val)
            this.msg = ''
        },


    },
    created() {
        this.game.socket.on('game-ready', (val) => {
            this.game.words = val.wordlist
            this.game.letters = val.letters
            this.seconds = 3
            this.clock()
        })
        this.game.socket.on('playerslist-update', (val) => {
            this.game.playerslist = val
        })
        this.game.socket.on('got-kick', () => {
            alert("This is an alert dialog box");
        })
        this.game.socket.on('message-update', (val) => {
            this.game.messages = val
        })

    },
}
</script>
<style>
#chat {
    width: 25vh;
    height: 55vh;
}

#chatContainer {
    width: 25vh;
    height: 92%;
    border-radius: 5px;
}

#input_chat,
#btn_chat {
    font-size: 12px;
    height: 35px;
}

.ResultPannel {
    width: 65vh;
    height: 30vh;
}

.PlayerPanel {
    width: 25vh;
    height: 30vh;
}
#you{
    margin: 0;
}
</style>