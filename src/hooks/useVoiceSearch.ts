import { useState, useEffect, useRef, useCallback } from 'react';

export type VoiceLanguage = 'hi-IN' | 'en-IN';

export interface UseVoiceSearchResult {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  voiceLang: VoiceLanguage;
  setVoiceLang: (lang: VoiceLanguage) => void;
  startListening: (onResult?: (text: string) => void) => void;
  stopListening: () => void;
  toggleListening: (onResult?: (text: string) => void) => void;
  resetTranscript: () => void;
}

export function useVoiceSearch(initialLang: VoiceLanguage = 'hi-IN'): UseVoiceSearchResult {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [voiceLang, setVoiceLang] = useState<VoiceLanguage>(initialLang);

  const recognitionRef = useRef<any>(null);
  const callbackRef = useRef<((text: string) => void) | null>(null);

  // Check browser support on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSpeech = Boolean(
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      );
      setIsSupported(hasSpeech);
    }
  }, []);

  // Clean up recognition instance when unmounting
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore cleanup abort errors
        }
      }
    };
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore already stopped error
      }
    }
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  const startListening = useCallback(
    (onResult?: (text: string) => void) => {
      setError(null);
      callbackRef.current = onResult || null;

      if (typeof window === 'undefined') return;

      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognitionClass) {
        setError('Speech recognition is not supported in this browser. Please try Google Chrome or Microsoft Edge.');
        return;
      }

      // Stop any existing instance
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }

      try {
        const recognition = new SpeechRecognitionClass();
        recognition.lang = voiceLang;
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
          setInterimTranscript('');
        };

        recognition.onresult = (event: any) => {
          let currentInterim = '';
          let currentFinal = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const item = event.results[i];
            const text = item[0].transcript;
            if (item.isFinal) {
              currentFinal += text;
            } else {
              currentInterim += text;
            }
          }

          if (currentInterim) {
            setInterimTranscript(currentInterim);
          }

          if (currentFinal) {
            // Clean trailing full stops/periods often added by speech recognition
            const cleaned = currentFinal.trim().replace(/\.+$/, '');
            setTranscript(cleaned);
            setInterimTranscript('');
            if (callbackRef.current) {
              callbackRef.current(cleaned);
            }
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          if (event.error === 'not-allowed') {
            setError('Microphone permission was denied. Please allow microphone access in your browser settings.');
          } else if (event.error === 'no-speech') {
            setError('No speech was detected. Please try again.');
          } else if (event.error === 'network') {
            setError('Network error occurred during speech recognition.');
          } else if (event.error !== 'aborted') {
            setError(`Voice search error: ${event.error}`);
          }
          setIsListening(false);
          setInterimTranscript('');
        };

        recognition.onend = () => {
          setIsListening(false);
          setInterimTranscript('');
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err: any) {
        console.error('Error starting SpeechRecognition:', err);
        setError('Could not initialize microphone. Please check permissions.');
        setIsListening(false);
      }
    },
    [voiceLang]
  );

  const toggleListening = useCallback(
    (onResult?: (text: string) => void) => {
      if (isListening) {
        stopListening();
      } else {
        startListening(onResult);
      }
    },
    [isListening, startListening, stopListening]
  );

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    error,
    voiceLang,
    setVoiceLang,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript,
  };
}
