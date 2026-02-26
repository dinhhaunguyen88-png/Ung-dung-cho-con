/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  BookOpen, 
  Dog, 
  Users, 
  Settings, 
  Star, 
  LayoutDashboard, 
  Trophy, 
  ShoppingBag,
  ChevronRight,
  Utensils,
  Gamepad2,
  Lightbulb,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  SkipForward,
  X,
  Plus,
  Heart,
  Camera,
  School,
  History,
  TrendingUp,
  BrainCircuit,
  Share2,
  Gift,
  Ticket,
  ThumbsUp,
  Volume2
} from 'lucide-react';

type Screen = 'dashboard' | 'learning' | 'pet-room' | 'parent-report';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [showCelebration, setShowCelebration] = useState(false);
  const [xp, setXp] = useState(850);
  const [stars, setStars] = useState(1240);

  const handleGoalComplete = () => {
    setShowCelebration(true);
  };

  return (
    <div className="min-h-screen bg-background-light font-sans text-slate-900">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-primary/10 bg-white/80 px-6 py-4 backdrop-blur-md lg:px-10">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary p-2 text-white shadow-lg shadow-primary/20">
            <School size={24} />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">Math Buddy</h2>
        </div>

        <nav className="hidden flex-1 justify-center gap-2 md:flex">
          <NavButton 
            active={currentScreen === 'dashboard'} 
            onClick={() => setCurrentScreen('dashboard')}
            icon={<Home size={20} />}
            label="Home"
          />
          <NavButton 
            active={currentScreen === 'learning'} 
            onClick={() => setCurrentScreen('learning')}
            icon={<BookOpen size={20} />}
            label="Learning"
          />
          <NavButton 
            active={currentScreen === 'pet-room'} 
            onClick={() => setCurrentScreen('pet-room')}
            icon={<Dog size={20} />}
            label="Pet Room"
          />
          <NavButton 
            active={currentScreen === 'parent-report'} 
            onClick={() => setCurrentScreen('parent-report')}
            icon={<Users size={20} />}
            label="Parents"
          />
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-full border border-yellow-200 bg-yellow-100 px-3 py-1.5 shadow-sm">
            <Star size={18} className="mr-1 fill-yellow-500 text-yellow-600" />
            <span className="text-sm font-bold text-yellow-800">{stars.toLocaleString()}</span>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200">
            <Settings size={20} />
          </button>
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary bg-primary/20">
            <img 
              src="https://picsum.photos/seed/student/100/100" 
              alt="Avatar" 
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] p-6 lg:p-10">
        <AnimatePresence mode="wait">
          {currentScreen === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-8 lg:flex-row"
            >
              <DashboardSidebar xp={xp} onGoalComplete={handleGoalComplete} />
              <DashboardMain onFeed={() => setStars(s => s - 10)} onPlay={() => setXp(x => x + 20)} />
              <DashboardRight />
            </motion.div>
          )}

          {currentScreen === 'learning' && (
            <motion.div 
              key="learning"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full"
            >
              <LearningQuest onComplete={handleGoalComplete} onBack={() => setCurrentScreen('dashboard')} />
            </motion.div>
          )}

          {currentScreen === 'pet-room' && (
            <motion.div 
              key="pet-room"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full"
            >
              <PetRoom onBack={() => setCurrentScreen('dashboard')} />
            </motion.div>
          )}

          {currentScreen === 'parent-report' && (
            <motion.div 
              key="parent-report"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="w-full"
            >
              <ParentReport />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <CelebrationModal onClose={() => setShowCelebration(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full px-4 py-2 font-bold transition-all ${
        active 
          ? 'bg-primary/10 text-primary' 
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      {icon} {label}
    </button>
  );
}

function DashboardSidebar({ xp, onGoalComplete }: { xp: number, onGoalComplete: () => void }) {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-6 lg:w-72">
      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-emerald-400 text-xl font-bold text-white shadow-lg shadow-primary/20">
            5
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Level 5</h3>
            <p className="text-sm text-slate-500">Math Explorer</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="mb-1 flex justify-between px-1 text-xs font-bold">
            <span className="uppercase text-slate-600">Experience</span>
            <span className="text-primary">{xp} / 1000 XP</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(xp / 1000) * 100}%` }}
              className="h-full bg-primary"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 rounded-xl border border-slate-100 bg-white p-2 shadow-sm">
        <SidebarNavButton active icon={<LayoutDashboard size={20} />} label="Dashboard" />
        <SidebarNavButton icon={<BookOpen size={20} />} label="Curriculum (CTST)" />
        <SidebarNavButton icon={<Trophy size={20} />} label="Achievements" />
        <SidebarNavButton icon={<ShoppingBag size={20} />} label="Pet Shop" />
      </div>

      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-dragon-orange to-orange-600 p-6 text-white shadow-xl">
        <div className="relative z-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider">New Arrival</p>
          <h4 className="mb-4 text-lg font-bold">Dragon Wings Decoration</h4>
          <button 
            onClick={onGoalComplete}
            className="rounded-full bg-white px-4 py-2 text-sm font-bold text-orange-600 shadow-md transition-transform hover:scale-105 active:scale-95"
          >
            View Shop
          </button>
        </div>
        <ShoppingBag className="absolute -bottom-4 -right-4 h-24 w-24 rotate-12 opacity-20" />
      </div>
    </aside>
  );
}

function SidebarNavButton({ active, icon, label }: { active?: boolean, icon: ReactNode, label: string }) {
  return (
    <button className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 font-medium transition-all ${
      active ? 'bg-primary/10 font-bold text-primary' : 'text-slate-600 hover:bg-slate-50'
    }`}>
      {icon} {label}
    </button>
  );
}

