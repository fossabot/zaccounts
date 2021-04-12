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

<script lang="ts" src="./Footer.ts"></script>
