const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: ['vuetify'],
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/assets/styles/variables.scss";`
      },
    },
  },

});