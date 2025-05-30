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
        v-model="internalSelectedDate" 
        color="primary"
        @update:model-value="onDatePicked"
        width="100%"
        header-color="primary"
      />
      <v-divider />
      <v-card-text class="pa-2">
        <v-row dense no-gutters>
          <v-col cols="6">
            <v-menu :close-on-content-click="false" location="bottom right">
                <template #activator="{ props: menuProps }">
                    <v-text-field
                        v-bind="menuProps"
                        label="Hour"
                        v-model="selectedHour"
                        readonly
                        density="compact"
                        variant="outlined"
                        hide-details
                        class="hour-select"
                    />
                </template>
                <v-list class="time-list">
                    <v-list-item
                        v-for="hourItem in hours"
                        :key="hourItem"
                        :value="hourItem"
                        @click="selectHour(hourItem)"
                        :class="{ 'v-list-item--active': selectedHour === hourItem }"
                    >
                        <v-list-item-title>{{ hourItem }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
          </v-col>
          <v-col cols="6">
            <v-menu :close-on-content-click="false" location="bottom right">
                <template #activator="{ props: menuProps }">
                    <v-text-field
                        v-bind="menuProps"
                        label="Minutes"
                        v-model="selectedMinute"
                        readonly
                        density="compact"
                        variant="outlined"
                        hide-details
                        class="minute-select"
                    />
                </template>
                <v-list class="time-list">
                    <v-list-item
                        v-for="minuteItem in minutes"
                        :key="minuteItem"
                        :value="minuteItem"
                        @click="selectMinute(minuteItem)"
                        :class="{ 'v-list-item--active': selectedMinute === minuteItem }"
                    >
                        <v-list-item-title>{{ minuteItem }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="justify-end py-1">
        <v-btn text @click="closeMenuAndEmit">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { format } from 'date-fns';

const props = defineProps({
  label: { type: String, default: 'Until' },
  modelValue: { type: [String, Object, Date, null], default: null }
});
const emit = defineEmits(['update:modelValue']);

const menu = ref(false); // Главное меню пикера
const internalSelectedDate = ref(new Date()); 
const selectedHour = ref('00');
const selectedMinute = ref('00');

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

const displayValue = computed(() => {
  if (internalSelectedDate.value && !isNaN(internalSelectedDate.value.getTime())) {
    const dateStr = format(internalSelectedDate.value, 'd MMMM');
    const timeStr = `${String(selectedHour.value).padStart(2, '0')}:${String(selectedMinute.value).padStart(2, '0')}`;
    return `${dateStr}, ${timeStr}`;
  }
  return 'Select Date, 00:00';
});

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
        const now = new Date();
        internalSelectedDate.value = now;
        selectedHour.value = format(now, 'HH');
        selectedMinute.value = format(now, 'mm');
      }
    } else {
      const now = new Date();
      internalSelectedDate.value = now;
      selectedHour.value = format(now, 'HH');
      selectedMinute.value = format(now, 'mm');
    }
  },
  { immediate: true }
);

function onDatePicked(newDate) {
  internalSelectedDate.value = newDate;
  if (selectedHour.value === '00' && selectedMinute.value === '00') {
    const now = new Date();
    selectedHour.value = String(now.getHours()).padStart(2, '0');
    selectedMinute.value = String(now.getMinutes()).padStart(2, '0');
  }
  updateModelValue();
}

// Новые функции для выбора часа и минуты
function selectHour(hour) {
    selectedHour.value = hour;
    updateModelValue();
}

function selectMinute(minute) {
    selectedMinute.value = minute;
    updateModelValue();
}

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

function closeMenuAndEmit() {
  updateModelValue();
  menu.value = false;
}
</script>

<style scoped>
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

.hour-select, .minute-select {
  margin: 0px 4px;
}

/* Стили для новых списков времени */
.time-list {
    max-height: 200px; /* Ограничьте высоту списка */
    overflow-y: auto; /* Добавьте прокрутку */
}
.time-list .v-list-item {
    min-height: 36px; /* Чуть меньше стандартного для компактности */
}
</style>