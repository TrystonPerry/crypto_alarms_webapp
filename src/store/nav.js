export default () => ({
  state: {
    modal: "",
    modalData: {},
    contextMenu: "",
    contextMenuData: {},
  },

  getters: {},

  mutations: {
    SET_MODAL(state, { id, data }) {
      state.modal = id;
      state.modalData = data;
    },

    SET_CONTEXT_MENU(state, { id, data }) {
      state.contextMenu = id;
      state.contextMenuData = data;
    },
  },

  actions: {
    showModal({ commit }, { id, data = {} }) {
      commit("SET_MODAL", { id, data });
    },

    hideModal({ commit }) {
      commit("SET_MODAL", "", {});
    },
  },

  namespaced: true,
});
