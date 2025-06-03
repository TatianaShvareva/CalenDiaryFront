<template>
  <div class="add-edit-event-view">
    <v-container fluid class="py-6 px-4">
      <h1 class="text-h5 text-sm-h5 text-xs-h6 mb-6 text-center text-md-left">
        {{ isEditMode ? 'Edit Event' : 'What is your day today?' }} - {{ formattedSelectedDate }}
      </h1>

      <v-row>
        <v-col cols="12" md="4" class="d-none d-md-flex align-self-start">
          <CalendarSidebar :initial-date="sidebarInitialDate" :on-date-click="handleMiniCalendarDateClick"
            :events="allCalendarEvents" class="flex-grow-1" />
        </v-col>
        <v-col cols="12" md="8">
          <v-card flat class="pa-4 pa-sm-6 elevation-1 pb-6">
            <div class="event-form">
              <v-text-field label="Event Title" v-model="eventTitle" variant="outlined" density="comfortable"
                hide-details="auto"></v-text-field>

              <div class="time-pickers">
                <v-col cols="12" sm="6" md="4" class="pa-0">
                  <TimePicker label="From" v-model="fromTime" density="comfortable" variant="outlined"
                    hide-details="auto" />
                </v-col>
                <v-col cols="12" sm="6" md="5" class="pa-0">
                  <DateAndTimePicker v-model="untilDateTime" label="Until" density="comfortable" variant="outlined"
                    hide-details="auto" />
                </v-col>
              </div>

              <v-text-field label="Location" v-model="location" variant="outlined" density="comfortable"
                hide-details="auto"></v-text-field>

              <v-textarea label="Description" v-model="description" variant="outlined" density="comfortable"
                hide-details="auto" rows="3"></v-textarea>

              <EventTags v-model="selectedTags" :available-tags="availableTags" />

              <MoodOMeter v-model="mood" />

              <v-textarea label="Diary" v-model="diaryEntry" variant="outlined" density="comfortable"
                rows="4"></v-textarea>

              <v-btn color="primary" class="mt-4" block @click="saveEvent">
                {{ isEditMode ? 'Update Event' : 'Create Event' }}
              </v-btn>
              <v-btn v-if="isEditMode" color="error" class="mt-2" block @click="deleteEvent">Delete Event</v-btn>
              <v-btn color="grey" class="mt-2" block @click="cancel">Cancel</v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { format } from 'date-fns';

// Import components
import CalendarSidebar from '@/components/CalendarEvents/CalendarSidebar.vue';
import TimePicker from '@/components/CalendarEvents/TimePicker.vue';
import DateAndTimePicker from '@/components/CalendarEvents/DateAndTimePicker.vue';
import EventTags from '@/components/CalendarEvents/EventTags.vue';
import MoodOMeter from '@/components/CalendarEvents/MoodOMeter.vue';

// Import service for API calls
import calendarService from '@/services/calendarService';

const route = useRoute(); // Access current route
const router = useRouter(); // Access router for navigation

// Reactive state variables for event form
const eventId = ref(null);
const selectedDate = ref(null); // Initialized in onMounted based on route/current date
const fromTime = ref('09:00'); // Default start time
const untilDateTime = ref(''); // Default end date and time

const eventTitle = ref('');
const location = ref('');
const description = ref('');
const selectedTags = ref([]);
const availableTags = ref([
  'Study',
  'Work',
  'Personal Appointment',
  'Healthcare',
  'Sport Activity',
  'Travel',
  'Other',
]);
const mood = ref(null);
const diaryEntry = ref('');

const allCalendarEvents = ref([]); // Stores events fetched for CalendarSidebar

// Computed property to determine if the component is in edit mode
const isEditMode = computed(() => !!eventId.value);

// Computed property to format the selected date for display in the header
const formattedSelectedDate = computed(() => {
  if (!selectedDate.value) return '';
  const dateObj = new Date(selectedDate.value);
  return format(dateObj, 'd MMMM'); // e.g., "31 May"
});

