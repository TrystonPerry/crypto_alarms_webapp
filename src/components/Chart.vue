<template>
  <TradingVue
    v-if="chart !== null"
    titleTxt="BTCPERP"
    :data="chart"
    :height="height"
    :width="width"
  />
</template>

<script>
import { TradingVue, DataCube } from "trading-vue-js";

const colors = {
  red: "#e84329",
  green: "#30e53f",
};

export default {
  components: {
    TradingVue,
  },

  data: () => ({
    chart: null,
    height: window.innerHeight,
    width: window.innerWidth,
  }),

  async mounted() {
    window.addEventListener("resize", this.onResizeWindow);

    const res = await fetch(
      "http://localhost:3000/ftx-data/" +
        this.$route.params.market.toLowerCase()
    );
    const json = await res.json();

    const candles = [];
    const openInterest = [];
    const buyVolume = [];
    const sellVolume = [];
    const fundingRate = [];
    const bestOrderStrength = [];
    const orderStrength = [];
    const removedOrders = [];

    for (const candle of json) {
      const { open, high, low, close, buy_volume, sell_volume } = candle;

      const timestamp = candle.timestamp * 60 * 1000;

      candles.push([timestamp, open, high, low, close]);

      openInterest.push([timestamp, candle.open_interest]);
      buyVolume.push([timestamp, buy_volume, true]);
      sellVolume.push([timestamp, sell_volume]);
      fundingRate.push([
        timestamp,
        candle.funding_rate,
        candle.predicted_funding_rate,
      ]);
      bestOrderStrength.push([
        timestamp,
        candle.best_bid_strength,
        candle.best_ask_strength,
      ]);
      orderStrength.push([timestamp, candle.bid_strength, candle.ask_strength]);
      removedOrders.push([timestamp, candle.removed_bids, candle.removed_asks]);
    }

    this.chart = new DataCube({
      chart: {
        data: candles,
      },
      offchart: [
        {
          name: "Open Interest",
          type: "Spline",
          data: openInterest,
        },
        {
          name: "Buy Volume",
          type: "Volume",
          data: buyVolume,
        },
        {
          name: "Sell Volume",
          type: "Volume",
          data: sellVolume,
        },
        {
          name: "Funding Rate & Predicted Funding Rate",
          type: "Splines",
          data: fundingRate,
          settings: {
            colors: [colors.green, colors.red],
          },
        },
        {
          name: "Best Bid Strength & Best Ask Strength",
          type: "Splines",
          data: bestOrderStrength,
          settings: {
            colors: [colors.green, colors.red],
          },
        },
        {
          name: "Bid Strength & Ask Strength",
          type: "Splines",
          data: orderStrength,
          settings: {
            colors: [colors.green, colors.red],
          },
        },
        {
          name: "Candeled + Filled orders",
          type: "Spline",
          data: removedOrders,
        },
      ],
    });
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.onResizeWindow);
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
