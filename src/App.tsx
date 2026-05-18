/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sidebar } from './components/Sidebar';
import { MainView } from './components/MainView';
import { PlayerControl } from './components/PlayerControl';
import { CorePlayer } from './components/CorePlayer';
import { Onboarding } from './components/Onboarding';
import { MobileNav } from './components/MobileNav';
import { motion, AnimatePresence } from 'motion/react';
import { useMusicStore } from './store/useMusicStore';
import { auth, db, googleProvider } from './lib/firebase';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2, Music2, Sparkles } from 'lucide-react';
import { UserProfile } from './types';

export default function App() {
  const { 
    currentTrack, isFullscreen, setFullscreen, 
    hasSeenOnboarding, setHasSeenOnboarding,
    user, setUser, isLoading, syncUserToFirestore
  } = useMusicStore();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        // Fetch additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
        const userData = userDoc.data();
        
        const profile: UserProfile = {
          id: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || 'Anonymous User',
          photoURL: fbUser.photoURL || undefined,
          favoriteGenres: userData?.favoriteGenres || [],
          musicTasteSelected: userData?.musicTasteSelected || false
        };
        
        setUser(profile);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [setUser]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleOnboardingComplete = async () => {
    if (user) {
      const updatedUser = { ...user, musicTasteSelected: true };
      setUser(updatedUser);
      await syncUserToFirestore(updatedUser);
    }
    setHasSeenOnboarding(true);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-black flex flex-col items-center justify-center gap-6">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-t-2 border-brand-primary rounded-full shadow-[0_0_20px_rgba(139,92,246,0.3)]"
        />
        <h2 className="text-xl font-black italic tracking-tighter text-gradient animate-pulse">SONICSTREAM</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
        <div className="aura-bg">
          <div className="aura-sphere w-[50vw] h-[50vw] bg-brand-primary top-[-10%] left-[-10%]"></div>
          <div className="aura-sphere w-[40vw] h-[40vw] bg-brand-secondary bottom-[20%] right-[-5%]"></div>
          <div className="aura-sphere w-[30vw] h-[30vw] bg-brand-accent top-[40%] right-[10%] opacity-20"></div>
        </div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass-card p-12 text-center relative z-10"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl">
             <Music2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter mb-4 text-gradient">SONICSTREAM</h1>
          <p className="text-zinc-400 mb-10 text-sm leading-relaxed">
            Your personal audio universe awaits. Sign in to synchronize your tracks, playlists, and taste across all dimensions.
          </p>
          <button 
            onClick={handleLogin}
            className="w-full bg-white text-black py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
            CONTINUE WITH GOOGLE
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-white font-sans selection:bg-brand-primary/30 overflow-hidden text-sm md:text-base">
      <AnimatePresence>
        {!hasSeenOnboarding && (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}
      </AnimatePresence>

      <div className="aura-bg">
        <div className="aura-sphere w-[60vw] h-[60vw] bg-brand-primary/20 top-[-20%] left-[-10%]"></div>
        <div className="aura-sphere w-[50vw] h-[50vw] bg-brand-secondary/20 bottom-[-10%] right-[-10%]"></div>
        <div className="aura-sphere w-[40vw] h-[40vw] bg-brand-accent/10 top-[30%] left-[40%] animate-pulse-slow"></div>
      </div>
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] contrast-150 brightness-150 pointer-events-none z-0"></div>

      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 relative">
        <MainView />
        <PlayerControl />
        <MobileNav />
      </div>

      <CorePlayer />

      {/* Fullscreen Immersive Experience */}
      <AnimatePresence>
        {isFullscreen && currentTrack && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black"
          >
            {/* Immersive BG with Album Gradient */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.img 
                key={currentTrack.id}
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: 0.3, scale: 1 }}
                src={currentTrack.coverArtUrl}
                className="w-full h-full object-cover blur-[100px] saturate-[1.5]"
              />
            </div>
            
            <div className="relative h-full flex flex-col p-12">
               <button 
                onClick={() => setFullscreen(false)}
                className="absolute top-10 right-10 p-4 hover:bg-white/10 rounded-full transition-colors z-[110]"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-minimize-2"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
               </button>

               <div className="flex-1 flex flex-col items-center justify-center text-center gap-10">
                  <motion.div 
                    layoutId="album-art"
                    className="w-80 h-80 md:w-[450px] md:h-[450px] rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden border border-white/10"
                  >
                    <img src={currentTrack.coverArtUrl} className="w-full h-full object-cover" alt="" />
                  </motion.div>
                  
                  <div className="space-y-4">
                    <motion.h1 className="text-5xl md:text-7xl font-black tracking-tighter italic">{currentTrack.title}</motion.h1>
                    <motion.p className="text-xl md:text-2xl text-zinc-400 font-medium">{currentTrack.artist}</motion.p>
                  </div>
               </div>

               <div className="max-w-4xl mx-auto w-full mb-10">
                  {/* Reuse parts of PlayerControl or implement custom visualizer here */}
                  <p className="text-center text-zinc-500 font-mono text-sm tracking-[0.5em] uppercase animate-pulse">Syncing visuals to audio beat...</p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

