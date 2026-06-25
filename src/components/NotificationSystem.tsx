import React from 'react';
import { useVibeStore } from '../lib/store';
import { motion, AnimatePresence } from 'framer-motion';

interface Notif {
  id: string;
  text: string;
  time: string;
  read: boolean;
  type?: 'success' | 'warning' | 'info' | 'error';
  context?: any;
}

const getBubbleClasses = (type?: string) => {
  const base = "max-w-[340px] px-4 py-3 text-sm font-medium border flex items-start gap-2 backdrop-blur shadow-2xl";

  if (type === 'success') {
    // Positive confirmation: pop + wiggle, strong positive feel
    return `${base} bg-[#0a2a1a] border-[#4dff91] text-[#4dff91] rounded-3xl shadow-[0_0_28px_#4dff9144]`;
  }
  if (type === 'warning' || type === 'error') {
    // Warning: sharp zig-zag / edgy, negative charged
    return `${base} bg-[#2a0a0a] border-[#ff2a4a] text-[#ff2a4a] [clip-path:polygon(0_10%,10%_0,90%_0,100%_10%,100%_90%,90%_100%,10%_100%,0_90%)]`;
  }
  // info / reminder - friendly but still fits theme
  return `${base} bg-[#0a0a12] border-[#4dffd4] text-white rounded-2xl`;
};

const NotificationBubble: React.FC<{ notif: Notif; onClose: (id: string) => void }> = ({ notif, onClose }) => {
  const type = notif.type || 'info';
  const showPet = notif.context?.pet || type === 'success';

  const petEmoji = notif.context?.petEmoji || '🐾';

  let petClass = "text-3xl mr-2 mt-0.5";
  if (type === 'success') petClass += " animate-bounce";
  if (type === 'warning' || type === 'error') petClass += " opacity-80";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.16 }}
      className={getBubbleClasses(type) + " relative pointer-events-auto"}
      onClick={() => onClose(notif.id)}
    >
      {showPet && (
        <div className={petClass} title="Your pet reacts to this">
          {petEmoji}
        </div>
      )}
      <div className="flex-1 leading-snug pr-1">
        {notif.text}
        <div className="text-[10px] opacity-50 mt-1 font-mono">{notif.time}</div>
      </div>
      <button 
        className="text-[11px] opacity-60 hover:opacity-100 ml-1 self-start" 
        onClick={(e) => { e.stopPropagation(); onClose(notif.id); }}
      >
        ✕
      </button>
    </motion.div>
  );
};

export const NotificationSystem: React.FC = () => {
  const { notifications } = useVibeStore();

  const visible = [...notifications].slice(-4); // show last 4

  const handleClose = (id: string) => {
    useVibeStore.setState((s: any) => ({
      notifications: s.notifications.filter((n: any) => n.id !== id)
    }));
  };

  return (
    <div className="fixed bottom-4 right-4 z-[999] flex flex-col gap-2 items-end pointer-events-none">
      <AnimatePresence>
        {visible.map((n: any) => (
          <div key={n.id} className="pointer-events-auto">
            <NotificationBubble notif={n} onClose={handleClose} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationSystem;