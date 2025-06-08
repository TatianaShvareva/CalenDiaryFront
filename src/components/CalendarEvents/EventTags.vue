<template>
  <div class="event-tags-container">
    <div class="selected-tags-display">
      <v-chip
        v-for="tagObj in internalSelectedTags"
        :key="tagObj.id || tagObj.name"
        class="ma-1 selected-tag-chip"
        closable
        @click:close="removeTag(tagObj)"
        :color="tagObj.color || defaultNewTagColor"
        variant="elevated"
      >
        {{ tagObj.name }}
      </v-chip>
    </div>

    <v-row no-gutters class="mt-2">
      <v-col cols="12">
        <v-select
          label="Select or Add Tag"
          :items="availableTagsFiltered"
          item-title="name"
          item-value="id"
          v-model="selectedNewTagId"
          @update:modelValue="addSelectedTagById"
          clearable
          hide-details
          density="comfortable"
          variant="outlined"
        ></v-select>
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
  allLabels: {
    type: Array,
    default: () => [],
  }
});

const emit = defineEmits(['update:modelValue']);

const internalSelectedTags = ref(props.modelValue);
const selectedNewTagId = ref(null);

const defaultNewTagColor = '#dcedc8';

/**
 * Computes the list of available tags that are not yet selected.
 * @returns {Array} Filtered list of labels.
 */
const availableTagsFiltered = computed(() => {
  const selectedTagIds = new Set(internalSelectedTags.value.map(tag => tag.id));
  return props.allLabels.filter(label => !selectedTagIds.has(label.id));
});

// Watch for changes in the modelValue prop and update internalSelectedTags
watch(
  () => props.modelValue,
  (newValue) => {
    internalSelectedTags.value = newValue;
  },
  { deep: true }
);

// Watch for changes in internalSelectedTags and emit update:modelValue
watch(internalSelectedTags, (newValue) => {
  emit('update:modelValue', newValue);
}, { deep: true });

/**
 * Adds a selected tag by its ID to the internalSelectedTags list.
 * @param {string} id - The ID of the tag to add.
 */
function addSelectedTagById(id) {
  if (id) {
    const tagToAdd = props.allLabels.find(label => label.id === id);
    if (tagToAdd && !internalSelectedTags.value.some(tag => tag.id === tagToAdd.id)) {
      internalSelectedTags.value.push(tagToAdd);
    }
  }
  selectedNewTagId.value = null; // Reset the selected value in the select input
}

/**
 * Removes a tag from the internalSelectedTags list.
 * @param {object} tagToRemove - The tag object to remove.
 */
function removeTag(tagToRemove) {
  internalSelectedTags.value = internalSelectedTags.value.filter(tag => tag.id !== tagToRemove.id);
}
</script>

<style scoped>
/* Scoped styles for this component */
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
</style>