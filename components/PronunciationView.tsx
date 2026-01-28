
import React, { useState, useRef } from 'react';
import { PRONUNCIATION_PHRASES } from '../constants';
import { analyzePronunciation, getSpeechForText } from '../services/geminiService';
import { createPcmBlob, decodeBase64, decodeAudioBuffer } from '../services/audioService';
import { PronunciationResult } from '../types';

const PronunciationView: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PronunciationResult | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const chunksRef = useRef<Float32Array[]>([]);

  const phrase = PRONUNCIATION_PHRASES[currentIdx];

  const playTarget = async () => {
    const audioBase64 = await getSpeechForText(phrase);
    if (audioBase64) {
      const audioCtx = new AudioContext();
      const bytes = decodeBase64(audioBase64);
      const buffer = await decodeAudioBuffer(bytes, audioCtx);
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.start();
    }
  };

  const startRecording = async () => {
    setResult(null);
    chunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      const audioCtx = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;
      
      const source = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      
      processor.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        chunksRef.current.push(new Float32Array(input));
      };
      
      source.connect(processor);
      processor.connect(audioCtx.destination);
      processorRef.current = processor;
      
      setIsRecording(true);
    } catch (err) {
      console.error("Recording error:", err);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setIsAnalyzing(true);
    
    if (processorRef.current) processorRef.current.disconnect();
    if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(t => t.stop());
    
    // Combine chunks
    const totalLength = chunksRef.current.reduce((acc, c) => acc + c.length, 0);
    const combined = new Float32Array(totalLength);
    let offset = 0;
    for (const chunk of chunksRef.current) {
      combined.set(chunk, offset);
      offset += chunk.length;
    }
    
    const pcm = createPcmBlob(combined);
    
    try {
      const analysis = await analyzePronunciation(phrase, pcm.data);
      setResult(analysis);
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <header className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-[#1A202C]">Pronunciation Lab</h2>
        <p className="text-gray-500">Perfect your accent with real-time feedback from Mahran.</p>
      </header>

      <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 flex flex-col items-center">
        <div className="mb-4 px-4 py-1 bg-[#ECC94B]/20 text-[#1A202C] text-xs font-bold rounded-full uppercase">
          Phase {currentIdx + 1}
        </div>
        <h3 className="text-2xl md:text-4xl font-bold text-center mb-8">"{phrase}"</h3>
        
        <div className="flex gap-6 mb-12">
          <button 
            onClick={playTarget}
            className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-all shadow-sm"
            title="Listen to Mahran"
          >
            <i className="fas fa-volume-up text-2xl"></i>
          </button>
          
          <button 
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isAnalyzing}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl ${
              isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-[#1A202C] text-white hover:bg-gray-800'
            } disabled:opacity-50`}
          >
            {isRecording ? <i className="fas fa-stop text-2xl"></i> : <i className="fas fa-microphone text-3xl"></i>}
          </button>
          
          <button 
            onClick={() => { setCurrentIdx((prev) => (prev + 1) % PRONUNCIATION_PHRASES.length); setResult(null); }}
            className="w-16 h-16 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-gray-100 transition-all shadow-sm"
            title="Next Phrase"
          >
            <i className="fas fa-forward text-2xl"></i>
          </button>
        </div>

        {isRecording && (
          <div className="flex items-center gap-1 h-12 mb-8">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-1 bg-red-500 rounded-full wave-bar" style={{ animationDelay: `${i * 0.1}s` }}></div>
            ))}
          </div>
        )}

        {isAnalyzing && (
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#ECC94B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Mahran is listening closely...</p>
          </div>
        )}

        {result && (
          <div className="w-full mt-4 p-8 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="relative w-32 h-32 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200" />
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                    className={result.score > 80 ? 'text-green-500' : result.score > 50 ? 'text-yellow-500' : 'text-red-500'}
                    strokeDasharray={2 * Math.PI * 58}
                    strokeDashoffset={2 * Math.PI * 58 * (1 - result.score / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{result.score}</span>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Score</span>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-1">You said:</h4>
                  <p className="text-xl font-medium italic text-[#1A202C]">"{result.transcription}"</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-1">Mahran's Insight:</h4>
                  <p className="text-gray-700">{result.feedback}</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-1">Focus Areas:</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {result.phonemeAnalysis.split(',').map((p, i) => (
                      <span key={i} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-blue-600">
                        {p.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PronunciationView;
