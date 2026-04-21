// ginue の設定
// https://github.com/goofmint/ginue
module.exports = {
  location: 'kintone-settings',
  alt: true,
  fileType: 'js',
  env: {
    development: {
      domain: 'your-dev.cybozu.com',
      app: {
        // 'アプリ名': アプリID
        sample: 1,
      },
    },
    production: {
      domain: 'your-prod.cybozu.com',
      app: {
        sample: 1,
      },
    },
  },
};
