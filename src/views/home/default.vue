<template>
  <div id="container">
    <transition name="progress">
      <v-progress-linear
        v-show="loading"
        color="secondary"
        fixed
        indeterminate
      ></v-progress-linear>
    </transition>

    <v-btn
      style="bottom: 72px"
      color="secondary"
      fab
      fixed
      right
      icon
      @click="$vuetify.goTo(0)"
    >
      <v-icon>mdi-chevron-up</v-icon>
    </v-btn>

    <div id="content">
      <transition-group name="items">
        <confession
          class="mb-4"
          :confession="item"
          v-for="item of confessions"
          :key="item.id"
          :to="{ name: 'details', params: { id: item.id } }"
          @delete="
            reset();
            loadNextPage();
          "
        >
        </confession>
      </transition-group>
    </div>

    <div ref="trigger" style="height: 10px"></div>

    <v-snackbar color="error" top v-model="snackbar.show">{{
      snackbar.text
    }}</v-snackbar>
  </div>
</template>

<script>
import Vue from "vue";

import Confession from "../../components/Confession";

import { confessions } from "../../apis";

/**
 * @typedef {import('../../apis').Confession} Confession
 * @typedef {import('../../apis').Comment} Comment
 */

export default {
  components: {
    Confession,
  },

  props: {
    bridge: Vue,
  },

  data() {
    return {
      /**whether user can see the bottom */
      needLoad: false,
      loading: false,
      snackbar: {
        show: false,
        text: "",
      },
      /**@type {Confession[]} */
      confessions: [],
      nextPage: 1,
      sort: undefined,
      search: undefined,
    };
  },

  watch: {
    sort() {
      this.reset();
      this.loadNextPage();
    },
    search() {
      this.reset();
      this.loadNextPage();
    },
  },

  methods: {
    reset() {
      this.nextPage = 1;
      this.confessions = [];
    },
    /**
     * Keep loading the next page until `needLoad == false`. Do nothing if it is already loading.
     */
    async loadNextPage() {
      if (this.loading || !this.nextPage) return;
      try {
        this.loading = true;
        const { results, next } = await confessions.list(
          this.nextPage,
          this.sort,
          this.search
        );
        for (const item of Object.values(results)) {
          this.confessions.push(item);
          await new Promise((r) => setTimeout(r, 100));
        }
        next ? this.nextPage++ : (this.nextPage = null);
        if (this.needLoad) this.loadNextPage();
      } catch (e) {
        this.alert("数据获取失败");
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    alert(msg) {
      this.snackbar.text = msg;
      this.snackbar.show = true;
    },
  },

  created() {
    this.bridge.$off("sort");
    this.bridge.$on("sort", (sort) => (this.sort = sort));
    this.bridge.$off("search");
    this.bridge.$on("search", (personID) => (this.search = personID));
  },

  mounted() {
    // Set up the trigger to load confessions when user can see the bottom.
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.needLoad = true;
        this.loadNextPage();
      } else {
        this.needLoad = false;
      }
    });
    setTimeout(() => { // magic...
      observer.observe(this.$refs.trigger);
    }, 0);
  },
};
</script>

<style scoped>
#container {
  overflow: hidden;
}

#content {
  margin: 30px 10%;
}

.items-enter {
  transform: translateY(-30px);
  opacity: 0;
}
.items-enter-active {
  transition: all 1s;
}

.progress-leave-active {
  transition: opacity 1s linear;
}
.progress-leave-to {
  opacity: 0;
}
</style>