function DashboardMain({ onFeed, onPlay }: { onFeed: () => void, onPlay: () => void }) {
  return (
    <section className="flex flex-1 flex-col gap-6">
      <div className="relative min-h-[500px] flex-1 overflow-hidden rounded-xl border-4 border-white bg-gradient-to-b from-blue-100 to-green-100 shadow-2xl">
        {/* Background Clouds */}
        <div className="absolute left-10 top-10 opacity-60">
          <div className="h-16 w-24 rounded-full bg-white/80 blur-md" />
        </div>
        <div className="absolute right-20 top-20 opacity-40">
          <div className="h-20 w-32 rounded-full bg-white/80 blur-lg" />
        </div>

        {/* The Island */}
        <div className="absolute inset-0 flex items-center justify-center island-float">
          <div className="relative">
            <div className="h-32 w-80 translate-y-24 scale-x-125 rounded-full bg-green-500 opacity-20 blur-sm" />
            <div className="relative flex h-32 w-80 items-end justify-center overflow-hidden rounded-full border-b-8 border-emerald-800 bg-gradient-to-b from-green-400 to-emerald-700 shadow-2xl">
              <div className="absolute top-0 h-8 w-full rounded-full bg-green-300/40" />
              <div className="mb-4">
                <motion.img 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  src="https://picsum.photos/seed/dragon/200/200" 
                  alt="Sparky the Dragon" 
                  className="h-48 w-48 drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pet Status UI */}
        <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
          <div className="w-72 space-y-4 rounded-xl border border-white/50 bg-white/90 p-5 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900">Sparky</h4>
              <span className="rounded-md bg-orange-100 px-2 py-0.5 text-[10px] font-bold uppercase text-orange-600">Fire Dragon</span>
            </div>
            <div className="space-y-3">
              <StatusProgress label="Hunger" value={80} color="bg-red-500" icon={<Utensils size={12} />} />
              <StatusProgress label="Happiness" value={95} color="bg-yellow-500" icon={<Heart size={12} />} />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <PetActionButton onClick={onFeed} icon={<Utensils size={32} />} label="Feed" color="bg-red-100 text-red-500" />
            <PetActionButton onClick={onPlay} icon={<Gamepad2 size={32} />} label="Play" color="bg-blue-100 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ActivityCard 
          icon={<BookOpen size={32} />} 
          title="Current Chapter" 
          subtitle="Numbers up to 1000" 
          action="Continue Lesson"
          color="bg-quest-purple text-purple-600"
        />
        <ActivityCard 
          icon={<BrainCircuit size={32} />} 
          title="Math Practice" 
          subtitle="Addition & Subtraction" 
          action="Start Training"
          color="bg-primary/20 text-primary"
        />
      </div>
    </section>
  );
}

