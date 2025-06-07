<template>
  <v-autocomplete
    label="Location"
    :items="searchResults"
    :loading="loading"
    v-model:search-input="searchText"
    item-title="display_name"
    item-value="place_id"
    @update:search="handleSearch"
    @update:modelValue="selectLocation"
    :model-value="internalModelValue"
    clearable
    hide-no-data
    hide-details="auto"
    variant="outlined"
    density="comfortable"
    return-object
  >
    <template v-slot:no-data>
      <v-list-item>
        <v-list-item-title>No results found</v-list-item-title>
      </v-list-item>
    </template>

    <template v-slot:item="{ item, props }">
      <v-list-item v-bind="props">
        <v-list-item-title>
          {{ item.name || item.address?.city || (item.display_name ? item.display_name.split(',')[0].trim() : '') }}
        </v-list-item-title>
        <v-list-item-subtitle v-if="item.display_name">
          {{ item.display_name }}
        </v-list-item-subtitle>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, onMounted } from 'vue';
import { searchLocation } from '@/services/locationService';
import _debounce from 'lodash/debounce';

const props = defineProps({
  modelValue: [String, Object],
  initialLocationData: {
    type: Object,
    default: () => ({}),
  }
});

const emit = defineEmits(['update:modelValue', 'location-selected']);

const searchText = ref('');
const searchResults = ref([]);
const loading = ref(false);
const internalModelValue = ref(null);

// Debounced function to perform location search after a delay.
const debouncedSearch = _debounce(async (query) => {
  loading.value = true;
  try {
    const results = await searchLocation(query);
    searchResults.value = results;
  } catch (error) {
    console.error('Error searching location:', error);
  } finally {
    loading.value = false;
  }
}, 500);

// Handles user input for search, triggering debounced search.
const handleSearch = (val) => {
  searchText.value = val;
  if (val && val.length > 2) {
    debouncedSearch(val);
  } else {
    searchResults.value = [];
    if (!val) {
      internalModelValue.value = null;
      emit('update:modelValue', '');
      emit('location-selected', null);
    }
  }
};

// Emits the selected location data to the parent component.
const selectLocation = (selectedItem) => {
  if (selectedItem) {
    internalModelValue.value = selectedItem;
    const display_name_val = selectedItem.display_name || '';
    emit('update:modelValue', display_name_val);

    emit('location-selected', {
      locationName: selectedItem.name || selectedItem.address?.city || (display_name_val ? display_name_val.split(',')[0].trim() : ''),
      fullAddress: display_name_val,
      latitude: parseFloat(selectedItem.lat),
      longitude: parseFloat(selectedItem.lon),
      addressDetails: selectedItem.address
    });
  } else {
    internalModelValue.value = null;
    emit('update:modelValue', '');
    emit('location-selected', null);
  }
};

// Syncs internal search text with modelValue prop.
watch(() => props.modelValue, (newVal) => {
    searchText.value = newVal;
    if (newVal === '') {
        internalModelValue.value = null;
    }
});

// Initializes internal state with initialLocationData prop.
watch(() => props.initialLocationData, (newVal) => {
    if (newVal && newVal.fullAddress) {
        searchText.value = newVal.fullAddress;
        internalModelValue.value = {
            display_name: newVal.fullAddress,
            lat: newVal.latitude,
            lon: newVal.longitude,
            name: newVal.locationName,
            address: newVal.addressDetails || {},
            place_id: newVal.placeId || Date.now(), // Fallback for placeId
        };
        searchResults.value = [internalModelValue.value];
    } else {
        searchText.value = '';
        internalModelValue.value = null;
        searchResults.value = [];
    }
}, { immediate: true, deep: true });

// Sets initial search text on component mount if modelValue is present.
onMounted(() => {
    if (props.modelValue) {
        searchText.value = props.modelValue;
    }
});
</script>

<style scoped>
/* Your component-specific styles here */
</style>