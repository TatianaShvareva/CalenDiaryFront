<template>
  <v-app>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { VApp, VMain } from 'vuetify/components';

export default {
  name: 'App',
  components: { // <-- Добавьте эту секцию
    VApp,
    VMain,
  },
};
</script>