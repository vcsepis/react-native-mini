import axios from 'axios';
import {VITE_APP_REST_API_ENDPOINT} from '@env';

const Axios = axios.create({
  baseURL: `${VITE_APP_REST_API_ENDPOINT}/api/v1`,
  timeout: 5000000,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Change request data/error here
Axios.interceptors.request.use(config => {
  //   const token = localStorage.getItem("token");
  //@ts-ignore
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ""}`,
  };
  return config;
});

export class HttpClient {
  static async get<T>(url: string, params?: any): Promise<any> {
    const response = await Axios.get<T>(url, {params});
    return response.data;
  }

  static async post<T>(url: string, data: unknown, options?: any) {
    const response = await Axios.post<T>(url, data, options);
    return response.data;
  }

  static async put<T>(url: string, data: unknown) {
    const response = await Axios.put<T>(url, data);
    return response.data;
  }

  static async delete<T>(url: string) {
    const response = await Axios.delete<T>(url);
    return response.data;
  }
}
