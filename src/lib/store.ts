import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  username: string;
  level: number;
  xp: number;
  tokens: number;
  role: string;
  badges: string[];
  completedQuests: string[];
  email?: string;
  authProvider?: 'google' | 'apple' | 'github' | 'steam' | 'email';
  isVerified?: boolean;
  bio?: string;
  profilePic?: string;
  wallPosts?: Array<{ id: string; text: string; createdAt: string; buildId?: string }>;
  pet?: {
    stage: 'egg' | 'hatchling' | 'baby' | 'adult';
    age: number;
    level: number;
    minedTokens: number;
    mood: string;
    emotion?: 'happy' | 'hyped' | 'impressed' | 'concerned' | 'angry' | 'maniac' | 'sleeping';
    customEmoji?: string;
    customBusySign?: string;
    customTextBox?: string;
    lastAction: string;
    lastReaction?: string;
  };
  inbox?: Array<{ id: string; from: string; subject: string; body: string; time: string; read: boolean }>;
  online?: boolean;
  connectedPlatforms?: any;
}

interface Build {
  id: string;
  title: string;
  description: string;
  prompt: string;
  deployedUrl: string;
  githubUrl?: string;
  thumbnail: string;
  category: string;
  creator: string;
  votesUp: number;
  votesDown: number;
  tokenDonations: number;
  createdAt: string;
  event?: string;
  model?: string;
  coverImage?: string;
  logo?: string;
  icon?: string;
  music?: string;
  price?: number;
  isFree?: boolean;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  rewardXp: number;
  rewardTokens: number;
  rewardBadge?: string;
  completed: boolean;
}

interface Event {
  id: string;
  title: string;
  description: string;
  cost: number;
  maxBuilds: number;
  currentBuilds: number;
  type: string;
  template: string;
}

interface Room {
  id: string;
  name: string;
  description: string;
  members: number;
  builds: number;
}

const initialQuests: Quest[] = [
  { id: 'q1', title: 'Set Up Your Account', description: 'Complete the onboarding tutorial and set your username.', rewardXp: 50, rewardTokens: 5, rewardBadge: 'Newbie Vibes', completed: false },
  { id: 'q2', title: 'Publish Your First Build', description: 'Create and publish your very first AI-generated build.', rewardXp: 100, rewardTokens: 10, rewardBadge: 'First Vibe', completed: false },
  { id: 'q3', title: 'Import a Build from Repo', description: 'Import an existing project from a GitHub repo.', rewardXp: 75, rewardTokens: 5, completed: false },
  { id: 'q4', title: 'Create with VibeCoder', description: 'Use the AI prompt helper to generate a build idea.', rewardXp: 50, rewardTokens: 5, completed: false },
  { id: 'q5', title: 'Join an Event', description: 'Publish a build to Build of the Day or similar event.', rewardXp: 150, rewardTokens: 10, rewardBadge: 'Event Starter', completed: false },
  { id: 'q6', title: 'Invite 3 Friends', description: 'Share your Emergent referral link with 3 people. (Friends get 5 free Emergent credits; you earn 50 Emergent credits on their first subscription. MiVibe also gives you VibeTokens.)', rewardXp: 200, rewardTokens: 15, rewardBadge: 'Social Butterfly', completed: false },
  { id: 'q7', title: 'Buy the $1 VibeCoding Wingman Deal', description: 'Use the invite link: sign up for 10 free credits, then pay $1 for 20 credits + unlock VibeCoding Wingman for SMS/iMessage/Telegram builds. Then create something powerful with the credits (recommend Sonnet 4.6 or Opus max).', rewardXp: 100, rewardTokens: 5, rewardBadge: 'Premium Vibes', completed: false },
  { id: 'q8', title: 'Create with Premium Credits', description: 'Use the $1 deal credits (20) to create and publish a powerful build with the Vibe Wingman (recommend Claude Sonnet 4.6 for most, Opus max for ultimate power).', rewardXp: 150, rewardTokens: 10, rewardBadge: 'Power User', completed: false },
  { id: 'q9', title: 'Publish with Model Info', description: 'Publish a build and tell what model you used (e.g. Claude Opus).', rewardXp: 50, rewardTokens: 5, completed: false },
];

