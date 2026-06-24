import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

const client = axios.create({
  baseURL: BASE_URL,
});

export const getTasks = (status) => {
  return client.get('/tasks/', { params: status ? { status } : {} });
};

export const createTask = (task) => {
  return client.post('/tasks/', task);
};

export const updateTaskStatus = (id, status) => {
  return client.patch(`/tasks/${id}/`, { status });
};
