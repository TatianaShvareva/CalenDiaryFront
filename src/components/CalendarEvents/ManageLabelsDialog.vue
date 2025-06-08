<template>
  <v-dialog v-model="internalDialogVisible" max-width="600px" persistent>
    <v-card>
      <v-card-title class="headline d-flex justify-space-between align-center">
        Manage Labels
        <v-btn icon @click="closeDialog" variant="text">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="saveLabel">
          <v-row align="center">
            <v-col cols="6">
              <v-text-field
                v-model="currentLabel.name"
                label="Label Name"
                density="compact"
                variant="outlined"
                hide-details
                required
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="currentLabel.color"
                label="Color (Hex or Name)"
                density="compact"
                variant="outlined"
                hide-details
                required
              >
                <template v-slot:append-inner>
                  <v-menu
                    v-model="colorPickerMenu"
                    :close-on-content-click="false"
                    location="bottom"
                  >
                    <template v-slot:activator="{ props: menuProps }">
                      <v-btn
                        v-bind="menuProps"
                        :color="currentLabel.color || '#cccccc'"
                        icon="mdi-palette"
                        size="small"
                        variant="flat"
                      ></v-btn>
                    </template>
                    <v-card>
                      <v-color-picker
                        v-model="currentLabel.color"
                        hide-canvas
                        hide-inputs
                        hide-sliders
                        show-swatches
                        :swatches="colorSwatches"
                        :max-swatches="10"
                        width="300"
                        @update:modelValue="colorPickerMenu = false"
                      ></v-color-picker>
                    </v-card>
                  </v-menu>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="2" class="d-flex justify-end">
              <v-btn
                type="submit"
                :color="isEditing ? 'warning' : 'primary'"
                :disabled="!currentLabel.name || !currentLabel.color"
              >
                {{ isEditing ? 'Update' : 'Add' }}
              </v-btn>
            </v-col>
          </v-row>
        </v-form>

        <v-divider class="my-4"></v-divider>

        <v-list density="compact">
          <v-list-item
            v-for="label in labels"
            :key="label.id"
            class="mb-2"
          >
            <template v-slot:prepend>
              <v-avatar :color="label.color" size="24"></v-avatar>
            </template>
            <v-list-item-title>{{ label.name }}</v-list-item-title>
            <template v-slot:append>
              <v-btn icon size="small" variant="text" @click="editLabel(label)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon size="small" variant="text" color="error" @click="deleteLabel(label.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import labelService from '@/services/labelService';

const props = defineProps({
  modelValue: { // v-model for dialog visibility
    type: Boolean,
    default: false,
  },
  labels: { // Current list of labels from parent
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue', 'labels-changed']); // Removed label-updated/deleted/created, labels-changed is sufficient

const internalDialogVisible = ref(props.modelValue);
const currentLabel = ref({ id: null, name: '', color: '#dcedc8' }); // State for the add/edit form
const isEditing = computed(() => !!currentLabel.value.id);
const colorPickerMenu = ref(false);

const colorSwatches = [
  ['#FFCDD2', '#F8BBD0', '#E1BEE7', '#D1C4E9', '#C5CAE9'],
  ['#BBDEFB', '#B3E5FC', '#B2EBF2', '#B2DFDB', '#C8E6C9'],
  ['#DCEDC8', '#F0F4C3', '#FFF9C4', '#FFECB3', '#FFE0B2'],
];

// Sync internalDialogVisible with modelValue prop
watch(() => props.modelValue, (newVal) => {
  internalDialogVisible.value = newVal;
});

// Emit update:modelValue when internalDialogVisible changes and reset form on close
watch(internalDialogVisible, (newVal) => {
  emit('update:modelValue', newVal);
  if (!newVal) {
    resetForm();
  }
});

/**
 * Resets the form for adding/editing a label.
 */
const resetForm = () => {
  currentLabel.value = { id: null, name: '', color: '#dcedc8' };
};

/**
 * Sets the currentLabel for editing.
 * @param {object} label - The label object to edit.
 */
const editLabel = (label) => {
  currentLabel.value = { ...label }; // Create a copy for editing
};

/**
 * Saves a label (creates a new one or updates an existing one).
 */
const saveLabel = async () => {
  if (!currentLabel.value.name || !currentLabel.value.color) {
    alert('Label name and color are required.');
    return;
  }

  try {
    if (isEditing.value) {
      // PUT: Update an existing label
      await labelService.updateLabel(currentLabel.value.id, {
        name: currentLabel.value.name,
        color: currentLabel.value.color,
      });
      alert('Label updated successfully!');
    } else {
      // POST: Create a new label
      await labelService.createLabel({
        name: currentLabel.value.name,
        color: currentLabel.value.color,
      });
      alert('Label created successfully!');
    }
    resetForm(); // Reset form after successful save
    emit('labels-changed'); // Notify parent that labels list might have changed
  } catch (error) {
    console.error('Failed to save label:', error);
    alert('Failed to save label. Please try again.');
  }
};

/**
 * Deletes a label.
 * @param {string} id - The ID of the label to delete.
 */
const deleteLabel = async (id) => {
  if (confirm('Are you sure you want to delete this label? It will be removed from all associated events.')) {
    try {
      await labelService.deleteLabel(id);
      alert('Label deleted successfully!');
      emit('labels-changed'); // Notify parent that labels list might have changed
    } catch (error) {
      console.error('Failed to delete label:', error);
      alert('Failed to delete label. Please try again.');
    }
  }
};

/**
 * Closes the dialog and resets the form.
 */
const closeDialog = () => {
  internalDialogVisible.value = false;
  resetForm();
};
</script>

<style scoped>
/* Scoped styles for this component */
.v-list-item {
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 8px;
  background-color: #fff;
  padding: 8px 16px;
}
</style>