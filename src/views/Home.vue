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
      <div class="mb-4" v-for="confession of confessions" :key="confession.id">
        <v-card>
          <v-card-title>
            <span :class="confession.sender.sex | sexColor">
              {{ confession.sender.nickname }}
            </span>

            <v-icon color="red">mdi-heart</v-icon>

            <span :class="confession.receiver.sex | sexColor">
              {{ confession.receiver.nickname }}
            </span>
          </v-card-title>

          <v-card-subtitle>{{
            confession.creation_time | datetime
          }}</v-card-subtitle>

          <v-card-text>{{ confession.text }}</v-card-text>

          <v-card-actions class="d-flex justify-space-between">
            <span>
              <v-btn
                :color="liked.has(confession.id) ? 'red' : ''"
                icon
                @click="liked.has(confession.id) ? undefined : like(confession)"
              >
                <v-icon>mdi-thumb-up</v-icon>
              </v-btn>
              <span>{{ confession.likes }}</span>
            </span>
            <span>
              <v-btn icon @click="loadComments(confession.id)"
                ><v-icon>mdi-comment</v-icon></v-btn
              >
              <span>{{ confession.comments }}</span>
            </span>
          </v-card-actions>
        </v-card>

        <v-sheet v-if="confession.id in commentDetails" class="comments pb-3">
          <v-list dense two-line>
            <v-list-item
              v-for="{ id, text, creation_time } of commentDetails[
                confession.id
              ].comments"
              :key="id"
            >
              <v-list-item-content>
                <v-list-item-title>{{ text }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  creation_time | datetime
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-pagination
            v-if="commentDetails[confession.id].totalPages > 1"
            v-model="commentDetails[confession.id].curPage"
            :length="commentDetails[confession.id].totalPages"
            @input="loadComments(confession.id)"
          >
          </v-pagination>

          <v-text-field
            v-if="!commented.has(confession.id)"
            v-model="commentInputFields[confession.id]"
            color="accent"
            class="mx-5"
            label="留下我的想法:(Enter键提交)"
            counter="15"
            :rules="[(v) => (v ? v.length <= 15 : true) || '最多15字']"
            @keypress.enter="comment(confession)"
          ></v-text-field>
        </v-sheet>
      </div>

      <v-pagination
        v-model="curPage"
        :length="totalPages"
        @input="loadConfessions"
      ></v-pagination>

      <v-snackbar color="error" top v-model="snackbar.show">{{
        snackbar.text
      }}</v-snackbar>
    </div>
  </div>
</template>

<script>
import {
  getConfessions,
  getComments,
  createLike,
  createComment,
} from "../apis/index";
import session from "../storage/index";
import dayjs from "dayjs";

/**
 * @typedef {import('../apis.js').Confession} Confession
 * @typedef {import('../apis.js').Comment} Comment
 */

export default {
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
      commentDetails: {},
      /**@type {Object<number, string>} */
      commentInputFields: {},
      liked: session.liked,
      commented: session.commented,
      curPage: 1,
      totalPages: 0,
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
      try {
        this.loading = true;
        const { data, total_pages } = await getConfessions(this.curPage);
        this.confessions = data;
        this.totalPages = total_pages;
      } catch {
        this.alert("数据获取失败");
      } finally {
        this.loading = false;
      }
    },
    /**
     *
     * @param {number} confession
     */
    async loadComments(confession) {
      try {
        this.loading = true;
        const page = this.commentDetails[confession]
          ? this.commentDetails[confession].curPage
          : 1;
        const { data, total_pages } = await getComments(confession, page);
        this.$set(this.commentDetails, confession, {
          comments: data,
          curPage: page,
          totalPages: total_pages,
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
     */
    async comment(confession) {
      const id = confession.id;
      const text = this.commentInputFields[id];
      if (!text || text.length > 15) return;
      try {
        this.loading = true;
        this.commented.add(id);
        await createComment(id, text);
        this.loadComments(id);
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

  filters: {
    datetime(date) {
      return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
    },
    sexColor(sex) {
      return sex == "m" ? "blue--text" : "pink--text";
    },
  },

  created() {
    this.loadConfessions();
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

.comments {
  border-bottom-left-radius: 30px;
  overflow: hidden;
}

.progress-leave-active {
  transition: opacity 1s linear;
}
.progress-leave-to {
  opacity: 0;
}
</style>