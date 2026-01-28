
import React, { useState } from 'react';
import { VOCAB_DATA } from '../constants';
import Flashcard from './Flashcard';
import { getSpeechForText } from '../services/geminiService';
import { decodeBase64, decodeAudioBuffer } from '../services/audioService';

const VocabularyView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Food' | 'Travel' | 'Daily Life'>('All');
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredVocab = activeCategory === 'All' 
    ? VOCAB_DATA 
    : VOCAB_DATA.filter(v => v.category === activeCategory);

  const currentItem = filteredVocab[currentIndex % filteredVocab.length];

  const handleSpeak = async (text: string) => {
    try {
      const audioBase64 = await getSpeechForText(text);
      if (audioBase64) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const bytes = decodeBase64(audioBase64);
        const buffer = await decodeAudioBuffer(bytes, audioCtx);
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start();
      }
    } catch (err) {
      console.error("TTS Failed:", err);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-[#1A202C]">Visual Flashcards</h2>
        <p className="text-gray-500">Master essential phrases with Mahran's guidance.</p>
      </header>

      <div className="flex flex-wrap gap-2 mb-10">
        {['All', 'Food', 'Travel', 'Daily Life'].map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat as any); setCurrentIndex(0); }}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeCategory === cat ? 'bg-[#1A202C] text-white shadow-lg' : 'bg-white border text-gray-600 hover:border-[#ECC94B]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="max-w-md mx-auto relative group">
        <Flashcard data={currentItem} onSpeak={handleSpeak} />
        
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 hidden lg:block">
          <button 
            onClick={() => setCurrentIndex(prev => (prev - 1 + filteredVocab.length) % filteredVocab.length)}
            className="w-12 h-12 rounded-full bg-white border shadow-md hover:bg-[#ECC94B] transition-all flex items-center justify-center"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
        </div>
        
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 hidden lg:block">
          <button 
            onClick={() => setCurrentIndex(prev => (prev + 1) % filteredVocab.length)}
            className="w-12 h-12 rounded-full bg-white border shadow-md hover:bg-[#ECC94B] transition-all flex items-center justify-center"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        <div className="flex justify-center gap-4 mt-8 lg:hidden">
          <button 
            onClick={() => setCurrentIndex(prev => (prev - 1 + filteredVocab.length) % filteredVocab.length)}
            className="flex-1 bg-white border p-4 rounded-xl shadow-sm active:bg-[#ECC94B]"
          >
            <i className="fas fa-chevron-left mr-2"></i> Previous
          </button>
          <button 
            onClick={() => setCurrentIndex(prev => (prev + 1) % filteredVocab.length)}
            className="flex-1 bg-white border p-4 rounded-xl shadow-sm active:bg-[#ECC94B]"
          >
            Next <i className="fas fa-chevron-right ml-2"></i>
          </button>
        </div>
      </div>

      <div className="mt-12 text-center text-sm text-gray-400">
        Card {currentIndex + 1} of {filteredVocab.length} in {activeCategory}
      </div>
    </div>
  );
};

export default VocabularyView;
