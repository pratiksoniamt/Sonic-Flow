import React from 'react';
import { Home, Compass, Library, Heart, Search, PlusCircle, ListMusic, Music2, LogOut, User } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useMusicStore } from '../store/useMusicStore';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon: Icon, label, isActive, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group",
      isActive 
        ? "bg-brand-primary/20 text-brand-primary border border-brand-primary/30" 
        : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
    )}
  >
    <Icon className={cn("w-5 h-5", isActive ? "text-brand-primary" : "group-hover:scale-110 transition-transform")} />
    <span className="font-medium text-sm tracking-wide">{label}</span>
  </button>
);

export function Sidebar() {
  const [activeTab, setActiveTab] = React.useState('home');
  const { user } = useMusicStore();

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <aside className="hidden lg:flex w-64 h-full bg-black/50 backdrop-blur-3xl border-r border-white/5 flex-col p-6 overflow-y-auto shrink-0">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center neon-glow">
          <Music2 className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tighter text-gradient">SONICSTREAM</h1>
      </div>

      <nav className="space-y-2 mb-10">
        <NavItem 
          icon={Home} 
          label="Home" 
          isActive={activeTab === 'home'} 
          onClick={() => setActiveTab('home')}
        />
        <NavItem 
          icon={Compass} 
          label="Explore" 
          isActive={activeTab === 'explore'} 
          onClick={() => setActiveTab('explore')}
        />
        <NavItem 
          icon={Library} 
          label="Library" 
          isActive={activeTab === 'library'} 
          onClick={() => setActiveTab('library')}
        />
        <NavItem 
          icon={Search} 
          label="Smart Search" 
          isActive={activeTab === 'search'} 
          onClick={() => setActiveTab('search')}
        />
      </nav>

      <div className="space-y-6">
        <div>
          <h2 className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Your Universe</h2>
          <div className="space-y-1">
            <NavItem icon={Heart} label="Liked Songs" />
            <NavItem icon={ListMusic} label="Local Tracks" />
            <NavItem icon={PlusCircle} label="Create Playlist" />
          </div>
        </div>

        <div>
          <h2 className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Pinned Playlists</h2>
          <div className="space-y-2 px-2">
            {['Cyberpunk 2077 Mix', 'Lo-Fi Chill Beats', 'Late Night Drive', 'Flux Energy'].map((p) => (
              <button key={p} className="w-full text-left px-4 py-2 text-sm text-zinc-400 hover:text-brand-primary transition-colors truncate">
                # {p}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-auto space-y-4 pt-6">
        {user && (
          <div className="flex items-center gap-3 px-2 mb-2">
            <img src={user.photoURL} className="w-8 h-8 rounded-full border border-white/10" alt={user.displayName} />
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate">{user.displayName}</p>
              <button 
                onClick={handleSignOut}
                className="text-[10px] text-zinc-500 hover:text-white flex items-center gap-1 transition-colors"
              >
                <LogOut className="w-3 h-3" />
                Sign Out
              </button>
            </div>
          </div>
        )}

        <div className="glass-card p-4 bg-brand-primary/5 border-brand-primary/20">
          <p className="text-xs font-medium text-brand-primary mb-1">PRO PLAN</p>
          <button className="w-full py-2 bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-bold rounded-lg transition-all">
            UPGRADE
          </button>
        </div>

        <div className="text-center pb-2">
          <p className="text-[10px] text-zinc-500 font-medium tracking-wider">
            MADE WITH ❤️ BY <span className="text-white">PRATIK SONI</span>
          </p>
        </div>
      </div>
    </aside>
  );
}
