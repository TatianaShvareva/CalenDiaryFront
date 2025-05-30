<template>
  <div class="mood-o-meter">
    <span>Mood:</span>
    <v-tooltip
      v-for="colorOption in moodOptions" :key="colorOption.value"
      location="top"
    >
      <template #activator="{ props: activatorProps }">
        <v-btn
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

// Define component properties for mood value (v-model)
const props = defineProps({
  modelValue: {
    type: [Number, null], 
    default: null,
  },
});

// Define emitted events
const emit = defineEmits(['update:modelValue']);

// Internal reactive state for the selected mood
const internalMood = ref(props.modelValue);

// Configuration for mood options, including value, color, icon, and label
const moodOptions = [
  { value: 5.0, color: '#43a047', icon: 'mdi-heart', label: 'Ecstatic (Best)' }, 
  { value: 4.0, color: '#8bc34a', icon: 'mdi-heart', label: 'Happy' },
  { value: 3.0, color: '#ffeb3b', icon: 'mdi-heart', label: 'Neutral' },
  { value: 2.0, color: '#ff9800', icon: 'mdi-heart', label: 'Sad' },
  { value: 1.0, color: '#e53935', icon: 'mdi-heart', label: 'Miserable (Worst)' }, 
];

// Watcher to synchronize internal state with the external `modelValue` prop
watch(
  () => props.modelValue,
  (newValue) => {
    internalMood.value = newValue;
  }
);

// Watcher to emit 'update:modelValue' when the internal mood selection changes
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