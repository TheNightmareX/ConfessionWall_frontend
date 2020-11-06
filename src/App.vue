<template>
  <v-app>
    <v-app-bar color="primary" dark app>
      <v-toolbar-title>表白墙</v-toolbar-title>
    </v-app-bar>

    <v-bottom-navigation background-color="primary" app shift>
      <v-btn :to="{ name: 'home' }">
        <span>首页</span>
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn :to="{ name: 'new' }">
        <span>表白</span>
        <v-icon>mdi-heart-plus</v-icon>
      </v-btn>
    </v-bottom-navigation>

    <v-main>
      <transition>
        <router-view></router-view>
      </transition>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},

  data() {
    return {};
  },

  methods: {},
};
</script>

<style scoped>
.v-enter {
  opacity: 0;
}
.v-enter-active {
  transition: all 0.5s;
}
</style>
