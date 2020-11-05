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
          v-bind="item"
          :liked="liked.has(item.id)"
          v-for="item of confessions"
          :key="item.id"
          @click-like="like(item)"
          @click-comment="loadComments(item)"
        >
          <comments
            v-bind="comments[item.id]"
            :commented="commented.has(item.id)"
            @click-pagination="loadComments(item, $event)"
            @submit-comment="comment(item, $event)"
          ></comments>
        </confession-card>
      </transition-group>
    </div>

    <div ref="trigger"></div>

    <v-snackbar color="error" top v-model="snackbar.show">{{
      snackbar.text
    }}</v-snackbar>
  </div>
</template>

<script>
import ConfessionCard from "../components/ConfessionCard.vue";
import Comments from "../components/Comments.vue";

import {
  getConfessions,
  getComments,
  createLike,
  createComment,
} from "../apis/index";
import session from "../storage/index";

/**
 * @typedef {import('../apis/index').Confession} Confession
 * @typedef {import('../apis/index').Comment} Comment
 */

export default {
  components: {
    ConfessionCard,
    Comments,
  },

  data() {
    return {
      loading: false,
      snackbar: {
        show: false,
        text: "",
      },
      /**@type {Confession[]} */
      confessions: [],
      /**@type {Object<number, { comments: Comment[], curPage: number, totalPages: number }>} */
      comments: {},
      liked: session.liked,
      commented: session.commented,
      curPage: 0,
      totalPages: undefined,
    };
  },

  methods: {
    /**
     *
     * @param {Confession} confession
     */
    async like(confession) {
      try {
        this.loading = true;
        confession.likes++;
        this.liked.add(confession.id);
        await createLike(confession.id);
      } catch {
        confession.likes--;
        this.liked.delete(confession.id);
        this.alert("点赞失败");
      } finally {
        this.loading = false;
      }
    },
    async loadConfessions() {
      if (this.loading || this.curPage >= this.totalPages) return;
      try {
        this.loading = true;
        this.curPage++
        const { data, totalPages } = await getConfessions(this.curPage);
        for (const item of Object.values(data)) {
          this.confessions.push(item);
          await new Promise((resolve) => {
            setTimeout(() => resolve(), 100);
          });
        }
        this.totalPages = totalPages;
      } catch (e) {
        this.alert("数据获取失败");
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    /**
     *
     * @param {Confession} confession
     */
    async loadComments(confession, page = 1) {
      const id = confession.id;
      try {
        this.loading = true;
        const { data, totalPages } = await getComments(id, page);
        this.$set(this.comments, id, {
          comments: data,
          totalPages,
        });
      } catch {
        this.alert("获取评论失败");
      } finally {
        this.loading = false;
      }
    },
    /**
     *
     * @param {Confession} confession
     * @param {string} text
     */
    async comment(confession, text) {
      const id = confession.id;
      if (!text || text.length > 15) return;
      try {
        this.loading = true;
        this.commented.add(id);
        await createComment(id, text);
        this.loadComments(confession);
        confession.comments++;
      } catch {
        this.alert("评论失败");
        this.commented.delete(id);
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
    this.loadConfessions();
  },

  mounted() {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        this.loadConfessions()
      }
    })
    observer.observe(this.$refs.trigger)
  }
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