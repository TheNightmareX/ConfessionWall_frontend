<template>
  <div>
    <v-card>
      <v-card-title>
        <span :class="sender.sex | sexColor">
          {{ sender.nickname }}
        </span>

        <v-icon color="red">mdi-heart</v-icon>

        <span :class="receiver.sex | sexColor">
          {{ receiver.nickname }}
        </span>
      </v-card-title>

      <v-card-subtitle>{{ creationTime | datetime }}</v-card-subtitle>

      <v-card-text style="white-space: pre-line;">{{
        text
      }}</v-card-text>

      <v-card-actions class="d-flex justify-space-between">
        <span>
          <v-btn
            :color="liked ? 'red' : ''"
            icon
            @click="liked ? null : $emit('click-like')"
          >
            <v-icon>mdi-thumb-up</v-icon>
          </v-btn>
          <span>{{ likes }}</span>
        </span>
        <span>
          <v-btn icon @click="$emit('click-comment')">
            <v-icon>mdi-comment</v-icon>
          </v-btn>
          <span>{{ comments }}</span>
        </span>
      </v-card-actions>
    </v-card>

    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConfessionCard",

  props: {
    id: Number,
    sender: Object,
    receiver: Object,
    text: String,
    likes: Number,
    comments: Number,
    liked: Boolean,
    creationTime: String,
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
};
</script>

<style>
</style>