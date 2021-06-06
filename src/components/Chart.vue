<template>
  <div>
    <div class="flex items-center bg-gray-800 text-gray-200">
      <button
        @click="$store.dispatch('nav/showModal', { id: 'indicators' })"
        class="flex items-center px-2 py-3 hover:bg-gray-600"
      >
        <i class="gg-add-r mr-2"></i>
        Indicators
      </button>
    </div>
    <TradingVue
      v-if="chart"
      :titleTxt="titleTxt"
      :data="chart"
      :overlays="overlays"
      :height="height - 48"
      :width="width"
    />
  </div>
</template>

<script>
import { TradingVue } from "trading-vue-js";
import Overlays from "tvjs-overlays";

import VolumeBySide from "@/overlays/VolumeBySide";

// const colors = {
//   red: "#e84329",
//   green: "#30e53f",
// };

export default {
  components: {
    TradingVue,
  },

  data: () => ({
    titleTxt: "",
    overlays: [...Object.values(Overlays), VolumeBySide],
    height: window.innerHeight,
    width: window.innerWidth,
  }),

  async mounted() {
    window.addEventListener("resize", this.onResizeWindow);

    this.titleTxt = this.$route.params.market.toUpperCase();

    this.$store.dispatch(
      "chart/addNewChart",
      this.$route.params.market.toLowerCase()
    );
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.onResizeWindow);
  },

  computed: {
    chart() {
      return this.$store.state.chart.charts[0];
    },
  },

  methods: {
    onResizeWindow() {
      this.height = window.innerHeight;
      this.width = window.innerWidth;
    },
  },
};
</script>

<style></style>
