import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home";
import Home_Bar from "../views/Home/bar";
import New from "../views/New";
import Details from "../views/Details";
import Login from "../views/Login";

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      name: "home",
      path: "/home",
      components: {
        default: Home,
        bar: Home_Bar,
      },
    },
    {
      name: "new",
      path: "/new",
      component: New,
    },
    {
      name: "details",
      path: "/details/:id",
      component: Details,
    },
    {
      name: "login",
      path: "/login",
      component: Login,
    },
  ],
  mode: "history",
});
