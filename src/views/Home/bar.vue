<template>
  <span>
    <v-menu transition="slide-y-transition">
      <template #activator="{ on }">
        <v-btn icon v-on="on"><v-icon>mdi-sort</v-icon></v-btn>
      </template>
      <v-list>
        <v-list-item-group
          v-model="sort"
          mandatory
          @change="bridge.$emit('sort', sort)"
        >
          <v-list-item value="latest">新的尝试</v-list-item>
          <v-list-item value="earlest">考古探索</v-list-item>
          <v-list-item value="hottest">最受欢迎</v-list-item>
          <v-list-item value="coldest">无人问津</v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>
  </span>
</template>

<script>
import Vue from "vue";

export default {
  props: {
    bridge: Vue,
  },

  data() {
    return {
      sort: "latest",
    };
  },
};
</script>

<style>
</style>