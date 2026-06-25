import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Home, Search, Plus, Briefcase, User, Calendar, Users, Award, Zap, LogOut } from 'lucide-react';
import Feed from './pages/Feed';
import Discover from './pages/Discover';
import Create from './pages/Create';
import VibeLancer from './pages/VibeLancer';
import Profile from './pages/Profile';
import Events from './pages/Events';
import Rooms from './pages/Rooms';
import Onboarding from './pages/Onboarding';
import Intro from './pages/Intro';
import Market from './pages/Market';
import Connections from './pages/Connections';
import { useVibeStore } from './lib/store';
import NotificationSystem from './components/NotificationSystem';

const AppContent: React.FC = () => {
  const { user, logout } = useVibeStore();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!user) {
      setShowOnboarding(true);
    }
  }, [user]);

  if (showOnboarding || !user) {
    return <Onboarding onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <div className="min-h-screen bg-vibe-bg text-white">
      <nav className="bg-vibe-card border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-vibe-accent">
                <img src="/favicon.svg" className="w-8 h-8" alt="MiVibe icon" />
                MiVibe
              </Link>
              <div className="hidden md:flex items-center gap-6 text-sm">
                <Link to="/" className="hover:text-vibe-accent flex items-center gap-1"><Home className="w-4 h-4" /> Feed</Link>
                <Link to="/discover" className="hover:text-vibe-accent flex items-center gap-1"><Search className="w-4 h-4" /> Discover</Link>
                <Link to="/intro" className="hover:text-vibe-red flex items-center gap-1"><span className="text-vibe-red">▶</span> Intro</Link>
                <Link to="/create" className="hover:text-vibe-accent flex items-center gap-1"><Plus className="w-4 h-4" /> Vibe Studio</Link>
                <Link to="/market" className="hover:text-vibe-gold flex items-center gap-1">🛍 Market</Link>
                <Link to="/connections" className="hover:text-vibe-accent flex items-center gap-1">🔌 APIs</Link>
                <Link to="/vibelancer" className="hover:text-vibe-accent flex items-center gap-1"><Briefcase className="w-4 h-4" /> VibeLancer</Link>
                <Link to="/events" className="hover:text-vibe-accent flex items-center gap-1"><Calendar className="w-4 h-4" /> Events</Link>
                <Link to="/rooms" className="hover:text-vibe-accent flex items-center gap-1"><Users className="w-4 h-4" /> Rooms</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm bg-vibe-card px-3 py-1 rounded-full border border-gray-700">
                <Zap className="w-4 h-4 text-vibe-accent" />
                <span>{user.tokens} VibeTokens</span>
                <span className="text-xs text-gray-500">Lvl {user.level}</span>
              </div>
              <div className="relative text-xs cursor-pointer" onClick={() => {
                // Mark recent as read on open (simple)
                const store = useVibeStore.getState();
                store.notifications.forEach((n: any) => n.read = true);
              }}>
                🔔
                {(useVibeStore.getState().notifications || []).filter((n:any)=>!n.read).length > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-vibe-red rounded-full text-[8px]"></span>}
              </div>
              <Link to="/profile" className="flex items-center gap-2 hover:text-vibe-accent text-sm">
                <div className="relative w-8 h-8 bg-vibe-accent rounded-full flex items-center justify-center text-black font-bold text-sm">
                  {user.username[0]?.toUpperCase()}
                  {user.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-vibe-bg rounded-full" title="Online"></span>}
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium">{user.username}</div>
                  <div className="text-xs text-gray-400">{user.role}</div>
                </div>
              </Link>
              <button onClick={logout} className="p-2 hover:bg-gray-800 rounded">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/create" element={<Create />} />
          <Route path="/market" element={<Market />} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/vibelancer" element={<VibeLancer />} />
          <Route path="/events" element={<Events />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      <footer className="bg-vibe-card border-t border-gray-800 py-6 text-center text-xs text-gray-500 mt-12">
        MiVibe • The #1 Social Platform for AI Vibe Coding • Like Lunarstorm × Steam for the AI era
        <br />
        © 2026 — 100% my original code. All rights reserved. Not for sale or unauthorized use.
        <br />
        Built with ❤️. Powered by Emergent referral: https://app.emergent.sh/register?ref=cryp530869
      </footer>

      {/* Floating Pet Mascot - reacts to your actions, shows tips, mines in background */}
      {user.pet && (
        <div 
          onClick={() => {
            const store = useVibeStore.getState();
            store.feedPet();
            store.addNotification(`🐾 ${user.pet?.mood || 'Pet'}: Thanks! Keep building and I'll mine more tokens for you.`, 'success', { pet: true });
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            const store = useVibeStore.getState();
            store.addNotification('Pet Settings: right-click actions + customize coming in full panel. Feed or set to mine!', 'info', { pet: true });
            // Could open /profile here or pet panel
            window.location.href = '/MiVibe/profile';
          }}
          className="fixed bottom-4 right-4 bg-vibe-card border border-vibe-red p-2 rounded-full cursor-pointer text-3xl shadow-lg hover:scale-110 transition z-50"
          title="Your Vibe Pet — click: feed/mine • right-click: settings"
        >
          {user.pet.customEmoji || '🐣'}
          {user.pet.stage === 'egg' && '🥚'}
          <div className="absolute -top-1 -right-1 text-[8px] bg-green-400 text-black px-1 rounded">LVL {user.pet.level}</div>
        </div>
      )}

      {/* New rich notification system with sounds and dynamic bubbles */}
      <NotificationSystem />

      {/* Start Menu Widget (pet + quick access) - small icon bar, pet is the star */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[60] bg-vibe-card/95 border border-gray-700 rounded-t-2xl px-4 py-1 flex gap-3 shadow-2xl">
        <button onClick={() => window.location.href = '/MiVibe/'} className="text-xs px-2 py-1 hover:text-vibe-accent">🏠 Feed</button>
        <button onClick={() => window.location.href = '/MiVibe/create'} className="text-xs px-2 py-1 hover:text-vibe-accent">⚡ Studio</button>
        <button onClick={() => window.location.href = '/MiVibe/market'} className="text-xs px-2 py-1 hover:text-vibe-gold">🛍 Market</button>
        <button onClick={() => window.location.href = '/MiVibe/profile'} className="text-xs px-2 py-1 hover:text-vibe-accent flex items-center gap-1">
          🐾 Pet <span className="text-[9px] opacity-60">(right-click for settings)</span>
        </button>
        <button onClick={() => window.location.href = '/MiVibe/connections'} className="text-xs px-2 py-1 hover:text-vibe-accent">🔌 APIs</button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router basename="/MiVibe">
      <AppContent />
    </Router>
  );
};

export default App;