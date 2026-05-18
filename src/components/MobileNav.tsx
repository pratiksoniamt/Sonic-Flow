import React from 'react';
import { Home, Compass, Library, Search, User } from 'lucide-react';
import { cn } from '../lib/utils';

export function MobileNav() {
  const [activeTab, setActiveTab] = React.useState('home');

  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'explore', icon: Compass, label: 'Explore' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'library', icon: Library, label: 'Library' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-3xl border-t border-white/5 flex items-center justify-around px-4 z-[60]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "flex flex-col items-center gap-1 transition-colors",
            activeTab === tab.id ? "text-brand-primary" : "text-zinc-500"
          )}
        >
          <tab.icon className={cn("w-6 h-6", activeTab === tab.id && "scale-110")} />
          <span className="text-[10px] font-medium uppercase tracking-tighter">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
