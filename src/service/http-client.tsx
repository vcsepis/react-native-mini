import axios from 'axios';
import {URL_API_ENDPOINT_DEV_CORE} from '@env';
import {CacheUtil} from '../utils';

var token: any;

const Axios = axios.create({
  baseURL: `${URL_API_ENDPOINT_DEV_CORE}/api`,
  timeout: 5000000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// // Change request data/error here
// Axios.interceptors.request.use(config => {
//   //@ts-ignore
//   config.headers = {
//     ...config.headers,
//     // Authorization: `Bearer ${token}`,
//     cookies:
//       'cf_clearance=iTt0CQisygu5M1t4gp4YND5HhdmHfzn.IrA3gikIfhg-1698331983-0-1-27744f0e.fc919643.57b744d3-0.2.1698331983; restaurant=Fe26.2*1*87ef5a196248c65b89c590fb61428a22b0d4443d6d0bf823cebfe920d5417350*mt35Brw2XPwKXr-T0Izyfg*GGwuoMoQ3p_cdm_ZxwLnWQ*1699784372651*2b2f588c341f471f55e9ebbefcf3d3a9f122f6caa30ccca1ca8d5d5554221a2a*JkAXs0UwzrWdbos3KLnFo8HpSk8naUlrjEVF9p2qa-Y~2',
//   };
//   return config;
// });

export class HttpClient {
  static async get<T>(url: string, params?: any, token?: any): Promise<any> {
    const response = await Axios.get<T>(url, {
      headers: {
        Authorization: `Bearer ${token || ''}`,
        params,
      },
    });
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
