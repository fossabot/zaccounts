<template>
  <v-app>
    <app-bar />
    <app-nav />
    <app-settings />
    <v-main>
      <router-view />
    </v-main>
    <app-footer />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import AppBar from '@/components/AppBar.vue'
import AppNav from '@/components/AppNav.vue'
import AppSettings from '@/components/AppSettings.vue'
import AppFooter from '@/components/AppFooter.vue'

export default Vue.extend({
  name: 'App',
  components: { AppBar, AppNav, AppSettings, AppFooter }
})
</script>