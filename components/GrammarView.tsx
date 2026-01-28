
import React, { useState } from 'react';
import { GRAMMAR_TOPICS, COLORS } from '../constants';

const GrammarView: React.FC = () => {
  const [openTopic, setOpenTopic] = useState<string | null>('g1');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});

  const handleQuiz = (id: string, choice: string) => {
    setAnswers({ ...answers, [id]: choice });
    setShowFeedback({ ...showFeedback, [id]: true });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto w-full pb-20">
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-[#1A202C]">Interactive Grammar Guide</h2>
        <p className="text-gray-500">Simplify the complex rules of the German language.</p>
      </header>

      <div className="space-y-6">
        {GRAMMAR_TOPICS.map((topic) => (
          <div key={topic.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all">
            <button
              onClick={() => setOpenTopic(openTopic === topic.id ? null : topic.id)}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <i className="fas fa-book-open"></i>
                </div>
                <h3 className="text-xl font-bold text-left">{topic.title}</h3>
              </div>
              <i className={`fas fa-chevron-down transition-transform duration-300 ${openTopic === topic.id ? 'rotate-180' : ''}`}></i>
            </button>

            {openTopic === topic.id && (
              <div className="p-6 pt-0 border-t">
                <div className="prose prose-blue max-w-none mt-4 text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {topic.content}
                </div>

                <div className="mt-8 pt-8 border-t border-dashed">
                  <h4 className="font-bold text-sm uppercase tracking-widest text-[#ECC94B] mb-6">Mini Exercise</h4>
                  {topic.exercises.map((ex) => (
                    <div key={ex.id} className="bg-gray-50 rounded-2xl p-6">
                      <p className="text-lg font-medium mb-4">{ex.sentence}</p>
                      <div className="flex flex-wrap gap-3">
                        {ex.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleQuiz(ex.id, opt)}
                            className={`px-6 py-2 rounded-xl border-2 transition-all font-semibold ${
                              answers[ex.id] === opt 
                                ? opt === ex.answer 
                                  ? 'bg-green-500 border-green-500 text-white' 
                                  : 'bg-red-500 border-red-500 text-white'
                                : 'bg-white border-gray-200 hover:border-gray-400'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      
                      {showFeedback[ex.id] && (
                        <div className={`mt-4 p-4 rounded-xl flex gap-3 ${answers[ex.id] === ex.answer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          <i className={`fas ${answers[ex.id] === ex.answer ? 'fa-check-circle' : 'fa-times-circle'} mt-1`}></i>
                          <div>
                            <p className="font-bold">{answers[ex.id] === ex.answer ? 'Correct!' : 'Almost there!'}</p>
                            <p className="text-sm opacity-90">{ex.explanation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GrammarView;
