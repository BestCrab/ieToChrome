const { exec } = require('child_process');
const util = require('util');

// 将exec转换为返回Promise的函数  
const execPromise = util.promisify(exec);  
 function checkRegistryKey(registryKey) {  
  return new Promise(async(resolve,reject) => {
    try {  
      const { stdout } = await execPromise(`reg query "${registryKey}"`);  
      // console.log(`注册表项 ${registryKey} 存在，输出为:\n${stdout}`);  
      resolve(true)
    } catch (error) {  
      if (error.code === 1) {  
        console.log(`注册表项 ${registryKey} 不存在`);  
      } else {  
        console.error(`执行reg query时出错:`, error);  
      }  
      reject(false)
    }  
  })
}  
  
module.exports =  function (registryOptions) {
    return new Promise(async (resolve, reject) => {
        try {
            const {
                REGISTRY_BASE_PATH,
                DEFAULT_ICON_PATH,
                SHELL_PATH,
                SHELL_OPEN_PATH,
                SHELL_OPEN_COMMAND_PATH,
            } = registryOptions
            const registryKeys = [  
                REGISTRY_BASE_PATH,
                DEFAULT_ICON_PATH,
                SHELL_PATH,
                SHELL_OPEN_PATH,
                SHELL_OPEN_COMMAND_PATH,
            ];   
            let result = null
            for (const registryKey of registryKeys) {  
              result = await checkRegistryKey(registryKey)
            }  
            resolve(true)
        } catch (error) {
           resolve(false)
        }
    })
}