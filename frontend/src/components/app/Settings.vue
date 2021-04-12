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

<script lang="ts" src="./Settings.ts"></script>
