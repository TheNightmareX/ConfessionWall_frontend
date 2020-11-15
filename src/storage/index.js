import dayjs from "dayjs";
import Vue from "vue";
import { local } from "./serializers";

/**@typedef {import("dayjs").Dayjs} Dayjs */

const VERSION = '1.5.2'

const storage = new Vue({
  data: {
    /** @type {Object<number, boolean>} */
    liked: undefined,
    /** @type {Object<number, boolean>} */
    commented: undefined,
    /**@type {number} */
    confessionCount: undefined,
    /**@type {boolean} */
    authed: undefined,
    /**@type {Dayjs} */
    expireDate: undefined,
    /**@type {string} */
    VERSION: undefined,
  },

  methods: {
    reset() {
      this.liked = {};
      this.commented = {};
      this.confessionCount = 0;
      this.authed = false;
      this.expireDate = dayjs().add(2, "week");
      this.VERSION = VERSION;
    },
    load() {
      for (const k in this.$data) {
        if (k in local) {
          this[k] = local[k];
        }
      }
      this.expireDate = dayjs(this.expireDate);
    },
    save() {
      this.expireDate = this.expireDate.format();
      Object.assign(local, this.$data);
    },
  },

  created() {
    this.reset();
    this.load();
    if (this.expireDate.isBefore(dayjs()) || this.VERSION != VERSION) {
      this.reset();
    }

    console.debug(this.$data);
  },
});

let save = true;

window.reset = () => {
  save = false;
  localStorage.clear();
  location.reload();
};

window.addEventListener("unload", () => {
  if (save) storage.save();
});

export default storage;
