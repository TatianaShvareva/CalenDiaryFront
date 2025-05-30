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

// Define component properties
const props = defineProps({
  initialDate: {
    type: String,
    required: true,
  },
  onDateClick: {
    type: Function,
    default: () => {},
  },
  events: { 
    type: Array,
    default: () => [],
  },
});

onMounted(() => {
  // Log the initial date received for debugging purposes
  console.log('CalendarSidebar: initialDate received:', props.initialDate);
  // Validate initialDate to ensure it's a valid date string
  if (!props.initialDate || !new Date(props.initialDate).getTime()) {
    console.error('CalendarSidebar: initialDate is invalid or undefined!', props.initialDate);
  }
});

// FullCalendar options wrapped in a ref for reactivity
const options = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialDate: props.initialDate,
  headerToolbar: false, // Hides the header toolbar (e.g., month/week buttons)
  aspectRatio: 1,       // Maintains a square aspect ratio for the calendar grid
  dateClick: props.onDateClick, // Callback function for date clicks
  height: 'auto',       // Adjusts height automatically based on content
  contentHeight: 'auto',// Adjusts content height automatically
  events: props.events, // Binds events from props to the calendar
});

// Watcher to reactively update calendar events when the 'events' prop changes
watch(() => props.events, (newEvents) => {
  options.value.events = newEvents;
}, { deep: true }); // 'deep: true' enables deep watching for changes within the events array
</script>

<style scoped>
/* Component-specific styles for the calendar sidebar */
.calendar-sidebar {
  border: 1px solid #e0e0e0;
  padding: 10px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* FullCalendar override styles for specific layout adjustments */
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
  display: none !important; /* Hides events in the sidebar mini-calendar */
}

.fc-daygrid-body-unbalanced .fc-daygrid-day {
  padding-bottom: 0 !important;
}
</style>