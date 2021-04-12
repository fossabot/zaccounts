<template>
  <v-navigation-drawer
    v-model="drawers.settings"
    right
    disable-route-watcher
    fixed
    hide-overlay
    temporary
  >
    <v-toolbar flat color="transparent">
      <div class="text-button">Settings</div>
      <v-spacer />
      <v-btn icon @click="drawers.settings = false">
        <v-icon>{{ mdiClose }}</v-icon>
      </v-btn>
    </v-toolbar>
    <v-divider />
    <app-settings-theme />
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue'
import { mdiClose } from '@mdi/js'
import { sync } from 'vuex-pathify'
import AppSettingsTheme from '@/components/AppSettingsTheme.vue'

export default Vue.extend({
  name: 'AppSettings',
  components: { AppSettingsTheme },
  data() {
    return {
      mdiClose
    }
  },
  computed: {
    drawers: sync('drawers')
  }
})
</script>
