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

<script lang="ts" src="./Nav.ts"></script>
