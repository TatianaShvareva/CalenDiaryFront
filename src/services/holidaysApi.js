import axios from 'axios';

const BASE_URL = 'https://openholidaysapi.org';

export const holidaysApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'accept': 'text/json'
  }
});

export async function getPublicHolidays(countryIsoCode, year, languageIsoCode = 'EN') {
  const validFrom = `${year}-01-01`;
  const validTo = `${year}-12-31`;
  try {
    const response = await holidaysApi.get('/PublicHolidays', {
      params: {
        countryIsoCode,
        languageIsoCode,
        validFrom,
        validTo
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching public holidays:', error);
    throw error;
  }
}

export async function getCountries() {
  try {
    const response = await holidaysApi.get('/Countries');
    return response.data; 
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
}