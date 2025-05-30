<template>
  <div class="mood-o-meter">
    <span>Mood:</span>
    <v-tooltip
      v-for="colorOption in moodOptions" :key="colorOption.value"
      location="top"
    >
      <template #activator="{ props: activatorProps }"> <v-btn
          v-bind="activatorProps"
          :icon="colorOption.icon"
          :color="internalMood === colorOption.value ? colorOption.color : '#e0e0e0'"
          @click="internalMood = colorOption.value"
          class="mood-btn"
        ></v-btn>
      </template>
      <span>{{ colorOption.label }}</span>
    </v-tooltip>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: [Number, null], // <-- ИЗМЕНЕНО: теперь принимает Number или null
    default: null,
  },
});

const emit = defineEmits(['update:modelValue']);

const internalMood = ref(props.modelValue);

// ИЗМЕНЕНО: Теперь value числовое
const moodOptions = [
  { value: 5.0, color: '#43a047', icon: 'mdi-heart', label: 'Ecstatic (Best)' }, // Например, 5.0
  { value: 4.0, color: '#8bc34a', icon: 'mdi-heart', label: 'Happy' },      // Например, 4.0
  { value: 3.0, color: '#ffeb3b', icon: 'mdi-heart', label: 'Neutral' },    // Например, 3.0
  { value: 2.0, color: '#ff9800', icon: 'mdi-heart', label: 'Sad' },        // Например, 2.0
  { value: 1.0, color: '#e53935', icon: 'mdi-heart', label: 'Miserable (Worst)' }, // Например, 1.0
];

watch(
  () => props.modelValue,
  (newValue) => {
    internalMood.value = newValue;
  }
);

watch(internalMood, (newValue) => {
  emit('update:modelValue', newValue); // Теперь эмитится числовое значение
});
</script>

<style scoped>
/* Стили остаются без изменений */
.mood-o-meter {
  display: flex;
  align-items: center;
  gap: 10px;
}
.mood-btn {
  transition: box-shadow 0.2s;
}
.mood-btn:hover {
  box-shadow: 0 0 8px #aaa;
}
</style>