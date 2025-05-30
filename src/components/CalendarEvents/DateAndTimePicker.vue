<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    content-class="custom-datetime-menu"
  >
    <template #activator="{ props }">
      <v-text-field
        v-bind="props"
        :label="label"
        v-model="displayValue"
        readonly
        prepend-icon="mdi-calendar-clock"
        density="compact"
        :variant="'outlined'"
      />
    </template>
    <v-card class="datetime-card">
      <v-date-picker
        v-model="selectedDate"
        color="primary"
        @update:model-value="onDatePicked" width="100%"
        header-color="primary"
      />
      <v-divider />
      <v-card-text class="pa-2">
        <v-row dense no-gutters>
          <v-col cols="6">
            <v-select
              v-model="selectedHour"
              :items="hours"
              label="Hour"
              density="compact"
              variant="outlined"
              hide-details
              @update:modelValue="onTimeUpdate"
              class="hour-select"
            />
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="selectedMinute"
              :items="minutes"
              label="Minutes"
              density="compact"
              variant="outlined"
              hide-details
              @update:modelValue="onTimeUpdate"
              class="minute-select"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="justify-end py-1">
        <v-btn text @click="closeMenuAndEmit">OK</v-btn> </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  label: { type: String, default: 'Until' },
  modelValue: { type: [String, Object, Date, null], default: null }
});
const emit = defineEmits(['update:modelValue']);

const menu = ref(false);
const selectedDate = ref(null);
const selectedHour = ref(null);
const selectedMinute = ref(null);

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

const displayValue = computed(() => {
  if (selectedDate.value && selectedHour.value !== null && selectedMinute.value !== null) {
    const dateStr = new Date(selectedDate.value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return `${dateStr}, ${selectedHour.value}:${selectedMinute.value}`;
  }
  return '';
});

watch(
  () => props.modelValue,
  (newValue) => {
    if (typeof newValue === 'string' && newValue.includes('T')) {
      const [datePart, timePart] = newValue.split('T');
      selectedDate.value = datePart;
      if (timePart && timePart.includes(':')) {
        const [hour, minute] = timePart.split(':');
        selectedHour.value = hour;
        selectedMinute.value = minute;
      }
    } else {
      selectedDate.value = null;
      selectedHour.value = null;
      selectedMinute.value = null;
    }
  },
  { immediate: true }
);

function onDatePicked() {
  // When a date is picked, the time might not be set yet.
  // We'll update the model value, but not close the menu yet.
  updateModelValue();
}

function onTimeUpdate() {
  // When an hour or minute is picked, update the model value.
  updateModelValue();
}

function updateModelValue() {
  if (selectedDate.value && selectedHour.value !== null && selectedMinute.value !== null) {
    const datePart = new Date(selectedDate.value).toISOString().split('T')[0];
    const timePart = `${String(selectedHour.value).padStart(2, '0')}:${String(selectedMinute.value).padStart(2, '0')}`;
    emit('update:modelValue', `${datePart}T${timePart}`);
  } else {
    emit('update:modelValue', null);
  }
}

// New function to close the menu and ensure value is emitted
function closeMenuAndEmit() {
  updateModelValue(); // Ensure the latest value is emitted
  menu.value = false; // Close the menu
}
</script>

<style scoped>
/* existing styles */
.custom-datetime-menu {
  min-width: 380px !important;
  max-width: 450px !important;
  box-shadow: 0px 5px 5px -3px rgba(0,0,0,0.2),
              0px 8px 10px 1px rgba(0,0,0,0.14),
              0px 3px 14px 2px rgba(0,0,0,0.12);
  border-radius: 4px;
  overflow: hidden;
}

.datetime-card {
  width: 100%;
}

.hour-select .v-input__control,
.minute-select .v-input__control {
  padding-left: 0px !important;
  padding-right: 0px !important;
}

.hour-select, .minute-select {
  margin: 0px 4px;
}
</style>