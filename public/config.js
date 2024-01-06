module.exports = {
    // 打开浏览器的方式 可选 bat | exe
    openWay: 'exe',
    // 生产注册表信息的配置
    registryTableOptions: {
        // 注册的协议 要求：所有字母小写
        protocol: 'zopenchrome',
        // 注册项目录 可选：hkcr | hkcu | hku | hkcc
        hive: 'hkcu'
    }
}