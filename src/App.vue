<template>
  <div id="app" class="w-screen h-screen">
    <div class="md:flex w-full p-4">
      <button
        v-for="t in favoriteTickers"
        :key="t"
        @click.capture="() => newTicker(t)"
        class="flex-grow py-2 px-5 rounded-full m-1 hover:bg-blue-400 hover:text-white"
        :class="t === selectedTicker ? 'bg-blue-500 text-white' : ''"
      >
        {{ t }}
      </button>
    </div>
    <form @submit.prevent="() => newTicker(ticker)" class="p-4 pt-0 w-screen">
      <div class="flex bg-white w-full p-2 rounded-full">
        <input
          type="text"
          v-model="ticker"
          class="px-2 flex-grow p-0 text-2xl rounded-full"
        />
        <button
          type="submit"
          class="py-2 px-5 rounded-full bg-blue-500 text-white"
        >
          Submit
        </button>
      </div>
    </form>

    <main class="m-2">
      <MDR :ticker="selectedTicker" />
    </main>
  </div>
</template>

<script>
import MDR from "@/components/MDR";

export default {
  name: "App",

  components: {
    MDR,
  },

  data: () => ({
    selectedTicker: "BTC",
    ticker: "BTC",
    favoriteTickers: [
      "BTC",
      "ETH",
      "LINK",
      "XTZ",
      "LTC",
      "BCH",
      "UNI",
      "DOT",
      "ADA",
    ],
  }),

  methods: {
    newTicker(ticker) {
      this.selectedTicker = ticker;
      this.ticker = ticker;
    },
  },
};
</script>

<style>
body {
  margin: 0;
}
</style>
