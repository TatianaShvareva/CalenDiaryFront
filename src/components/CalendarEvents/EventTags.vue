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

// Define component properties for selected tags (v-model) and available tag options
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

// Internal reactive state for selected tags, new tag selection, and new tag input
const internalSelectedTags = ref(props.modelValue);
const selectedNewTag = ref(null);
const newTagInput = ref('');

// Mapping of standard tag names to their respective colors
const tagColors = {
  'Study': '#90caf9',          
  'Work': '#ffd180',          
  'Personal Appointment': '#ce93d8', 
  'Healthcare': '#ef9a9a',      
  'Sport Activity': '#a5d6a7', 
  'Travel': '#80cbc4',         
  'Other': '#eeeeee',           
};

const defaultNewTagColor = '#dcedc8'; 

/**
 * Determines the display color for a given tag.
 * Uses predefined colors for known tags, and a default color for new/custom tags.
 * @param {string} tag - The tag name.
 * @returns {string} The hexadecimal color code.
 */
const getTagColor = (tag) => {
  if (props.availableTags.includes(tag)) {
    return tagColors[tag] || '#b0bec5'; 
  }
  return defaultNewTagColor; 
};

// Computed property to filter available tags, showing only those not already selected
const availableTagsFiltered = computed(() => {
  return props.availableTags.filter(tag => !internalSelectedTags.value.includes(tag));
});

// Watcher to synchronize internal state with the external `modelValue` prop
watch(
  () => props.modelValue,
  (newValue) => {
    internalSelectedTags.value = newValue;
  },
  { deep: true } // Deep watch for array changes
);

// Watcher to emit 'update:modelValue' when internal selected tags change
watch(internalSelectedTags, (newValue) => {
  emit('update:modelValue', newValue);
}, { deep: true }); 

/**
 * Adds a tag selected from the dropdown to the list of internalSelectedTags.
 * @param {string} tag - The tag name to add.
 */
function addSelectedTag(tag) {
  if (tag && !internalSelectedTags.value.includes(tag)) {
    internalSelectedTags.value.push(tag);
  }
  selectedNewTag.value = null; 
}

/**
 * Adds a new tag typed into the text field to the list of internalSelectedTags.
 * Prevents adding empty or duplicate tags.
 */
function addNewTag() {
  const tag = newTagInput.value.trim();
  if (tag && !internalSelectedTags.value.includes(tag)) {
    internalSelectedTags.value.push(tag);
  }
  newTagInput.value = ''; 
}

/**
 * Removes a specified tag from the list of internalSelectedTags.
 * @param {string} tagToRemove - The tag name to remove.
 */
function removeTag(tagToRemove) {
  internalSelectedTags.value = internalSelectedTags.value.filter(tag => tag !== tagToRemove);
}
</script>

<style scoped>

.selected-tags-display {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 8px;
  min-height: 36px; 
  align-items: center;
}

/* Specific styling to remove default Vuetify button styles from chip close icon */
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