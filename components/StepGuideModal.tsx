
import React, { useState } from 'react';
import { X, Smartphone } from 'lucide-react';

interface StepGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StepGuideModal: React.FC<StepGuideModalProps> = ({ isOpen, onClose }) => {
  const [platform, setPlatform] = useState<'ios' | 'android'>('ios');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center">
            <Smartphone className="w-5 h-5 mr-2 text-teal-600" />
            Hulp bij Stappen Tellen
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800">
          <button 
            onClick={() => setPlatform('ios')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              platform === 'ios' 
                ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50/50 dark:bg-teal-900/10' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            iPhone (Apple Health)
          </button>
          <button 
            onClick={() => setPlatform('android')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              platform === 'android' 
                ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50/50 dark:bg-teal-900/10' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            Android (Google Fit)
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {platform === 'ios' ? (
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-slate-100 dark:bg-slate-800 w-6 h-6 rounded-full flex items-center justify-center text-slate-900 dark:text-white font-bold text-xs mr-3 flex-shrink-0 mt-0.5">1</div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Zoek de app met het <strong>witte icoon en het rode hartje</strong> (Gezondheid/Health). Deze staat standaard op elke iPhone.
                </p>
              </div>
              <div className="flex items-start">
                <div className="bg-slate-100 dark:bg-slate-800 w-6 h-6 rounded-full flex items-center justify-center text-slate-900 dark:text-white font-bold text-xs mr-3 flex-shrink-0 mt-0.5">2</div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Open de app en klik onderin op <strong>'Overzicht'</strong>.
                </p>
              </div>
              <div className="flex items-start">
                <div className="bg-slate-100 dark:bg-slate-800 w-6 h-6 rounded-full flex items-center justify-center text-slate-900 dark:text-white font-bold text-xs mr-3 flex-shrink-0 mt-0.5">3</div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Scroll naar <strong>'Stappen'</strong>. Dit is uw aantal voor vandaag.
                </p>
              </div>
              <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-100 dark:border-teal-800/50">
                 <p className="text-xs text-teal-700 dark:text-teal-300">
                   <strong>Tip:</strong> Houd uw telefoon in uw broekzak tijdens het lopen voor de beste meting.
                 </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-slate-100 dark:bg-slate-800 w-6 h-6 rounded-full flex items-center justify-center text-slate-900 dark:text-white font-bold text-xs mr-3 flex-shrink-0 mt-0.5">1</div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Gebruik <strong>Google Fit</strong> of <strong>Samsung Health</strong>.
                </p>
              </div>
              <div className="flex items-start">
                <div className="bg-slate-100 dark:bg-slate-800 w-6 h-6 rounded-full flex items-center justify-center text-slate-900 dark:text-white font-bold text-xs mr-3 flex-shrink-0 mt-0.5">2</div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Op het startscherm ziet u vaak direct een cirkel met een <strong>schoen-icoontje</strong> of 'Stappen'.
                </p>
              </div>
              <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-100 dark:border-teal-800/50">
                 <p className="text-xs text-teal-700 dark:text-teal-300">
                   <strong>Tip:</strong> Geen stappenteller? U kunt gratis apps zoals 'Pedometer' downloaden in de Play Store.
                 </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-center">
           <button onClick={onClose} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">Begrepen</button>
        </div>
      </div>
    </div>
  );
};
