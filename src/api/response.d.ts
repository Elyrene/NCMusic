interface Post {
	userId: number;
	code: number;
	id: number;
	title: string;
	body: string;
}

// MusicHall 接口

interface PersonalizedRes {
	hasTest: boolean;
	code: number;
	category: number;
	result: PlaylistItem[];
}

interface PersonalizedNewSongRes {
	hasTest: boolean;
	code: number;
	category: number;
	result: NewSongItem[];
}

interface TopArtistsRes {
	hasTest: boolean;
	code: number;
	artists: ArtistItem[];
}

// MusicList 接口

interface PlaylistDetailRes {
	hasTest: boolean;
	code: number;
	playlist: PlaylistDetailItem;
}

// Player 接口

interface SongDetailRes {
	hasTest: boolean;
	code: number;
	songs: SongsItem[];
}

interface LyicRes {
	lrc: {
		version: number;
		lyric: string;
	}
}

interface SongUrlRes {
	code: number;
	data: {
		id: number;
		url: string;
	}[];
}