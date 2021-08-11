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
      let place = "offchart";
      if (overlay.id === "volume-profile") place = "onchart";
      state.charts[index].add(place, {
        ...overlay,
        data: state.marketData[index][overlay.propName],
        settings: {
          legend: overlay.id === "volume-profile" ? false : true,
        },
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
      const fundingRate = [];
      const bestOrderStrength = [];
      const orderStrength = [];
      const removedOrders = [];
      const volumeRatios = [];
      const volumeProfile = [];
      const absorptionBySide = [];
      const cad = [];

      for (let i = 0; i < json.candles.length; i++) {
        const candle = json.candles[i];

        const { open, high, low, close, buy_volume, sell_volume } = candle;
        if (high == 0 && low == 0) continue;

        const timestamp = candle.timestamp * 60 * 1000;
        const vr =
          json.volumeRatios &&
          json.volumeRatios.find((v) => v.timestamp === candle.timestamp);

        const vp =
          json.volumeProfile &&
          json.volumeProfile.find((v) => v.timestamp === candle.timestamp);

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
        orderStrength.push([
          timestamp,
          candle.bid_strength,
          candle.ask_strength,
        ]);
        removedOrders.push([
          timestamp,
          candle.removed_bids,
          candle.removed_asks,
        ]);
        if (vr) {
          volumeRatios.push([
            timestamp,
            vr["1k"],
            vr["10k"],
            vr["10k"],
            vr["1m"],
            vr["10m"],
          ]);
        }
        if (vp) {
          volumeProfile.push([timestamp, vp.profile]);
          const ticks =
            vp.profile[vp.profile.length - 1].price - vp.profile[0].price;
          let buys = 0;
          let sells = 0;
          for (let i = 0; i < vp.profile.length; i++) {
            buys += vp.profile[i].buy_volume;
            sells += vp.profile[i].sell_volume;
          }
          buys = buys / ticks;
          sells = sells / ticks;
          absorptionBySide.push([timestamp, buys, -sells]);
          if (i >= 100) {
            cad.push([timestamp, 0, 0]);
            for (
              let j = absorptionBySide.length - 1;
              j > absorptionBySide.length - 101;
              j--
            ) {
              cad[cad.length - 1][1] +=
                absorptionBySide[j][1] + absorptionBySide[j][2];
            }
          }
        }
      }

      const chart = new DataCube({
        chart: {
          type: "R",
          data: candles,
        },
        datasets: [
          {
            type: "Volume",
            id: "volumeBySide",
            data: volumeBySide,
          },
        ],
      });

      console.log(chart.data.datasets[0]);

      commit("ADD_NEW_CHART", chart);
      commit("ADD_MARKET_DATA", {
        candles,
        openInterest,
        volumeBySide,
        fundingRate,
        bestOrderStrength,
        orderStrength,
        removedOrders,
        volumeRatios,
        volumeProfile,
        absorptionBySide,
        cad,
      });

      setTimeout(() => {
        for (const overlayId of JSON.parse(localStorage.getItem("overlays")) ||
          []) {
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
