interface Post {
	userId: number;
	code: number;
	id: number;
	title: string;
	body: string;
}

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