<template>
  <div class="md:flex">
    <div class="md:w-6/12">
      <canvas ref="mdrchange" class="w-full"></canvas>
    </div>
    <div class="md:w-6/12">
      <canvas ref="mdr" class="w-full"></canvas>
    </div>
  </div>
</template>

<script>
import createChart from "@/createChart";

export default {
  props: {
    ticker: String,
  },

  data: () => ({
    mdrChangeChart: null,
    mdrChart: null,
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
        const min5 = Math.floor(time / 1000 / 60 / 5) - 60 * 6;
        values[min5] = last - current;
      }

      this.mdrChangeChart = createChart({
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
      for (let i = 1; i < mdrData.length; i++) {
        const time = new Date(data.labels[i]).getTime();
        const min30 = Math.floor(time / 1000 / 60 / 30);
        values[min30] = mdrData[i - 1].y;
      }

      this.mdrChart = createChart({
        ctx,
        chartType: "bar",
        values,
        label: "MDR 1 Week",
        minutes: 30,
      });
    },
  },
};
</script>

<style></style>
