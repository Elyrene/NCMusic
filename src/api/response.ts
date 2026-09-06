export interface Post {
  userId: number;
  code: number;
  id: number;
  title: string;
  body: string;
}

export interface PlaylistItem {
  id: number;
  name: string;
  copyright: string | '',
  picUrl: string,
}

export interface PersonalizedResponse {
  hasTest: boolean;
  code: number;
  category: number;
  result: PlaylistItem[];
}