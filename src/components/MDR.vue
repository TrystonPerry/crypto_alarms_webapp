<template>
  <div>
    <div class="md:flex flex-wrap">
      <div class="md:w-6/12">
        <canvas ref="mdrchange" class="w-full"></canvas>
      </div>
      <div class="md:w-6/12">
        <canvas ref="mdr" class="w-full"></canvas>
      </div>
      <div class="md:w-6/12">
        <canvas ref="mdrdist" class="w-full"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import Charts from "@/createChart.js";

export default {
  props: {
    ticker: String,
  },

  data: () => ({
    mdrChangeChart: null,
    mdrChart: null,
    mdrDistributionChart: null,
  }),

  watch: {
    ticker: {
      async handler() {
        await this.buildMDRChangeChart();
        await this.buildMDRChart();
      },
      immediate: true,
    },
  },

  methods: {
    async buildMDRChangeChart() {
      if (this.mdrChangeChart) this.mdrChangeChart.destroy();

      const res = await fetch(
        `${process.env.VUE_APP_API_URL}/mdr-1hr/${this.ticker}`
      );
      const data = await res.json();

      const ctx = this.$refs.mdrchange.getContext("2d");

      const values = {};

      const mdrData = data.all.mdr_1_hours_avg;
      for (let i = 1; i < mdrData.length; i++) {
        const last = Math.abs(mdrData[i - 1].y);
        const current = Math.abs(mdrData[i].y);
        const time = new Date(data.labels[i]).getTime();
        const min5 = Math.floor(time / 1000 / 60 / 5);
        values[min5] = last - current;
      }

      this.mdrChangeChart = Charts.createTimeChart({
        ctx,
        chartType: "bar",
        values,
        label: "MDR 1hr",
        minutes: 5,
      });
    },

    async buildMDRChart() {
      if (this.mdrChart) this.mdrChart.destroy();

      const res = await fetch(
        `${process.env.VUE_APP_API_URL}/mdr-1week/${this.ticker}`
      );
      const data = await res.json();

      const ctx = this.$refs.mdr.getContext("2d");

      const values = {};

      const mdrData = data.all.mdr_1_hours_avg;
      for (let i = 0; i < mdrData.length; i++) {
        const time = new Date(data.labels[i]).getTime();
        const min30 = Math.floor(time / 1000 / 60 / 30);
        values[min30] = mdrData[i].y;
      }

      this.mdrChart = Charts.createTimeChart({
        ctx,
        chartType: "bar",
        values,
        label: "MDR 1 Week",
        minutes: 30,
      });

      this.buildMDRDistributionChart(data);
    },

    buildMDRDistributionChart(data) {
      const ctx = this.$refs.mdrdist.getContext("2d");

      const mdrData = data.all.mdr_1_hours_avg;
      const d = {};
      for (let i = 1; i < mdrData.length; i++) {
        const v = Math.floor(mdrData[i].y);
        d[v] = d[v] ? d[v] + 1 : 1;
      }

      this.mdrChart = Charts.createNormalChart({
        ctx,
        chartType: "bar",
        values: d,
        label: "MDR 1 Distribution",
      });
    },
  },
};
</script>

<style></style>
