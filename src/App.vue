<template>
  <DefaultLayout>
    <router-view />
  </DefaultLayout>
</template>

<script setup>

import DefaultLayout from '@/layouts/DefaultLayout.vue';
</script>

<style>

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden; 
}
</style>