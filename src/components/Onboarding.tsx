import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Music2, Headphones, Zap, Mic, Radio } from 'lucide-react';
import { useMusicStore } from '../store/useMusicStore';
import { cn } from '../lib/utils';

const GENRES = [
  { id: 'synthwave', name: 'Synthwave', icon: Zap, color: 'from-pink-500 to-purple-600' },
  { id: 'lofi', name: 'Lo-Fi Chill', icon: Headphones, color: 'from-blue-400 to-indigo-500' },
  { id: 'techno', name: 'Cyber Techno', icon: Radio, color: 'from-emerald-400 to-cyan-500' },
  { id: 'hiphop', name: 'Alt Hip-Hop', icon: Mic, color: 'from-orange-400 to-red-500' },
  { id: 'indie', name: 'Dream Indie', icon: Music2, color: 'from-amber-300 to-orange-400' },
  { id: 'ambient', name: 'Deep Ambient', icon: Sparkles, color: 'from-fuchsia-500 to-pink-600' },
];

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [selected, setSelected] = React.useState<string[]>([]);
  const [step, setStep] = React.useState(0);

  const toggleGenre = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center p-4 md:p-6 overflow-hidden">
      {/* Background Glows */}
      <div className="aura-bg">
        <div className="aura-sphere w-[80vw] h-[80vw] bg-brand-primary/10 top-[-20%] left-[-20%]"></div>
        <div className="aura-sphere w-[60vw] h-[60vw] bg-brand-secondary/10 bottom-[-10%] right-[-10%]"></div>
      </div>
      
      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div 
            key="step0"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="max-w-2xl w-full text-center relative z-10 px-4"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-brand-primary to-brand-accent rounded-2xl md:rounded-3xl mx-auto mb-6 md:mb-8 flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.3)]">
              <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 italic uppercase leading-none">Welcome to the Universe.</h1>
            <p className="text-zinc-400 text-sm md:text-lg mb-8 md:text-10 leading-relaxed max-w-lg mx-auto">
              SonicStream is more than an app. It's your personal audio ecosystem. Let's calibrate your frequency.
            </p>
            <button 
              onClick={() => setStep(1)}
              className="bg-white text-black px-10 md:px-12 py-3 md:py-4 rounded-full font-black text-[10px] md:text-sm tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl"
            >
              INITIALIZE TASTE
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl w-full relative z-10 h-full flex flex-col justify-center py-8"
          >
            <header className="text-center mb-8 md:mb-16 shrink-0">
              <h2 className="text-3xl md:text-4xl font-black italic tracking-tight mb-2 md:mb-4">What's your vibe?</h2>
              <p className="text-zinc-500 text-xs md:text-sm">Pick at least 3 frequencies to seed your AI streams.</p>
            </header>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-16 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
              {GENRES.map((genre) => {
                const isSelected = selected.includes(genre.id);
                return (
                  <motion.button
                    key={genre.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleGenre(genre.id)}
                    className={cn(
                      "relative h-32 md:h-48 rounded-2xl md:rounded-3xl p-4 md:p-8 flex flex-col justify-end text-left transition-all duration-500 group overflow-hidden border",
                      isSelected 
                        ? "border-white bg-white text-black" 
                        : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                    )}
                  >
                    <div className={cn(
                      "absolute top-[-20px] right-[-20px] w-24 md:w-32 h-24 md:h-32 blur-[40px] opacity-20 transition-opacity group-hover:opacity-40",
                      genre.color.split(' ')[0]
                    )}></div>
                    
                    <genre.icon className={cn("w-6 h-6 md:w-8 md:h-8 mb-2 md:mb-4", isSelected ? "text-black" : "text-brand-primary")} />
                    <span className="text-base md:text-2xl font-black italic uppercase leading-none tracking-tighter">{genre.name}</span>
                    {isSelected && (
                      <motion.div 
                        layoutId="active-dot"
                        className="absolute top-4 right-4 md:top-6 md:right-6 w-2 h-2 md:w-3 md:h-3 bg-brand-primary rounded-full"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            <div className="flex flex-col items-center gap-4 shrink-0">
              <button 
                disabled={selected.length < 3}
                onClick={onComplete}
                className={cn(
                  "w-full sm:w-auto px-12 md:px-16 py-3 md:py-4 rounded-full font-black text-[10px] md:text-sm tracking-[0.2em] transition-all flex items-center justify-center gap-3",
                  selected.length >= 3 
                    ? "bg-brand-primary text-white shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:scale-105 active:scale-95" 
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                )}
              >
                ACCESS SYSTEM
                {selected.length >= 3 && <Sparkles className="w-4 h-4" />}
              </button>
              
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
                Selected: <span className={cn(selected.length >= 3 ? "text-brand-primary" : "text-zinc-500")}>{selected.length}</span> / 3 Required
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
