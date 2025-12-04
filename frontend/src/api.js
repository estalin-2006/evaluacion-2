import axios from 'axios'
const API = axios.create({ baseURL: 'http://localhost:8000/api' })
export default API

export const login = async (email, password) => {
  const response = await fetch('http://127.0.0.1:8000/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Credenciales incorrectas');
  }

  return await response.json();
};
