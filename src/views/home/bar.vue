<template>
  <v-app-bar color="primary" dark app>
    <v-toolbar-title>表白墙</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn v-show="!searchBoxOpen" icon @click="searchBoxOpen = !searchBoxOpen">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

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

    <template slot="extension" v-if="searchBoxOpen">
      <v-autocomplete
        autofocus
        clearable
        hide-no-data
        prepend-icon="mdi-magnify"
        :search-input.sync="searchBoxInputValue"
        :items="searchBoxItems"
        @change="bridge.$emit('search', $event)"
      ></v-autocomplete>
    </template>
  </v-app-bar>
</template>

<script>
import Vue from "vue";
import storage from "../../storage";
import { auth, people } from "../../apis";

/**@typedef {import("../../apis").Person} Person */

export default {
  props: {
    bridge: Vue,
  },

  data() {
    return {
      sort: "latest",
      loggingOut: false,
      searchBoxOpen: false,
      searchBoxInputValue: "",
      searchBoxItemsUpdateHandlerID: undefined,
    };
  },

  computed: {
    authed() {
      return storage.authed;
    },
    searchBoxItems() {
      /**@type {Person[]} */
      const people = Object.values(storage.cache.people);
      return people.map((v) => {
        return { value: v.id, text: `[${v.sex}] ${v.displayName}` };
      });
    },
  },

  watch: {
    /**
     *
     * @param {string} v
     */
    async searchBoxInputValue(v) {
      clearTimeout(this.searchBoxItemsUpdateHandlerID);
      if (v && v.length >= 2 && !/\[\w\] .*/.test(v)) {
        this.searchBoxItemsUpdateHandlerID = setTimeout(async () => {
          /**@type {Person[]} */
          const results = Object.values((await people.search(v)).results);
          for (const item of results) {
            this.$set(storage.cache.people, item.id, item);
          }
        }, 1000);
      }
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