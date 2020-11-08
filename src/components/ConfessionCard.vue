<template>
  <div>
    <v-card>
      <v-card-title>
        <span :class="data.sender.sex | sexColor">
          {{ data.sender.nickname }}
        </span>

        <v-icon color="red">mdi-heart</v-icon>

        <span :class="data.receiver.sex | sexColor">
          {{ data.receiver.nickname }}
        </span>
      </v-card-title>

      <v-card-subtitle>{{ data.creationTime | datetime }}</v-card-subtitle>

      <v-card-text style="white-space: pre-line">{{ data.text }}</v-card-text>

      <v-card-actions class="d-flex justify-space-between">
        <span>
          <v-btn
            :color="liked ? 'red' : ''"
            :loading="liking"
            icon
            @click="liked ? null : like()"
          >
            <v-icon>mdi-thumb-up</v-icon>
          </v-btn>
          <span>{{ data.likes }}</span>
        </span>
        <span>
          <v-btn
            icon
            :loading="commentsLoading"
            :disabled="commentsOpened"
            @click="
              commentsLoading = true;
              commentsOpened = true;
            "
          >
            <v-icon>mdi-comment</v-icon>
          </v-btn>
          <span>{{ data.comments }}</span>
        </span>
      </v-card-actions>
    </v-card>

    <comments
      v-if="commentsOpened"
      :confession="id"
      @load="commentsLoading = false"
      @error="commentsLoading = false; commentsOpened = false"
    ></comments>
  </div>
</template>

<script>
import Comments from "../components/Comments.vue";

import session from "../storage/index";
import { createLike, getConfession } from "../apis/index";

/**@typedef {import("../apis/index").Confession} Confession
 */

export default {
  name: "ConfessionCard",

  components: {
    Comments,
  },

  props: {
    /**ID or data of a confession */
    confession: Object,
  },

  data() {
    return {
      id: undefined,
      /**@type {Confession} */
      data: undefined,
      liking: false,
      liked: undefined,
      commentsLoading: false,
      commentsOpened: false,
    };
  },

  methods: {
    async like() {
      try {
        this.liking = true;
        await createLike(this.id);
        session.liked.add(this.id);
        this.liked = true;
        this.data.likes++;
      } finally {
        this.liking = false;
      }
    },
  },

  filters: {
    sexColor(v) {
      switch (v) {
        case "m":
          return "blue--text";
        case "f":
          return "pink--text";
        case "":
          return "white-text";
      }
      return null;
    },
  },

  async created() {
    if (typeof this.confession == "number") {
      this.id = this.confession;
      this.data = await getConfession(this.confession);
    } else {
      this.data = this.confession;
      this.id = this.data.id;
    }
  },
};
</script>

<style>
</style>