
import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  BookOpen, 
  Activity, 
  Menu, 
  X, 
  ChevronRight, 
  ChevronDown,
  Scale, 
  TrendingDown, 
  Target,
  PlusCircle,
  AlertCircle,
  User as UserIcon,
  Search,
  HelpCircle,
  FileText,
  Settings,
  Trash2,
  Moon,
  Sun,
  Award,
  CheckCircle,
  LogOut,
  ArrowRight,
  Shield,
  Users,
  MessageCircle,
  Send,
  Bot,
  Camera,
  Upload,
  Utensils,
  Check,
  ScanBarcode,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Flame,
  Trophy,
  Brain,
  Droplets,
  Zap,
  Coffee,
  XCircle,
  Calendar,
  PauseCircle,
  Stethoscope,
  Mail,
  Lock,
  ArrowLeft,
  Hand,
  Share2
} from 'lucide-react';
import { GoogleGenAI, Chat } from "@google/genai";
import { Button } from './components/Button';
import { ArticleCard } from './components/ArticleCard';
import { WeightChart } from './components/WeightChart';
import { MealLogbook } from './components/MealLogbook';
import { Article, UserProfile, WeightEntry, DailyCheckIn, User, FAQItem, Badge, Challenge, CommunityPost, ReactionType, MealEntry } from './types';
import { ARTICLES, FAQ_ITEMS, CHECKIN_QUESTIONS, BADGES, CHALLENGES, CARE_PATHS, MOCK_COMMUNITY_POSTS } from './constants';
import { db } from './services/DatabaseService';

// ---- Views Enum ----
type View = 'home' | 'login' | 'register' | 'knowledge' | 'dashboard' | 'article-detail' | 'settings' | 'food-analysis' | 'forgot-password' | 'reset-password' | 'community' | 'meal-logbook';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

interface FoodItem {
  name: string;
  calories: number;
  portion: string;
}

interface FoodAnalysisResult {
  type: 'meal';
  items: FoodItem[];
  totalCalories: number;
  healthTip: string;
}

interface ProductAnalysisResult {
  type: 'product';
  productName: string;
  healthScore: number; // 1-10
  summary: string;
  pros: string[];
  cons: string[];
}

type AnalysisResult = FoodAnalysisResult | ProductAnalysisResult;

// ---- Icon Mapping for Badges ----
const IconMap: Record<string, React.ElementType> = {
  Flag, Flame, Trophy, Brain, Droplets, Activity
};

// ---- Animation Components ----

const BroccoliAnimation = () => (
  <div className="flex flex-col items-center justify-center animate-bounce-short">
    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      {/* Stalk */}
      <path d="M90 120 Q100 180 110 120" stroke="#86efac" strokeWidth="25" fill="none" strokeLinecap="round" />
      <path d="M85 130 Q70 150 60 140" stroke="#86efac" strokeWidth="15" fill="none" strokeLinecap="round" />
      <path d="M115 130 Q130 150 140 140" stroke="#86efac" strokeWidth="15" fill="none" strokeLinecap="round" />
      
      {/* Head (Florets) */}
      <circle cx="100" cy="80" r="35" fill="#22c55e" />
      <circle cx="70" cy="90" r="25" fill="#22c55e" />
      <circle cx="130" cy="90" r="25" fill="#22c55e" />
      <circle cx="85" cy="60" r="25" fill="#22c55e" />
      <circle cx="115" cy="60" r="25" fill="#22c55e" />
      
      {/* Face */}
      <circle cx="85" cy="85" r="4" fill="white" /> {/* Left Eye */}
      
      {/* Winking Right Eye */}
      <ellipse cx="115" cy="85" rx="4" ry="4" fill="white">
        <animate attributeName="ry" values="4;0.5;4" dur="2s" repeatCount="indefinite" />
      </ellipse>
      
      {/* Smile */}
      <path d="M90 100 Q100 110 110 100" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
    <h3 className="text-2xl font-bold text-green-600 mt-4">Gezond Bezig!</h3>
    <p className="text-green-800">U bent nu Groente Kampioen!</p>
  </div>
);

const RunnerAnimation = () => (
  <div className="flex flex-col items-center justify-center">
    <svg width="240" height="240" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      {/* Moving Ground Lines - Creates speed effect */}
      <g stroke="#fbbf24" strokeWidth="2" strokeLinecap="round">
        <line x1="20" y1="160" x2="60" y2="160">
          <animate attributeName="x1" from="200" to="-50" dur="0.8s" repeatCount="indefinite" />
          <animate attributeName="x2" from="240" to="-10" dur="0.8s" repeatCount="indefinite" />
        </line>
        <line x1="80" y1="165" x2="140" y2="165" opacity="0.6">
          <animate attributeName="x1" from="200" to="-60" dur="0.6s" repeatCount="indefinite" />
          <animate attributeName="x2" from="260" to="0" dur="0.6s" repeatCount="indefinite" />
        </line>
      </g>

      {/* Runner Group - Bobs up and down */}
      <g transform="translate(100, 100)">
         <animateTransform attributeName="transform" type="translate" values="100,100; 100,95; 100,100" dur="0.3s" repeatCount="indefinite" />
         
         {/* Head */}
         <circle cx="0" cy="-50" r="12" fill="#d97706" />
         
         {/* Torso */}
         <line x1="0" y1="-38" x2="10" y2="10" stroke="#d97706" strokeWidth="8" strokeLinecap="round" />

         {/* Back Leg */}
         <g>
            <path d="M10 10 L-10 30 L-25 25" stroke="#b45309" strokeWidth="6" fill="none" strokeLinecap="round">
              <animate attributeName="d" values="M10 10 L-10 30 L-25 25; M10 10 L25 30 L25 50; M10 10 L-10 30 L-25 25" dur="0.6s" repeatCount="indefinite" />
            </path>
         </g>

         {/* Back Arm */}
         <g>
            <path d="M5 -30 L20 -15 L35 -25" stroke="#b45309" strokeWidth="5" fill="none" strokeLinecap="round">
               <animate attributeName="d" values="M5 -30 L20 -15 L35 -25; M5 -30 L-15 -15 L-10 -5; M5 -30 L20 -15 L35 -25" dur="0.6s" repeatCount="indefinite" />
            </path>
         </g>

         {/* Front Leg */}
         <g>
            <path d="M10 10 L25 30 L25 50" stroke="#f59e0b" strokeWidth="6" fill="none" strokeLinecap="round">
              <animate attributeName="d" values="M10 10 L25 30 L25 50; M10 10 L-10 30 L-25 25; M10 10 L25 30 L25 50" dur="0.6s" repeatCount="indefinite" />
            </path>
         </g>

         {/* Front Arm */}
         <g>
             <path d="M5 -30 L-15 -15 L-10 -5" stroke="#f59e0b" strokeWidth="5" fill="none" strokeLinecap="round">
               <animate attributeName="d" values="M5 -30 L-15 -15 L-10 -5; M5 -30 L20 -15 L35 -25; M5 -30 L-15 -15 L-10 -5" dur="0.6s" repeatCount="indefinite" />
             </path>
         </g>
      </g>
    </svg>
    <h3 className="text-2xl font-bold text-amber-600 mt-4">In Beweging!</h3>
    <p className="text-amber-800">Tijd om stappen te zetten.</p>
  </div>
);

const ZenAnimation = () => (
  <div className="flex flex-col items-center justify-center">
    <svg width="240" height="240" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      {/* Aura / Breath */}
      <circle cx="100" cy="110" r="50" fill="#a5b4fc" opacity="0.4">
        <animate attributeName="r" values="50;75;50" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0;0.4" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="110" r="40" fill="#818cf8" opacity="0.3">
        <animate attributeName="r" values="40;60;40" dur="4s" repeatCount="indefinite" begin="0.5s" />
      </circle>

      {/* Floating Body Group */}
      <g>
         <animateTransform attributeName="transform" type="translate" values="0,0; 0,-8; 0,0" dur="4s" repeatCount="indefinite" />
         
         {/* Legs (Lotus/Kneeling base) */}
         <path d="M60 150 Q100 165 140 150 Q160 145 150 130 Q120 140 100 140 Q80 140 50 130 Q40 145 60 150" fill="#4f46e5" />
         
         {/* Torso */}
         <path d="M70 135 L80 80 Q100 75 120 80 L130 135" fill="#4f46e5" />
         
         {/* Shoulders/Arms */}
         <path d="M80 85 Q60 100 65 120 L80 130" stroke="#4f46e5" strokeWidth="8" strokeLinecap="round" fill="none" />
         <path d="M120 85 Q140 100 135 120 L120 130" stroke="#4f46e5" strokeWidth="8" strokeLinecap="round" fill="none" />
         
         {/* Head */}
         <circle cx="100" cy="65" r="18" fill="#4f46e5" />
         
         {/* Closed Eyes */}
         <path d="M92 65 Q96 68 100 65 Q104 68 108 65" stroke="#e0e7ff" strokeWidth="1.5" fill="none" opacity="0.7" />
      </g>
    </svg>
    <h3 className="text-2xl font-bold text-indigo-600 mt-4">Rust & Balans</h3>
    <p className="text-indigo-800">Adem in, adem uit.</p>
  </div>
);

// ---- Extracted Components (to prevent re-render issues) ----