function StatusProgress({ label, value, color, icon }: { label: string, value: number, color: string, icon: ReactNode }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="flex items-center gap-1 font-medium text-slate-600">
          {icon} {label}
        </span>
        <span className="font-bold text-slate-900">{value}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-200">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

function PetActionButton({ onClick, icon, label, color }: { onClick: () => void, icon: ReactNode, label: string, color: string }) {
  return (
    <button 
      onClick={onClick}
      className="group flex flex-col items-center gap-1"
    >
      <div className={`flex h-16 w-16 items-center justify-center rounded-full border-4 border-white shadow-lg transition-all group-hover:scale-110 group-active:scale-95 ${color}`}>
        {icon}
      </div>
      <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-slate-700 backdrop-blur-sm">{label}</span>
    </button>
  );
}

function ActivityCard({ icon, title, subtitle, action, color }: { icon: ReactNode, title: string, subtitle: string, action: string, color: string }) {
  return (
    <div className="flex items-center gap-5 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${color}`}>
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-slate-900">{title}</h4>
        <p className="text-sm text-slate-500">{subtitle}</p>
        <button className="mt-1 inline-block text-xs font-bold text-primary hover:underline">{action}</button>
      </div>
    </div>
  );
}

function DashboardRight() {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-6 lg:w-80">
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="bg-quest-purple p-6">
          <h3 className="flex items-center gap-2 text-lg font-bold text-purple-900">
            <LayoutDashboard size={20} /> Daily Quest
          </h3>
          <p className="text-sm text-purple-700">Complete tasks to earn treats!</p>
        </div>
        <div className="space-y-4 p-4">
          <QuestItem title="Quick Addition" progress="3/5" xp={50} percent={60} />
          <QuestItem title="Shape Hunter" progress="1/5" xp={80} percent={20} />
          <QuestItem title="Morning Math" progress="Done" xp={0} percent={100} completed />
          <button className="w-full rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200">
            Show All Tasks
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-blue-100 bg-blue-50 p-6">
        <Lightbulb className="absolute -right-4 -top-4 h-24 w-24 -rotate-12 text-blue-200/40" />
        <h3 className="relative z-10 mb-2 font-bold text-blue-900">Tip of the Day</h3>
        <p className="relative z-10 text-sm leading-relaxed text-blue-700">
          Try counting by 10s! It makes adding big numbers much faster and easier.
        </p>
      </div>
    </aside>
  );
}

