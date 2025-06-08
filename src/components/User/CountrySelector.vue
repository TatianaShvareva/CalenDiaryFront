<template>
  <v-select
    v-model="selectedCountryCode"
    :items="countries"
    item-title="displayName"   item-value="isoCode"      label="Select Country"
    density="compact"
    variant="solo"
    hide-details
    flat
    class="country-selector"
  >
    <template v-slot:selection="{ item }">
      <span v-if="item.raw">{{ item.raw.displayName }}</span>
    </template>
    
    <template v-slot:item="{ item, props }">
      <v-list-item v-bind="props">
        <v-list-item-title v-if="item.raw">{{ item.raw.displayName }} ({{ item.raw.isoCode }})</v-list-item-title>
      </v-list-item>
    </template>
  </v-select>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { getCountries } from '@/services/holidaysApi'; 

const store = useStore();
const countries = ref([]); 
const selectedCountryCode = ref('');

selectedCountryCode.value = store.getters['user/countryCode'];


const getCountryDisplayName = (country, languageCode) => {
 
  const localizedName = country.name.find(n => n.language === languageCode);
  if (localizedName) {
    return localizedName.text;
  }

  const englishName = country.name.find(n => n.language === 'EN');
  if (englishName) {
    return englishName.text;
  }

  return country.name[0]?.text || country.isoCode;
};

onMounted(async () => {
  try {
    const data = await getCountries(); 
    console.log("Fetched raw countries from API:", data); 

   
    if (Array.isArray(data) && data.length > 0 && data[0].isoCode && Array.isArray(data[0].name)) {
     
      countries.value = data.map(country => ({
        ...country, 
        displayName: getCountryDisplayName(country, store.getters['user/languageCode']) 
      }));

      console.log("Processed countries for v-select:", countries.value); 

     
      if (!selectedCountryCode.value || !countries.value.some(c => c.isoCode === selectedCountryCode.value)) {
        
        selectedCountryCode.value = countries.value[0].isoCode;
        store.dispatch('user/updateUserCountry', selectedCountryCode.value);
      }
    } else {
      console.error("API did not return countries in expected format or was empty:", data);
      countries.value = []; 
    }

  } catch (error) {
    console.error('Failed to fetch countries:', error);
  }
});


watch(selectedCountryCode, (newCode) => {
  if (newCode && newCode !== store.getters['user/countryCode']) {
    store.dispatch('user/updateUserCountry', newCode);
  }
});


watch(() => store.getters['user/countryCode'], (newCode) => {
    if (newCode && newCode !== selectedCountryCode.value) {
        selectedCountryCode.value = newCode;
    }
}, { immediate: true }); 
</script>

<style scoped>

.country-selector .v-field__input {
  color: #FFFFFF !important; 
}
.country-selector .v-field__label {
  color: rgba(255, 255, 255, 0.7) !important;
}
.country-selector .v-icon {
  color: #FFFFFF !important; 
}


.v-list-item-title {
  color: #333333 !important; 
}
</style>