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
    <v-card class="datetime-card"> <v-date-picker
        v-model="selectedDate"
        color="primary"
        @update:model-value="onDateOrTimePicked"
        width="100%"
        header-color="primary"
      />
      <v-divider />
      <v-card-text class="pa-2">
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
        <v-btn text @click="menu = false">OK</v-btn>
      </v-card-actions>
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

function onDateOrTimePicked() {
  console.log('onDateOrTimePicked called');
  // Переносим логику обновления объединенного значения в отдельную функцию
  updateModelValue();
}

function onTimeUpdate() {
  console.log('onTimeUpdate called'); // Будет вызываться при каждом выборе часа/минуты
  // Обновляем модель при изменении часа или минуты
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
</script>

<style scoped>
/* Добавляем класс для v-menu */
.custom-datetime-menu {
  /* Задаем фиксированную ширину или min-width, чтобы избежать сжатия */
  min-width: 380px !important; /* Увеличенная ширина */
  max-width: 450px !important; /* Ограничиваем, чтобы не было слишком широко */
  box-shadow: 0px 5px 5px -3px rgba(0,0,0,0.2),
              0px 8px 10px 1px rgba(0,0,0,0.14),
              0px 3px 14px 2px rgba(0,0,0,0.12); /* Тень для лучшего вида */
  border-radius: 4px;
  overflow: hidden; /* Чтобы содержимое не вылезало */
}

/* Стили для v-card внутри меню */
.datetime-card {
  /* min-width: 360px;  Уже установлено через custom-datetime-menu */
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
  margin: 0px 4px; /* Добавим небольшой горизонтальный отступ между ними */
}
</style>