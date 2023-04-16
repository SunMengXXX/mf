module.exports = {
    publicPath: "/",
    assetsDir: "static",
    outputDir: 'dist',
    productionSourceMap: false,
    // 解决实验楼环境启动的 https，服务端接口是 http 造成跨域的问题。
    devServer: {
        proxy: {
            '/HNBC': {
                //106.15.187.164
                target: "http://47.113.218.250:8080", // 配置到服务器后端的API头部
                pathRewrite: {
                    '^/HNBC': '/HNBC' // 路径重写，第一个与上面相同，第二个/queue-admin 为server.context-path（服务器的上下文）
                },
                logLevel: 'debug',
                // 以下解决https 访问问题。上面的可以访问http
                changeOrigin: true,
                secure: false,
            }
        }
    }
}