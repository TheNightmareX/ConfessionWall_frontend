import Vue from "vue";
import VueRouter from "vue-router";
import home_default from "../views/home/default";
import home_bar from "../views/home/bar";
import new_default from "../views/new/default";
import new_bar from "../views/new/bar";
import details_default from "../views/details/default";
import details_bar from "../views/details/bar";
import login_default from "../views/login/default";

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: "",
      redirect: "/home",
    },
    {
      name: "home",
      path: "/home",
      components: {
        default: home_default,
        bar: home_bar,
      },
    },
    {
      name: "new",
      path: "/new",
      components: {
        default: new_default,
        bar: new_bar,
      },
    },
    {
      name: "details",
      path: "/details/:id",
      components: {
        default: details_default,
        bar: details_bar,
      },
    },
    {
      name: "login",
      path: "/login",
      component: login_default,
    },
  ],
  mode: "history",
});
