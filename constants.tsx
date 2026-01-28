
import React from 'react';
import { FlashcardData, GrammarTopic } from './types';

export const COLORS = {
  NAVY: '#1A202C',
  GOLD: '#ECC94B',
  WHITE: '#FFFFFF',
  MASC: '#3B82F6', // Blue
  FEM: '#EF4444',  // Red
  NEUT: '#10B981', // Green
};

export const MAHRAN_SYSTEM_PROMPT = `
You are Mahran, a friendly, patient, and professional German language tutor.
Your goal is to help students learn German through natural conversation, corrections, and cultural insights.
Guidelines:
1. Always respond as Mahran. Use a supportive and encouraging tone.
2. Mix German and English where appropriate for beginners, or stay in German for advanced learners (adjust to user's level).
3. Provide translations for complex German phrases in brackets.
4. Correct the user's grammar or word choice gently.
5. Keep responses concise but helpful.
`;

export const VOCAB_DATA: FlashcardData[] = [
  { id: 'v1', german: 'Der Apfel', english: 'The Apple', example: 'Der Apfel ist rot.', category: 'Food', gender: 'der' },
  { id: 'v2', german: 'Die Reise', english: 'The Journey', example: 'Gute Reise!', category: 'Travel', gender: 'die' },
  { id: 'v3', german: 'Das Brot', english: 'The Bread', example: 'Ich kaufe das Brot.', category: 'Food', gender: 'das' },
  { id: 'v4', german: 'Der Bahnhof', english: 'The Train Station', example: 'Wo ist der Bahnhof?', category: 'Travel', gender: 'der' },
  { id: 'v5', german: 'Der Alltag', english: 'The Daily Life', example: 'Das ist mein Alltag.', category: 'Daily Life', gender: 'der' },
  { id: 'v6', german: 'Die Milch', english: 'The Milk', example: 'Ich trinke Milch.', category: 'Food', gender: 'die' },
  { id: 'v7', german: 'Das Auto', english: 'The Car', example: 'Das Auto ist schnell.', category: 'Travel', gender: 'das' },
  { id: 'v8', german: 'Die Arbeit', english: 'The Work', example: 'Ich gehe zur Arbeit.', category: 'Daily Life', gender: 'die' },
];

export const PRONUNCIATION_PHRASES = [
  "Guten Tag, wie geht es Ihnen?",
  "Ich möchte ein Schnitzel bestellen.",
  "Wo ist die nächste U-Bahn-Station?",
  "Das Wetter in Deutschland ist heute sehr schön.",
  "Eichhörnchen",
  "Streichholzschächtelchen",
  "Übung macht den Meister.",
  "Entschuldigung, sprechen Sie Englisch?"
];

export const GRAMMAR_TOPICS: GrammarTopic[] = [
  {
    id: 'g1',
    title: 'Noun Genders (Der, Die, Das)',
    content: `In German, every noun has a gender: Masculine (der), Feminine (die), or Neuter (das). This doesn't always follow biological gender!
    - Blue: Masculine (der)
    - Red: Feminine (die)
    - Green: Neuter (das)`,
    exercises: [
      {
        id: 'ge1',
        sentence: "___ Hund spielt im Garten.",
        answer: "Der",
        options: ["Der", "Die", "Das"],
        explanation: "Hund (dog) is masculine in German."
      }
    ]
  },
  {
    id: 'g2',
    title: 'The Four Cases',
    content: `German uses cases to show the role of a noun in a sentence:
    1. Nominative (The subject)
    2. Accusative (The direct object)
    3. Dative (The indirect object)
    4. Genitive (Possession)`,
    exercises: [
      {
        id: 'ge2',
        sentence: "Ich sehe ___ Mann.",
        answer: "den",
        options: ["der", "den", "dem"],
        explanation: "This is accusative case. 'Der Mann' becomes 'den Mann'."
      }
    ]
  },
  {
    id: 'g3',
    title: 'Verb Conjugation (Present)',
    content: `Verbs change based on the subject. Most verbs end in -en.
    - Ich (I) -> -e
    - Du (You) -> -st
    - Er/Sie/Es -> -t
    - Wir (We) -> -en`,
    exercises: [
      {
        id: 'ge3',
        sentence: "Du ___ Deutsch.",
        answer: "lernst",
        options: ["lerne", "lernt", "lernst"],
        explanation: "For 'du', the verb ending is -st."
      }
    ]
  }
];
