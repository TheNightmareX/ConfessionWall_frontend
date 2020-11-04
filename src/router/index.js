import Vue from "vue"
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import New from "../views/New.vue";

Vue.use(VueRouter)

export default new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/home/',
        },
        {
            name: 'home',
            path: '/home/',
            component: Home,
        },
        {
            name: 'new',
            path: '/new/',
            component: New,
        },
    ],
    mode: 'history',
})