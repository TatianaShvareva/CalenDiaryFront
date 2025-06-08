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

              <LocationAutocomplete v-model="locationName" :initial-location-data="initialLocationData"
                @location-selected="handleLocationSelected" />

              <v-textarea label="Description" v-model="description" variant="outlined" density="comfortable"
                hide-details="auto" rows="3"></v-textarea>

              <EventTags v-model="selectedTags" :all-labels="allAvailableLabels" /> 
              
              <v-btn 
                variant="outlined" 
                color="info" 
                class="mt-1" 
                block 
                @click="showManageLabelsDialog = true"
              >
                Manage Labels
              </v-btn>

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

    <ManageLabelsDialog 
      v-model="showManageLabelsDialog" 
      :labels="allAvailableLabels"
      @labels-changed="handleLabelsChanged"
    />
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
import LocationAutocomplete from '@/components/CalendarEvents/LocationAutocomplete.vue';
import ManageLabelsDialog from '@/components/CalendarEvents/ManageLabelsDialog.vue';

// Import service for API calls
import calendarService from '@/services/calendarService';
import labelService from '@/services/labelService';

const route = useRoute();
const router = useRouter();

const eventId = ref(null);
const selectedDate = ref(null);
const fromTime = ref('09:00');
const untilDateTime = ref('');

const eventTitle = ref('');
const locationName = ref('');
const fullAddress = ref('');
const latitude = ref(null);
const longitude = ref(null);

const initialLocationData = ref({});

const description = ref('');
const selectedTags = ref([]);
const allAvailableLabels = ref([]);

const mood = ref(null);
const diaryEntry = ref('');

const allCalendarEvents = ref([]);

const showManageLabelsDialog = ref(false);

const isEditMode = computed(() => !!eventId.value);

const formattedSelectedDate = computed(() => {
  if (!selectedDate.value) return '';
  const dateObj = new Date(selectedDate.value);
  return format(dateObj, 'd MMMM');
});

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
 * Initializes 'fromTime' and 'untilDateTime' based on the selected date.
 * For new events, sets a default start time and an end time one hour later.
 * @param {string} dateString - The selected date in 'YYYY-MM-DD' format.
 */
const initializeTimesForNewEvent = (dateString) => {
  const dateObj = new Date(dateString);
  if (!isNaN(dateObj.getTime())) {
    const hour = String(dateObj.getHours()).padStart(2, '0');
    const minute = String(dateObj.getMinutes()).padStart(2, '0');
    fromTime.value = `${hour}:${minute}`;

    const initialEndDate = new Date(dateObj.getTime() + 60 * 60 * 1000);
    untilDateTime.value = format(initialEndDate, "yyyy-MM-dd'T'HH:mm");
  } else {
    console.error('Failed to parse date for time pickers:', dateString);
    fromTime.value = '09:00';
    untilDateTime.value = format(new Date(new Date().setHours(new Date().getHours() + 1)), "yyyy-MM-dd'T'HH:mm");
  }
};

/**
 * Handles date clicks from the mini calendar sidebar.
 * Updates the selected date and initializes times if not in edit mode.
 * @param {object} arg - Object containing the clicked date string.
 */
function handleMiniCalendarDateClick(arg) {
  selectedDate.value = arg.dateStr;
  if (!isEditMode.value) {
    initializeTimesForNewEvent(arg.dateStr);
  }
}

/**
 * Handles location selection from the autocomplete component.
 * Updates location-related reactive variables.
 * @param {object} selectedLocation - Object containing location details.
 */
const handleLocationSelected = (selectedLocation) => {
  if (selectedLocation) {
    locationName.value = selectedLocation.locationName;
    fullAddress.value = selectedLocation.fullAddress;
    latitude.value = selectedLocation.latitude;
    longitude.value = selectedLocation.longitude;
  } else {
    locationName.value = '';
    fullAddress.value = '';
    latitude.value = null;
    longitude.value = null;
  }
};

/**
 * Fetches all calendar events for display in the sidebar.
 */
const fetchAllEvents = async () => {
  try {
    const events = await calendarService.getAllEvents();
    allCalendarEvents.value = events.map(event => ({
      id: event.id,
      title: event.title,
      start: event.startTime,
      end: event.endTime,
    }));
    console.log('Fetched and formatted all calendar events for sidebar:', allCalendarEvents.value);
  } catch (error) {
    console.error('Failed to fetch all events for sidebar:', error.response ? error.response.data : error.message);
  }
};

/**
 * Fetches all available labels from the backend.
 */
const fetchAllLabels = async () => {
  try {
    const labels = await labelService.getAllLabels();
    allAvailableLabels.value = labels;
    console.log('Fetched all available labels:', labels);
  } catch (error) {
    console.error('Failed to fetch all available labels:', error);
  }
};

/**
 * Handler for when labels are changed in the ManageLabelsDialog.
 * Re-fetches labels and reloads event data if in edit mode.
 */
