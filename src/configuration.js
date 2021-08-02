const fs = require('fs')
const axios = require('axios').default

let config = {
    refreshToken: false,
    accessToken: false
}

module.exports = {
    openData() {
        try {
            let data = fs.readFileSync('./data/keys.json');
            let json = JSON.parse(data)
            process.env['user_creds'] = json.refresh_token
        } catch (error) {}
    },
    async getTokens(code) {
        const params = new URLSearchParams()
        params.append('grant_type', 'authorization_code')
        params.append('code', code)
        params.append('redirect_uri', 'http://localhost:9876/callback')

        await axios.post("https://accounts.spotify.com/api/token", params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')
            }
        }).then((res) => {
            process.env["access_token"] = res.data.access_token
            fs.writeFileSync('./data/keys.json', JSON.stringify(res.data));
        })
    },
    async getRefreshedTokens(code) {
        const params = new URLSearchParams()
        params.append('grant_type', 'refresh_token')
        params.append('refresh_token', code)
        params.append('redirect_uri', 'http://localhost:9876/callback')

        await axios.post("https://accounts.spotify.com/api/token", params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')
            }
        }).then((res) => {
            process.env["access_token"] = res.data.access_token
        })
    }
}