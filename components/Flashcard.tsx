
import React, { useState } from 'react';
import { FlashcardData } from '../types';
import { COLORS } from '../constants';

interface FlashcardProps {
  data: FlashcardData;
  onSpeak: (text: string) => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ data, onSpeak }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const genderColor = data.gender === 'der' ? COLORS.MASC : data.gender === 'die' ? COLORS.FEM : data.gender === 'das' ? COLORS.NEUT : 'gray';

  return (
    <div 
      className="perspective-1000 w-full h-80 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full transition-transform duration-500 preserve-3d shadow-xl rounded-2xl ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-white rounded-2xl p-8 flex flex-col items-center justify-center border-t-8" style={{ borderTopColor: genderColor }}>
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">{data.category}</span>
          <h3 className="text-4xl font-bold text-center mb-6">{data.german}</h3>
          <div className="flex gap-4">
            <button 
              onClick={(e) => { e.stopPropagation(); onSpeak(data.german); }}
              className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#ECC94B] transition-colors"
            >
              <i className="fas fa-volume-up text-gray-600"></i>
            </button>
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <i className="fas fa-redo text-gray-400"></i>
            </div>
          </div>
          <p className="mt-8 text-sm text-gray-400 italic">Tap to see translation</p>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#1A202C] text-white rounded-2xl p-8 flex flex-col items-center justify-center">
          <h3 className="text-3xl font-bold mb-4">{data.english}</h3>
          <div className="w-12 h-1 bg-[#ECC94B] mb-6"></div>
          <p className="text-center text-lg text-gray-300">"{data.example}"</p>
          <p className="mt-8 text-sm text-gray-500 uppercase tracking-widest">Tap to flip back</p>
        </div>

      </div>
    </div>
  );
};

export default Flashcard;
