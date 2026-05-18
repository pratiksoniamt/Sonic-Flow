import React from 'react';
import { Search, Link2, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useMusicStore } from '../store/useMusicStore';
import { Track } from '../types';
import confetti from 'canvas-confetti';

export function SearchHeader() {
  const [url, setUrl] = React.useState('');
  const [isExtracting, setIsExtracting] = React.useState(false);
  const { playTrack, addToQueue } = useMusicStore();

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsExtracting(true);
    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const metadata = await response.json();
      
      const newTrack: Track = {
        id: Math.random().toString(36).substr(2, 9),
        title: metadata.title || "Unknown Title",
        artist: metadata.artist || "Unknown Artist",
        album: metadata.album,
        coverArtUrl: metadata.coverArtUrl,
        url: url, // Original URL for ReactPlayer
        duration: metadata.duration,
        source: url.includes('spotify') ? 'spotify' : url.includes('youtube') ? 'youtube' : 'custom',
      };

      playTrack(newTrack);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#ec4899', '#06b6d4']
      });
      setUrl('');
    } catch (error) {
      console.error("Extraction failed:", error);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pt-6 md:pt-8 px-4 md:px-6">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        
        <form 
          onSubmit={handleExtract}
          className="relative flex items-center bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden p-1 shadow-2xl"
        >
          <div className="hidden sm:flex items-center px-4 text-zinc-500">
            <Link2 className="w-5 h-5" />
          </div>
          
          <input 
            type="text" 
            placeholder="Paste URL (Spotify, YT, etc.)"
            className="flex-1 bg-transparent border-none outline-none text-xs md:text-sm py-3 md:py-4 px-3 md:px-2 placeholder:text-zinc-600 focus:ring-0"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <div className="flex items-center gap-2 pr-1 md:pr-2">
            <button 
              type="submit"
              disabled={isExtracting || !url}
              className="bg-white text-black px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-bold text-[10px] md:text-xs flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-xl"
            >
              {isExtracting ? (
                <>
                  <Loader2 className="w-3 md:w-4 h-3 md:h-4 animate-spin" />
                  <span className="hidden sm:inline">SYNCING...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3 md:w-4 h-3 md:h-4" />
                  <span>PLAY</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
      
      <div className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-6 gap-y-2 mt-4 opacity-40">
        {['Spotify', 'YouTube', 'Apple', 'SoundCloud'].map((platform) => (
          <span key={platform} className="text-[8px] md:text-[10px] font-semibold uppercase tracking-[0.2em] whitespace-nowrap">{platform}</span>
        ))}
      </div>
    </div>
  );
}
