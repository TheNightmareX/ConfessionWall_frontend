<template>
  <v-sheet id="container" class="pb-3">
    <v-list dense two-line>
      <v-list-item v-for="{ id, text, creationTime } of comments" :key="id">
        <v-list-item-content>
          <v-list-item-title>{{ text }}</v-list-item-title>
          <v-list-item-subtitle>{{
            creationTime | datetime
          }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon :loading="statuses.deleting[id]" @click="del(id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>

    <v-pagination
      v-if="totalPages > 1"
      v-model="curPage"
      :length="totalPages"
      @input="load()"
    >
    </v-pagination>

    <v-text-field
      v-if="authed || !commented"
      v-model="commentInput"
      color="accent"
      class="mx-5"
      :disabled="commenting"
      :loading="commenting"
      label="留下你的想法:(Enter键提交)"
      counter="15"
      :rules="[(v) => (v ? v.length <= 15 : true) || '最多15字']"
      @keypress.enter="comment()"
    ></v-text-field>
  </v-sheet>
</template>

<script>
import storage from "../storage";
import { createComment, getComments, delComment } from "../apis";

/**@typedef {import("../apis").Comment} Comment */

export default {
  name: "Comments",

  data() {
    return {
      /**@type {Comment[]} */
      comments: [],
      commenting: false,
      commentInput: "",
      curPage: 1,
      totalPages: undefined,
      statuses: {
        deleting: {},
      },
    };
  },

  computed: {
    /**@returns {boolean} */
    commented() {
      return storage.commented[this.confession];
    },
    authed() {
      return storage.authed;
    },
  },

  props: {
    confession: Number,
  },

  methods: {
    async comment() {
      if (this.commentInput.length <= 15) {
        try {
          this.commenting = true;
          await createComment(this.confession, this.commentInput);
          await this.load(1);
          this.$set(storage.commented, this.confession, true);
          this.$set(storage.commented, this.confession, true);
          this.$emit("update", this.comments.length);
        } finally {
          this.commenting = false;
        }
      }
    },
    /**
     *
     * @param {number} id
     */
    async del(id) {
      try {
        this.$set(this.statuses.deleting, id, true);
        await delComment(this.confession, id);
        await this.load(1);
        this.$emit("update", this.comments.length);
      } finally {
        this.statuses.deleting[id] = false;
      }
    },
    /**
     * Get the current page from the pagination and load the comments.
     * Set the current page if param `page` is provided.
     */
    async load(page) {
      if (page) this.curPage = page;
      try {
        const { data, totalPages } = await getComments(
          this.confession,
          this.curPage
        );
        this.comments = Object.values(data);
        this.totalPages = totalPages;
        this.$emit("load");
      } catch {
        this.$emit("error");
      }
    },
  },

  created() {
    this.load();
  },
};
</script>

<style scoped>
#container {
  border-bottom-left-radius: 30px;
  overflow: hidden;
}
</style>
