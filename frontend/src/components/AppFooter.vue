<template>
  <v-footer app>
    <v-row justify="end" no-gutters>
      <div class="text-overline mr-2" style="text-transform: none !important">
        &copy; {{ new Date().getFullYear() }} ZhangZisu
      </div>
      <v-menu open-on-hover>
        <template #activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>{{ mdiGit }}</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item :href="COMMIT_URL" target="_blank">
            <v-list-item-icon>
              <v-icon>{{ mdiGit }}</v-icon>
            </v-list-item-icon>
            <code>{{ BUILD_TEXT }}</code>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>{{ mdiClockOutline }}</v-icon>
            </v-list-item-icon>
            <code>{{ buildTime }}</code>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-row>
  </v-footer>
</template>

<script lang="ts">
import Vue from 'vue'
import { mdiGit, mdiClockOutline } from '@mdi/js'
const COMMIT_URL = `https://github.com/zzs-web/zaccounts/commit/${BUILD.git.hash}`
const BUILD_TEXT =
  BUILD.git.hash.substr(0, 7) + `:` + BUILD.git.branch + '@' + BUILD.hostname
export default Vue.extend({
  name: 'AppFooter',
  data: () => ({
    COMMIT_URL,
    BUILD_TEXT,
    buildTime: BUILD.ts.toString(),
    mdiGit,
    mdiClockOutline
  }),
  mounted() {
    this.buildTime = new Date(BUILD.ts).toLocaleString()
  }
})
</script>
