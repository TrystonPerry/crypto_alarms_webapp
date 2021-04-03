<template>
  <div id="app" class="bg-gray-300 w-screen h-screen">
    <form @submit.prevent="newTicker" class="flex p-4 w-screen">
      <input type="text" v-model="ticker" class="flex-grow" />
      <button type="submit" class="py-2 px-5">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "App",

  components: {},

  data: () => ({
    ticker: "BTC",
  }),

  methods: {
    newTicker() {},
  },
};
</script>

<style>
body {
  margin: 0;
}
</style>
