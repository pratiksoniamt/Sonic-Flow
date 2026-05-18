export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  coverArtUrl?: string;
  url: string;
  duration?: number; // in seconds
  source: 'spotify' | 'youtube' | 'custom' | 'file';
  streamUrl?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: Track[];
  coverUrl?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  favoriteGenres: string[];
  musicTasteSelected: boolean;
}
