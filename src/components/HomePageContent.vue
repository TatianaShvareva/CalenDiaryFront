<template>
  <v-container class="homepage-content text-center py-12">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-img :src="logo" alt="CalenDiary Logo" max-height="150" max-width="350" contain class="mx-auto mb-8"></v-img>

        <h1 class="text-h3 font-weight-bold text-blue-grey-darken-3 mb-6">
          Welcome to CalenDiary!
        </h1>
        <p class="text-subtitle-1 text-grey-darken-1 mb-8">
          Your personal space for planning, tracking moods, and journaling.
        </p>

        <!-- Move the button ABOVE the image for visibility -->
        <div class="mt-8">
          <v-btn to="/calendars" color="primary" size="large" class="my-calendar-btn" elevation="2"
            append-icon="mdi-calendar">
            My Calendar
          </v-btn>
        </div>

        <v-img :src="workInProgressImage" alt="Website under construction" class="mx-auto rounded-lg elevation-4"
          max-width="400"></v-img>

        <p class="text-caption text-grey-darken-1 mt-4">
          Website under construction. Expect updates!
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { VContainer, VRow, VCol, VImg } from 'vuetify/components';
import workInProgressImage from '@/assets/work in progress.png';
import logo from '@/assets/logo.png'; 
</script>

<style scoped>
.homepage-content {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 30px;
  overflow: visible; /* Ensure content isn't clipped */
}

.v-img {
  max-height: 400px;
  object-fit: contain;
}

.my-calendar-btn {
  margin-top: 24px;
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: none;
  border: 2px solid #1976D2; /* Optional: for debugging visibility, remove if not needed */
}
</style>