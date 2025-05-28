// src/plugins/vuetify.js

// 1. ИМПОРТИРУЙТЕ CSS ДЛЯ MATERIAL DESIGN ICONS
import '@mdi/font/css/materialdesignicons.css'; // <-- ЭТА СТРОКА ОЧЕНЬ ВАЖНА И ОТСУТСТВУЕТ У ВАС

import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import { mdi } from 'vuetify/iconsets/mdi'; // <-- ЭТА СТРОКА УЖЕ ЕСТЬ У ВАС

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
});