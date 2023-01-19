import { defineStore } from "pinia";

export const useGameStore = defineStore("game", {
  state: () => ({
    nickname: '',
    roomState: false,
    socket: null,
    room: "",
    words: [],
    letters: [],
    playerslist: [],
    isRunning: false,
    messages: [],
    mode: "multi",
    type: "time",
    game_time: 3,
    timer: 0,
    words_state: [],
    gameNumber: 0,
    kickedList: [],
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.num_game++;
    },
    setState(val) {
      this.words_state = val;
    },
  },
});
