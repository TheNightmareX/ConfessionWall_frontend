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
      v-if="!commented"
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
import session from "../storage/index";
import { createComment, getComments } from "../apis/index";

/**@typedef {import("../apis/index").Comment} Comment */

export default {
  name: "Comments",

  data() {
    return {
      /**@type {Comment[]} */
      comments: [],
      commenting: false,
      commented: session.commented.has(this.confession),
      commentInput: "",
      curPage: 1,
      totalPages: undefined,
    };
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
          this.load(1);
          session.commented.add(this.confession);
          this.commented = true;
        } finally {
          this.commenting = false;
        }
      }
    },
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
