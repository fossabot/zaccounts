<template>
  <div class="pb-2 px-4">
    <div class="text-button">Theme</div>
    <div class="text-center">
      <v-btn-toggle v-model="theme" mandatory>
        <v-btn>
          <v-icon>{{ mdiDesktopTowerMonitor }}</v-icon>
        </v-btn>
        <v-btn>
          <v-icon>{{ mdiWeatherNight }}</v-icon>
        </v-btn>
        <v-btn>
          <v-icon>{{ mdiWhiteBalanceSunny }}</v-icon>
        </v-btn>
      </v-btn-toggle>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  mdiWhiteBalanceSunny,
  mdiWeatherNight,
  mdiDesktopTowerMonitor
} from '@mdi/js'

const KEY = 'settings:theme'
export default Vue.extend({
  name: 'Theme',
  data() {
    return {
      theme: 0,
      systemTheme: 0,
      mdiWhiteBalanceSunny,
      mdiWeatherNight,
      mdiDesktopTowerMonitor
    }
  },
  watch: {
    theme() {
      const value = this.theme.toString()
      if (localStorage.getItem(KEY) !== value) {
        localStorage.setItem(KEY, value)
      }
      this.syncTheme()
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      this.systemTheme = darkMediaQuery.matches ? 1 : 2
      darkMediaQuery.addEventListener('change', (ev) => {
        this.systemTheme = ev.matches ? 1 : 2
        this.syncTheme()
      })
      this.theme = parseInt(localStorage.getItem(KEY) || '0') || 0
      window.addEventListener('storage', (ev) => {
        if (ev.key === KEY) {
          const val = parseInt(ev.newValue || '0') || 0
          if (this.theme !== val) this.theme = val
        }
      })
      this.syncTheme()
    },
    syncTheme() {
      this.$vuetify.theme.dark = (this.theme || this.systemTheme) === 1
    }
  }
})
</script>