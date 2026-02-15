// Для локальной разработки используем http://localhost:5000
// Для Vercel используем пустую строку (используется текущий домен)
const BASE_URL = process.env.NODE_ENV === 'development' ? 'https://dating-5u6zi2zyj-arman56366s-projects.vercel.app/api' : '';

export default BASE_URL;
