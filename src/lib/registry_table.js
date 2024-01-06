const { exec } = require('child_process');  
const path = require('path')
const fs = require('fs')
  
// 添加注册表项的函数  
function addRegistryEntry(path, name, value, type = 'REG_SZ') {  
    return new Promise((resolve, reject) => {  
        let cmd = `reg add "${path}" /v "${name}" /t ${type} /d "${value}" /f`;  
        if (name === '') {  
            cmd = cmd.replace(`/v "${name}"`, '');  
        }  
        exec(cmd, (error, stdout, stderr) => {  
            if (error) {  
                reject(error);  
            } else {  
                resolve(stdout);  
            }  
        });  
    });  
}  
  
async function registryProtocol(config) {  
    const {
        REGISTRY_BASE_PATH,
        DEFAULT_ICON_PATH,
        SHELL_PATH,
        SHELL_OPEN_PATH,
        SHELL_OPEN_COMMAND_PATH,
        PROTOCOL_VALUE,
        URL_PROTOCOL_VALUE,
        ICON_VALUE,
        COMMAND_VALUE
    } = config 
  
    try {  
        await addRegistryEntry(REGISTRY_BASE_PATH, '', PROTOCOL_VALUE);  
        await addRegistryEntry(REGISTRY_BASE_PATH, 'URL Protocol', URL_PROTOCOL_VALUE);  
        await addRegistryEntry(DEFAULT_ICON_PATH, '', ICON_VALUE);  
        await addRegistryEntry(SHELL_PATH, '', '');
        await addRegistryEntry(SHELL_OPEN_PATH, '', '');
        await addRegistryEntry(SHELL_OPEN_COMMAND_PATH, '', escapeStringForJSTwo(COMMAND_VALUE));  
        console.log('Registry entries added successfully.');  
    } catch (error) {  
        console.error('Failed to add registry entries:', error);  
    }  
}  
function escapeStringForJSTwo(inputString) {  
    // 转义反斜杠和双引号  
    return inputString.replace(/"/g, '\\"');  
}  
const gernerateRegistryTable = (config) => {
    const hiveMap = {
        hkcr: 'HKEY_CLASSES_ROOT',
        hkcu: 'HKEY_CURRENT_USER',
        hklm: 'HKEY_LOCAL_MACHINE',
        hku: 'HKEY_USERS',
        hkcc: 'HKEY_CURRENT_CONFIG'
    }
    const { protocol, hive = 'HKCU' } = config.registryTableOptions
    // 协议路径
    const REGISTRY_BASE_PATH = `${hiveMap[hive]}\\Software\\Classes\\${protocol}`
    // icon路径
    const DEFAULT_ICON_PATH = `${REGISTRY_BASE_PATH}\\DefaultIcon`
    // Shell路径
    const SHELL_PATH = `${REGISTRY_BASE_PATH}\\shell`;
    // open路径
    const SHELL_OPEN_PATH = `${SHELL_PATH}\\open`;
    // command路径
    const SHELL_OPEN_COMMAND_PATH = `${SHELL_OPEN_PATH}\\command`;
    let PROTOCOL_VALUE = 'OpenChromeProtocol',
        URL_PROTOCOL_VALUE = '',
        ICON_VALUE = '',
        COMMAND_VALUE = ''
    if (config.openWay === 'bat') {
        // bat
        URL_PROTOCOL_VALUE = `${process.cwd()}\\open.bat`;
        ICON_VALUE = `${process.cwd()}\\open.bat,0`; // 通常图标路径后面会跟一个逗号和一个索引值  
        COMMAND_VALUE =`\"${process.cwd()}\\open.bat\" \"%1\"`;
    } else {
        // exe
        URL_PROTOCOL_VALUE = `${process.cwd()}\\Chromelauncher.exe`;
        ICON_VALUE = `${process.cwd()}\\Chromelauncher.exe,0`; // 通常图标路径后面会跟一个逗号和一个索引值  
        COMMAND_VALUE =`\"${process.cwd()}\\Chromelauncher.exe\" \"%1\"`;
    }
    return {
        REGISTRY_BASE_PATH,
        DEFAULT_ICON_PATH,
        SHELL_PATH,
        SHELL_OPEN_PATH,
        SHELL_OPEN_COMMAND_PATH,
        PROTOCOL_VALUE,
        URL_PROTOCOL_VALUE,
        ICON_VALUE,
        COMMAND_VALUE
    }
}
function escapeStringForJS(inputString) {  
    // 转义反斜杠和双引号  
    return inputString.replace(/\\/g, '\\\\').replace(/"/g, '\\"');  
}  
const  writeRegistryTable =  (config) => {
    const {
        REGISTRY_BASE_PATH,
        DEFAULT_ICON_PATH,
        SHELL_PATH,
        SHELL_OPEN_PATH,
        SHELL_OPEN_COMMAND_PATH,
        PROTOCOL_VALUE,
        URL_PROTOCOL_VALUE,
        ICON_VALUE,
        COMMAND_VALUE
    } = config 
    // 假设 chrome.exe 位于脚本的同一目录下  
    const chromePath = path.join(process.cwd(), 'chrome.exe');
    // 检查 chrome.exe 是否存在  
    fs.access(chromePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`Chrome not found at ${chromePath}`);
            process.exit(1); // 退出脚本  
        } else {
            // 创建注册表信息  
            const regContent = `Windows Registry Editor Version 5.00

[${REGISTRY_BASE_PATH}]
"URL Protocol"="${escapeStringForJS(URL_PROTOCOL_VALUE)}"
@="${PROTOCOL_VALUE}"

[${DEFAULT_ICON_PATH}]
@="${escapeStringForJS(ICON_VALUE)}"

[${SHELL_PATH}]
[${SHELL_OPEN_PATH}]
[${SHELL_OPEN_COMMAND_PATH}]
@="${escapeStringForJS(COMMAND_VALUE)}"
`;

            // 写入到 registry.reg 文件  
            fs.writeFile('registry.reg', regContent, (err) => {
                if (err) {
                    console.error('Error writing registry file:', err);
                } else {
                    console.log('Registry file created successfully.');
                }
            });
        }
    });
}
module.exports = {
    gernerateRegistryTable,
    writeRegistryTable,
    registryProtocol
}