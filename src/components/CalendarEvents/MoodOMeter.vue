<template>
  <div class="mood-o-meter">
    <span>Mood:</span>
    <v-tooltip
      v-for="colorOption in moodColors"
      :key="colorOption.value"
      location="top"
    >
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
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
    type: String,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue']);

const internalMood = ref(props.modelValue);

const moodColors = [
  { value: 'ecstatic', color: '#43a047', icon: 'mdi-heart', label: 'Ecstatic (Best)' },
  { value: 'happy', color: '#8bc34a', icon: 'mdi-heart', label: 'Happy' },
  { value: 'neutral', color: '#ffeb3b', icon: 'mdi-heart', label: 'Neutral' },
  { value: 'sad', color: '#ff9800', icon: 'mdi-heart', label: 'Sad' },
  { value: 'miserable', color: '#e53935', icon: 'mdi-heart', label: 'Miserable (Worst)' },
];

watch(
  () => props.modelValue,
  (newValue) => {
    internalMood.value = newValue;
  }
);

watch(internalMood, (newValue) => {
  emit('update:modelValue', newValue);
});
</script>

<style scoped>
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