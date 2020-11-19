<template>
  <div id="container">
    <confession class="mb-2" :confession="id"> </confession>
  </div>
</template>

<script>
import "vue-router";

import Confession from "../../components/Confession";

export default {
  components: {
    Confession,
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