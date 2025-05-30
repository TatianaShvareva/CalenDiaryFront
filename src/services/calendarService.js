// src/services/calendarService.js
import mainApi from '@/api/mainApi';

// CALENDAR_API_PREFIX - это базовый путь для контроллера /calendar
const CALENDAR_API_PREFIX = '/calendar';

const calendarService = {
  // Получить все события для текущего пользователя
  async getAllEvents() {
    try {
      // Это соответствует @GetMapping("/my-entries") на бэкенде
      const response = await mainApi.get(`${CALENDAR_API_PREFIX}/my-entries`);
      return response.data;
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  },

  // Создать событие для текущего пользователя
  async createEvent(eventData) {
    try {
      // Это соответствует @PostMapping("/my-entries") на бэкенде
      const response = await mainApi.post(`${CALENDAR_API_PREFIX}/my-entries`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  },

  // Получить событие по ID для текущего пользователя
  async getEventById(id) {
    try {
      // Это соответствует @GetMapping("/my-entries/{id}") на бэкенде
      const response = await mainApi.get(`${CALENDAR_API_PREFIX}/my-entries/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching event with ID ${id}:`, error);
      throw error;
    }
  },

  // Обновить событие по ID для текущего пользователя
  async updateEvent(id, eventData) {
    try {
      // Это соответствует @PutMapping("/my-entries/{id}") на бэкенде
      const response = await mainApi.put(`${CALENDAR_API_PREFIX}/my-entries/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error(`Error updating event with ID ${id}:`, error);
      throw error;
    }
  },

  // Удалить событие по ID для текущего пользователя
  async deleteEvent(id) {
    try {
      // Это соответствует @DeleteMapping("/my-entries/{id}") на бэкенде
      const response = await mainApi.delete(`${CALENDAR_API_PREFIX}/my-entries/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting event with ID ${id}:`, error);
      throw error;
    }
  },

  // Дополнительно: Удалить все события для пользователя (если это вам нужно)
  async deleteAllEventsForUser() {
    try {
      // Это соответствует @DeleteMapping("/my-entries") на бэкенде без ID
      const response = await mainApi.delete(`${CALENDAR_API_PREFIX}/my-entries`);
      return response.data;
    } catch (error) {
      console.error('Error deleting all events for user:', error);
      throw error;
    }
  },

  // Если у вас есть другие аутентифицированные эндпоинты в CalendarEntryController,
  // например, фильтрация по дате (по аналогии с getEventsByDate, если добавите)
};

export default calendarService;