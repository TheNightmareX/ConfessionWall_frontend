<template>
  <v-sheet id="container" class="pb-3" v-if="comments">
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
      @input="$emit('click-pagination', curPage)"
    >
    </v-pagination>

    <v-text-field
      v-if="!commented"
      v-model="commentInput"
      color="accent"
      class="mx-5"
      label="留下你的想法:(Enter键提交)"
      counter="15"
      :rules="[(v) => (v ? v.length <= 15 : true) || '最多15字']"
      :disabled="disabled"
      @keypress.enter="comment()"
    ></v-text-field>
  </v-sheet>
</template>

<script>
export default {
  name: "Comments",

  data() {
    return {
      disabled: false,
      commentInput: "",
      curPage: 1,
    };
  },

  props: {
    comments: Object,
    commented: Boolean,
    totalPages: Number,
  },

  methods: {
    comment() {
      if (this.commentInput.length <= 15) {
        this.$emit("submit-comment", this.commentInput);
      }
    },
  },
};
</script>

<style scoped>
#container {
  border-bottom-left-radius: 30px;
  overflow: hidden;
}
</style>
