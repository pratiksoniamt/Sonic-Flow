import React from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, 
  Volume2, VolumeX, Repeat, Shuffle, 
  Maximize2, List, Mic2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useMusicStore } from '../store/useMusicStore';
import { formatTime, cn } from '../lib/utils';

export function PlayerControl() {
  const { 
    currentTrack, isPlaying, volume, progress, isMuted, repeatMode, isShuffle,
    togglePlay, playNext, playPrevious, setVolume, toggleMute, toggleShuffle, setRepeatMode, setFullscreen 
  } = useMusicStore();

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Logic for seeking will be handled by the actual Player component
  };

  if (!currentTrack) return null;

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-16 lg:bottom-0 left-0 right-0 h-16 lg:h-24 bg-black/80 backdrop-blur-2xl border-t border-white/5 flex items-center px-4 lg:px-6 z-50 overflow-hidden"
    >
      {/* Waveform Visualization Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-around px-10 lg:px-20">
        {[...Array(20)].map((_, i) => (
          <motion.div 
            key={i}
            animate={{ height: isPlaying ? [5, 20, 10, 30, 10] : 4 }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.05 }}
            className="w-0.5 lg:w-1 bg-brand-primary rounded-full transition-all"
          />
        ))}
      </div>

      {/* Track Info - Responsive width */}
      <div className="flex items-center gap-3 lg:gap-4 w-full lg:w-1/3 z-10 min-w-0">
        <div className="relative group shrink-0" onClick={() => setFullscreen(true)}>
          <img 
            src={currentTrack.coverArtUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100&h=100&fit=crop"} 
            alt={currentTrack.title}
            className="w-10 h-10 lg:w-14 lg:h-14 rounded-lg object-cover shadow-2xl group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="overflow-hidden flex-1 lg:flex-none">
          <h3 className="font-semibold text-xs lg:text-sm truncate hover:text-brand-primary cursor-pointer transition-colors">
            {currentTrack.title}
          </h3>
          <p className="text-[10px] lg:text-xs text-zinc-400 truncate hover:text-zinc-300 cursor-pointer">{currentTrack.artist}</p>
        </div>
        <div className="lg:hidden flex items-center gap-3">
          <button onClick={togglePlay} className="text-white">
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
          </button>
        </div>
      </div>

      {/* Controls - Hide on mobile */}
      <div className="hidden lg:flex flex-col items-center gap-3 w-1/3 z-10">
        <div className="flex items-center gap-6">
          <button 
            onClick={toggleShuffle}
            className={cn("transition-colors", isShuffle ? "text-brand-primary" : "text-zinc-500 hover:text-white")}
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button onClick={playPrevious} className="text-zinc-300 hover:text-white transition-colors">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button 
            onClick={togglePlay}
            className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
          </button>
          <button onClick={playNext} className="text-zinc-300 hover:text-white transition-colors">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
          <button 
            onClick={() => setRepeatMode(repeatMode === 'none' ? 'all' : repeatMode === 'all' ? 'one' : 'none')}
            className={cn("transition-colors", repeatMode !== 'none' ? "text-brand-primary" : "text-zinc-500 hover:text-white")}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-3 w-full max-w-md">
          <span className="text-[10px] text-zinc-500 font-mono w-10 text-right">{formatTime(currentTrack.duration ? currentTrack.duration * progress : 0)}</span>
          <div className="relative flex-1 group">
            <input 
              type="range" 
              min="0" max="1" step="0.001"
              value={progress}
              onChange={handleSeek}
              className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-brand-primary hover:h-1.5 transition-all"
            />
          </div>
          <span className="text-[10px] text-zinc-500 font-mono w-10">{formatTime(currentTrack.duration || 0)}</span>
        </div>
      </div>

      {/* Extra volume/toggles - Hide most on mobile */}
      <div className="hidden lg:flex items-center justify-end gap-4 w-1/3 z-10">
        <button className="text-zinc-500 hover:text-white transition-colors">
          <Mic2 className="w-4 h-4" />
        </button>
        <button className="text-zinc-500 hover:text-white transition-colors">
          <List className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 group w-32 ml-2">
          <button onClick={toggleMute} className="text-zinc-400 hover:text-white">
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input 
            type="range" 
            min="0" max="1" step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-brand-primary hover:h-1.5 transition-all"
          />
        </div>
        <button 
          onClick={() => setFullscreen(true)}
          className="text-zinc-500 hover:text-white transition-colors ml-2"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile Progress Bar - Top of player */}
      <div className="lg:hidden absolute top-0 left-0 right-0 h-0.5 bg-zinc-800">
        <motion.div 
          className="h-full bg-brand-primary"
          animate={{ width: `${progress * 100}%` }}
        />
      </div>
    </motion.div>
  );
}

// Minimal Heart component since I didn't import it
const Heart = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);