const LoginView = ({ onLogin, onNavigateRegister, onNavigateForgot }: { onLogin: (e: string, p: string) => void, onNavigateRegister: () => void, onNavigateForgot: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="text-center">
          <Heart className="mx-auto h-12 w-12 text-teal-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900 dark:text-white">Welkom terug</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Log in om uw voortgang te bekijken
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(email, password); }}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-mailadres</label>
              <input
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 placeholder-slate-500 dark:placeholder-slate-600 text-slate-900 dark:text-white dark:bg-slate-950 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-colors duration-300"
                placeholder="naam@voorbeeld.nl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Wachtwoord</label>
                 <button 
                   type="button" 
                   onClick={onNavigateForgot}
                   className="text-xs font-medium text-teal-600 hover:text-teal-500"
                 >
                   Wachtwoord vergeten?
                 </button>
              </div>
              <input
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 placeholder-slate-500 dark:placeholder-slate-600 text-slate-900 dark:text-white dark:bg-slate-950 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-colors duration-300"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" className="w-full flex justify-center">Inloggen</Button>
        </form>
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Nog geen account? <button onClick={onNavigateRegister} className="font-medium text-teal-600 hover:text-teal-500">Registreer hier</button>
          </p>
        </div>
      </div>
    </div>
  );
};

const ForgotPasswordView = ({ onBack, onSubmit }: { onBack: () => void, onSubmit: (email: string) => void }) => {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <button onClick={onBack} className="flex items-center text-sm text-slate-500 hover:text-teal-600 mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Terug naar inloggen
        </button>
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-teal-600 dark:text-teal-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Wachtwoord vergeten?</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Geen zorgen. Vul uw e-mailadres in en wij sturen u instructies om uw wachtwoord te resetten.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); onSubmit(email); }}>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-mailadres</label>
            <input
              type="email"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 placeholder-slate-500 dark:placeholder-slate-600 text-slate-900 dark:text-white dark:bg-slate-950 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-colors duration-300"
              placeholder="naam@voorbeeld.nl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full flex justify-center">Stuur reset link</Button>
        </form>
      </div>
    </div>
  );
};

const ResetPasswordView = ({ onReset }: { onReset: (p: string) => void }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Wachtwoorden komen niet overeen.');
      return;
    }
    if (password.length < 6) {
      setError('Wachtwoord moet minimaal 6 tekens zijn.');
      return;
    }
    onReset(password);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-6 w-6 text-teal-600 dark:text-teal-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Nieuw Wachtwoord</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Kies een nieuw, veilig wachtwoord voor uw account.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nieuw Wachtwoord</label>
              <input
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 placeholder-slate-500 dark:placeholder-slate-600 text-slate-900 dark:text-white dark:bg-slate-950 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-colors duration-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bevestig Wachtwoord</label>
              <input
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 placeholder-slate-500 dark:placeholder-slate-600 text-slate-900 dark:text-white dark:bg-slate-950 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-colors duration-300"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" className="w-full flex justify-center">Wachtwoord Opslaan</Button>
        </form>
      </div>
    </div>
  );
};