// Computed property to provide the initial date for the CalendarSidebar
const sidebarInitialDate = computed(() => {
  const dateFromRoute = route.params.date;
  let dateToFormat;

  if (dateFromRoute) {
    dateToFormat = new Date(dateFromRoute + 'T00:00:00');
  } else {
    dateToFormat = new Date();
  }
  return format(dateToFormat, 'yyyy-MM-dd');
});


/**
 * Initializes the 'from' and 'until' time pickers for a new event.
 * @param {string} dateString - The date in 'YYYY-MM-DD' format.
 */
const initializeTimesForNewEvent = (dateString) => {
  const dateObj = new Date(dateString);
  if (!isNaN(dateObj.getTime())) {
    const hour = String(dateObj.getHours()).padStart(2, '0');
    const minute = String(dateObj.getMinutes()).padStart(2, '0');
    fromTime.value = `${hour}:${minute}`;

    // Set end time to 1 hour after start time for new events
    const initialEndDate = new Date(dateObj.getTime() + 60 * 60 * 1000);
    untilDateTime.value = format(initialEndDate, "yyyy-MM-dd'T'HH:mm");
  } else {
    console.error('Failed to parse date for time pickers:', dateString);
    fromTime.value = '09:00';
    // Fallback: Use current date + 1 hour if dateString is invalid
    untilDateTime.value = format(new Date(new Date().setHours(new Date().getHours() + 1)), "yyyy-MM-dd'T'HH:mm");
  }
};

/**
 * Handles date clicks on the mini calendar (CalendarSidebar).
 * Updates selectedDate and initializes times if it's a new event.
 * @param {Object} arg - FullCalendar date click argument object.
 */
function handleMiniCalendarDateClick(arg) {
  selectedDate.value = arg.dateStr; // arg.dateStr is already 'YYYY-MM-DD'
  if (!isEditMode.value) {
    initializeTimesForNewEvent(arg.dateStr);
  }
}

/**
 * Fetches all calendar events from the backend to populate the sidebar.
 */
const fetchAllEvents = async () => {
  try {
    const events = await calendarService.getAllEvents();
    allCalendarEvents.value = events.map(event => ({
      id: event.id,
      title: event.title,
      start: event.startTime,
      end: event.endTime,
      // Map other FullCalendar compatible properties if needed
    }));
    console.log('Fetched and formatted all calendar events for sidebar:', allCalendarEvents.value);
  } catch (error) {
    console.error('Failed to fetch all events for sidebar:', error.response ? error.response.data : error.message);
  }
};

/**
 * Loads event data from the backend for editing an existing event.
 * @param {string} id - The ID of the event to load.
 */
const loadEventForEdit = async (id) => {
  try {
    const event = await calendarService.getEventById(id);
    eventTitle.value = event.title;
    description.value = event.description;
    location.value = event.location;
    selectedTags.value = event.labels || [];
    mood.value = event.moodRating;
    diaryEntry.value = event.diaryEntry;

    if (event.startTime) {
      const startDateTime = new Date(event.startTime);
      selectedDate.value = format(startDateTime, 'yyyy-MM-dd'); // Set the selected date
      fromTime.value = format(startDateTime, 'HH:mm');
    }
    if (event.endTime) {
      untilDateTime.value = format(new Date(event.endTime), "yyyy-MM-dd'T'HH:mm");
    } else {
      // Fallback: if endTime is missing, set to 1 hour after startTime
      if (event.startTime) {
        const startDateTime = new Date(event.startTime);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
        untilDateTime.value = format(endDateTime, "yyyy-MM-dd'T'HH:mm");
      }
    }
  } catch (error) {
    console.error(`Failed to load event with ID ${id}:`, error.response ? error.response.data : error.message);
    alert(`Failed to load event. Error: ${error.response?.data || error.message}`);
    router.push('/calendars'); // Redirect if event load fails
  }
};

