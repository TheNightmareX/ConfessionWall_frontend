<template>
  <div id="container">
    <confession-card
    :confession="Number($route.params['id'])"
    >
    </confession-card>
  </div>
</template>

<script>
import ConfessionCard from "../../components/ConfessionCard.vue";

export default {
  components: {
    ConfessionCard,
  },
};
</script>

<style scoped>
#container {
  margin: 30px 10%;
}
</style>