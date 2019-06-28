import axios from 'axios';

const service = axios.create({
  timeout: 30000 // request timeout
});

export default service;
