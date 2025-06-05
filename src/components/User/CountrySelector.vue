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

// Инициализация selectedCountryCode из Vuex store
selectedCountryCode.value = store.getters['user/countryCode'];

// Вспомогательная функция для получения названия страны на нужном языке
// Может быть перемещена в утилиты, если используется в нескольких местах
const getCountryDisplayName = (country, languageCode) => {
  // Ищем название на запрошенном языке
  const localizedName = country.name.find(n => n.language === languageCode);
  if (localizedName) {
    return localizedName.text;
  }
  // Если не нашли на запрошенном языке, ищем на английском
  const englishName = country.name.find(n => n.language === 'EN');
  if (englishName) {
    return englishName.text;
  }
  // В крайнем случае, возвращаем первое доступное название или ISO-код
  return country.name[0]?.text || country.isoCode;
};

onMounted(async () => {
  try {
    const data = await getCountries(); 
    console.log("Fetched raw countries from API:", data); // Оставляем этот лог для отладки

    // Проверяем, что data - это массив, и его элементы имеют isoCode и массив name
    if (Array.isArray(data) && data.length > 0 && data[0].isoCode && Array.isArray(data[0].name)) {
      // Преобразуем данные: добавляем свойство displayName
      countries.value = data.map(country => ({
        ...country, // Копируем все существующие свойства
        displayName: getCountryDisplayName(country, store.getters['user/languageCode']) // Добавляем displayName
      }));

      console.log("Processed countries for v-select:", countries.value); // Лог для проверки обработанных данных

      // Убедимся, что выбранная страна существует в списке
      if (!selectedCountryCode.value || !countries.value.some(c => c.isoCode === selectedCountryCode.value)) {
        // Если нет сохраненной страны или она недействительна, выбираем первую из списка
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

// Отслеживаем изменения в selectedCountryCode для обновления Vuex store
watch(selectedCountryCode, (newCode) => {
  if (newCode && newCode !== store.getters['user/countryCode']) {
    store.dispatch('user/updateUserCountry', newCode);
  }
});

// Отслеживаем изменения userCountryCode из Vuex store, чтобы обновить селектор компонента
watch(() => store.getters['user/countryCode'], (newCode) => {
    if (newCode && newCode !== selectedCountryCode.value) {
        selectedCountryCode.value = newCode;
    }
}, { immediate: true }); 
</script>

<style scoped>
/* Ваши стили */
.country-selector .v-field__input {
  color: #FFFFFF !important; 
}
.country-selector .v-field__label {
  color: rgba(255, 255, 255, 0.7) !important;
}
.country-selector .v-icon {
  color: #FFFFFF !important; 
}

/* Стили для выпадающего списка (меню) */
.v-list-item-title {
  color: #333333 !important; /* Убедитесь, что текст в выпадающем списке темный и виден */
}
</style>