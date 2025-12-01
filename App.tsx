import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { CreateContent } from './components/CreateContent';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Dashboard } from './components/Dashboard';
import { ChannelView } from './components/ChannelView';
import { Channel, AppLabels } from './types';
import { LayoutDashboard } from 'lucide-react';

// Data Version - Bumping to 3.0 to FORCE visual repair
const DATA_VERSION = '3.0';

// Default Labels
const DEFAULT_LABELS: AppLabels = {
  interactiveSection: 'أنشطة تفاعلية',
  gamificationSection: 'أنشطة تلعيبية',
  mcq: 'اختيار من متعدد',
  truefalse: 'صح وخطأ',
  matching: 'مطابقة',
  flashcard: 'بطاقات تعليمية',
  wheel: 'عجلة الحظ',
  puzzle: 'البزل',
  memory: 'الذاكرة',
  riddle: 'الألغاز',
  blast: 'انطلق'
};

// Initial Mock Data - High Quality Logos
const INITIAL_CHANNELS: Channel[] = [
  {
    id: '5',
    title: 'Academy STC',
    description: 'تطوير المهارات الرقمية',
    color: '#4F008C', // STC Purple
    lastUpdated: Date.now(),
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/STC_Logo.svg/1024px-STC_Logo.svg.png',
    logoConfig: { scale: 0.8, x: 0, y: 0 },
    activities: []
  },
  {
    id: '4',
    title: 'jahez | جاهز',
    description: 'خدمات التوصيل - أسرع مما تتخيل',
    color: '#C62828', // Red
    lastUpdated: Date.now(),
    logoUrl: 'https://pbs.twimg.com/profile_images/1454728560249298946/N0yyZfK__400x400.jpg',
    logoConfig: { scale: 1.1, x: 0, y: 0 },
    activities: []
  },
  {
    id: '3',
    title: 'سلامة المرضى | التوعية الصحية',
    description: 'المركز السعودي لسلامة المرضى',
    color: '#42A5F5', // Light Blue
    lastUpdated: Date.now(),
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Ministry_of_Health_%28Saudi_Arabia%29_Logo.svg/1200px-Ministry_of_Health_%28Saudi_Arabia%29_Logo.svg.png',
    logoConfig: { scale: 0.8, x: 0, y: 0 },
    activities: []
  },
  {
    id: '2',
    title: 'الجامعة الإلكترونية السعودية',
    description: 'مستقبل التعليم الرقمي',
    color: '#1565C0', // Blue
    lastUpdated: Date.now(),
    logoUrl: 'https://upload.wikimedia.org/wikipedia/ar/7/73/Saudi_Electronic_University_logo.png',
    logoConfig: { scale: 0.9, x: 0, y: 0 },
    activities: []
  },
  {
    id: '1',
    title: 'بوابة الدرعية | تاريخنا والجذور',
    description: 'يوم التأسيس - تراثنا فخرنا',
    color: '#3E2723', // Brown
    lastUpdated: Date.now(),
    logoUrl: 'https://cdn-icons-png.flaticon.com/512/3003/3003733.png',
    logoConfig: { scale: 0.8, x: 0, y: 0 },
    activities: [
        {
          id: 'dg_activity_1',
          type: 'mcq',
          category: 'interactive',
          title: 'تحدي التاريخ السعودي',
          settings: { timer: 60, soundEffect: 'suspense' },
          content: {
            questions: [
               {
                 id: 'q1',
                 questionText: 'في أي عام تأسست الدولة السعودية الأولى؟',
                 options: ['1727م', '1932م', '1902م', '1818م'],
                 correctOptionIndex: 0,
                 timer: 30
               }
            ]
          }
        }
    ]
  },
  {
    id: '10',
    title: 'أكاديمية طويق',
    description: 'تعلم البرمجة والتقنيات',
    color: '#311B92', // Deep Purple
    lastUpdated: Date.now(),
    logoUrl: 'https://tuwaiq.edu.sa/img/logo/logo.svg',
    logoConfig: { scale: 0.9, x: 0, y: 0 },
    activities: []
  },
  {
    id: '9',
    title: 'الأول SAB',
    description: 'شريكك المصرفي',
    color: '#B71C1C', // Red
    lastUpdated: Date.now(),
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/86/SABB_Bank_Logo.svg/1200px-SABB_Bank_Logo.svg.png',
    logoConfig: { scale: 1, x: 0, y: 0 },
    activities: []
  },
  {
    id: '8',
    title: 'أرامكو aramco',
    description: 'الطاقة والريادة',
    color: '#558B2F', // Green
    lastUpdated: Date.now(),
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Saudi_Aramco_Logo.svg/1200px-Saudi_Aramco_Logo.svg.png',
    logoConfig: { scale: 0.8, x: 0, y: 0 },
    activities: []
  },
  {
    id: '6',
    title: 'مدارس ابن رشد',
    description: 'جيل يبني المستقبل',
    color: '#263238', // Dark Grey
    lastUpdated: Date.now(),
    logoUrl: 'https://ibnroshd.edu.sa/wp-content/uploads/2021/08/logo.png',
    logoConfig: { scale: 1, x: 0, y: 0 },
    activities: []
  },
  {
    id: '7',
    title: 'بلبل العربية',
    description: 'تطبيق تعليم اللغة العربية',
    color: '#5D4037', // Brown
    lastUpdated: Date.now(),
    logoUrl: 'https://cdn-icons-png.flaticon.com/512/3204/3204868.png', // Placeholder for Bulbul
    logoConfig: { scale: 1, x: 0, y: 0 },
    activities: []
  },
];

