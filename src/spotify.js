/**
 * Spotify API Wrapper
 */

const axios = require('axios').default

module.exports = {
    async getUserInfo() {
        return await axios.get("https://api.spotify.com/v1/me", {
            headers: {
                'Authorization': `Bearer ${process.env.access_token}`
            }
        }).then((res) => {
            return res.data
        }).catch((err) => {
            console.error(err);
        })
    },
    /**
     * Search a track by name
     * @param {String} name Track name
     * @returns Spotify item
     */
    async getTrackByName(name) {
        return await axios.get("https://api.spotify.com/v1/search", {
            params: {
                q: name,
                type: 'track',
                market: process.env.SPOTIFY_MARKET
            },
            headers: {
                'Authorization': `Bearer ${process.env.access_token}`
            }
        }).then((res) => {
            return res.data.tracks.items[0]
        }).catch((err) => {
            console.error(err);
        })
    },
    /**
     * Get playlists
     * @returns {Array} Spotify items
     */
    async getPlaylists() {
        return await axios.get("https://api.spotify.com/v1/me/playlists", {
            headers: {
                'Authorization': `Bearer ${process.env.access_token}`
            }
        }).then((res) => {
            return res.data.items
        }).catch((err) => {
            console.error(err);
        })
    },
    /**
     * Get playlist by name
     * @param {String} name Playlist name
     * @returns {*} Spotify response
     */
    async getPlaylistByName(name) {
        var playlists = await this.getPlaylists()
        for (let i = 0; i < playlists.length; i++) {
            if (playlists[i].name === name)
                return playlists[i]
        }
        return 'fail'
    },
    /**
     * Create a playlist
     * @param {String} name Playlist name
     * @returns Spotify response
     */
    async createPlaylist(name) {
        return await axios.post("https://api.spotify.com/v1/me/playlists", {
            name,
            public: false,
            collaborative: false
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.access_token}`
            }
        }).then((res) => {
            return res.data
        }).catch((err) => {
            console.error(err);
        })
    },
    /**
     * Get Playlist Items
     * @param {String} playlist_id Playlist identifier
     * @returns Spotify items
     */
    async getPlaylistItems(playlist_id) {
        return await axios.get(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
            params: {
                market: process.env.SPOTIFY_MARKET
            },
            headers: {
                'Authorization': `Bearer ${process.env.access_token}`
            }
        }).then((res) => {
            return res.data.items
        }).catch((err) => {
            console.error(err);
        })
    },
    /**
     * Update Playlist description
     * @param {String} playlist_id Playlist identifier
     * @param {String} description Description
     * @returns Spotify response
     */
    async updatePlaylistDescription(playlist_id, description) {
        return await axios.put(`https://api.spotify.com/v1/playlists/${playlist_id}`, {
            description
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.access_token}`
            }
        }).then((res) => {
            return res.data
        }).catch((err) => console.error(err))
    },
    async addItemToPlaylist(playlist_id, track_id) {
        return await axios.post(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
            uris: [`spotify:track:${track_id}`]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.access_token}`
            }
        }).then((res) => {
            return res.data.items
        }).catch((err) => {
            console.error(err);
        })
    },
    async addItemsToPlaylist(playlist_id, tracks_id) {
        return await axios.post(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
            uris: tracks_id
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.access_token}`
            }
        }).then((res) => {
            return res.data.items
        }).catch((err) => {
            console.error(err);
        })
    },
    async removeItemFromPlaylist(playlist_id, track_id) {
        return await axios.delete(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
            data: {
                "tracks": [
                    {
                        "uri": track_id,
                        "positions": [
                            0
                        ]
                    }
                ]
            },
            headers: {
                'Authorization': `Bearer ${process.env.access_token}`
            }
        }).then((res) => {
            return res.data
        }).catch((err) => {
            console.error(err)
        })
    }
}