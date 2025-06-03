<template>
  <div>
    <v-text-field
      :label="label"
      :model-value="displayValue"
      readonly
      prepend-icon="mdi-calendar-clock"
      density="compact"
      variant="outlined"
      @click="openPicker"
      clearable
      @click:clear="clearDateTime"
      :id="activatorId"
    />

    <v-dialog
      v-model="dialog"
      fullscreen
      :scrim="false"
      transition="dialog-bottom-transition"
      class="d-md-none"
    >
      <v-card>
        <v-toolbar color="primary" density="compact">
          <v-btn icon dark @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ label }} - {{ formattedSelectedDateForDialog }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn variant="text" @click="confirmAndCloseDialog">OK</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-date-picker
            v-model="internalSelectedDate"
            color="primary"
            @update:model-value="onDatePicked"
            width="100%"
            class="mb-4"
          />
          <v-row dense>
            <v-col cols="6">
              <v-select
                label="Hour"
                v-model="selectedHour"
                :items="hours"
                density="compact"
                variant="outlined"
                hide-details
              />
            </v-col>
            <v-col cols="6">
              <v-select
                label="Minutes"
                v-model="selectedMinute"
                :items="minutes"
                density="compact"
                variant="outlined"
                hide-details
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      transition="scale-transition"
      location="bottom right"
      offset-y
      content-class="custom-datetime-menu"
      :activator="`#${activatorId}`"
      class="d-none d-md-block"
    >
      <v-card class="datetime-card">
        <v-date-picker
          v-model="internalSelectedDate"
          color="primary"
          @update:model-value="onDatePicked"
          width="100%"
          hide-header
        />
        <v-divider />
        <v-card-text class="pa-2">
          <v-row dense no-gutters>
            <v-col cols="6">
              <v-select
                label="Hour"
                v-model="selectedHour"
                :items="hours"
                density="compact"
                variant="outlined"
                hide-details
                class="hour-select"
              />
            </v-col>
            <v-col cols="6">
              <v-select
                label="Minutes"
                v-model="selectedMinute"
                :items="minutes"
                density="compact"
                variant="outlined"
                hide-details
                class="minute-select"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-end py-1">
          <v-btn text @click="closeMenuAndEmit">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { format } from 'date-fns';

const props = defineProps({
  label: { type: String, default: 'Until' },
  modelValue: { type: [String, Object, Date, null], default: null }
});
const emit = defineEmits(['update:modelValue']);

const menu = ref(false); // Controls desktop v-menu visibility
const dialog = ref(false); // Controls mobile v-dialog visibility
const internalSelectedDate = ref(new Date());
const selectedHour = ref('00');
const selectedMinute = ref('00');

// Generates arrays for hour and minute dropdowns
const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

// Generates a unique ID for the text field activator
const activatorId = `datetime-picker-activator-${Math.random().toString(36).substring(2, 9)}`;

/**
 * Formats the selected date and time for display in the text field.
 * @returns {string} Formatted date and time string.
 */
const displayValue = computed(() => {
  if (internalSelectedDate.value && !isNaN(internalSelectedDate.value.getTime())) {
    const dateStr = format(internalSelectedDate.value, 'd MMMM');
    const timeStr = `${String(selectedHour.value).padStart(2, '0')}:${String(selectedMinute.value).padStart(2, '0')}`;
    return `${dateStr}, ${timeStr}`;
  }
  return 'Select Date, 00:00';
});

/**
 * Formats the selected date for display in the mobile dialog toolbar.
 * @returns {string} Formatted date string.
 */
const formattedSelectedDateForDialog = computed(() => {
  if (internalSelectedDate.value && !isNaN(internalSelectedDate.value.getTime())) {
    return format(internalSelectedDate.value, 'd MMMM');
  }
  return '';
});

/**
 * Watches the `modelValue` prop to keep internal state in sync.
 */
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      const date = new Date(newValue);
      if (!isNaN(date.getTime())) {
        internalSelectedDate.value = date;
        selectedHour.value = format(date, 'HH');
        selectedMinute.value = format(date, 'mm');
      } else {
        // Fallback to current date/time if newValue is invalid
        const now = new Date();
        internalSelectedDate.value = now;
        selectedHour.value = format(now, 'HH');
        selectedMinute.value = format(now, 'mm');
      }
    } else {
      // If modelValue is null, reset to current date/time
      const now = new Date();
      internalSelectedDate.value = now;
      selectedHour.value = format(now, 'HH');
      selectedMinute.value = format(now, 'mm');
    }
  },
  { immediate: true }
);

