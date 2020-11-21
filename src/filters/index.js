import Vue from "vue";
import dayjs from "dayjs";

Vue.filter("datetime", (value) => {
  return dayjs(value).format("YYYY-MM-DD HH:mm:ss");
});
