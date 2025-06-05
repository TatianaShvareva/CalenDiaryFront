// src/store/user.js
const user = {
  namespaced: true, 
  state: () => ({
    // Инициализация напрямую из localStorage или дефолтное значение
    // Это гарантирует, что состояние будет правильным сразу при загрузке
    countryCode: localStorage.getItem('userCountryIsoCode') || 'US', // Изменил имя для краткости и соответствия геттеру
    languageCode: localStorage.getItem('userLanguageIsoCode') || 'EN', // Изменил имя для краткости и соответствия геттеру
    // Добавьте другие поля пользователя, если они есть
  }),
  mutations: {
    SET_COUNTRY_CODE(state, code) { // Изменил имя мутации для соответствия state
      state.countryCode = code;
    },
    SET_LANGUAGE_CODE(state, code) { // Изменил имя мутации для соответствия state
      state.languageCode = code;
    },
  },
  actions: {
    updateUserCountry({ commit }, countryCode) {
      commit('SET_COUNTRY_CODE', countryCode);
      localStorage.setItem('userCountryIsoCode', countryCode); // Ключ в localStorage остается таким же
    },
    updateUserLanguage({ commit }, languageCode) {
      commit('SET_LANGUAGE_CODE', languageCode);
      localStorage.setItem('userLanguageIsoCode', languageCode); // Ключ в localStorage остается таким же
    },
    // Действие initializeUser становится менее критичным, но все еще может использоваться,
    // если вам нужно принудительно обновить значения после какого-то события.
    // Если state уже инициализируется из localStorage, эта функция может быть удалена
    // или адаптирована для других задач (например, загрузки данных с сервера).
    // Для вашей текущей задачи она уже не нужна для инициализации.
    // initializeUser({ commit }) {
    //   const savedCountry = localStorage.getItem('userCountryIsoCode');
    //   if (savedCountry) {
    //     commit('SET_COUNTRY_CODE', savedCountry);
    //   }
    //   const savedLanguage = localStorage.getItem('userLanguageIsoCode');
    //   if (savedLanguage) {
    //     commit('SET_LANGUAGE_CODE', savedLanguage);
    //   }
    // }
  },
  getters: {
    countryCode: (state) => state.countryCode,
    languageCode: (state) => state.languageCode,
  },
};

export default user;