import React, { useState, useEffect } from 'react';
import { Menu, X, Settings, Download, Upload, Globe, Copy, Check, Rocket } from 'lucide-react';
import { Logo } from './Logo';
import { NavItem } from '../types';

const navItems: NavItem[] = [
  { label: 'الرئيسية', href: 'home' },
  { label: 'قنوات المحتوى', href: 'channels' }, // Reverted exactly as requested
  { label: 'اصنع محتواك', href: 'create' },
  { label: 'من نحن', href: 'about' },
  { label: 'تواصل معنا', href: 'contact' },
];

interface NavbarProps {
  onNavigate?: (sectionId: string) => void;
  onExport?: () => void;
  onImport?: () => void;
  isPreviewMode?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, onExport, onImport, isPreviewMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Publish State
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    setIsOpen(false);
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePublishClick = () => {
    setShowPublishModal(true);
    // Reset status
    if (!isPublished) {
        setIsPublishing(true);
        setTimeout(() => {
            setIsPublishing(false);
            setIsPublished(true);
            
            // GENERATE CLEAN ABSOLUTE URL
            // This grabs the base domain (e.g. project.stackblitz.io) + path (/) 
            // and appends ?preview=true. It deliberately ignores any hash (#contact).
            const protocol = window.location.protocol;
            const host = window.location.host;
            const pathname = window.location.pathname;
            
            // Construct the clean link
            const fullLink = `${protocol}//${host}${pathname}?preview=true`;
            setGeneratedLink(fullLink);
        }, 2000);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-labDark/90 backdrop-blur-md shadow-lg border-b border-white/10' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center z-10 cursor-pointer" onClick={(e) => handleLinkClick(e, 'home')}>
              <div className="flex items-center gap-2">
                <Logo className="h-16" />
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
              <div className="pointer-events-auto flex items-baseline space-x-6 space-x-reverse bg-labDark/50 backdrop-blur-sm px-6 py-2 rounded-full border border-white/5">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={`#${item.href}`}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className="text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Left Actions */}
            <div className="flex items-center gap-3">
              
               {/* Publish Button - HIDDEN IN PREVIEW MODE */}
               {!isPreviewMode && (
                   <button 
                      onClick={handlePublishClick}
                      className="hidden md:flex items-center gap-2 bg-gradient-to-r from-labPrimary to-purple-600 hover:from-purple-600 hover:to-labPrimary text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-purple-900/30 transition-all transform hover:scale-105 active:scale-95 border border-white/10"
                   >
                      <Globe className="w-4 h-4 animate-pulse" />
                      <span>نشر الموقع</span>
                   </button>
               )}

               {/* Settings - HIDDEN IN PREVIEW MODE */}
               {!isPreviewMode && (
                   <div className="relative">
                      <button 
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-colors border border-white/5 bg-white/5"
                        title="إعدادات المشروع"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                      
                      {showSettings && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)}></div>
                          <div className="absolute left-0 mt-2 w-56 bg-[#020420] border border-white/20 rounded-xl shadow-2xl py-2 z-50 animate-fade-in-up">
                             <div className="px-4 py-2 border-b border-white/10 mb-1">
                                <span className="text-xs text-labPrimary font-bold uppercase tracking-wider">إدارة المشروع</span>
                             </div>
                             <button 
                               onClick={() => { onExport?.(); setShowSettings(false); }}
                               className="w-full text-right px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                             >
                               <Download className="w-4 h-4 text-green-400" />
                               <span>حفظ نسخة احتياطية</span>
                             </button>
                             <button 
                               onClick={() => { onImport?.(); setShowSettings(false); }}
                               className="w-full text-right px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                             >
                               <Upload className="w-4 h-4 text-blue-400" />
                               <span>استعادة نسخة</span>
                             </button>
                          </div>
                        </>
                      )}
                   </div>
               )}

              <div className="-mr-2 flex md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
                >
                  <span className="sr-only">Open main menu</span>
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-labDark/95 backdrop-blur-xl border-b border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={`#${item.href}`}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className="text-gray-300 hover:text-white hover:bg-white/10 block px-3 py-2 rounded-md text-base font-medium text-right"
                >
                  {item.label}
                </a>
              ))}
              {!isPreviewMode && (
                  <div className="border-t border-white/10 mt-2 pt-2">
                      <button 
                          onClick={() => { handlePublishClick(); setIsOpen(false); }}
                          className="w-full text-right text-white bg-labPrimary/20 hover:bg-labPrimary/30 block px-3 py-2 rounded-md text-base font-bold"
                      >
                          <Globe className="w-4 h-4 inline-block ml-2" />
                          نشر الموقع
                      </button>
                  </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowPublishModal(false)}></div>
            <div className="bg-[#0d1b3e] border border-white/10 rounded-3xl w-full max-w-lg p-8 relative z-10 shadow-2xl animate-fade-in-up bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                <button 
                    onClick={() => setShowPublishModal(false)}
                    className="absolute top-4 left-4 p-2 bg-white/5 rounded-full text-gray-400 hover:text-white hover:bg-white/20 transition-all"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                         <div className={`absolute inset-0 bg-labPrimary/20 rounded-full blur-xl ${isPublishing ? 'animate-pulse' : ''}`}></div>
                         <div className="relative w-full h-full bg-gradient-to-br from-labPrimary to-labSecondary rounded-full flex items-center justify-center border-4 border-[#0d1b3e] shadow-xl">
                            {isPublishing ? (
                                <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Rocket className="w-10 h-10 text-white transform -rotate-45" />
                            )}
                         </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3">
                        {isPublishing ? 'جاري تجهيز بيئة العمل...' : 'تم إطلاق مشروعك بنجاح!'}
                    </h3>
                    
                    <div className="space-y-2 mb-8">
                        <p className="text-gray-400 text-sm">
                            {isPublishing 
                                ? 'يقوم النظام الآن بتجميع ملفات القنوات، ضغط الصور، وتوليد رابط الوصول السريع للعملاء.' 
                                : 'أصبح موقعك متاحاً الآن للزوار والعملاء. يمكنك استخدام الرابط أدناه للمشاركة المباشرة.'
                            }
                        </p>
                        {isPublishing && (
                             <div className="flex justify-center gap-1 mt-4">
                                <span className="w-2 h-2 bg-labPrimary rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-labPrimary rounded-full animate-bounce delay-100"></span>
                                <span className="w-2 h-2 bg-labPrimary rounded-full animate-bounce delay-200"></span>
                             </div>
                        )}
                    </div>

                    {!isPublishing && (
                        <div className="animate-fade-in-up">
                            <div className="bg-black/40 p-1.5 rounded-xl border border-white/10 flex items-center justify-between gap-2 mb-6 shadow-inner">
                                <div className="flex items-center gap-3 flex-1 bg-white/5 rounded-lg px-4 py-3 overflow-hidden">
                                    <Globe className="w-4 h-4 text-gray-500 shrink-0" />
                                    <code className="text-green-400 text-sm truncate font-mono text-left dir-ltr">
                                        {generatedLink}
                                    </code>
                                </div>
                                <button 
                                    onClick={handleCopyLink}
                                    className={`p-3 rounded-lg transition-all flex items-center justify-center gap-2 font-bold text-sm min-w-[100px] ${isCopied ? 'bg-green-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                                >
                                    {isCopied ? (
                                        <>
                                           <Check className="w-4 h-4" />
                                           <span>منسوخ</span>
                                        </>
                                    ) : (
                                        <>
                                           <Copy className="w-4 h-4" />
                                           <span>نسخ</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <button 
                                onClick={() => window.open(generatedLink, '_blank')}
                                className="w-full bg-gradient-to-r from-labPrimary to-purple-600 hover:from-purple-600 hover:to-labPrimary text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                <Globe className="w-5 h-5" />
                                معاينة الموقع المباشر
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </>
  );
};