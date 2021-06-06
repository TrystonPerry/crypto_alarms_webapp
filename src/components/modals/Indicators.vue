<template>
  <div>
    <h2 class="text-lg font-bold">Indicators</h2>
    <ul class="p-3 pb-1 bg-gray-800">
      <li v-for="overlay in overlays" :key="overlay.id">
        <button
          v-if="!$store.state.chart.overlays[overlay.id]"
          @click="$store.commit('chart/ADD_OVERLAY', { index: 0, overlay })"
          class="flex w-full text-left bg-gray-900 p-2 mb-2 hover:bg-gray-700"
        >
          <i class="gg-add-r mr-2"></i>
          <span>{{ overlay.name }}</span>
        </button>
        <button
          v-else
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
};
</script>

<style></style>
