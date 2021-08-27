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

    ADD_MARKET_DATA(state, candle) {
      if (!state.marketData.length) {
        state.marketData.push(candle);
        return;
      }

      const { timestamp } = state.marketData[state.marketData.length - 1];

      // If same timestamp, this is the same candle
      if (timestamp === candle.timestamp) {
        Vue.set(state.marketData, state.marketData.length - 1, candle);
      }

      // If next candle
      else {
        state.marketData.push(candle);
      }
    },

    ADD_OVERLAY(state, { index, overlay }) {
      console.log(overlay);
      let place = "offchart";
      if (overlay.id === "volume-profile") place = "onchart";
      state.charts[index].add(place, {
        ...overlay,
        data: [],
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

    UPDATE_CHART(state, update) {
      update.timestamp *= 60 * 1000;
      if (!state.marketData.length || !state.charts[0]) return;

      state.charts[0].update({
        candle: [
          update.timestamp,
          update.open,
          update.high,
          update.low,
          update.close,
          update.buyVolume + update.sellVolume,
        ],
      });

      const { timestamp } = state.marketData[state.marketData.length - 1];

      // If same timestamp, this is the same candle
      if (timestamp === update.timestamp) {
        Vue.set(state.marketData, state.marketData.length - 1, update);
      }

      // If next candle
      else {
        state.marketData.push(update);
      }
    },
  },

  actions: {
    async addNewChart({ commit }, candles) {
      const data = [];
      for (const candle of candles) {
        candle.timestamp *= 60 * 1000;

        data.push([
          candle.timestamp,
          candle.open,
          candle.high,
          candle.low,
          candle.close,
          candle.buyVolume + candle.sellVolume,
        ]);

        commit("ADD_MARKET_DATA", candle);
      }

      const chart = new DataCube({
        chart: {
          type: "R",
          data,
        },
      });

      commit("ADD_NEW_CHART", chart);

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
