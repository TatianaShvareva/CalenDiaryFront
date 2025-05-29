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

      <v-select
        v-model="currentView"
        :items="calendarViews"
        class="ma-2"
        density="compact"
        label="View"
        variant="solo"
        hide-details
        flat
        style="max-width: 150px;"
      ></v-select>
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

// FullCalendar v6.x.x styles are bundled with the JavaScript.
// No explicit CSS imports are needed here.

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

const LOCAL_STORAGE_EVENTS_KEY = 'calendiary-events';

const getInitialDefaultEvents = () => {
  return [
    { id: 'default1', title: 'Default Sample Meeting', start: '2025-05-28T10:30:00', end: '2025-05-28T12:30:00' },
    { id: 'default2', title: 'Default Birthday Party', date: '2025-06-05' },
  ];
};

const loadEventsFromLocalStorage = () => {
  const savedEventsJson = localStorage.getItem(LOCAL_STORAGE_EVENTS_KEY);
  if (savedEventsJson) {
    try {
      const parsedEvents = JSON.parse(savedEventsJson);
      return Array.isArray(parsedEvents) ? parsedEvents : getInitialDefaultEvents();
    } catch (error) {
      console.error('Error parsing events from localStorage:', error);
      return getInitialDefaultEvents();
    }
  }
  return getInitialDefaultEvents();
};

const localEvents = ref(loadEventsFromLocalStorage());

// Assuming you have setup Vuetify theme to use these color names
// If not, you might need to use the hex code directly here: '#80CBC4'
const calendiaryPrimary = computed(() => 'calendiary-primary'); // This will still rely on Vuetify's theme mapping

const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
  initialView: currentView.value,
  locale: enLocale,
  headerToolbar: false,
  datesSet: () => {
    const calendarApi = fullCalendarRef.value?.getApi();
    if (calendarApi) {
      calendarTitle.value = calendarApi.getCurrentData().viewTitle;
    }
  },
  editable: true,
  selectable: true,
  dateClick: handleDateClick,
  events: localEvents.value,
  eventChange: (changeInfo) => {
    console.log('Event changed (UI):', changeInfo.event.title);
    const eventIndex = localEvents.value.findIndex(e => e.id === changeInfo.event.id);
    if (eventIndex !== -1) {
      localEvents.value.splice(eventIndex, 1, {
        id: changeInfo.event.id,
        title: changeInfo.event.title,
        start: changeInfo.event.startStr,
        end: changeInfo.event.endStr,
        allDay: changeInfo.event.allDay,
      });
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

watch(localEvents, (newEventsValue) => {
  localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(newEventsValue));
  const calendarApi = fullCalendarRef.value?.getApi();
  if (calendarApi) {
    calendarApi.refetchEvents();
  }
}, { deep: true });

function handleDateClick(clickInfo) {
  const formattedDate = formatDateForRoute(clickInfo.date);
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
});
</script>

<style lang="scss" scoped>
/* No @use statement needed here */

.full-calendar-wrapper {
  background-color: #FFFFFF; /* was vars.$calendiary-surface */
  border-radius: var(--border-radius-base);
  box-shadow: var(--box-shadow-light);
  padding: 0px !important;
  margin: calc(var(--spacing-unit) * 2);
}

.fc .fc-view-harness {
  height: calc(100vh - 64px - (var(--spacing-unit) * 4)) !important;
}

.fc .fc-daygrid-day-frame {
  border-radius: calc(var(--border-radius-base) / 2);
  transition: background-color 0.2s ease;
}

.fc .fc-daygrid-day-frame:hover {
  /*
    Original was: background-color: color.adjust(vars.$calendiary-background, $lightness: 5%) !important;
    $calendiary-background: #F8F8F8;
    Lighten #F8F8F8 by 5% is roughly #FFFFFF (or very close, depending on exact Sass implementation).
    Using a hardcoded color that is 5% lighter than #F8F8F8.
  */
  background-color: #FFFFFF !important; /* Approximation of lighten($calendiary-background, 5%) */
}

.fc .fc-day-today {
  /*
    Original was: background-color: color.adjust(vars.$calendiary-tertiary, $lightness: 15%) !important;
    $calendiary-tertiary: #90CAF9;
    Lighten #90CAF9 by 15% is roughly #B2E5FC.
  */
  background-color: #B2E5FC !important; /* Approximation of lighten($calendiary-tertiary, 15%) */
  border: 1px solid #90CAF9 !important; /* was vars.$calendiary-tertiary */
  border-radius: calc(var(--border-radius-base) / 2);
}

.fc-event {
  border-radius: calc(var(--border-radius-base) / 2) !important;
  font-weight: 500 !important;
  border: none !important;
  background-color: #80CBC4 !important; /* was vars.$calendiary-primary */
  color: #FFFFFF !important; /* was vars.$calendiary-text-light */
}

.fc .fc-toolbar-title {
  font-size: 1.8rem;
  font-weight: 500;
  color: #424242; /* was vars.$calendiary-text-dark */
}

.fc .fc-col-header-cell-cushion {
  text-transform: uppercase;
  font-weight: 500;
  color: #424242; /* was vars.$calendiary-text-dark */
}

.fc-day-selected {
  /* Original was: rgba(vars.$calendiary-primary, 0.1) */
  background-color: rgba(128, 203, 196, 0.1) !important; /* rgba(80CBC4, 0.1) */
  border: 1px solid #80CBC4 !important; /* was vars.$calendiary-primary */
}

.fc .fc-timegrid-slot {
  height: 2.5em;
}

.fc .fc-timegrid-slot-label {
  padding-right: calc(var(--spacing-unit) / 2);
  color: #424242; /* was vars.$calendiary-text-dark */
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
  /* Original was: rgba(vars.$calendiary-text-light, 0.2) */
  background-color: rgba(255, 255, 255, 0.2) !important; /* rgba(FFFFFF, 0.2) */
  color: #FFFFFF !important; /* was vars.$calendiary-text-light */
}
.v-input--density-compact .v-field__input {
  color: #FFFFFF !important; /* was vars.$calendiary-text-light */
}
.v-input--density-compact .v-field__label {
  /* Original was: rgba(vars.$calendiary-text-light, 0.7) */
  color: rgba(255, 255, 255, 0.7) !important; /* rgba(FFFFFF, 0.7) */
}
.v-input--density-compact .v-icon {
  color: #FFFFFF !important; /* was vars.$calendiary-text-light */
}
</style>