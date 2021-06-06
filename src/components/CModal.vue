<template>
  <div
    v-if="$store.state.nav.modal"
    ref="modal"
    class="modal flex items-center justify-center"
  >
    <div class="modal__box-container w-full" style="max-width: 600px">
      <div
        class="modal__box bg-gray-900 shadow-reg scrollbar overflow-auto text-gray-300"
      >
        <button
          v-if="!$store.state.nav.modalData.noclose"
          @click="close"
          class="btn btn-close absolute"
          style="top: 1rem; right: 1rem"
        >
          <i class="gg-close"></i>
        </button>

        <section v-if="$store.state.nav.modal === 'indicators'">
          <Indicators />
        </section>
      </div>
    </div>
    <div @click="close" class="modal__bg"></div>
  </div>
</template>

<script>
import Indicators from "./modals/Indicators";

export default {
  components: {
    Indicators,
  },

  mounted() {
    window.addEventListener("keydown", this.onKeyDown);
  },

  watch: {
    async "$store.state.nav.modal"(modalName) {
      if (modalName) {
        await this.$nextTick();
        if (!this.$refs.modal) return;
        const input = this.$refs.modal.querySelector("input");
        if (input) input.focus();
      }
    },

    "$route.path"() {
      this.$store.dispatch("nav/hideModal");
    },
  },

  methods: {
    onKeyDown(e) {
      if (e.keyCode === 27 && this.$store.state.nav.modal) {
        this.close();
      }
    },

    close() {
      if (this.$store.state.nav.modalData.noclose) return;
      this.$store.dispatch("nav/hideModal");
    },
  },
};
</script>

<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1030;
}

.modal__box {
  padding: 20px;
  position: relative;
  border-radius: 4px;
  max-height: 75vh;
  box-sizing: border-box;
}

.modal__box.btn-close {
  font-weight: bold;
  color: white;
  background: black;
  height: 24px;
  width: 24px;
  border-radius: 4px;
  position: absolute;
  right: 10px;
  top: 10px;
}

.modal__box-container {
  position: fixed;
  z-index: 1030;
  padding: 1rem;
  margin: auto;
}

.modal__bg {
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1029;
}
</style>