const RegisterView = ({ onRegister, onNavigateLogin }: { onRegister: (e: string, p: string, n: string, s: number, g: number) => void, onNavigateLogin: () => void }) => {
  const [formData, setFormData] = useState({
    email: '', password: '', name: '', startWeight: '', goalWeight: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(
      formData.email, 
      formData.password, 
      formData.name, 
      parseFloat(formData.startWeight), 
      parseFloat(formData.goalWeight)
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Maak een account</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Start vandaag met uw leefstijlreis
          </p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gebruikersnaam (Pseudoniem)</label>
            <input
              type="text"
              required
              className="rounded-lg w-full px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-white focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-mailadres</label>
            <input
              type="email"
              required
              className="rounded-lg w-full px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-white focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Wachtwoord</label>
            <input
              type="password"
              required
              className="rounded-lg w-full px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-white focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Gewicht</label>
                <input
                  type="number" step="0.1" min="0.1" required
                  className="rounded-lg w-full px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-white focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300"
                  value={formData.startWeight}
                  onChange={(e) => setFormData({...formData, startWeight: e.target.value})}
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Doel Gewicht</label>
                <input
                  type="number" step="0.1" min="0.1" required
                  className="rounded-lg w-full px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-white focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300"
                  value={formData.goalWeight}
                  onChange={(e) => setFormData({...formData, goalWeight: e.target.value})}
                />
             </div>
          </div>
          <Button type="submit" className="w-full flex justify-center mt-6">Registreren & Starten</Button>
        </form>
        <div className="text-center mt-4">
           <button onClick={onNavigateLogin} className="text-sm text-teal-600 hover:text-teal-500 font-medium">Ik heb al een account</button>
        </div>
      </div>
    </div>
  );
};

interface DashboardViewProps {
  currentUser: User;
  weightEntries: WeightEntry[];
  checkInEntries: DailyCheckIn[];
  combinedWeight: string;
  setCombinedWeight: (val: string) => void;
  checkInValues: Record<string, number>;
  setCheckInValues: (val: Record<string, number>) => void;
  handleCombinedSubmit: (e: React.FormEvent) => void;
  handleOpenFreezeModal: () => void;
  freeFreezeActive: boolean;
  medicalFreezeActive: boolean;
  activeChallenge: Challenge | null;
  handleStopChallengeClick: () => void;
  handleJoinChallenge: (c: Challenge) => void;
  isDark: boolean;
}

const DashboardView = ({
  currentUser,
  weightEntries,
  checkInEntries,
  combinedWeight,
  setCombinedWeight,
  checkInValues,
  setCheckInValues,
  handleCombinedSubmit,
  handleOpenFreezeModal,
  freeFreezeActive,
  medicalFreezeActive,
  activeChallenge,
  handleStopChallengeClick,
  handleJoinChallenge,
  isDark
}: DashboardViewProps) => {
  const currentWeight = weightEntries.length > 0 
    ? weightEntries[weightEntries.length - 1].weight 
    : currentUser.profile.startWeight;
  
  const calculateProgress = () => {
    const start = currentUser.profile.startWeight;
    const goal = currentUser.profile.goalWeight;
    
    if (start === goal) return 100;
    
    const percentage = ((currentWeight - start) / (goal - start)) * 100;
    return Math.max(0, Math.min(100, percentage));
  };
  
  const progressPercentage = calculateProgress();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Dag {currentUser.profile.name}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Laten we werken aan een sterker lichaam voor morgen.
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
           <button 
             onClick={handleOpenFreezeModal}
             className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
               freeFreezeActive 
                 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                 : medicalFreezeActive 
                   ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                   : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
             }`}
           >
             {freeFreezeActive ? <PauseCircle className="w-4 h-4 mr-2" /> : 
              medicalFreezeActive ? <Stethoscope className="w-4 h-4 mr-2" /> :
              <Shield className="w-4 h-4 mr-2" />
             }
             {freeFreezeActive ? 'Rustdag Actief' : 
              medicalFreezeActive ? 'Medische Pauze' : 
              'Streak Beschermen'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Input & Chart */}
        <div className="lg:col-span-2 space-y-8">
           
           {/* Daily Input Card */}
           <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 transition-colors duration-300">
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                 <Activity className="w-5 h-5 mr-2 text-teal-600" />
                 Dagelijkse Check-in
               </h3>
               <span className="text-xs text-slate-400">{new Date().toLocaleDateString('nl-NL')}</span>
             </div>

             <form onSubmit={handleCombinedSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                   {CHECKIN_QUESTIONS.map(q => (
                     <div key={q.id}>
                       <div className="flex justify-between items-end mb-2">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{q.label}</label>
                          <span className="text-xs font-bold text-teal-600 bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded">
                            {checkInValues[q.id]}/10
                          </span>
                       </div>
                       <input 
                          type="range" min="1" max="10" 
                          value={checkInValues[q.id]}
                          onChange={(e) => setCheckInValues({...checkInValues, [q.id]: parseInt(e.target.value)})}
                          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
                       />
                       <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                          <span>{q.minLabel}</span>
                          <span>{q.maxLabel}</span>
                       </div>
                     </div>
                   ))}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Heeft u zich vandaag gewogen? (Optioneel)
                   </label>
                   <div className="flex space-x-4">
                      <div className="relative flex-grow max-w-xs">
                        <input 
                          type="number" step="0.1"
                          className="block w-full pl-10 pr-12 py-2.5 border border-slate-300 dark:border-slate-600 dark:bg-slate-950 dark:text-white rounded-lg focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300"
                          placeholder="0.0"
                          value={combinedWeight}
                          onChange={(e) => setCombinedWeight(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Scale className="h-5 w-5 text-slate-400" />
                        </div>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-slate-500 sm:text-sm">kg</span>
                        </div>
                      </div>
                      <Button type="submit">Opslaan</Button>
                   </div>
                </div>
             </form>
           </div>

           {/* Progress Indicator */}
           <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 transition-colors duration-300">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-teal-600" />
                Doelprogressie
              </h3>
              
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  <span>Start: {currentUser.profile.startWeight} kg</span>
                  <span className="text-teal-600 dark:text-teal-400">
                    {progressPercentage.toFixed(0)}% Voltooid
                  </span>
                  <span>Doel: {currentUser.profile.goalWeight} kg</span>
                </div>
                <div className="overflow-hidden h-4 mb-2 text-xs flex rounded-full bg-slate-200 dark:bg-slate-700">
                  <div 
                    style={{ width: `${progressPercentage}%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500 transition-all duration-1000 ease-out"
                  ></div>
                </div>
                <div className="text-center text-sm font-medium text-slate-800 dark:text-slate-200 mt-2">
                   Huidig gewicht: <span className="font-bold text-teal-600 dark:text-teal-400 text-lg">{currentWeight} kg</span>
                   <span className="text-xs text-slate-500 dark:text-slate-500 block">
                     Nog {Math.abs(currentUser.profile.goalWeight - currentWeight).toFixed(1)} kg te gaan
                   </span>
                </div>
              </div>
           </div>

           {/* Weight Chart */}
           <WeightChart 
              data={weightEntries} 
              startWeight={currentUser.profile.startWeight}
              goalWeight={currentUser.profile.goalWeight}
              isDark={isDark}
           />
        </div>

        {/* Right Column: Challenges & Badges */}
        <div className="space-y-8">
           
           {/* Active Challenge Card */}
           <div className={`rounded-xl shadow-sm border p-6 relative overflow-hidden transition-colors duration-300 ${
              activeChallenge ? 'bg-white dark:bg-slate-800 border-teal-200 dark:border-teal-800' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 border-dashed'
           }`}>
              <div className="flex justify-between items-start mb-4 relative z-10">
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-amber-500" />
                    Huidige Challenge
                 </h3>
                 {activeChallenge && (
                    <button onClick={handleStopChallengeClick} className="text-xs text-red-500 hover:text-red-700 underline">Stoppen</button>
                 )}
              </div>

              {activeChallenge ? (
                 <div className="relative z-10">
                    <h4 className="text-xl font-bold text-teal-700 dark:text-teal-400 mb-2">{activeChallenge.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{activeChallenge.description}</p>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-1">
                       <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <p className="text-xs text-slate-500 text-right">Dag 3 van {activeChallenge.duration.split(' ')[0]}</p>
                 </div>
              ) : (
                 <div className="text-center py-6 relative z-10">
                    <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">U heeft nog geen actieve challenge.</p>
                    <h4 className="font-bold text-slate-800 dark:text-white mb-4">Kies een uitdaging:</h4>
                    <div className="space-y-3">
                       {CHALLENGES.map(c => (
                          <button 
                            key={c.id}
                            onClick={() => handleJoinChallenge(c)}
                            className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 bg-white dark:bg-slate-900 transition-all group"
                          >
                             <div className="flex justify-between">
                                <span className="font-medium text-slate-900 dark:text-white group-hover:text-teal-600">{c.title}</span>
                                <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">{c.duration}</span>
                             </div>
                          </button>
                       ))}
                    </div>
                 </div>
              )}
              {/* Decorative background blob */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-teal-50 dark:bg-teal-900/20 rounded-full blur-2xl z-0 pointer-events-none"></div>
           </div>

           {/* Badges */}
           <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 transition-colors duration-300">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                 <Award className="w-5 h-5 mr-2 text-indigo-500" />
                 Behaalde Badges
              </h3>
              <div className="grid grid-cols-4 gap-4">
                 {BADGES.map(badge => {
                    const Icon = IconMap[badge.iconName] || Activity;
                    
                    // Deterministic Badge Logic to prevent flickering
                    const isEarned = (() => {
                        if (badge.conditionType === 'weight_entry') return weightEntries.length >= badge.threshold;
                        if (badge.conditionType === 'checkin') return checkInEntries.length >= badge.threshold;
                        if (badge.conditionType === 'streak') return checkInEntries.length >= badge.threshold; // Simplified streak check for stability
                        return false;
                    })();

                    return (
                       <div key={badge.id} className={`flex flex-col items-center group relative cursor-help ${isEarned ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                          {/* Custom Tooltip */}
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-40 bg-slate-900 text-white text-xs p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 text-center shadow-lg">
                            {badge.description}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                          </div>

                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-transform group-hover:scale-110 ${isEarned ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                             <Icon className="w-6 h-6" />
                          </div>
                          <span className="text-[10px] text-center font-medium text-slate-600 dark:text-slate-400 leading-tight">{badge.title}</span>
                       </div>
                    );
                 })}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// ---- Main App Component ----
export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Forgot Password Flow State
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [simulatedEmail, setSimulatedEmail] = useState<{link: string, email: string} | null>(null);

  // App Data State (Linked to User ID)
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [checkInEntries, setCheckInEntries] = useState<DailyCheckIn[]>([]);
  const [mealEntries, setMealEntries] = useState<MealEntry[]>([]);
  
  // Notification State
  const [notification, setNotification] = useState<string | null>(null);

  // Combined Form State (Dashboard)
  const [combinedWeight, setCombinedWeight] = useState<string>('');
  const [checkInValues, setCheckInValues] = useState<Record<string, number>>({
    energy: 5, strength: 5, hunger: 5, mood: 5, stress: 5, sleep: 5
  });

  // Gamification & Modals State
  const [activeAnimation, setActiveAnimation] = useState<string | null>(null);
  const [showStopChallengeModal, setShowStopChallengeModal] = useState(false);
  const [stopReason, setStopReason] = useState('');
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [medicalStartDate, setMedicalStartDate] = useState('');
  const [medicalEndDate, setMedicalEndDate] = useState('');
  const [pendingChallenge, setPendingChallenge] = useState<Challenge | null>(null);

  // Community State
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hallo! Ik ben VitaBot, uw leefstijlcoach. Ik kan u helpen met vragen over voeding, beweging en mentaal welzijn. Hoe kan ik u vandaag ondersteunen?' }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ---- Effects ----

  // Load Auth Session
  useEffect(() => {
    const sessionUser = db.getCurrentSession();
    if (sessionUser) {
      setCurrentUser(sessionUser);
    }
    setIsLoading(false);
  }, []);

  // Initialize Gemini Chat
  useEffect(() => {
    const initChat = () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const chat = ai.chats.create({
          model: 'gemini-3-pro-preview',
          config: {
            systemInstruction: `Je bent VitaBot, een empathische, ondersteunende AI-leefstijlcoach voor de applicatie 'Fit, door dik en dun'. Jouw doelgroep bestaat uit mannen met prostaatkanker (of herstellende daarvan). 
            
            KERNWAARDEN (Self-Determination Theory):
            1. Competentie: Geef de gebruiker het gevoel dat hij het kan. Vier kleine successen (Atomic Habits).
            2. Autonomie: De gebruiker heeft de regie. Dwing niets op, maar bied opties.
            3. Verbondenheid: Laat merken dat ze er niet alleen voor staan.

            BELANGRIJKE REGELS:
            1. DISCLAIMER: Je bent GEEN arts. Begin ELK antwoord dat ook maar enigszins medisch of gezondheidsgerelateerd is met de zin: "Let op: Ik ben een AI-assistent en geef geen medisch advies. Raadpleeg voor medische vragen altijd uw behandelend specialist."
            2. Toon: Positief, bemoedigend, respectvol en duidelijk. Gebruik 'u' als aanspreekvorm.
            3. Veiligheid: Als een gebruiker spreekt over extreem gewichtsverlies of eetstoornis-achtig gedrag, adviseer dan dringend om contact op te nemen met een arts of diëtist. Focus op GEZONDHEID, niet op esthetiek.
            4. Motivatie: Gebruik technieken zoals 'habit stacking' (koppel nieuw gedrag aan bestaand gedrag) en focus op het proces, niet alleen het eindresultaat.`,
          },
        });
        chatSessionRef.current = chat;
      } catch (error) {
        console.error("Failed to initialize chat:", error);
      }
    };

    initChat();
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  // Load User Data when User Changes
  useEffect(() => {
    if (currentUser) {
      // Apply theme
      const isDark = currentUser.profile.themePreference === 'dark';
      document.documentElement.classList.toggle('dark', isDark);

      // Load specific user data from DB Service
      const weights = db.getWeightEntries(currentUser.id);
      const checkins = db.getCheckIns(currentUser.id);
      const meals = db.getMealEntries(currentUser.id);
      
      setWeightEntries(weights);
      setCheckInEntries(checkins);
      setMealEntries(meals);
    } else {
      // Default theme for guests/logged out
      document.documentElement.classList.remove('dark');
      setWeightEntries([]);
      setCheckInEntries([]);
      setMealEntries([]);
    }
  }, [currentUser]);

  // ---- Environment / Theme Logic ----
  
  // Calculate dynamic theme based on active challenge
  const activeChallenge = currentUser?.profile.activeChallengeId 
    ? CHALLENGES.find(c => c.id === currentUser.profile.activeChallengeId) 
    : null;

  const getThemeWrapperClass = () => {
    if (!activeChallenge) return "bg-slate-50 dark:bg-slate-950";
    
    switch(activeChallenge.category) {
      case 'Voeding': 
        return "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-950 dark:to-green-950/20";
      case 'Beweging':
        return "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-950 dark:to-orange-950/20";
      case 'Mentaal':
        return "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-950 dark:to-indigo-950/20";
      default:
        return "bg-slate-50 dark:bg-slate-950";
    }
  };

  // ---- Derived State for Freeze/Pause ----

  const checkFreeFreezeEligibility = () => {
    if (!currentUser?.profile.lastFreeFreezeDate) return true;
    const lastDate = new Date(currentUser.profile.lastFreeFreezeDate);
    const now = new Date();
    return lastDate.getMonth() !== now.getMonth() || lastDate.getFullYear() !== now.getFullYear();
  };

  const isFreeFreezeEligible = checkFreeFreezeEligibility();

  const isMedicalFreezeActive = () => {
    if (!currentUser?.profile.medicalPause) return false;
    const { isActive, startDate, endDate } = currentUser.profile.medicalPause;
    if (!isActive) return false;
    
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Normalize times to compare dates properly
    now.setHours(0,0,0,0);
    start.setHours(0,0,0,0);
    end.setHours(23,59,59,999);
    
    return now >= start && now <= end;
  };

  const medicalFreezeActive = isMedicalFreezeActive();
  const freeFreezeActive = !isFreeFreezeEligible && !medicalFreezeActive && new Date(currentUser?.profile.lastFreeFreezeDate || '').getDate() === new Date().getDate();
  const isDark = currentUser?.profile.themePreference === 'dark';

  // ---- Handlers ----

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await db.loginUser(email, password);
      setCurrentUser(user);
      navigateTo('dashboard');
      showNotification(`Welkom terug, ${user.profile.name}`);
    } catch (err: any) {
      alert(err.message || 'Inloggen mislukt');
    }
  };

  const handleRegister = async (email: string, password: string, name: string, startWeight: number, goalWeight: number) => {
    // Validatie
    if (isNaN(startWeight) || isNaN(goalWeight)) {
      alert('Voer geldige getallen in voor het gewicht.');
      return;
    }

    if (startWeight < 20 || startWeight > 400) {
      alert('De waarde moet tussen de 20 en de 400 kilo zitten');
      return;
    }

    if (startWeight > 150) {
      if (!window.confirm(`Klopt het dat u ${startWeight} kilo bent?`)) {
         return;
      }
    }

    try {
      const newUser = await db.registerUser(email, password, {
        name,
        startWeight,
        goalWeight,
        themePreference: 'light',
        activeChallengeId: null
      });
      
      // Auto-add start weight to chart
      db.addWeightEntry(newUser.id, startWeight);

      setCurrentUser(newUser);
      navigateTo('dashboard');
      showNotification('Account succesvol aangemaakt! U bent nu ingelogd.');
    } catch (err: any) {
      alert(err.message || 'Registratie mislukt');
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      // In a real app, this sends an email. Here we simulate it.
      // DatabaseService returns a token only if we want to simulate the link.
      // For security in a real app, void would be returned.
      const token = await db.createPasswordResetToken(email);
      
      // Simulate Email arriving
      setSimulatedEmail({ link: token, email: email });
      navigateTo('home');
      showNotification('Als het account bestaat, is er een e-mail verzonden.');
    } catch (err: any) {
      // Even if error (email not found), show generic success to prevent enumeration,
      // BUT for this demo app we might alert if it's strictly empty or invalid.
      // For the "Happy Path" demo:
      showNotification('Als het account bestaat, is er een e-mail verzonden.');
    }
  };

  const handleResetPassword = async (newPassword: string) => {
    if (!resetToken) return;
    try {
      await db.resetPassword(resetToken, newPassword);
      setResetToken(null);
      navigateTo('login');
      showNotification('Wachtwoord succesvol gewijzigd. U kunt nu inloggen.');
    } catch (err: any) {
      alert(err.message || 'Resetten mislukt. De link is mogelijk verlopen.');
      navigateTo('login');
    }
  };

  const handleLogout = () => {
    db.logoutUser();
    setCurrentUser(null);
    navigateTo('home');
    showNotification('U bent uitgelogd.');
  };

  const navigateTo = (view: View) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setCurrentView('article-detail');
    window.scrollTo(0, 0);
  };

  // Helper function to ask about sharing
  const askToShareInCommunity = (actionType: CommunityPost['actionType'], content: string) => {
    if (!currentUser) return;
    
    // In a real app, we would have a proper modal. For simplicity, we use confirm here or just a toast with action.
    // Let's use a non-intrusive approach: Auto-add locally for the session or skip. 
    // To make it ethical (Opt-in), we should prompt.
    if (window.confirm("Goed bezig! Wil je deze mijlpaal anoniem delen in Het Trefpunt om anderen te inspireren?")) {
        const newPost: CommunityPost = {
            id: crypto.randomUUID(),
            userPseudonym: currentUser.profile.name || "Anonieme Held",
            actionType,
            content,
            timestamp: new Date().toISOString(),
            reactions: { heart: 0, muscle: 0, clap: 0 }
        };
        setCommunityPosts(prev => [newPost, ...prev]);
        showNotification("Gedeeld in Het Trefpunt!");
    }
  };

  const handleCombinedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    // Safety Check for Rapid Weight Loss (Ethical Safeguard)
    if (combinedWeight) {
        const newWeight = parseFloat(combinedWeight);
        
        if (isNaN(newWeight)) {
            alert("Voer een geldig getal in voor het gewicht.");
            return;
        }

        // Clone before sorting to avoid state mutation
        const sortedEntries = [...weightEntries].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const lastEntry = sortedEntries[0];

        if (lastEntry) {
            const lastDate = new Date(lastEntry.date);
            const today = new Date();
            const diffTime = Math.abs(today.getTime() - lastDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Check if entry is within a week (approx 7 days)
            if (diffDays <= 7) {
                const weightDifference = newWeight - lastEntry.weight; // Positive = gained, Negative = lost
                const startWeight = currentUser.profile.startWeight;
                const goalWeight = currentUser.profile.goalWeight;
                const currentWeight = lastEntry.weight;

                // Scenario 1: Doel is aankomen (Ondergewicht / Doel > Huidig)
                // Waarschuwing als: Meer dan 4kg AFGEVALLEN in een week
                if (goalWeight > currentWeight) {
                    if (weightDifference < -4) {
                        const confirmed = window.confirm(`Klopt het dat u ${Math.abs(weightDifference).toFixed(1)} kg bent afgevallen in de afgelopen week?`);
                        if (confirmed) {
                            alert("Neem advies op met de leefstijlcoach via dit emailadres: x@gmail.com.");
                        } else {
                            return; // Cancel save if user says "No"
                        }
                    }
                }

                // Scenario 2: Doel is afvallen (Overgewicht / Doel < Huidig)
                // Waarschuwing als: Meer dan 4kg AANGEKOMEN in een week
                if (goalWeight < currentWeight) {
                    if (weightDifference > 4) {
                        const confirmed = window.confirm(`Klopt het dat u ${weightDifference.toFixed(1)} kg bent aangekomen in de afgelopen week?`);
                        if (confirmed) {
                            alert("Neem advies op met de leefstijlcoach via dit emailadres: x@gmail.com.");
                        } else {
                            return; // Cancel save if user says "No"
                        }
                    }
                }
            }
        }
    }

    // Save Check-in via DB Service
    const newCheckIn = db.addCheckIn(currentUser.id, {
      energy: checkInValues.energy,
      strength: checkInValues.strength,
      hunger: checkInValues.hunger,
      mood: checkInValues.mood,
      stress: checkInValues.stress,
      sleep: checkInValues.sleep
    });

    // Save Weight (if entered) via DB Service
    if (combinedWeight) {
      const parsedWeight = parseFloat(combinedWeight);
      if (!isNaN(parsedWeight)) {
        const newWeightEntry = db.addWeightEntry(currentUser.id, parsedWeight);
        setWeightEntries(prev => [...prev, newWeightEntry]);
      }
    }

    setCheckInEntries(prev => [...prev, newCheckIn]);
    setCombinedWeight('');
    // Reset sliders to middle
    setCheckInValues({ energy: 5, strength: 5, hunger: 5, mood: 5, stress: 5, sleep: 5 });
    
    // Gamification feedback
    showNotification(`Meting opgeslagen! Goed bezig, ${currentUser.profile.name}. Uw streak loopt door!`);
    
    // Trigger sharing logic
    setTimeout(() => {
        askToShareInCommunity('checkin_complete', 'Heeft een dagelijkse check-in voltooid.');
    }, 1500);
  };

  const handleDeleteWeight = (id: string) => {
    if (!currentUser) return;
    if (window.confirm('Weet u zeker dat u deze meting wilt verwijderen?')) {
      db.deleteWeightEntry(currentUser.id, id);
      setWeightEntries(prev => prev.filter(e => e.id !== id));
      showNotification(`Meting verwijderd, ${currentUser.profile.name}.`);
    }
  };

  // --- Meal Logbook Handlers ---

  const handleAddMeal = (meal: { name: string; description: string; calories: number }) => {
    if (!currentUser) return;
    const newMeal = db.addMealEntry(currentUser.id, meal);
    setMealEntries(prev => [...prev, newMeal]);
    showNotification('Maaltijd toegevoegd aan uw logboek.');
  };

  const handleDeleteMeal = (id: string) => {
    if (!currentUser) return;
    if (window.confirm('Wilt u deze maaltijd verwijderen?')) {
      db.deleteMealEntry(currentUser.id, id);
      setMealEntries(prev => prev.filter(m => m.id !== id));
      showNotification('Maaltijd verwijderd.');
    }
  };

  // --- Challenge Logic ---

  const handleJoinChallenge = async (challenge: Challenge) => {
    if (!currentUser) return;

    if (currentUser.profile.activeChallengeId && currentUser.profile.activeChallengeId !== challenge.id) {
       if(!window.confirm("U doet al mee aan een andere challenge. U kunt maar één challenge tegelijk volgen om focus te behouden. Wilt u wisselen?")) {
         return;
       }
    }

    try {
      setActiveAnimation(challenge.category);
      const updatedUser = await db.updateUserProfile(currentUser.id, { activeChallengeId: challenge.id });
      setCurrentUser(updatedUser);
      
      // Share logic
      setTimeout(() => {
          setActiveAnimation(null);
          askToShareInCommunity('challenge_join', `Is gestart met de challenge: ${challenge.title}`);
      }, 3500);

    } catch (e) {
      console.error(e);
      alert("Er ging iets mis bij het starten van de challenge.");
    }
  };

  const handleStopChallengeClick = () => {
    setStopReason('');
    setShowStopChallengeModal(true);
  };

  const confirmStopChallenge = async () => {
    if (!currentUser) return;
    if (!stopReason.trim()) {
        alert("Vul alstublieft een reden in.");
        return;
    }
    
    // Here we could log the reason to the DB if needed for analytics, 
    // for now we just proceed with clearing the challenge.
    
    const updatedUser = await db.updateUserProfile(currentUser.id, { activeChallengeId: null });
    setCurrentUser(updatedUser);
    setShowStopChallengeModal(false);
    showNotification("Challenge gestopt. Neem even rust en kies later een nieuwe.");
  };

  // --- Streak Freeze / Pause Logic ---

  const handleOpenFreezeModal = () => {
      setShowFreezeModal(true);
  };

  const confirmFreeFreeze = async () => {
      if(!currentUser) return;
      if(!isFreeFreezeEligible) {
          alert("U heeft deze maand al een gratis rustdag gebruikt.");
          return;
      }

      const today = new Date().toISOString();
      const updatedUser = await db.updateUserProfile(currentUser.id, { lastFreeFreezeDate: today });
      setCurrentUser(updatedUser);
      setShowFreezeModal(false);
      showNotification("Gratis rustdag geactiveerd voor vandaag!");
  };

  const confirmMedicalFreeze = async () => {
      if(!currentUser) return;
      if(!medicalStartDate || !medicalEndDate) {
          alert("Vul alstublieft beide datums in.");
          return;
      }
      
      if(new Date(medicalEndDate) < new Date(medicalStartDate)) {
          alert("Einddatum kan niet voor de startdatum liggen.");
          return;
      }

      const updatedUser = await db.updateUserProfile(currentUser.id, { 
          medicalPause: {
              isActive: true,
              startDate: medicalStartDate,
              endDate: medicalEndDate
          }
      });
      setCurrentUser(updatedUser);
      setShowFreezeModal(false);
      showNotification("Medische pauze ingesteld. Uw streak is beschermd.");
  };

  // --- Generic ---

  const toggleTheme = async () => {
    if (currentUser) {
      const newTheme = currentUser.profile.themePreference === 'dark' ? 'light' : 'dark';
      const updatedUser = await db.updateUserProfile(currentUser.id, { themePreference: newTheme });
      setCurrentUser(updatedUser);
    }
  };
  
  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    try {
      const updatedUser = await db.updateUserProfile(currentUser.id, updates);
      setCurrentUser(updatedUser);
      showNotification('Profiel bijgewerkt.');
    } catch (e) {
      console.error(e);
      alert('Kon profiel niet bijwerken.');
    }
  };
  
  const handleDeleteAccount = () => {
    if (!currentUser) return;
    if(window.confirm('Weet u zeker dat u ALLE data van DIT account wilt wissen? Dit kan niet ongedaan worden gemaakt.')) {
      db.deleteUserFull(currentUser.id);
      setCurrentUser(null);
      navigateTo('home');
      showNotification('Account en alle gegevens zijn succesvol verwijderd.');
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !chatSessionRef.current) return;

    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatLoading(true);

    try {
      const result = await chatSessionRef.current.sendMessage({ message: userMsg });
      const responseText = result.text;
      
      setChatMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages(prev => [...prev, { role: 'model', text: 'Excuses, er ging iets mis bij het ophalen van het antwoord. Probeer het later opnieuw.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleReaction = (postId: string, type: ReactionType) => {
      setCommunityPosts(prevPosts => prevPosts.map(post => {
          if (post.id === postId) {
              const alreadyReacted = post.currentUserReacted?.includes(type);
              
              let newReactions = { ...post.reactions };
              let newUserReacted = post.currentUserReacted ? [...post.currentUserReacted] : [];

              if (alreadyReacted) {
                  // Unlike
                  newReactions[type] = Math.max(0, newReactions[type] - 1);
                  newUserReacted = newUserReacted.filter(t => t !== type);
              } else {
                  // Like
                  newReactions[type] = newReactions[type] + 1;
                  newUserReacted.push(type);
              }

              return { ...post, reactions: newReactions, currentUserReacted: newUserReacted };
          }
          return post;
      }));
  };

  // ---- Components ----

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-teal-600"></div></div>;

  const Navbar = () => (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => navigateTo('home')}>
            <Heart className="h-8 w-8 text-teal-600 fill-teal-600" />
            <span className="ml-2 text-xl font-bold text-slate-800 dark:text-white tracking-tight">Fit, door dik en dun</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => navigateTo('home')}
              className={`text-sm font-medium ${currentView === 'home' ? 'text-teal-600' : 'text-slate-600 dark:text-slate-300 hover:text-teal-600'}`}
            >
              Home
            </button>

            {currentUser ? (
              <>
                <button 
                  onClick={() => navigateTo('knowledge')}
                  className={`text-sm font-medium ${currentView === 'knowledge' ? 'text-teal-600' : 'text-slate-600 dark:text-slate-300 hover:text-teal-600'}`}
                >
                  KennisHub
                </button>
                 <button 
                  onClick={() => navigateTo('food-analysis')}
                  className={`text-sm font-medium flex items-center ${currentView === 'food-analysis' ? 'text-teal-600' : 'text-slate-600 dark:text-slate-300 hover:text-teal-600'}`}
                >
                  <Camera className="w-4 h-4 mr-1.5" />
                  Voedingsscan
                </button>
                <button 
                  onClick={() => navigateTo('dashboard')}
                  className={`text-sm font-medium ${currentView === 'dashboard' ? 'text-teal-600' : 'text-slate-600 dark:text-slate-300 hover:text-teal-600'}`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => navigateTo('meal-logbook')}
                  className={`text-sm font-medium flex items-center ${currentView === 'meal-logbook' ? 'text-teal-600' : 'text-slate-600 dark:text-slate-300 hover:text-teal-600'}`}
                >
                  <Utensils className="w-4 h-4 mr-1.5" />
                  Eetdagboek
                </button>
                <button 
                  onClick={() => navigateTo('community')}
                  className={`text-sm font-medium ${currentView === 'community' ? 'text-teal-600' : 'text-slate-600 dark:text-slate-300 hover:text-teal-600'}`}
                >
                  Het Trefpunt
                </button>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
                <button 
                  onClick={() => navigateTo('settings')}
                  className="text-slate-600 dark:text-slate-300 hover:text-teal-600"
                  title="Instellingen"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-3">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{currentUser.profile.name}</span>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                      <LogOut className="w-4 h-4" />
                    </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <button onClick={() => navigateTo('login')} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-teal-600">Inloggen</button>
                <Button variant="primary" size="sm" onClick={() => navigateTo('register')}>
                  Start Nu
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600 dark:text-slate-300 p-2">
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
      
       {/* Mobile Menu */}
       {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <div className="px-4 pt-2 pb-4 space-y-1">
             <button onClick={() => navigateTo('home')} className="block w-full text-left py-3 text-slate-700 dark:text-slate-300 font-medium border-b border-slate-100 dark:border-slate-800">Home</button>
             
             {currentUser ? (
               <>
                 <button onClick={() => navigateTo('knowledge')} className="block w-full text-left py-3 text-slate-700 dark:text-slate-300 font-medium border-b border-slate-100 dark:border-slate-800">KennisHub</button>
                 <button onClick={() => navigateTo('food-analysis')} className="block w-full text-left py-3 text-slate-700 dark:text-slate-300 font-medium border-b border-slate-100 dark:border-slate-800">Voedingsscan</button>
                 <button onClick={() => navigateTo('dashboard')} className="block w-full text-left py-3 text-slate-700 dark:text-slate-300 font-medium border-b border-slate-100 dark:border-slate-800">Mijn Dashboard</button>
                 <button onClick={() => navigateTo('meal-logbook')} className="block w-full text-left py-3 text-slate-700 dark:text-slate-300 font-medium border-b border-slate-100 dark:border-slate-800">Eetdagboek</button>
                 <button onClick={() => navigateTo('community')} className="block w-full text-left py-3 text-slate-700 dark:text-slate-300 font-medium border-b border-slate-100 dark:border-slate-800">Het Trefpunt</button>
                 <button onClick={() => navigateTo('settings')} className="block w-full text-left py-3 text-slate-700 dark:text-slate-300 font-medium border-b border-slate-100 dark:border-slate-800">Instellingen</button>
                 <button onClick={handleLogout} className="block w-full text-left py-3 text-red-600 font-medium">Uitloggen</button>
               </>
             ) : (
               <>
                 <button onClick={() => navigateTo('login')} className="block w-full text-left py-3 text-slate-700 dark:text-slate-300 font-medium border-b border-slate-100 dark:border-slate-800">Inloggen</button>
                 <button onClick={() => navigateTo('register')} className="block w-full text-left py-3 text-teal-600 font-bold">Account Aanmaken</button>
               </>
             )}
          </div>
        </div>
      )}
    </nav>
  );

  const HomeView = () => (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative bg-teal-700 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1552674605-46d52604746d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Active lifestyle" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900 to-teal-800/80 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
            Fit, door dik en dun
          </h1>
          <p className="mt-6 text-xl text-teal-100 max-w-3xl">
            Samen werken aan een gezonde leefstijl, speciaal ontwikkeld voor en door mannen met prostaatkanker.
            Omdat een goede conditie het fundament is voor uw behandeling en herstel.
          </p>
          <div className="mt-10 flex space-x-4">
            {!currentUser ? (
              <>
                <Button size="lg" className="!bg-slate-900 !text-white !hover:bg-slate-800" onClick={() => navigateTo('register')}>
                  Start uw reis
                </Button>
                <Button size="lg" className="!bg-slate-900 !text-white !hover:bg-slate-800" onClick={() => navigateTo('login')}>
                  Inloggen
                </Button>
              </>
            ) : (
               <Button size="lg" variant="secondary" onClick={() => navigateTo('dashboard')}>
                  Naar mijn Dashboard
                </Button>
            )}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Waarom meedoen?</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl transition-colors duration-300">
                 <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center text-teal-600 mb-4">
                   <Activity className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Fysieke Kracht</h3>
                 <p className="text-slate-600 dark:text-slate-400">
                   Verbeter uw conditie voor een operatie of tijdens behandeling. Een sterker lichaam herstelt sneller.
                 </p>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl transition-colors duration-300">
                 <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center text-amber-600 mb-4">
                   <Users className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Samen Sterk</h3>
                 <p className="text-slate-600 dark:text-slate-400">
                   Deel ervaringen en successen (anoniem) met lotgenoten in Het Trefpunt. U staat er niet alleen voor.
                 </p>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl transition-colors duration-300">
                 <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                   <Brain className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Kennis & Inzicht</h3>
                 <p className="text-slate-600 dark:text-slate-400">
                   Direct toegang tot betrouwbare medische informatie en leefstijladviezen van experts.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  const KnowledgeHubView = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">KennisHub</h2>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Betrouwbare informatie over voeding, beweging en herstel bij prostaatkanker.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ARTICLES.map(article => (
          <ArticleCard key={article.id} article={article} onClick={handleArticleClick} />
        ))}
      </div>

      <div className="mt-16 bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-8 transition-colors duration-300">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
          <HelpCircle className="w-6 h-6 mr-2 text-teal-600" />
          Veelgestelde Vragen
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {FAQ_ITEMS.map(faq => (
             <div key={faq.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
               <span className="text-xs font-bold text-teal-600 uppercase tracking-wide mb-2 block">{faq.category}</span>
               <h4 className="font-bold text-slate-900 dark:text-white mb-2">{faq.question}</h4>
               <p className="text-sm text-slate-600 dark:text-slate-400">{faq.answer}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );

  const ArticleDetailView = () => {
    if (!selectedArticle) return null;
    return (
      <div className="bg-white dark:bg-slate-900 min-h-screen animate-fade-in transition-colors duration-300">
        <div className="relative h-96">
           <img src={selectedArticle.imageUrl} alt={selectedArticle.title} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
           <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
              <button 
                onClick={() => navigateTo('knowledge')}
                className="text-white/80 hover:text-white flex items-center mb-4 transition-colors"
              >
                <ChevronRight className="w-5 h-5 rotate-180 mr-1" /> Terug naar overzicht
              </button>
              <span className="px-3 py-1 bg-teal-600 text-white text-xs font-bold rounded-full uppercase tracking-wider mb-4 inline-block">
                {selectedArticle.category}
              </span>
              <h1 className="text-4xl font-bold text-white mb-2">{selectedArticle.title}</h1>
              <div className="flex items-center text-white/80 space-x-6">
                 <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {new Date(selectedArticle.date).toLocaleDateString('nl-NL')}</span>
                 <span className="flex items-center"><UserIcon className="w-4 h-4 mr-2" /> {selectedArticle.author}</span>
              </div>
           </div>
        </div>
        <div className="max-w-4xl mx-auto px-6 py-12">
           <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
              <p className="lead text-xl text-slate-600 dark:text-slate-300 mb-8 font-medium">
                {selectedArticle.excerpt}
              </p>
              <div className="whitespace-pre-line">
                {selectedArticle.content}
              </div>
           </div>
        </div>
      </div>
    );
  };

  const CommunityView = () => {
      return (
          <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-12 animate-fade-in transition-colors duration-300">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="mb-8 text-center">
                      <div className="inline-flex items-center justify-center p-3 bg-teal-100 dark:bg-teal-900/30 rounded-full text-teal-600 dark:text-teal-400 mb-4">
                          <Users className="w-8 h-8" />
                      </div>
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Het Trefpunt</h2>
                      <p className="text-slate-600 dark:text-slate-400">
                          Een veilige plek om elkaar aan te moedigen. Deel uw successen (anoniem) en steun anderen.
                      </p>
                  </div>

                  <div className="space-y-6">
                      {communityPosts.map(post => {
                          const getIcon = () => {
                              switch(post.actionType) {
                                  case 'badge_earned': return <Award className="w-5 h-5 text-amber-500" />;
                                  case 'challenge_join': return <Flag className="w-5 h-5 text-blue-500" />;
                                  case 'streak_milestone': return <Flame className="w-5 h-5 text-orange-500" />;
                                  case 'checkin_complete': return <CheckCircle className="w-5 h-5 text-green-500" />;
                                  default: return <Activity className="w-5 h-5" />;
                              }
                          };

                          return (
                              <div key={post.id} className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 animate-fade-in transition-colors duration-300">
                                  <div className="flex items-start mb-4">
                                      <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full mr-4 transition-colors duration-300">
                                          {getIcon()}
                                      </div>
                                      <div>
                                          <div className="flex items-baseline space-x-2">
                                              <span className="font-bold text-slate-900 dark:text-white">{post.userPseudonym}</span>
                                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                                  {new Date(post.timestamp).toLocaleTimeString('nl-NL', {hour: '2-digit', minute:'2-digit'})}
                                              </span>
                                          </div>
                                          <p className="text-slate-700 dark:text-slate-300 mt-1">{post.content}</p>
                                      </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-4 border-t border-slate-100 dark:border-slate-800 pt-4 transition-colors duration-300">
                                      <button 
                                          onClick={() => handleReaction(post.id, 'heart')}
                                          className={`flex items-center space-x-1 text-sm font-medium transition-colors ${post.currentUserReacted?.includes('heart') ? 'text-red-500' : 'text-slate-500 hover:text-red-500'}`}
                                      >
                                          <Heart className={`w-4 h-4 ${post.currentUserReacted?.includes('heart') ? 'fill-current' : ''}`} />
                                          <span>{post.reactions.heart}</span>
                                      </button>
                                      <button 
                                          onClick={() => handleReaction(post.id, 'muscle')}
                                          className={`flex items-center space-x-1 text-sm font-medium transition-colors ${post.currentUserReacted?.includes('muscle') ? 'text-amber-600' : 'text-slate-500 hover:text-amber-600'}`}
                                      >
                                          <Hand className="w-4 h-4" /> 
                                          <span>{post.reactions.muscle}</span>
                                      </button>
                                      <button 
                                          onClick={() => handleReaction(post.id, 'clap')}
                                          className={`flex items-center space-x-1 text-sm font-medium transition-colors ${post.currentUserReacted?.includes('clap') ? 'text-blue-500' : 'text-slate-500 hover:text-blue-500'}`}
                                      >
                                          <Share2 className="w-4 h-4" /> {/* Using Share/Clap metaphor */}
                                          <span>{post.reactions.clap}</span>
                                      </button>
                                  </div>
                              </div>
                          );
                      })}
                  </div>
                  
                  <div className="mt-8 text-center">
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                          * Om de veiligheid te waarborgen, zijn er geen openbare chatfuncties. Alle berichten worden automatisch gegenereerd op basis van behaalde doelen.
                      </p>
                  </div>
              </div>
          </div>
      );
  };
  
  const FoodAnalysisView = ({ onAddMeal, onNavigateLogbook }: { onAddMeal: (m: { name: string; description: string; calories: number }) => void, onNavigateLogbook: () => void }) => {
    const [scanMode, setScanMode] = useState<'meal' | 'product'>('meal');
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Reset
      setResult(null);
      setAnalyzing(true);
      setShowSuccess(false);

      // Create local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      try {
        // Convert to Base64 for API
        const base64Data = await new Promise<string>((resolve, reject) => {
          const r = new FileReader();
          r.readAsDataURL(file);
          r.onload = () => resolve((r.result as string).split(',')[1]);
          r.onerror = error => reject(error);
        });

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        let promptText = "";
        
        if (scanMode === 'meal') {
           promptText = "Analyseer deze foto van voedsel. Identificeer elk item op het bord. Schat de calorieën voor elk item op basis van de zichtbare portiegrootte. Geef het antwoord in het volgende JSON-formaat (zonder markdown code blocks): { items: [{ name: string, calories: number, portion: string }], totalCalories: number, healthTip: string }. Zorg dat alles in het Nederlands is.";
        } else {
           promptText = "Analyseer de achterkant van dit product (voedingslabel of ingrediëntenlijst). Analyseer of dit product past in een gezonde leefstijl, specifiek voor iemand die op zijn gezondheid let. Geef het antwoord in het volgende JSON-formaat (zonder markdown code blocks): { productName: string, healthScore: number (1-10), summary: string, pros: string[], cons: string[] }. healthScore 10 is super gezond, 1 is ongezond. Zorg dat alles in het Nederlands is.";
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: file.type,
                  data: base64Data
                }
              },
              {
                text: promptText
              }
            ]
          },
          config: {
            responseMimeType: 'application/json'
          }
        });
        
        const jsonText = response.text;
        const analysisData = JSON.parse(jsonText);
        
        // Add type discriminator
        const finalResult: AnalysisResult = scanMode === 'meal' 
          ? { type: 'meal', ...analysisData } 
          : { type: 'product', ...analysisData };

        // Simuleer een kleine vertraging als de API te snel is, voor het effect van de laadbalk
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setAnalyzing(false);
        setShowSuccess(true);
        
        setTimeout(() => {
          setShowSuccess(false);
          setResult(finalResult);
        }, 2000);

      } catch (error) {
        console.error("Analysis failed:", error);
        setAnalyzing(false);
        alert("Er ging iets mis bij het analyseren van de foto. Probeer het opnieuw.");
      }
    };

    return (
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-12 animate-fade-in transition-colors duration-300">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-10">
             <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Slimme Voedingsscan</h2>
             <p className="text-slate-600 dark:text-slate-400">
               Maak een foto en krijg direct inzicht in wat u eet.
             </p>
           </div>

           {/* Mode Selector */}
           <div className="flex justify-center mb-8">
             <div className="bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex transition-colors duration-300">
               <button 
                 onClick={() => { setScanMode('meal'); setResult(null); }}
                 className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${scanMode === 'meal' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
               >
                 <Utensils className="w-4 h-4 mr-2" />
                 Maaltijd op Bord
               </button>
               <button 
                 onClick={() => { setScanMode('product'); setResult(null); }}
                 className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${scanMode === 'product' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
               >
                 <ScanBarcode className="w-4 h-4 mr-2" />
                 Product Label
               </button>
             </div>
           </div>

           <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors duration-300">
              
              {/* Upload Area / Camera View */}
              {!result && !analyzing && !showSuccess && (
                <div className="p-8">
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative cursor-pointer group">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="bg-teal-50 dark:bg-teal-900/30 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                      <Camera className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      {scanMode === 'meal' ? 'Maak een foto van uw bord' : 'Maak een foto van de achterkant'}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                       {scanMode === 'meal' 
                         ? 'Of upload een bestaande foto om calorieën te tellen.'
                         : 'Richt op de ingrediëntenlijst of de voedingswaardetabel.'
                       }
                    </p>
                  </div>
                </div>
              )}

              {/* Analysis State */}
              {analyzing && (
                <div className="p-12 flex flex-col items-center justify-center">
                  {previewUrl && (
                    <img src={previewUrl} alt="Preview" className="w-32 h-32 object-cover rounded-xl mb-8 shadow-md opacity-50" />
                  )}
                  <h3 className="text-xl font-medium text-slate-800 dark:text-white mb-6 animate-pulse">Foto analyseren...</h3>
                  
                  {/* Custom Progress Bar */}
                  <div className="w-full max-w-md h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-400 to-teal-600 w-1/2 animate-[progress_1.5s_ease-in-out_infinite]"></div>
                  </div>
                  <style>{`
                    @keyframes progress {
                      0% { transform: translateX(-100%); }
                      100% { transform: translateX(200%); }
                    }
                  `}</style>
                </div>
              )}

              {/* Success Animation */}
              {showSuccess && (
                <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                    <div className="relative bg-green-500 text-white rounded-full p-6 shadow-2xl animate-bounce-short">
                      <Check className="w-12 h-12" />
                    </div>
                  </div>
                  <h3 className="mt-8 text-2xl font-bold text-slate-900 dark:text-white">Analyse Voltooid!</h3>
                </div>
              )}

              {/* Meal Results */}
              {result && result.type === 'meal' && (
                <div className="animate-fade-in">
                  <div className="relative h-48 bg-slate-100">
                    <img src={previewUrl || ''} alt="Meal" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-6">
                      <div className="text-white">
                        <p className="text-sm font-medium opacity-80">Totaal geschat</p>
                        <p className="text-4xl font-bold">{result.totalCalories} kcal</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center mb-6">
                      <Utensils className="w-5 h-5 text-teal-600 mr-2" />
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Op uw bord</h3>
                    </div>

                    <div className="space-y-4 mb-8">
                      {result.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 transition-colors duration-300">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{item.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{item.portion}</p>
                          </div>
                          <span className="font-semibold text-slate-700 dark:text-slate-200">{item.calories} kcal</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center p-3 border-t-2 border-slate-100 dark:border-slate-700 mt-2">
                        <span className="font-bold text-slate-900 dark:text-white">Totaal</span>
                        <span className="font-bold text-teal-600 text-lg">{result.totalCalories} kcal</span>
                      </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800/50 flex items-start transition-colors duration-300">
                      <div className="bg-amber-100 dark:bg-amber-800/40 p-2 rounded-lg text-amber-600 dark:text-amber-400 mr-3 mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-amber-800 dark:text-amber-200 mb-1">Tip van VitaBot</h4>
                        <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                          {result.healthTip}
                        </p>
                      </div>
                    </div>

                    {/* Add to Logbook Button */}
                    <Button 
                      onClick={() => {
                        onAddMeal({
                          name: "Gescande Maaltijd", 
                          description: `Bevat: ${result.items.map(i => i.name).join(', ')}.`,
                          calories: result.totalCalories
                        });
                        onNavigateLogbook();
                      }}
                      className="w-full mt-4 flex items-center justify-center"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Toevoegen aan Eetdagboek
                    </Button>
                  </div>
                </div>
              )}

              {/* Product Results */}
              {result && result.type === 'product' && (
                <div className="animate-fade-in">
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img src={previewUrl || ''} alt="Product" className="w-full h-full object-cover blur-sm scale-110" />
                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-6">
                       <h3 className="text-2xl font-bold text-white mb-2 shadow-sm">{result.productName}</h3>
                       <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                         <Activity className="w-5 h-5 text-white" />
                         <span className="text-white font-semibold">Gezondheidsscore: {result.healthScore}/10</span>
                       </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-6">
                       <h4 className="font-bold text-slate-900 dark:text-white mb-2">Samenvatting</h4>
                       <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{result.summary}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                       <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800/50 transition-colors duration-300">
                          <h5 className="font-bold text-green-800 dark:text-green-300 mb-3 flex items-center">
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            Pluspunten
                          </h5>
                          <ul className="space-y-2">
                            {result.pros.map((pro, i) => (
                              <li key={i} className="flex items-start text-sm text-green-700 dark:text-green-200">
                                <span className="mr-2">•</span> {pro}
                              </li>
                            ))}
                          </ul>
                       </div>
                       
                       <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800/50 transition-colors duration-300">
                          <h5 className="font-bold text-red-800 dark:text-red-300 mb-3 flex items-center">
                            <ThumbsDown className="w-4 h-4 mr-2" />
                            Aandachtspunten
                          </h5>
                          <ul className="space-y-2">
                            {result.cons.map((con, i) => (
                              <li key={i} className="flex items-start text-sm text-red-700 dark:text-red-200">
                                <span className="mr-2">•</span> {con}
                              </li>
                            ))}
                          </ul>
                       </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Reset Button (Common) */}
              {result && (
                <div className="px-6 pb-8">
                  <Button onClick={() => setResult(null)} variant="outline" className="w-full">
                    Nieuwe scan maken
                  </Button>
                </div>
              )}
           </div>
        </div>
      </div>
    );
  };

  const SettingsView = () => {
    if (!currentUser) return null;
    const { name, startWeight, goalWeight, carePathId } = currentUser.profile;
    
    // Local state for the form to avoid constant DB updates on every keystroke
    const [localName, setLocalName] = useState(name);
    const [localGoal, setLocalGoal] = useState(goalWeight);

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Instellingen</h2>
        
        <div className="space-y-6">
           
           {/* Profile Section */}
           <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 transition-colors duration-300">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Profiel</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gebruikersnaam</label>
                    <input 
                      type="text" 
                      className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300"
                      value={localName}
                      onChange={(e) => setLocalName(e.target.value)}
                      onBlur={() => handleUpdateProfile({ name: localName })}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-mailadres</label>
                    <input type="email" disabled value={currentUser.email} className="w-full rounded-lg border-slate-200 bg-slate-100 dark:bg-slate-900/50 dark:border-slate-700 text-slate-500 cursor-not-allowed transition-colors duration-300" />
                 </div>
              </div>
           </div>

           {/* Goals Section */}
           <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 transition-colors duration-300">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Doelen</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Gewicht (kg)</label>
                    <input type="number" disabled value={startWeight} className="w-full rounded-lg border-slate-200 bg-slate-100 dark:bg-slate-900/50 dark:border-slate-700 text-slate-500 cursor-not-allowed transition-colors duration-300" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Doel Gewicht (kg)</label>
                    <input 
                      type="number" step="0.1"
                      className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300"
                      value={localGoal}
                      onChange={(e) => setLocalGoal(parseFloat(e.target.value))}
                      onBlur={() => handleUpdateProfile({ goalWeight: localGoal })}
                    />
                 </div>
              </div>
           </div>

           {/* Care Path Section */}
           <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 transition-colors duration-300">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Behandelfase (Zorgpad)</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Selecteer uw huidige situatie zodat wij de tips kunnen personaliseren.
              </p>
              <div className="grid grid-cols-1 gap-3">
                 {CARE_PATHS.map(path => (
                    <div 
                      key={path.id}
                      onClick={() => handleUpdateProfile({ carePathId: path.id as any })}
                      className={`cursor-pointer border rounded-lg p-4 flex items-start transition-colors duration-300 ${
                        carePathId === path.id 
                          ? 'bg-teal-50 border-teal-500 dark:bg-teal-900/20 dark:border-teal-500' 
                          : 'border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-slate-500'
                      }`}
                    >
                      <div className={`p-2 rounded-full mr-3 ${carePathId === path.id ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                         <path.icon className="w-5 h-5" />
                      </div>
                      <div>
                         <h4 className={`font-bold text-sm ${carePathId === path.id ? 'text-teal-800 dark:text-teal-300' : 'text-slate-800 dark:text-slate-200'}`}>{path.title}</h4>
                         <p className="text-xs text-slate-500 dark:text-slate-400">{path.description}</p>
                      </div>
                      {carePathId === path.id && <CheckCircle className="w-5 h-5 text-teal-600 ml-auto" />}
                    </div>
                 ))}
              </div>
           </div>

           {/* Appearance */}
           <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 transition-colors duration-300">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Uiterlijk</h3>
              <div className="flex items-center justify-between">
                 <span className="text-slate-700 dark:text-slate-300">Donkere modus</span>
                 <button 
                   onClick={toggleTheme}
                   className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${currentUser.profile.themePreference === 'dark' ? 'bg-teal-600' : 'bg-slate-300'}`}
                 >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${currentUser.profile.themePreference === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                 </button>
              </div>
           </div>

           {/* Danger Zone */}
           <div className="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30 p-6 transition-colors duration-300">
              <h3 className="text-lg font-bold text-red-800 dark:text-red-400 mb-2">Gevarenzone</h3>
              <p className="text-sm text-red-600 dark:text-red-300 mb-4">
                 Het verwijderen van uw account is permanent en kan niet ongedaan worden gemaakt.
              </p>
              <Button variant="secondary" className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteAccount}>
                 Account Verwijderen
              </Button>
           </div>
        </div>
      </div>
    );
  };

  const Footer = () => (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 mt-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
               <div className="flex items-center mb-4">
                  <Heart className="h-6 w-6 text-teal-600" />
                  <span className="ml-2 text-lg font-bold text-slate-900 dark:text-white">Fit, door dik en dun</span>
               </div>
               <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                  Een initiatief om mannen met prostaatkanker te ondersteunen bij het bereiken van een gezonde leefstijl voor een beter herstel.
               </p>
            </div>
            <div>
               <h4 className="font-bold text-slate-900 dark:text-white mb-4">Snel naar</h4>
               <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li><button onClick={() => navigateTo('home')} className="hover:text-teal-600">Home</button></li>
                  {currentUser && (
                    <>
                      <li><button onClick={() => navigateTo('knowledge')} className="hover:text-teal-600">KennisHub</button></li>
                      <li><button onClick={() => navigateTo('community')} className="hover:text-teal-600">Het Trefpunt</button></li>
                    </>
                  )}
                  {!currentUser && (
                    <li><button onClick={() => navigateTo('login')} className="hover:text-teal-600">Inloggen</button></li>
                  )}
               </ul>
            </div>
            <div>
               <h4 className="font-bold text-slate-900 dark:text-white mb-4">Ondersteuning</h4>
               <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li><a href="#" className="hover:text-teal-600">Veelgestelde Vragen</a></li>
                  <li><a href="#" className="hover:text-teal-600">Privacybeleid</a></li>
                  <li><a href="#" className="hover:text-teal-600">Contact</a></li>
               </ul>
            </div>
         </div>
         <div className="border-t border-slate-100 dark:border-slate-800 mt-12 pt-8 flex justify-between items-center flex-col md:flex-row">
            <p className="text-xs text-slate-400">© 2024 Fit, door dik en dun. Alle rechten voorbehouden.</p>
            <p className="text-xs text-slate-400 mt-2 md:mt-0">
              Disclaimer: Deze app vervangt geen medisch advies.
            </p>
         </div>
      </div>
    </footer>
  );

  return (
    <div className={`flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300`}>
      {/* Success Overlay Animation */}
      {activeAnimation && (
        <div className="fixed inset-0 z-[100] bg-white/95 dark:bg-slate-950/95 flex items-center justify-center animate-fade-in">
           {activeAnimation === 'Voeding' && <BroccoliAnimation />}
           {activeAnimation === 'Beweging' && <RunnerAnimation />}
           {activeAnimation === 'Mentaal' && <ZenAnimation />}
        </div>
      )}

      {/* Simulated Email Notification (For Demo Purposes) */}
      {simulatedEmail && (
        <div className="fixed top-24 right-4 z-[120] max-w-sm w-full bg-white dark:bg-slate-800 shadow-2xl rounded-xl border border-slate-200 dark:border-slate-700 animate-slide-in-right overflow-hidden transition-colors duration-300">
          <div className="bg-slate-100 dark:bg-slate-900 p-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center transition-colors duration-300">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Nieuw bericht</span>
            </div>
            <button onClick={() => setSimulatedEmail(null)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
          </div>
          <div className="p-4">
             <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Reset uw wachtwoord</h4>
             <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Van: noreply@prostavita.nl</p>
             <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
               Beste gebruiker, klik hieronder om uw wachtwoord te herstellen.
             </p>
             <Button 
               size="sm" 
               className="w-full" 
               onClick={() => {
                 setResetToken(simulatedEmail.link);
                 setSimulatedEmail(null);
                 navigateTo('reset-password');
               }}
             >
               Reset Link
             </Button>
          </div>
        </div>
      )}

      {/* Stop Challenge Modal */}
      {showStopChallengeModal && (
        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in border border-slate-200 dark:border-slate-700 transition-colors duration-300">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-bold text-slate-900 dark:text-white">Challenge Stoppen</h3>
               <button onClick={() => setShowStopChallengeModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
             </div>
             <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
               Wat vervelend dat u stopt, maar uw gezondheid gaat voor. Kunt u aangeven waarom u stopt? Dit helpt ons de app te verbeteren.
             </p>
             <textarea 
               className="w-full border border-slate-300 dark:border-slate-700 rounded-lg p-3 mb-4 text-sm dark:bg-slate-800 dark:text-white focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300"
               rows={3}
               placeholder="Reden van stoppen..."
               value={stopReason}
               onChange={(e) => setStopReason(e.target.value)}
             />
             <div className="flex justify-end space-x-2">
                <Button variant="ghost" onClick={() => setShowStopChallengeModal(false)}>Annuleren</Button>
                <Button variant="secondary" onClick={confirmStopChallenge} className="bg-red-600 text-white hover:bg-red-700">Bevestigen & Stoppen</Button>
             </div>
           </div>
        </div>
      )}

      {/* Advanced Streak Freeze Modal */}
      {showFreezeModal && (
        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-fade-in border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto transition-colors duration-300">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                 <PauseCircle className="w-6 h-6 mr-2 text-teal-600" />
                 Rust & Herstel
               </h3>
               <button onClick={() => setShowFreezeModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
             </div>
             
             {/* Option 1: Monthly Free Freeze */}
             <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 transition-colors duration-300">
                <div className="flex items-start mb-3">
                   <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 mr-3">
                     <Calendar className="w-5 h-5" />
                   </div>
                   <div>
                     <h4 className="font-bold text-slate-800 dark:text-white text-sm">Incidentele Rustdag</h4>
                     <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">U kunt 1x per maand een gratis rustdag opnemen als het even niet lukt.</p>
                   </div>
                </div>
                {isFreeFreezeEligible ? (
                   <Button onClick={confirmFreeFreeze} className="w-full text-sm">
                     Neem Gratis Rustdag
                   </Button>
                ) : (
                   <div className="text-center p-2 bg-slate-200 dark:bg-slate-700 rounded text-xs text-slate-500 transition-colors duration-300">
                     Reeds gebruikt deze maand. Beschikbaar op 1e van volgende maand.
                   </div>
                )}
             </div>

             {/* Option 2: Medical Freeze */}
             <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 transition-colors duration-300">
                <div className="flex items-start mb-4">
                   <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg text-indigo-600 mr-3">
                     <Stethoscope className="w-5 h-5" />
                   </div>
                   <div>
                     <h4 className="font-bold text-slate-800 dark:text-white text-sm">Medische Behandeling</h4>
                     <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                       Wordt u behandeld of moet u herstellen? Vul de periode in waarin u niet kunt tracken. Uw streak blijft behouden.
                     </p>
                   </div>
                </div>
                
                <div className="space-y-3">
                   <div>
                     <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Startdatum</label>
                     <input 
                       type="date" 
                       className="w-full text-sm p-2 rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300"
                       value={medicalStartDate}
                       onChange={(e) => setMedicalStartDate(e.target.value)}
                     />
                   </div>
                   <div>
                     <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Einddatum (schatting)</label>
                     <input 
                       type="date" 
                       className="w-full text-sm p-2 rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300"
                       value={medicalEndDate}
                       onChange={(e) => setMedicalEndDate(e.target.value)}
                     />
                   </div>
                   <Button onClick={confirmMedicalFreeze} className="w-full text-sm mt-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                     Activeer Medische Pauze
                   </Button>
                </div>
             </div>

           </div>
        </div>
      )}

      {/* Floating Chat Widget - RESTRICTED TO LOGGED IN USERS */}
      {currentUser && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
          {isChatOpen && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl mb-4 w-80 sm:w-96 h-[500px] flex flex-col border border-slate-200 dark:border-slate-800 animate-fade-in overflow-hidden transition-colors duration-300">
              {/* Chat Header */}
              <div className="bg-teal-600 p-4 flex justify-between items-center text-white">
                <div className="flex items-center">
                  <Bot className="w-6 h-6 mr-2" />
                  <div>
                    <h3 className="font-bold text-sm">VitaBot</h3>
                    <span className="text-teal-100 text-xs flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                      Online Leefstijlcoach
                    </span>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-white/80 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-teal-600 text-white rounded-br-none' 
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-none'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-bl-none px-4 py-3 border border-slate-100 dark:border-slate-700 transition-colors duration-300">
                        <div className="flex space-x-1.5">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleChatSubmit} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
                <div className="flex items-center space-x-2">
                  <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Stel een vraag..."
                      className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-300"
                      disabled={isChatLoading}
                  />
                  <button 
                    type="submit" 
                    disabled={!chatInput.trim() || isChatLoading}
                    className="bg-teal-600 text-white p-2.5 rounded-full hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 text-center mt-2">
                  VitaBot geeft geen medisch advies.
                </p>
              </form>
            </div>
          )}

          {/* Toggle Button */}
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center group"
          >
            {isChatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            {!isChatOpen && (
              <span className="absolute right-full mr-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-lg text-sm font-medium shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Stel een vraag aan VitaBot
              </span>
            )}
          </button>
        </div>
      )}

      <Navbar />
      <main className="flex-grow">
        {currentView === 'home' && <HomeView />}
        {currentView === 'login' && <LoginView onLogin={handleLogin} onNavigateRegister={() => navigateTo('register')} onNavigateForgot={() => navigateTo('forgot-password')} />}
        {currentView === 'forgot-password' && <ForgotPasswordView onBack={() => navigateTo('login')} onSubmit={handleForgotPassword} />}
        {currentView === 'reset-password' && <ResetPasswordView onReset={handleResetPassword} />}
        {currentView === 'register' && <RegisterView onRegister={handleRegister} onNavigateLogin={() => navigateTo('login')} />}
        {currentView === 'knowledge' && <KnowledgeHubView />}
        {currentView === 'article-detail' && <ArticleDetailView />}
        {currentView === 'dashboard' && currentUser && (
          <DashboardView 
            currentUser={currentUser}
            weightEntries={weightEntries}
            checkInEntries={checkInEntries}
            combinedWeight={combinedWeight}
            setCombinedWeight={setCombinedWeight}
            checkInValues={checkInValues}
            setCheckInValues={setCheckInValues}
            handleCombinedSubmit={handleCombinedSubmit}
            handleOpenFreezeModal={handleOpenFreezeModal}
            freeFreezeActive={freeFreezeActive}
            medicalFreezeActive={medicalFreezeActive}
            activeChallenge={activeChallenge}
            handleStopChallengeClick={handleStopChallengeClick}
            handleJoinChallenge={handleJoinChallenge}
            isDark={isDark}
          />
        )}
        {currentView === 'settings' && <SettingsView />}
        {currentView === 'food-analysis' && (
          <FoodAnalysisView 
            onAddMeal={handleAddMeal} 
            onNavigateLogbook={() => navigateTo('meal-logbook')} 
          />
        )}
        {currentView === 'community' && <CommunityView />}
        {currentView === 'meal-logbook' && currentUser && (
          <MealLogbook 
            entries={mealEntries} 
            onAdd={handleAddMeal}
            onDelete={handleDeleteMeal}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
