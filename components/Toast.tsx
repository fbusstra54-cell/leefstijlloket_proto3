
import React, { useEffect } from 'react';
import { CheckCircle, Plus } from 'lucide-react';

interface ToastProps {
  message: string;
  points: number;
  visible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, points, visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100] animate-bounce-short">
      <div className="bg-slate-900/90 dark:bg-teal-600/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/10">
        <div className="bg-green-500 rounded-full p-1">
          <CheckCircle className="w-4 h-4 text-white" />
        </div>
        <span className="font-medium text-sm">{message}</span>
        <div className="bg-white/20 px-2 py-0.5 rounded-md text-xs font-bold flex items-center">
          <Plus className="w-3 h-3 mr-0.5" /> {points} ptn
        </div>
      </div>
    </div>
  );
};
