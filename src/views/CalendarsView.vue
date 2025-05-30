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

const events = ref([]);
const calendiaryPrimary = computed(() => 'calendiary-primary');

// ====================================================================
// ПЕРЕМЕСТИТЕ ФУНКЦИИ handleDateClick и handleEventClick СЮДА
// ВЫШЕ ИХ ИСПОЛЬЗОВАНИЯ В calendarOptions
// ====================================================================

const formatDateForRoute = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function handleDateClick(clickInfo) {
  const formattedDate = formatDateForRoute(clickInfo.date);
  router.push(`/add-event/${formattedDate}`);
}

const handleEventClick = (clickInfo) => {
  const eventId = clickInfo.event.id;
  if (eventId) {
    router.push(`/edit-event/${eventId}`);
  } else {
    console.warn('Clicked event has no ID:', clickInfo.event);
    alert('Cannot edit event: Event ID is missing.');
  }
};

// ====================================================================
// КОНЕЦ ПЕРЕМЕЩЕННЫХ ФУНКЦИЙ
// ====================================================================


const fetchEvents = async () => {
  try {
    const fetchedEvents = await calendarService.getAllEvents();
    events.value = fetchedEvents.map(event => ({
      id: event.id,
      title: event.title,
      start: event.startTime,
      end: event.endTime,
      allDay: false,
      extendedProps: {
        description: event.description,
        location: event.location,
        labels: event.labels,
        diaryEntry: event.diaryEntry,
        moodRating: event.moodRating,
        userId: event.userId,
      }
    }));

    console.log('Processed events for FullCalendar:', events.value);

    const calendarApi = fullCalendarRef.value?.getApi();
    if (calendarApi) {
      calendarApi.removeAllEvents();
      calendarApi.addEventSource(events.value);
    }

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
  datesSet: () => {
    const calendarApi = fullCalendarRef.value?.getApi();
    if (calendarApi) {
      calendarTitle.value = calendarApi.getCurrentData().viewTitle;
      fetchEvents();
    }
  },
  editable: true,
  selectable: true,
  dateClick: handleDateClick, // <-- Теперь handleDateClick объявлен
  eventClick: handleEventClick, // <-- Теперь handleEventClick объявлен
  events: events.value,
  eventChange: async (changeInfo) => {
    console.log('Event changed (UI):', changeInfo.event.title);
    try {
      const updatedEventData = {
        title: changeInfo.event.title,
        startTime: changeInfo.event.startStr,
        endTime: changeInfo.event.endStr,
        description: changeInfo.event.extendedProps.description || null,
        location: changeInfo.event.extendedProps.location || null,
        labels: changeInfo.event.extendedProps.labels || [],
        diaryEntry: changeInfo.event.extendedProps.diaryEntry || null,
        moodRating: changeInfo.event.extendedProps.moodRating || null,
      };
      await calendarService.updateEvent(changeInfo.event.id, updatedEventData);
      console.log('Event updated on backend successfully:', changeInfo.event.id);
    } catch (error) {
      console.error('Failed to update event on backend:', error.response ? error.response.data : error.message);
      alert('Failed to update event. Please refresh and try again.');
      changeInfo.revert();
    }
  },
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
  fetchEvents();
});
</script>

<style lang="scss" scoped>
/* Your existing styles remain unchanged */
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