#!/usr/bin/env node
require('dotenv').config()
const config = require('./src/configuration')
const ora = require('ora');
const open = require('open')
const ws = require('./src/webserver')
const spotify = require('./src/spotify')

if (process.argv.length == 2) {
    console.log("Usage: db2k <apple music playlist>");
    process.exit(0)
}

if (!process.argv[2].match('https://music.apple.com/fr/playlist/')) {
    console.log('Not an Apple Music playlist link');
    console.log("Usage: db2k <apple music playlist>");
    process.exit(1)
}

config.openData()
if (!process.env.user_creds) {
    ws.start()
    open('http://localhost:9876')
} else {
    config.getRefreshedTokens(process.env.user_creds)
}
var spinner = ora('Waiting authorization...').start();

function loginCheck(spinner) {
    var i = 0
    return new Promise((resolve, reject) => {
        var timeout = setTimeout(() => {
            spinner.fail('Timeout 10 minutes')
            clearInterval(interval)
            clearTimeout(timeout)
            reject('Timed out')
        }, 600000);
        var interval = setInterval(() => {
            if (process.env.access_token === 'false') {
                spinner.fail('Something went wrong while authentification.')
                clearInterval(interval)
                clearTimeout(timeout)
                reject('Authentification failed.')
            } else if (process.env.access_token) {
                spotify.getUserInfo().then((user) => {
                    spinner.succeed(`Logged in as ${user.display_name} (${user.id})`)
                    spinner.stop()
                    clearInterval(interval)
                    clearTimeout(timeout)
                    resolve(true)
                })
            }
            if (i == 240) {
                spinner.warn('It takes longer than usual :/')
                spinner.start('Waiting authorization...')
            }
            i++
        }, 250)
    })
}

/**
 * Populate Spotify playlist
 * @param {*} apple_music_result result of getPage function
 */
async function populateSpotify(apple_music_result) {
    var spinner = ora(`Searching your ${apple_music_result.title} playlist in Spotify`).start()
    var playlist = await spotify.getPlaylistByName(`Apple Music: ${apple_music_result.title}`)
    var tracks = []

    if (playlist === 'fail') {
        spinner.text = 'No playlist found, creating your playlist'
        playlist = await spotify.createPlaylist(`Apple Music: ${apple_music_result.title}`)
        spinner.succeed(`Playlist created: 'Apple Music: ${apple_music_result.title}'`)
    } else {
        spinner.succeed('Playlist found')
        spinner = ora(`Fetching existing tracks in ${playlist.name}`).start()
        var items = await spotify.getPlaylistItems(playlist.id)
        spinner.succeed(`Existing tracks fetched`)
        spinner = ora('Removing tracks').start()
        for (let i = 0; i < items.length; i++)
            setTimeout(() => {
                spotify.removeItemFromPlaylist(playlist.id, items[i].track.id)
            }, 500)
        spinner.succeed('All tracks are removed')
    }
    spinner = ora('Populating playlist').start()
    for (let i = 0; i < apple_music_result.songs.length; i++) {
        const song = apple_music_result.songs[i]
        var track = await spotify.getTrackByName(song)
        if (track)
            tracks.push(`spotify:track:${track.id}`)
        else
            console.log(`${song} n'a pas été trouvé :/`)
    }
    //tracks.forEach(track => console.log(track))
    spotify.addItemsToPlaylist(playlist.id, tracks)
    spinner.succeed('Your playlist is ready')
}

loginCheck(spinner).then(async () => {
    var result = await require('./src/scrap_apple').getPage(process.argv[2])
    await populateSpotify(result)
    //console.log(result)
}).catch((err) => {
    console.error(err)
    process.exit(1)
})
//spinner.stop()
//console.log(spotify.getPlaylists())

// TODO: scrap apple music
// TODO: Add to spotify