/** Opens the appropriate picker (dialog for mobile, menu for desktop). */
function openPicker() {
  if (window.innerWidth < 960) {
    dialog.value = true;
  } else {
    menu.value = true;
  }
}

/** Closes the mobile dialog. */
function closeDialog() {
  dialog.value = false;
}

/** Confirms selection and closes the mobile dialog, emitting the updated value. */
function confirmAndCloseDialog() {
  updateModelValue();
  dialog.value = false;
}

/**
 * Handles date selection from the date picker.
 * Initializes time to current if it's still '00:00'.
 * @param {Date} newDate - The newly selected date.
 */
function onDatePicked(newDate) {
  internalSelectedDate.value = newDate;
  if (selectedHour.value === '00' && selectedMinute.value === '00') {
    const now = new Date();
    selectedHour.value = String(now.getHours()).padStart(2, '0');
    selectedMinute.value = String(now.getMinutes()).padStart(2, '0');
  }
}

/** Emits the combined date and time string to the parent component. */
function updateModelValue() {
  if (internalSelectedDate.value && !isNaN(internalSelectedDate.value.getTime())) {
    const year = internalSelectedDate.value.getFullYear();
    const month = String(internalSelectedDate.value.getMonth() + 1).padStart(2, '0');
    const day = String(internalSelectedDate.value.getDate()).padStart(2, '0');

    const datePart = `${year}-${month}-${day}`;
    const timePart = `${String(selectedHour.value).padStart(2, '0')}:${String(selectedMinute.value).padStart(2, '0')}`;

    emit('update:modelValue', `${datePart}T${timePart}`);
  } else {
    emit('update:modelValue', null);
  }
}

/** Closes the desktop menu and emits the updated value. */
function closeMenuAndEmit() {
  updateModelValue();
  menu.value = false;
}

/** Clears the selected date and time, resetting to current date and 00:00, then emits null. */
function clearDateTime() {
  const now = new Date();
  internalSelectedDate.value = now; // Set to current date
  selectedHour.value = '00';
  selectedMinute.value = '00';
  emit('update:modelValue', null); // Emit null to clear the bound value
}

/** Attaches the unique activator ID to the text field's input element on mount. */
onMounted(() => {
  const textFieldEl = document.getElementById(activatorId);
  if (textFieldEl) {
    // The activatorId is now directly bound to the v-text-field in the template,
    // so manually setting the ID on its internal input is generally not needed for v-menu activator.
    // However, if the v-text-field itself is the activator, make sure its ID is set.
    // In this template, the activatorId is directly on the v-text-field.
  }
});
</script>

<style scoped>
/* Styles for v-menu (desktop) */
.custom-datetime-menu {
  box-shadow: 0px 5px 5px -3px rgba(0,0,0,0.2),
              0px 8px 10px 1px rgba(0,0,0,0.14),
              0px 3px 14px 2px rgba(0,0,0,0.12);
  border-radius: 4px;
}

.datetime-card {
  width: 100%;
}

.hour-select, .minute-select {
  margin: 0px 4px;
}

/* Styles for time lists (hours/minutes dropdowns) - generally not needed for v-select */
/* If you had custom lists, these would apply: */
/*
.time-list {
  max-height: 200px;
  overflow-y: auto;
}
.time-list .v-list-item {
  min-height: 36px;
}
*/

/* Styles for v-dialog (mobile) - Vuetify handles most of this */
.v-dialog.d-md-none {
  /* Ensure the dialog looks good on mobile */
}
</style>