const handleLabelsChanged = async () => {
  await fetchAllLabels();
  if (isEditMode.value) {
    await loadEventForEdit(eventId.value);
  }
};

/**
 * Loads event data for editing based on event ID.
 * @param {string} id - The ID of the event to load.
 */
const loadEventForEdit = async (id) => {
  try {
    const event = await calendarService.getEventById(id);
    eventId.value = event.id;
    eventTitle.value = event.title;
    description.value = event.description;
    locationName.value = event.locationName;
    fullAddress.value = event.fullAddress;
    latitude.value = event.latitude;
    longitude.value = event.longitude;

    initialLocationData.value = {
      locationName: event.locationName,
      fullAddress: event.fullAddress,
      latitude: event.latitude,
      longitude: event.longitude,
    };

    if (event.labels && Array.isArray(event.labels)) {
        selectedTags.value = event.labels
            .map(labelName => allAvailableLabels.value.find(l => l.name === labelName))
            .filter(label => label);
    } else {
        selectedTags.value = [];
    }
    
    mood.value = event.moodRating;
    diaryEntry.value = event.diaryEntry;

    if (event.startTime) {
      const startDateTime = new Date(event.startTime);
      selectedDate.value = format(startDateTime, 'yyyy-MM-dd');
      fromTime.value = format(startDateTime, 'HH:mm');
    }
    if (event.endTime) {
      untilDateTime.value = format(new Date(event.endTime), "yyyy-MM-dd'T'HH:mm");
    } else {
      // If endTime is missing but startTime exists, default endTime to 1 hour after startTime
      if (event.startTime) {
        const startDateTime = new Date(event.startTime);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
        untilDateTime.value = format(endDateTime, "yyyy-MM-dd'T'HH:mm");
      }
    }
  } catch (error) {
    console.error(`Failed to load event with ID ${id}:`, error.response ? error.response.data : error.message);
    alert(`Failed to load event. Error: ${error.response?.data || error.message}`);
    router.push('/calendars');
  }
};

/**
 * Saves the event (creates a new one or updates an existing one).
 */
const saveEvent = async () => {
  const combinedStartTimeStr = `${selectedDate.value}T${fromTime.value}`;
  const startTime = new Date(combinedStartTimeStr);
  const endTime = new Date(untilDateTime.value);

  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    alert('Invalid date or time. Please check your inputs.');
    return;
  }
  if (endTime < startTime) {
    alert('End time cannot be earlier than start time. Please adjust.');
    return;
  }
  if (!eventTitle.value) {
    alert('Event Title is required.');
    return;
  }

  console.log('untilDateTime.value before saving:', untilDateTime.value);

  const eventPayload = {
    title: eventTitle.value,
    description: description.value,
    startTime: format(startTime, "yyyy-MM-dd'T'HH:mm:ss"),
    endTime: format(endTime, "yyyy-MM-dd'T'HH:mm:ss"),
    locationName: locationName.value,
    fullAddress: fullAddress.value,
    latitude: latitude.value,
    longitude: longitude.value,
    labels: selectedTags.value.map(label => label.name), 
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
    router.push('/calendars');
  } catch (error) {
    console.error('Failed to save event:', error.response ? error.response.data : error.message);
    alert(`Failed to save event. Error: ${error.response?.data || error.message}`);
  }
};

/**
 * Deletes the current event.
 */
const deleteEvent = async () => {
  if (confirm('Are you sure you want to delete this event?')) {
    try {
      await calendarService.deleteEvent(eventId.value);
      alert('Event deleted successfully!');
      router.push('/calendars');
    } catch (error) {
      console.error('Failed to delete event:', error.response ? error.response.data : error.message);
      alert(`Failed to delete event. Error: ${error.response?.data || error.message}`);
    }
  }
};

/**
 * Redirects to the calendar view without saving changes.
 */
const cancel = () => {
  router.push('/calendars');
};

onMounted(async () => {
  // Determine the initial selected date for the event form
  if (route.params.date) {
    selectedDate.value = String(route.params.date);
    console.log('AddEditEventView: Initial selectedDate from route for creation:', selectedDate.value);
  } else {
    selectedDate.value = format(new Date(), 'yyyy-MM-dd');
    console.warn('AddEditEventView: No date provided in route params. Using default today.');
  }

  // Fetch all labels and events for initial component setup
  await fetchAllLabels(); 
  await fetchAllEvents();

  // If an event ID is present in the route, load event data for editing
  if (route.params.id) {
    eventId.value = route.params.id;
    await loadEventForEdit(eventId.value);
  } else {
    // If no event ID, initialize times for a new event
    initializeTimesForNewEvent(selectedDate.value);
  }
});

// Watch selectedDate for any changes, though no direct action is strictly needed here for the sidebar.
watch(selectedDate, (newDate) => {
  if (newDate) {
    // sidebarInitialDate is a computed property, so it will react to selectedDate changes automatically.
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
  align-items: flex-start;
  ;
}

.v-btn {
  text-transform: none;
}
</style>