function App() {
  const [view, setView] = useState<'landing' | 'dashboard' | 'channel'>('landing');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Robust Preview Mode Detection
  const [isPreviewMode, setIsPreviewMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('preview') === 'true' || sessionStorage.getItem('lab4_preview_active') === 'true';
  });

  useEffect(() => {
     const params = new URLSearchParams(window.location.search);
     if (params.get('preview') === 'true') {
         setIsPreviewMode(true);
         sessionStorage.setItem('lab4_preview_active', 'true');
     }
  }, []);

  // Initialize Labels from LocalStorage
  const [labels, setLabels] = useState<AppLabels>(() => {
    try {
      const savedLabels = localStorage.getItem('lab4_labels');
      return savedLabels ? { ...DEFAULT_LABELS, ...JSON.parse(savedLabels) } : DEFAULT_LABELS;
    } catch (e) {
      return DEFAULT_LABELS;
    }
  });

  // Initialize from LocalStorage with SMART VISUAL REPAIR Logic
  const [channels, setChannels] = useState<Channel[]>(() => {
    try {
      const saved = localStorage.getItem('lab4_channels');
      const savedVersion = localStorage.getItem('lab4_data_version');
      
      let loadedData: Channel[] = saved ? JSON.parse(saved) : [];
      
      // CRITICAL FIX: If version mismatch, FORCE REPAIR default channels visual identity
      if (savedVersion !== DATA_VERSION) {
          console.log("Migrating data to version " + DATA_VERSION);
          
          // 1. Repair Default Channels (IDs 1-10)
          // We keep the USER'S activities, but reset the LOGO/TITLE/COLOR to match the design.
          const repairedDefaults = INITIAL_CHANNELS.map(initCh => {
              const userCh = loadedData.find((ch: any) => ch.id === initCh.id);
              if (userCh) {
                  return {
                      ...initCh, // Force new visual identity (Logo, Title, Color)
                      activities: userCh.activities, // Preserve user content
                      lastUpdated: Date.now()
                  };
              }
              return initCh; // Use default if user deleted it or it doesn't exist
          });

          // 2. Preserve Custom User Channels (IDs that are not in defaults)
          const customChannels = loadedData.filter((ch: any) => 
              !INITIAL_CHANNELS.find(ic => ic.id === ch.id)
          );

          const finalData = [...repairedDefaults, ...customChannels];
          
          localStorage.setItem('lab4_data_version', DATA_VERSION);
          localStorage.setItem('lab4_channels', JSON.stringify(finalData));
          return finalData;
      }
      
      return loadedData.length > 0 ? loadedData : INITIAL_CHANNELS;
    } catch (e) {
      console.error("Failed to load channels", e);
      return INITIAL_CHANNELS;
    }
  });

  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);

  // Debounced Persistence Effect for Channels
  useEffect(() => {
    const timer = setTimeout(() => {
        try {
            localStorage.setItem('lab4_channels', JSON.stringify(channels));
        } catch (e) {
            console.warn("LocalStorage Error (Quota?)", e);
        }
    }, 1000); 

    return () => clearTimeout(timer);
  }, [channels]);

  // Persistence Effect for Labels
  useEffect(() => {
    localStorage.setItem('lab4_labels', JSON.stringify(labels));
  }, [labels]);

  const handleUpdateLabels = (newLabels: AppLabels) => {
    setLabels(newLabels);
  };

  // --- Project Backup Logic ---
  const handleExportProject = () => {
    const backupData = {
        channels,
        labels,
        version: DATA_VERSION
    };
    const dataStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lab4-project-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const importedData = JSON.parse(event.target?.result as string);
            
            const channelsToImport = Array.isArray(importedData) ? importedData : importedData.channels;
            const labelsToImport = !Array.isArray(importedData) && importedData.labels ? importedData.labels : labels;

            if (Array.isArray(channelsToImport)) {
                if (window.confirm("تحذير: استعادة النسخة ستقوم باستبدال جميع القنوات. هل أنت متأكد؟")) {
                    const sanitizedImport = channelsToImport.map((c: any) => ({
                        ...c,
                        logoConfig: { scale: 1, x: 0, y: 0, ...(c.logoConfig || {}) },
                        activities: c.activities || [],
                        lastUpdated: Date.now()
                    }));
                    
                    setChannels(sanitizedImport);
                    setLabels(labelsToImport);
                    
                    localStorage.setItem('lab4_channels', JSON.stringify(sanitizedImport)); 
                    localStorage.setItem('lab4_labels', JSON.stringify(labelsToImport));
                    localStorage.setItem('lab4_data_version', DATA_VERSION);
                    
                    alert("تم استعادة مشروعك بنجاح!");
                    if (view === 'channel') {
                        setView('landing');
                        setSelectedChannelId(null);
                    }
                }
            } else {
                alert("الملف المختار غير صالح.");
            }
        } catch (err) {
            console.error(err);
            alert("حدث خطأ أثناء قراءة ملف النسخة الاحتياطية.");
        }
    };
    reader.readAsText(file);
    e.target.value = ''; 
  };


  const handleUpdateChannel = (updatedChannel: Channel) => {
    const stampedChannel = { ...updatedChannel, lastUpdated: Date.now() };
    setChannels(prev => prev.map(c => c.id === stampedChannel.id ? stampedChannel : c));
  };

  const handleAddChannel = (newChannel: Channel) => {
    const stampedChannel = { ...newChannel, lastUpdated: Date.now() };
    setChannels(prev => [...prev, stampedChannel]);
  };

  const handleDeleteChannel = (channelId: string) => {
    setChannels(prev => prev.filter(c => c.id !== channelId));
  };

  const navigateToChannel = (channel: Channel) => {
    setSelectedChannelId(channel.id);
    setView('channel');
    window.scrollTo(0, 0);
  };

  const handleNavigation = (sectionId: string) => {
    if (view !== 'landing') {
        setView('landing');
        setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.scrollTo(0, 0);
            }
        }, 100);
    } else {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollTo(0, 0);
        }
    }
  };

  const activeChannelData = selectedChannelId 
    ? channels.find(c => c.id === selectedChannelId) 
    : null;

  return (
    <div className="min-h-screen bg-labDark text-white font-cairo selection:bg-labPrimary selection:text-white flex flex-col">
      {view !== 'dashboard' && (
        <Navbar 
            onNavigate={handleNavigation} 
            onExport={handleExportProject} 
            onImport={handleImportClick}
            isPreviewMode={isPreviewMode}
        />
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImportFile} 
        className="hidden" 
        accept=".json" 
      />

      {view === 'landing' && (
        <main className="flex-1">
          <Hero />
          {/* Key added here to force re-render when channels update */}
          <Features 
            key={channels.map(c => c.lastUpdated).join('-')}
            channels={channels}
            onSelectChannel={navigateToChannel}
          />
          <CreateContent />
          <About />
          <Contact />
        </main>
      )}

      {view === 'landing' && !isPreviewMode && (
        <button 
          onClick={() => setView('dashboard')}
          className="fixed bottom-8 left-8 z-50 bg-labPrimary hover:bg-labSecondary text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 flex items-center gap-2 group"
          title="Go to Dashboard"
        >
          <LayoutDashboard className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">لوحة التحكم</span>
        </button>
      )}

      {view === 'dashboard' && (
        <Dashboard 
          channels={channels}
          labels={labels}
          onUpdateChannel={handleUpdateChannel}
          onAddChannel={handleAddChannel}
          onDeleteChannel={handleDeleteChannel}
          onUpdateLabels={handleUpdateLabels}
          onSelectChannel={navigateToChannel}
          onBack={() => setView('landing')}
        />
      )}

      {view === 'channel' && activeChannelData && (
        <main className="flex-1">
            <ChannelView 
              key={`${activeChannelData.id}-${activeChannelData.lastUpdated}`}
              channel={activeChannelData}
              labels={labels}
              onBack={() => setView('landing')}
            />
        </main>
      )}

      {view !== 'dashboard' && <Footer />}
    </div>
  );
}

export default App;