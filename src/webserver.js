/**
 * Manage webserver to make Spotify AT calls
 */

const express = require('express')
const configuration = require('./configuration')
const a = require('./spotify')

module.exports = {
    start () {
        const app = express()
        const stateCode = [
            this.generateStateCode(),
            this.generateStateCode()
        ]
        app.get('/', (req, res) => {
            res.redirect(`https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A9876%2Fcallback&scope=${encodeURI(process.env.SPOTIFY_SCOPE)}&state=${stateCode[0]}`)
        })
        app.get('/callback', async function (req, res) {
            if (req.query['state'] === stateCode[0]) {
                await configuration.getTokens(req.query["code"])
                res.send('Login: You can close the window')
            } else if (req.query['state'] === stateCode[1])
                res.send('Token: You can close the window')
            else
                res.send('Something wrong happen ' + stateCode)
        })
        this.server = app.listen(9876)
    },

    // Took from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    generateStateCode() {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < 13; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * 
            charactersLength));
        }
        return result
    }
}
