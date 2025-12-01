import React from 'react';
import { Logo } from './Logo';
import { Twitter, Instagram, Linkedin, Youtube, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#010214] border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
          
          {/* Logo & Description */}
          <div className="text-center md:text-right">
            <div className="mb-4 flex justify-center md:justify-start">
               <Logo className="h-10" />
            </div>
            <p className="text-gray-500 max-w-xs mx-auto md:mx-0">
              ذكاء يصنع المحتوى. منصتك الأولى للجيل القادم من صناعة المحتوى الرقمي.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex gap-8 text-sm text-gray-400">
            <a href="#home" className="hover:text-labPrimary transition-colors">الرئيسية</a>
            <a href="#about" className="hover:text-labPrimary transition-colors">من نحن</a>
            <a href="#create" className="hover:text-labPrimary transition-colors">خدماتنا</a>
            <a href="#contact" className="hover:text-labPrimary transition-colors">سياسة الخصوصية</a>
          </div>

          {/* Socials */}
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-labPrimary hover:text-white transition-all">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-labSecondary hover:text-white transition-all">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-4">
          
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-semibold text-gray-300">المملكة العربية السعودية - الرياض</span>
            <div className="flex items-center gap-2">
               <Mail className="w-4 h-4" />
               <a href="mailto:LAB4@AI.COM" className="hover:text-labPrimary">LAB4@AI.COM</a>
            </div>
          </div>

          <div className="text-center md:text-left">
            &copy; {new Date().getFullYear()} Lab4 AI. جميع الحقوق محفوظة.
          </div>
          
        </div>
      </div>
    </footer>
  );
};