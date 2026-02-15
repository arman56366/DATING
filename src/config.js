// Для локальной разработки используем http://localhost:5000
// Для Vercel используем пустую строку (используется текущий домен)
const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '';

export default BASE_URL;
