import axios from 'axios';
import { API_URL, API_KEY } from '@env';

const forecastEndpoint = params => `${API_URL}/forecast.json?key=${API_KEY}&q=${params.city}&days=${params.days}&aqi=no&alerts=no`;
const locationEndpoint = params => `${API_URL}/search.json?key=${API_KEY}&q=${params.city}`; 

const apiCall = async (endpoint) => {
    const options = {
        method: 'GET',
        url: endpoint,
    }
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error('error: ', error);
        return null;
    }
}

export const fetchForecast = params => {
    return apiCall(forecastEndpoint(params));
}

export const fetchLocation = params => {
    return apiCall(locationEndpoint(params));
}