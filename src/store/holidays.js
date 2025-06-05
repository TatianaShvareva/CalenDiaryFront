// src/store/holidays.js
import { getPublicHolidays } from '@/services/holidaysApi'; // <-- ДОБАВЬТЕ ЭТУ СТРОКУ

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

                // Теперь getPublicHolidays будет доступен
                const data = await getPublicHolidays(countryCode, year, languageCode);

                commit('SET_PUBLIC_HOLIDAYS', data);
            } catch (error) {
                console.error('Error fetching public holidays:', error);
                commit('SET_HOLIDAYS_ERROR', error);
                commit('SET_PUBLIC_HOLIDAYS', []);
                throw error; // Перебрасываем ошибку для дальнейшей обработки, если нужно
            } finally {
                commit('SET_LOADING_HOLIDAYS', false);
            }
        },
    },
    getters: {
        publicHolidays: (state) => state.publicHolidays,
        isLoadingHolidays: (state) => state.isLoadingHolidays,
        holidaysError: (state) => state.holidaysError,
        formattedHolidays: (state, getters, rootState, rootGetters) => { // Добавляем rootGetters
            if (!state.publicHolidays || state.publicHolidays.length === 0) {
                return [];
            }

            const userLanguage = rootGetters['user/languageCode']; // Получаем язык пользователя из модуля user

            const formatted = state.publicHolidays.map(holiday => { // Объявите formatted как константу
                // Ищем название праздника на языке пользователя или английском
                const nameObj = holiday.name.find(n => n.language === userLanguage) ||
                    holiday.name.find(n => n.language === 'EN') ||
                    holiday.name[0]; // Если ничего не нашли, берем первый доступный

                const title = nameObj ? nameObj.text : 'Holiday'; // Название праздника

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