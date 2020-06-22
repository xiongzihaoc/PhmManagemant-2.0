const CompressionPlugin = require("compression-webpack-plugin")

module.exports = {
  // 路径更改
  publicPath: "./",
  // 打包文件名
  outputDir: "dist",
  // 去除.map文件
  productionSourceMap: false,
  // css分离
  // css:{
  //   extract:true,
  //   sourceMap:false,
  //   loaderOptions:{},
  //   modules:false,
  // },
  // 压缩图片
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        bypassOnDebug: true
      })
      .end()
  },
  configureWebpack: () => ({
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: "all",
            test: /node_modules/,
            name: "vendor",
            minChunks: 1,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 100,
          },
          common: {
            chunks: "all",
            test: /[\\/]src[\\/]js[\\/]/,
            name: "common",
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 60,
          },
          styles: {
            name: "styles",
            test: /\.(sa|sc|c)ss$/,
            chunks: "all",
            enforce: true,
          },
          runtimeChunk: {
            name: "manifest"
          },
        }
      }
    }
  }),
  
  devServer: {
    proxy: {
      '/api': {
        target: 'http://xxx:20101/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    // host: "localhost",
    open: true,
    port: 8088
  },
  // gzip压缩
  // configureWebpack: () => {
  //   if (process.env.NODE_ENV === 'production') {
  //     return {
  //       plugins: [
  //         new CompressionPlugin({
  //           test: /\.js$|\.html$|\.css/, // 需要压缩的文件类型
  //           threshold: 10240, // 归档需要进行压缩的文件大小最小值，我这个是10K以上的进行压缩
  //           deleteOriginalAssets: false // 是否删除原文件
  //         })
  //       ]
  //     }
  //   }
  // }
}