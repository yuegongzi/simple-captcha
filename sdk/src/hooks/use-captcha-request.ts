import { useState } from 'react';
import request from 'axios';
import type { CaptchaType } from '../Captcha.types';
import { useConfig } from '../ConfigProvider';

export interface GetCaptchaOption {
  type: CaptchaType
  mode?: 'light' | 'dark'
}

export interface GetCaptchaResult {
  get: () => Promise<any>
  loading?: boolean
  data?: any
  error?: any
  check: (rawBody: any) => Promise<any>
}

export function useCaptchaRequest(option: GetCaptchaOption): GetCaptchaResult {
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ data, setData ] = useState<any>(null)
  const [ error, setError ] = useState<any>(null)
  const { api } = useConfig();

  const get = async (): Promise<any> => {
    setLoading(true)
    setError(null)
    try {
      let resData;
      if (api.getCaptcha) {
        resData = await api.getCaptcha(option.type);
      } else {
        const basePath = api.basePath || '';
        const url = `${basePath}/api/v1/captchas/${option.type}?mode=${option.mode || ''}`;
        const res = await request.get(url);
        resData = res.data;
      }
      setData(resData);
      return resData;
    } catch (e: any) {
      const errResponse = e?.response?.data || e;
      setError(errResponse);
      throw errResponse;
    } finally {
      setLoading(false);
    }
  }

  const check = async (rawBody: any): Promise<any> => {
    setLoading(true)
    setError(null)
    try {
      let resData;
      if (api.verifyCaptcha) {
        resData = await api.verifyCaptcha(option.type, rawBody);
      } else {
        const basePath = api.basePath || '';
        const url = `${basePath}/api/v1/captchas/${option.type}/${data?.key}/verify`;
        const res = await request.post(url, rawBody);
        resData = res.data;
      }
      return resData;
    } catch (e: any) {
      const errResponse = e?.response?.data || e;
      setError(errResponse);
      throw errResponse;
    } finally {
      setLoading(false);
    }
  }
  return { get, check, loading, data, error }
}
