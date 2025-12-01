import React, { useState, useRef, useEffect } from 'react';
import { Channel, Activity, ActivityType, GameType, MCQQuestion, AppLabels } from '../types';
import { ChannelCard } from './ChannelCard';
import { 
  Plus, Save, Image as ImageIcon, ArrowLeft, Trash2, 
  Gamepad2, CheckSquare, Puzzle, Brain, Layers, Settings, X, Upload, CheckCircle, Clock, Volume2, AlertTriangle,
  Download, Share, Trophy, Edit3, LayoutGrid, List, HelpCircle, Palette, Disc, GripVertical, Smile, Zap, Target, BookOpen, ToggleLeft, Copy, HelpCircle as RiddleIcon, Rocket, Type, Move
} from 'lucide-react';

interface DashboardProps {
  channels: Channel[];
  labels: AppLabels;
  onUpdateChannel: (updatedChannel: Channel) => void;
  onAddChannel: (newChannel: Channel) => void;
  onDeleteChannel: (channelId: string) => void;
  onUpdateLabels: (labels: AppLabels) => void;
  onSelectChannel: (channel: Channel) => void;
  onBack: () => void;
}

type DashboardView = 'list' | 'channel-settings' | 'content-editor';

// Vibrant Wheel Colors
const WHEEL_COLORS = [
  '#EC4899', // Pink
  '#8B5CF6', // Violet
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#6366F1', // Indigo
  '#14B8A6'  // Teal
];

