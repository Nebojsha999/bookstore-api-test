const axios = require('axios');
const { BASE_URL, TIMEOUT } = require('../utils/config');

const client = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: { 'Content-Type': 'application/json' }
});

module.exports = {
  getAllAuthors: () => client.get('/api/v1/Authors'),
  getAuthorById: (id) => client.get(`/api/v1/Authors/${id}`),
  createAuthor: (author) => client.post('/api/v1/Authors', author),
  updateAuthor: (id, author) => client.put(`/api/v1/Authors/${id}`, author),
  deleteAuthor: (id) => client.delete(`/api/v1/Authors/${id}`)
};