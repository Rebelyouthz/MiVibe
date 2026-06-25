import React, { useState } from 'react';
import { useVibeStore } from '../lib/store';
import { Zap, Upload, Github, ExternalLink, Music, Image as ImageIcon } from 'lucide-react';

const buildTemplates = [
  { name: 'Cyberpunk Explorer', prompt: 'A 2D exploration game in a neon cyberpunk city with procedural levels and AI companions.' },
  { name: 'AI Art Generator', prompt: 'Web app that generates unique art from text prompts using simple canvas and algorithms.' },
  { name: 'Productivity Quest', prompt: 'Gamified todo app with quests, XP, and social sharing of achievements.' },
];

const eventTemplates = [
  'Build of the Day',
  'Build of the Month',
  'Build of the Year',
  'Community Challenge',
];

const Create: React.FC = () => {
  const { addBuild, addXp, spendTokens, user, completeQuest, updateProfile, generateProfilePic, generateCoverImage, generateIcon, generateAnimatedFrame, generateShortVibeVideo, generateMusic, generateSoundEffect } = useVibeStore();

  const [activeTab, setActiveTab] = useState<'vibe' | 'profile'>('vibe');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState('app');
  const [githubUrl, setGithubUrl] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Grok 2 (xAI)');
  const [marketPrice, setMarketPrice] = useState(0);

  const [profileAssets, setProfileAssets] = useState<{type: string, data: string, name: string}[]>([]);

  const optimizePrompt = () => {
    if (!prompt) return;
    const optimized = `${prompt} Make it beautiful, accessible, with smooth animations, dark cyberpunk theme, and social sharing features. Add gamification elements like XP and badges.`;
    setPrompt(optimized);
    addXp(10);
    completeQuest('q4');
  };

  const handlePublish = () => {
    if (!title || !description || !prompt) {
      useVibeStore.getState().addNotification('Please fill in title, description, and prompt!', 'warning', { field: 'title' });
      return;
    }

    const cost = selectedEvent ? 1 : 0;
    if (cost > 0 && !spendTokens(cost)) {
      useVibeStore.getState().addNotification('Not enough VibeTokens to publish to this event!', 'warning');
      return;
    }

    setIsPublishing(true);

    const store = useVibeStore.getState();
    const cover = store.generateCoverImage(title, prompt);
    const logo = store.generateIcon(title);
    const icon = logo;

    const newBuild = {
      id: Date.now().toString(),
      title,
      description,
      prompt,
      deployedUrl: `https://${title.toLowerCase().replace(/\s/g, '')}.mivibe.app`,
      githubUrl: githubUrl || `https://github.com/you/${title.toLowerCase().replace(/\s/g, '')}`,
      thumbnail: cover,
      category,
      creator: user?.username || 'You',
      votesUp: 0,
      votesDown: 0,
      tokenDonations: 0,
      createdAt: new Date().toISOString().split('T')[0],
      event: selectedEvent || undefined,
      model: selectedModel,
      coverImage: cover,
      logo,
      icon,
      music: (window as any).__currentMusic ? (window as any).__currentMusic.name : undefined,
      price: marketPrice,
      isFree: marketPrice === 0,
    };

    addBuild(newBuild);
    addXp(25);
    completeQuest('q2');
    if (useVibeStore.getState().premiumUnlocked) {
      completeQuest('q8');
    }

    if (selectedEvent) {
      useVibeStore.getState().addNotification(`Published to ${selectedEvent} for 1 VibeToken! +25 XP`, 'success');
    } else {
      useVibeStore.getState().addNotification('Build published! +25 XP. Check the Feed and Market.', 'success');
    }

    const s = useVibeStore.getState();
    if (selectedModel.toLowerCase().includes('grok')) {
      s.addNotification(`🐾 Your pet is hyped — "Grok made that one sharp! I mined extra for you."`, 'success', { pet: true });
    } else if (selectedModel.includes('Opus 4.8')) {
      s.addNotification(`🐾 Pet is impressed: "That Opus 4.8 1M context build was deep. Good work."`, 'success', { pet: true });
    }

    setTimeout(() => {
      if (confirm('Open the Steam-like Market to see your listing?')) {
        window.location.href = '/market';
      }
    }, 1500);

    setTitle('');
    setDescription('');
    setPrompt('');
    setGithubUrl('');
    setSelectedTemplate('');
    setSelectedEvent('');
    setIsPublishing(false);
  };

  const handleImportRepo = () => {
    if (!githubUrl) {
      useVibeStore.getState().addNotification('Enter a GitHub repo URL to import!');
      return;
    }
    const importedTitle = githubUrl.split('/').pop() || 'Imported Build';
    setTitle(importedTitle);
    setDescription(`Imported from ${githubUrl}. AI-enhanced vibe coding project.`);
    setPrompt(`Enhance this repo into a full vibe-coded app: ${githubUrl}`);
    addXp(15);
    useVibeStore.getState().addNotification('Repo imported! +15 XP. Now polish the prompt and publish.');
  };

  const applyTemplate = (template: any) => {
    setSelectedTemplate(template.name);
    setPrompt(template.prompt);
    setTitle(template.name);
    setDescription('A beautiful ' + template.name.toLowerCase() + ' built with AI prompts.');
    addXp(5);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Zap className="text-vibe-accent" /> Vibe Studio <span className="text-vibe-red text-xl">— Prompt to Code + Image + Music</span>
        </h1>
        <p className="text-gray-400">Use AI prompts to build and share. Turn ideas into apps, games, and experiences.</p>
      </div>

      <div className="flex gap-2 mb-4 border-b border-gray-700 pb-2">
        <button 
          onClick={() => setActiveTab('vibe')} 
          className={`px-5 py-2 rounded-t ${activeTab === 'vibe' ? 'bg-vibe-red text-black font-bold' : 'bg-vibe-bg hover:bg-gray-800'}`}
        >
          🎨 VIBE CODE STUDIO
        </button>
        <button 
          onClick={() => setActiveTab('profile')} 
          className={`px-5 py-2 rounded-t ${activeTab === 'profile' ? 'bg-vibe-red text-black font-bold' : 'bg-vibe-bg hover:bg-gray-800'}`}
        >
          👤 PROFILE BUILDER STUDIO
        </button>
      </div>

      {activeTab === 'vibe' && (
        <>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-vibe-card rounded-xl p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Zap /> VibeCoder AI Prompt Helper</h3>
          <p className="text-sm text-gray-400 mb-4">Describe your idea. We'll optimize it for the best AI build.</p>
          
          <textarea 
            value={prompt} 
            onChange={(e) => setPrompt(e.target.value)} 
            placeholder="A relaxing meditation app with AI-generated soundscapes..." 
            className="w-full h-32 bg-vibe-bg border border-gray-700 rounded p-3 mb-3 text-sm"
          />
          
          <div className="flex gap-2 mb-4">
            <button onClick={optimizePrompt} className="flex-1 bg-vibe-accent text-black py-2 rounded font-medium text-sm hover:bg-green-400">
              Optimize Prompt
            </button>
            <button 
              onClick={() => {
                const store = useVibeStore.getState();
                const cov = store.generateCoverImage(title || 'Vibe', prompt || 'cool app');
                useVibeStore.getState().addNotification('Cover image generated! (auto applied on publish)');
              }} 
              className="px-3 bg-vibe-bg border border-gray-700 rounded text-xs"
            >Generate Cover</button>
          </div>

          <div className="mb-4">
            <p className="text-xs uppercase text-gray-500 mb-2">Choose model (Grok 2 default for fast & free powerful replies; Opus 4.8 1M for max context)</p>
            <select value={selectedModel} onChange={e => setSelectedModel(e.target.value)} className="w-full bg-vibe-bg border border-gray-700 rounded p-3">
              <option value="Claude Opus 4.8 (1M context)">Claude Opus 4.8 (1M context) — most powerful for complex vibe coding</option>
              <option value="Claude Sonnet 4.6">Claude Sonnet 4.6 (balanced, great for most vibe coding)</option>
              <option value="Grok 2 (xAI)">Grok 2 (xAI) — powerful reasoning + coding (default free)</option>
              <option value="Grok 1.5 (xAI)">Grok 1.5 (xAI)</option>
              <option value="Grok (latest via xAI)">Grok (latest via xAI)</option>
            </select>
          </div>

          <div className="mb-4">
            <p className="text-xs uppercase text-gray-500 mb-2">Publish to Event (costs 1 VibeToken)</p>
            <select value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)} className="w-full bg-vibe-bg border border-gray-700 rounded p-3">
              <option value="">Just Publish (free)</option>
              {eventTemplates.map((et, i) => <option key={i} value={et}>{et}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <p className="text-xs uppercase text-gray-500 mb-2">Market Price (0 = Free, else VibeTokens)</p>
            <input 
              type="number" 
              value={marketPrice} 
              onChange={e => setMarketPrice(parseInt(e.target.value) || 0)} 
              className="w-full bg-vibe-bg border border-gray-700 rounded p-3"
            />
            <p className="text-[10px] text-gray-500">This build will appear in the Steam-like Market.</p>
          </div>

          <button 
            onClick={handlePublish} 
            disabled={isPublishing || !title || !prompt}
            className="w-full bg-vibe-accent hover:bg-green-400 disabled:bg-gray-600 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2"
          >
            {isPublishing ? 'Building...' : 'Publish Build to MiVibe'}
            <Upload size={18} />
          </button>
          <p className="text-[10px] text-center text-gray-500 mt-2">Your build will appear in the Feed. Earn XP + tokens! Tell what model you used.</p>
        </div>

        <div className="bg-vibe-card rounded-xl p-6">
          <h3 className="font-semibold mb-3">Quick Templates & Import</h3>
          <div className="grid grid-cols-1 gap-2 mb-4">
            {buildTemplates.map((t, i) => (
              <button key={i} onClick={() => applyTemplate(t)} className="text-left p-2 bg-vibe-bg rounded text-sm hover:bg-gray-800">
                {t.name}
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs mb-1 block">Import from GitHub</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={githubUrl} 
                onChange={e => setGithubUrl(e.target.value)} 
                placeholder="GitHub repo URL (optional)" 
                className="flex-1 bg-vibe-bg border border-gray-700 rounded p-3 text-sm" 
              />
              <button onClick={handleImportRepo} className="px-3 bg-gray-800 rounded" title="Import from repo">
                <Github size={18} />
              </button>
            </div>
          </div>

          <div className="mt-3">
            <label className="text-xs flex items-center gap-1 mb-1 text-vibe-red"><Music size={14}/> Upload Music (optional)</label>
            <input 
              type="file" 
              accept="audio/*" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  (window as any).__currentMusic = { name: file.name, url };
                  useVibeStore.getState().addNotification(`Music "${file.name}" ready for build!`, 'success');
                }
              }} 
              className="text-xs w-full bg-vibe-bg border p-2 rounded"
            />
            {(window as any).__currentMusic && (
              <audio controls src={(window as any).__currentMusic.url} className="mt-1 w-full" />
            )}
          </div>
        </div>
        </div>

        <div className="mt-8 text-xs text-gray-500">
          Tip: Link a real GitHub repo. Vibe code on Emergent.sh (this is Emergent) — SAME link in Profile. Model saved.
        </div>
        </>
      )}

      {activeTab === 'profile' && (
        <div className="bg-vibe-card rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-vibe-red">👤 Profile Builder Studio</h2>
          <p className="text-sm text-gray-400 mb-4">Create frames, icons, pics, banners, animated assets & publish directly to your profile wall.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-vibe-bg p-4 rounded">
              <div className="font-semibold mb-2">Profile Picture</div>
              <button onClick={() => {
                const pic = useVibeStore.getState().generateProfilePic(title || user?.username || 'user');
                setProfileAssets(prev => [...prev, {type: 'pic', data: pic, name: title || 'Profile Pic'}]);
              }} className="w-full energy-btn py-2 rounded text-black">Generate Cyberpunk Pic</button>
            </div>

            <div className="bg-vibe-bg p-4 rounded">
              <div className="font-semibold mb-2">Banner / Cover</div>
              <button onClick={() => {
                const banner = useVibeStore.getState().generateCoverImage(title || 'My Vibe', prompt || 'profile banner');
                setProfileAssets(prev => [...prev, {type: 'banner', data: banner, name: title || 'Banner'}]);
              }} className="w-full energy-btn py-2 rounded text-black">Generate Banner</button>
            </div>

            <div className="bg-vibe-bg p-4 rounded">
              <div className="font-semibold mb-2">Animated Frames</div>
              <button onClick={() => {
                const frames = useVibeStore.getState().generateAnimatedFrame(prompt || title || 'vibe frame', 6);
                frames.forEach((frame, i) => {
                  setProfileAssets(prev => [...prev, {type: 'frame', data: frame, name: `Frame ${i+1}` }]);
                });
                useVibeStore.getState().addNotification('Animated frames added to your profile assets!', 'success');
              }} className="w-full energy-btn py-2 rounded text-black">Generate Animated Frames</button>
            </div>
          </div>

          <button 
            onClick={() => {
              if (profileAssets.length === 0) {
                useVibeStore.getState().addNotification('Generate some assets first!', 'warning');
                return;
              }
              const mainPic = profileAssets.find(a => a.type === 'pic')?.data;
              useVibeStore.getState().updateProfile({ 
                profilePic: mainPic, 
                bio: (user?.bio || '') + ` | Created ${profileAssets.length} assets in studio` 
              });
              profileAssets.forEach(asset => {
                useVibeStore.getState().addWallPost(`New studio creation: ${asset.name}`, undefined);
              });
              useVibeStore.getState().addNotification(`Published ${profileAssets.length} assets to your Profile Wall!`, 'success');
              setProfileAssets([]);
            }}
            className="w-full bg-vibe-red text-black py-3 rounded-xl font-bold mt-4"
          >
            PUBLISH ALL ASSETS TO MY PROFILE
          </button>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-2">
            <button onClick={() => useVibeStore.getState().generateMusic('cyberpunk')} className="energy-btn text-black py-2 rounded text-sm">🎵 Generate Cyberpunk Beat</button>
            <button onClick={() => useVibeStore.getState().generateSoundEffect('whoosh')} className="energy-btn text-black py-2 rounded text-sm">💥 Whoosh SFX</button>
            <button onClick={() => {
              const frames = useVibeStore.getState().generateShortVibeVideo(prompt || title || 'vibe short');
              useVibeStore.getState().addNotification(`Generated ${frames.length} frame short video!`, 'success');
              frames.forEach((f, i) => setProfileAssets(prev => [...prev, {type:'video-frame', data:f, name:`ShortVid Frame ${i+1}`}])); 
            }} className="energy-btn text-black py-2 rounded text-sm">🎬 Funny Short Video Frames</button>
            <button onClick={() => {
              const battle = useVibeStore.getState().createVibeBattle('RandomViber', Math.floor(Math.random()*20)+3);
              const container = document.createElement('div');
              container.appendChild(battle.canvas);
              const btn = document.createElement('button');
              btn.textContent = '⚔️ ATTACK!';
              btn.onclick = () => battle.click();
              container.appendChild(btn);
              document.body.appendChild(container);
              useVibeStore.getState().addNotification('Vibe Battle started! Click ATTACK to fight.', 'info');
            }} className="energy-btn text-black py-2 rounded text-sm">⚔️ Vibe Battle vs Random Profile</button>
          </div>

          <div className="mt-4 text-xs text-gray-500">Assets appear in your Profile Wall and can be used as profile elements.</div>
        </div>
      )}
    </div>
  );
};

export default Create;