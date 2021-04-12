import Vue from 'vue'
import Vuex from 'vuex'
import pathify, { make } from 'vuex-pathify'

Vue.use(Vuex)

const state = {
  drawers: {
    nav: false,
    settings: false
  },
  persist: {
    theme: 'auto',
    token: ''
  }
}

const store = new Vuex.Store({
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

export default store

const KEY = 'app_state'

store.watch(
  (state) => state.persist,
  (value) => {
    localStorage.setItem(KEY, JSON.stringify(value))
  },
  { deep: true }
)

window.addEventListener('storage', (ev) => {
  if (ev.key === KEY) {
    const value = localStorage.getItem(KEY)
    if (!value) return
    try {
      const parsed = JSON.parse(value)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { persist, ...old } = store.state
      store.replaceState({ persist: parsed, ...old })
    } catch (e) {
      //
    }
  }
})
