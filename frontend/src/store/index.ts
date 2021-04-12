import Vue from 'vue'
import Vuex from 'vuex'
import pathify, { make } from 'vuex-pathify'

Vue.use(Vuex)

const state = {
  drawers: {
    nav: false,
    settings: false
  }
}

export default new Vuex.Store({
  state: state,
  getters: {
    ...make.getters(state)
  },
  mutations: {
    ...make.mutations(state)
  },
  actions: {
    ...make.actions(state)
  },
  plugins: [pathify.plugin]
})
