import axios from 'axios';

// create an axios instance
export const http = axios.create({
    withCredentials: true // to send browser cookies
});
