<template>
  <v-navigation-drawer v-model="drawers.nav" app>
    <v-list nav dense>
      <v-list-item v-for="(link, i) of links" :key="i" :to="link.to">
        <v-list-item-avatar tile size="24">
          <v-icon>{{ link.icon }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="text-overline" v-text="link.text" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue'
import { mdiHome, mdiAccountMultiple, mdiFormatListText } from '@mdi/js'
import { sync } from 'vuex-pathify'

export default Vue.extend({
  name: 'AppNav',
  data() {
    return {
      links: [
        { to: '/', icon: mdiHome, text: 'Home' },
        { to: '/member', icon: mdiAccountMultiple, text: 'Members' },
        { to: '/blog', icon: mdiFormatListText, text: 'Blog' }
      ]
    }
  },
  computed: {
    drawers: sync('drawers')
  }
})
</script>
