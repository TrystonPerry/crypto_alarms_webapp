<template>
  <div>
    <h2 class="text-lg font-bold">Indicators</h2>
    <ul class="p-3 pb-1 bg-gray-800">
      <li>
        <input
          type="text"
          v-model="search"
          placeholder="Search indicators..."
          class="w-full p-2 my-3 text-black"
        />
      </li>
      <li>
        <div class="text-xl my-2 font-bold">Enabled</div>
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
          <li v-if="!enabledIndicators.length">None found</li>
        </ul>
      </li>
      <li>
        <div class="text-xl my-2 font-bold">Available</div>
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
          <li v-if="!availableIndicators.length">None found</li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import Overlays from "@/overlays.json";

export default {
  data: () => ({
    search: "",
  }),

  computed: {
    enabledIndicators() {
      return Overlays.filter(
        (o) =>
          this.$store.state.chart.overlays[o.id] &&
          (!this.search.length ||
            o.name.toLowerCase().indexOf(this.search) > -1)
      ).sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
    },

    availableIndicators() {
      return Overlays.filter(
        (o) =>
          !this.$store.state.chart.overlays[o.id] &&
          (!this.search.length ||
            o.name.toLowerCase().indexOf(this.search) > -1)
      ).sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
    },
  },
};
</script>

<style></style>
