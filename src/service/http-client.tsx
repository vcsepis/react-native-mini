import axios from 'axios';
import {URL_API_ENDPOINT} from '@env';

var token: any;

const Axios = axios.create({
  baseURL: `${URL_API_ENDPOINT}/api`,
  timeout: 5000000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class HttpClient {
  static async get<T>(url: string, params?: any, token?: any): Promise<any> {
    console.log(URL_API_ENDPOINT, url, 'URL_API_ENDPOINT');
    const response = await Axios.get<T>(url, {
      headers: {
        Authorization: `Bearer ${token || ''}`,
        params,
      },
    });
    return response.data;
  }

  static async post<T>(url: string, data: unknown, options?: any) {
    console.log(`${URL_API_ENDPOINT}${url}`, 'URL_API_ENDPOINT');

    const response = await Axios.post<T>(url, data, options);
    return response.data;
  }

  static async put<T>(url: string, data: unknown, options?: any) {
    const response = await Axios.put<T>(url, data, options);
    return response.data;
  }

  static async delete<T>(url: string) {
    const response = await Axios.delete<T>(url);
    return response.data;
  }
}
