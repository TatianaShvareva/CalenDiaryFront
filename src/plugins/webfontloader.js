import WebFont from 'webfontloader';

export function loadFonts() { 
  WebFont.load({
    google: {
      families: ['Roboto:400,500,700,400italic|Material+Icons'],
    },
  });
}