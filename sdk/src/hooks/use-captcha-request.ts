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
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<any>(null)
  const { api } = useConfig();
  const basePath = api.basePath || '';

  const get = async (): Promise<any> => {
    setLoading(true)
    setError(null)
    try {
      const url = `${basePath}/api/v1/captchas/${option.type}?mode=${option.mode || ''}`;
      const res = await request.get(url);
      setData(res.data);
      return res.data;
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
      const url = `${basePath}/api/v1/captchas/${option.type}/${data?.key}/attempts`;
      const res = await request.post(url, rawBody);
      return res.data;
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