/**
 * Saves or updates an event based on the current mode (create/edit).
 */
const saveEvent = async () => {
  // Combine selected date and time for startTime
  const combinedStartTimeStr = `${selectedDate.value}T${fromTime.value}`;
  const startTime = new Date(combinedStartTimeStr);
  const endTime = new Date(untilDateTime.value); // untilDateTime.value is already in 'YYYY-MM-DDTHH:mm' format

  // Input validation
  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    alert('Invalid date or time. Please check your inputs.');
    return;
  }
  if (endTime < startTime) {
    alert('End time cannot be earlier than start time. Please adjust.');
    return;
  }

  console.log('untilDateTime.value before saving:', untilDateTime.value);

  const eventPayload = {
    title: eventTitle.value,
    description: description.value,
    startTime: format(startTime, "yyyy-MM-dd'T'HH:mm:ss"), // ISO 8601 with seconds
    endTime: format(endTime, "yyyy-MM-dd'T'HH:mm:ss"),   // ISO 8601 with seconds
    location: location.value,
    labels: selectedTags.value,
    diaryEntry: diaryEntry.value,
    moodRating: mood.value,
  };

  try {
    if (isEditMode.value) {
      await calendarService.updateEvent(eventId.value, eventPayload);
      alert('Event updated successfully!');
    } else {
      await calendarService.createEvent(eventPayload);
      alert('Event created successfully!');
    }
    router.push('/calendars'); // Redirect to calendars page after successful save
  } catch (error) {
    console.error('Failed to save event:', error.response ? error.response.data : error.message);
    alert(`Failed to save event. Error: ${error.response?.data || error.message}`);
  }
};

/**
 * Deletes the current event if in edit mode.
 */
const deleteEvent = async () => {
  if (confirm('Are you sure you want to delete this event?')) {
    try {
      await calendarService.deleteEvent(eventId.value);
      alert('Event deleted successfully!');
      router.push('/calendars'); // Redirect to calendars page after deletion
    } catch (error) {
      console.error('Failed to delete event:', error.response ? error.response.data : error.message);
      alert(`Failed to delete event. Error: ${error.response?.data || error.message}`);
    }
  }
};

/**
 * Cancels the current operation and navigates back to the calendars page.
 */
const cancel = () => {
  router.push('/calendars');
};

// Lifecycle hook: executed after component is mounted to the DOM
onMounted(async () => {
  // 1. Initialize selectedDate based on route params or current date
  if (route.params.date) {
    selectedDate.value = String(route.params.date); // Set selectedDate from route
    console.log('AddEditEventView: Initial selectedDate from route for creation:', selectedDate.value);
  } else {
    selectedDate.value = format(new Date(), 'yyyy-MM-dd'); // Default to current date
    console.warn('AddEditEventView: No date provided in route params. Using default today.');
  }

  // 2. Fetch all events for the CalendarSidebar
  await fetchAllEvents();

  // 3. Handle event loading (if in edit mode) or time initialization (if creating new event)
  if (route.params.id) {
    eventId.value = route.params.id;
    await loadEventForEdit(eventId.value); // Load all event data
  } else {
    // If not in edit mode (i.e., creating a new event)
    initializeTimesForNewEvent(selectedDate.value);
  }
});

// Watcher for selectedDate changes (e.g., when clicking dates in CalendarSidebar)
watch(selectedDate, (newDate) => {
  if (newDate) {
    // No direct action needed here for sidebar, as sidebarInitialDate is computed
    // and CalendarSidebar's internal watch handles prop changes.
    // This watcher primarily helps in debugging or if more complex logic is needed
    // when selectedDate changes from user interaction within this component.
  }
});
</script>

<style scoped>
/* Scoped styles for this component */
.add-edit-event-view {
  background-color: #f5f5f5;
}

.event-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 600px;
  width: 100%;
}

.time-pickers {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-start;;
}

.v-btn {
  text-transform: none;
}
</style>