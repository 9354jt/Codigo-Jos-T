import React from 'react';
import { VoiceProfile } from '../types';
import { VOICE_PROFILES } from '../constants';

interface VoiceSelectorProps {
  selectedVoiceId: string;
  onSelect: (voiceId: string) => void;
  disabled: boolean;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({ selectedVoiceId, onSelect, disabled }) => {
  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-400">Seleccionar Personaje</label>
        <span className="text-xs text-slate-500">{VOICE_PROFILES.length} voces disponibles</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
        {VOICE_PROFILES.map((voice: VoiceProfile) => (
          <button
            key={voice.id}
            onClick={() => onSelect(voice.id)}
            disabled={disabled}
            className={`
              relative flex items-center p-3 rounded-lg border text-left transition-all
              ${selectedVoiceId === voice.id 
                ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500' 
                : 'bg-slate-800 border-slate-700 hover:border-slate-500 hover:bg-slate-750'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className={`
              p-2.5 rounded-full mr-3 shrink-0 flex items-center justify-center
              ${selectedVoiceId === voice.id ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'}
            `}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {voice.gender === 'Female' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                ) : (
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                )}
              </svg>
            </div>
            <div className="overflow-hidden">
              <div className="font-semibold text-slate-200 truncate">{voice.label}</div>
              <div className="text-xs text-slate-400 truncate">{voice.description}</div>
            </div>
            {selectedVoiceId === voice.id && (
              <div className="absolute top-3 right-3 text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VoiceSelector;