const BASE_URL = process.env.BASE_URL || 'https://fakerestapi.azurewebsites.net';
const TIMEOUT = parseInt(process.env.TIMEOUT || '5000', 10);
module.exports = { BASE_URL, TIMEOUT };
