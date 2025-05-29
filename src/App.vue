<template>
  <DefaultLayout>
    <router-view />
  </DefaultLayout>
</template>

<script setup>
// Импортируем наш основной компонент макета, который содержит AppBar, NavigationDrawer и Footer.
import DefaultLayout from '@/layouts/DefaultLayout.vue';
</script>

<style>
/* Здесь вы можете добавить глобальные стили для всего приложения. */
/* Например, общие шрифты, цвета фона, или базовые сбросы CSS. */
/* Стиль для body, чтобы убрать отступы по умолчанию */
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* Предотвращаем горизонтальную прокрутку */
}
</style>