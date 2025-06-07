<template>
  <v-container fluid class="pa-0">
    <v-toolbar :color="calendiaryPrimary" flat dark>
      <v-toolbar-title class="ml-4 text-h5">CalenDiary</v-toolbar-title>
      <v-spacer></v-spacer>

      <CountrySelector class="ml-2 mr-4" />

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

import calendarService from '@/services/calendarService';
import { useStore } from 'vuex';
import CountrySelector from '@/components/User/CountrySelector.vue';

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

const events = ref([]); // Stores fetched user calendar events
const calendiaryPrimary = computed(() => 'calendiary-primary');

const store = useStore();

const userCountryCode = computed(() => store.getters['user/countryCode']);
const formattedHolidays = computed(() => store.getters['holidays/formattedHolidays']);


/**
 * Formats a Date object into a 'YYYY-MM-DD' string for route parameters.
 * @param {Date} date - The date object to format.
 * @returns {string} The formatted date string.
 */
const formatDateForRoute = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Handles clicks on empty date slots, navigating to the add event page.
 * @param {Object} clickInfo - FullCalendar click information object.
 */
function handleDateClick(clickInfo) {
  const formattedDate = formatDateForRoute(clickInfo.date);
  router.push(`/add-event/${formattedDate}`);
}

/**
 * Handles clicks on existing events, navigating to the edit event page.
 * @param {Object} clickInfo - FullCalendar event click information object.
 */
const handleEventClick = (clickInfo) => {
  const eventId = clickInfo.event.id;
  if (eventId) {
    router.push(`/edit-event/${eventId}`);
  } else {
    console.warn('Clicked event has no ID:', clickInfo.event);
    alert('Cannot edit event: Event ID is missing.');
  }
};


/**
 * Fetches user events from the backend and updates the calendar's event source.
 */
const fetchEvents = async () => {
  try {
    const fetchedEvents = await calendarService.getAllEvents();
    // Map backend event structure to FullCalendar event object structure
    events.value = fetchedEvents.map(event => ({
      id: event.id,
      title: event.title,
      start: event.startTime,
      end: event.endTime,
      allDay: false,
      extendedProps: {
        description: event.description,
        location: event.fullAddress || event.locationName || null, // Prefer fullAddress
        labels: event.labels,
        diaryEntry: event.diaryEntry,
        moodRating: event.moodRating,
        userId: event.userId,
      },
      classNames: ['user-event'] // Add class for custom styling
    }));
  } catch (error) {
    console.error('Failed to fetch user events from backend:', error.response ? error.response.data : error.message);
    alert('Failed to load user events. Please ensure you are logged in and the backend is running.');
  }
};


// Combines user events and fetched holidays for calendar display.
const combinedEvents = computed(() => {
  const userEventsArray = Array.isArray(events.value) ? events.value : [];
  const holidayEventsArray = Array.isArray(formattedHolidays.value) ? formattedHolidays.value : [];

  // Add class for holiday events for custom styling
  const holidaysWithClass = holidayEventsArray.map(holiday => ({
    ...holiday,
    classNames: [...(holiday.classNames || []), 'holiday-event']
  }));

  return [...userEventsArray, ...holidaysWithClass];
});


// FullCalendar options configuration
const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
  initialView: currentView.value,
  locale: enLocale,
  timeZone: 'UTC',
  headerToolbar: false,
  datesSet: (dateInfo) => { // Callback when calendar dates/view change
    const calendarApi = fullCalendarRef.value?.getApi();
    if (calendarApi) {
      calendarTitle.value = calendarApi.getCurrentData().viewTitle;
      const year = new Date(dateInfo.start).getFullYear();
      store.dispatch('holidays/fetchHolidays', year);
      fetchEvents(); // Re-fetch user events for the new date range/view
    }
  },
  editable: true,
  selectable: true,
  dateClick: handleDateClick,
  eventClick: handleEventClick,
  events: combinedEvents, // Use computed property for reactivity
  eventChange: async (changeInfo) => {
    // Prevent editing of public holidays
    if (changeInfo.event.classNames.includes('holiday-event')) {
      alert('Public holidays cannot be edited.');
      changeInfo.revert();
      return;
    }

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
    } catch (error) {
      console.error('Failed to update event on backend:', error.response ? error.response.data : error.message);
      alert('Failed to update event. Please refresh and try again.');
      changeInfo.revert();
    }
  },
  dayHeaders: true,
  slotMinTime: '08:00:00',
  slotMaxTime: '22:00:00',
  nowIndicator: true,
  height: 'auto',
  // Custom event content rendering to include location for user events
  eventContent: function (arg) {
    let html = `${arg.event.title}`;
    if (arg.event.classNames.includes('user-event') && arg.event.extendedProps.location) {
      html += `<div class="event-location">${arg.event.extendedProps.location}</div>`;
    }
    return { html: html };
  },
});

