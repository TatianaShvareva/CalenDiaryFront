<template>
  <div class="add-edit-event-view">
    <h1>Add/Edit Event - {{ selectedDate }}</h1>
    <div class="split-layout">
      <div class="calendar-sidebar">
        <FullCalendar :options="miniCalendarOptions" />
      </div>
      <div class="event-form">
        <v-text-field label="Event Title" v-model="eventTitle"></v-text-field>
        <div class="time-pickers">
          <v-time-picker label="From" v-model="fromTime"></v-time-picker>
          <v-time-picker label="Until" v-model="untilTime"></v-time-picker>
        </div>
        <v-text-field label="Location" v-model="location"></v-text-field>
        <v-textarea label="Description" v-model="description"></v-textarea>
        <v-combobox label="Tags" :items="tags" v-model="selectedTags" multiple></v-combobox>
        <div class="mood-o-meter">
          <span>Mood:</span>
          <v-btn icon="mdi-heart" :color="mood === 'red' ? 'red' : 'grey'" @click="mood = 'red'"></v-btn>
          <v-btn icon="mdi-heart" :color="mood === 'orange' ? 'orange' : 'grey'" @click="mood = 'orange'"></v-btn>
          <v-btn icon="mdi-heart" :color="mood === 'yellow' ? 'yellow' : 'grey'" @click="mood = 'yellow'"></v-btn>
          <v-btn icon="mdi-heart" :color="mood === 'green' ? 'green' : 'grey'" @click="mood = 'green'"></v-btn>
          <v-btn icon="mdi-heart" :color="mood === 'blue' ? 'blue' : 'grey'" @click="mood = 'blue'"></v-btn>
        </div>
        <v-textarea label="Diary" v-model="diaryEntry"></v-textarea>
        <v-btn color="primary" @click="saveEvent">Save Changes</v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const route = useRoute();
const selectedDate = ref(route.params.date);
const tags = ref(['Study', 'Work', 'Personal Appointment', 'Healthcare', 'Sport Activity', 'Travel', 'Other']);

// Данные формы
const eventTitle = ref('');
const fromTime = ref(null);
const untilTime = ref(null);
const location = ref('');
const description = ref('');
const selectedTags = ref([]);
const mood = ref(null);
const diaryEntry = ref('');

const miniCalendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialDate: selectedDate.value,
  headerToolbar: false,
  aspectRatio: 1,
  dateClick: handleMiniCalendarDateClick,
});

function handleMiniCalendarDateClick(arg) {
  console.log('Clicked date in mini-calendar:', arg.dateStr);
  // Здесь можно реализовать логику при клике на дату в мини-календаре
}

function saveEvent() {
  // Здесь нужно будет реализовать логику сохранения данных события
  const eventData = {
    date: selectedDate.value,
    title: eventTitle.value,
    fromTime: fromTime.value,
    untilTime: untilTime.value,
    location: location.value,
    description: description.value,
    tags: selectedTags.value,
    mood: mood.value,
    diaryEntry: diaryEntry.value,
  };
  console.log('Saving event:', eventData);
  // Отправьте eventData на сервер (позже)
}

onMounted(() => {
  console.log('Selected date from route:', selectedDate.value);
});
</script>

<style scoped>
/* Стили, которые мы добавляли ранее */
.add-edit-event-view {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.split-layout {
  display: flex;
  gap: 20px;
}

.calendar-sidebar {
  width: 30%;
}

.event-form {
  width: 70%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.time-pickers {
  display: flex;
  gap: 10px;
}

.mood-o-meter {
  display: flex;
  align-items: center;
  gap: 10px;
}
.calendar-sidebar {
  width: 30%;
  border: 1px solid #eee; /* Optional: Add a border for visual separation */
  padding: 10px;
  border-radius: 4px; /* Optional: Add rounded corners */
}

.fc-view-harness { /* Adjust the overall container of the calendar */
  max-width: 100% !important; /* Ensure it fits within the sidebar */
  height: auto !important; /* Adjust height automatically */
}

.fc-header-toolbar { /* Hide the header toolbar (prev/next buttons, title) */
  display: none !important;
}

.fc-day-header { /* Style the day headers (Mon, Tue, etc.) */
  font-size: 0.8em;
  padding: 0.5em 0;
  text-align: center;
}

.fc-daygrid-day-frame { /* Style the day cells */
  padding: 0.3em;
  min-height: auto !important; /* Adjust min-height */
}

.fc-daygrid-day-number { /* Style the day numbers */
  font-size: 0.9em;
  text-align: left;
  padding: 0.2em;
}

.fc-today { /* Style the 'today' cell */
  background-color: #f0f8ff; /* Light blue or any subtle highlight */
}

.fc-event { /* Style the event dots/indicators (if you implement them) */
  font-size: 0.7em;
  padding: 0.1em 0.3em;
  margin-bottom: 0.1em;
  background-color: #a9a9a9; /* Light grey */
  color: white;
  border-radius: 3px;
}
</style>