const { defineConfig } = require('@vue/cli-service')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
// const WindiCSSWebpackPlugin = require('windicss-webpack-plugin')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  // publicPath: './',
  productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,
  transpileDependencies: ['vuex-persist'],
  devServer: {
    port: 8001,
    proxy: {
      '/api': {
        target: 'https://api.xydec.com.cn',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '', //将URL中的/api替换为空
        },
      },
    },
  },
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      // new WindiCSSWebpackPlugin(),
    ],
  },
})
