<template>
  <div>
    <h2 class="text-lg font-bold">Indicators</h2>
    <ul class="p-3 pb-1 bg-gray-800">
      <li>
        Enabled
        <ul>
          <li v-for="overlay in enabledIndicators" :key="overlay.id">
            <button
              @click="
                $store.commit('chart/REMOVE_OVERLAY', {
                  index: 0,
                  name: overlay.name,
                  id: overlay.id,
                })
              "
              class="flex w-full text-left bg-gray-900 p-2 mb-2 hover:bg-gray-700"
            >
              <i class="gg-close-r mr-2"></i>
              <span>{{ overlay.name }}</span>
            </button>
          </li>
        </ul>
      </li>
      <li>
        Available
        <ul>
          <li v-for="overlay in availableIndicators" :key="overlay.id">
            <button
              @click="$store.commit('chart/ADD_OVERLAY', { index: 0, overlay })"
              class="flex w-full text-left bg-gray-900 p-2 mb-2 hover:bg-gray-700"
            >
              <i class="gg-add-r mr-2"></i>
              <span>{{ overlay.name }}</span>
            </button>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import Overlays from "@/overlays.json";

export default {
  data: () => ({
    overlays: [],
  }),

  mounted() {
    this.overlays = Overlays;
  },

  computed: {
    enabledIndicators() {
      return Overlays.filter(
        (o) => this.$store.state.chart.overlays[o.id]
      ).sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
    },

    availableIndicators() {
      return Overlays.filter(
        (o) => !this.$store.state.chart.overlays[o.id]
      ).sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
    },
  },
};
</script>

<style></style>
