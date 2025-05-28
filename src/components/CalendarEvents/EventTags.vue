<template>
  <div class="event-tags-container">
    <div class="selected-tags-display">
      <v-chip
        v-for="tag in internalSelectedTags"
        :key="tag"
        class="ma-1 selected-tag-chip"
        closable
        @click:close="removeTag(tag)"
        :color="getTagColor(tag)"
        variant="elevated"
      >
        {{ tag }}
      </v-chip>
    </div>

    <v-row no-gutters class="mt-2">
      <v-col cols="6" class="pr-2">
        <v-select
          label="Select Existing Tag"
          :items="availableTagsFiltered"
          v-model="selectedNewTag"
          @update:modelValue="addSelectedTag"
          clearable
          hide-details
          density="compact"
          variant="outlined"
        ></v-select>
      </v-col>
      <v-col cols="6" class="pl-2">
        <v-text-field
          label="Add New Tag"
          v-model="newTagInput"
          @keydown.enter="addNewTag"
          hide-details
          density="compact"
          variant="outlined"
        >
          <template #append-inner>
            <v-btn
              icon="mdi-plus"
              size="small"
              variant="text"
              color="primary"
              @click="addNewTag"
              :disabled="!newTagInput.trim()"
            ></v-btn>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  availableTags: {
    type: Array,
    default: () => ['Study', 'Work', 'Personal Appointment', 'Healthcare', 'Sport Activity', 'Travel', 'Other'],
  },
});

const emit = defineEmits(['update:modelValue']);

const internalSelectedTags = ref(props.modelValue);
const selectedNewTag = ref(null);
const newTagInput = ref('');

const tagColors = {
  'Study': '#90caf9',              // light blue
  'Work': '#ffd180',               // light orange
  'Personal Appointment': '#ce93d8', // light purple
  'Healthcare': '#ef9a9a',         // light red
  'Sport Activity': '#a5d6a7',     // light green
  'Travel': '#80cbc4',             // light teal
  'Other': '#eeeeee',              // light grey
};

const defaultNewTagColor = '#dcedc8'; // very light green

const getTagColor = (tag) => {
  if (props.availableTags.includes(tag)) {
    return tagColors[tag] || '#b0bec5'; // fallback to light blue-grey
  }
  return defaultNewTagColor;
};

const availableTagsFiltered = computed(() => {
  return props.availableTags.filter(tag => !internalSelectedTags.value.includes(tag));
});

watch(
  () => props.modelValue,
  (newValue) => {
    internalSelectedTags.value = newValue;
  },
  { deep: true }
);

watch(internalSelectedTags, (newValue) => {
  emit('update:modelValue', newValue);
}, { deep: true });

function addSelectedTag(tag) {
  if (tag && !internalSelectedTags.value.includes(tag)) {
    internalSelectedTags.value.push(tag);
  }
  selectedNewTag.value = null;
}

function addNewTag() {
  const tag = newTagInput.value.trim();
  if (tag && !internalSelectedTags.value.includes(tag)) {
    internalSelectedTags.value.push(tag);
  }
  newTagInput.value = '';
}

function removeTag(tagToRemove) {
  internalSelectedTags.value = internalSelectedTags.value.filter(tag => tag !== tagToRemove);
}
</script>

<style scoped>
.event-tags-container {
  /* margin-top: 15px; */
}

.selected-tags-display {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 8px;
  min-height: 36px;
  align-items: center;
}

/* Remove the square background from the close icon */
.selected-tag-chip ::v-deep(.v-chip__close),
.selected-tag-chip ::v-deep(.v-chip__close.v-btn),
.selected-tag-chip ::v-deep(.v-chip__close.v-btn--icon),
.selected-tag-chip ::v-deep(.v-chip__close[role="button"]),
.selected-tag-chip ::v-deep(button.v-btn.v-chip__close) {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
  min-width: 0 !important;
  width: 18px !important;
  height: 18px !important;
  border-radius: 50% !important;
  outline: none !important;
  appearance: none !important;
  -webkit-appearance: none !important;
}

.selected-tag-chip ::v-deep(.v-chip__close:focus) {
  outline: none !important;
  box-shadow: none !important;
}

.selected-tag-chip ::v-deep(.v-chip__close .v-btn__content) {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

/* Optional: Style for v-select and v-text-field for better look */
.v-select .v-select__selection-text {
  border-bottom: none !important;
  text-decoration: none !important;
}

.v-select .v-field__input {
  border-bottom: none !important;
  box-shadow: none !important;
}

.v-text-field .v-btn {
  min-width: 30px;
}
</style>