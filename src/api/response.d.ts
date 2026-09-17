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

interface LoginQrKeyRes {
	code: number;
	data: {
		code: number;
		unikey: string;
	};
}

interface LoginQrCreateRes {
	code: number;
	data: {
		qrimg: string | '';
		qrurl: string | '';
	};
}

interface LoginQrCheckRes {
	code: number;
	cookie: string;
}

interface LoginStatusRes {
	data: {
		profile: {
			userId: number;
			nickname: string;
			avatarUrl: string;
		};
	};
}

interface LogoutRes {
	code: number;
}

interface UserPlayListRes {
	code: number;
	playlist: {
		id: number;
		coverImgUrl: string;
		userid: number;
		name: string;
		trackCount: number;
	}[];
}