<script>
// Adds all necessary stuff for you.
import { Overlay } from "trading-vue-js";

export default {
  name: "Range",

  data: () => ({
    tickrate: 5,
  }),

  mixins: [Overlay],

  methods: {
    meta_info() {
      return { author: "Tryston Perry", version: "1.0.0" };
    },

    // Here goes your code. You are provided with:
    // { All stuff is reactive }
    // $props.layout -> positions of all chart elements +
    //  some helper functions (see layout_fn.js)
    // $props.interval -> candlestick time interval
    // $props.sub -> current subset of candlestick data
    // $props.data -> your indicator's data subset.
    //  Comes "as is", should have the following format:
    //  [[<timestamp>, ... ], ... ]
    // $props.colors -> colors (see TradingVue.vue)
    // $props.cursor -> current position of crosshair
    // $props.settings -> indicator's custom settings
    //  E.g. colors, line thickness, etc. You define it.
    // $props.num -> indicator's layer number (of All
    // layers in the current grid)
    // $props.id -> indicator's id (e.g. EMA_0)
    // ~
    // Finally, let's make the canvas dirty!
    draw(ctx) {
      const layout = this.$props.layout;

      for (const data of this.volumeProfile) {
        let x = layout.t2screen(data[0]);
        // let y1 = layout.$2screen(vp[0].price);
        // let y2 = layout.$2screen(vp[vp.length - 1].price);
        const w = layout.px_step;

        // ctx.fillStyle = "#4a4a4a";
        // ctx.fillRect(x - w / 2, y2, w, y1 - y2);

        // Loop through all prices
        for (const v of data[1]) {
          const { price } = v;

          const y3 = layout.$2screen(price);
          const y4 = layout.$2screen(price - this.tickrate);

          ctx.fillStyle = "#E54150";
          const sellPerc = v.sellVolume / 1000000;
          const sw = Math.min(sellPerc * w);
          ctx.fillRect(x, y3, -sw, y4 - y3);

          ctx.fillStyle = "#0dc719";
          const buyPerc = v.buyVolume / 1000000;
          const bw = Math.min(buyPerc * w);
          ctx.fillRect(x, y3, bw, y4 - y3);
        }
      }
    },

    use_for() {
      return ["VolumeProfile"];
    },
  },

  // Define internal setting & constants here
  computed: {
    volumeProfile() {
      const profiles = [];
      const md = this.$store.state.chart.marketData;

      // Congregate tickrates if more than 1
      for (const candle of md) {
        const vp = candle.volumeProfile;
        const profile = [candle.timestamp, []];

        const keys = Object.keys(vp);
        const firstKey = +keys[0];
        const lastKey = +keys[keys.length - 1];

        // Starting price = first VP price + averaged to tickrate
        const startingPrice =
          firstKey +
          this.tickrate -
          (firstKey % this.tickrate || this.tickrate);

        // Get required amount of ticks by getting difference between top price and last price
        const lastPrice = lastKey - (lastKey % this.tickrate);

        for (let i = startingPrice; i <= lastPrice; i += this.tickrate) {
          // Create new volume profile for this tick
          const nv = {
            price: i,
            buyVolume: 0,
            sellVolume: 0,
          };

          // Look through next prices
          for (let j = 0; j < this.tickrate; j++) {
            const node = vp[`${i + j}.000000`];
            if (!node) continue;
            nv.buyVolume += node.buyVolume;
            nv.sellVolume += node.sellVolume;
          }

          profile[1].push(nv);
        }

        profiles.push(profile);
      }

      return profiles;
    },

    sett() {
      return this.$props.settings;
    },
    line_width() {
      return this.sett.lineWidth || 5;
    },
    color() {
      return this.sett.color || "#ec206e";
    },
    band_color() {
      return this.sett.bandColor || "#ddd";
    },
    back_color() {
      return this.sett.backColor || "#381e9c16";
    },
  },
};
</script>
