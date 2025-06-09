// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const fetchSensorData = async () => {
  const res = await axios.get(`${API_BASE_URL}/sensors`);
  return res.data;
};

export const fetchPredictionData = async () => {
  const res = await axios.get(`${API_BASE_URL}/predictions`);
  return res.data;
};

export const fetchlivePredictionData = async () => {
  const res = await axios.get(`${API_BASE_URL}/live`);
  return res.data;
};
