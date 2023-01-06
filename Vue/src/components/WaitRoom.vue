<template>
    <div v-if="rdy && seconds > 0">{{ seconds }}</div>
    <MultiVue v-else-if="game.isRunning == true" />
    <div id="WaitRoom" v-else class="flex justify-center space-x-48 ">
        <div id="InputContainer">
            <div id="chat" class="m-4">
                <div class="flex justify-center">
                    <p class="mx-auto">Welcome to room : {{ game.room }}</p>
                </div>
                <div id="chatContainer" class="overflow-auto mx-auto mt-2">
                    <div v-for="(msg, index) in game.messages" :key="index" class="flex">
                        <p>{{ msg.sender }} : {{ msg.message }}</p>
                    </div>
                </div>
                <Divider />
                <div id="send" class="flex justify-center mt-4 space-x-4">
                    <InputText id="input_chat" type="text" v-model="msg" placeholder="Chat" class="p-inputtext-sm"
                        @keyup.enter="send_msg(msg)" />
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
                        <div id='players_container' class="overflow-auto">
                            <div v-for="(player, index) in game.playerslist" :key="index" class="mt-2">
                                <div id="players" class="flex mx-2">
                                    <p>{{ player.nickname }} :</p>
                                    <p v-if="player.isTyping == true" class="text-blue-500">Is Typing</p>
                                    <p v-else-if="player.isReady == false" class="text-red-500">Not Ready</p>
                                    <p v-if="player.isReady == true" class="text-green-500">Is Ready</p>
                                    <p v-if="game.socket.id != player.id" @click="kickPlayer(player.id)">Kick</p>
                                    <p v-else class="text-green-500">You</p>
                                </div>
                                <Divider id="you" />
                            </div>
                        </div>
                        <div class="mt-2 mx-10 flex justify-end">
                            <h1>Invite Friends</h1>
                        </div>


                    </div>
                </div>
                <div id="InputContainer" class="flex-col text-center PlayerPanel">
                    <div id="Content" class="m-3">
                        <h1>Game Settings :</h1>
                        <div class="flex space-x-6 items-center mt-4">
                            <p>Language :</p>
                            <Dropdown v-model="selectedLang" :options="languages" placeholder="French" />
                        </div>
                        <div class="flex space-x-6 items-center mt-6">
                            <p>Words :</p>
                            <div v-for="(val, index) in words_length" :key="index" class="field-radiobutton flex flex-col">
                                <label :for="val.key">{{ val.name }}</label>
                                <RadioButton :inputId="val.key" name="val" :value="val.name"
                                    v-model="selectedval" />
                            </div>
                        </div>
                        <div id="players" class="flex mx-4 mt-7">
                            <p>Punctuation</p>
                            <p>Numbers</p>
                        </div>
                        <div class="flex justify-center mt-4">
                            <Button v-if="rdy == true" id="btn_chat" label="UnReady"
                                class="p-button-rounded p-button-info" @click="isReady()" />
                            <Button v-else id="btn_chat" label="Ready" class="p-button-rounded p-button-help"
                                @click="isReady()" />
                        </div>
                    </div>
                </div>


            </div>

        </div>

    </div>

</template>
<script>
import MultiVue from "./Multiplayer/Multi.vue";
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
            selectedLength: 0,
            words_length: [
                {name: '10', key: 10}, 
                {name: '25', key: 25}, 
                {name: '50', key: 50}, 
                {name: '100', key: 100}, 
            ],
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
        this.selectedLength = this.words_length[1].name
    },
}
</script>
<style>
#chat {
    width: 27vh;
    height: 56vh;
}

#chatContainer {
    height: 100%;
}

#input_chat,
#btn_chat {
    font-size: 12px;
    height: 35px;
}

.ResultPannel {
    width: 74vh;
    height: 35vh;
}

.PlayerPanel {
    width: 32vh;
    height: 34vh;
}

#you {
    margin: 0;
}

#players {
    justify-content: space-between;
}

#players_container {
    height: 25vh;
}
</style>