<template>
  <div class="add-edit-event-view">
    <v-container fluid class="py-6 px-4">
      <h1 class="text-h5 mb-6 text-center text-md-left">
        What is your day today? - {{ formattedSelectedDate }}
      </h1>

      <v-row>
        <!-- Mini calendar first (left side) -->
        <v-col cols="12" md="4" class="d-flex align-self-start">
          <CalendarSidebar
            :initial-date="selectedDate"
            :on-date-click="handleMiniCalendarDateClick"
            class="flex-grow-1" />
        </v-col>
        <!-- Event form second (right side) -->
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

              <EventTags v-model="selectedTags" :available-tags="tags" />

              <MoodOMeter v-model="mood" />

              <v-textarea
                label="Diary"
                v-model="diaryEntry"
                variant="outlined"
                density="comfortable"
                rows="4"
              ></v-textarea>

              <v-btn color="primary" class="mt-4" block @click="saveEvent">Save Changes</v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

import CalendarSidebar from '@/components/CalendarEvents/CalendarSidebar.vue';
import TimePicker from '@/components/CalendarEvents/TimePicker.vue';
import DateAndTimePicker from '@/components/CalendarEvents/DateAndTimePicker.vue';
import EventTags from '@/components/CalendarEvents/EventTags.vue';
import MoodOMeter from '@/components/CalendarEvents/MoodOMeter.vue';

const route = useRoute();

const selectedDate = ref(new Date().toISOString().split('T')[0]);
const fromTime = ref({ hour: 0, minute: 0 });
const untilDateTime = ref('');

const tags = ref(['Study', 'Work', 'Personal Appointment', 'Healthcare', 'Sport Activity', 'Travel', 'Other']);

const eventTitle = ref('');
const location = ref('');
const description = ref('');
const selectedTags = ref([]);
const mood = ref(null);
const diaryEntry = ref('');

// Format selectedDate as "15 May 2025"
const formattedSelectedDate = computed(() => {
  if (!selectedDate.value) return '';
  const dateObj = new Date(selectedDate.value);
  return dateObj.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
});

const updateTimePickers = (dateString) => {
  const dateObj = new Date(dateString);
  if (!isNaN(dateObj.getTime())) {
    fromTime.value = { hour: dateObj.getHours(), minute: dateObj.getMinutes() };
    // untilDateTime можно тоже обновить, если это логично
    // untilDateTime.value = dateObj.toISOString();
  } else {
    console.error('Failed to parse date for time pickers:', dateString);
    fromTime.value = { hour: 8, minute: 0 };
  }
};

// When a date is clicked in the mini calendar, set selectedDate and update untilDateTime
function handleMiniCalendarDateClick(arg) {
  console.log('Clicked date in mini-calendar from parent:', arg.dateStr);
  selectedDate.value = arg.dateStr;
  updateTimePickers(arg.dateStr);
  // Set untilDateTime to the clicked date with a default time (e.g., 18:00)
  untilDateTime.value = `${arg.dateStr}T18:00`;
}

function saveEvent() {
  const eventData = {
    date: selectedDate.value,
    title: eventTitle.value,
    fromTime: fromTime.value,
    untilTime: untilDateTime.value,
    location: location.value,
    description: description.value,
    tags: selectedTags.value,
    mood: mood.value,
    diaryEntry: diaryEntry.value,
  };
  console.log('Saving event:', eventData);
}

onMounted(() => {
  if (route.params.date) {
    selectedDate.value = String(route.params.date);
    console.log('AddEditEventView: Initial selectedDate from route:', selectedDate.value);
  } else {
    console.warn('AddEditEventView: No date provided in route params. Using default today:', selectedDate.value);
  }
  updateTimePickers(selectedDate.value);
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