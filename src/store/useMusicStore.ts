import { create } from 'zustand';
import { Track, UserProfile } from '../types';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, collection, addDoc, onSnapshot } from 'firebase/firestore';

interface MusicState {
  currentTrack: Track | null;
  queue: Track[];
  history: Track[];
  isPlaying: boolean;
  volume: number;
  progress: number;
  isMuted: boolean;
  repeatMode: 'none' | 'one' | 'all';
  isShuffle: boolean;
  isFullscreen: boolean;
  hasSeenOnboarding: boolean;
  user: UserProfile | null;
  isLoading: boolean;

  // Actions
  setUser: (user: UserProfile | null) => void;
  setCurrentTrack: (track: Track | null) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  toggleMute: () => void;
  setRepeatMode: (mode: 'none' | 'one' | 'all') => void;
  toggleShuffle: () => void;
  setFullscreen: (isFullscreen: boolean) => void;
  setHasSeenOnboarding: (hasSeenOnboarding: boolean) => void;
  playTrack: (track: Track) => void;
  syncUserToFirestore: (user: UserProfile) => Promise<void>;
  saveHistory: (track: Track) => Promise<void>;
}

export const useMusicStore = create<MusicState>((set, get) => ({
  currentTrack: null,
  queue: [],
  history: [],
  isPlaying: false,
  volume: 0.7,
  progress: 0,
  isMuted: false,
  repeatMode: 'none',
  isShuffle: false,
  isFullscreen: false,
  hasSeenOnboarding: false,
  user: null,
  isLoading: true,

  setUser: (user) => set({ user, isLoading: false, hasSeenOnboarding: user?.musicTasteSelected ?? false }),
  
  setCurrentTrack: (track) => set({ currentTrack: track, isPlaying: !!track }),
  
  addToQueue: (track) => set((state) => ({ 
    queue: [...state.queue, track] 
  })),

  removeFromQueue: (trackId) => set((state) => ({
    queue: state.queue.filter((t) => t.id !== trackId)
  })),

  clearQueue: () => set({ queue: [] }),

  playTrack: (track) => {
    const { history, user, saveHistory } = get();
    set({ 
      currentTrack: track, 
      isPlaying: true,
      history: [track, ...history.filter(t => t.id !== track.id)].slice(0, 50)
    });
    if (user) {
      saveHistory(track);
    }
  },

  syncUserToFirestore: async (userProfile) => {
    try {
      const userRef = doc(db, 'users', userProfile.id);
      const userSnap = await getDoc(userRef);
      
      const payload: any = {
        ...userProfile,
        updatedAt: serverTimestamp(),
      };

      // Only set createdAt if the document doesn't exist yet
      if (!userSnap.exists()) {
        payload.createdAt = serverTimestamp();
      }

      await setDoc(userRef, payload, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${userProfile.id}`);
    }
  },

  saveHistory: async (track) => {
    const { user } = get();
    if (!user) return;
    try {
      const historyRef = doc(db, 'users', user.id, 'history', track.id);
      await setDoc(historyRef, {
        ...track,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.id}/history/${track.id}`);
    }
  },

  playNext: () => {
    const { queue, repeatMode, currentTrack, history } = get();
    if (queue.length > 0) {
      const nextTrack = queue[0];
      set({
        currentTrack: nextTrack,
        queue: queue.slice(1),
        isPlaying: true,
        history: currentTrack ? [currentTrack, ...history].slice(0, 50) : history
      });
    } else if (repeatMode === 'all' && history.length > 0) {
      // Very basic repeat all logic for now
      const oldestTrack = history[history.length - 1];
      set({ currentTrack: oldestTrack, isPlaying: true });
    } else {
      set({ isPlaying: false });
    }
  },

  playPrevious: () => {
    const { history, queue, currentTrack } = get();
    if (history.length > 0) {
      const prevTrack = history[0];
      set({
        currentTrack: prevTrack,
        history: history.slice(1),
        queue: currentTrack ? [currentTrack, ...queue] : queue,
        isPlaying: true
      });
    }
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setRepeatMode: (repeatMode) => set({ repeatMode }),
  toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),
  setFullscreen: (isFullscreen) => set({ isFullscreen }),
  setHasSeenOnboarding: (hasSeenOnboarding) => set({ hasSeenOnboarding }),
}));
