interface playList {
    id: number;
    title: string;
    desc: string;
    cover: string;
}

// MusicHall 接口

interface PlaylistItem {
    id: number;
    type: number;
    name: string;
    copyright: string | '';
    picUrl: string;
    canDislike: boolean;
    trackNumberUpdateTime: number;
    playCount: number;
    trackCount: number;
    highQuality: boolean;
    alg: string;
}

interface NewSong {
    id: number;
    name: string;
    cover: string;
    artist: string;
}

interface SongItem {
    name: string;
    id: number;
    position: number;
    alias: string[];
    status: number;
    fee: number;
    copyrightId: number;
    disc: string;
    no: number;
    artists: SongArtist[];
}

interface NewSongItem {
    id: number;
    type: number;
    name: string;
    copywriter: string | null;
    picUrl: string;
    canDislike: boolean;
    trackNumberUpdateTime: number | null;
    song: SongItem | null;
    alg: string;
}

interface SongArtist {
    name: string;
    id: number;
    picId: number;
    img1v1Id: number;
    briefDesc: string;
    picUrl: string;
    img1v1Url: string;
    albumSize: number;
    alias: string[];
    trans: string;
    musicSize: number;
    topicPerson: number;
}

interface Artist {
    id: number;
    name: string;
    rank: number;
    avatar: string;
}

interface ArtistItem {
    name: string;
    id: number;
    picUrl: string;
    fansCount: number;
}

// MusicList 接口

interface Track {
    id: number;
    name: string;
    artist: string;
    durationMs: number | 0;
    album: string | '';
}

interface PlaylistDetailItem {
    id: number;
    name: string;
    coverImgUrl: string;
    tracks: TrakItem[];
}

interface TrakItem {
    id: number;
    name: string;
    ar: ArItem[] | [];
    artist: ArItem[] | [];
    dt: number | 0;
    duration: number | 0;
    al: AlItem;
    album: AlItem;
}

interface AlItem {
    id: number;
    name: string;
    picUrl: string;
}

interface ArItem {
    id: number;
    name: string;
}