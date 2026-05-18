import React from 'react';
import { motion } from 'motion/react';
import { Play, Heart, Clock, Music, Sparkles } from 'lucide-react';
import { SearchHeader } from './SearchHeader';
import { useMusicStore } from '../store/useMusicStore';
import { Track } from '../types';

const TRENDING_MOCK: Track[] = [
  { id: '1', title: 'Neon Nights', artist: 'Flux Echoes', coverArtUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop', url: '', source: 'custom' },
  { id: '2', title: 'Cyber Drift', artist: 'Vector Ray', coverArtUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop', url: '', source: 'custom' },
  { id: '3', title: 'Eternal Pulse', artist: 'Holo Synth', coverArtUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&h=400&fit=crop', url: '', source: 'custom' },
  { id: '4', title: 'Digital Rain', artist: 'Liquid Mind', coverArtUrl: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?w=400&h=400&fit=crop', url: '', source: 'custom' },
];

const TrackCard = ({ track, index }: { track: Track; index: number }) => {
  const { playTrack } = useMusicStore();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card group cursor-pointer overflow-hidden p-4 hover:bg-white/10 transition-colors"
      onClick={() => playTrack(track)}
    >
      <div className="relative aspect-square mb-4 overflow-hidden rounded-xl">
        <img 
          src={track.coverArtUrl} 
          alt={track.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center shadow-xl scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 text-white fill-current" />
          </div>
        </div>
      </div>
      <h4 className="font-bold text-sm truncate group-hover:text-brand-primary transition-colors">{track.title}</h4>
      <p className="text-xs text-zinc-500 truncate">{track.artist}</p>
    </motion.div>
  );
};

export function MainView() {
  const { currentTrack } = useMusicStore();

  return (
    <main className="flex-1 overflow-y-auto relative pb-32 scroll-smooth">
      {/* Background Cinematic Gradients - Handled by App.tsx now, but keep extra depth here */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-brand-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <SearchHeader />

        <div className="px-4 md:px-10 py-6 md:py-12">
          {/* Hero Banner / Highlight - Responsive height and text */}
          <section className="mb-10 md:mb-12">
            <div className="relative h-48 md:h-64 rounded-2xl md:rounded-3xl overflow-hidden glass-card group">
              <img 
                src="https://images.unsplash.com/photo-1574169208507-84376144848b?w=1600&h=400&fit=crop" 
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[20s]"
                alt="Banner"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-6 md:p-10 flex flex-col justify-end">
                <span className="text-[8px] md:text-[10px] font-bold tracking-[0.4em] text-brand-accent mb-1 md:mb-2">CURATED FOR YOU</span>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-2 italic">SYNTHETIC DREAMS</h2>
                <p className="text-zinc-300 text-[10px] md:text-sm max-w-lg leading-relaxed line-clamp-2 md:line-clamp-none">
                  Experience a boundary-less music journey. Your history, your vibe, our intelligence.
                </p>
                <div className="mt-4 md:mt-6 flex gap-3 md:gap-4">
                  <button className="bg-white text-black px-5 md:px-8 py-2 md:py-3 rounded-full font-bold text-[10px] md:text-sm hover:scale-105 active:scale-95 transition-all">
                    START LISTENING
                  </button>
                  <button className="hidden sm:block bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-white/20 transition-all">
                    SAVE TO LIBRARY
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Trending Grid - Responsive columns */}
          <section className="mb-10 md:mb-12">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-1 md:w-1.5 h-4 md:h-6 bg-brand-primary rounded-full"></div>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight">Trending Globally</h3>
              </div>
              <button className="text-zinc-500 hover:text-white text-[10px] md:text-xs font-bold tracking-widest transition-colors uppercase">See All</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {TRENDING_MOCK.map((track, i) => (
                <TrackCard key={track.id} track={track} index={i} />
              ))}
              {/* Duplicate showing responsiveness */}
              <div className="hidden sm:block">
                <TrackCard key="extra-1" track={TRENDING_MOCK[0]} index={5} />
              </div>
              <div className="hidden lg:block">
                <TrackCard key="extra-2" track={TRENDING_MOCK[1]} index={6} />
              </div>
            </div>
          </section>

          {/* Mood Grids - Responsive columns */}
          <section className="mb-10 md:mb-12">
             <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
                <div className="w-1 md:w-1.5 h-4 md:h-6 bg-brand-secondary rounded-full"></div>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight">Pick Your Vibe</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                 <div className="h-40 glass-card p-6 bg-gradient-to-br from-indigo-500/20 to-transparent border-indigo-500/30 group hover:from-indigo-500/30 transition-all cursor-pointer overflow-hidden relative">
                    <h4 className="text-2xl font-black italic">CHILL MODE</h4>
                    <p className="text-xs text-zinc-400 mt-2">Deep ambient and lo-fi textures.</p>
                    <Music className="absolute bottom-[-10px] right-[-10px] w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity rotate-12" />
                 </div>
                 <div className="h-40 glass-card p-6 bg-gradient-to-br from-brand-secondary/20 to-transparent border-brand-secondary/30 group hover:from-brand-secondary/30 transition-all cursor-pointer overflow-hidden relative">
                    <h4 className="text-2xl font-black italic">FOCUS FLUX</h4>
                    <p className="text-xs text-zinc-400 mt-2">Instrumental flow projects.</p>
                    <Clock className="absolute bottom-[-10px] right-[-10px] w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity -rotate-12" />
                 </div>
                 <div className="h-40 glass-card p-6 bg-gradient-to-br from-brand-accent/20 to-transparent border-brand-accent/30 group hover:from-brand-accent/30 transition-all cursor-pointer overflow-hidden relative">
                    <h4 className="text-2xl font-black italic">CYBER OVERDRIVE</h4>
                    <p className="text-xs text-zinc-400 mt-2">High energy synthwave & techno.</p>
                    <Sparkles className="absolute bottom-[-10px] right-[-10px] w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity rotate-45" />
                 </div>
              </div>
          </section>
        </div>
      </div>
    </main>
  );
}
