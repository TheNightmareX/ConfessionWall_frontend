import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home/index.vue";
import Home_Bar from "../views/Home/bar.vue";
import New from "../views/New/index.vue";
import Details from "../views/Details/index.vue";

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: "/",
      redirect: "/home/",
    },
    {
      name: "home",
      path: "/home/",
      components: {
        default: Home,
        bar: Home_Bar,
      },
    },
    {
      name: "new",
      path: "/new/",
      component: New,
    },
    {
      name: "details",
      path: "/details/:id",
      component: Details,
    },
  ],
  mode: "history",
});
