<template>
  <div id="container">
    <transition name="progress">
      <v-progress-linear
        v-show="loading"
        color="accent"
        absolute
        indeterminate
      ></v-progress-linear>
    </transition>

    <div id="content">
      <v-card color="mb-4" v-for="item of confessions" :key="item.id">
        <v-card-title>
          <span :class="item.sender.sex == 'm' ? 'blue--text' : 'pink--text'">
            {{ item.sender.nickname }}
          </span>

          <v-icon color="red">mdi-heart</v-icon>

          <span :class="item.receiver.sex == 'm' ? 'blue--text' : 'pink--text'">
            {{ item.receiver.nickname }}
          </span>
        </v-card-title>

        <v-card-subtitle>{{ item.creation_time | datetime }}</v-card-subtitle>

        <v-card-text>{{ item.text }}</v-card-text>

        <v-card-actions>
          <v-btn v-if="!liked.has(item.id)" icon @click="like(item)">
            <v-icon>mdi-thumb-up</v-icon>
          </v-btn>
          <v-btn v-else icon color="red"><v-icon>mdi-thumb-up</v-icon> </v-btn>
          <span>{{ item.like }}</span>
        </v-card-actions>
      </v-card>

      <v-pagination v-model="curPage" :length="totalPages" @input="refreshData">
      </v-pagination>

      <v-snackbar color="accent" top v-model="snackbar.show">{{
        snackbar.text
      }}</v-snackbar>
    </div>
  </div>
</template>

<script>
import { getConfessions, createLike } from "../apis";
import { liked } from "../session";
import dayjs from "dayjs";

export default {
  name: "Home",

  data() {
    return {
      loading: false,
      snackbar: {
        show: false,
        text: "",
      },
      confessions: [],
      liked,
      curPage: 1,
      totalPages: 0,
    };
  },

  methods: {
    async like(item) {
      try {
        this.loading = true;
        item.like++;
        this.liked.add(item.id);
        await createLike(item.id);
      } catch {
        item.like--;
        this.liked.delete(item.id);
        this.error("点赞失败");
      } finally {
        this.loading = false;
      }
    },
    async refreshData(page = 1) {
      try {
        this.loading = true;
        const response = await getConfessions(page);
        this.confessions = response.data["data"];
        this.totalPages = response.data["total_pages"];
      } catch {
        this.error("数据获取失败");
      } finally {
        this.loading = false;
      }
    },
    error(msg) {
      this.snackbar.text = msg;
      this.snackbar.show = true;
    },
  },

  filters: {
    datetime(str) {
      return dayjs(str).format("YYYY-MM-DD HH:mm:ss");
    },
  },

  created() {
    this.refreshData();
  },
};
</script>

<style scoped>
#container {
  overflow: hidden;
}

#content {
  margin: 30px 10%;
}

.progress-leave-active {
  transition: opacity 1s linear;
}
.progress-leave-to {
  opacity: 0;
}
</style>