function QuestItem({ title, progress, xp, percent, completed }: { title: string, progress: string, xp: number, percent: number, completed?: boolean }) {
  return (
    <div className={`flex cursor-pointer flex-col gap-3 rounded-xl border p-4 transition-all hover:border-primary/50 ${
      completed ? 'bg-primary/5 border-primary/20 opacity-75' : 'bg-slate-50 border-slate-100'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h5 className={`text-sm font-bold text-slate-900 ${completed ? 'line-through' : ''}`}>{title}</h5>
          <p className="text-xs text-slate-500">{progress}</p>
        </div>
        {completed ? (
          <span className="flex items-center gap-1 rounded bg-primary px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
            <CheckCircle2 size={10} /> DONE
          </span>
        ) : (
          <span className="flex items-center gap-1 rounded bg-yellow-100 px-2 py-0.5 text-[10px] font-bold text-yellow-700">
            <Star size={10} className="fill-yellow-500" /> {xp}
          </span>
        )}
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-200">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          className="h-full rounded-full bg-primary"
        />
      </div>
    </div>
  );
}

function LearningQuest({ onComplete, onBack }: { onComplete: () => void, onBack: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);

  const choices = [
    { id: 1, value: 53, label: 'A', color: 'bg-pink-300', shadow: 'shadow-[0_10px_0_0_#e6a1bc]' },
    { id: 2, value: 63, label: 'B', color: 'bg-orange-300', shadow: 'shadow-[0_10px_0_0_#e6c8a7]' },
    { id: 3, value: 58, label: 'C', color: 'bg-yellow-200', shadow: 'shadow-[0_10px_0_0_#e6e6a7]' },
    { id: 4, value: 65, label: 'D', color: 'bg-blue-300', shadow: 'shadow-[0_10px_0_0_#a8cbe6]' },
  ];

  const handleNext = () => {
    if (selected === 2) {
      onComplete();
    } else {
      alert("Try again! 25 + 38 = 63");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 w-full rounded-xl border-2 border-primary/5 bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="text-primary" />
            <p className="text-lg font-bold text-slate-900">Quest Progress</p>
          </div>
          <p className="text-sm font-bold text-slate-600">3 / 5 Solved</p>
        </div>
        <div className="h-4 w-full overflow-hidden rounded-full border border-slate-200 bg-slate-100">
          <div className="h-full bg-primary" style={{ width: '60%' }} />
        </div>
        <p className="mt-3 flex items-center gap-1 text-sm font-semibold text-primary">
          <Star size={14} className="fill-primary" />
          2 more correct answers to earn a 'Food Bag'!
        </p>
      </div>

      <div className="relative w-full">
        <div className="absolute -top-12 right-10 z-10 flex animate-bounce flex-col items-center">
          <div className="relative mb-2 rounded-2xl border-2 border-primary bg-white p-3 shadow-lg">
            <p className="text-sm font-bold text-slate-800">You can do it! 🐾</p>
            <div className="absolute -bottom-2 right-6 h-4 w-4 rotate-45 border-b-2 border-r-2 border-primary bg-white" />
          </div>
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-yellow-100 shadow-md">
            <img src="https://picsum.photos/seed/cat/100/100" alt="Cheerleader" className="h-20 w-20 object-contain" referrerPolicy="no-referrer" />
          </div>
        </div>

        <div className="relative mb-12 flex w-full flex-col items-center justify-center overflow-hidden rounded-3xl border-8 border-blue-100 bg-white p-12 text-center shadow-xl md:p-20">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-blue-50" />
          <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-blue-50" />
          <h3 className="mb-4 text-xl font-bold uppercase tracking-widest text-slate-500">Question 4</h3>
          <h1 className="mb-6 text-6xl font-black text-slate-900 drop-shadow-sm md:text-8xl">25 + 38 = ?</h1>
          <p className="text-lg font-medium text-slate-600 md:text-xl">Choose the tasty fruit with the correct answer!</p>
        </div>

        <div className="grid w-full grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {choices.map((choice) => (
            <button 
              key={choice.id}
              onClick={() => setSelected(choice.id)}
              className={`group relative flex flex-col items-center transition-all hover:scale-105 active:scale-95 ${
                selected === choice.id ? 'scale-110' : ''
              }`}
            >
              <div className={`relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-white md:h-44 md:w-44 ${choice.color} ${choice.shadow}`}>
                <span className="text-4xl font-black text-white drop-shadow-md md:text-5xl">{choice.value}</span>
              </div>
              <div className={`mt-4 rounded-full border-2 bg-white px-6 py-2 shadow-sm transition-colors ${
                selected === choice.id ? 'border-primary bg-primary/10' : `border-${choice.color.split('-')[1]}-300`
              }`}>
                <span className={`text-xl font-extrabold ${
                  selected === choice.id ? 'text-primary' : `text-${choice.color.split('-')[1]}-400`
                }`}>{choice.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <footer className="mt-16 flex w-full items-center justify-between rounded-2xl bg-white p-4 shadow-inner">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 font-bold text-slate-500 transition-colors hover:text-primary"
        >
          <ArrowLeft size={20} /> Quit Lesson
        </button>
        <div className="flex gap-4">
          <button className="rounded-full bg-slate-200 px-8 py-3 font-bold text-slate-600 transition-colors hover:bg-slate-300">Skip</button>
          <button 
            onClick={handleNext}
            className="flex items-center gap-2 rounded-full bg-primary px-10 py-3 font-bold text-white shadow-lg shadow-primary/30 transition-all hover:brightness-110"
          >
            Next Question <ArrowRight size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
}

function PetRoom({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'wardrobe' | 'pantry' | 'toys'>('wardrobe');

  const items = [
    { id: 1, name: 'Party Hat', img: 'https://picsum.photos/seed/hat/100/100' },
    { id: 2, name: 'Sunglasses', img: 'https://picsum.photos/seed/glass/100/100' },
    { id: 3, name: 'Balloon', img: 'https://picsum.photos/seed/balloon/100/100' },
    { id: 4, name: 'Winter Hat', img: 'https://picsum.photos/seed/winter/100/100' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="mb-1 flex items-center gap-2">
            <button onClick={onBack} className="text-sm font-medium text-primary hover:underline">Dashboard</button>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-sm font-medium text-slate-400">Pet Care</span>
          </div>
          <h1 className="flex items-center gap-3 text-3xl font-black text-slate-900">
            Pet Dressing Room
            <span className="rounded-md bg-blue-100 px-2 py-1 text-xs uppercase tracking-tighter text-blue-600">Level 12</span>
          </h1>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex w-32 flex-col gap-1">
            <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500"><span>Happiness</span><span>85%</span></div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full bg-primary" style={{ width: '85%' }} />
            </div>
          </div>
          <div className="flex w-32 flex-col gap-1">
            <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500"><span>Energy</span><span>60%</span></div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full bg-yellow-500" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl border-4 border-white bg-gradient-to-b from-blue-100 to-white shadow-xl">
            <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-multiply" style={{ backgroundImage: "url('https://picsum.photos/seed/garden/800/600')" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <img src="https://picsum.photos/seed/dragon/300/300" alt="Pet" className="h-64 w-64 object-contain" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-4">
              <PetControlIcon icon={<Gamepad2 size={24} />} />
              <PetControlIcon icon={<Heart size={24} />} primary />
              <PetControlIcon icon={<Camera size={24} />} />
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-slate-100 bg-white p-6">
            <h3 className="mb-2 text-lg font-bold">Pet Diary</h3>
            <p className="leading-relaxed text-slate-600">
              Dino is feeling <span className="font-bold text-primary">Great</span> today! You have answered <span className="font-bold text-yellow-500">15 math questions</span> correctly this week to keep him happy. Dino's favorite food is <span className="font-bold">Magic Apples</span>.
            </p>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-100 bg-white">
            <div className="flex border-b border-slate-100">
              <InventoryTab active={activeTab === 'wardrobe'} onClick={() => setActiveTab('wardrobe')} icon={<ShoppingBag size={20} />} label="Wardrobe" />
              <InventoryTab active={activeTab === 'pantry'} onClick={() => setActiveTab('pantry')} icon={<Utensils size={20} />} label="Pantry" />
              <InventoryTab active={activeTab === 'toys'} onClick={() => setActiveTab('toys')} icon={<Gamepad2 size={20} />} label="Toys" />
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <h4 className="mb-3 text-sm font-black uppercase tracking-widest text-slate-400">Accessories (8)</h4>
              <div className="grid grid-cols-3 gap-3">
                {items.map(item => (
                  <div key={item.id} className="group relative flex aspect-square cursor-grab items-center justify-center rounded-xl border-2 border-transparent bg-slate-50 p-3 transition-all hover:border-primary active:cursor-grabbing">
                    <img src={item.img} alt={item.name} className="h-full w-full object-contain" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="rounded bg-white px-2 py-0.5 text-[10px] font-bold text-primary shadow-sm">DRAG</span>
                    </div>
                  </div>
                ))}
                <LockedItem label="Solve 20 More" />
                <LockedItem label="Level 15" />
              </div>

              <h4 className="mb-3 mt-8 text-sm font-black uppercase tracking-widest text-slate-400">Food & Snacks (3)</h4>
              <div className="grid grid-cols-3 gap-3">
                <FoodItem img="https://picsum.photos/seed/apple/100/100" count={5} />
                <FoodItem img="https://picsum.photos/seed/cookie/100/100" count={2} />
                <FoodItem img="https://picsum.photos/seed/milk/100/100" count={8} />
              </div>
            </div>
            <div className="border-t border-slate-100 bg-slate-50 p-4">
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90">
                <ShoppingBag size={20} /> Visit Pet Shop
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PetControlIcon({ icon, primary }: { icon: ReactNode, primary?: boolean }) {
  return (
    <button className={`rounded-full p-4 shadow-lg transition-transform hover:scale-110 ${
      primary ? 'bg-primary text-white shadow-primary/40' : 'bg-white/90 text-slate-700 backdrop-blur'
    }`}>
      {icon}
    </button>
  );
}

function InventoryTab({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-1 py-4 transition-all border-b-4 ${
        active ? 'border-primary bg-primary/5 text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'
      }`}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase">{label}</span>
    </button>
  );
}

