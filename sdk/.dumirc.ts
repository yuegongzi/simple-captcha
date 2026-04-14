import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'g-captcha',
  outputPath: 'docs-dist',
  // proxy: {
  //   '/cgi': {
  //     'target': 'https://api.ejiexi.com',
  //     'changeOrigin': true,
  //     'pathRewrite': { '^/$': '', },
  //   },
  // },
});
