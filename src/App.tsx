/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { GraduationCap, LogOut } from 'lucide-react';

import type { Screen } from './types';
import { HeaderInteractive } from './components/layout/HeaderInteractive';
import { DashboardSidebar } from './components/dashboard/DashboardSidebar';
import { DashboardMain } from './components/dashboard/DashboardMain';
import { DashboardRight } from './components/dashboard/DashboardRight';
import { LearningQuest } from './components/learning/LearningQuest';
import { PetRoom } from './components/pet/PetRoom';
import { ParentReport } from './components/parent/ParentReport';
import { CelebrationModal } from './components/ui/CelebrationModal';
import { LeaderboardV2 } from './components/leaderboard/LeaderboardV2';
import { usePet } from './hooks/usePet';
import { useUser } from './hooks/useUser';
import { getUser, updateUser as updateUserProfile } from './services/api';
import { ProfileSetup } from './components/auth/ProfileSetup';
import { TeacherLogin } from './components/auth/TeacherLogin';
import { TeacherRegister } from './components/auth/TeacherRegister';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { ClassManager } from './components/teacher/ClassManager';
import { JoinClass } from './components/auth/JoinClass';
import { PetShop } from './components/pet/PetShop';
import type { StudentAssignmentData } from './services/api';

export default function App() {
  const { t } = useTranslation();
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [currentSubject, setCurrentSubject] = useState<string>('math');
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedClassName, setSelectedClassName] = useState<string>('');
  const [currentTopic, setCurrentTopic] = useState<string | undefined>(undefined);
  const [currentQuestionLimit, setCurrentQuestionLimit] = useState(15);
  const [currentQuestTitle, setCurrentQuestTitle] = useState<string | undefined>(undefined);
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

  const handleSaveSettings = async ({
    name,
    petName,
    petType,
    petColor,
  }: {
    name: string;
    petName: string;
    petType: typeof pet.type;
    petColor: string;
  }) => {
    if (!user) return;

    const trimmedName = name.trim();
    const trimmedPetName = petName.trim();

    if (trimmedName && trimmedName !== user.name) {
      const updatedUser = await updateUserProfile(user.id, { name: trimmedName });
      login({ ...user, ...updatedUser });
    }

    if (trimmedPetName && trimmedPetName !== pet.name) {
      setName(trimmedPetName);
    }

    if (petType !== pet.type) {
      setType(petType);
    }

    if (petColor !== pet.color) {
      setColor(petColor);
    }
  };

  const handleGoalComplete = async () => {
    setShowCelebration(true);
    setCurrentScreen('dashboard');
    setCurrentTopic(undefined);
    setCurrentQuestionLimit(15);
    setCurrentQuestTitle(undefined);
    // Refresh user data to get updated XP, level, and stars from backend.
    if (user?.id) {
      try {
        const freshUser = await getUser(user.id);
        login(freshUser);
      } catch { /* keep current data */ }
    }
  };

  const handleStartQuest = (
    subject: string,
    options?: { topic?: string; questionLimit?: number; title?: string },
  ) => {
    setCurrentSubject(subject);
    setCurrentTopic(options?.topic?.trim() || undefined);
    setCurrentQuestionLimit(options?.questionLimit || 15);
    setCurrentQuestTitle(options?.title?.trim() || undefined);
    setCurrentScreen('learning');
  };

  const handleStartAssignment = (assignment: StudentAssignmentData) => {
    handleStartQuest(assignment.subject, {
      topic: assignment.topic || undefined,
      questionLimit: assignment.question_count,
      title: assignment.title,
    });
  };

  const handleExitQuest = () => {
    setCurrentTopic(undefined);
    setCurrentQuestionLimit(15);
    setCurrentQuestTitle(undefined);
    setCurrentScreen('dashboard');
  };

  return (
    <div className="min-h-screen bg-background-light font-sans text-slate-900">
      {/* Only show student header for student screens */}
      {currentScreen !== 'teacher-login' && currentScreen !== 'teacher-register' && currentScreen !== 'teacher-dashboard' && currentScreen !== 'join-class' && (
        <HeaderInteractive
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          stars={user?.stars || 0}
          onOpenShop={() => setCurrentScreen('pet-shop')}
          user={user}
          pet={pet}
          onSaveSettings={handleSaveSettings}
          onLogout={handleLogout}
        />
      )}

      <main className="mx-auto max-w-[1600px] px-4 pb-6 pt-3 sm:px-6 lg:px-10 lg:pb-10 lg:pt-4">
        <AnimatePresence mode="wait">
          {currentScreen === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-8 lg:flex-row"
            >
              <DashboardSidebar
                xp={user?.xp || pet.xp}
                level={user?.level || pet.level}
                onOpenShop={() => setCurrentScreen('pet-shop')}
              />
              <DashboardMain
                pet={pet}
                userId={user?.id}
                onFeed={() => {/* Deduct stars via API in future */}}
                onPlay={() => addXp(20)}
                onStartQuest={handleStartQuest}
                onStartAssignment={handleStartAssignment}
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
                topic={currentTopic}
                questionLimit={currentQuestionLimit}
                title={currentQuestTitle}
                onComplete={handleGoalComplete}
                onBack={handleExitQuest}
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
                pet={pet!}
                userId={user?.id || ''}
                onSetType={setType}
                onSetColor={setColor}
                onSetName={setName}
                onToggleAccessory={toggleAccessory}
                onVisitShop={() => setCurrentScreen('pet-shop')}
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

          {currentScreen === 'pet-shop' && (
            <motion.div
              key="pet-shop"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full"
            >
              <PetShop 
                onBack={() => setCurrentScreen('dashboard')} 
                userId={user?.id || ''}
                onPurchaseSuccess={(newStars) => {
                  if (user) login({ ...user, stars: newStars });
                }}
              />
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
              <LeaderboardV2 />
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
                    onBack={() => {
                      setSelectedClassId(null);
                      setSelectedClassName('');
                    }}
                  />
                ) : (
                  <TeacherDashboard
                    teacherId={user?.id || ''}
                    onViewClass={(id, className) => {
                      setSelectedClassId(id);
                      setSelectedClassName(className);
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

