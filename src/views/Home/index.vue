<template>
  <div id="container">
    <transition name="progress">
      <v-progress-linear
        v-show="loading"
        color="accent"
        fixed
        indeterminate
      ></v-progress-linear>
    </transition>

    <v-btn
      style="bottom: 72px"
      color="accent"
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
        <confession-card
          class="mb-4"
          :confession="item"
          v-for="item of confessions"
          :key="item.id"
          :to="{ name: 'details', params: { id: item.id } }"
        >
        </confession-card>
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

import ConfessionCard from "../../components/ConfessionCard.vue";

import { getConfessions } from "../../apis/index";

/**
 * @typedef {import('../../apis/index').Confession} Confession
 * @typedef {import('../../apis/index').Comment} Comment
 */

export default {
  components: {
    ConfessionCard,
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
      totalPages: undefined,
      sort: undefined,
    };
  },

  watch: {
    sort() {
      this.reset();
      this.loadNextPage();
    },
  },

  methods: {
    reset() {
      this.nextPage = 1;
      this.totalPages = undefined;
      this.confessions = [];
    },
    /**
     * Keep loading the next page until `needLoad == false`. Do nothing if it is already loading.
     */
    async loadNextPage() {
      if (this.loading) return;
      if (this.nextPage > this.totalPages) return;
      try {
        this.loading = true;
        const { data, totalPages } = await getConfessions(
          this.nextPage,
          this.sort
        );
        for (const item of Object.values(data)) {
          this.confessions.push(item);
          await new Promise((resolve) => {
            setTimeout(() => resolve(), 100);
          });
        }
        this.nextPage++;
        this.totalPages = totalPages;
      } catch (e) {
        this.alert("数据获取失败");
        console.error(e);
      } finally {
        this.loading = false;
      }
      if (this.needLoad) this.loadNextPage();
    },
    alert(msg) {
      this.snackbar.text = msg;
      this.snackbar.show = true;
    },
  },

  created() {
    this.bridge.$off("sort");
    this.bridge.$on("sort", (sort) => (this.sort = sort));
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
    observer.observe(this.$refs.trigger);
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