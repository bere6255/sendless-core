import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import crypto from 'crypto';

const SUMSUB_APP_TOKEN = process.env.SUMSUB_APP_TOKEN!;
const SUMSUB_SECRET_KEY = process.env.SUMSUB_SECRET_KEY!;
const SUMSUB_BASE_URL = 'https://api.sumsub.com';

const sumsubClient: AxiosInstance = axios.create({
  baseURL: SUMSUB_BASE_URL,
});

sumsubClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const ts = Math.floor(Date.now() / 1000);
    const method = config.method?.toUpperCase() || 'GET';

    // ✅ Ensure we always sign only the path + query
    const urlObj = new URL(config.baseURL! + (config.url || ''));
    const pathWithQuery = urlObj.pathname + urlObj.search;

    // ✅ Body string (must be exactly as sent)
    let bodyString = '';
    if (config.data && method !== 'GET') {
      // If explicitly null/undefined, leave empty string
      if (typeof config.data === 'string') {
        bodyString = config.data;
      } else if (Buffer.isBuffer(config.data)) {
        bodyString = config.data.toString();
      } else if (Object.keys(config.data).length > 0) {
        bodyString = JSON.stringify(config.data);
      }
    }

    // ✅ Compute HMAC
    const hmac = crypto.createHmac('sha256', SUMSUB_SECRET_KEY);
    hmac.update(String(ts) + method + pathWithQuery + bodyString);

    config.headers['X-App-Token'] = SUMSUB_APP_TOKEN;
    config.headers['X-App-Access-Ts'] = ts;
    config.headers['X-App-Access-Sig'] = hmac.digest('hex');

    return config;
  },
  (error) => Promise.reject(error)
);

export default sumsubClient;
