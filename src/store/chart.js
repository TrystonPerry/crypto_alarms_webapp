import { DataCube } from "trading-vue-js";
import Vue from "vue";

import Overlays from "@/overlays.json";

function syncOverlaysLocaly(overlays) {
  localStorage.setItem("overlays", JSON.stringify(Object.keys(overlays)));
}

export default () => ({
  state: {
    marketData: [],
    charts: [],
    overlays: {},
  },

  getters: {},

  mutations: {
    ADD_NEW_CHART(state, payload) {
      state.charts.push(payload);
    },

    ADD_MARKET_DATA(state, data) {
      state.marketData.push(data);
    },

    ADD_OVERLAY(state, { index, overlay }) {
      console.log(state.charts[index], overlay);
      state.charts[index].add("offchart", {
        ...overlay,
        data: state.marketData[index][overlay.propName],
      });
      Vue.set(state.overlays, overlay.id, true);
      syncOverlaysLocaly(state.overlays);
    },

    REMOVE_OVERLAY(state, { index, name, id }) {
      state.charts[index].del(name);
      Vue.delete(state.overlays, id);
      syncOverlaysLocaly(state.overlays);
    },
  },

  actions: {
    async addNewChart({ commit }, ticker) {
      const res = await fetch(
        `${process.env.VUE_APP_API_URL}/ftx-data/${ticker}`
      );
      const json = await res.json();

      const candles = [];
      const openInterest = [];
      const volumeBySide = [];
      // const buyVolume = [];
      // const sellVolume = [];
      // const fundingRate = [];
      // const bestOrderStrength = [];
      // const orderStrength = [];
      // const removedOrders = [];
      // const volumeRatios = [];

      for (let i = 0; i < json.candles.length; i++) {
        const candle = json.candles[i];

        const { open, high, low, close, buy_volume, sell_volume } = candle;

        const timestamp = candle.timestamp * 60 * 1000;
        // const vr =
        //   json.volumeRatios &&
        //   json.volumeRatios.find((v) => v.timestamp === candle.timestamp);

        candles.push([
          timestamp,
          open,
          high,
          low,
          close,
          buy_volume + sell_volume,
        ]);

        openInterest.push([timestamp, candle.open_interest]);
        volumeBySide.push([timestamp, buy_volume, -sell_volume]);
        // buyVolume.push([timestamp, buy_volume, true]);
        // sellVolume.push([timestamp, sell_volume]);
        // fundingRate.push([
        //   timestamp,
        //   candle.funding_rate,
        //   candle.predicted_funding_rate,
        // ]);
        // bestOrderStrength.push([
        //   timestamp,
        //   candle.best_bid_strength,
        //   candle.best_ask_strength,
        // ]);
        // orderStrength.push([timestamp, candle.bid_strength, candle.ask_strength]);
        // removedOrders.push([timestamp, candle.removed_bids, candle.removed_asks]);
        // if (vr) {
        //   volumeRatios.push([
        //     timestamp,
        //     vr["1k"],
        //     vr["10k"],
        //     vr["10k"],
        //     vr["1m"],
        //     vr["10m"],
        //   ]);
        // }
      }

      const chart = new DataCube({
        chart: {
          data: candles,
        },
      });

      commit("ADD_NEW_CHART", chart);
      commit("ADD_MARKET_DATA", {
        candles,
        openInterest,
        volumeBySide,
      });

      setTimeout(() => {
        for (const overlayId of JSON.parse(localStorage.getItem("overlays")) ||
          []) {
          console.log(Overlays, overlayId);
          commit("ADD_OVERLAY", {
            index: 0,
            overlay: Overlays.find(({ id }) => overlayId === id),
          });
        }
      });
    },
  },

  namespaced: true,
});
