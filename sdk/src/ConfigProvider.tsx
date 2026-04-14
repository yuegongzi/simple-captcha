import { createContext, useContext, useMemo } from 'react';
import type { LocaleTexts, ThemeTokens, ApiConfig } from './Captcha.types';

export interface InternalConfig {
  locale: LocaleTexts;
  theme: ThemeTokens;
  api: ApiConfig;
}

const defaultLocale: LocaleTexts = {
  userCancel: '用户取消',
  loading: '加载中...',
};

const defaultTheme: ThemeTokens = {
  primaryColor: '#347eff',
  backgroundColor: '#ffffff',
  textColor: '#333333',
  borderColor: '#e2e2e2',
  borderRadius: 4,
};

const ConfigContext = createContext<InternalConfig>({
  locale: defaultLocale,
  theme: defaultTheme,
  api: {},
});

export const useConfig = () => useContext(ConfigContext);

export interface ConfigProviderProps {
  locale?: 'zh-CN' | 'en-US' | LocaleTexts;
  theme?: ThemeTokens;
  api?: ApiConfig;
  path?: string;
  children: React.ReactNode;
}

export const ConfigProvider = ({ locale, theme, api, path, children }: ConfigProviderProps) => {
  const mergedLocale = useMemo(() => {
    if (typeof locale === 'string') {
      if (locale === 'en-US') {
        return { userCancel: 'User Cancelled', loading: 'Loading...' };
      }
      return defaultLocale;
    }
    return { ...defaultLocale, ...locale };
  }, [locale]);

  const mergedTheme = useMemo(() => {
    return { ...defaultTheme, ...theme };
  }, [theme]);

  const mergedApi = useMemo(() => {
    return { basePath: path, ...api };
  }, [api, path]);

  const value = useMemo(
    () => ({ locale: mergedLocale, theme: mergedTheme, api: mergedApi }),
    [mergedLocale, mergedTheme, mergedApi]
  );

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};
