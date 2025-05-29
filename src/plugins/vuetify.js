// src/plugins/vuetify.js
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { mdi } from 'vuetify/iconsets/mdi';

// Необходимо импортировать базовые стили Vuetify
import 'vuetify/styles' // <--- Добавьте эту строку, если ее нет. Она важна для базовых стилей Vuetify

export default createVuetify({
  components: {
    ...components,
  },
  directives,
  icons: {
    defaultSet: 'mdi',
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light', // Или 'dark', если планируете
    themes: {
      light: {
        colors: {
          // Определите ваши пастельные цвета здесь.
          // Эти названия цветов соответствуют названиям Vuetify.
          primary: '#80CBC4',   // Ваш мятный/бирюзовый
          secondary: '#FFAB91', // Ваш лососевый/коралловый
          accent: '#90CAF9',    // Ваш небесно-голубой
          background: '#F8F8F8', // Цвет фона приложения
          surface: '#FFFFFF',    // Цвет поверхностей (VCard, VSheet и т.д.)
          error: '#EF5350',      // Стандартный красный для ошибок
          info: '#2196F3',       // Стандартный синий для информации
          success: '#4CAF50',    // Стандартный зеленый для успеха
          warning: '#FFC107',    // Стандартный желтый для предупреждений
          // Дополнительные цвета, если вы хотите использовать их в Vuetify как классы (например, text-color-dark)
          'on-background': '#424242', // Цвет текста на фоне
          'on-surface': '#424242',    // Цвет текста на поверхности
        },
      },
    },
  },
});