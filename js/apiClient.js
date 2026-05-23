import axios from 'axios';

const isProd = import.meta.env.PROD;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api';

export const apiClient = axios.create({
  baseURL: isProd ? import.meta.env.BASE_URL : apiBaseUrl,
  timeout: 15000,
});

let dbPromise = null;

function loadStaticDb() {
  if (!dbPromise) {
    dbPromise = apiClient.get('db.json').then((response) => response.data);
  }
  return dbPromise;
}

export async function fetchCollection(name) {
  if (isProd) {
    const db = await loadStaticDb();
    return Array.isArray(db?.[name]) ? db[name] : [];
  }

  const { data } = await apiClient.get(`/${name}`);
  return Array.isArray(data) ? data : data?.[name] ?? [];
}
