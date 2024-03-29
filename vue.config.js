module.exports = {
  runtimeCompiler: true,
  productionSourceMap: false,
  lintOnSave: process.env.NODE_ENV !== 'production',
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:9001',
        ws: true,
        changeOrigin: true
      }
    }
  },
  configureWebpack:{
    performance: {
      hints: false
    },
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000,
      }
    }
  }
}
