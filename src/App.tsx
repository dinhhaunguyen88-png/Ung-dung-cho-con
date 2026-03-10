/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import type { Screen } from './types';
import { Header } from './components/layout/Header';
import { DashboardSidebar } from './components/dashboard/DashboardSidebar';
import { DashboardMain } from './components/dashboard/DashboardMain';
import { DashboardRight } from './components/dashboard/DashboardRight';
import { LearningQuest } from './components/learning/LearningQuest';
import { PetRoom } from './components/pet/PetRoom';
import { ParentReport } from './components/parent/ParentReport';
import { CelebrationModal } from './components/ui/CelebrationModal';
import { Leaderboard } from './components/leaderboard/Leaderboard';
import { usePet } from './hooks/usePet';
import { useUser } from './hooks/useUser';
import { getUser } from './services/api';
import { ProfileSetup } from './components/auth/ProfileSetup';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [currentSubject, setCurrentSubject] = useState<string>('math');
  const [showCelebration, setShowCelebration] = useState(false);
  const [stars, setStars] = useState(1240);
  const { user, login } = useUser();
  const { pet, setType, setColor, setName, toggleAccessory, addXp } = usePet(user?.id);

  // Redirect to profile setup if not logged in
  if (!user && currentScreen !== 'profile-setup') {
    setCurrentScreen('profile-setup');
  }

  const handleProfileComplete = (userData: any) => {
    login(userData);
    // Sync initial pet config if needed
    setName(userData.name);
    setType(userData.avatar);
    setColor(userData.avatar_color);
    setCurrentScreen('dashboard');
  };

  const handleGoalComplete = async () => {
    setShowCelebration(true);
    setCurrentScreen('dashboard');
    // Refresh user data to get updated XP/level from backend
    if (user?.id) {
      try {
        const freshUser = await getUser(user.id);
        login(freshUser);
      } catch { /* keep current data */ }
    }
  };

  const handleStartQuest = (subject: string) => {
    setCurrentSubject(subject);
    setCurrentScreen('learning');
  };

  return (
    <div className="min-h-screen bg-background-light font-sans text-slate-900">
      <Header
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        stars={stars}
      />

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
              <DashboardSidebar xp={pet.xp} onGoalComplete={handleGoalComplete} />
              <DashboardMain
                pet={pet}
                onFeed={() => setStars((s) => s - 10)}
                onPlay={() => addXp(20)}
                onStartQuest={handleStartQuest}
              />
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
              <LearningQuest
                subject={currentSubject}
                userId={user?.id || null}
                onComplete={handleGoalComplete}
                onBack={() => setCurrentScreen('dashboard')}
              />
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
              <PetRoom
                onBack={() => setCurrentScreen('dashboard')}
                pet={pet}
                onSetType={setType}
                onSetColor={setColor}
                onSetName={setName}
                onToggleAccessory={toggleAccessory}
              />
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

          {currentScreen === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="w-full"
            >
              <Leaderboard />
            </motion.div>
          )}

          {currentScreen === 'profile-setup' && (
            <motion.div
              key="profile-setup"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full"
            >
              <ProfileSetup onComplete={handleProfileComplete} />
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
