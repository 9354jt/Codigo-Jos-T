export enum VoiceName {
  Puck = 'Puck',
  Charon = 'Charon',
  Kore = 'Kore',
  Fenrir = 'Fenrir',
  Zephyr = 'Zephyr'
}

export interface VoiceProfile {
  id: string;            // Unique ID for the UI
  apiVoiceName: VoiceName; // The actual Gemini voice model to use
  label: string;         // Display name (e.g., "Mateo")
  gender: 'Male' | 'Female';
  description: string;
  systemInstruction: string; // Specific instruction for this persona
}

export interface TTSState {
  isLoading: boolean;
  isPlaying: boolean;
  error: string | null;
  audioBuffer: AudioBuffer | null;
}