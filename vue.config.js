const path = require('path')
module.exports = {
  devServer: {
    disableHostCheck: true,
  },
  transpileDependencies: [
    'vuetify'
  ],
  chainWebpack: config => {
    const oneOfsMap = config.module.rule('scss').oneOfs.store
    oneOfsMap.forEach(item => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          // 單隻檔案引入
          resources: [path.resolve(__dirname, './src/assets/scss/mixin.scss')],
        })
        .end()
    })
  },
  pages: {
    index: 'src/main.js',
    whitelist: 'src/whitelist.js'
  }
}
