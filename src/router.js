import VueRouter from "vue-router";

import Chart from "@/components/Chart";
import MDR from "@/components/MDR";

export default new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/mdr",
      component: MDR,
    },
    {
      path: "/chart/:market",
      component: Chart,
    },
  ],
});
