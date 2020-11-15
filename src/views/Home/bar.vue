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

    <v-btn v-if="authed" icon :loading="loggingOut" @click="logout">
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </span>
</template>

<script>
import Vue from "vue";
import storage from "../../storage";
import { auth } from "../../apis";

export default {
  props: {
    bridge: Vue,
  },

  data() {
    return {
      sort: "latest",
      loggingOut: false,
    };
  },

  computed: {
    authed() {
      return storage.authed;
    },
  },

  methods: {
    async logout() {
      try {
        this.loggingOut = true;
        await auth.logout();
        storage.authed = false;
      } finally {
        this.loggingOut = false;
      }
    },
  },
};
</script>

<style>
</style>