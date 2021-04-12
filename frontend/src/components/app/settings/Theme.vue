<template>
  <div class="pb-2 px-4">
    <div class="text-button">Theme</div>
    <div class="text-center">
      <v-btn-toggle v-model="theme" mandatory>
        <v-btn>
          <v-icon>{{ mdiDesktopTowerMonitor }}</v-icon>
        </v-btn>
        <v-btn>
          <v-icon>{{ mdiWeatherNight }}</v-icon>
        </v-btn>
        <v-btn>
          <v-icon>{{ mdiWhiteBalanceSunny }}</v-icon>
        </v-btn>
      </v-btn-toggle>
    </div>
  </div>
</template>

<script lang="ts" src="./Theme.ts"></script>
