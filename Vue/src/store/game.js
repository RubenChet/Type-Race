import { defineStore } from "pinia";

export const useGameStore = defineStore("game", {
  state: () => ({
    socket: null,
    room: "",
    words: [],
    letters: [],
    isRunning: false,
    isFinished: false,
    mode: "",
    type: "time",
    game_time: 3,
    timer: 0,
    words_state: [],
    num_game: 1,
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
