## @aetherlib/g-captcha

采用go语言编写的go-captcha, 针对go-captcha-react做进一步封装处理, 自动处理后台逻辑

> 本版本要求 `react@19` 与 `react-dom@19`。

## API

| 属性        | 说明                                                                                    | 类型              | 默认值  |
|-----------|---------------------------------------------------------------------------------------|-----------------|------|
| onFail    | 校验失败时的函数回调                                                                            | Function        | -    |
| onSuccess | 校验成功时的函数回调,会将二次校验参数作为参数传递                                                             | Function        | -    |
| type      | 显示校验模块的方式,`click-text` \| `click-shape` \| `slide-text` \| `slide-region` \| `rotate` | String          | auto |
| path      | 后端路径前缀                                                                                | String          | -    |
| config    | 验证码配置                                                                                 | `CaptchaConfig` | -    |

### CaptchaConfig

| 属性                | 说明              | 类型      | 默认值 |
|-------------------|-----------------|---------|-----|
| width             | 宽度              | number  | -   |
| height            | 高度              | number  | -   |
| thumbWidth        | 缩略图宽度           | number  | -   |
| thumbHeight       | 缩略图高度           | number  | -   |
| verticalPadding   | 垂直方向的内边距        | number  | -   |
| horizontalPadding | 水平方向的内边距        | number  | -   |
| showTheme         | 显示主题            | boolean | -   |
| title             | 标题              | String  | -   |
| iconSize          | 图标大小            | number  | -   |
| scope             | 作用域 滑动和旋转方式生效   | number  | -   |
| buttonText        | 按钮文字            | String  | -   |
| dotSize           | 点击区域的大小 点选方式的生效 | number  | -   |


## hooks

useCaptcha

```jsx
import { useRef } from 'react';
import { useCaptcha } from '@aetherlib/g-captcha';

export default () => {
  const [run] = useCaptcha({ path: 'http://foo.com', type: 'auto' });

  const click = async () => {
    const data = await run()
    console.log(data)
  };

  return (<button onClick={click}>verify</button>);
}

```

## Demo

```jsx
import { useRef } from 'react';
import { Captcha } from '@aetherlib/g-captcha';

export default () => {
  const ref = useRef();

  const click = () => {
    ref.current?.verify();
  };

  return (
    <Captcha
      onSuccess={(data) => console.log(data)}
      path='https://api.xxx.com'
      type='auto'
      ref={ref}
    >
      <button
        onClick={click}
        style={{
          border: 'none',
          color: '#fff',
          width: '100px',
          height: '50px',
          lineHeight: '50p',
          background: '#1890ff',
        }}
      >
        点击
      </button>
    </Captcha>
  );
}

```
