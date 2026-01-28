
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import VocabularyView from './components/VocabularyView';
import PronunciationView from './components/PronunciationView';
import GrammarView from './components/GrammarView';
import { AppView } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.CHAT);

  const renderView = () => {
    switch (currentView) {
      case AppView.CHAT:
        return <ChatView />;
      case AppView.VOCABULARY:
        return <VocabularyView />;
      case AppView.PRONUNCIATION:
        return <PronunciationView />;
      case AppView.GRAMMAR:
        return <GrammarView />;
      default:
        return <ChatView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Decorative Header for Mobile */}
        <div className="md:hidden p-4 bg-[#1A202C] text-white flex items-center justify-center font-bold">
          MAHRAN GERMAN
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="h-full">
            {renderView()}
          </div>
        </div>
      </main>

      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-[#ECC94B]/5 -z-10 blur-3xl"></div>
      <div className="absolute bottom-[-5%] left-[10%] w-[30%] h-[30%] rounded-full bg-blue-500/5 -z-10 blur-3xl"></div>
    </div>
  );
};

export default App;
