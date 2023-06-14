const URLS = new Map([
  ['DEV', ''], // 开发环境
  ['TEST', ''], // 测试环境
  ['STAGE', ''], // 预发布环境
  ['PROD', ''], // 线上环境
]);

const config = {
  VER: '1.0.0', // 小程序版本号
  ENV: 'dev', // 环境变量: dev, test, stage, prod
  BASE_URL: '', // request 域名（依环境变量自动填充）
};

config.BASE_URL = URLS.get(config.ENV.toUpperCase()) || '';

export default config;
