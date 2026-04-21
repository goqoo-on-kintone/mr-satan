// ginue の設定
// https://github.com/goqoo-on-kintone/ginue
module.exports = {
  location: 'kintone-settings',
  alt: true,
  fileType: 'js',
  env: {
    development: {
      domain: 'your-dev.cybozu.com',
      app: {
        // 'アプリ名': アプリID
        sample1: 1,
        sample2: 2,
      },
    },
    production: {
      domain: 'your-prod.cybozu.com',
      app: {
        sample1: 1,
        sample2: 2,
      },
    },
  },
};
