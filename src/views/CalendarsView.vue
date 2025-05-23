<template>
  <div>
    <v-sheet class="d-flex" height="54" tile>
      <v-select
        v-model="currentView"
        :items="calendarViews"
        class="ma-2"
        density="compact"
        label="View"
        variant="outlined"
        hide-details
      ></v-select>
    </v-sheet>
    <v-sheet class="pa-4">
      <FullCalendar :options="calendarOptions" ref="fullCalendarRef" />
    </v-sheet>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'; // Added onMounted
import { useRouter } from 'vue-router';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // Needed for dateClick, selectable, editable
import listPlugin from '@fullcalendar/list';
import enLocale from '@fullcalendar/core/locales/en-gb.js'; // English (Great Britain) locale

// CSS imports for FullCalendar (ensure these are correctly pathed or handled by your build system)
// Depending on your setup, you might have these globally or need to import them here.
// import '@fullcalendar/core/main.css'; // Example
// import '@fullcalendar/daygrid/main.css'; // Example
// For now, assuming your project handles CSS loading as per your original setup.

const router = useRouter();
const fullCalendarRef = ref(null); // Template ref to access FullCalendar component API

const currentView = ref('dayGridMonth'); // Default calendar view
const calendarViews = ref([
  { title: 'Month', value: 'dayGridMonth' },
  { title: 'Week', value: 'timeGridWeek' },
  { title: 'Day', value: 'timeGridDay' },
  { title: 'List', value: 'listWeek' },
]);

// --- LocalStorage Event Management ---
const LOCAL_STORAGE_EVENTS_KEY = 'calendiary-events'; // Key for storing events in localStorage

// Function to get initial/default events if localStorage is empty or data is corrupted
const getInitialDefaultEvents = () => {
  // These are example events if nothing is found in localStorage.
  // You can change this to return an empty array [] if you prefer to start with no default events.
  return [
    { id: 'default1', title: 'Default Sample Meeting', start: '2025-05-28T10:30:00', end: '2025-05-28T12:30:00' },
    { id: 'default2', title: 'Default Birthday Party', date: '2025-06-05' }, // An all-day event
  ];
};

// Function to load events from localStorage
const loadEventsFromLocalStorage = () => {
  const savedEventsJson = localStorage.getItem(LOCAL_STORAGE_EVENTS_KEY);
  if (savedEventsJson) {
    try {
      const parsedEvents = JSON.parse(savedEventsJson);
      // Basic validation: ensure it's an array before returning
      return Array.isArray(parsedEvents) ? parsedEvents : getInitialDefaultEvents();
    } catch (error) {
      console.error('Error parsing events from localStorage:', error);
      // Fallback to default events if parsing fails
      return getInitialDefaultEvents();
    }
  }
  // If no events are found in localStorage, return the default set
  return getInitialDefaultEvents();
};

// Reactive reference holding the array of events
const localEvents = ref(loadEventsFromLocalStorage());

// Reactive FullCalendar options
const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
  initialView: currentView.value,
  locale: enLocale,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
  },
  editable: true,     // IMPORTANT: Allows events to be dragged and resized.
                      // This will trigger eventChange callback.
  selectable: true,   // Allows date/time selection by clicking and dragging.
  dateClick: handleDateClick, // Handles clicks on a date cell.
  events: localEvents.value,  // Sets the initial event source. This will be kept in sync by the watcher.

  // Callbacks for event mutations done via the FullCalendar UI
  eventChange: (changeInfo) => { // Called when an event is dragged, resized, or mutated.
    console.log('Event changed (UI):', changeInfo.event.title);
    const eventIndex = localEvents.value.findIndex(e => e.id === changeInfo.event.id);
    if (eventIndex !== -1) {
      // Update the event in our localEvents array.
      // FullCalendar event objects (changeInfo.event) have properties like startStr, endStr, allDay.
      // Map these back to your event object structure.
      localEvents.value.splice(eventIndex, 1, {
        id: changeInfo.event.id,
        title: changeInfo.event.title,
        start: changeInfo.event.startStr,
        end: changeInfo.event.endStr,
        allDay: changeInfo.event.allDay,
        // Include any other custom properties your events have
      });
      // The watch on localEvents will handle saving to localStorage.
    }
  },
  // Add eventRemove if you allow deletion directly from the calendar UI (e.g., via eventContent or some other mechanism)
  // eventRemove: (removeInfo) => { ... }
});

// Watch for changes in the 'currentView' (Month, Week, Day selection)
watch(currentView, (newViewValue) => {
  // Use FullCalendar's API to change the view
  const calendarApi = fullCalendarRef.value?.getApi();
  if (calendarApi) {
    calendarApi.changeView(newViewValue);
  } else {
    // Fallback if API is not ready (e.g., on initial load before mount), though less common for view changes.
    calendarOptions.value.initialView = newViewValue;
  }
});

// Watch for changes in 'localEvents' array (e.g., new event added, event updated)
watch(localEvents, (newEventsValue) => {
  // Save the updated events array to localStorage
  localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(newEventsValue));

  // Ensure FullCalendar's internal events are updated.
  // While assigning localEvents.value to calendarOptions.events initially links them,
  // explicitly updating can be safer depending on FullCalendar's reactivity details.
  if (calendarOptions.value.events !== newEventsValue) {
     calendarOptions.value.events = newEventsValue;
  }
}, { deep: true }); // 'deep: true' is crucial for watching changes within an array or objects inside it.

// Handler for when a date on the calendar is clicked
function handleDateClick(clickInfo) {
  const formattedDate = formatDateForRoute(clickInfo.date);
  router.push(`/add-event/${formattedDate}`);
  // After navigating to '/add-event/...', that view/component will be responsible
  // for creating the event details. Once created, it needs to communicate
  // the new event back to this CalendarsView (e.g., via Pinia state management or an event bus)
  // which would then update the `localEvents` ref.
}

// Utility function to format a Date object into 'YYYY-MM-DD' string
const formatDateForRoute = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // JavaScript months are 0-indexed.
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// --- How new events are added (conceptual) ---
// The actual addition of a new event will likely happen in your AddEventView.
// That view, upon saving an event, should trigger an update to `localEvents`.
// Example (this function would be part of a shared store like Pinia, or callable via event bus):
/*
function externallyAddNewEvent(eventData) {
  const newEvent = {
    id: Date.now().toString(), // Generate a simple unique ID
    title: eventData.title,
    start: eventData.start,
    end: eventData.end,
    allDay: eventData.allDay || false,
    // ... any other properties
  };
  localEvents.value.push(newEvent); // This will trigger the watcher to save to localStorage
}
*/

// onMounted hook (called after the component is mounted)
onMounted(() => {
  // You can perform actions here once the calendar is potentially rendered.
  // For instance, if you needed to interact with the calendar's API on load.
  // console.log('CalendarsView component mounted. FullCalendar ref:', fullCalendarRef.value);
});

</script>

<style scoped>
/* Styles from your original code */
.fc-daygrid-day-frame {
  /* Container for day number and events */
  padding: 0.5em;
  /* Reduce padding */
}

.fc-daygrid-day-top {
  /* Top part of the cell with the day number */
  min-height: 1.5em;
  /* Reduce minimum height */
}

.fc-daygrid-event {
  /* Style for events */
  font-size: 0.8em;
  /* Reduce event font size */
  padding: 0.2em;
  /* Reduce event padding */
  margin-bottom: 0.1em;
  /* Reduce margin between events */
}

/* Vuetify specific class for margin, ensure it's styled as intended or override if needed */
.ma-2 {
  min-width: 150px; /* Example to ensure select has some width */
}
</style>