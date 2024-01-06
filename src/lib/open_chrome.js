const { spawn } = require('child_process');
const fs = require('fs')
const path = require('path')
module.exports = function (config) {
    const { registryTableOptions } = config
    const protocol = registryTableOptions.protocol
    const executablePath = process.argv[0];  
    // 解析为绝对路径  
    const absolutePath = path.resolve(executablePath);  

    const url = process.argv[2]; // 获取命令行传入的第二个参数，即URL  
    // 检查URL是否以zopenchrome://开头  
    if (url && url.startsWith(`${protocol}://`)) {
        // 移除zopenchrome://前缀以获取实际的URL  
        const actualUrl = url.slice(`${protocol}://`.length);

        // chrome.exe的路径，假设与脚本位于同一目录  
        const chromePath = absolutePath.replace('Chromelauncher.exe', 'chrome.exe');

        // 使用spawn启动chrome.exe并打开指定的URL  
        const chrome = spawn(chromePath, [actualUrl], {
            detached: true, // 让子进程在父进程退出后继续运行  
            stdio: 'ignore', // 忽略子进程的输入输出  
            windowsHide: true
        });

        chrome.unref(); // 防止Node.js事件循环等待子进程退出  
        console.log(`Opened URL in Chrome: ${actualUrl}`);
    } else {
        console.error('No valid URL provided or incorrect protocol.');
    }
}