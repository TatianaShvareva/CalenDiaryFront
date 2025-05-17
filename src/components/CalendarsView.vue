<template>
  <div>
    <v-sheet class="d-flex" height="54" tile>
      <v-select v-model="currentView" :items="calendarViews" class="ma-2" density="compact" label="View"
        variant="outlined" hide-details></v-select>
    </v-sheet>
    <v-sheet class="pa-4">
      <FullCalendar :options="calendarOptions" />
    </v-sheet>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import enLocale from '@fullcalendar/core/locales/en-gb.js';
import '@fullcalendar/core';
import '@fullcalendar/daygrid';
import '@fullcalendar/timegrid';
import '@fullcalendar/list';

const router = useRouter();
const currentView = ref('dayGridMonth');
const calendarViews = ref([
  { title: 'Month', value: 'dayGridMonth' },
  { title: 'Week', value: 'timeGridWeek' },
  { title: 'Day', value: 'timeGridDay' },
  { title: 'List', value: 'listWeek' },
]);
const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
  initialView: currentView.value,
  locale: enLocale, // Set English locale
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
  },
  editable: false,
  selectable: true,
  dateClick: handleDateClick,
  events: ref([]), // Your events will go here
});

// Watch for changes in the calendar view
watch(currentView, (newView) => {
  calendarOptions.value.initialView = newView;
});

function handleDateClick(arg) {
  const formattedDate = formatDateForRoute(arg.date);
  router.push(`/add-event/${formattedDate}`);
}

const formatDateForRoute = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Example of adding events (replace with your data fetching logic)
calendarOptions.value.events = [
  { title: 'Meeting', start: '2025-05-20T10:00:00', end: '2025-05-20T12:00:00' },
  { title: 'All-day event', date: '2025-05-25' }
];
</script>

<style scoped>
.fc-daygrid-day-frame {
  /* Контейнер для номера дня и событий */
  padding: 0.5em;
  /* Уменьшите отступы */
}

.fc-daygrid-day-top {
  /* Верхняя часть ячейки с номером дня */
  min-height: 1.5em;
  /* Уменьшите минимальную высоту */
}

.fc-daygrid-event {
  /* Стиль для событий */
  font-size: 0.8em;
  /* Уменьшите размер шрифта событий */
  padding: 0.2em;
  /* Уменьшите отступы событий */
  margin-bottom: 0.1em;
  /* Уменьшите отступ между событиями */
}
</style>