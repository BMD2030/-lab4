import React from 'react';
import { Logo } from './Logo';
import { ChevronDown, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section id="home" className="relative h-screen flex flex-col justify-center items-center overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-labPrimary/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-labSecondary/10 rounded-full blur-[100px] animate-pulse delay-700"></div>

      <div className="relative z-10 text-center flex flex-col items-center animate-fade-in-up">
        <div className="transform hover:scale-105 transition-transform duration-500 mb-8">
            {/* Enlarged Logo for Hero */}
            <div className="scale-150 sm:scale-[2.5] mb-6">
                <Logo />
            </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-wide mt-12 sm:mt-16">
          ذكاء يصنع المحتوى
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-8 font-light tracking-widest uppercase">
          AI Creates Content
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <a 
            href="#create" 
            className="px-8 py-3 bg-gradient-to-r from-labPrimary to-purple-600 rounded-full text-white font-semibold shadow-lg shadow-purple-900/50 hover:shadow-purple-700/70 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            ابدأ الآن
          </a>
          <a 
            href="#channels" 
            className="px-8 py-3 bg-transparent border border-white/20 hover:bg-white/5 rounded-full text-white font-semibold transition-all duration-300 backdrop-blur-sm"
          >
            اكتشف المزيد
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 animate-bounce">
        <a href="#channels" className="text-gray-500 hover:text-white transition-colors">
          <ChevronDown className="w-8 h-8" />
        </a>
      </div>
    </section>
  );
};