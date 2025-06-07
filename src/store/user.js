// src/store/user.js
const user = {
  namespaced: true,
  state: () => ({
    // Initialize state directly from localStorage or use a default value.
    // This ensures state is correct upon initial load.
    countryCode: localStorage.getItem('userCountryIsoCode') || 'US',
    languageCode: localStorage.getItem('userLanguageIsoCode') || 'EN',
  }),
  mutations: {
    SET_COUNTRY_CODE(state, code) {
      state.countryCode = code;
    },
    SET_LANGUAGE_CODE(state, code) {
      state.languageCode = code;
    },
  },
  actions: {
    /**
     * Updates the user's country code in the store and localStorage.
     * @param {Object} context - Vuex context object.
     * @param {string} countryCode - The new country code (e.g., 'US', 'DE').
     */
    updateUserCountry({ commit }, countryCode) {
      commit('SET_COUNTRY_CODE', countryCode);
      localStorage.setItem('userCountryIsoCode', countryCode);
    },
    /**
     * Updates the user's language code in the store and localStorage.
     * @param {Object} context - Vuex context object.
     * @param {string} languageCode - The new language code (e.g., 'EN', 'DE').
     */
    updateUserLanguage({ commit }, languageCode) {
      commit('SET_LANGUAGE_CODE', languageCode);
      localStorage.setItem('userLanguageIsoCode', languageCode);
    },
    // The `initializeUser` action is no longer strictly necessary since
    // the state is initialized directly from localStorage. It can be removed
    // unless there's another specific use case for it.
  },
  getters: {
    countryCode: (state) => state.countryCode,
    languageCode: (state) => state.languageCode,
  },
};

export default user;