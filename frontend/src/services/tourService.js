import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1/tours';

export const getAllTours = async () => {
  const res = await axios.get(API_URL, { withCredentials: true });
  return res.data;
};

export const createTour = async (data) => {
  const res = await axios.post(API_URL, data, { withCredentials: true });
  return res.data;
};

export const updateTour = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data, { withCredentials: true });
  return res.data;
};

export const deleteTour = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
  return res.data;
}; 