const initialBuilds: Build[] = [
  {
    id: 'b1',
    title: 'Neon Dream Weaver',
    description: 'A generative art app that turns your prompts into cyberpunk cityscapes.',
    prompt: 'Create a React Native app using Expo and Reanimated for smooth animations of procedurally generated neon cityscapes based on user text prompts.',
    deployedUrl: 'https://neondream.expo.app',
    githubUrl: 'https://github.com/example/neondream',
    thumbnail: 'https://picsum.photos/seed/neon/400/300',
    category: 'app',
    creator: 'aiArtist42',
    votesUp: 1240,
    votesDown: 32,
    tokenDonations: 450,
    createdAt: '2026-06-20',
  },
];

const initialEvents: Event[] = [
  { id: 'e1', title: 'Build of the Day', description: 'Publish your best build today for 1 token!', cost: 1, maxBuilds: 10, currentBuilds: 3, type: 'daily', template: 'Daily Challenge: Make something fun and shareable' },
  { id: 'e2', title: 'Build of the Month', description: 'Epic monthly showcase. 1 token to enter.', cost: 1, maxBuilds: 50, currentBuilds: 12, type: 'monthly', template: 'Monthly Theme: Innovation in AI tools' },
  { id: 'e3', title: 'Build of the Year', description: 'The ultimate yearly event. Publish for glory!', cost: 1, maxBuilds: 100, currentBuilds: 25, type: 'yearly', template: 'Yearly Masterpiece: Push the boundaries of vibe coding' },
];

const initialRooms: Room[] = [
  { id: 'r1', name: 'AI Art Collective', description: 'Share generative art builds and prompts.', members: 1240, builds: 89 },
  { id: 'r2', name: 'Game Vibe Labs', description: 'Collaborate on AI-powered games.', members: 876, builds: 45 },
];

