import React, { useState, useEffect, useRef } from 'react';
import { Channel, Activity, MCQQuestion, AppLabels } from '../types';
import { ArrowRight, Clock, Play, CheckCircle, RefreshCcw, Star, ChevronLeft, CheckSquare, Gamepad2, Layers, Award, HelpCircle, Trophy, Target, Heart, XCircle, AlertCircle, Rocket, Zap, ArrowLeft } from 'lucide-react';

interface ChannelViewProps {
  channel: Channel;
  labels: AppLabels;
  onBack: () => void;
}

// Embedded Sounds
const SOUNDS = {
    correct: "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//uQZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAjAAAZFwADBQgLDxETFxgbHR8iJSgpLTEzNjc6PD5BQ0ZIS01QUlVXWl1fYWNkZmhqbG9xdHZ5fH6AgYOGiImKjY+Sk5WXmZqcn6Gio6WnqauusbO1t7m8vsHDxMbIycrLzc/Q0tTX2Nna3N3e4OPk5ebn6Onr7e/w8fP19/j5+v0AAAAATGF2YzU4LjU0LjEwMAAAAAAAAAAAAAAA//uQZAAABi0vXuYQwAAAAANIAAAExOZe9zDDgAAAA0gAAABAAABpAAAAC4AAAAuAAADSAAAAy5AAAAAAAAAAAAAA//7kGQAAAwMJWfsMFAAAAA0gAAABF4lb+wYcAAAAADSAAAAEAAAGkAAAAAAAGkAAAAALgAAAAuAAADSAAAAy5AAAAAAAA//uQZAAABe0tX+wwUAAAAANIAAAExNZa9zDDgAAAA0gAAABAAABpAAAAC4AAAAuAAADSAAAAy5AAAAAAAAAAAAAA//7kGQAAAwMJWfsMFAAAAA0gAAABF4lb+wYcAAAAADSAAAAEAAAGkAAAAAAAGkAAAAALgAAAAuAAADSAAAAy5AAAAAAAA//uQZAAABe0tX+wwUAAAAANIAAAExNZa9zDDgAAAA0gAAABAAABpAAAAC4AAAAuAAADSAAAAy5AAAAAAAAAAAAAA//uQZAAABe0tX+wwUAAAAANIAAAExNZa9zDDgAAAA0gAAABAAABpAAAAC4AAAAuAAADSAAAAy5AAAAAAAA//uQZAAABe0tX+wwUAAAAANIAAAExNZa9zDDgAAAA0gAAABAAABpAAAAC4AAAAuAAADSAAAAy5AAAAAAAAAAAAAA//uQZAAABe0tX+wwUAAAAANIAAAExNZa9zDDgAAAA0gAAABAAABpAAAAC4AAAAuAAADSAAAAy5AAAAAAAA//uQZAAABe0tX+wwUAAAAANIAAAExNZa9zDDgAAAA0gAAABAAABpAAAAC4AAAAuAAADSAAAAy5AAAAAAAAAAAAAA//uQZAAABe0tX+wwUAAAAANIAAAExNZa9zDDgAAAA0gAAABAAABpAAAAC4AAAAuAAADSAAAAy5AAAAAAAA//uQZAAABe0tX+wwUAAAAANIAAAExNZa9zDDgAAAA0gAAABAAABpAAAAC4AAAAuAAADSAAAAy5AAAAAAAAAAAAAA//uQZAAABe0tX+wwUAAAAANIAAAExNZa9zDDgAAAA0gAAABAAABpAAAAC4AAAAuAAADSAAAAy5AAAAAAAA//uQZAAABe0tX+wwUAAAAANIAAAExNZa9zDDgAAAA0gAAABAAABpAAAAC4AAAAuAAADSAAAAy5AAAAAAAA//uQZAAABe0tX+wwUAAAAANIAAAExNZa9zDDgAAAA0gAAABAAABpAAAAC4AAAAuAAADSAAAAy5AAAAAAAA",
    wrong: "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//uQZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAjAAAZFwADBQgLDxETFxgbHR8iJSgpLTEzNjc6PD5BQ0ZIS01QUlVXWl1fYWNkZmhqbG9xdHZ5fH6AgYOGiImKjY+Sk5WXmZqcn6Gio6WnqauusbO1t7m8vsHDxMbIycrLzc/Q0tTX2Nna3N3e4OPk5ebn6Onr7e/w8fP19/j5+v0AAAAATGF2YzU4LjU0LjEwMAAAAAAAAAAAAAAA//uQZAAABi0vXuYQwAAAAANIAAAExOZe9zDDgAAAA0gAAABAAABpAAAAC4AAAAuAAADSAAAAy5AAAAAAAAAAAAAA//7kGQAAAwMJWfsMFAAAAA0gAAABF4lb+wYcAAAAADSAAAAEAAAGkAAAAAAAGkAAAAALgAAAAuAAADSAAAAy5AAAAAAAA//uQZAAABe0tX+wwUAAAAANIAAAExNZa9zDDgAAAA0gAAABAAABpAAAAC4AAAAuAAADSAAAAy5AAAAAAAAAAAAAA//7kGQAAAwMJWfsMFAAAAA0gAAABF4lb+wYcAAAAADSAAAAEAAAGkAAAAAAAGkAAAAALgAAAAuAAADSAAAAy5AAAAAAAA//uQZAAABe0tX+wwUAAAAANIAAAExNZa9zDDgAAAA0gAAABAAABpAAAAC4AAAAuAAADSAAAAy5AAAAAAAAAAAAAA//uQZAAABe0tX+wwUAAAAANIAAAExNZa9zDDgAAAA0gAAABAAABpAAAAC4AAAAuAAADSAAAAy5AAAAAAAA//uQZAAABe0tX+wwUAAAAANIAAAExNZa9zDDgAAAA0gAAABAAABpAAAAC4AAAAuAAADSAAAAy5AAAAAAAAAAAAAA//uQZAAABe0tX+wwUAAAAANIAAAExNZa9zDDgAAAA0gAAABAAABpAAAAC4AAAAuAAADSAAAAy5AAAAAAAA//uQZAAABe0tX+wwUAAAAANIAAAExNZa9zDDgAAAA0gAAABAAABpAAAAC4AAAAuAAADSAAAAy5AAAAAAAAAAAAAA//uQZAAABe0tX+wwUAAAAANIAAAExNZa9zDDgAAAA0gAAABAAABpAAAAC4AAAAuAAADSAAAAy5AAAAAAAA//uQZAAABe0tX+wwUAAAAANIAAAExNZa9zDDgAAAA0gAAABAAABpAAAAC4AAAAuAAADSAAAAy5AAAAAAAAAAAAAA//uQZAAABe0tX+wwUAAAAANIAAAExNZa9zDDgAAAA0gAAABAAABpAAAAC4AAAAuAAADSAAAAy5AAAAAAAA//uQZAAABe0tX+wwUAAAAANIAAAExNZa9zDDgAAAA0gAAABAAABpAAAAC4AAAAuAAADSAAAAy5AAAAAAAA//uQZAAABe0tX+wwUAAAAANIAAAExNZa9zDDgAAAA0gAAABAAABpAAAAC4AAAAuAAADSAAAAy5AAAAAAAA",
};

// Colors for the wheel segments
const WHEEL_COLORS = [
  '#FF2E63', // Red/Pink
  '#00C851', // Green
  '#33b5e5', // Light Blue
  '#ffbb33', // Yellow/Orange
  '#aa66cc', // Purple
  '#2BBBAD'  // Teal
];

// Confetti Component
const Confetti = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[60]">
            {[...Array(50)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-3 h-3 bg-white rounded-sm animate-confetti"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `-10px`,
                        backgroundColor: ['#FFD700', '#FF2E63', '#00C851', '#33b5e5'][Math.floor(Math.random() * 4)],
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${2 + Math.random() * 3}s`
                    }}
                />
            ))}
        </div>
    );
};

export const ChannelView: React.FC<ChannelViewProps> = ({ channel, labels, onBack }) => {
  const [activeTab, setActiveTab] = useState<'interactive' | 'gamification'>('interactive');
  
  // Game State
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  
  // Wheel State
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState<{number: string, isWin: boolean} | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState(3);

  // Blast State
  const [blastLevel, setBlastLevel] = useState(1);
  const [blastStreak, setBlastStreak] = useState(0);
  
  // Refs
  const timerRef = useRef<number | null>(null);
  const isSpinningRef = useRef(false); 

  // Audio Refs
  const successAudio = useRef(new Audio(SOUNDS.correct));
  const errorAudio = useRef(new Audio(SOUNDS.wrong));
  const audioContextRef = useRef<AudioContext | null>(null);

  // Safely access logo config
  const logoScale = channel.logoConfig?.scale ?? 1;
  const logoX = channel.logoConfig?.x ?? 0;
  const logoY = channel.logoConfig?.y ?? 0;

  useEffect(() => {
    successAudio.current.volume = 0.5;
    errorAudio.current.volume = 0.5;
  }, []);

  const activities = channel.activities.filter(a => {
      const category = a.category || 'interactive'; 
      return category === activeTab;
  });

  // --- Sound Logic ---
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const playTickSound = () => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'triangle'; 
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.05, ctx.currentTime); 
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  };


  // --- Game Logic ---
  const handleStartActivity = (activity: Activity) => {
    if (!activity.content?.questions || activity.content.questions.length === 0) {
        alert('هذا النشاط لا يحتوي على محتوى.');
        return;
    }

    initAudio(); 
    setCurrentActivity(activity);
    setCurrentQuestionIndex(0);
    setScore(0);
    
    if (activity.type === 'wheel') {
        setWheelRotation(0);
        setIsSpinning(false);
        isSpinningRef.current = false;
        setWheelResult(null);
        setAttemptsLeft(3); 
    } else if (activity.type === 'blast') {
        setBlastLevel(1);
        setBlastStreak(0);
        loadQuestion(0, activity.content.questions, true);
    } else {
        loadQuestion(0, activity.content.questions);
    }
    
    setGameStatus('playing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadQuestion = (index: number, questions: MCQQuestion[], isBlast = false) => {
    const q = questions[index];
    // Blast mode: shorter time per question based on level
    const adjustedTime = isBlast ? Math.max(5, q.timer - (isBlast ? (blastLevel - 1) * 2 : 0)) : q.timer;
    
    setTimeLeft(adjustedTime);
    setSelectedOption(null);
    setFeedback(null);
    setWheelResult(null); 
    setAttemptsLeft(3); 
    setWheelRotation(0); 
    
    playTickSound();
    
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
            if (prev <= 1) {
                if (timerRef.current) clearInterval(timerRef.current);
                handleTimeUp();
                return 0;
            }
            if (!isBlast && prev <= 5) playTickSound(); // Standard tick
            return prev - 1;
        });
    }, 1000);
  };

  const handleTimeUp = () => {
    setFeedback('wrong');
    setBlastStreak(0); // Reset streak on time up
    playAudio('wrong');
    setTimeout(nextQuestion, 1500);
  };

  const playAudio = (type: 'correct' | 'wrong') => {
      const audio = type === 'correct' ? successAudio.current : errorAudio.current;
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
          playPromise.catch(error => console.error("Audio play failed", error));
      }
  };

  const handleOptionClick = (optionIndex: number) => {
    if (selectedOption !== null || !currentActivity || !currentActivity.content?.questions) return;
    if (timerRef.current) clearInterval(timerRef.current);
    
    setSelectedOption(optionIndex);
    const currentQ = currentActivity.content.questions[currentQuestionIndex];
    const isCorrect = optionIndex === currentQ.correctOptionIndex;
    const isBlast = currentActivity.type === 'blast';

    if (isCorrect) {
        setFeedback('correct');
        playAudio('correct');
        
        if (isBlast) {
            // Blast Scoring Logic
            const speedBonus = timeLeft * 10;
            const streakBonus = blastStreak * 50;
            const levelMultiplier = blastLevel;
            const points = (100 + speedBonus + streakBonus) * levelMultiplier;
            setScore(prev => prev + points);
            setBlastStreak(prev => prev + 1);
            
            // Level Up Check (Every 3 correct answers)
            if ((blastStreak + 1) % 3 === 0) {
                 setBlastLevel(prev => Math.min(prev + 1, 5)); // Max level 5
            }
        } else {
            setScore(prev => prev + 1);
        }

    } else {
        setFeedback('wrong');
        playAudio('wrong');
        if (isBlast) {
             setBlastStreak(0);
             // Maybe subtract points or shake screen
        }
    }
    setTimeout(nextQuestion, 1500);
  };

  const nextQuestion = () => {
    if (!currentActivity || !currentActivity.content?.questions) return;
    
    if (currentQuestionIndex < currentActivity.content.questions.length - 1) {
        setCurrentQuestionIndex(prev => {
            const nextIndex = prev + 1;
            loadQuestion(nextIndex, currentActivity.content!.questions!, currentActivity.type === 'blast');
            return nextIndex;
        });
    } else {
        setGameStatus('finished');
        if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // --- Wheel Logic (Deterministic Physics) ---
  const spinWheel = () => {
      if (isSpinningRef.current || !currentActivity?.content?.questions) return;
      
      const segments = ['1', '2', '3', '4', '5', '6'];
      const segmentAngle = 360 / segments.length; // 60 degrees
      
      // 1. Predetermine Winner (Randomly)
      const randomSegmentIndex = Math.floor(Math.random() * segments.length);
      const winningNumber = segments[randomSegmentIndex];
      
      // 2. Calculate Precise Target Angle
      // In CSS rotate:
      // 0deg = Pointer points to center of Segment 0? No, usually pointer is at top (12 o'clock)
      // If we rotate X degrees, the wheel turns clockwise.
      // The value under the pointer is (360 - (rotation % 360)).
      // We want (360 - rotation % 360) to be inside the Winning Segment.
      // Winning Segment Center Angle = (Index * 60) + 30.
      
      // Let T = Target Angle (Center of winning segment).
      // We want: (360 - (R % 360)) = T  => R % 360 = 360 - T
      // So Rotation R = (360 - T) + (360 * NumSpins)
      
      const winningSegmentCenter = (randomSegmentIndex * segmentAngle) + (segmentAngle / 2);
      
      // Add random jitter +/- 20 degrees to look natural (not always dead center)
      const jitter = (Math.random() * 40) - 20; 
      const targetPointerAngle = winningSegmentCenter + jitter;
      
      // Calculate final rotation needed
      const minSpins = 5; // Minimum full rotations
      const baseRotation = 360 * minSpins;
      const targetRotation = baseRotation + (360 - targetPointerAngle);
      
      // Add to current rotation to ensure smooth continuous spin
      // We need to find the next multiple of 360 that aligns with our target relative to current
      const currentMod = wheelRotation % 360;
      const targetMod = (360 - targetPointerAngle); // The angle we want at the end (modulo 360)
      
      let distance = targetMod - currentMod;
      if (distance < 0) distance += 360;
      
      const finalRotation = wheelRotation + distance + (360 * minSpins);

      // Start Spin
      setIsSpinning(true);
      isSpinningRef.current = true;
      setWheelResult(null);
      setWheelRotation(finalRotation);

      // Audio Ticks simulation
      let tickDelay = 50;
      let ticks = 0;
      const maxTicks = 30;
      
      const tickLoop = () => {
          if (!isSpinningRef.current) return;
          playTickSound();
          ticks++;
          // Decelerate ticks
          tickDelay *= 1.1;
          if (ticks < maxTicks) setTimeout(tickLoop, tickDelay);
      };
      setTimeout(tickLoop, 50);

      // Finish Spin
      setTimeout(() => {
          setIsSpinning(false);
          isSpinningRef.current = false;
          
          const targetQ = currentActivity.content!.questions![currentQuestionIndex];
          const targetNumStr = (targetQ.correctOptionIndex + 1).toString();
          const isWin = winningNumber === targetNumStr;
          
          if (isWin) {
              setScore(prev => prev + 1);
              playAudio('correct');
          } else {
              setScore(prev => prev - 1);
              setAttemptsLeft(prev => prev - 1);
              playAudio('wrong');
          }
          
          setWheelResult({ number: winningNumber, isWin });

      }, 6000); // 6s duration matches CSS transition
  };
  
  const handleWheelContinue = () => {
      if (!wheelResult) return;
      if (wheelResult.isWin) {
          nextQuestion();
      } else {
          if (attemptsLeft > 0) {
              setWheelResult(null);
          } else {
              nextQuestion();
          }
      }
  };

  const exitGame = () => {
    setGameStatus('idle');
    setCurrentActivity(null);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  // --- Views ---

  // 1. HERO HEADER
  const renderHeader = () => (
    <div 
        className="relative w-full h-[320px] flex items-end pb-10 px-4 md:px-12 shadow-2xl mb-12"
        style={{ backgroundColor: channel.color }}
    >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-15 mix-blend-overlay"></div>
        
        <button 
            onClick={onBack}
            className="absolute top-24 right-4 md:right-12 bg-black/30 hover:bg-black/50 text-white px-5 py-2.5 rounded-full backdrop-blur-md flex items-center gap-2 transition-all z-20 border border-white/10 group"
        >
            <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden md:inline font-bold">العودة للرئيسية</span>
        </button>

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-end md:items-end gap-8">
            <div className="w-28 h-28 md:w-40 md:h-40 bg-white rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden shrink-0 border-4 border-white transform translate-y-4 md:translate-y-8">
                {channel.logoUrl ? (
                   <img 
                   src={channel.logoUrl} 
                   alt={channel.title} 
                   className="object-contain"
                   style={{
                     width: '80%',
                     height: '80%',
                     transform: `scale(${logoScale}) translate(${logoX}px, ${logoY}px)`
                   }}
                 />
                ) : (
                    <span className="text-4xl font-bold text-gray-300">{channel.title.charAt(0)}</span>
                )}
            </div>
            <div className="mb-2 flex-1 text-right">
                <div className="flex items-center gap-3 mb-2">
                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-white border border-white/10">قناة رسمية</span>
                    <span className="bg-labPrimary/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-white border border-white/10 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white" />
                        مميز
                    </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-3 shadow-sm leading-tight">{channel.title}</h1>
                <p className="text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed">{channel.description || 'بوابة المحتوى التعليمي والتفاعلي'}</p>
            </div>
        </div>
    </div>
  );

  // 2. ACTIVITY LIST
  const renderActivityList = () => (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-24">
        {/* Tabs */}
        <div className="flex justify-center mb-16">
            <div className="bg-white/5 p-2 rounded-2xl flex border border-white/10 backdrop-blur-sm shadow-xl">
                <button 
                    onClick={() => setActiveTab('interactive')}
                    className={`px-8 py-3 rounded-xl text-base font-bold transition-all flex items-center gap-3 ${activeTab === 'interactive' ? 'bg-labPrimary text-white shadow-lg scale-105' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    <CheckSquare className="w-5 h-5" />
                    {labels.interactiveSection}
                </button>
                <button 
                    onClick={() => setActiveTab('gamification')}
                    className={`px-8 py-3 rounded-xl text-base font-bold transition-all flex items-center gap-3 ${activeTab === 'gamification' ? 'bg-labSecondary text-white shadow-lg scale-105' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    <Gamepad2 className="w-5 h-5" />
                    {labels.gamificationSection}
                </button>
            </div>
        </div>

        {/* Wide Cards Layout */}
        <div className="space-y-6 max-w-5xl mx-auto">
            {activities.length > 0 ? (
                activities.map((activity, idx) => (
                    <div 
                        key={activity.id}
                        onClick={() => handleStartActivity(activity)}
                        className="group relative bg-[#1e2338] rounded-2xl overflow-hidden shadow-lg border border-white/5 hover:border-labPrimary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer flex flex-col md:flex-row"
                    >
                        {/* Left Side: Visual/Icon */}
                        <div 
                            className="w-full md:w-64 h-40 md:h-auto flex items-center justify-center shrink-0 relative overflow-hidden"
                            style={{ backgroundColor: channel.color }} 
                        >
                             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500"></div>
                             {/* Large Background Number */}
                             <span className="absolute -bottom-4 -right-4 text-9xl font-black text-white/10 select-none">{idx + 1}</span>
                             
                             {/* Icon */}
                             <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500">
                                 {activity.type === 'mcq' && <CheckSquare className="w-16 h-16 text-white drop-shadow-lg" />}
                                 {activity.type === 'truefalse' && <CheckCircle className="w-16 h-16 text-white drop-shadow-lg" />}
                                 {activity.type === 'wheel' && <Gamepad2 className="w-16 h-16 text-white drop-shadow-lg" />}
                                 {activity.type === 'blast' && <Rocket className="w-16 h-16 text-white drop-shadow-lg" />}
                             </div>
                        </div>

                        {/* Middle: Content */}
                        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-3">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${activeTab === 'interactive' ? 'bg-labPrimary/20 text-labPrimary border border-labPrimary/20' : 'bg-labSecondary/20 text-labSecondary border border-labSecondary/20'}`}>
                                    {/* DYNAMIC LABEL */}
                                    {activity.type === 'mcq' ? labels.mcq : 
                                     activity.type === 'wheel' ? labels.wheel : 
                                     activity.type === 'blast' ? labels.blast : 
                                     activity.type === 'truefalse' ? labels.truefalse :
                                     activity.type === 'matching' ? labels.matching :
                                     activity.type === 'puzzle' ? labels.puzzle :
                                     activity.type === 'memory' ? labels.memory :
                                     activity.type === 'riddle' ? labels.riddle :
                                     'نشاط'}
                                </span>
                                
                                {activity.type === 'mcq' && (
                                    <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-white/10 text-white border border-white/10 flex items-center gap-1.5">
                                         <HelpCircle className="w-3 h-3 text-labSecondary" />
                                         {activity.content?.questions?.length || 0} أسئلة
                                    </span>
                                )}

                                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {activity.type === 'wheel' ? `${activity.content?.questions?.length || 0} جولات` : (activity.content?.questions ? `${activity.content.questions.reduce((acc, q) => acc + q.timer, 0) / 60 < 1 ? '< 1' : Math.ceil(activity.content.questions.reduce((acc, q) => acc + q.timer, 0) / 60)} دقيقة` : 'غير محدد')}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-labPrimary transition-colors">{activity.title}</h3>
                            <p className="text-gray-400 text-sm line-clamp-2">
                                {activity.type === 'wheel' 
                                    ? 'جرب حظك مع العجلة الدوارة! اضغط للعب واكتشف ما يخبئه لك الحظ.' 
                                    : activity.type === 'blast'
                                    ? 'سباق مع الزمن! أجب بسرعة، اجمع النقاط، وارتقِ بالمستويات في هذا التحدي المثير.'
                                    : 'اختبر معلوماتك وتحدى نفسك في هذا النشاط الممتع. أجب عن الأسئلة واجمع النقاط.'}
                            </p>
                        </div>

                        {/* Right: Action */}
                        <div className="p-6 md:p-8 flex items-center justify-center border-t md:border-t-0 md:border-r border-white/5 bg-black/20">
                            <button className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center group-hover:bg-labPrimary group-hover:scale-110 transition-all shadow-lg">
                                <Play className="w-5 h-5 ml-1" />
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="py-24 text-center bg-white/5 rounded-3xl border border-white/10 border-dashed">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Layers className="w-10 h-10 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-300 mb-2">لا يوجد محتوى حالياً</h3>
                    <p className="text-gray-500">لم يتم إضافة أنشطة في هذا القسم بعد.</p>
                </div>
            )}
        </div>
    </div>
  );

  // 3. WHEEL GAME RENDERER
  const renderWheelGame = () => {
      if (!currentActivity?.content?.questions) return null;
      const currentQ = currentActivity.content.questions[currentQuestionIndex];
      const segments = ['1', '2', '3', '4', '5', '6'];

      const anglePerSegment = 360 / segments.length;
      const gradientParts = segments.map((_, idx) => {
          const start = idx * anglePerSegment;
          const end = (idx + 1) * anglePerSegment;
          const color = WHEEL_COLORS[idx % WHEEL_COLORS.length];
          return `${color} ${start}deg ${end}deg`;
      }).join(', ');

      return (
        <div className="fixed inset-0 z-50 bg-[#0d1b3e] flex flex-col items-center justify-center overflow-y-auto">
             {/* Background Effects */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-[#0d1b3e] to-[#0d1b3e] pointer-events-none"></div>
             <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

             {/* Confetti Celebration */}
             {wheelResult?.isWin && <Confetti />}

             {/* Close Button */}
             <button 
                onClick={exitGame}
                className="absolute top-8 right-8 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-sm"
             >
                <ArrowRight className="w-6 h-6" />
             </button>

             {/* Stats Bar */}
             <div className="absolute top-8 left-1/2 -translate-x-1/2 z-40 flex gap-4 bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10 shadow-lg whitespace-nowrap">
                 <div className="flex items-center gap-2 px-4 py-1 border-l border-white/10">
                     <Award className="w-4 h-4 text-labPrimary" />
                     <span className="font-bold text-white">{score} نقطة</span>
                 </div>
                 <div className="flex items-center gap-2 px-4 py-1 border-l border-white/10">
                     <Heart className={`w-4 h-4 ${attemptsLeft === 1 ? 'text-red-500 animate-pulse' : 'text-labSecondary'}`} />
                     <span className="font-bold text-white">{attemptsLeft} محاولات</span>
                 </div>
                 <div className="flex items-center gap-2 px-4 py-1">
                     <span className="text-gray-400 text-sm">الجولة {currentQuestionIndex + 1} / {currentActivity.content.questions.length}</span>
                 </div>
             </div>

             {/* Question/Title */}
             <div className="relative z-10 text-center mb-8 px-4 max-w-2xl mt-24">
                 <h2 className="text-gray-400 text-sm uppercase tracking-wider mb-2">{currentActivity.title}</h2>
                 <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg leading-relaxed">
                     {currentQ.questionText}
                 </h1>
                 <p className="text-sm text-green-400 mt-2 bg-green-500/10 inline-block px-4 py-2 rounded-full border border-green-500/20 font-bold">
                     <Target className="w-4 h-4 inline-block mr-2" />
                     الرقم المطلوب: {currentQ.correctOptionIndex + 1}
                 </p>
             </div>

             {/* Wheel Container */}
             <div className="relative z-10 transform scale-75 md:scale-100 transition-transform mb-24">
                 {/* Pointer - Enhanced */}
                 <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">
                     <svg width="50" height="60" viewBox="0 0 50 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M25 60L5 15C2 8 8 0 16 0H34C42 0 48 8 45 15L25 60Z" fill="#FFFFFF" stroke="#0d1b3e" strokeWidth="4"/>
                        <circle cx="25" cy="15" r="5" fill="#0d1b3e"/>
                     </svg>
                 </div>

                 {/* The Wheel */}
                 <div className="relative p-3 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 shadow-2xl">
                    <div 
                        className={`w-[350px] h-[350px] md:w-[450px] md:h-[450px] rounded-full border-[8px] border-white shadow-[0_0_60px_rgba(0,0,0,0.6)] relative overflow-hidden ${isSpinning ? 'blur-[0.5px]' : ''}`}
                        style={{ 
                            transform: `rotate(${wheelRotation}deg)`,
                            background: `conic-gradient(${gradientParts})`,
                            transition: 'transform 6s cubic-bezier(0.1, 0, 0.2, 1)' 
                        }}
                    >
                        {/* Segments Text & Separators */}
                        {segments.map((segment, idx) => {
                            const rotation = (idx * anglePerSegment) + (anglePerSegment / 2); // Center of segment
                            return (
                                <React.Fragment key={idx}>
                                    {/* Divider Line */}
                                    <div 
                                        className="absolute top-0 left-1/2 w-[2px] h-1/2 origin-bottom bg-black/10 pointer-events-none"
                                        style={{ transform: `translateX(-50%) rotate(${idx * anglePerSegment}deg)` }}
                                    ></div>
                                    
                                    {/* Segment Text */}
                                    <div 
                                        className="absolute top-0 left-1/2 w-1 h-1/2 origin-bottom flex justify-center pt-8 z-20"
                                        style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
                                    >
                                        <span className="text-white font-black text-5xl transform rotate-180 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
                                            {segment}
                                        </span>
                                    </div>
                                    
                                    {/* Pegs on the rim for each segment line */}
                                    <div 
                                        className="absolute top-1 left-1/2 w-3 h-3 bg-white rounded-full shadow-md z-30"
                                        style={{ transform: `translateX(-50%) rotate(${idx * anglePerSegment}deg)`, transformOrigin: `50% ${350/2}px` }} // Approximate origin based on width
                                    ></div>
                                     <div 
                                        className="absolute top-1 left-1/2 w-3 h-3 bg-white rounded-full shadow-md z-30 md:hidden"
                                        style={{ transform: `translateX(-50%) rotate(${idx * anglePerSegment}deg)`, transformOrigin: `50% ${350/2}px` }} // Mobile adjustment if needed
                                    ></div>
                                </React.Fragment>
                            );
                        })}
                        
                        {/* Center Hub */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full shadow-[0_0_20px_rgba(0,0,0,0.3)] flex items-center justify-center z-20 border-[4px] border-gray-200">
                            <div className="w-14 h-14 bg-[#0d1b3e] rounded-full flex items-center justify-center">
                                <Star className={`w-6 h-6 text-white ${isSpinning ? 'animate-spin' : ''}`} fill="currentColor" />
                            </div>
                        </div>
                    </div>
                 </div>

                 {/* Spin Button */}
                 <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 z-50">
                    <button 
                        onClick={spinWheel}
                        disabled={isSpinning || !!wheelResult}
                        className={`px-16 py-5 rounded-full text-2xl font-black text-white shadow-2xl transition-all transform hover:scale-105 active:scale-95 relative overflow-hidden group border-4 border-white/10 whitespace-nowrap ${isSpinning || !!wheelResult ? 'bg-gray-700 cursor-not-allowed opacity-50 grayscale' : 'bg-gradient-to-b from-[#FF2E63] to-[#C51162] hover:shadow-[0_0_40px_rgba(255,46,99,0.6)]'}`}
                    >
                        <span className="relative z-10 flex items-center gap-3 drop-shadow-md">
                            {isSpinning ? 'جاري الدوران...' : (attemptsLeft === 3 ? 'اضغط للتدوير' : 'حاول مرة أخرى')}
                            {!isSpinning && !wheelResult && <RefreshCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />}
                        </span>
                        {/* Shine effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent z-0"></div>
                    </button>
                 </div>
             </div>

             {/* Result Modal Overlay */}
             {wheelResult && (
                 <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
                     <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden animate-scale-in shadow-2xl border-4 border-white/20">
                         <div className={`absolute inset-0 bg-gradient-to-br ${wheelResult.isWin ? 'from-green-100 to-green-50' : 'from-red-100 to-red-50'}`}></div>
                         
                         <div className="relative z-10">
                            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center shadow-inner ${wheelResult.isWin ? 'bg-green-500' : 'bg-red-500'}`}>
                                {wheelResult.isWin ? (
                                    <Trophy className="w-12 h-12 text-white animate-bounce" />
                                ) : (
                                    <XCircle className="w-12 h-12 text-white" />
                                )}
                            </div>
                            
                            <h2 className="text-3xl font-black text-gray-800 mb-2">
                                {wheelResult.isWin ? 'إجابة صحيحة!' : 'حظ أوفر!'}
                            </h2>
                            <p className="text-gray-600 mb-6 font-medium">
                                {wheelResult.isWin 
                                    ? 'مبروك! توقفت العجلة على الرقم الصحيح.' 
                                    : `توقفت العجلة عند الرقم ${wheelResult.number}.`
                                }
                            </p>
                            
                            <div className={`text-2xl font-black mb-8 py-3 rounded-xl border-2 border-dashed ${wheelResult.isWin ? 'text-green-600 border-green-300 bg-green-50' : 'text-red-500 border-red-300 bg-red-50'}`}>
                                {wheelResult.isWin ? '+1 نقطة' : '-1 نقطة'}
                            </div>
                            
                            <button 
                                onClick={handleWheelContinue}
                                className="w-full py-4 bg-[#0d1b3e] text-white rounded-xl font-bold hover:bg-black transition-colors shadow-xl text-lg"
                            >
                                {wheelResult.isWin 
                                    ? 'السؤال التالي' 
                                    : (attemptsLeft > 0 ? `حاول مجدداً (${attemptsLeft} محاولات)` : 'انتقل للسؤال التالي')
                                }
                            </button>
                         </div>
                     </div>
                 </div>
             )}
        </div>
      );
  };

  // 6. BLAST GAME RENDERER (New)
  const renderBlastGame = () => {
    if (!currentActivity || !currentActivity.content?.questions) return null;
    const currentQ = currentActivity.content.questions[currentQuestionIndex];

    return (
        <div className="fixed inset-0 z-50 bg-[#0d1b3e] flex flex-col overflow-hidden">
            {/* Blast Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 to-black pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse pointer-events-none"></div>
            
            {/* Header: Level & Score */}
            <div className="w-full h-24 bg-black/40 backdrop-blur-md border-b border-white/10 flex items-center px-6 justify-between relative z-10">
                 <button onClick={exitGame} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all text-white"><ArrowLeft className="w-6 h-6"/></button>
                 
                 <div className="flex items-center gap-6">
                     <div className="flex flex-col items-center">
                         <span className="text-xs text-labSecondary font-bold uppercase tracking-widest">Level</span>
                         <div className="text-3xl font-black text-white flex items-center gap-1">
                             <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                             {blastLevel}
                         </div>
                     </div>
                     <div className="w-px h-10 bg-white/10"></div>
                     <div className="flex flex-col items-center">
                         <span className="text-xs text-labPrimary font-bold uppercase tracking-widest">Score</span>
                         <div className="text-3xl font-black text-white">{score}</div>
                     </div>
                 </div>

                 <div className="w-12 h-12 relative flex items-center justify-center">
                     <svg className="absolute inset-0 w-full h-full -rotate-90">
                         <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
                         <circle cx="24" cy="24" r="20" stroke={timeLeft < 5 ? '#EF4444' : '#10B981'} strokeWidth="4" fill="none" strokeDasharray="126" strokeDashoffset={126 - (126 * timeLeft) / (currentQ.timer - ((blastLevel - 1) * 2))} className="transition-all duration-1000 ease-linear" />
                     </svg>
                     <span className="font-mono font-bold text-white text-sm">{timeLeft}</span>
                 </div>
            </div>

            {/* Game Stage */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
                
                {/* Streak Counter */}
                {blastStreak > 1 && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-1 rounded-full font-black text-sm italic transform -skew-x-12 shadow-lg animate-bounce">
                        {blastStreak}x COMBO!
                    </div>
                )}

                {/* Question Bubble */}
                <div className={`bg-white/10 backdrop-blur-xl border-2 ${feedback === 'wrong' ? 'border-red-500 animate-[shake_0.5s_ease-in-out]' : 'border-white/20'} rounded-3xl p-8 max-w-4xl w-full text-center mb-12 shadow-2xl relative overflow-hidden transition-all duration-300`}>
                     {feedback === 'correct' && <div className="absolute inset-0 bg-green-500/20 animate-pulse"></div>}
                     {feedback === 'wrong' && <div className="absolute inset-0 bg-red-500/20"></div>}
                     <h2 className="text-3xl md:text-5xl font-black text-white drop-shadow-md relative z-10">{currentQ.questionText}</h2>
                </div>

                {/* Answer Asteroids */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
                    {currentQ.options.map((opt, idx) => (
                        <button 
                            key={idx}
                            onClick={() => handleOptionClick(idx)}
                            disabled={selectedOption !== null}
                            className={`
                                relative h-24 rounded-2xl border-4 font-bold text-xl md:text-2xl transition-all transform hover:scale-105 active:scale-95 overflow-hidden group
                                ${selectedOption !== null 
                                    ? (idx === currentQ.correctOptionIndex 
                                        ? 'bg-green-600 border-green-400 text-white opacity-100 scale-110 shadow-[0_0_50px_rgba(34,197,94,0.6)]' 
                                        : 'bg-gray-800 border-gray-700 text-gray-500 opacity-50 grayscale')
                                    : 'bg-black/50 border-white/20 text-white hover:border-labPrimary hover:shadow-[0_0_30px_rgba(128,0,255,0.4)]'
                                }
                            `}
                        >
                             {/* Particle effect on hover */}
                             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_0.5s_infinite]"></div>
                             <span className="relative z-10">{opt}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
  };

  // 4. MCQ GAME INTERFACE (Full Screen Landscape Presentation)
  const renderMCQGame = () => {
    if (!currentActivity || !currentActivity.content?.questions) return null;
    const currentQ = currentActivity.content.questions[currentQuestionIndex];

    return (
        <div className="fixed inset-0 z-50 bg-[#0d1b3e] flex flex-col overflow-y-auto">
            {/* Game Header */}
            <div className="w-full h-20 bg-black/30 backdrop-blur-md border-b border-white/10 flex items-center px-4 md:px-8 justify-between sticky top-0 z-10">
                 <div className="flex items-center gap-4">
                     <button 
                        onClick={exitGame}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                     >
                        <ArrowRight className="w-5 h-5" />
                        <span className="hidden sm:inline">خروج</span>
                     </button>
                     <div className="h-6 w-px bg-white/10"></div>
                     <h2 className="text-white font-bold text-lg truncate max-w-[200px]">{currentActivity.title}</h2>
                 </div>

                 <div className="flex items-center gap-4">
                     <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-full border border-white/10">
                        <span className="text-gray-400 text-sm">السؤال</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-white font-bold text-lg">{currentQuestionIndex + 1}</span>
                            <span className="text-gray-500 text-xs">/ {currentActivity.content.questions.length}</span>
                        </div>
                     </div>
                     <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold text-lg min-w-[100px] justify-center transition-colors ${timeLeft < 10 ? 'bg-red-500/20 text-red-500 animate-pulse border border-red-500/50' : 'bg-labPrimary/20 text-labPrimary border border-labPrimary/30'}`}>
                        <Clock className="w-4 h-4" />
                        {timeLeft}
                     </div>
                 </div>
            </div>

            {/* Progress Line */}
            <div className="w-full h-1 bg-white/5">
                <div 
                    className="h-full bg-gradient-to-r from-labPrimary to-labSecondary transition-all duration-500 ease-out"
                    style={{ width: `${((currentQuestionIndex) / currentActivity.content.questions.length) * 100}%` }}
                ></div>
            </div>

            {/* Main Content Area - Center Stage */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-12 min-h-[600px]">
                 <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
                    
                    {/* Question */}
                    <div className="w-full text-center mb-12 animate-fade-in-up">
                        {currentQ.questionImage && (
                            <div className="mb-8 h-[250px] flex items-center justify-center">
                                <img 
                                    src={currentQ.questionImage} 
                                    alt="Question" 
                                    className="h-full max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
                                />
                            </div>
                        )}
                        <h1 className="text-3xl md:text-5xl font-bold text-white leading-relaxed drop-shadow-lg">
                            {currentQ.questionText}
                        </h1>
                    </div>

                    {/* Options - Wide Grid */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up delay-100">
                        {currentQ.options.map((option, idx) => {
                             let buttonClass = "bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10 hover:border-white/30"; // Default
                                
                             if (selectedOption !== null) {
                                 if (idx === currentQ.correctOptionIndex) {
                                     buttonClass = "bg-green-500 text-white border-green-400 shadow-[0_0_30px_rgba(34,197,94,0.4)] scale-[1.02] z-10"; 
                                 } else if (idx === selectedOption) {
                                     buttonClass = "bg-red-500 text-white border-red-400 opacity-90";
                                 } else {
                                     buttonClass = "bg-black/20 text-gray-600 border-transparent opacity-50 cursor-not-allowed";
                                 }
                             }

                             return (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionClick(idx)}
                                    disabled={selectedOption !== null}
                                    className={`relative group p-6 md:p-8 rounded-2xl text-xl md:text-2xl font-bold transition-all duration-300 flex items-center justify-between overflow-hidden ${buttonClass}`}
                                >
                                    <span className="relative z-10">{option}</span>
                                    
                                    {/* Selection Indicator */}
                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center relative z-10 ${selectedOption !== null && idx === currentQ.correctOptionIndex ? 'border-white bg-white/20' : 'border-white/20 group-hover:border-white/60'}`}>
                                        {selectedOption !== null && idx === currentQ.correctOptionIndex && <CheckCircle className="w-5 h-5 text-white" />}
                                    </div>

                                    {/* Hover Effect (only if active) */}
                                    {selectedOption === null && (
                                        <div className="absolute inset-0 bg-white/5 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                                    )}
                                </button>
                             );
                        })}
                    </div>

                 </div>
            </div>
        </div>
    );
  };

  // 5. FINISHED SCREEN
  const renderFinished = () => (
    <div className="fixed inset-0 z-50 bg-[#0d1b3e] flex items-center justify-center p-4">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-12 max-w-2xl w-full text-center relative overflow-hidden animate-scale-in shadow-2xl">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-labPrimary/20 rounded-full blur-[100px]"></div>
            
            <div className="relative z-10">
                <div className="w-32 h-32 mx-auto mb-8 relative">
                    <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
                    <Award className="w-32 h-32 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                </div>

                <h2 className="text-5xl font-black text-white mb-4">أداء مذهل!</h2>
                <p className="text-gray-300 text-xl mb-10">لقد أكملت النشاط "{currentActivity?.title}"</p>

                <div className="flex justify-center gap-6 mb-12">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl min-w-[150px]">
                        <div className="text-sm text-gray-400 mb-2 uppercase tracking-wider">النقاط</div>
                        <div className="text-5xl font-black text-labPrimary">{score}</div>
                    </div>
                    {/* Show Level only for blast */}
                    {currentActivity?.type === 'blast' && (
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl min-w-[150px]">
                            <div className="text-sm text-gray-400 mb-2 uppercase tracking-wider">المستوى</div>
                            <div className="text-5xl font-black text-labSecondary">{blastLevel}</div>
                        </div>
                    )}
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl min-w-[150px]">
                        <div className="text-sm text-gray-400 mb-2 uppercase tracking-wider">الجولات</div>
                        <div className="text-5xl font-black text-white">{currentActivity?.content?.questions?.length}</div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                        onClick={() => handleStartActivity(currentActivity!)}
                        className="px-8 py-4 bg-labPrimary hover:bg-purple-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2"
                    >
                        <RefreshCcw className="w-5 h-5" />
                        إعادة المحاولة
                    </button>
                    <button 
                        onClick={exitGame}
                        className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl font-bold transition-all"
                    >
                        العودة للقائمة
                    </button>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <>
        {gameStatus === 'idle' && (
            <div className="min-h-screen bg-labDark font-cairo">
                {renderHeader()}
                {renderActivityList()}
            </div>
        )}

        {gameStatus === 'playing' && currentActivity?.type === 'wheel' && renderWheelGame()}
        {gameStatus === 'playing' && currentActivity?.type === 'blast' && renderBlastGame()}
        {gameStatus === 'playing' && currentActivity?.type !== 'wheel' && currentActivity?.type !== 'blast' && renderMCQGame()}
        
        {gameStatus === 'finished' && renderFinished()}
    </>
  );
};