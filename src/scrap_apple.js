const cheerio = require('cheerio')
const axios = require('axios').default
const ora = require('ora')

module.exports = {
    /**
     * Get Apple Music playlist
     * @param {String} url 
     * @returns {*}
     */
    async getPage(url)
    {
        var spinner = ora('Fetching playlist...').start();
        var songs = []
        return await axios.get(url, {
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.115 Safari/537.36'
            }
        }).then(async (res) => {
            var $ = cheerio.load(res.data)
            var lines = await $('.songs-list-row.songs-list-row--two-lines.songs-list-row--song', res.data)
            for (let index = 0; index < lines.length; index++) {
                var track_name = await $('.songs-list-row__song-name', lines[index]).text()
                var author = await $('div.typography-body.songs-list__col--artist', lines[index]).text().trim()
                author = author.replace(process.env.APPLE_MUSIC_ARTISTS_DELIMITER, '').replace(/\s+/g, ' ')
                songs.push(`${track_name} ${author}`)
            }
            spinner.succeed(`Playlist ${await $('h1.product-name', res.data).text().trim()} fetched`)
            return {
                title: await $('h1.product-name', res.data).text().trim(),
                description: await $('div.product-page-header__metadata--notes.typography-body-tall', res.data).text().trim(),
                songs
            }
        }).catch((err) => {
            spinner.fail(`Can't fetch Apple Music's playlist (code: ${err})`)
        })
    }
}

