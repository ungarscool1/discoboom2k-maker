# DiscoBoom 2000: Maker

DiscoBoom 2000: Maker is created to convert your favorite Apple Music playlst into Spotify playlist.

## Setup

1. Create app on [Spotify dev portal](https://developer.spotify.com/dashboard/)
2. Rename ``.env.example`` to ``.env``
3. Complete required information
4. Download modules
5. Have fun

### Scopes

Default scopes in example are required to edit, create and view your playlists. You can add some scope if you want but definitely not required.

### Markets

The market selection is very important, if you add a song forbidden in your country you aren't allow to listen it.

### Apple Music: Artist delimiter

It's an important line, following your country the artist delimiter can change.

| Language | Delimiter |
|----------|-----------|
| English  |    and    |
| Français |    et     |
| Español  |    y      |

## How to use the app

Launch the app with: ``db2k <apple music playlist link>``, the app will define the title, the description and fill music an playlist in Spotify from Apple Music.