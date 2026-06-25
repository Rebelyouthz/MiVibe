import React, { useState, useEffect } from 'react';
import { useVibeStore } from '../lib/store';

type AuthStep = 'choose' | 'email-form' | 'verify' | 'done';
type Provider = 'google' | 'apple' | 'github' | 'steam' | 'email';

const Onboarding: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { 
    initUser: _initUser, 
    completeQuest, 
    addTokens, 
    loginWithGoogle, 
    loginWithApple, 
    loginWithGitHub,
    loginWithSteam,
    signupWithEmail, 
    sendVerificationEmail, 
    verifyEmail,
    connections
  } = useVibeStore();

  const [step, setStep] = useState<AuthStep>('choose');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [refBonus, setRefBonus] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<Provider | null>(null);
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [showApplePicker, setShowApplePicker] = useState(false);
  const [showOAuthModal, setShowOAuthModal] = useState<null | { provider: string; onApprove: () => void }>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasRef = params.get('ref') || params.get('emergent');
    if (hasRef) setRefBonus(true);
  }, []);

  const handleRefBonus = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('ref') || params.get('emergent')) {
      addTokens(5);
      useVibeStore.getState().addNotification('Referral detected (Emergent)! +5 bonus VibeTokens. Share the link.', 'success');
    }
  };

  // Social: Google picker simulation
  const handleGoogleLogin = (_chosenEmail?: string) => {
    setShowGooglePicker(false);
    loginWithGoogle();
    setCurrentProvider('google');
    handleRefBonus();
    completeQuest('q1');
    useVibeStore.getState().addNotification('🐾 Pet: Google verified. You are real. Good. Now go vibe code with Grok.', 'success', { pet: true });
    setStep('done');
  };

  const openGooglePicker = () => setShowGooglePicker(true);

  // Apple picker simulation
  const handleAppleLogin = (_chosenEmail?: string) => {
    setShowApplePicker(false);
    loginWithApple();
    setCurrentProvider('apple');
    handleRefBonus();
    completeQuest('q1');
    setStep('done');
  };

  const openApplePicker = () => setShowApplePicker(true);

  // Email flow
  const startEmailSignup = () => {
    setStep('email-form');
  };

  const sendEmailVerification = () => {
    if (!email || username.length < 3) {
      useVibeStore.getState().addNotification('Enter a valid email and username (min 3 chars)', 'warning');
      return;
    }
    const success = signupWithEmail(email, username);
    if (success) {
      setCurrentProvider('email');
      handleRefBonus();
      setStep('verify');
    }
  };

  const handleVerify = () => {
    verifyEmail();
    useVibeStore.getState().addNotification('✅ Verified. Pet is happy. You are real now. Go build.', 'success', { pet: true });
    setStep('done');
  };

  const finish = () => {
    onComplete();
  };

  // Fake account options for pickers (demo only)
  const googleAccounts = ['cryptolinen@gmail.com', 'demo.viber@gmail.com', 'yourname@gmail.com'];
  const appleAccounts = ['timmi@icloud.com', 'vibecoder@me.com'];

  return (
    <div className="min-h-screen bg-vibe-bg flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-vibe-card rounded-2xl p-8 relative">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">⚡</div>
          <h1 className="text-4xl font-bold text-vibe-accent">Welcome to MiVibe</h1>
          <p className="text-gray-400 mt-2">The #1 platform for AI Vibe Coding. Build. Share. Level Up.</p>
          <div className="mt-3 text-4xl">🐾</div>
          <p className="text-xs text-vibe-accent mt-1">Your pet is waiting. It will remember what you build and who you are.</p>
        </div>

        {/* CHOOSE METHOD */}
        {step === 'choose' && (
          <>
            <div className="space-y-3 mb-6">
              <button 
                onClick={openGooglePicker}
                className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-100 active:scale-[0.985]"
              >
                <span>🔵</span> Continue with Google
              </button>

              <button 
                onClick={openApplePicker}
                className="w-full flex items-center justify-center gap-3 bg-black text-white font-semibold py-3 rounded-xl hover:bg-gray-900 active:scale-[0.985]"
              >
                <span></span> Sign in with Apple
              </button>

              <button 
                onClick={() => setShowOAuthModal({
                  provider: 'GitHub',
                  onApprove: () => {
                    loginWithGitHub();
                    setCurrentProvider('github');
                    handleRefBonus();
                    completeQuest('q1');
                    setStep('done');
                    setShowOAuthModal(null);
                  }
                })}
                className="w-full flex items-center justify-center gap-3 bg-gray-800 text-white font-semibold py-3 rounded-xl hover:bg-gray-700"
              >
                <span>🐙</span> Continue with GitHub
              </button>

              <button 
                onClick={() => setShowOAuthModal({
                  provider: 'Steam',
                  onApprove: () => {
                    loginWithSteam();
                    setCurrentProvider('steam');
                    handleRefBonus();
                    completeQuest('q1');
                    setStep('done');
                    setShowOAuthModal(null);
                  }
                })}
                className="w-full flex items-center justify-center gap-3 bg-[#1b2838] text-white font-semibold py-3 rounded-xl hover:bg-[#2a475e]"
              >
                <span>🎮</span> Continue with Steam
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-700"></div></div>
                <div className="relative flex justify-center"><span className="bg-vibe-card px-3 text-xs text-gray-500">or</span></div>
              </div>

              <button 
                onClick={startEmailSignup}
                className="w-full bg-vibe-bg border border-gray-700 hover:border-vibe-accent text-white font-semibold py-3 rounded-xl"
              >
                Sign up with Email
              </button>
            </div>

            <p className="text-xs text-center text-gray-500">Real OAuth + email verification coming in production (GitHub/Steam/OpenID + Google/Apple Sign-In). Currently simulated. Sender shown as cryptolinen@gmail.com.</p>
          </>
        )}

        {/* EMAIL SIGNUP FORM */}
        {step === 'email-form' && (
          <>
            <h3 className="font-semibold mb-4">Create your account</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1.5 text-gray-400">Email address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="you@example.com" 
                  className="onboarding-input w-full bg-vibe-bg border border-gray-700 rounded p-3 text-white placeholder-gray-400" style={{ color: 'white', backgroundColor: '#0a0a0a' }} 
                />
              </div>
              <div>
                <label className="block text-sm mb-1.5 text-gray-400">Username</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  placeholder="vibecoder42" 
                  className="onboarding-input w-full bg-vibe-bg border border-gray-700 rounded p-3 text-white placeholder-gray-400" style={{ color: 'white', backgroundColor: '#0a0a0a' }} 
                />
              </div>
            </div>

            <button onClick={sendEmailVerification} className="mt-6 w-full bg-vibe-accent text-black py-3 rounded-xl font-bold">
              Send verification email
            </button>
            <p className="text-[10px] text-center mt-3 text-gray-500">We will send from cryptolinen@gmail.com (or support@mivibe.app)</p>

            <button onClick={() => setStep('choose')} className="mt-3 text-xs text-gray-500 underline">Back</button>
          </>
        )}

        {/* EMAIL VERIFICATION */}
        {step === 'verify' && (
          <>
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">📬</div>
              <h3 className="font-semibold">Check your inbox</h3>
              <p className="text-sm text-gray-400 mt-1">We sent a verification link to <span className="text-vibe-accent">{email}</span></p>
            </div>

            <div className="bg-vibe-bg p-4 rounded-xl mb-4 text-xs border border-gray-700">
              <div className="mb-1 font-mono text-[10px] text-gray-400">From: cryptolinen@gmail.com</div>
              <div className="mb-1 font-mono text-[10px] text-gray-400">Subject: Verify your MiVibe account</div>
              <div className="text-gray-300">Hi {username},<br />Please verify your email to unlock full MiVibe features including VibeTokens and Emergent API access.</div>
            </div>

            <button onClick={handleVerify} className="w-full bg-green-500 hover:bg-green-600 text-black py-3 rounded-xl font-bold mb-2">
              Verify My Email
            </button>
            <p className="text-[10px] text-center text-vibe-accent">🐾 Pet: Do it. Then we can really start.</p>

            <button onClick={() => sendVerificationEmail()} className="w-full text-sm text-vibe-accent underline py-2">
              Resend email from cryptolinen@gmail.com
            </button>

            <button onClick={() => setStep('email-form')} className="mt-2 block w-full text-xs text-gray-500">Use different email</button>
          </>
        )}

        {/* SUCCESS / DONE */}
        {step === 'done' && (
          <>
            <div className="text-center">
              <div className="text-green-400 mb-2 text-lg">✓ Account verified &amp; ready!</div>
              <p className="mb-6">
                Welcome{currentProvider ? ` via ${currentProvider.toUpperCase()}` : ''}! 
                {refBonus && ' Referral bonus applied.'}
                Your pet is now with you.
              </p>
            </div>

            <div className="space-y-3 mb-6 text-sm">
              <div className="bg-vibe-bg p-3 rounded">• Complete quests to level up and unlock "Developer" status.</div>
              <div className="bg-vibe-bg p-3 rounded">• Use VibeCoder to generate builds from prompts.</div>
              <div className="bg-vibe-bg p-3 rounded">• Publish builds, earn VibeTokens, climb the ranks.</div>
            </div>

            <button onClick={finish} className="w-full bg-vibe-accent text-black py-3 rounded-xl font-bold">
              Enter MiVibe
            </button>
          </>
        )}

        {/* Google account picker (demo) */}
        {showGooglePicker && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-2xl p-6">
            <div className="bg-vibe-card w-full rounded-xl p-5">
              <div className="text-center mb-4 font-semibold">Choose a Google account</div>
              {googleAccounts.map((acc, i) => (
                <button key={i} onClick={() => handleGoogleLogin(acc)} className="w-full text-left p-3 mb-2 rounded bg-vibe-bg hover:bg-gray-800 flex items-center gap-3">
                  <span>🔵</span> {acc}
                </button>
              ))}
              <button onClick={() => setShowGooglePicker(false)} className="mt-2 text-xs text-gray-400">Cancel</button>
            </div>
          </div>
        )}

        {/* Apple picker (demo) */}
        {showApplePicker && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-2xl p-6">
            <div className="bg-vibe-card w-full rounded-xl p-5">
              <div className="text-center mb-4 font-semibold">Sign in with Apple</div>
              {appleAccounts.map((acc, i) => (
                <button key={i} onClick={() => handleAppleLogin(acc)} className="w-full text-left p-3 mb-2 rounded bg-vibe-bg hover:bg-gray-800 flex items-center gap-3">
                  <span></span> {acc}
                </button>
              ))}
              <button onClick={() => setShowApplePicker(false)} className="mt-2 text-xs text-gray-400">Cancel</button>
            </div>
          </div>
        )}

        {/* Simulated real OAuth consent screen */}
        {showOAuthModal && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-2xl p-6 z-50">
            <div className="bg-vibe-card w-full max-w-sm rounded-xl p-6">
              <h3 className="font-bold mb-2">Sign in with {showOAuthModal.provider}</h3>
              <p className="text-sm text-gray-400 mb-4">This will connect your {showOAuthModal.provider} account and create or log you in to MiVibe.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowOAuthModal(null)} className="flex-1 py-2 rounded bg-gray-700">Cancel</button>
                <button onClick={() => { showOAuthModal.onApprove(); }} className="flex-1 py-2 rounded bg-vibe-accent text-black font-bold">Approve</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;