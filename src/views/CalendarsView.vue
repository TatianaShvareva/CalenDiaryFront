<template>
  <v-container fluid class="pa-0">
    <v-toolbar :color="calendiaryPrimary" flat dark>
      <v-toolbar-title class="ml-4 text-h5">CalenDiary</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon @click="goToPrev" aria-label="Previous month/week/day">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn icon @click="goToNext" aria-label="Next month/week/day">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
      <v-btn @click="goToToday" variant="tonal" class="mx-2">Today</v-btn>

      <span class="text-h6 mx-4">{{ calendarTitle }}</span>

      <v-spacer></v-spacer>

      <v-select v-model="currentView" :items="calendarViews" class="ma-2" density="compact" label="View" variant="solo"
        hide-details flat style="max-width: 150px;"></v-select>
    </v-toolbar>

    <v-sheet class="pa-4 full-calendar-wrapper">
      <FullCalendar :options="calendarOptions" ref="fullCalendarRef" />
    </v-sheet>
  </v-container>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import enLocale from '@fullcalendar/core/locales/en-gb.js';

// Импортируем наш calendarService
import calendarService from '@/services/calendarService';

const router = useRouter();
const fullCalendarRef = ref(null);
const calendarTitle = ref('');

const currentView = ref('dayGridMonth');
const calendarViews = ref([
  { title: 'Month', value: 'dayGridMonth' },
  { title: 'Week', value: 'timeGridWeek' },
  { title: 'Day', value: 'timeGridDay' },
  { title: 'List', value: 'listWeek' },
]);

// Удаляем все, что связано с LOCAL_STORAGE_EVENTS_KEY, getInitialDefaultEvents, loadEventsFromLocalStorage, localEvents
// const LOCAL_STORAGE_EVENTS_KEY = 'calendiary-events';
// const getInitialDefaultEvents = () => { /* ... */ };
// const loadEventsFromLocalStorage = () => { /* ... */ };
// const localEvents = ref(loadEventsFromLocalStorage());

// Новая реактивная переменная для хранения событий, загруженных с бэкенда
const events = ref([]);

const calendiaryPrimary = computed(() => 'calendiary-primary');

// Функция для загрузки событий с бэкенда
const fetchEvents = async () => {
  try {
    const fetchedEvents = await calendarService.getAllEvents();
    // Преобразуем CalendarEntryResponseDTO в формат, понятный FullCalendar
    events.value = fetchedEvents.map(event => ({
      id: event.id, // Используем id события
      title: event.title,
      start: event.startTime, // Используем startTime из DTO
      end: event.endTime,     // Используем endTime из DTO
      allDay: false,          // По умолчанию false, так как у вас есть время (startTime/endTime).
      // Если событие в DTO должно быть на весь день без времени,
      // вам потребуется дополнительная логика или поле в DTO.
      // Если у вас есть метки с цветами, примените их здесь
      // Например:
      // backgroundColor: event.labels && event.labels.length > 0 ? getLabelColor(event.labels[0]) : '#80CBC4',
      // borderColor: event.labels && event.labels.length > 0 ? getLabelColor(event.labels[0]) : '#80CBC4',
      // Добавляем дополнительные свойства из DTO в extendedProps для использования при редактировании/отображении
      extendedProps: {
        description: event.description,
        location: event.location,
        labels: event.labels,      // Set<String> из DTO
        diaryEntry: event.diaryEntry,
        moodRating: event.moodRating,
        userId: event.userId,
      }
    }));

    console.log('Processed events for FullCalendar:', events.value);

     // *********** ДОБАВЬТЕ ЭТОТ БЛОК ***********
    const calendarApi = fullCalendarRef.value?.getApi();
    if (calendarApi) {
      // Очищаем существующие события, а затем добавляем новые.
      // Это более надежно, чем просто установка events: events.value, если есть проблемы с реактивностью.
      calendarApi.removeAllEvents(); // Удаляем все текущие события
      calendarApi.addEventSource(events.value); // Добавляем новые
      // Или просто:
      // calendarApi.setOption('events', events.value); // Альтернативный способ
    }
    // ********************************************


  } catch (error) {
    console.error('Failed to fetch events from backend:', error.response ? error.response.data : error.message);
    alert('Failed to load events. Please ensure you are logged in and the backend is running.');
  }
};


const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
  initialView: currentView.value,
  locale: enLocale,
  timeZone: 'UTC',
  headerToolbar: false,
  datesSet: () => { // <--- Здесь
    const calendarApi = fullCalendarRef.value?.getApi();
    if (calendarApi) {
      calendarTitle.value = calendarApi.getCurrentData().viewTitle;
      fetchEvents(); // <--- Эту строку нужно добавить
    }
  },
  editable: true, // Позволяет перетаскивать и изменять размер событий
  selectable: true, // Позволяет выбирать диапазоны дат
  dateClick: handleDateClick,
  events: events.value, // Теперь FullCalendar будет использовать данные из нашей реактивной переменной `events`
  eventChange: async (changeInfo) => { // Срабатывает при перетаскивании или изменении размера события
    console.log('Event changed (UI):', changeInfo.event.title);
    try {
      // Подготавливаем данные для CalendarEntryUpdateDTO
      const updatedEventData = {
        title: changeInfo.event.title,
        startTime: changeInfo.event.startStr, // FullCalendar предоставляет в ISO 8601, что хорошо для LocalDateTime
        endTime: changeInfo.event.endStr, // FullCalendar предоставляет в ISO 8601
        // Берем остальные данные из extendedProps, которые были сохранены при загрузке
        description: changeInfo.event.extendedProps.description || null,
        location: changeInfo.event.extendedProps.location || null,
        labels: changeInfo.event.extendedProps.labels || [], // Передаем как Set<String> (массив строк)
        diaryEntry: changeInfo.event.extendedProps.diaryEntry || null,
        moodRating: changeInfo.event.extendedProps.moodRating || null,
      };
      await calendarService.updateEvent(changeInfo.event.id, updatedEventData);
      console.log('Event updated on backend successfully:', changeInfo.event.id);
      // FullCalendar сам обновит UI, так что refetchEvents() здесь не нужен
    } catch (error) {
      console.error('Failed to update event on backend:', error.response ? error.response.data : error.message);
      alert('Failed to update event. Please refresh and try again.');
      changeInfo.revert(); // Откатываем изменения в UI, если запрос к API не удался
    }
  },
  // Остальные стили FullCalendar можно оставить как есть
  eventColor: '#80CBC4',
  eventTextColor: '#FFFFFF',
  dayHeaders: true,
  slotMinTime: '08:00:00',
  slotMaxTime: '22:00:00',
  nowIndicator: true,
});

watch(currentView, (newViewValue) => {
  const calendarApi = fullCalendarRef.value?.getApi();
  if (calendarApi) {
    calendarApi.changeView(newViewValue);
  }
});

// Удаляем этот watcher, так как events теперь не хранятся в localStorage
// watch(localEvents, (newEventsValue) => { /* ... */ }, { deep: true });

function handleDateClick(clickInfo) {
  const formattedDate = formatDateForRoute(clickInfo.date);
  // При клике на дату, перенаправляем на форму добавления события,
  // передавая выбранную дату в URL.
  router.push(`/add-event/${formattedDate}`);
}

const formatDateForRoute = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const goToPrev = () => {
  fullCalendarRef.value?.getApi().prev();
};

const goToNext = () => {
  fullCalendarRef.value?.getApi().next();
};

const goToToday = () => {
  fullCalendarRef.value?.getApi().today();
};

onMounted(() => {
  const calendarApi = fullCalendarRef.value?.getApi();
  if (calendarApi) {
    calendarTitle.value = calendarApi.getCurrentData().viewTitle;
  }
  // Загружаем события с бэкенда при монтировании компонента
  fetchEvents();
});
</script>

<style lang="scss" scoped>
/* Ваши стили остаются без изменений */
.full-calendar-wrapper {
  background-color: #FFFFFF;
  border-radius: var(--border-radius-base);
  box-shadow: var(--box-shadow-light);
  padding: 0 !important;
  margin: 24px auto;
  /* less margin at top, none at bottom */
  max-width: 1200px;
}

.fc .fc-daygrid-day-frame {
  border-radius: calc(var(--border-radius-base) / 2);
  transition: background-color 0.2s ease;
}

.fc .fc-daygrid-day-frame:hover {
  background-color: #FFFFFF !important;
}

.fc .fc-day-today {
  background-color: #B2E5FC !important;
  border: 1px solid #90CAF9 !important;
  border-radius: calc(var(--border-radius-base) / 2);
}

.fc-event {
  border-radius: calc(var(--border-radius-base) / 2) !important;
  font-weight: 500 !important;
  border: none !important;
  background-color: #80CBC4 !important;
  color: #FFFFFF !important;
}

.fc .fc-toolbar-title {
  font-size: 1.8rem;
  font-weight: 500;
  color: #424242;
}

.fc .fc-col-header-cell-cushion {
  text-transform: uppercase;
  font-weight: 500;
  color: #424242;
}

.fc-day-selected {
  background-color: rgba(128, 203, 196, 0.1) !important;
  border: 1px solid #80CBC4 !important;
}

.fc .fc-timegrid-slot {
  height: 2.5em;
}

.fc .fc-timegrid-slot-label {
  padding-right: calc(var(--spacing-unit) / 2);
  color: #424242;
}

.fc-daygrid-event-harness {
  margin-bottom: calc(var(--spacing-unit) / 4);
}

.fc-h-event .fc-event-main {
  padding: calc(var(--spacing-unit) / 4) calc(var(--spacing-unit) / 2);
}

.fc .fc-icon {
  font-size: 1.2em;
}

.v-input--density-compact .v-field--variant-solo {
  background-color: rgba(255, 255, 255, 0.2) !important;
  color: #FFFFFF !important;
}

.v-input--density-compact .v-field__input {
  color: #FFFFFF !important;
}

.v-input--density-compact .v-field__label {
  color: rgba(255, 255, 255, 0.7) !important;
}

.v-input--density-compact .v-icon {
  color: #FFFFFF !important;
}
</style>