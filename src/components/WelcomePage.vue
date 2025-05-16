<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6" class="text-center">
        <img
          :src="logo"
          max-width="200"
          class="mb-4"
          alt="CalenDiary Logo"
        >
        <h1>Welcome to CalenDiary</h1>
        <router-link to="/registration">
          <v-btn color="primary" size="large">
            Register
          </v-btn>
        </router-link>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { VContainer, VRow, VCol, VBtn, VImg } from 'vuetify/components'; // <-- Проверьте точность импорта
import logo from '@/assets/logo.png';
</script>

<style scoped>
  /* Стили */
  h1 {
    font-size: 2rem;
  }
</style>