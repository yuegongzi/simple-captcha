import { useCallback, useEffect, useRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import Captcha from '../Captcha';
import type { CaptchaType } from '../Captcha.types';

export type CaptchaOption = {
  /**
   * 类型
   */
  type: CaptchaType;
  /**
   * 路径
   */
  path: string
}
export type Func = (val: any) => void;

export function useCaptcha(option: CaptchaOption) {
  const ref = useRef<any>(null);
  const successRef = useRef<Func>(null);
  const failRef = useRef<Func>(null);
  const rootRef = useRef<Root | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const onSuccess = useCallback((data: any) => {
    successRef.current?.(data);
  }, []);

  const onFail = useCallback((msg: any) => {
    failRef.current?.(msg);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const container = document.createElement('div');
    document.body.appendChild(container);
    containerRef.current = container;
    rootRef.current = createRoot(container);

    return () => {
      rootRef.current?.unmount();
      containerRef.current?.remove();
      rootRef.current = null;
      containerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    rootRef.current.render(
      <Captcha
        path={option.path}
        type={option.type}
        onFail={onFail}
        onSuccess={onSuccess}
        ref={ref}
      />,
    );
  }, [ option.path, option.type, onFail, onSuccess ]);

  const verify = (callBack: Func, fail: Func) => {
    successRef.current = callBack;
    failRef.current = fail;
    ref.current?.verify?.();
  };
  const run = () => {
    return new Promise((resolve, reject) => {
      verify(resolve, reject);
    });
  };
  return [ run, ref.current ];
}
