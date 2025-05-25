// src/api/axios.js
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // Optional: needed if you use cookies/sessions
});

export default API;
