const config = require('../public/config')
const writeBat = require('./lib/write_bat')
const registryTable = require('./lib/registry_table')
const openChrome = require('./lib/open_chrome')
const checkRegistryKey = require('./lib/check_registry_keys')

;(async function main() {
    if(config.openWay === 'bat'){
        // 写入bat文件
        writeBat(config)
        const {gernerateRegistryTable,registryProtocol,writeRegistryTable} = registryTable
        // 1、生成注册表参数
        const registryOptions = gernerateRegistryTable(config)
        try {
            // 2、自动注册协议
            registryProtocol(registryOptions)
        } catch (error) {
            // 无管理员权限，生成注册表，手动注册
            writeRegistryTable(registryOptions)
        }   
    } else {
        // 判断是否注册表已经注册
        const {gernerateRegistryTable,registryProtocol,writeRegistryTable} = registryTable
        // 1、生成注册表参数
        const registryOptions = gernerateRegistryTable(config)
        const isExist = await checkRegistryKey(registryOptions)
        if(isExist){
            openChrome(config)
        } else {
            try {
                // 2、自动注册协议
                registryProtocol(registryOptions)
            } catch (error) {
                // 无管理员权限，生成注册表，手动注册
                writeRegistryTable(registryOptions)
            }  
        }
    }
})()