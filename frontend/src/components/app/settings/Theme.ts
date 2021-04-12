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
