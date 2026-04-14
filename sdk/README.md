## @aetherlib/g-captcha

采用go语言编写的go-captcha, 针对go-captcha-react做进一步封装处理, 自动处理后台逻辑

> 本版本要求 `react@19` 与 `react-dom@19`。

## API

| 属性        | 说明                                                                                    | 类型              | 默认值  |
|-----------|---------------------------------------------------------------------------------------|-----------------|------|
| onFail    | 校验失败时的函数回调                                                                            | Function        | -    |
| onSuccess | 校验成功时的函数回调,会将二次校验参数作为参数传递                                                             | Function        | -    |
| onCancel  | 用户主动关闭/取消时的回调                                                             | Function        | -    |
| type      | 显示校验模块的方式,`auto` \| `click-text` \| `click-shape` \| `slide-text` \| `slide-region` \| `rotate` | String          | auto |
| path      | 后端路径前缀                                                                                | String          | -    |
| locale    | 多语言文案配置覆盖                                                                                | `LocaleTexts`          | -    |
| theme     | 主题色及样式变量覆盖                                                                                | `ThemeTokens`          | -    |
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

### LocaleTexts

| 属性 | 说明 |
|---|---|
| clickTitle | 点选模式标题 (默认: 请在下图依次点击) |
| slideTitle | 滑块/旋转模式标题 (默认: 请拖动滑块完成拼图) |
| confirmButton | 点选确认按钮 (默认: 确认) |
| buttonText | 触发验证按钮文案 (默认: 点击按键进行验证) |
| userCancel | 用户取消提示 (默认: 用户取消) |
| loading | 加载中文案 (默认: 加载中...) |

### ThemeTokens

| 属性 | 说明 | 默认值 |
|---|---|---|
| primaryColor | 主题色 | `#347eff` |
| backgroundColor | 弹窗背景色 | `#ffffff` |
| textColor | 文本颜色 | `#333333` |
| borderColor | 边框颜色 | `#e2e2e2` |
| borderRadius | 圆角大小 | `4` |

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

## 二次验证（S2S）

前端完成验证后，`onSuccess(data)` 回调中的 `data` 会包含一个 `second_key`。
你应该将此参数随表单提交到你的业务后台。然后你的业务后台向验证码服务端发起二次验证：

```bash
# S2S 调用示例
curl -X GET \
  https://您的验证码域名/api/v1/captchas/states/{second_key} \
  -H "Authorization: Bearer <API_KEY>"
```

如果返回 `{"valid": true}` 则代表验证通过，可以放行你的业务逻辑。
