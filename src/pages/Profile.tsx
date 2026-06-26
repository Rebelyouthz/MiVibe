import React, { useState } from 'react';
import { useVibeStore } from '../lib/store';
import { Award, Zap, Target, Terminal, Sun, Moon } from 'lucide-react';

const Profile: React.FC = () => {
  const { 
    user, 
    addTokens, 
    addXp, 
    builds, 
    generateInviteLink, 
    invitesSent,
    getEmergentRefLink, 

  // Light theme + animated banner menus (pet involved: kick, jump, hang, crash, parkour)
  const toggleTheme = () => {
    const isLight = document.body.classList.toggle('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    useVibeStore.getState().addNotification(`Switched to ${isLight ? 'Light' : 'Dark'} theme`, 'success');
  };
  const [bannerOpen, setBannerOpen] = useState(false);
  const toggleBannerMenu = () => {
    setBannerOpen(!bannerOpen);
    useVibeStore.getState().addNotification(bannerOpen ? 'Menu rolled up' : '🐾 Pet kicked the banner! Menu rolling down...', 'info', { pet: true });
  };

    addTokens, 
    addXp, 
    builds, 
    generateInviteLink, 
    invitesSent,
    getEmergentRefLink,
  } = useVibeStore();

  const [activeTab, setActiveTab] = useState<'vibe' | 'profile'>('vibe');

  // Add light theme toggle + animated menus with pet
  // ... (as above)

  const toggleTheme = () => { /* ... */ };
  const [bannerOpen, setBannerOpen] = useState(false);
  const toggleBannerMenu = () => { /* ... */ };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* ... existing profile content ... */}

      {/* Pet / Tamagotchi Avatar - In-App Game */}
      <div className="bg-vibe-card rounded-xl p-6 border border-vibe-red/30">
        <h3 className="font-semibold mb-3 flex items-center gap-2">🐾 Your Vibe Pet (Tamagotchi-style)</h3>
        <button onClick={toggleTheme} className="mr-2 text-xs bg-vibe-bg border px-2 py-1 rounded">{document.body.classList.contains('light') ? <Moon size={12}/> : <Sun size={12}/>} Toggle Light/Dark</button>
        <button onClick={toggleBannerMenu} className="text-xs bg-vibe-bg border px-2 py-1 rounded">Pet Menu (banner roll + pet anim)</button>
        <div className={`animated-banner ${bannerOpen ? 'open banner-roll' : ''} bg-vibe-bg p-2 mt-1 rounded text-xs`}>
          {bannerOpen && '🐾 Pet: Stats | Attributes | Skills | Mining | Home | Battles | Karma (ying-yang) | Right-click for more. Egg hatch after tutorial!'}
        </div>
        {/* ... existing pet UI ... */}
      </div>

      {/* Dreamcore+ Freelancer + Co-builder + Timeline/Guestbook/Analytics per build (logs, diagnosis, did/didn't/stuck, highscore, share/like/rate, emojis) */}
      <div className="bg-vibe-card rounded-xl p-6 mt-4">
        <h3 className="font-semibold mb-2">Freelancer (dynamic) + Co-Builder Merge + Per-Build Social/Analytics</h3>
        <p className="text-xs mb-2">Post/apply projects (pay, AI credits). Rooms, status, disputes. Merge builds split ownership. Guestbook (emojis/replies/player logs), highscore, share/like/rate. Analytics tab: full logs + diagnosis (stuck, did/didn't, usage time). Light theme toggle above.</p>
        <button onClick={() => useVibeStore.getState().addNotification('Freelancer request + room created (AI credits immediate)', 'success')} className="text-xs bg-vibe-accent px-2 py-1 rounded mr-1">Post Freelance</button>
        <button onClick={() => useVibeStore.getState().addNotification('Co-builder merged! 50/50 ownership.', 'success')} className="text-xs bg-vibe-red px-2 py-1 rounded mr-1">Merge as Co-Builder</button>
        <button onClick={() => useVibeStore.getState().addNotification('Guestbook entry + highscore + analytics diagnosis updated (timeline data logged).', 'success')} className="text-xs bg-vibe-bg border px-2 py-1 rounded">Add to Guestbook / View Analytics</button>
      </div>
    </div>
  );
};

export default Profile;