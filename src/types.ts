export interface Song {
    title: string
    artist: string
    youTubeId: string
}

export interface Playlist {
    key: number
    name: string
    songs: Song[]
}