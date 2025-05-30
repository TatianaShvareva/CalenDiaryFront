<template>
  <div class="calendar-sidebar">
    <FullCalendar :options="options" />
  </div>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const props = defineProps({
  initialDate: {
    type: String,
    required: true,
  },
  onDateClick: {
    type: Function,
    default: () => {},
  },
  events: { // <--- НОВЫЙ ПРОПС
    type: Array,
    default: () => [],
  },
});

onMounted(() => {
  console.log('CalendarSidebar: initialDate received:', props.initialDate);
  if (!props.initialDate || !new Date(props.initialDate).getTime()) {
    console.error('CalendarSidebar: initialDate is invalid or undefined!', props.initialDate);
  }
});

// Используем ref для options, чтобы FullCalendar мог реактивно обновляться
const options = ref({ // <--- ОБЕРНУЛИ options в ref
  plugins: [dayGridPlugin, interactionPlugin],
  initialDate: props.initialDate,
  headerToolbar: false,
  aspectRatio: 1,
  dateClick: props.onDateClick,
  height: 'auto',
  contentHeight: 'auto',
  events: props.events, // <--- ИСПОЛЬЗУЕМ НОВЫЙ ПРОПС ЗДЕСЬ
});

// Добавим watcher для обновления событий, когда они меняются в пропсах
watch(() => props.events, (newEvents) => {
  options.value.events = newEvents;
}, { deep: true }); // deep: true для глубокого отслеживания изменений в массиве событий

</script>

<style scoped>
/* Стили остаются без изменений */
.calendar-sidebar {
  border: 1px solid #e0e0e0;
  padding: 10px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.fc-view-harness {
  max-width: 100% !important;
  height: auto !important;
}

.fc-header-toolbar {
  display: none !important;
}

.fc-day-header {
  font-size: 0.85em;
  padding: 0.5em 0;
  text-align: center;
  color: #616161;
}

.fc-daygrid-day-frame {
  padding: 0.2em;
  min-height: auto !important;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.fc-daygrid-day-number {
  font-size: 0.9em;
  text-align: center;
  padding: 0.2em;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.fc-daygrid-day-number:hover {
  background-color: #e3f2fd;
}

.fc-day-today .fc-daygrid-day-number {
  background-color: #bbdefb;
  color: #212121;
  font-weight: bold;
}

.fc-day-selected .fc-daygrid-day-number {
  background-color: #1976d2;
  color: white;
}

.fc-event {
  display: none !important;
}

.fc-daygrid-body-unbalanced .fc-daygrid-day {
  padding-bottom: 0 !important;
}
</style>