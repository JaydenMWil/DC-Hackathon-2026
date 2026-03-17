import { Alert, Platform } from 'react-native';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || (Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://10.160.33.215:8000');

const apiFetch = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Network response was not ok: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Fetch Error [${endpoint}]:`, error);
    
    // Only show alerts on native; maybe use a toast or local state on web
    if (Platform.OS !== 'web') {
      Alert.alert('Connection Error', `Unable to reach the server. Please check your connection. \n\nDetails: ${error.message}`);
    }
    
    throw error;
  }
};

export const api = {
  getBusesNearby: (lat, lon, radius = 5000) => 
    apiFetch(`/buses/nearby?lat=${lat}&lon=${lon}&radius=${radius}`),
  
  getReports: () => 
    apiFetch('/reports/'),
  
  createReport: (reportData) => 
    apiFetch('/reports/', {
      method: 'POST',
      body: JSON.stringify(reportData),
    }),
    
  getSchedules: () => 
    apiFetch('/schedules/'),
    
  createSchedule: (scheduleData) => 
    apiFetch('/schedules/', {
      method: 'POST',
      body: JSON.stringify(scheduleData),
    }),
};

export default api;
