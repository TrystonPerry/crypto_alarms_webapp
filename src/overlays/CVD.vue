<script>
import { Overlay } from "trading-vue-js";

export default {
  name: "CVD",
  mixins: [Overlay],
  methods: {
    meta_info() {
      return {
        author: "Tryston Perry",
        version: "1.0.0",
        desc: "Cumulative Volume Delta",
        preset: {
          name: "Cumulative Volume Delta",
          side: "offchart",
          settings: {
            lineWidth: 0.75,
            color: "#f7890c",
          },
        },
      };
    },

    use_for() {
      return ["CVD"];
    },

    calc() {
      return {
        props: {
          length: {
            def: 100,
            text: "Quantity of candles to add together",
          },
        },
        conf: {
          renderer: "Spline",
        },
        data: {
          volumeBySide: {
            type: "Volume",
          },
        },
        update: `
          let cum = 0;
          for (let i = data.length - 1; i >= 0 && i > data.length - 101; i--) {
            cum += (volumeBySide[i][1] + volumeBySide[i][2])
          }
          return cum
      `,
      };
    },
  },
};
</script>
