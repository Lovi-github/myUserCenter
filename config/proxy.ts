/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
    /*有这个请求路径有这个/api/的话，我们就怼他进行一个代理*/
    '/api/': {
      // 要代理的地址
      target: 'http://localhost:8902',
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
    },
  },
  //注意：proxy 功能仅在 dev 时有效。
  // prod: {
  //   // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
  //   /*有这个请求路径有这个/api/的话，我们就怼他进行一个代理*/
  //   '/api/': {
  //     // 要代理的地址
  //     target: 'http://localhost:8902',
  //     // 配置了这个可以从 http 代理到 https
  //     // 依赖 origin 的功能可能需要这个，比如 cookie
  //     changeOrigin: true,
  //   },
  // },
  test: {
    '/api/': {
      target: 'https://proapi.azurewebsites.net',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
