<template>
  <div class="add-edit-event-view">
    <v-container fluid class="py-6 px-4">
      <h1 class="text-h5 mb-6 text-center text-md-left">
        {{ isEditMode ? 'Edit Event' : 'What is your day today?' }} - {{ formattedSelectedDate }}
      </h1>

      <v-row>
        <v-col cols="12" md="4" class="d-flex align-self-start">
          <CalendarSidebar
            :initial-date="selectedDate"
            :on-date-click="handleMiniCalendarDateClick"
            :events="allCalendarEvents"
            class="flex-grow-1"
          />
        </v-col>
        <v-col cols="12" md="8">
          <v-card flat class="pa-4 pa-sm-6 elevation-1">
            <div class="event-form">
              <v-text-field
                label="Event Title"
                v-model="eventTitle"
                variant="outlined"
                density="comfortable"
                hide-details
              ></v-text-field>

              <div class="time-pickers">
                <TimePicker
                  label="From"
                  v-model="fromTime"
                  density="comfortable"
                  variant="outlined"
                  style="max-width: 170px;"
                />
                <DateAndTimePicker
                  v-model="untilDateTime"
                  label="Until"
                  density="comfortable"
                  variant="outlined"
                  style="max-width: 220px;"
                />
              </div>

              <v-text-field
                label="Location"
                v-model="location"
                variant="outlined"
                density="comfortable"
                hide-details
              ></v-text-field>

              <v-textarea
                label="Description"
                v-model="description"
                variant="outlined"
                density="comfortable"
                hide-details
                rows="3"
              ></v-textarea>

              <EventTags v-model="selectedTags" :available-tags="availableTags" />

              <MoodOMeter v-model="mood" />

              <v-textarea
                label="Diary"
                v-model="diaryEntry"
                variant="outlined"
                density="comfortable"
                rows="4"
              ></v-textarea>

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
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { format } from 'date-fns';

import CalendarSidebar from '@/components/CalendarEvents/CalendarSidebar.vue';
import TimePicker from '@/components/CalendarEvents/TimePicker.vue';
import DateAndTimePicker from '@/components/CalendarEvents/DateAndTimePicker.vue';
import EventTags from '@/components/CalendarEvents/EventTags.vue';
import MoodOMeter from '@/components/CalendarEvents/MoodOMeter.vue';

import calendarService from '@/services/calendarService';
// Removed: import labelService from '@/services/labelService'; // No longer needed if tags are frontend-defined

const route = useRoute();
const router = useRouter();

const eventId = ref(null);
const selectedDate = ref(new Date().toISOString().split('T')[0]);
const fromTime = ref('09:00');
const untilDateTime = ref('');

const eventTitle = ref('');
const location = ref('');
const description = ref('');
const selectedTags = ref([]);
// Changed: availableTags now hardcoded on frontend
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

const allCalendarEvents = ref([]);

const isEditMode = computed(() => !!eventId.value);

const formattedSelectedDate = computed(() => {
  if (!selectedDate.value) return '';
  const dateObj = new Date(selectedDate.value);
  return format(dateObj, 'd MMMM yyyy');
});


const initializeTimesForNewEvent = (dateString) => {
  const dateObj = new Date(dateString);
  if (!isNaN(dateObj.getTime())) {
    const hour = String(dateObj.getHours()).padStart(2, '0');
    const minute = String(dateObj.getMinutes()).padStart(2, '0');
    fromTime.value = `${hour}:${minute}`;

    // Для нового события, endTime по умолчанию на час позже startTime
    const initialEndDate = new Date(dateString);
    initialEndDate.setHours(dateObj.getHours() + 1, dateObj.getMinutes(), 0, 0);
    untilDateTime.value = format(initialEndDate, "yyyy-MM-dd'T'HH:mm");
  } else {
    console.error('Failed to parse date for time pickers:', dateString);
    fromTime.value = '09:00';
    untilDateTime.value = format(new Date(), "yyyy-MM-dd'T'10:00");
  }
};

function handleMiniCalendarDateClick(arg) {
  selectedDate.value = arg.dateStr;
  if (!isEditMode.value) {
    // Только если это новое событие, инициализируем время
    initializeTimesForNewEvent(arg.dateStr);
  }
  // В режиме редактирования, untilDateTime.value остается таким, каким его выбрал пользователь
  // или каким оно было загружено из события.
}

const fetchAllEvents = async () => {
  try {
    const events = await calendarService.getAllEvents();
    allCalendarEvents.value = events.map(event => ({
      id: event.id,
      title: event.title,
      start: event.startTime,
      end: event.endTime,
      // You can add more FullCalendar compatible properties here if needed
    }));
    console.log('Fetched and formatted all calendar events for sidebar:', allCalendarEvents.value);
  } catch (error) {
    console.error('Failed to fetch all events for sidebar:', error.response ? error.response.data : error.message);
  }
};

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
      selectedDate.value = format(startDateTime, 'yyyy-MM-dd');
      fromTime.value = format(startDateTime, 'HH:mm');
    }
    // **ВАЖНО: Устанавливаем untilDateTime из event.endTime**
    if (event.endTime) {
      untilDateTime.value = format(new Date(event.endTime), "yyyy-MM-dd'T'HH:mm");
    } else {
      // Fallback: если endTime отсутствует (хотя не должно быть), устанавливаем час позже startTime
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

  console.log('untilDateTime.value before saving:', untilDateTime.value);

  const eventPayload = {
    title: eventTitle.value,
    description: description.value,
    startTime: format(startTime, "yyyy-MM-dd'T'HH:mm:ss"),
    endTime: format(endTime, "yyyy-MM-dd'T'HH:mm:ss"),
    location: location.value,
    labels: selectedTags.value, // This sends the array of selected tags
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

const cancel = () => {
  router.push('/calendars');
};

onMounted(async () => {
  await fetchAllEvents(); // Это для CalendarSidebar

  if (route.params.id) {
    eventId.value = route.params.id;
    await loadEventForEdit(eventId.value); // Загружаем все данные, включая untilDateTime
  } else if (route.params.date) {
    selectedDate.value = String(route.params.date);
    // Для нового события, инициализируем время начала и конца
    initializeTimesForNewEvent(selectedDate.value);
    console.log('AddEditEventView: Initial selectedDate from route for creation:', selectedDate.value);
  } else {
    console.warn('AddEditEventView: No ID or date provided in route params. Using default today.');
    // Для нового события без даты, инициализируем время на сегодня
    initializeTimesForNewEvent(selectedDate.value);
  }
});
</script>

<style scoped>
.add-edit-event-view {
  min-height: 100vh;
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
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.v-btn {
  text-transform: none;
}

.v-row {
  flex-wrap: nowrap !important;
}

.v-col {
  min-width: 0;
}
</style>