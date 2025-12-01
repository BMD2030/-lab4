import React from 'react';

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  icon: React.ComponentType<any>;
  href: string;
  label: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

export type ActivityType = 'mcq' | 'truefalse' | 'matching' | 'flashcard';
export type GameType = 'wheel' | 'puzzle' | 'memory' | 'riddle' | 'blast';

export interface AppLabels {
  // Section Headers
  interactiveSection: string;
  gamificationSection: string;
  
  // Interactive Activities
  mcq: string;
  truefalse: string;
  matching: string;
  flashcard: string;

  // Gamification Activities
  wheel: string;
  puzzle: string;
  memory: string;
  riddle: string;
  blast: string;
}

export interface MCQQuestion {
  id: string;
  questionText: string;
  questionImage?: string; // Optional image
  options: string[]; // Array of 4 strings
  correctOptionIndex: number; // 0-3
  timer: number; // Seconds for this specific question
}

export interface Activity {
  id: string;
  type: ActivityType | GameType;
  category: 'interactive' | 'gamification';
  title: string;
  settings: {
    timer: number; // Global fallback timer
    soundEffect?: 'suspense' | 'speed' | 'fear' | 'motivation';
  };
  content?: {
    questions?: MCQQuestion[];
    // Other content types can be added here
  }; 
}

export interface Channel {
  id: string;
  title: string;
  description: string; 
  color: string; 
  logoUrl?: string; 
  mainImageUrl?: string; 
  lastUpdated?: number; // KEY FIELD FOR SYNC
  logoConfig: {
    scale: number;
    x: number;
    y: number;
  };
  activities: Activity[];
}