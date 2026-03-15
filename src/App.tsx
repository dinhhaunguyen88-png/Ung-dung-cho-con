/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { GraduationCap, LogOut } from 'lucide-react';

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
import { TeacherLogin } from './components/auth/TeacherLogin';
import { TeacherRegister } from './components/auth/TeacherRegister';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { ClassManager } from './components/teacher/ClassManager';
import { JoinClass } from './components/auth/JoinClass';

export default function App() {
  const { t } = useTranslation();
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [currentSubject, setCurrentSubject] = useState<string>('math');
  const [showCelebration, setShowCelebration] = useState(false);
  const [stars, setStars] = useState(1240);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedClassName, setSelectedClassName] = useState<string>('');
  const { user, login, logout, isTeacher } = useUser();
  const { pet, setType, setColor, setName, toggleAccessory, addXp } = usePet(user?.id);

  // Simple routing logic based on URL on mount
  useState(() => {
    const path = window.location.pathname;
    if (path === '/teacher') setCurrentScreen('teacher-login');
    else if (path === '/teacher/register') setCurrentScreen('teacher-register');
    else if (path === '/join') setCurrentScreen('join-class');
  });

  // Redirect to profile setup if not logged in
  if (!user && currentScreen !== 'profile-setup' && currentScreen !== 'teacher-login' && currentScreen !== 'teacher-register') {
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

  const handleTeacherAuth = (userData: any) => {
    login(userData);
    setCurrentScreen('teacher-dashboard');
  };

  const handleLogout = () => {
    logout();
    setCurrentScreen('profile-setup');
  };

  const handleJoinSuccess = (className: string) => {
    alert(t('joinClass.success', { className }));
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
      {/* Only show student header for student screens */}
      {currentScreen !== 'teacher-login' && currentScreen !== 'teacher-register' && currentScreen !== 'teacher-dashboard' && currentScreen !== 'join-class' && (
        <Header
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          stars={stars}
        />
      )}

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
                onJoinClass={() => setCurrentScreen('join-class')}
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
              <ProfileSetup
                onComplete={handleProfileComplete}
                onTeacherLogin={() => setCurrentScreen('teacher-login')}
              />
            </motion.div>
          )}

          {currentScreen === 'teacher-login' && (
            <motion.div
              key="teacher-login"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="w-full"
            >
              <TeacherLogin
                onLogin={handleTeacherAuth}
                onNavigate={(screen) => setCurrentScreen(screen as Screen)}
              />
            </motion.div>
          )}

          {currentScreen === 'teacher-register' && (
            <motion.div
              key="teacher-register"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="w-full"
            >
              <TeacherRegister
                onRegister={handleTeacherAuth}
                onNavigate={(screen) => setCurrentScreen(screen as Screen)}
              />
            </motion.div>
          )}

          {currentScreen === 'join-class' && (
            <motion.div
              key="join-class"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full"
            >
              <JoinClass
                userId={user?.id || ''}
                onBack={() => setCurrentScreen('dashboard')}
                onSuccess={handleJoinSuccess}
              />
            </motion.div>
          )}

          {currentScreen === 'teacher-dashboard' && (
            <motion.div
              key="teacher-dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <div className="mx-auto max-w-4xl">
                {/* Teacher Dashboard Header */}
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                      <GraduationCap className="h-7 w-7" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-slate-800">{t('teacherDashboard.title')}</h1>
                      <p className="text-slate-500">{t('teacherDashboard.welcome', { name: user?.name })}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>

                {selectedClassId ? (
                  <ClassManager
                    classId={selectedClassId}
                    className={selectedClassName}
                    onBack={() => setSelectedClassId(null)}
                  />
                ) : (
                  <TeacherDashboard
                    teacherId={user?.id || ''}
                    onViewClass={(id) => {
                      setSelectedClassId(id);
                      // Fetch logic for class name could be here or in component
                      // For now, let's keep it simple
                    }}
                  />
                )}
              </div>
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

