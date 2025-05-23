<template>
  <div class="add-edit-event-view">
    <h1>Add/Edit Event - {{ selectedDate }}</h1>
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <div class="calendar-sidebar">
            <FullCalendar :options="miniCalendarOptions" />
          </div>
        </v-col>
        <v-col cols="12" md="8">
          <div class="event-form">
            <v-text-field label="Event Title" v-model="eventTitle"></v-text-field>
            <div class="time-pickers">
              <TimePicker label="From" v-model="fromTime" />
              <DateAndTimePicker v-model="untilDateTime" label="Until" />
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
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import TimePicker from '@/components/CalendarEvents/TimePicker.vue';
import DateAndTimePicker from '@/components/CalendarEvents/DateAndTimePicker.vue';


const route = useRoute();
const selectedDate = ref(route.params.date);
const initialDate = new Date(selectedDate.value);
const fromTime = ref({ hour: initialDate.getHours(), minute: initialDate.getMinutes() });
const untilDateTime = ref('');
const tags = ref(['Study', 'Work', 'Personal Appointment', 'Healthcare', 'Sport Activity', 'Travel', 'Other']);

// Данные формы
const eventTitle = ref('');
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
  const eventData = {
    date: selectedDate.value,
    title: eventTitle.value,
    fromTime: fromTime.value,
    untilTime: untilDateTime.value, // <-- updated
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

/* Эти стили .split-layout и .calendar-sidebar, .event-form больше не нужны,
   поскольку вы используете Vuetify Grid (v-container, v-row, v-col) для разметки.
   Vuetify Grid сам управляет шириной и отступами. */
/* .split-layout {
  display: flex;
  gap: 20px;
} */

.calendar-sidebar {
  /* width: 30%; */ /* Удалить или переопределить, Vuetify v-col управляет шириной */
  border: 1px solid #eee;
  padding: 10px;
  border-radius: 4px;
}

.event-form {
  /* width: 70%; */ /* Удалить или переопределить, Vuetify v-col управляет шириной */
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.time-pickers {
  display: flex;
  gap: 16px;
  align-items: center;
}

.mood-o-meter {
  display: flex;
  align-items: center;
  gap: 10px;
}

.fc-view-harness {
  max-width: 100% !important;
  height: auto !important;
}

.fc-header-toolbar {
  display: none !important;
}

.fc-day-header {
  font-size: 0.8em;
  padding: 0.5em 0;
  text-align: center;
}

.fc-daygrid-day-frame {
  padding: 0.3em;
  min-height: auto !important;
}

.fc-daygrid-day-number {
  font-size: 0.9em;
  text-align: left;
  padding: 0.2em;
}

.fc-today {
  background-color: #f0f8ff;
}

.fc-event {
  font-size: 0.7em;
  padding: 0.1em 0.3em;
  margin-bottom: 0.1em;
  background-color: #a9a9a9;
  color: white;
  border-radius: 3px;
}
</style>