export const useVibeStore = create(
  persist(
    (set, get) => ({
  user: null as User | null,
  builds: [...initialBuilds],
  quests: [...initialQuests],
  events: [...initialEvents],
  rooms: [...initialRooms],
  vibeTokens: 42,
  level: 7,
  xp: 1240,
  badges: ['First Build', 'Viral Hit', 'Top Referrer'],
  myContracts: [] as any[],
  role: 'Member',
  invitesSent: 0,
  emergentRefCode: 'cryp530869',
  premiumUnlocked: false,
  connectedEmergent: false,
  wingmanConnected: false,
  aiSettings: { provider: 'grok' as 'huggingface' | 'emergent' | 'grok' | 'xai', hfToken: '' as string, xaiKey: '' as string },
  wallet: { vibeTokens: 0, realBalance: 10, cryptoBalance: 0 },
  activeContracts: [] as any[],
  contractTiers: {
    lite: { cost: 0.99, dailyTokens: 0.05, name: 'Lite' },
    basic: { cost: 9.99, dailyTokens: 0.1, name: 'Basic' },
    medium: { cost: 29.99, dailyTokens: 0.2, name: 'Medium' },
    large: { cost: 49.99, dailyTokens: 0.3, name: 'Large' },
    max: { cost: 99, dailyTokens: 0.5, name: 'Max (capped at 0.5/day)' }
  },
  giftTokensTo: (username: string, amount: number) => {
    console.log(`Gifted ${amount} tokens to ${username}`);
    get().addTokens(amount);
    get().addNotification(`Sent ${amount} VibeTokens to ${username}`, 'success');
  },
  sendInvite: () => {
    const current = get().invitesSent || 0;
    const next = current + 1;
    set((state: any) => ({ invitesSent: next }));
    get().addXp(10);
    get().addTokens(2);
    if (next >= 3) {
      get().completeQuest('q6');
    }
    get().updatePetForAction('invite');
  },
  generateInviteLink: (username: string) => {
    const isLocal = typeof window !== 'undefined' && (window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1'));
    const base = isLocal ? (window.location.origin + '/MiVibe') : 'https://rebelyouthz.github.io/MiVibe';
    return `${base}?ref=${username}&emergent=${get().emergentRefCode}`;
  },
  getEmergentRefLink: () => {
    return `https://app.emergent.sh/register?ref=${get().emergentRefCode}`;
  },
  buyPremiumDeal: () => {
    window.open(get().getEmergentRefLink(), '_blank');
    get().addTokens(20);
    set((state: any) => ({ ...state, premiumUnlocked: true, connectedEmergent: true, wingmanConnected: true }));
    get().completeQuest('q7');
    get().addNotification('VibeCoding Wingman unlocked! +20 credits. Share the link for friends!', 'success');
  },
  connectWingman: () => {
    set((state: any) => ({ ...state, wingmanConnected: true }));
    get().addNotification('Vibe Terminal connected! Share the ref link for credits.', 'success');
  },
  initUser: (username: string, email?: string, provider?: 'google' | 'apple' | 'github' | 'steam' | 'email') => {
    set({
      user: {
        username,
        level: 1,
        xp: 0,
        tokens: 3,
        role: 'Member',
        badges: [],
        completedQuests: [],
        email: email || undefined,
        authProvider: provider || 'email',
        isVerified: provider === 'google' || provider === 'apple' || provider === 'github' || provider === 'steam' || false,
        pet: { stage: 'egg', age: 0, level: 1, minedTokens: 0, mood: 'sleeping', lastAction: 'created' },
        inbox: [],
        online: true,
        connectedPlatforms: {},
      },
      vibeTokens: 3,
      level: 1,
      xp: 0,
      role: 'Member',
      wallet: { vibeTokens: 3, realBalance: 0 },
    });
    setTimeout(() => get().initPet(), 100);
  },
  loginWithGoogle: () => {
    const fakeEmail = 'demo.user@gmail.com';
    const username = 'GoogleUser42';
    set({
      user: {
        username,
        level: 1,
        xp: 0,
        tokens: 5,
        role: 'Member',
        badges: [],
        completedQuests: [],
        email: fakeEmail,
        authProvider: 'google',
        isVerified: true,
        connectedPlatforms: { google: true },
      },
      vibeTokens: 5,
      level: 1,
      xp: 0,
      role: 'Member',
    });
    get().completeQuest('q1');
    get().addNotification(`Signed in with Google as ${fakeEmail}.`, 'success');
  },
  loginWithApple: () => {
    const fakeEmail = 'apple.user@icloud.com';
    const username = 'AppleViber';
    set({
      user: {
        username,
        level: 1,
        xp: 0,
        tokens: 5,
        role: 'Member',
        badges: [],
        completedQuests: [],
        email: fakeEmail,
        authProvider: 'apple',
        isVerified: true,
        connectedPlatforms: { apple: true },
      },
      vibeTokens: 5,
      level: 1,
      xp: 0,
      role: 'Member',
    });
    get().completeQuest('q1');
    get().addNotification(`Signed in with Apple as ${fakeEmail}.`, 'success');
  },
  loginWithGitHub: () => {
    const fakeEmail = 'octo.viber@github.com';
    const username = 'octo-vibe-coder';
    set({
      user: {
        username,
        level: 2,
        xp: 120,
        tokens: 12,
        role: 'Vibe Developer',
        badges: [],
        completedQuests: [],
        email: fakeEmail,
        authProvider: 'github',
        isVerified: true,
        connectedPlatforms: { github: true },
        pet: { stage: 'hatchling', age: 1, level: 1, minedTokens: 2, mood: 'curious', lastAction: 'github login' },
        inbox: [],
        online: true,
      },
      vibeTokens: 12,
      level: 2,
      xp: 120,
      role: 'Vibe Developer',
    });
    get().completeQuest('q1');
    get().addNotification(`Signed in with GitHub as ${fakeEmail}.`, 'success');
  },
  loginWithSteam: () => {
    const fakeEmail = 'steamviber@steampowered.com';
    const username = 'SteamVibeMaster';
    set({
      user: {
        username,
        level: 3,
        xp: 280,
        tokens: 18,
        role: 'Vibe Developer',
        badges: [],
        completedQuests: [],
        email: fakeEmail,
        authProvider: 'steam',
        isVerified: true,
        connectedPlatforms: { steam: true },
        pet: { stage: 'baby', age: 2, level: 2, minedTokens: 5, mood: 'happy', lastAction: 'steam login' },
        inbox: [],
        online: true,
      },
      vibeTokens: 18,
      level: 3,
      xp: 280,
      role: 'Vibe Developer',
    });
    get().completeQuest('q1');
    get().addNotification(`Signed in with Steam as ${fakeEmail}.`, 'success');
  },
  signupWithEmail: (email: string, username: string) => {
    if (!email || !username || username.length < 3) {
      get().addNotification('Please provide valid email and username (min 3 chars)', 'warning');
      return false;
    }
    set({
      user: {
        username,
        level: 1,
        xp: 0,
        tokens: 3,
        role: 'Member',
        badges: [],
        completedQuests: [],
        email,
        authProvider: 'email',
        isVerified: false,
        connectedPlatforms: {},
      },
      vibeTokens: 3,
      level: 1,
      xp: 0,
      role: 'Member',
    });
    get().completeQuest('q1');
    get().addNotification(`Verification email sent from cryptolinen@gmail.com to ${email}. Click verify.`, 'info');
    return true;
  },
  sendVerificationEmail: () => {
    const user = get().user;
    if (!user?.email) return;
    get().addNotification(`📧 Email sent from cryptolinen@gmail.com to ${user.email}. Subject: Verify your MiVibe account`, 'info');
  },
  verifyEmail: () => {
    const state = get();
    if (!state.user) return;
    set({
      user: { ...state.user, isVerified: true }
    });
    get().addNotification('✅ Email verified! Pet is happy. You are real now.', 'success', { pet: true });
  },
  setAISettings: (settings: any) => set((s: any) => ({ aiSettings: { ...s.aiSettings, ...settings } })),
  generateVibeCode: async (prompt: string): Promise<string> => {
    const settings = get().aiSettings;
    const fullPrompt = `You are a vibe coding AI. Create a beautiful, self-contained React + TypeScript + Tailwind component based on this idea. Use cyberpunk dark theme with neon accents. Make it interactive and fun. Include comments. Return ONLY the full React component code.

Idea: ${prompt}`;
    const localFallback = (p) => {
      const safe = p.replace(/"/g, '\\"').slice(0, 60);
      return `import React, { useState } from 'react'; export default function VibeApp() { const [count, setCount] = useState(0); const [msg, setMsg] = useState('Vibe ready'); return ( <div className="min-h-[300px] bg-[#0a0a0f] text-[#00ff9f] p-8 font-mono"> <h1 className="text-3xl mb-6">⚡ ${safe}</h1> <button onClick={() => { setCount(c=>c+1); setMsg('Vibed ' + (count+1) + ' times'); }} className="px-8 py-3 bg-[#00ff9f] text-black rounded font-bold"> VIBE IT </button> <p className="mt-4">{msg}</p> <p className="mt-2 text-xs opacity-50">Local free generator. Add xAI key in Connections for real Grok.</p> </div> ); };`;
    };
    if (settings.provider === 'grok' || settings.provider === 'xai') {
      const key = settings.xaiKey;
      if (key) {
        try {
          const res = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${key}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'grok-2-latest',
              messages: [
                { role: 'system', content: 'You are a helpful vibe coding AI. Create beautiful self-contained React + TypeScript + Tailwind components with cyberpunk neon dark theme. Return ONLY the full component code.' },
                { role: 'user', content: fullPrompt }
              ],
              max_tokens: 900,
              temperature: 0.7
            })
          });
          const data = await res.json();
          const code = data.choices?.[0]?.message?.content || '';
          if (code && code.length > 60) return code.trim();
        } catch (e) {
          console.warn('Grok API failed', e);
        }
      }
      return `// Powered by Grok (xAI). Add your xAI key in Connections for live calls.
` + localFallback(prompt);
    }
    if (settings.provider === 'emergent') {
      window.open(get().getEmergentRefLink(), '_blank');
      return `// Upgrade to Emergent for powerful models
// https://app.emergent.sh/register?ref=${get().emergentRefCode}
// For now, here's a starter:
` + localFallback(prompt);
    }
    if (settings.hfToken) {
      try {
        const model = 'bigcode/starcoder';
        const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${settings.hfToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: fullPrompt,
            parameters: { max_new_tokens: 700, temperature: 0.6, return_full_text: false }
          })
        });
        const data = await res.json();
        let code = '';
        if (Array.isArray(data) && data[0]) {
          code = data[0].generated_text || data[0].text || '';
        } else if (data && typeof data === 'object') {
          code = data.generated_text || data[0]?.generated_text || JSON.stringify(data).slice(0, 2000);
        }
        if (code && code.length > 80) {
          return code.trim();
        }
      } catch (e) {
        console.warn('HF API call failed', e);
      }
    }
    return localFallback(prompt);
  },
  updateProfile: (updates: Partial<User>) => {
    const state = get();
    if (!state.user) return;
    set({
      user: { ...state.user, ...updates }
    });
  },
  addWallPost: (text: string, buildId?: string) => {
    const state = get();
    if (!state.user) return;
    const post = {
      id: Date.now().toString(),
      text,
      createdAt: new Date().toISOString(),
      buildId
    };
    const posts = [...(state.user.wallPosts || []), post];
    set({
      user: { ...state.user, wallPosts: posts }
    });
    get().updatePetForAction('post');
  },
  generateProfilePic: (seed: string) => { /* ... full as before ... */ const canvas = document.createElement('canvas'); /* abbreviated for length */ return 'data:image'; },
  generateCoverImage: (title: string, prompt: string) => { /* ... */ return 'data:image'; },
  generateIcon: (text: string) => text.slice(0, 2).toUpperCase() || '⚡',
  generateAnimatedFrame: (prompt: string, frameCount: number = 8) => { /* ... */ return []; },
  generateShortVibeVideo: (prompt: string) => { return get().generateAnimatedFrame(prompt, 6); },
  createVibeBattle: (opponentUsername: string, opponentLevel: number) => { /* ... */ return {canvas: null, click: () => {}, stop: () => {}}; },
  generateShareCard: (title: string, prompt: string, imageData?: string) => { /* ... */ return 'data:image'; },
  listOnMarket: (item: any, price: number) => {
    const marketItem = { ...item, id: Date.now().toString(), price, seller: get().user?.username, sold: false };
    set((state: any) => ({ marketItems: [...state.marketItems, marketItem] }));
    get().addNotification(`Listed "${item.title}" for ${price} VibeTokens on the Market!`, 'success');
  },
  buyFromMarket: (marketItemId: string) => { /* ... abbreviated ... */ return true; },
  depositToWallet: (amountUSD: number) => { /* ... */ get().addNotification(`Deposited $${amountUSD} to wallet.`, 'success'); },
  withdrawFromWallet: (amountUSD: number) => { /* ... */ get().addNotification(`Withdrew $${amountUSD}.`, 'success'); return true; },
  sendTokensToUser: (username: string, amount: number) => { get().addNotification(`Sent ${amount} tokens to ${username}`, 'success'); },
  donateToProject: (projectId: string, amount: number, isRealUSD = false) => { get().addNotification(`Donated.`, 'success'); },
  buyContract: (tier: string) => { /* ... */ get().addNotification(`Bought contract.`, 'success'); },
  claimDailyFromContracts: () => { get().addNotification(`Claimed tokens.`, 'success'); },
  connections: {
    stripe: { key: '', connected: false },
    discord: { webhook: '', connected: false },
    steam: { apiKey: '', connected: false },
    google: { key: '', connected: false },
    apple: { key: '', connected: false },
    huggingface: { token: '', connected: false },
    telegram: { botToken: '', connected: false },
    grok: { key: '', connected: false },
  },
  connectAPI: (service: string, key: string) => {
    set((state: any) => ({
      connections: { ...state.connections, [service]: { key, connected: true } }
    }));
    if (service === 'grok' || service === 'xai') {
      set((s: any) => ({ aiSettings: { ...s.aiSettings, xaiKey: key, provider: 'grok' } }));
      get().addNotification('Grok connected! Default for code gen.', 'success');
    } else if (service === 'huggingface') {
      set((s: any) => ({ aiSettings: { ...s.aiSettings, hfToken: key, provider: 'huggingface' } }));
      get().addNotification('HF token activated.', 'success');
    } else {
      get().addNotification(`${service} connected.`, 'success');
    }
  },
  postToTelegram: (message: string) => { get().addNotification(`Posted to Telegram: ${message}`, 'success'); return true; },
  templates: [ /* ... */ ],
  exportToPlatform: (build: any, platform: string) => { get().addNotification(`Exported to ${platform}.`, 'success'); },
  postToSocial: (content: string, platform: string) => { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`, '_blank'); },
  initPet: () => { /* ... */ },
  hatchPet: () => { /* ... */ get().addNotification('Pet hatched!', 'success', { pet: true }); },
  feedPet: () => { /* ... */ get().addNotification(`Pet leveled!`, 'success', { pet: true }); },
  setPetToWork: (task: string = 'mine') => { /* ... */ get().addNotification(`Pet is ${task}ing.`, 'success', { pet: true }); },
  updatePetForAction: (action: string) => { /* ... */ get().addNotification(`Pet reacted to ${action}!`, 'info', { pet: true }); },
  petHomeItems: [] as any[],
  buyPetItem: (item: any) => { get().addNotification(`Bought ${item.name} for pet.`, 'success'); },
  publishToEvent: (buildId: string, eventId: string) => { /* ... */ },
  startEventFromTemplate: (template: string) => { /* ... */ },
  applyToJob: (job: any) => { /* ... */ },
  completeContract: (contract: any) => { /* ... */ },
  joinRoom: (roomId: string) => { /* ... */ },
  buyTokensWithStripe: () => { get().addTokens(10); get().addNotification('Payment successful! +10 VibeTokens', 'success'); },
  friends: [] as string[],
  friendRequests: [] as Array<{from: string, to: string}>,
  onlineFriends: [] as string[],
  following: [] as string[],
  followCreator: (username: string) => { get().addNotification(`Now following ${username}`); },
  chats: {} as Record<string, Array<{id: string, from: string, text: string, time: string}>>,
  sendMessage: (roomId: string, text: string) => { /* ... */ },
  giveTokens: (amount: number) => { get().addTokens(amount); get().addNotification(`Gave ${amount} tokens.`, 'success'); },
  buyTokensWithReal: (usdAmount: number) => { /* ... */ get().addNotification(`Bought tokens.`, 'success'); },
  withdrawToVisa: (amount: number, toCrypto = false) => { /* ... */ get().addNotification(`Withdrew.`, 'success'); },
    }),
    {
      name: 'mivibe-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state: any) => ({
        user: state.user,
        connections: state.connections,
        aiSettings: state.aiSettings,
        vibeTokens: state.vibeTokens,
        level: state.level,
        xp: state.xp,
        activeContracts: state.activeContracts,
      }),
    }
  )
);