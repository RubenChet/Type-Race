<template>
  <div class="flex justify-center mt-8">
    <div v-if="!roomState" class="flex text-center">
      <div id="Public">
        <h1>Join a Public Room</h1>
        <!-- <span class="p-float-label">
                    <InputText id="nickname" type="text" class="p-inputtext-sm" v-model="nickname" />
                    <label for="nickname">Choose a nickname :</label>
                </span>
                <span class="p-float-label">
                    <InputText id="room" type="text" class="p-inputtext-sm" v-model="game.room" />
                    <label for="room">Room number :</label>

                </span>
                <Button label="Join" @click="joinRoom()" class="p-button-info p-button-sm p-button-rounded" /> -->
      </div>
      <div id="Private">
        <h1>Join a Private Room</h1>
        <span class="p-float-label">
          <InputText
            id="nickname"
            type="text"
            class="p-inputtext-sm"
            v-model="nickname"
          />
          <label for="nickname">Choose a nickname :</label>
        </span>
        <span class="p-float-label">
          <InputText id="room" type="text" class="p-inputtext-sm" v-model="game.room" />
          <label for="room">Room number :</label>
        </span>
        <Button
          label="Join"
          @click="joinRoom()"
          class="p-button-info p-button-sm p-button-rounded"
        />
      </div>
    </div>
    <WaitRoomVue v-else />
  </div>
</template>
<script>
import WaitRoomVue from "./WaitRoom.vue";
import io from "socket.io-client";
import { useGameStore } from "../store/game";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
export default {
  setup() {
    const game = useGameStore();
    return { game };
  },
  data() {
    return {
      roomState: false,
      roomType: "",
      nickname: "",
    };
  },
  components: {
    WaitRoomVue,
    InputText,
    Button,
  },
  mounted() {},
  created() {},
  methods: {
    joinRoom() {
      if (this.nickname == "" || this.game.room == "") {
        console.log("Please enter a nickname and a room");
      } else {
        this.game.socket = io("http://localhost:3000");
        this.game.socket.on("connect", () => {});
        this.game.socket.emit("join-room", this.game.room, this.nickname, (callback) => {
          this.game.playerslist = callback;
        });
        this.roomState = !this.roomState;
      }
    },
  },
  beforeDestroy() {
    t.disconnect();
  },
};
</script>
<style></style>
