import type { BaseTypeProps } from './types';
import type { ReactNode } from 'react';

export type CaptchaType = 'auto' | 'click-text' | 'click-shape' | 'slide-text' | 'slide-region' | 'rotate';

export interface LocaleTexts {
  userCancel?: string;
  loading?: string;
}

export interface ThemeTokens {
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderRadius?: number;
}

export interface ApiConfig {
  basePath?: string;
}

export interface CaptchaConfig {
  width?: number;
  height?: number;
  thumbWidth?: number;
  thumbHeight?: number;
  verticalPadding?: number;
  horizontalPadding?: number;
  showTheme?: boolean;
  title?: string;
  iconSize?: number;
  scope?: boolean;
  buttonText?: string;
  dotSize?: number;
}

export interface CaptchaProps extends BaseTypeProps {
  /**
   * 后端服务根路径，例如 'http://127.0.0.1:3321'
   */
  path?: string;

  /**
   * API 配置，仅包含 basePath
   */
  api?: ApiConfig;

  /**
   * 主题与样式配置
   */
  theme?: ThemeTokens;

  /**
   * 多语言包或预设语言标记 ('zh-CN' | 'en-US')
   */
  locale?: 'zh-CN' | 'en-US' | LocaleTexts;

  /**
   * 验证码类型
   * @default auto
   */
  type?: CaptchaType;

  /**
   * 取消事件
   */
  onCancel?: () => void;
  /**
   * 校验失败
   */
  onFail?: (msg: string) => void;
  /**
   * 校验成功
   */
  onSuccess?: (data: any) => void;
  /**
   * 引用声明
   */
  ref?: any;
  /**
   * 子节点
   */
  children?: ReactNode,
  /**
   * 验证码基本配置
   */
  config?: CaptchaConfig;
}
