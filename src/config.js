// Для локальной разработки используем http://localhost:5000
// Для Vercel используем /api (на одном домене)
const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '/api';

export default BASE_URL;
