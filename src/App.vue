<template>
  <v-app>
    <router-view name="bar" :bridge="bridge"></router-view>

    <v-bottom-navigation background-color="primary" dark app shift>
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
        <router-view :bridge="bridge"></router-view>
      </transition>
    </v-main>
  </v-app>
</template>

<script>
import Vue from "vue";

export default {
  name: "App",

  components: {},

  data() {
    return {
      bridge: new Vue(),
    };
  },
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
