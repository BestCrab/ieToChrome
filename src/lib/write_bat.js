const fs = require('fs');  
  
module.exports = function(config){
    const {registryTableOptions} = config
    // 批处理文件的内容  
const batContent = `@echo off
setlocal

set "FULL_URL=%~1"
echo Received parameters: %*

if "%FULL_URL%"=="" (
    echo No URL provided.
    goto :eof
)
echo FULL_URL: %FULL_URL%

set "ACTUAL_URL=%FULL_URL:${registryTableOptions.protocol}://=%"

echo ACTUAL_URL: %ACTUAL_URL%

set "CHROME_PATH=%~dp0chrome.exe"

start "" "%CHROME_PATH%" "%ACTUAL_URL%"

endlocal`;
  
// 将内容写入open.bat文件  
fs.writeFileSync('open.bat', batContent);  
  
console.log('open.bat 文件已成功创建或覆盖！');
}