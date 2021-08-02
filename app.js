#!/usr/bin/env node
require('dotenv').config()
const config = require('./src/configuration')
const ora = require('ora');
const open = require('open')
const ws = require('./src/webserver')
const spotify = require('./src/spotify')

config.openData()
if (!process.env.user_creds) {
    ws.start()
    open('http://localhost:9876')
} else {
    config.getRefreshedTokens(process.env.user_creds)
}
var spinner = ora('Waiting authorization...').start();

function aaa(spinner) {
    var i = 0
    return new Promise((resolve, reject) => {
        var interval = setInterval(() => {
            if (process.env.access_token) {
                spotify.getUserInfo().then((user) => {
                    spinner.succeed(`Logged in as ${user.display_name} (${user.id})`)
                })
                spinner.stop()
                clearInterval(interval)
                resolve(true)
            }
            if (i == 240)
                spinner.warn('It takes too long :/')
            if (i == 300)
                spinner.start('Waiting authorization...')
            i++
        }, 250)
        setTimeout(() => {
            spinner.fail('Timeout 10 minutes')
            reject(false)
        }, 600000);
    })
}
aaa(spinner).then(async () => {
    //var aaaaaa = await spotify.getPlaylists()
    //console.log(aaaaaa)
})
//spinner.stop()
//console.log(spotify.getPlaylists())

// TODO: scrap apple music
// TODO: Add to spotify