// Watch for changes in currentView and update FullCalendar view.
watch(currentView, (newViewValue) => {
  const calendarApi = fullCalendarRef.value?.getApi();
  if (calendarApi) {
    calendarApi.changeView(newViewValue);
  }
});

/** Navigates the calendar to the previous period (month, week, or day). */
const goToPrev = () => fullCalendarRef.value?.getApi().prev();
/** Navigates the calendar to the next period (month, week, or day). */
const goToNext = () => fullCalendarRef.value?.getApi().next();
/** Navigates the calendar to today's date. */
const goToToday = () => fullCalendarRef.value?.getApi().today();

// Watch for changes in user country code to re-fetch holidays.
watch(userCountryCode, (newCountryCode, oldCountryCode) => {
  if (newCountryCode && newCountryCode !== oldCountryCode) {
    console.log(`User country changed from ${oldCountryCode} to ${newCountryCode}. Reloading holidays.`);
    const calendarApi = fullCalendarRef.value?.getApi();
    if (calendarApi) {
      const year = new Date(calendarApi.view.currentStart).getFullYear();
      store.dispatch('holidays/fetchHolidays', year);
    }
  }
});

// On component mount, initialize calendar title and fetch events/holidays.
onMounted(() => {
  const calendarApi = fullCalendarRef.value?.getApi();
  if (calendarApi) {
    calendarTitle.value = calendarApi.getCurrentData().viewTitle;
    const year = new Date(calendarApi.view.currentStart).getFullYear();
    store.dispatch('holidays/fetchHolidays', year);
  }
  fetchEvents();
});
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';
// Keep global FullCalendar overrides in a separate file, e.g., fullcalendar-overrides.scss

.full-calendar-wrapper {
  background-color: #FFFFFF;
  border-radius: var(--border-radius-base);
  box-shadow: var(--box-shadow-light);
  padding: 0 !important;
  margin: 24px auto;
  max-width: 900px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.full-calendar-wrapper .fc {
  flex-grow: 1;
}

.fc .fc-daygrid-day-frame {
  padding: 4px;
  border-radius: calc(var(--border-radius-base) / 2);
  transition: background-color 0.2s ease;
}

.fc-theme-standard td,
.fc-theme-standard th {
  border-color: rgba(0, 0, 0, 0.08) !important;
}

.fc .fc-daygrid-day-frame:hover {
  background-color: #F8F8F8 !important;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.fc .fc-day-today {
  background-color: #E0F2F7 !important;
  border: 1px solid #90CAF9 !important;
  border-radius: calc(var(--border-radius-base) / 2);
  position: relative;
}

.fc .fc-day-today::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background-color: var(--calendiary-primary);
  border-top-left-radius: calc(var(--border-radius-base) / 2);
  border-bottom-left-radius: calc(var(--border-radius-base) / 2);
}

.fc-event {
  border-radius: 6px !important;
  border: none !important;
  padding: 2px 6px !important;
  margin-bottom: 2px !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

// Styles for user events
.fc-event.user-event {
  background-color: #80CBC4 !important;
  color: #000000 !important;
}

// Styles for holiday events
.fc-event.holiday-event {
  background-color: #f7d9d9 !important;
  color: #c00000 !important;
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
  background-color: rgba(128, 203, 196, 0.2) !important;
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

.v-toolbar .v-select.country-selector {
  .v-field--variant-solo-filled {
    background-color: rgba(255, 255, 255, 0.2) !important;
  }

  .v-field__input {
    color: #FFFFFF !important;
  }

  .v-field__label {
    color: rgba(255, 255, 255, 0.7) !important;
  }

  .v-icon {
    color: #FFFFFF !important;
  }
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