export const Dashboard: React.FC<DashboardProps> = ({ 
  channels, 
  labels,
  onUpdateChannel, 
  onAddChannel, 
  onDeleteChannel,
  onUpdateLabels,
  onSelectChannel, 
  onBack 
}) => {
  const [currentView, setCurrentView] = useState<DashboardView>('list');
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  
  // State for content category and selected type
  const [contentType, setContentType] = useState<'interactive' | 'gamification'>('interactive');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<ActivityType | GameType>('mcq');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saveSuccess, setSaveSuccess] = useState(false); 
  const [publishSuccess, setPublishSuccess] = useState(false);
  
  // Activity Editor State
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(-1); // -1 means adding new
  
  // Label Editor State
  const [showLabelEditor, setShowLabelEditor] = useState(false);
  const [tempLabels, setTempLabels] = useState<AppLabels>(labels);

  // Local state for editing a question/wheel config
  const [currentQuestion, setCurrentQuestion] = useState<MCQQuestion>({
    id: '',
    questionText: '',
    options: ['', '', '', ''],
    correctOptionIndex: 0,
    timer: 15
  });

  // --- Helpers ---
  const processImage = (file: File, callback: (result: string) => void) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 300; 
            const scaleSize = MAX_WIDTH / img.width;
            const finalWidth = img.width < MAX_WIDTH ? img.width : MAX_WIDTH;
            const finalHeight = img.width < MAX_WIDTH ? img.height : img.height * scaleSize;
            canvas.width = finalWidth;
            canvas.height = finalHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
            callback(canvas.toDataURL('image/jpeg', 0.6));
        };
    };
  };

  // --- Core Actions ---

  const handleEditChannel = (channel: Channel) => {
    // Ensure logoConfig exists with defaults
    const completeChannel = {
        ...channel,
        logoConfig: {
            scale: 1,
            x: 0,
            y: 0,
            ...(channel.logoConfig || {})
        }
    };
    setActiveChannel(completeChannel);
    setCurrentView('channel-settings');
  };

  const handleCreateChannel = () => {
    const newChannel: Channel = {
      id: Date.now().toString(),
      title: 'قناة جديدة',
      description: '',
      color: '#4E342E',
      lastUpdated: Date.now(),
      logoConfig: { scale: 1, x: 0, y: 0 },
      activities: []
    };
    onAddChannel(newChannel);
    setActiveChannel(newChannel);
    setCurrentView('channel-settings');
  };

  const handleSaveChanges = () => {
    if (activeChannel) {
      onUpdateChannel({ ...activeChannel, lastUpdated: Date.now() });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const handleDeleteActiveChannel = () => {
    if (activeChannel && window.confirm('هل أنت متأكد من حذف هذه القناة؟')) {
      onDeleteChannel(activeChannel.id);
      setActiveChannel(null);
      setCurrentView('list');
    }
  };

  // --- Activity Actions ---

  const handleAddActivity = (type: ActivityType | GameType, title: string) => {
    if (!activeChannel) return;

    // Determine category based on type
    const isGamification = ['wheel', 'puzzle', 'memory', 'riddle', 'blast'].includes(type);
    const category = isGamification ? 'gamification' : 'interactive';

    // Initialize Wheel with default fixed segments 1-6
    const initialQuestions = type === 'wheel' ? [{
        id: Date.now().toString(),
        questionText: 'سؤال 1',
        options: ['1', '2', '3', '4', '5', '6'],
        correctOptionIndex: 0, // Default to Number 1
        timer: 0
    }] : [];

    const newActivity: Activity = {
      id: Date.now().toString(),
      type,
      category,
      title: title,
      settings: { timer: 60, soundEffect: 'motivation' },
      content: { questions: initialQuestions }
    };

    const updatedChannel = {
      ...activeChannel,
      lastUpdated: Date.now(),
      activities: [...activeChannel.activities, newActivity]
    };
    
    setActiveChannel(updatedChannel);
    onUpdateChannel(updatedChannel);
    
    // Open Editor Immediately
    setEditingActivityId(newActivity.id);
    if (type === 'wheel') {
        setCurrentQuestion(initialQuestions[0]);
        setSelectedQuestionIndex(0);
    }
    else {
        resetCurrentQuestion();
        setSelectedQuestionIndex(-1);
    }
  };

  const handleDeleteActivity = (activityId: string) => {
    if (!activeChannel) return;
    if (window.confirm('تأكيد الحذف: هل أنت متأكد من حذف هذا النشاط نهائياً؟')) {
        const updatedActivities = activeChannel.activities.filter(a => a.id !== activityId);
        const updatedChannel = { ...activeChannel, activities: updatedActivities, lastUpdated: Date.now() };
        setActiveChannel(updatedChannel);
        onUpdateChannel(updatedChannel);
        if (editingActivityId === activityId) setEditingActivityId(null);
    }
  };

  // --- Label Editing Actions ---
  const handleOpenLabelEditor = () => {
      setTempLabels(labels);
      setShowLabelEditor(true);
  };

  const handleSaveLabels = () => {
      onUpdateLabels(tempLabels);
      setShowLabelEditor(false);
  };

  // --- Wheel/Question Editor Logic ---

  const resetCurrentQuestion = (isWheel = false) => {
    setCurrentQuestion({
        id: Date.now().toString(),
        questionText: '',
        options: isWheel ? ['1', '2', '3', '4', '5', '6'] : ['', '', '', ''],
        correctOptionIndex: 0,
        timer: 15
    });
    setSelectedQuestionIndex(-1);
  };

  const handleSaveQuestion = () => {
    if (!activeChannel || !editingActivityId) return;
    if (!currentQuestion.questionText && !currentQuestion.questionImage) return alert("يرجى إضافة نص السؤال");
    
    const activityIndex = activeChannel.activities.findIndex(a => a.id === editingActivityId);
    if (activityIndex === -1) return;

    const updatedActivities = [...activeChannel.activities];
    const activity = { ...updatedActivities[activityIndex] };
    const questions = activity.content?.questions ? [...activity.content.questions] : [];
    
    const isWheel = activity.type === 'wheel';
    // Ensure wheel options are fixed
    const questionToSave = {
        ...currentQuestion,
        options: isWheel ? ['1', '2', '3', '4', '5', '6'] : currentQuestion.options
    };

    if (selectedQuestionIndex >= 0) {
        // Update existing
        questions[selectedQuestionIndex] = questionToSave;
    } else {
        // Add new
        questions.push({ ...questionToSave, id: Date.now().toString() });
    }
    
    activity.content = { ...activity.content, questions };
    updatedActivities[activityIndex] = activity;

    const updatedChannel = { ...activeChannel, lastUpdated: Date.now(), activities: updatedActivities };
    setActiveChannel(updatedChannel);
    onUpdateChannel(updatedChannel);
    
    if (isWheel) {
        // For wheel, we might want to stay to edit another round, or reset
        resetCurrentQuestion(true);
    } else {
        resetCurrentQuestion(false);
    }
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 2000);
  };

  const handleSelectQuestionToEdit = (idx: number, activity: Activity) => {
      if (activity.content?.questions?.[idx]) {
          setCurrentQuestion(activity.content.questions[idx]);
          setSelectedQuestionIndex(idx);
      }
  };

  const handleDeleteQuestion = (idx: number) => {
     if (!activeChannel || !editingActivityId) return;
     const activityIndex = activeChannel.activities.findIndex(a => a.id === editingActivityId);
     const updatedActivities = [...activeChannel.activities];
     const activity = updatedActivities[activityIndex];
     
     if (activity.content?.questions) {
         activity.content.questions = activity.content.questions.filter((_, i) => i !== idx);
         updatedActivities[activityIndex] = activity;
         const updatedChannel = { ...activeChannel, activities: updatedActivities, lastUpdated: Date.now() };
         setActiveChannel(updatedChannel);
         onUpdateChannel(updatedChannel);
         if (selectedQuestionIndex === idx) {
             resetCurrentQuestion(activity.type === 'wheel');
         }
     }
  };

  // --- RENDERERS ---

  const renderList = () => (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
            <h1 className="text-3xl font-bold text-white">لوحة التحكم</h1>
            <p className="text-gray-400 text-sm mt-1">إدارة قنوات المحتوى</p>
        </div>
        <div className="flex gap-3">
             <button onClick={handleOpenLabelEditor} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm transition-colors border border-white/10 flex items-center gap-2">
                <Type className="w-4 h-4" /> تحرير المسميات
             </button>
             <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm transition-colors border border-white/10 flex items-center gap-2">
                <Upload className="w-4 h-4" /> استعادة
             </button>
             <button onClick={handleCreateChannel} className="px-6 py-2 bg-labSecondary hover:bg-pink-600 text-white rounded-xl font-bold shadow-lg shadow-pink-900/20 flex items-center gap-2 transition-all">
                <Plus className="w-5 h-5" /> قناة جديدة
             </button>
             <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={(e) => { /* Import logic */ }} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {channels.map((channel) => (
          <div key={`${channel.id}-${channel.lastUpdated}`} className="relative group">
             <ChannelCard 
                channel={channel}
                onClick={() => handleEditChannel(channel)} 
                isDashboard={true}
             />
             <div className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleEditChannel(channel);
                    }}
                    className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm"
                >
                    <Settings className="w-4 h-4" />
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLabelEditor = () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowLabelEditor(false)}></div>
          <div className="bg-[#0d1b3e] border border-white/10 rounded-2xl w-full max-w-2xl p-6 relative z-10 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Type className="w-5 h-5 text-labPrimary" />
                      تحرير مسميات الألعاب والقوائم
                  </h3>
                  <button onClick={() => setShowLabelEditor(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sections */}
                  <div className="col-span-full mb-2">
                      <h4 className="text-sm font-bold text-labPrimary uppercase tracking-wider mb-4 border-b border-white/10 pb-2">عناوين الأقسام الرئيسية</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                              <label className="block text-gray-400 text-xs mb-1">الأنشطة التفاعلية</label>
                              <input type="text" value={tempLabels.interactiveSection} onChange={(e) => setTempLabels({...tempLabels, interactiveSection: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                          </div>
                          <div>
                              <label className="block text-gray-400 text-xs mb-1">الأنشطة التلعيبية</label>
                              <input type="text" value={tempLabels.gamificationSection} onChange={(e) => setTempLabels({...tempLabels, gamificationSection: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                          </div>
                      </div>
                  </div>

                  {/* Interactive */}
                  <div className="space-y-4">
                      <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider border-b border-white/10 pb-2">الألعاب التفاعلية</h4>
                      <div>
                          <label className="block text-gray-400 text-xs mb-1">MCQ</label>
                          <input type="text" value={tempLabels.mcq} onChange={(e) => setTempLabels({...tempLabels, mcq: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                      </div>
                      <div>
                          <label className="block text-gray-400 text-xs mb-1">True/False</label>
                          <input type="text" value={tempLabels.truefalse} onChange={(e) => setTempLabels({...tempLabels, truefalse: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                      </div>
                      <div>
                          <label className="block text-gray-400 text-xs mb-1">Matching</label>
                          <input type="text" value={tempLabels.matching} onChange={(e) => setTempLabels({...tempLabels, matching: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                      </div>
                      <div>
                          <label className="block text-gray-400 text-xs mb-1">Flashcards</label>
                          <input type="text" value={tempLabels.flashcard} onChange={(e) => setTempLabels({...tempLabels, flashcard: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                      </div>
                  </div>

                  {/* Gamification */}
                  <div className="space-y-4">
                      <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider border-b border-white/10 pb-2">الألعاب التلعيبية</h4>
                      <div>
                          <label className="block text-gray-400 text-xs mb-1">Wheel</label>
                          <input type="text" value={tempLabels.wheel} onChange={(e) => setTempLabels({...tempLabels, wheel: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                      </div>
                      <div>
                          <label className="block text-gray-400 text-xs mb-1">Puzzle</label>
                          <input type="text" value={tempLabels.puzzle} onChange={(e) => setTempLabels({...tempLabels, puzzle: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                      </div>
                      <div>
                          <label className="block text-gray-400 text-xs mb-1">Memory</label>
                          <input type="text" value={tempLabels.memory} onChange={(e) => setTempLabels({...tempLabels, memory: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                      </div>
                      <div>
                          <label className="block text-gray-400 text-xs mb-1">Riddle</label>
                          <input type="text" value={tempLabels.riddle} onChange={(e) => setTempLabels({...tempLabels, riddle: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                      </div>
                      <div>
                          <label className="block text-gray-400 text-xs mb-1">Blast</label>
                          <input type="text" value={tempLabels.blast} onChange={(e) => setTempLabels({...tempLabels, blast: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                      </div>
                  </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-end gap-3">
                  <button onClick={() => setShowLabelEditor(false)} className="px-4 py-2 text-gray-300 hover:text-white">إلغاء</button>
                  <button onClick={handleSaveLabels} className="px-6 py-2 bg-labPrimary hover:bg-purple-600 text-white rounded-lg font-bold flex items-center gap-2">
                      <Save className="w-4 h-4" /> حفظ التغييرات
                  </button>
              </div>
          </div>
      </div>
  );

  const renderChannelSettings = () => {
      if (!activeChannel) return null;
      return (
          <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                      <button onClick={() => setCurrentView('list')} className="p-2 hover:bg-white/10 rounded-full text-white"><ArrowLeft /></button>
                      <h2 className="text-2xl font-bold text-white">{activeChannel.title}</h2>
                  </div>
                  <div className="flex gap-2">
                      <button onClick={handleDeleteActiveChannel} className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors flex items-center gap-2"><Trash2 className="w-4 h-4" /> حذف القناة</button>
                      <button onClick={handleSaveChanges} className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold flex items-center gap-2">{saveSuccess ? <CheckCircle className="w-4 h-4"/> : <Save className="w-4 h-4"/>} <span>حفظ</span></button>
                  </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                          <label className="block text-gray-300 mb-2">اسم القناة</label>
                          <input type="text" value={activeChannel.title} onChange={(e) => setActiveChannel({...activeChannel, title: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-labPrimary outline-none" />
                      </div>
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                          <label className="block text-gray-300 mb-2">وصف القناة</label>
                          <textarea value={activeChannel.description} onChange={(e) => setActiveChannel({...activeChannel, description: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-labPrimary outline-none h-24" />
                      </div>
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl border border-white/20" style={{backgroundColor: activeChannel.color}}></div>
                          <div className="flex-1">
                              <label className="block text-gray-300 mb-2">لون القناة</label>
                              <input type="color" value={activeChannel.color} onChange={(e) => setActiveChannel({...activeChannel, color: e.target.value})} className="w-full bg-transparent h-10 cursor-pointer" />
                          </div>
                      </div>
                      <button onClick={() => { handleSaveChanges(); setCurrentView('content-editor'); }} className="w-full py-4 bg-labPrimary hover:bg-purple-600 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 text-lg">
                          <Layers className="w-5 h-5" /> إدارة المحتوى والأنشطة
                      </button>
                  </div>
                  
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10 h-fit">
                      <h3 className="text-white font-bold mb-4 text-center">معاينة الشعار</h3>
                      <div className="flex justify-center mb-6">
                          {/* PREVIEW CONTAINER - NOW SYNCED WITH CHANNEL CARD STYLES */}
                          <div 
                            className="relative w-40 h-40 rounded-full border-4 border-white/10 overflow-hidden flex items-center justify-center bg-white shadow-xl"
                          >
                              {activeChannel.logoUrl ? (
                                  <img 
                                    src={activeChannel.logoUrl} 
                                    alt="Logo" 
                                    className="object-contain transition-transform" 
                                    style={{ 
                                        width: '65%', // EXACTLY AS CHANNEL CARD
                                        height: '65%', // EXACTLY AS CHANNEL CARD
                                        transform: `scale(${activeChannel.logoConfig.scale}) translate(${activeChannel.logoConfig.x}px, ${activeChannel.logoConfig.y}px)` 
                                    }} 
                                  />
                              ) : <span className="text-gray-400 text-4xl font-bold">{activeChannel.title[0]}</span>}
                          </div>
                      </div>
                      <input type="file" id="logo-upload" className="hidden" onChange={(e) => e.target.files?.[0] && processImage(e.target.files[0], (url) => setActiveChannel({...activeChannel, logoUrl: url}))} />
                      <button onClick={() => document.getElementById('logo-upload')?.click()} className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center justify-center gap-2 mb-4">
                          <Upload className="w-4 h-4" /> رفع شعار
                      </button>
                      
                      <div className="space-y-4 pt-4 border-t border-white/10">
                          {/* Logo Position Controls */}
                          <div className="grid grid-cols-2 gap-3">
                              <div>
                                  <label className="text-xs text-gray-400 block mb-1 flex items-center gap-1"><Move className="w-3 h-3" /> أفقي (X)</label>
                                  <input 
                                    type="number" 
                                    value={activeChannel.logoConfig.x} 
                                    onChange={(e) => setActiveChannel({...activeChannel, logoConfig: {...activeChannel.logoConfig, x: parseInt(e.target.value) || 0}})} 
                                    className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-white text-xs"
                                  />
                              </div>
                              <div>
                                  <label className="text-xs text-gray-400 block mb-1 flex items-center gap-1"><Move className="w-3 h-3 rotate-90" /> عمودي (Y)</label>
                                  <input 
                                    type="number" 
                                    value={activeChannel.logoConfig.y} 
                                    onChange={(e) => setActiveChannel({...activeChannel, logoConfig: {...activeChannel.logoConfig, y: parseInt(e.target.value) || 0}})} 
                                    className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-white text-xs"
                                  />
                              </div>
                          </div>
                          <div>
                              <label className="text-xs text-gray-400 block mb-1">حجم الشعار</label>
                              <input type="range" min="0.5" max="2" step="0.1" value={activeChannel.logoConfig.scale} onChange={(e) => setActiveChannel({...activeChannel, logoConfig: {...activeChannel.logoConfig, scale: parseFloat(e.target.value)}})} className="w-full accent-labPrimary" />
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  const renderContentEditor = () => {
    if (!activeChannel) return null;

    // --- ACTIVITY EDITOR VIEW ---
    if (editingActivityId) {
        const activity = activeChannel.activities.find(a => a.id === editingActivityId);
        if (!activity) { setEditingActivityId(null); return null; }
        
        const isWheel = activity.type === 'wheel';

        return (
            <div className="max-w-6xl mx-auto h-[calc(100vh-120px)] flex flex-col">
                <div className="flex items-center justify-between mb-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setEditingActivityId(null)} className="p-2 hover:bg-white/10 rounded-full text-white"><ArrowLeft /></button>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{isWheel ? 'محرر عجلة الحظ' : 'محرر الأسئلة'}</h2>
                            <p className="text-gray-400 text-sm">{activity.title}</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        <button 
                            onClick={() => handleDeleteActivity(activity.id)}
                            className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white rounded-xl font-bold transition-all flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">حذف النشاط</span>
                        </button>
                        
                        {/* Only needed to save Activity Metadata (Title), questions are saved individually */}
                        <button 
                            onClick={handleSaveChanges} 
                            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold flex items-center gap-2 border border-white/10"
                        >
                            {saveSuccess ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />} {saveSuccess ? 'تم الحفظ' : 'حفظ العنوان'}
                        </button>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
                    {/* PREVIEW / LIST COLUMN */}
                    <div className="lg:col-span-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col overflow-hidden relative">
                        {isWheel ? (
                             <div className="flex flex-col h-full">
                                <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                                    <h3 className="text-white font-bold">جولات العجلة</h3>
                                    <button 
                                        onClick={() => { resetCurrentQuestion(true); }}
                                        className="text-xs bg-labPrimary px-2 py-1 rounded text-white"
                                    >
                                        + إضافة جولة
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                    {activity.content?.questions?.map((q, idx) => (
                                        <div 
                                            key={idx} 
                                            onClick={() => handleSelectQuestionToEdit(idx, activity)}
                                            className={`p-3 rounded-lg flex justify-between items-center group cursor-pointer border ${selectedQuestionIndex === idx ? 'bg-labPrimary/20 border-labPrimary' : 'bg-black/20 border-transparent hover:bg-white/5'}`}
                                        >
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="text-white text-sm font-bold truncate">الجولة {idx + 1}</span>
                                                <span className="text-gray-400 text-xs truncate">{q.questionText}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                 <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded border border-green-500/30">
                                                     الإجابة: {q.correctOptionIndex + 1}
                                                 </span>
                                                 <button onClick={(e) => { e.stopPropagation(); handleDeleteQuestion(idx); }} className="text-red-500 opacity-0 group-hover:opacity-100 p-1"><Trash2 className="w-4 h-4"/></button>
                                            </div>
                                        </div>
                                    ))}
                                    {activity.content?.questions?.length === 0 && (
                                        <div className="text-center text-gray-500 text-sm py-4">أضف سؤال لتبدأ</div>
                                    )}
                                </div>
                                {/* Mini Wheel Preview */}
                                <div className="h-48 border-t border-white/10 bg-black/30 flex items-center justify-center relative overflow-hidden">
                                      <div className="relative w-32 h-32 rounded-full border-2 border-white/20 shadow-xl overflow-hidden"
                                            style={{ 
                                            background: `conic-gradient(${['1','2','3','4','5','6'].map((_, i) => `${WHEEL_COLORS[i % WHEEL_COLORS.length]} 0deg ${360/6}deg`).join(', ')})`,
                                            }}>
                                            {['1','2','3','4','5','6'].map((opt, i) => (
                                                <div key={i} className="absolute top-0 left-1/2 w-0.5 h-1/2 origin-bottom flex justify-center pt-2" style={{ transform: `translateX(-50%) rotate(${(i * (360/6)) + (360/6/2)}deg)` }}>
                                                    <span className="text-white font-bold text-[8px] writing-vertical-rl rotate-180 drop-shadow-md">{opt}</span>
                                                </div>
                                            ))}
                                    </div>
                                    <div className="absolute top-1/2 left-1/2 w-2 h-4 bg-white -translate-x-1/2 -translate-y-[140%] clip-path-polygon-[0%_0%,_100%_0%,_50%_100%] z-20 shadow-xl"></div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col h-full">
                                <div className="p-4 border-b border-white/10 bg-white/5"><h3 className="text-white font-bold">قائمة الأسئلة</h3></div>
                                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                    {activity.content?.questions?.map((q, idx) => (
                                        <div 
                                            key={idx} 
                                            onClick={() => handleSelectQuestionToEdit(idx, activity)}
                                            className={`p-3 rounded-lg flex justify-between items-center group cursor-pointer border ${selectedQuestionIndex === idx ? 'bg-labPrimary/20 border-labPrimary' : 'bg-black/20 border-transparent hover:bg-white/5'}`}
                                        >
                                            <span className="text-white text-sm truncate w-4/5">{idx + 1}. {q.questionText}</span>
                                            <button onClick={(e) => { e.stopPropagation(); handleDeleteQuestion(idx); }} className="text-red-500 opacity-0 group-hover:opacity-100 p-1"><Trash2 className="w-4 h-4"/></button>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => { resetCurrentQuestion(false); }} className="m-2 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm flex justify-center items-center gap-2">
                                    <Plus className="w-4 h-4"/> سؤال جديد
                                </button>
                            </div>
                        )}
                    </div>

                    {/* EDITOR COLUMN */}
                    <div className="lg:col-span-8 bg-white/5 rounded-2xl border border-white/10 p-6 overflow-y-auto">
                        <div className="mb-6 bg-black/20 p-4 rounded-xl border border-white/5">
                            <label className="text-gray-400 text-xs font-bold uppercase mb-2 block">عنوان النشاط العام</label>
                            <div className="flex items-center gap-3">
                                <Edit3 className="w-5 h-5 text-labPrimary" />
                                <input 
                                    type="text" 
                                    value={activity.title} 
                                    onChange={(e) => {
                                        const updatedActs = activeChannel.activities.map(a => a.id === activity.id ? {...a, title: e.target.value} : a);
                                        setActiveChannel({...activeChannel, activities: updatedActs});
                                    }}
                                    className="bg-transparent text-xl font-bold text-white w-full outline-none border-b border-white/20 focus:border-labPrimary pb-1"
                                />
                            </div>
                        </div>

                        {isWheel ? (
                            <div className="space-y-6 animate-fade-in-up">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Disc className="w-5 h-5 text-labSecondary" />
                                        {selectedQuestionIndex === -1 ? 'إضافة جولة جديدة' : `تعديل الجولة ${selectedQuestionIndex + 1}`}
                                    </h3>
                                    {selectedQuestionIndex !== -1 && (
                                        <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded border border-yellow-500/30">وضع التعديل</span>
                                    )}
                                </div>

                                <div className="bg-black/20 p-5 rounded-xl border border-white/5">
                                    <label className="block text-gray-300 mb-2 font-bold text-sm">السؤال / المهمة المطلوبة</label>
                                    <input 
                                        type="text"
                                        value={currentQuestion.questionText}
                                        onChange={(e) => setCurrentQuestion({...currentQuestion, questionText: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-labPrimary"
                                        placeholder="مثال: أدر العجلة واحصل على الرقم 4 لتربح!"
                                    />
                                </div>

                                <div className="bg-gradient-to-br from-purple-900/40 to-black/40 p-5 rounded-xl border border-white/10 shadow-lg">
                                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                        <Target className="w-5 h-5 text-green-400" /> 
                                        حدد الرقم الفائز (الإجابة الصحيحة)
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-4">يجب على اللاعب الحصول على هذا الرقم في العجلة للفوز بالنقطة.</p>
                                    
                                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                        {['1', '2', '3', '4', '5', '6'].map((num, idx) => (
                                            <button 
                                                key={idx}
                                                onClick={() => setCurrentQuestion({...currentQuestion, correctOptionIndex: idx})}
                                                className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all border-2 ${currentQuestion.correctOptionIndex === idx ? 'bg-green-500 border-green-400 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)] scale-105' : 'bg-black/40 border-white/5 text-gray-400 hover:bg-white/5 hover:border-white/20'}`}
                                            >
                                                <span className="text-2xl font-black">{num}</span>
                                                {currentQuestion.correctOptionIndex === idx && <CheckCircle className="w-4 h-4" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={handleSaveQuestion}
                                    className="w-full py-4 bg-labPrimary hover:bg-purple-600 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 text-lg transition-all"
                                >
                                    {publishSuccess ? <CheckCircle className="w-5 h-5"/> : <Save className="w-5 h-5"/>}
                                    {selectedQuestionIndex === -1 ? 'إضافة الجولة' : 'حفظ التعديلات'}
                                </button>
                            </div>
                        ) : (
                            // MCQ Editor content
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-white">
                                        {selectedQuestionIndex === -1 ? 'إضافة سؤال جديد' : `تعديل السؤال ${selectedQuestionIndex + 1}`}
                                    </h3>
                                </div>

                                <div className="bg-black/20 p-5 rounded-xl border border-white/5">
                                    <label className="block text-gray-300 mb-2">نص السؤال</label>
                                    <textarea value={currentQuestion.questionText} onChange={(e) => setCurrentQuestion({...currentQuestion, questionText: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white h-24 focus:border-labPrimary outline-none"></textarea>
                                </div>
                                <div className="space-y-3">
                                    {currentQuestion.options.map((opt, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <button onClick={() => setCurrentQuestion({...currentQuestion, correctOptionIndex: idx})} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${currentQuestion.correctOptionIndex === idx ? 'bg-green-500 border-green-500' : 'border-gray-500'}`}>{currentQuestion.correctOptionIndex === idx && <CheckCircle className="w-4 h-4 text-white" />}</button>
                                            <input type="text" value={opt} onChange={(e) => { const opts = [...currentQuestion.options]; opts[idx] = e.target.value; setCurrentQuestion({...currentQuestion, options: opts}); }} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" placeholder={`الخيار ${idx + 1}`} />
                                        </div>
                                    ))}
                                </div>
                                <button onClick={handleSaveQuestion} className="w-full py-3 bg-labPrimary text-white rounded-xl font-bold mt-4 flex justify-center gap-2">
                                    {selectedQuestionIndex === -1 ? <Plus className="w-5 h-5"/> : <Save className="w-5 h-5" />}
                                    {selectedQuestionIndex === -1 ? 'إضافة السؤال' : 'حفظ التعديلات'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // --- ACTIVITY LIST VIEW ---
    const filteredActivities = activeChannel.activities.filter(a => a.type === selectedTypeFilter);

    // Sidebar Items Definition (Now using props.labels)
    const interactiveItems = [
        { type: 'mcq' as ActivityType, label: labels.mcq, icon: CheckSquare },
        { type: 'matching' as ActivityType, label: labels.matching, icon: ToggleLeft },
        { type: 'truefalse' as ActivityType, label: labels.truefalse, icon: CheckCircle },
        { type: 'flashcard' as ActivityType, label: labels.flashcard, icon: BookOpen },
    ];

    const gamificationItems = [
        { type: 'wheel' as GameType, label: labels.wheel, icon: Disc },
        { type: 'puzzle' as GameType, label: labels.puzzle, icon: Puzzle },
        { type: 'memory' as GameType, label: labels.memory, icon: Brain },
        { type: 'riddle' as GameType, label: labels.riddle, icon: RiddleIcon },
        { type: 'blast' as GameType, label: labels.blast, icon: Rocket },
    ];

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-120px)] flex flex-col">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => setCurrentView('channel-settings')} className="p-2 hover:bg-white/10 rounded-full text-white"><ArrowLeft /></button>
                <h2 className="text-2xl font-bold text-white">إدارة المحتوى</h2>
            </div>

            <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                {/* Sidebar */}
                <div className="col-span-3 bg-black/20 border-l border-white/5 flex flex-col p-4 overflow-y-auto custom-scrollbar">
                    
                    {/* Toggle Buttons (Replaces previous Headers) */}
                    <div className="flex flex-col gap-3 mb-6">
                        <button
                            onClick={() => { setContentType('interactive'); setSelectedTypeFilter('mcq'); }}
                            className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${contentType === 'interactive' ? 'bg-labPrimary text-white shadow-lg shadow-purple-900/20' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                        >
                            <div className="flex items-center gap-3">
                                <Zap className="w-5 h-5" />
                                <span className="font-bold text-lg">{labels.interactiveSection}</span>
                            </div>
                            {contentType === 'interactive' && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                        </button>

                        <button
                            onClick={() => { setContentType('gamification'); setSelectedTypeFilter('wheel'); }}
                            className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${contentType === 'gamification' ? 'bg-labSecondary text-white shadow-lg shadow-pink-900/20' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                        >
                            <div className="flex items-center gap-3">
                                <Smile className="w-5 h-5" />
                                <span className="font-bold text-lg">{labels.gamificationSection}</span>
                            </div>
                            {contentType === 'gamification' && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                        </button>
                    </div>

                    {/* Dynamic List based on selection */}
                    <div className="space-y-1 animate-fade-in">
                        <div className="px-2 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-white/5 pb-2">
                            {contentType === 'interactive' ? 'القائمة التفاعلية' : 'قائمة الألعاب'}
                        </div>
                        
                        {(contentType === 'interactive' ? interactiveItems : gamificationItems).map(item => (
                            <button 
                                key={item.type} 
                                onClick={() => { 
                                    setSelectedTypeFilter(item.type); 
                                }} 
                                className={`w-full text-right px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-3 transition-colors ${
                                    selectedTypeFilter === item.type 
                                    ? (contentType === 'interactive' ? 'bg-labPrimary/20 text-white border border-labPrimary/20' : 'bg-labSecondary/20 text-white border border-labSecondary/20')
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <item.icon className={`w-4 h-4 ${selectedTypeFilter === item.type ? (contentType === 'interactive' ? 'text-labPrimary' : 'text-labSecondary') : ''}`} />
                                {item.label}
                            </button>
                        ))}
                    </div>

                </div>

                {/* Main List */}
                <div className="col-span-9 bg-[#0d1b3e]/50 flex flex-col">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                             {/* Dynamic Icon */}
                             {['mcq','truefalse','matching','flashcard'].includes(selectedTypeFilter) ? <CheckSquare className="w-5 h-5 text-gray-400" /> : selectedTypeFilter === 'blast' ? <Rocket className="w-5 h-5 text-gray-400" /> : <Gamepad2 className="w-5 h-5 text-gray-400" />}
                             
                             {/* Dynamic Title */}
                             {selectedTypeFilter === 'mcq' && labels.mcq}
                             {selectedTypeFilter === 'matching' && labels.matching}
                             {selectedTypeFilter === 'truefalse' && labels.truefalse}
                             {selectedTypeFilter === 'flashcard' && labels.flashcard}
                             
                             {selectedTypeFilter === 'wheel' && labels.wheel}
                             {selectedTypeFilter === 'puzzle' && labels.puzzle}
                             {selectedTypeFilter === 'memory' && labels.memory}
                             {selectedTypeFilter === 'riddle' && labels.riddle}
                             {selectedTypeFilter === 'blast' && labels.blast}
                        </h3>
                        <button onClick={() => handleAddActivity(selectedTypeFilter, `نشاط جديد`)} className="bg-labPrimary px-4 py-2 rounded-lg text-white font-bold flex items-center gap-2 hover:bg-purple-600 transition-colors">
                            <Plus className="w-4 h-4" /> إنشاء جديد
                        </button>
                    </div>
                    
                    <div className="p-6 grid grid-cols-2 gap-4 overflow-y-auto">
                        {filteredActivities.length === 0 ? (
                            <div className="col-span-2 flex flex-col items-center justify-center py-20 text-gray-500 border-2 border-dashed border-white/5 rounded-2xl bg-white/5">
                                <Layers className="w-12 h-12 mb-4 opacity-50" />
                                <p>لا يوجد أنشطة مضافة في هذا القسم.</p>
                                <button onClick={() => handleAddActivity(selectedTypeFilter, `نشاط جديد`)} className="mt-4 text-labPrimary hover:underline">إضافة أول نشاط</button>
                            </div>
                        ) : (
                            filteredActivities.map(activity => (
                                <div key={activity.id} className="relative group flex flex-col bg-black/30 rounded-xl border border-white/5 overflow-hidden transition-all hover:border-labPrimary/30 hover:shadow-lg">
                                    {/* Top: Content (Click to Edit) */}
                                    <div 
                                        onClick={() => {
                                            setEditingActivityId(activity.id);
                                            if (activity.type === 'wheel' && activity.content?.questions?.[0]) {
                                                setCurrentQuestion(activity.content.questions[0]);
                                                setSelectedQuestionIndex(0);
                                            } else {
                                                resetCurrentQuestion(false);
                                                setSelectedQuestionIndex(-1);
                                            }
                                        }}
                                        className="p-5 cursor-pointer flex-1 flex flex-col"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                             <div className={`p-2 rounded-lg ${activity.category === 'gamification' ? 'bg-labSecondary/10 text-labSecondary' : 'bg-labPrimary/10 text-labPrimary'}`}>
                                                 {activity.type === 'wheel' ? <Disc className="w-6 h-6"/> : 
                                                  activity.type === 'puzzle' ? <Puzzle className="w-6 h-6"/> :
                                                  activity.type === 'memory' ? <Brain className="w-6 h-6"/> :
                                                  activity.type === 'riddle' ? <RiddleIcon className="w-6 h-6"/> :
                                                  activity.type === 'blast' ? <Rocket className="w-6 h-6"/> :
                                                  <CheckSquare className="w-6 h-6"/>}
                                             </div>
                                        </div>
                                        <h4 className="text-white font-bold text-lg truncate mb-1">{activity.title}</h4>
                                        <span className="text-xs text-gray-500 mt-auto pt-2">{activity.type === 'wheel' ? `${activity.content?.questions?.length || 0} جولات` : `${activity.content?.questions?.length || 0} أسئلة`}</span>
                                    </div>

                                    {/* Bottom: Actions Footer (Strictly Separated) */}
                                    <div className="bg-black/40 border-t border-white/5 p-2 flex gap-2">
                                        <button 
                                            onClick={() => {
                                                if (window.confirm('هل أنت متأكد من حذف هذا النشاط؟')) {
                                                    handleDeleteActivity(activity.id);
                                                }
                                            }}
                                            className="flex-1 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors text-xs font-bold flex items-center justify-center gap-1"
                                        >
                                            <Trash2 className="w-3 h-3" /> حذف
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setEditingActivityId(activity.id);
                                                if (activity.type === 'wheel' && activity.content?.questions?.[0]) {
                                                    setCurrentQuestion(activity.content.questions[0]);
                                                    setSelectedQuestionIndex(0);
                                                } else {
                                                    resetCurrentQuestion(false);
                                                    setSelectedQuestionIndex(-1);
                                                }
                                            }}
                                            className="flex-1 py-2 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors text-xs font-bold flex items-center justify-center gap-1"
                                        >
                                            <Edit3 className="w-3 h-3" /> تعديل
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0d1b3e] p-4 md:p-8 pt-24 font-cairo">
      {currentView === 'list' && renderList()}
      {currentView === 'channel-settings' && renderChannelSettings()}
      {currentView === 'content-editor' && renderContentEditor()}
      
      {showLabelEditor && renderLabelEditor()}
    </div>
  );
};