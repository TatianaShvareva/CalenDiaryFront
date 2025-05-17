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
        <div class="button-group">
          <v-btn to="/registration" color="primary" size="large" class="mr-2">
            Register
          </v-btn>
          <v-btn to="/signin" color="secondary" size="large" class="mr-2">
            Sign In
          </v-btn>
          <v-btn to="/calendars" color="info" size="large">
            Calendars
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { VContainer, VRow, VCol, VBtn, VImg } from 'vuetify/components';
import logo from '@/assets/logo.png';
</script>

<style scoped>
.button-group {
  margin-top: 20px;
}

.mr-2 {
  margin-right: 8px;
}
</style>