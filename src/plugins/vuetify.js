// src/plugins/vuetify.js
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { mdi } from 'vuetify/iconsets/mdi';

import 'vuetify/styles' 

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
    defaultTheme: 'light', 
    themes: {
      light: {
        colors: {
      
          primary: '#80CBC4',   
          secondary: '#FFAB91', 
          accent: '#90CAF9',    
          background: '#F8F8F8', 
          surface: '#FFFFFF',    
          error: '#EF5350',      
          info: '#2196F3',      
          success: '#4CAF50',    
          warning: '#FFC107',    
          
          'on-background': '#424242', 
          'on-surface': '#424242',    
        },
      },
    },
  },
});