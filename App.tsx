import React, { useState, useRef, useEffect, useCallback } from 'react';
import { VoiceProfile } from './types';
import { DEFAULT_TEXT, VOICE_PROFILES, DEFAULT_VOICE_ID } from './constants';
import { generateSpeech } from './services/geminiService';
import { decodeAudioData, getAudioContext } from './utils/audioUtils';
import VoiceSelector from './components/VoiceSelector';
import Waveform from './components/Waveform';

const App: React.FC = () => {
  const [text, setText] = useState<string>(DEFAULT_TEXT);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(DEFAULT_VOICE_ID);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Audio Refs
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentBufferRef = useRef<AudioBuffer | null>(null);

  // Initialize Audio Context on mount
  useEffect(() => {
    return () => {
      if (sourceRef.current) {
        sourceRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const stopAudio = useCallback(() => {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
      } catch (e) {
        // Ignore errors if already stopped
      }
      sourceRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const playAudio = useCallback((buffer: AudioBuffer) => {
    stopAudio(); // Stop any currently playing audio

    const ctx = getAudioContext();
    audioContextRef.current = ctx;

    // Set up analyser
    if (!analyserRef.current) {
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 2048;
        analyserRef.current = analyser;
    }
    
    // Connect nodes
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(analyserRef.current!);
    analyserRef.current!.connect(ctx.destination);

    source.onended = () => {
      setIsPlaying(false);
    };

    source.start();
    sourceRef.current = source;
    setIsPlaying(true);
  }, [stopAudio]);

  const handleGenerateAndPlay = async () => {
    if (!text.trim()) return;
    
    // Find selected profile
    const profile = VOICE_PROFILES.find(v => v.id === selectedVoiceId);
    if (!profile) {
        setError("Error: Voz no seleccionada.");
        return;
    }

    setError(null);
    setIsLoading(true);
    stopAudio(); // Stop if playing

    try {
      // 1. Generate Speech using the profile's specific API name and System Instruction
      const base64Audio = await generateSpeech(text, profile.apiVoiceName, profile.systemInstruction);
      
      // 2. Decode Audio
      const ctx = getAudioContext();
      const audioBuffer = await decodeAudioData(base64Audio, ctx);
      
      // 3. Store and Play
      currentBufferRef.current = audioBuffer;
      playAudio(audioBuffer);

    } catch (err: any) {
      console.error(err);
      setError("Error al generar el audio. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplay = () => {
    if (currentBufferRef.current) {
      playAudio(currentBufferRef.current);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-3">
             <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
             </div>
             <div>
               <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                 Gemini José T
               </h1>
               <p className="text-slate-400 text-sm">Edición México + Voces Variadas</p>
             </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Input Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/50 rounded-2xl p-1 border border-slate-800 ring-1 ring-slate-800/50 shadow-xl">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Escribe algo aquí para convertir a voz..."
                className="w-full h-64 bg-slate-950/80 rounded-xl p-6 text-lg leading-relaxed text-slate-100 placeholder-slate-600 border-none outline-none resize-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                disabled={isLoading}
              />
            </div>

             {/* Action Bar */}
             <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="text-sm text-slate-400">
                  {text.length} caracteres
                </div>
                <div className="flex space-x-3">
                  {currentBufferRef.current && !isLoading && (
                    <button
                      onClick={isPlaying ? stopAudio : handleReplay}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                    >
                      {isPlaying ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span>Pausar</span>
                        </>
                      ) : (
                        <>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                           </svg>
                           <span>Reproducir</span>
                        </>
                      )}
                    </button>
                  )}

                  <button
                    onClick={handleGenerateAndPlay}
                    disabled={isLoading || !text.trim()}
                    className={`
                      flex items-center space-x-2 px-6 py-2 rounded-lg font-semibold text-white transition-all shadow-lg shadow-indigo-500/30
                      ${isLoading 
                        ? 'bg-slate-700 cursor-not-allowed opacity-75' 
                        : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95'}
                    `}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Generando...</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 01-1-1v-3a1 1 0 011-1h.5a1.5 1.5 0 000-3h-.5a1 1 0 01-1-1V5a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                        </svg>
                        <span>Generar Audio</span>
                      </>
                    )}
                  </button>
                </div>
             </div>
             
             {error && (
                <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
             )}
          </div>

          {/* Sidebar / Controls */}
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-lg">
               <h3 className="text-lg font-semibold mb-4 text-white">Visualización</h3>
               <Waveform analyser={analyserRef.current} isPlaying={isPlaying} />
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-lg">
               <VoiceSelector 
                  selectedVoiceId={selectedVoiceId} 
                  onSelect={setSelectedVoiceId}
                  disabled={isLoading}
               />
            </div>

            <div className="bg-indigo-900/20 rounded-xl p-6 border border-indigo-500/20">
               <h4 className="text-indigo-300 font-semibold mb-2 text-sm">Voces Mexicanas</h4>
               <p className="text-indigo-200/70 text-sm">
                 Hemos actualizado el catálogo con voces de Ciudad de México y acentos neutros mexicanos.
               </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;