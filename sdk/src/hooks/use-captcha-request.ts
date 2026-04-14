import { useState } from 'react';
import request from 'axios';
import type { CaptchaType } from '../Captcha.types';
import { useConfig } from '../ConfigProvider';

export interface GetCaptchaOption {
  type: CaptchaType
  mode?: 'light' | 'dark'
}

export interface Response {
  data?: any
  success?: boolean
  errcode?: number
  errmsg?: string
}

export interface GetCaptchaResult {
  get: () => Promise<Response>
  loading?: boolean
  data?: any
  success?: boolean
  errcode?: number
  errmsg?: string
  check: (rawBody: any) => Promise<Response>
}

export function useCaptchaRequest(option: GetCaptchaOption): GetCaptchaResult {
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ response, setResponse ] = useState<Response>({})
  const { api } = useConfig();

  const get = async (): Promise<Response> => {
    setLoading(true)
    let data;
    if (api.getCaptcha) {
      data = await api.getCaptcha(option.type);
    } else {
      const res = await request.get(`${api.basePath || ''}/cgi/captcha/${option.type}?mode=${option.mode}`);
      data = res.data;
    }
    setLoading(false)
    setResponse(data)
    return data
  }

  const check = async (rawBody: any): Promise<Response> => {
    setLoading(true)
    let data;
    if (api.verifyCaptcha) {
      data = await api.verifyCaptcha(option.type, rawBody);
    } else {
      const res = await request.post(`${api.basePath || ''}/cgi/captcha/${option.type}/${response.data?.key}`, rawBody);
      data = res.data;
    }
    setLoading(false)
    return data
  }
  return { get, check, loading, ...response }
}
