<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6" class="text-center">
        <v-img
          :src="logo"
          max-width="200"
          class="mb-4"
        ></v-img>
        <h1>Welcome to CalenDiary</h1>
        <v-btn to="/registration" color="primary" size="large">
          Register
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { VContainer, VRow, VCol, VBtn, VImg } from 'vuetify/components';
import logo from '@/assets/logo.png'; // Убедитесь, что путь к вашему логотипу верный
</script>