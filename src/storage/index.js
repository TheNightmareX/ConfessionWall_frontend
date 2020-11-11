import Vue from "vue";
import { session } from "./serializers";

let save = true;

window.reset = () => {
  save = false;
  sessionStorage.clear();
  localStorage.clear();
  location.reload();
};

export default new Vue({
  data: {
    /** @type {Object<number, boolean>} */
    liked: session.liked || {},
    /** @type {Object<number, boolean>} */
    commented: session.commented || {},
    /**@type {number} */
    confessionCount: session.confessionCount || 0,
    /**@type {boolean} */
    authed: session.authed || false,
  },

  created() {
    console.debug(this.$data);
    window.addEventListener("unload", () => {
      if (!save) return;
      Object.assign(session, this.$data);
    });
  },
});
