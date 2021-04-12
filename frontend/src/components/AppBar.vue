<template>
  <v-app-bar app>
    <v-app-bar-nav-icon @click="drawers.nav = !drawers.nav" />
    <v-btn icon tile x-large @click="$router.push('/')">
      <v-avatar tile size="48">
        <img src="/icon.png" alt="site logo" />
      </v-avatar>
    </v-btn>
    <div class="px-2 text-h5">Accounts</div>
    <v-spacer />
    <v-btn icon href="https://github.com/swarmp" target="_blank">
      <v-icon v-text="mdiGithub" />
    </v-btn>
    <v-btn icon @click="drawers.settings = !drawers.settings">
      <v-icon v-text="mdiCog" />
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue'
import { sync } from 'vuex-pathify'
import { mdiGithub, mdiCog } from '@mdi/js'
export default Vue.extend({
  name: 'AppBar',
  data: () => ({
    mdiGithub,
    mdiCog
  }),
  computed: {
    drawers: sync('drawers')
  }
})
</script>
