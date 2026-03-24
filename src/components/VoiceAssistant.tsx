import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { Mic, MicOff, Loader2, Volume2, VolumeX } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface VoiceAssistantProps {
  apiKey: string;
  onTranscription?: (text: string) => void;
  onTurnComplete?: () => void;
  onSessionStart?: () => void;
  onSessionEnd?: () => void;
  onCommand?: (command: string) => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ apiKey, onTranscription, onTurnComplete, onSessionStart, onSessionEnd, onCommand }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0);
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const audioQueue = useRef<Int16Array[]>([]);
  const isPlaying = useRef(false);

  const startSession = async () => {
    try {
      setIsConnecting(true);
      const ai = new GoogleGenAI({ apiKey });
      
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const source = audioContextRef.current.createMediaStreamSource(streamRef.current);
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      
      sessionRef.current = await ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-12-2025",
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            onSessionStart?.();
            source.connect(processorRef.current!);
            processorRef.current!.connect(audioContextRef.current!.destination);
            
            processorRef.current!.onaudioprocess = (e) => {
              if (isMuted) return;
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmData = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
              }
              
              const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
              sessionRef.current.sendRealtimeInput({
                audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
              });
              
              // Simple volume meter
              const sum = inputData.reduce((a, b) => a + b * b, 0);
              setVolume(Math.sqrt(sum / inputData.length) * 100);
            };
          },
          onmessage: async (message: any) => {
            // Handle Audio Output
            if (message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
              const base64Audio = message.serverContent.modelTurn.parts[0].inlineData.data;
              const binaryString = atob(base64Audio);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              const pcmData = new Int16Array(bytes.buffer);
              audioQueue.current.push(pcmData);
              if (!isPlaying.current) playNextInQueue();
            }
            
            // Handle User Speech Transcription
            // Checking multiple possible paths for transcription based on API variations
            const userTranscription = message.inputAudioTranscription?.text || 
                                     message.serverContent?.inputAudioTranscription?.text;
            if (userTranscription) {
              onTranscription?.(userTranscription);
            }
            
            // Handle Turn Completion
            if (message.serverContent?.turnComplete || message.serverContent?.modelTurn) {
              onTurnComplete?.();
            }

            if (message.serverContent?.interrupted) {
              audioQueue.current = [];
              isPlaying.current = false;
            }
          },
          onclose: () => stopSession(),
          onerror: (e) => {
            console.error("Live API Error:", e);
            stopSession();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {}, // Enable user speech transcription
          outputAudioTranscription: {}, // Enable model speech transcription
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: `You are CORTEX, a High-Precision Universal AI Computer Assistant. 
          You are robotic, efficient, and technically precise. 
          Your voice is the interface for a powerful autonomous agent system.
          When the user speaks, you analyze their intent. 
          If they ask to sort their desktop, acknowledge the command and inform them that CORTEX is initiating the reorganization sequence.
          Keep responses concise, professional, and focused on mission execution.`,
        },
      });
    } catch (error) {
      console.error("Failed to start voice session:", error);
      stopSession();
    }
  };

  const playNextInQueue = async () => {
    if (audioQueue.current.length === 0 || !audioContextRef.current) {
      isPlaying.current = false;
      return;
    }

    isPlaying.current = true;
    const pcmData = audioQueue.current.shift()!;
    const floatData = new Float32Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) {
      floatData[i] = pcmData[i] / 0x7FFF;
    }

    const buffer = audioContextRef.current.createBuffer(1, floatData.length, 16000);
    buffer.getChannelData(0).set(floatData);
    
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.onended = () => playNextInQueue();
    source.start();
  };

  const stopSession = () => {
    setIsActive(false);
    setIsConnecting(false);
    
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    audioQueue.current = [];
    isPlaying.current = false;
    onSessionEnd?.();
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={isActive ? stopSession : startSession}
        disabled={isConnecting}
        className={cn(
          "relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
          isActive ? "bg-red-500/20 text-red-500 border border-red-500/50" : "bg-[#00FF00]/10 text-[#00FF00] border border-[#00FF00]/30 hover:bg-[#00FF00]/20",
          isConnecting && "opacity-50"
        )}
      >
        {isConnecting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isActive ? (
          <Mic className="w-5 h-5" />
        ) : (
          <MicOff className="w-5 h-5" />
        )}
        
        {isActive && (
          <span className="absolute -inset-1 rounded-full border border-red-500/30 animate-ping" />
        )}
      </button>

      {isActive && (
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5 h-4 items-center">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-[#00FF00] rounded-full transition-all duration-100"
                style={{
                  height: `${Math.max(20, Math.min(100, volume * (1 + i * 0.2)))}%`,
                  opacity: 0.3 + (volume / 100) * 0.7
                }}
              />
            ))}
          </div>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="text-[#444] hover:text-[#00FF00] transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
};
