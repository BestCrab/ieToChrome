const rcedit = require('rcedit')
const path = require('path')
const package = require('../package.json')
;(async() => {
    const exePath = path.join(__dirname, '../package/Chromelauncher.exe')
    const icoPath = path.join(__dirname, '../public/drink.ico')
    const version = package.version
     await rcedit(exePath, {
        'file-version': version,
        icon: icoPath
     })
})()