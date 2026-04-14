import { useRef } from 'react';
import { Captcha, useCaptcha } from 'g-captcha';

export default () => {
  const ref = useRef();
  const [run] = useCaptcha({ path: 'http://127.0.0.1:3321', type: 'auto' });
  const click = () => {
    ref.current?.verify();
  };

  return (
    <Captcha
      onSuccess={(data) => console.log(data)}
      path="http://127.0.0.1:3321"
      type="auto"
      ref={ref}
    >
      <button
        onClick={click}
        style={{
          border: 'none',
          color: '#fff',
          width: '100px',
          height: '50px',
          lineHeight: '50px',
          borderRadius: '5px',
          background: '#1890ff',
        }}
      >
        验证
      </button>

      <button
        onClick={async () => {
          try {
            const data = await run();
            console.log(data);
          } catch (e) {
            console.log(e);
          }
        }}
        style={{
          border: 'none',
          color: '#fff',
          width: '100px',
          height: '50px',
          borderRadius: '5px',
          marginLeft: '10px',
          lineHeight: '50px',
          background: '#5736f3',
        }}
      >
        使用Hook
      </button>
    </Captcha>
  );
}
