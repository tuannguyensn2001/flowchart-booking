import axios from 'axios';

const bookingAPI = axios.create();

bookingAPI.defaults.baseURL = "http://laravel.local/api/v1";

export default bookingAPI;