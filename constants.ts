import { VoiceName, VoiceProfile } from './types';

export const VOICE_PROFILES: VoiceProfile[] = [
  { 
    id: 'carlos_mx',
    apiVoiceName: VoiceName.Puck, 
    label: 'Carlos (CDMX)', 
    gender: 'Male', 
    description: 'Casual y chilango (México)',
    systemInstruction: "Di lo siguiente con un acento mexicano natural de Ciudad de México, usando un tono casual, relajado y coloquial (chilango):"
  },
  { 
    id: 'fernanda_mx',
    apiVoiceName: VoiceName.Kore, 
    label: 'Fernanda', 
    gender: 'Female', 
    description: 'Suave y amable (México)',
    systemInstruction: "Di lo siguiente con un acento mexicano muy suave, amable, cálido y empático:"
  },
  { 
    id: 'ricardo_mx_pro',
    apiVoiceName: VoiceName.Fenrir, 
    label: 'Ricardo', 
    gender: 'Male', 
    description: 'Ejecutivo y serio (México)',
    systemInstruction: "Lee lo siguiente con voz de locutor corporativo mexicano, tono serio, profesional y con autoridad:"
  },
  { 
    id: 'lucia_mx_happy',
    apiVoiceName: VoiceName.Zephyr, 
    label: 'Lucía', 
    gender: 'Female', 
    description: 'Alegre y entusiasta (México)',
    systemInstruction: "Di lo siguiente con mucha energía, rapidez y un acento mexicano muy marcado y feliz:"
  },
  { 
    id: 'mateo_col',
    apiVoiceName: VoiceName.Puck, 
    label: 'Mateo (Col)', 
    gender: 'Male', 
    description: 'Amigable (Colombia)',
    systemInstruction: "Di lo siguiente con un acento colombiano natural de Bogotá, usando un tono casual:"
  },
  { 
    id: 'sofia_pro',
    apiVoiceName: VoiceName.Kore, 
    label: 'Sofía', 
    gender: 'Female', 
    description: 'Periodista (Neutra)',
    systemInstruction: "Lee lo siguiente con voz de presentadora de noticias profesional, español neutro y formal:"
  },
  { 
    id: 'sebastian_deep',
    apiVoiceName: VoiceName.Charon, 
    label: 'Sebastián', 
    gender: 'Male', 
    description: 'Narrador profundo',
    systemInstruction: "Narra lo siguiente con voz profunda y calmada, haciendo pausas dramáticas:"
  },
  { 
    id: 'valentina_soft',
    apiVoiceName: VoiceName.Kore, 
    label: 'Valentina', 
    gender: 'Female', 
    description: 'Muy suave y dulce',
    systemInstruction: "Di lo siguiente con una voz muy suave, lenta y dulce:"
  },
  { 
    id: 'diego_story',
    apiVoiceName: VoiceName.Puck, 
    label: 'Diego', 
    gender: 'Male', 
    description: 'Cuentacuentos',
    systemInstruction: "Cuenta lo siguiente como un cuentacuentos carismático, usando mucha expresividad:"
  }
];

export const DEFAULT_TEXT = `¡Qué onda! Soy tu asistente de voz en esta edición especial de México.
¡Órale! He aprendido a hablar como chilango, norteño y con un tono más formal también.
Selecciona una voz de la lista, escribe tu texto y dale a generar. ¡A darle átomos!`;

export const DEFAULT_VOICE_ID = 'carlos_mx';