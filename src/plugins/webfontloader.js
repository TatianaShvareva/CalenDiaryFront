import WebFont from 'webfontloader';

export function loadFonts() { // Добавьте 'export' перед 'function'
  WebFont.load({
    google: {
      families: ['Roboto:400,500,700,400italic|Material+Icons'],
    },
  });
}