function LockedItem({ label }: { label: string }) {
  return (
    <div className="relative flex aspect-square items-center justify-center rounded-xl bg-slate-200 p-3 opacity-60 grayscale">
      <div className="flex flex-col items-center gap-1">
        <X size={20} className="text-slate-600" />
        <span className="text-[8px] font-black uppercase text-slate-600">{label}</span>
      </div>
    </div>
  );
}

function FoodItem({ img, count }: { img: string, count: number }) {
  return (
    <div className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-transparent bg-yellow-50 p-3 transition-all hover:border-yellow-400">
      <img src={img} alt="Food" className="mb-1 h-12 w-12 object-contain" referrerPolicy="no-referrer" />
      <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-black text-yellow-400">x{count}</span>
    </div>
  );
}

function ParentReport() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Parent Progress Report</h1>
        <p className="font-medium text-secondary">Tracking Grade 2 Math Journey • Term 1, 2024</p>
      </div>

      <div className="flex flex-col items-center gap-6 rounded-xl border border-primary/10 bg-white p-6 shadow-sm md:flex-row">
        <div className="h-32 w-32 rounded-full border-4 border-primary/20 p-1">
          <img src="https://picsum.photos/seed/kid/200/200" alt="Student" className="h-full w-full rounded-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-slate-900">Nguyễn Minh Anh</h2>
          <div className="mt-2 flex flex-wrap justify-center gap-4 md:justify-start">
            <div className="flex items-center gap-2 text-secondary">
              <Trophy size={20} />
              <span className="font-medium">Level: Explorer (Grade 2)</span>
            </div>
            <div className="flex items-center gap-2 text-secondary">
              <CheckCircle2 size={20} />
              <span className="font-medium">142 Quests Completed</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="rounded-lg border border-primary/20 bg-primary/10 px-6 py-2.5 font-bold text-secondary transition-all hover:bg-primary/20">
            View Detailed Stats
          </button>
          <button className="rounded-lg border border-primary/20 p-2.5 text-secondary hover:bg-slate-50">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-primary/10 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <TrendingUp className="rounded-lg bg-primary/10 p-2 text-primary" size={40} />
            <h3 className="text-lg font-bold">Learning Progress</h3>
          </div>
          <div className="flex flex-col items-center py-4">
            <div className="relative h-40 w-40">
              <svg className="h-full w-full -rotate-90 transform">
                <circle className="text-slate-100" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="12" />
                <circle className="text-primary" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset="154" strokeWidth="12" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900">65%</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">Complete</span>
              </div>
            </div>
            <div className="mt-8 w-full space-y-4">
              <ProgressRow label="Numbers to 1000" value={90} />
              <ProgressRow label="Geometry & Measurement" value={45} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-primary/10 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <BrainCircuit className="rounded-lg bg-blue-100 p-2 text-blue-600" size={40} />
            <h3 className="text-lg font-bold">Performance Analysis</h3>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-secondary">Key Strengths</h4>
              <div className="space-y-3">
                <StrengthItem title="Addition within 100" level="Advanced" />
                <StrengthItem title="Comparing Lengths" level="Advanced" />
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-secondary">Focus Areas</h4>
              <div className="space-y-3">
                <FocusItem title="Identifying Cylinders" action="Practice recommended" />
                <FocusItem title="Subtraction with Regrouping" action="Video tutorial suggested" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-primary/10 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <History className="rounded-lg bg-primary/10 p-2 text-secondary" size={40} />
            <h3 className="text-lg font-bold">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            <ActivityItem title="Shapes Quest #42" time="Today, 10:45 AM" xp={50} score="9/10" reward="Silver Star" />
            <ActivityItem title="Numbers to 500 Review" time="Yesterday, 4:20 PM" xp={25} score="10/10" />
            <button className="w-full py-2 text-sm font-bold text-primary transition-all hover:underline">
              View All Activity
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-lg border border-primary/10 bg-primary/5 p-4">
        <Lightbulb className="text-primary" />
        <p className="text-sm leading-relaxed text-secondary">
          Minh Anh is performing above average for Grade 2. To further improve, encourage focusing on the <strong>Geometry</strong> section this week.
        </p>
      </div>
    </div>
  );
}

