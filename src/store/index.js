import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import Chart from "./chart.js";
import Nav from "./nav.js";

export default new Vuex.Store({
  modules: {
    chart: Chart(),
    nav: Nav(),
  },
});
