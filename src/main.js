import Vue from "vue";
import App from "./App.vue";

import VueRouter from "vue-router";
import router from "./router";

import "./assets/styles/index.css";
import "css.gg/icons/all.css";

Vue.config.productionTip = false;

Vue.use(VueRouter);

import store from "./store";

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
