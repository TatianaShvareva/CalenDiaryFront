// src/store/holidays.js
import { getPublicHolidays } from '@/services/holidaysApi';

const holidays = {
    namespaced: true,
    state: () => ({
        publicHolidays: [],
        isLoadingHolidays: false,
        holidaysError: null,
    }),
    mutations: {
        SET_PUBLIC_HOLIDAYS(state, holidays) {
            state.publicHolidays = holidays;
        },
        SET_LOADING_HOLIDAYS(state, isLoading) {
            state.isLoadingHolidays = isLoading;
        },
        SET_HOLIDAYS_ERROR(state, error) {
            state.holidaysError = error;
        },
    },
    actions: {
        /**
         * Fetches public holidays for a given country and year.
         * Skips fetching if no country code is available.
         * @param {Object} context - Vuex context object.
         * @param {number} year - The year for which to fetch holidays.
         */
        async fetchHolidays({ commit, rootGetters }, year) {
            commit('SET_LOADING_HOLIDAYS', true);
            commit('SET_HOLIDAYS_ERROR', null);
            try {
                const countryCode = rootGetters['user/countryCode'];
                if (!countryCode) {
                    console.warn("No user country code found, skipping holiday fetch.");
                    commit('SET_PUBLIC_HOLIDAYS', []);
                    return;
                }

                const languageCode = rootGetters['user/languageCode'];
                const data = await getPublicHolidays(countryCode, year, languageCode);
                commit('SET_PUBLIC_HOLIDAYS', data);
            } catch (error) {
                console.error('Error fetching public holidays:', error);
                commit('SET_HOLIDAYS_ERROR', error);
                commit('SET_PUBLIC_HOLIDAYS', []);
                throw error;
            } finally {
                commit('SET_LOADING_HOLIDAYS', false);
            }
        },
    },
    getters: {
        publicHolidays: (state) => state.publicHolidays,
        isLoadingHolidays: (state) => state.isLoadingHolidays,
        holidaysError: (state) => state.holidaysError,
        /**
         * Formats public holidays into a structure compatible with FullCalendar.
         * Attempts to find the holiday name in the user's language, then English, then the first available.
         * @param {Object} state - Current state.
         * @param {Object} getters - Current getters.
         * @param {Object} rootState - Root state.
         * @param {Object} rootGetters - Root getters.
         * @returns {Array} An array of formatted holiday objects.
         */
        formattedHolidays: (state, getters, rootState, rootGetters) => {
            if (!state.publicHolidays || state.publicHolidays.length === 0) {
                return [];
            }

            const userLanguage = rootGetters['user/languageCode'];

            const formatted = state.publicHolidays.map(holiday => {
                const nameObj = holiday.name.find(n => n.language === userLanguage) ||
                                holiday.name.find(n => n.language === 'EN') ||
                                holiday.name[0]; // Fallback to first available language

                const title = nameObj ? nameObj.text : 'Holiday';

                return {
                    title: title,
                    start: holiday.startDate,
                    end: holiday.endDate,
                    allDay: true,
                    display: 'background',
                    id: holiday.id,
                    classNames: ['public-holiday'],
                    extendedProps: {
                        category: 'Public Holiday'
                    }
                };
            });

            console.log("Formatted holidays for FullCalendar:", formatted);
            return formatted;
        },
    },
};

export default holidays;