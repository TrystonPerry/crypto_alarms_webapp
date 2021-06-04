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

      for (var k = 0, n = data.length; k < n; k++) {
        const pos0 = layout.$2screen(0);

        let p = data[k];
        let x = layout.t2screen(p[0]);
        let y1 = layout.$2screen(p[1]);
        let y2 = layout.$2screen(-p[2]);
        const w = layout.px_step * 0.5;

        ctx.fillStyle = "#23A776";
        ctx.fillRect(x - w / 2, y1, w, pos0 - y1);
        ctx.fillStyle = "#E54150";
        ctx.fillRect(x - w / 2, pos0, w, pos0 - y2);
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
      return ["VolumeBySide"];
    },

    // Colors for the legend, should have the
    // same dimention as a data point (excl. timestamp)
    data_colors() {
      return ["#23A776", "#E54150"];
    },

    // Y-Range tansform. For example you need a fixed
    // Y-range for an indicator, you can do it here!
    // Gets estimated range, @return you favorite range
    // y_range(hi, lo) {
    //   return [
    //     Math.max(hi, this.sett.upper || 70),
    //     Math.min(lo, this.sett.lower || 30),
    //   ];
    // },
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
