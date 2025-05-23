<template>
  <v-menu
    v-model="timeMenu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    content-class="custom-time-menu"
  >
    <template v-slot:activator="{ props }">
      <v-text-field
        :label="label"
        v-model="formattedTime"
        prepend-icon="mdi-clock-outline"
        readonly
        v-bind="props"
        class="selected-time"
        density="compact"
        :variant="'outlined'"
      />
    </template>
    <v-card class="time-card"> <v-card-text class="pa-2">
        <v-row dense no-gutters> <v-col cols="6">
            <v-select
              v-model="selectedHour"
              :items="hours"
              label="Hour"
              density="compact"
              variant="outlined"
              hide-details
              @update:modelValue="onTimeUpdate"
              class="hour-select"
            ></v-select>
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
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="justify-end py-1">
        <v-btn text @click="timeMenu = false">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  label: { type: String, default: 'Time' },
  modelValue: { type: [String, null], default: null }
});
const emit = defineEmits(['update:modelValue']);

const timeMenu = ref(false);
const selectedHour = ref(null);
const selectedMinute = ref(null);

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

const formattedTime = computed(() => {
  if (selectedHour.value !== null && selectedMinute.value !== null) {
    return `${String(selectedHour.value).padStart(2, '0')}:${String(selectedMinute.value).padStart(2, '0')}`;
  }
  return '';
});

watch(
  () => props.modelValue,
  (newValue) => {
    if (typeof newValue === 'string' && newValue.includes(':')) {
      const [hour, minute] = newValue.split(':');
      const parsedHour = parseInt(hour, 10);
      const parsedMinute = parseInt(minute, 10);

      if (!isNaN(parsedHour) && !isNaN(parsedMinute)) {
        selectedHour.value = String(parsedHour).padStart(2, '0');
        selectedMinute.value = String(parsedMinute).padStart(2, '0');
      } else {
        selectedHour.value = null;
        selectedMinute.value = null;
      }
    } else {
      selectedHour.value = null;
      selectedMinute.value = null;
    }
  },
  { immediate: true }
);

function onTimeUpdate() {
  console.log('onTimeUpdate called'); // Для отладки
  if (selectedHour.value !== null && selectedMinute.value !== null) {
    emit('update:modelValue', `${String(selectedHour.value).padStart(2, '0')}:${String(selectedMinute.value).padStart(2, '0')}`);
  } else {
    emit('update:modelValue', null);
  }
}
</script>

<style scoped>
.selected-time input {
  font-weight: bold;
  color: #1976d2;
  background: #e3f2fd;
}

/* Добавляем класс для v-menu */
.custom-time-menu {
  min-width: 240px !important; /* Увеличенная ширина */
  max-width: 300px !important;
  box-shadow: 0px 5px 5px -3px rgba(0,0,0,0.2),
              0px 8px 10px 1px rgba(0,0,0,0.14),
              0px 3px 14px 2px rgba(0,0,0,0.12);
  border-radius: 4px;
  overflow: hidden;
}

/* Стили для v-card внутри меню */
.time-card {
  width: 100%;
}

/* Убираем лишние отступы вокруг v-select */
.hour-select .v-input__control,
.minute-select .v-input__control {
  padding-left: 0px !important;
  padding-right: 0px !important;
}

/* Немного подгоним поля ввода */
.hour-select, .minute-select {
  margin: 0px 4px;
}
</style>