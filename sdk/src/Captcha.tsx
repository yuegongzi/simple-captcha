import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { CaptchaProps } from './Captcha.types';
import { noop, getRandomType } from './utils';
import Popup from './Popup';
import { CaptchaStyle } from './CaptchaStyle';
import { Click, Slide, SlideRegion, Rotate } from './_internal';
import type { ClickDot, SlideRegionPoint, SlidePoint } from './_internal';
import { useCaptchaRequest } from './hooks';
import { ConfigProvider, useConfig } from './ConfigProvider';

const CaptchaInternal = forwardRef<any, Omit<CaptchaProps, 'locale' | 'theme' | 'api' | 'path'>>((props, ref) => {
  const {
    onCancel = noop,
    onSuccess = noop,
    onFail = noop,
    className,
    style,
    config,
    type: typeProp = 'auto',
    children,
  } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const { locale } = useConfig();

  const type = useMemo(() => {
    if (typeProp === 'auto') {
      return getRandomType();
    } else {
      return typeProp || 'click-text';
    }
  }, [typeProp]);

  const { get, check, data } = useCaptchaRequest({ type, mode: 'dark' });
  const captchaRef = useRef<any>(null);
  const start = async () => {
    if (captchaRef.current) {
      captchaRef.current.clear();
    }
    setVisible(true);
    await get();

  };
  const _close = () => {
    setVisible(false);
    onFail(locale.userCancel || '用户取消');
    onCancel();
  };

  const _confirm = async (rawBody: any) => {
    const { success, data } = await check(rawBody);
    if (success) {
      setVisible(false);
      onSuccess(data);
    } else {
      await start();
    }
  };

  const _click = async (dots: ClickDot[]) => {
    const dotStr = dots.flatMap(item => [item.x, item.y]).join(',');
    const data = { dots: dotStr };
    await _confirm(data);
  };

  const _slide = async (point: SlideRegionPoint | SlidePoint) => {
    await _confirm({ point: [point.x, point.y].join(',') });
  };
  const _rotate = async (angle: number) => {
    await _confirm({ angle: `${angle}` });
  };
  useImperativeHandle(ref, () => ({ verify: start }));
  const events = {
    close: _close,
    refresh: start,
  };

  return (
    <div className={className} style={{ position: 'relative', display: 'inline-block', ...style }}>
      <Popup visible={visible}>
        {['click-text', 'click-shape'].includes(type) &&
          <Click config={config} data={data} ref={captchaRef} events={{
            ...events, confirm: _click,
          }} />}
        {'rotate' === type &&
          <Rotate config={config} data={data} ref={captchaRef} events={{ ...events, confirm: _rotate }} />}
        {'slide-region' === type &&
          <SlideRegion config={config} data={data} ref={captchaRef} events={{ ...events, confirm: _slide }} />}
        {'slide-text' === type &&
          <Slide config={config} data={data} ref={captchaRef} events={{ ...events, confirm: _slide }} />}
      </Popup>
      {children}
    </div>
  );
});

const Captcha = forwardRef<any, CaptchaProps>((props, ref) => {
  const { locale, theme, api, path, ...restProps } = props;
  return (
    <ConfigProvider locale={locale} theme={theme} api={api} path={path}>
      <CaptchaStyle />
      <CaptchaInternal {...restProps} ref={ref} />
    </ConfigProvider>
  );
});

export default Captcha;
