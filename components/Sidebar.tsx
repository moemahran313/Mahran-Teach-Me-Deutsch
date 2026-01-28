
import React from 'react';
import { AppView } from '../types';
import { COLORS } from '../constants';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: AppView.CHAT, icon: 'fa-comments', label: 'Mahran Chat' },
    { id: AppView.VOCABULARY, icon: 'fa-book', label: 'Vocabulary' },
    { id: AppView.PRONUNCIATION, icon: 'fa-microphone', label: 'Pronunciation' },
    { id: AppView.GRAMMAR, icon: 'fa-graduation-cap', label: 'Grammar Guide' },
  ];

  return (
    <aside className="w-20 md:w-64 bg-[#1A202C] text-white flex flex-col transition-all duration-300 h-screen z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#ECC94B] flex items-center justify-center text-[#1A202C] font-bold text-xl">M</div>
        <span className="text-xl font-bold hidden md:block">Mahran</span>
      </div>
      
      <nav className="flex-1 px-4 mt-6">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl mb-2 transition-all group ${
              currentView === item.id 
                ? 'bg-[#ECC94B] text-[#1A202C]' 
                : 'hover:bg-white/10 text-gray-400'
            }`}
          >
            <i className={`fas ${item.icon} text-xl w-6`}></i>
            <span className="font-medium hidden md:block">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-white/10 hidden md:block">
        <div className="flex items-center gap-3">
          <img src="https://picsum.photos/40/40" alt="Avatar" className="rounded-full border-2 border-[#ECC94B]" />
          <div>
            <p className="text-sm font-semibold">Student Account</p>
            <p className="text-xs text-gray-400">Level: Beginner</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
