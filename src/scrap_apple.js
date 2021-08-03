const cheerio = require('cheerio')
const axios = require('axios').default

function getPage(url)
{
    axios.get(url, {
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.115 Safari/537.36'
        }
    }).then(async (res) => {
        var $ = cheerio.load(res.data)
        var line = await $('.songs-list-row .songs-list-row--two-lines .songs-list-row--song', res.data).text()
        var tracks_name = await $('.songs-list-row__song-name', line)
        var authors = await $('.songs-list-row__link', line)
    for (let index = 0; index < tracks_name.length; index++) {
        const element = tracks_name[index];
        const author_elem = authors[index];
        var track_name = element.childNodes[1].data
        var author = author_elem.childNodes[1].data
        console.log(`Track n°${index}: ${track_name} - ${author}`);
    }
    }).catch((err) => console.error(err))
}


module.exports = getPage

