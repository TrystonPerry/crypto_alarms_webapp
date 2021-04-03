<template>
  <div>
    <canvas ref="canvas"></canvas>
    HELLO WORLD
  </div>
</template>

<script>
import createChart from "@/createChart";

export default {
  props: {
    ticker: String,
  },

  data: () => ({
    chart: null,
  }),

  watch: {
    ticker: {
      async handler() {
        if (this.chart) this.chart.destroy();

        const res = await fetch(
          `${process.env.VUE_APP_API_URL}/mdr-1hr/${this.ticker}`
        );
        const data = await res.json();
        console.log(data);

        const ctx = this.$refs.canvas.getContext("2d");

        const values = {};

        const mdrData = data.all.mdr_1_hours_avg;
        for (let i = 1; i < mdrData.length; i++) {
          const last = Math.abs(mdrData[i - 1].y);
          const current = Math.abs(mdrData[i].y);
          const time = new Date(data.labels[i]).getTime();
          const min5 = Math.floor(time / 1000 / 60 / 5) - 60 * 6;
          values[min5] = last - current;
        }

        this.chart = createChart({
          ctx,
          chartType: "bar",
          values,
          label: "MDR 1hr",
          minutes: 5,
        });
      },
      immediate: true,
    },
  },

  methods: {},
};
</script>

<style></style>
