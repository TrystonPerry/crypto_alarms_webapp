<script>
// Adds all necessary stuff for you.
import { Overlay } from "trading-vue-js";

export default {
  name: "Range",
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
      const data = this.$props.data;
      window.layout = layout;

      console.log("Draw VP", data);

      for (var k = 0, n = data.length; k < n; k++) {
        let p = data[k];
        const vp = p[1];
        let x = layout.t2screen(p[0]);
        let y1 = layout.$2screen(vp[0].price);
        let y2 = layout.$2screen(vp[vp.length - 1].price);
        console.log(x, y1, y2);
        const w = layout.px_step;

        ctx.fillStyle = "#4a4a4a";
        ctx.fillRect(x - w / 2, y2, w, y1 - y2);

        // Loop through all prices
        for (const v of vp) {
          const { price } = v;

          const y3 = layout.$2screen(price);
          const y4 = layout.$2screen(price - 1);

          ctx.fillStyle = "#E54150";
          const sellPerc = v.sell_volume / 100000;
          const sw = Math.min(sellPerc * w, w / 2);
          ctx.fillRect(x, y3, -sw, y4 - y3);

          ctx.fillStyle = "#0dc719";
          const buyPerc = v.buy_volume / 100000;
          const bw = Math.min(buyPerc * w, w / 2);
          ctx.fillRect(x, y3, bw, y4 - y3);
        }
      }
    },

    // For all data with these types overlay will be
    // added to the renderer list. And '$props.data'
    // will have the corresponding values. If you want to
    // redefine the default behviour for a prticular
    // indicator (let's say EMA),
    // just create a new overlay with the same type:
    // e.g. use_for() { return ['EMA'] }.
    use_for() {
      return ["VolumeProfile"];
    },
  },

  // Define internal setting & constants here
  computed: {
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
