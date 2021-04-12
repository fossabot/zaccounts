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
import { sync } from 'vuex-pathify'

export default Vue.extend({
  name: 'Theme',
  data() {
    return {
      systemTheme: 0,
      mdiWhiteBalanceSunny,
      mdiWeatherNight,
      mdiDesktopTowerMonitor
    }
  },
  watch: {
    theme() {
      this.syncTheme()
    }
  },
  computed: {
    theme: sync<boolean>('persist@theme')
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
      this.syncTheme()
    },
    syncTheme() {
      this.$vuetify.theme.dark = (this.theme || this.systemTheme) === 1
    }
  }
})
</script>