function ProgressRow({ label, value }: { label: string, value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm font-medium">
        <span>{label}</span>
        <span className="text-primary">{value}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full bg-primary" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function StrengthItem({ title, level }: { title: string, level: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50 p-3">
      <TrendingUp className="text-emerald-600" size={20} />
      <div className="flex-1">
        <p className="text-sm font-bold">{title}</p>
        <p className="text-[10px] font-medium text-emerald-600">Mastery Level: {level}</p>
      </div>
    </div>
  );
}

function FocusItem({ title, action }: { title: string, action: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-amber-100 bg-amber-50 p-3">
      <Lightbulb className="text-amber-600" size={20} />
      <div className="flex-1">
        <p className="text-sm font-bold">{title}</p>
        <p className="text-[10px] font-medium text-amber-600">Action: {action}</p>
      </div>
    </div>
  );
}

function ActivityItem({ title, time, xp, score, reward }: { title: string, time: string, xp: number, score: string, reward?: string }) {
  return (
    <div className="flex items-start gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
        <Gamepad2 size={20} />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <p className="text-sm font-bold">{title}</p>
          <span className="text-xs font-bold text-primary">+{xp} XP</span>
        </div>
        <p className="mb-2 text-[10px] text-secondary">{time}</p>
        <div className="flex items-center gap-2">
          <span className="rounded bg-blue-100 px-2 py-0.5 text-[8px] font-bold text-blue-700">Score: {score}</span>
          {reward && <span className="rounded bg-amber-100 px-2 py-0.5 text-[8px] font-bold text-amber-700">Reward: {reward}</span>}
        </div>
      </div>
    </div>
  );
}

function CelebrationModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-blue-100/60 p-4 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-[3.5rem] border-8 border-white bg-white/95 p-8 text-center shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] lg:p-14"
      >
        {/* Decorative Elements */}
        <div className="pointer-events-none absolute inset-0">
          <Star className="absolute left-10 top-10 animate-bounce text-yellow-400 opacity-60" size={40} />
          <Star className="absolute right-20 top-20 animate-pulse text-blue-400 opacity-60" size={32} />
          <Trophy className="absolute bottom-20 left-20 animate-bounce text-pink-400 opacity-60" size={40} />
          <Heart className="absolute right-10 top-1/2 animate-pulse text-purple-400 opacity-60" size={32} />
        </div>

        <div className="mb-10 flex h-48 items-end justify-center gap-12">
          <div className="animate-jump-joy relative">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-orange-100 shadow-lg">
              <Utensils size={64} className="text-orange-500" />
            </div>
          </div>
          <div className="relative">
            <Trophy size={130} className="text-yellow-400 drop-shadow-lg" />
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          <h1 className="text-4xl font-black tracking-tight text-blue-600 lg:text-5xl">
            Chúc mừng Minh Anh!
          </h1>
          <p className="mx-auto max-w-md text-lg font-medium text-slate-600 lg:text-xl">
            Con đã hoàn thành mục tiêu hàng tuần: <br/>
            <span className="text-2xl font-black text-primary drop-shadow-sm">10 bài toán cộng!</span>
          </p>
        </div>

        <div className="group relative mb-10 mt-8 overflow-hidden rounded-[2rem] border-2 border-dashed border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-100 p-8 shadow-md">
          <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400 px-5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-sm">
            Món Quà Đặc Biệt
          </div>
          <div className="relative z-10 flex items-center justify-center gap-6">
            <div className="rounded-2xl border border-yellow-200 bg-white p-4 shadow-inner">
              <Ticket size={48} className="text-orange-500" />
            </div>
            <div className="text-left">
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-orange-600">Thưởng từ Ba Mẹ:</p>
              <p className="text-2xl font-black leading-tight text-slate-800 lg:text-3xl">Đi xem phim cuối tuần!</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button 
            onClick={onClose}
            className="animate-extra-bounce group relative flex items-center gap-2 rounded-full border-b-4 border-green-600 bg-primary px-16 py-6 text-3xl font-black text-white shadow-[0_12px_0_0_#22c55e] transition-all duration-75 hover:bg-green-400 active:translate-y-2 active:shadow-none"
          >
            Tuyệt vời! <ThumbsUp size={36} />
          </button>
          <p className="mt-4 text-sm font-medium text-slate-400">Nhấn để tiếp tục hành trình</p>
        </div>
      </motion.div>
    </div>
  );
}
