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

<script lang="ts" src="./App.ts"></script>
