<template>
  <div v-if="loaded">
    <v-card :ripple="false" @click="handleClick">
      <v-card-title>
        <span :class="data.sender.sex | sexColor"
          >{{ data.sender.displayName }}
        </span>

        <v-icon color="red">mdi-heart</v-icon>

        <span :class="data.receiver.sex | sexColor"
          >{{ data.receiver.displayName }}
        </span>
      </v-card-title>

      <v-card-subtitle>{{ data.creationTime | datetime }}</v-card-subtitle>

      <v-card-text
        :class="{ 'text-truncate': !expanded }"
        :style="{ 'white-space': expanded ? 'pre-wrap' : 'initial' }"
        >{{ data.text }}
      </v-card-text>

      <v-card-actions ref="actions" class="d-flex justify-space-between">
        <span>
          <v-btn
            :color="liked ? 'red' : ''"
            :loading="liking"
            icon
            @click="liked && !authed ? null : like()"
          >
            <v-icon>mdi-thumb-up</v-icon>
          </v-btn>
          <span>{{ data.likes }}</span>
        </span>

        <span v-show="!expanded" @click="expanded = !expanded">
          <v-btn text small>展开<v-icon>mdi-chevron-down</v-icon></v-btn>
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

        <v-btn
          v-if="authed"
          icon
          fab
          small
          absolute
          :loading="deleting"
          @click="del"
          style="top: 3px; right: 3px"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>

    <comments
      v-if="commentsOpened"
      :confession="id"
      @load="commentsLoading = false"
      @error="
        commentsLoading = false;
        commentsOpened = false;
      "
      @update="data.comments = $event"
    ></comments>
  </div>
</template>

<script>
import Comments from "../components/Comments";

import storage from "../storage";
import { likes, confessions, people } from "../apis";

/**@typedef {import("../apis").Confession} Confession */

export default {
  name: "confession",

  components: {
    Comments,
  },

  props: {
    /**ID or data of a confession */
    confession: [Number, Object],
    to: [String, Object],
  },

  data() {
    return {
      id: undefined,
      /**@type {Confession} */
      data: undefined,
      liking: false,
      commentsLoading: false,
      commentsOpened: false,
      deleting: false,
      loaded: false,
      expanded: false,
    };
  },

  computed: {
    authed() {
      return storage.authed;
    },
    liked: {
      get() {
        return storage.liked[this.id];
      },
      set(v) {
        this.$set(storage.liked, this.id, v);
      },
    },
  },

  methods: {
    async like() {
      try {
        this.liking = true;
        await likes.create(this.id);
        this.liked = true;
        this.data.likes++;
      } finally {
        this.liking = false;
      }
    },
    async del() {
      try {
        this.deleting = true;
        await confessions.destroy(this.id);
        this.$emit("delete");
      } finally {
        this.deleting = false;
      }
    },
    /**
     *
     * @param {MouseEvent} ev
     */
    handleClick(ev) {
      if (!this.to || this.$refs.actions.contains(ev.target)) return;
      this.$router.push(this.to);
    },
  },

  filters: {
    sexColor(v) {
      return {
        M: "blue--text",
        F: "pink--text",
        X: "white--text",
      }[v];
    },
  },

  async created() {
    /**@type {Confession} */
    let data;
    if (typeof this.confession == "number") {
      this.id = this.confession;
      data = await confessions.retrieve(this.confession);
    } else {
      data = this.confession;
      this.id = data.id;
    }
    const sender =
      storage.cache.people[data.sender] || (await people.retrieve(data.sender));
    const receiver =
      storage.cache.people[data.receiver] ||
      (await people.retrieve(data.receiver));
    this.$set(storage.cache.people, data.sender, sender);
    this.$set(storage.cache.people, data.receiver, receiver);
    data.sender = sender;
    data.receiver = receiver;
    this.data = data;
    this.loaded = true;
  },
};
</script>

<style scoped>
</style>