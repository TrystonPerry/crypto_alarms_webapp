import Vue from "vue";
import App from "./App.vue";

import VueRouter from "vue-router";
import router from "./router";

import "./assets/styles/index.css";
import "css.gg/icons/all.css";

import VueNativeSock from "vue-native-websocket";

Vue.config.productionTip = false;

Vue.use(VueRouter);

import store from "./store";

Vue.use(VueNativeSock, "ws://localhost:3001/ws", {
  reconnection: true,
  reconnectionDelay: 3000,
  store,
  format: "json",
  passToStoreHandler(_, e) {
    if (!e.data) return;
    const data = JSON.parse(e.data);
    if (data.type === "initial") {
      this.store.dispatch("chart/addNewChart", data.payload);
    } else if (data.type === "update") {
      this.store.commit("chart/UPDATE_CHART", data.payload);
    }
  },
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
