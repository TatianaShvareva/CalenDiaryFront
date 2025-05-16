<template>
  <div class="home">
    <WelcomePage />
  </div>
</template>

<script setup>
import WelcomePage from '@/components/WelcomePage.vue';
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}
</style>