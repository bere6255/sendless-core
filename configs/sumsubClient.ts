import dotenv from 'dotenv';
import crypto from 'crypto';
import axios, { AxiosRequestConfig } from 'axios';
dotenv.config();

const SUMSUB_BASE_URL = process.env.SUMSUB_BASE_URL || 'https://api.sumsub.com';
const SUMSUB_APP_TOKEN = process.env.SUMSUB_APP_TOKEN || '';
const SUMSUB_SECRET_KEY = process.env.SUMSUB_SECRET_KEY || '';

export const sumsubClient = {
  sign(ts: number | string, method: string, urlPath: string, bodyString: string) {
    return crypto
      .createHmac('sha256', SUMSUB_SECRET_KEY)
      .update(String(ts) + method + urlPath + bodyString)
      .digest('hex');
  },


  async get(path: string, config: AxiosRequestConfig = {}) {
    const method = 'GET';
    const ts = Math.floor(Date.now() / 1000);
    const signature = this.sign(ts, method, path, '');


    return axios.get(`${SUMSUB_BASE_URL}${path}`, {
      ...config,
      headers: {
        'X-App-Token': SUMSUB_APP_TOKEN,
        'X-App-Access-Sig': signature,
        'X-App-Access-Ts': String(ts),
        ...config.headers,
      },
    });
  },


  async post(path: string, body: any = {}, config: AxiosRequestConfig = {}) {
    const method = 'POST';
    const ts = Math.floor(Date.now() / 1000);
    const bodyString = JSON.stringify(body) || '';
    const signature = this.sign(ts, method, path, bodyString);


    return axios.post(`${SUMSUB_BASE_URL}${path}`, body, {
      ...config,
      headers: {
        'X-App-Token': SUMSUB_APP_TOKEN,
        'X-App-Access-Sig': signature,
        'X-App-Access-Ts': String(ts),
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });
  },
};