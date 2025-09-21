const axios = require('axios');
const { BASE_URL, TIMEOUT } = require('../utils/config');

const client = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: { 'Content-Type': 'application/json' }
});

module.exports = {
  getAllBooks: () => client.get('/api/v1/Books'),
  getBookById: (id) => client.get(`/api/v1/Books/${id}`),
  createBook: (book) => client.post('/api/v1/Books', book),
  updateBook: (id, book) => client.put(`/api/v1/Books/${id}`, book),
  deleteBook: (id) => client.delete(`/api/v1/Books/${id}`)
};