<template>
  <div id="container">
    <confession-card class="mb-2" :confession="id"> </confession-card>
  </div>
</template>

<script>
import "vue-router";

import ConfessionCard from "../../components/ConfessionCard";

export default {
  components: {
    ConfessionCard,
  },

  data() {
    return {
      id: Number(this.$route.params["id"]),
    };
  },
};
</script>

<style scoped>
#container {
  margin: 30px 10%;
}
</style>