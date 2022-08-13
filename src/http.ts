import axios, { AxiosRequestConfig } from 'axios';
import { useRequest } from 'ahooks';

const instance = axios.create({
  timeout: 1000 * 60 * 10,
  baseURL: '/ndzy/api/v2',
  headers: {
    'Content-Type': 'application/json',
    'X-Auth-Token': 'Y5FCTqzEDyWpzPHWTbuQbAa5USpZZZ94VaqNEaOO',
  },
});

export const useReq = () =>
  useRequest((p: AxiosRequestConfig<Record<string, any>>) => instance(p), {
    manual: true,
  });
