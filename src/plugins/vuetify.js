// src/plugins/vuetify.js

import '@mdi/font/css/materialdesignicons.css'; 

import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import { mdi } from 'vuetify/iconsets/mdi'; 

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