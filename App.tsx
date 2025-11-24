
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
  XCircle
} from 'lucide-react';
import { GoogleGenAI, Chat } from "@google/genai";
import { Button } from './components/Button';
import { ArticleCard } from './components/ArticleCard';
import { WeightChart } from './components/WeightChart';
import { Article, UserProfile, WeightEntry, DailyCheckIn, User, FAQItem, Badge, Challenge } from './types';
import { ARTICLES, FAQ_ITEMS, CHECKIN_QUESTIONS, BADGES, CHALLENGES } from './constants';
import { db } from './services/DatabaseService';

// ---- Views Enum ----
type View = 'home' | 'login' | 'register' | 'knowledge' | 'dashboard' | 'article-detail' | 'settings' | 'food-analysis';

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

const SneakerAnimation = () => (
  <div className="flex flex-col items-center justify-center">
    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="animate-pulse">
       <path d="M40 120 Q40 90 70 80 L130 80 Q160 80 160 110 L160 130 Q160 150 130 150 L70 150 Q40 150 40 120 Z" fill="#f59e0b" />
       <path d="M50 120 L70 90" stroke="white" strokeWidth="4" strokeLinecap="round" />
       <path d="M80 120 L100 90" stroke="white" strokeWidth="4" strokeLinecap="round" />
       <path d="M110 120 L130 90" stroke="white" strokeWidth="4" strokeLinecap="round" />
       <rect x="40" y="145" width="120" height="10" rx="5" fill="#fff" />
       {/* Speed lines */}
       <path d="M170 100 L190 100" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
       <path d="M175 120 L195 120" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
    </svg>
    <h3 className="text-2xl font-bold text-amber-600 mt-4">In Beweging!</h3>
    <p className="text-amber-800">Tijd om stappen te zetten.</p>
  </div>
);

const ZenAnimation = () => (
  <div className="flex flex-col items-center justify-center">
    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <g className="animate-[spin_10s_linear_infinite]">
         <circle cx="100" cy="100" r="40" fill="#6366f1" opacity="0.5" />
         <circle cx="100" cy="60" r="30" fill="#818cf8" opacity="0.6" />
         <circle cx="100" cy="140" r="30" fill="#818cf8" opacity="0.6" />
         <circle cx="60" cy="100" r="30" fill="#818cf8" opacity="0.6" />
         <circle cx="140" cy="100" r="30" fill="#818cf8" opacity="0.6" />
      </g>
      <circle cx="100" cy="100" r="15" fill="white" />
    </svg>
    <h3 className="text-2xl font-bold text-indigo-600 mt-4">Rust & Balans</h3>
    <p className="text-indigo-800">Adem in, adem uit.</p>
  </div>
);

// ---- Extracted Components (to prevent re-render issues) ----

const LoginView = ({ onLogin, onNavigateRegister }: { onLogin: (e: string, p: string) => void, onNavigateRegister: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
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
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 placeholder-slate-500 text-slate-900 dark:text-white dark:bg-slate-800 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                placeholder="naam@voorbeeld.nl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Wachtwoord</label>
              <input
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 placeholder-slate-500 text-slate-900 dark:text-white dark:bg-slate-800 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
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
              className="rounded-lg w-full px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-teal-500 focus:border-teal-500"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-mailadres</label>
            <input
              type="email"
              required
              className="rounded-lg w-full px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-teal-500 focus:border-teal-500"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Wachtwoord</label>
            <input
              type="password"
              required
              className="rounded-lg w-full px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-teal-500 focus:border-teal-500"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Gewicht</label>
                <input
                  type="number" step="0.1" min="0.1" required
                  className="rounded-lg w-full px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-teal-500 focus:border-teal-500"
                  value={formData.startWeight}
                  onChange={(e) => setFormData({...formData, startWeight: e.target.value})}
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Doel Gewicht</label>
                <input
                  type="number" step="0.1" min="0.1" required
                  className="rounded-lg w-full px-3 py-2 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-teal-500 focus:border-teal-500"
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

// ---- Main App Component ----
export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // App Data State (Linked to User ID)
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [checkInEntries, setCheckInEntries] = useState<DailyCheckIn[]>([]);
  
  // Notification State
  const [notification, setNotification] = useState<string | null>(null);

  // Combined Form State (Dashboard)
  const [combinedWeight, setCombinedWeight] = useState<string>('');
  const [checkInValues, setCheckInValues] = useState<Record<string, number>>({
    energy: 5, strength: 5, hunger: 5, mood: 5, stress: 5, sleep: 5
  });

  // Gamification State
  const [streakFrozen, setStreakFrozen] = useState(false);
  const [activeAnimation, setActiveAnimation] = useState<string | null>(null);

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
            systemInstruction: `Je bent VitaBot, een empathische, ondersteunende AI-leefstijlcoach voor de applicatie 'ProstaVita'. Jouw doelgroep bestaat uit mannen met prostaatkanker (of herstellende daarvan). 
            
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
      
      setWeightEntries(weights);
      setCheckInEntries(checkins);
    } else {
      // Default theme for guests/logged out
      document.documentElement.classList.remove('dark');
      setWeightEntries([]);
      setCheckInEntries([]);
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
    if (startWeight <= 0 || goalWeight <= 0) {
      alert('Gewicht moet een positief getal zijn.');
      return;
    }
    if (isNaN(startWeight) || isNaN(goalWeight)) {
      alert('Voer geldige getallen in voor het gewicht.');
      return;
    }

    try {
      const newUser = await db.registerUser(email, password, {
        name,
        startWeight,
        goalWeight,
        themePreference: 'light',
        activeChallengeId: null
      });
      
      setCurrentUser(newUser);
      navigateTo('dashboard');
      showNotification('Account succesvol aangemaakt! U bent nu ingelogd.');
    } catch (err: any) {
      alert(err.message || 'Registratie mislukt');
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

  const handleCombinedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    // Safety Check for Rapid Weight Loss (Ethical Safeguard)
    if (combinedWeight) {
        const newWeight = parseFloat(combinedWeight);
        const lastEntry = weightEntries.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        if (lastEntry) {
            const diff = lastEntry.weight - newWeight;
            // If lost more than 2kg since last entry (assuming roughly weekly/daily), show warning
            if (diff > 2.5) {
                if(!window.confirm("Let op: U heeft een aanzienlijk gewichtsverlies ingevoerd. Snel gewichtsverlies kan ongezond zijn. Weet u zeker dat dit klopt? Wij raden aan bij twijfel uw arts te raadplegen.")) {
                    return;
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
      const newWeightEntry = db.addWeightEntry(currentUser.id, parseFloat(combinedWeight));
      setWeightEntries(prev => [...prev, newWeightEntry]);
    }

    setCheckInEntries(prev => [...prev, newCheckIn]);
    setCombinedWeight('');
    // Reset sliders to middle
    setCheckInValues({ energy: 5, strength: 5, hunger: 5, mood: 5, stress: 5, sleep: 5 });
    
    // Gamification feedback
    showNotification(`Meting opgeslagen! Goed bezig, ${currentUser.profile.name}. Uw streak loopt door!`);
  };

  const handleDeleteWeight = (id: string) => {
    if (!currentUser) return;
    if (window.confirm('Weet u zeker dat u deze meting wilt verwijderen?')) {
      db.deleteWeightEntry(currentUser.id, id);
      setWeightEntries(prev => prev.filter(e => e.id !== id));
      showNotification(`Meting verwijderd, ${currentUser.profile.name}.`);
    }
  };

  // --- Challenge Logic ---

  const handleJoinChallenge = async (challenge: Challenge) => {
    if (!currentUser) return;

    // Enforce Single Challenge Rule
    if (currentUser.profile.activeChallengeId && currentUser.profile.activeChallengeId !== challenge.id) {
       if(!window.confirm("U doet al mee aan een andere challenge. U kunt maar één challenge tegelijk volgen om focus te behouden. Wilt u wisselen?")) {
         return;
       }
    }

    try {
      // Trigger Animation
      setActiveAnimation(challenge.category);
      
      // Update DB
      const updatedUser = await db.updateUserProfile(currentUser.id, { activeChallengeId: challenge.id });
      setCurrentUser(updatedUser);
      
      // Close animation after 3.5s
      setTimeout(() => setActiveAnimation(null), 3500);

    } catch (e) {
      console.error(e);
      alert("Er ging iets mis bij het starten van de challenge.");
    }
  };

  const handleLeaveChallenge = async () => {
    if (!currentUser) return;
    if (window.confirm("Weet u zeker dat u wilt stoppen met deze challenge?")) {
       const updatedUser = await db.updateUserProfile(currentUser.id, { activeChallengeId: null });
       setCurrentUser(updatedUser);
       showNotification("Challenge gestopt. Neem even rust en kies later een nieuwe.");
    }
  };

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

  // ---- Components ----

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div></div>;

  const Navbar = () => (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => navigateTo('home')}>
            <Heart className="h-8 w-8 text-teal-600 fill-teal-600" />
            <span className="ml-2 text-xl font-bold text-slate-800 dark:text-white tracking-tight">ProstaVita</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => navigateTo('home')}
              className={`text-sm font-medium ${currentView === 'home' ? 'text-teal-600' : 'text-slate-600 dark:text-slate-300 hover:text-teal-600'}`}
            >
              Home
            </button>
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

            {currentUser ? (
              <>
                <button 
                  onClick={() => navigateTo('dashboard')}
                  className={`text-sm font-medium ${currentView === 'dashboard' ? 'text-teal-600' : 'text-slate-600 dark:text-slate-300 hover:text-teal-600'}`}
                >
                  Dashboard
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
             <button onClick={() => navigateTo('knowledge')} className="block w-full text-left py-3 text-slate-700 dark:text-slate-300 font-medium border-b border-slate-100 dark:border-slate-800">KennisHub</button>
             <button onClick={() => navigateTo('food-analysis')} className="block w-full text-left py-3 text-slate-700 dark:text-slate-300 font-medium border-b border-slate-100 dark:border-slate-800">Voedingsscan</button>
             
             {currentUser ? (
               <>
                 <button onClick={() => navigateTo('dashboard')} className="block w-full text-left py-3 text-slate-700 dark:text-slate-300 font-medium border-b border-slate-100 dark:border-slate-800">Mijn Dashboard</button>
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

  // ---- Main Views ----
  
  const FoodAnalysisView = () => {
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
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-12 animate-fade-in">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-10">
             <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Slimme Voedingsscan</h2>
             <p className="text-slate-600 dark:text-slate-400">
               Maak een foto en krijg direct inzicht in wat u eet.
             </p>
           </div>

           {/* Mode Selector */}
           <div className="flex justify-center mb-8">
             <div className="bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex">
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

           <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800">
              
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
                        <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
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

                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800/50 flex items-start">
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
                       <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800/50">
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
                       
                       <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800/50">
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

  const HomeView = () => (
    <div className="animate-fade-in bg-white dark:bg-slate-950">
      {/* Improved Marketing Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
           <img 
            src="https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=2070&auto=format&fit=crop" 
            alt="Active lifestyle senior" 
            className="w-full h-full object-cover opacity-20"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 md:pt-48 md:pb-32">
          <div className="max-w-3xl">
             <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium mb-6">
               <Shield className="w-4 h-4 mr-2" />
               Veilige & Privacy-vriendelijke omgeving
             </div>
             <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight tracking-tight">
               Neem de regie over <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">uw gezondheid</span>
             </h1>
             <p className="text-xl md:text-2xl text-slate-300 mb-10 leading-relaxed max-w-2xl">
               ProstaVita is het eerste platform dat mannen met prostaatkanker ondersteunt bij het verbeteren van hun leefstijl, met focus op gewicht, mentale kracht en kennis.
             </p>
             
             <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button size="lg" className="text-lg px-8 py-4 shadow-xl shadow-teal-900/20" onClick={() => navigateTo(currentUser ? 'dashboard' : 'register')}>
                  Start Kosteloos
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                {/* Changed button to BLUE as requested */}
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-4 bg-blue-600 text-white hover:bg-blue-700 border-none shadow-md" 
                  onClick={() => navigateTo('knowledge')}
                >
                  Bekijk KennisHub
                </Button>
             </div>

             {/* Social Proof */}
             <div className="mt-12 flex items-center space-x-8 text-slate-400 text-sm font-medium">
                <div className="flex items-center"><Users className="w-5 h-5 mr-2 text-teal-500" /> +14.000 diagnoses p/j</div>
                <div className="flex items-center"><CheckCircle className="w-5 h-5 mr-2 text-teal-500" /> Expert Validatie</div>
             </div>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Waarom leefstijl cruciaal is</h2>
             <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
               Onderzoek toont aan dat een gezond gewicht en actieve leefstijl de behandeling van prostaatkanker positief beïnvloeden en bijwerkingen verminderen.
             </p>
           </div>
           
           <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  icon: <Activity className="w-8 h-8 text-teal-600" />,
                  title: "Sneller Herstel",
                  desc: "Een betere conditie zorgt voor minder risico's bij operaties en een vlotter herstel na behandelingen."
                },
                {
                  icon: <Scale className="w-8 h-8 text-amber-500" />,
                  title: "Gezond Gewicht",
                  desc: "Overgewicht kan behandelingen complexer maken. Wij helpen u op een verantwoorde manier uw doelen te bereiken."
                },
                {
                  icon: <BookOpen className="w-8 h-8 text-blue-500" />,
                  title: "Kennis is Kracht",
                  desc: "Begrijp wat er in uw lichaam gebeurt. Onze KennisHub staat vol met medisch gevalideerde artikelen."
                }
              ].map((feature, idx) => (
                <div key={idx} className="group p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300">
                   <div className="mb-6 bg-white dark:bg-slate-800 w-16 h-16 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                     {feature.icon}
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                   <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );

  const KnowledgeHubView = () => {
    const [activeTab, setActiveTab] = useState<'articles' | 'faq'>('articles');
    const [selectedCategory, setSelectedCategory] = useState<string>('Alles');
    const [faqSearch, setFaqSearch] = useState('');
    const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

    const toggleFaq = (id: string) => {
      setExpandedFaqId(expandedFaqId === id ? null : id);
    };

    // Filter Logic
    const filteredArticles = selectedCategory === 'Alles' 
      ? ARTICLES 
      : ARTICLES.filter(a => a.category === selectedCategory);

    const filteredFaqs = FAQ_ITEMS.filter(item => 
      item.question.toLowerCase().includes(faqSearch.toLowerCase()) || 
      item.answer.toLowerCase().includes(faqSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(faqSearch.toLowerCase())
    );

    return (
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-12 animate-fade-in transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">KennisHub</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-3xl">
              Verdiep uw kennis over leven met prostaatkanker. Vind betrouwbare artikelen en antwoorden op veelgestelde vragen.
            </p>
          </div>

          <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8">
            <button
              onClick={() => setActiveTab('articles')}
              className={`pb-4 px-6 text-sm font-medium transition-colors border-b-2 flex items-center ${
                activeTab === 'articles' 
                  ? 'border-teal-600 text-teal-600 dark:text-teal-400 dark:border-teal-400' 
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Artikelen
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`pb-4 px-6 text-sm font-medium transition-colors border-b-2 flex items-center ${
                activeTab === 'faq' 
                  ? 'border-teal-600 text-teal-600 dark:text-teal-400 dark:border-teal-400' 
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Veelgestelde Vragen
            </button>
          </div>

          {activeTab === 'articles' && (
            <div className="animate-fade-in">
              <div className="flex flex-wrap gap-2 mb-8">
                {['Alles', 'Voeding', 'Beweging', 'Mentaal', 'Medisch'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === cat 
                        ? 'bg-teal-600 text-white shadow-md' 
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article) => (
                  <ArticleCard 
                    key={article.id} 
                    article={article} 
                    onClick={handleArticleClick}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="max-w-3xl animate-fade-in">
              <div className="relative mb-8">
                <input
                  type="text"
                  placeholder="Zoek in vragen & antwoorden..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 shadow-sm"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
              </div>

              <div className="space-y-4">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(item.id)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors focus:outline-none"
                      >
                        <div>
                          <span className="inline-block px-2 py-1 mb-2 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/30 rounded-md">
                            {item.category}
                          </span>
                          <h3 className="text-lg font-medium text-slate-900 dark:text-white pr-4">{item.question}</h3>
                        </div>
                        <div className={`transition-transform duration-200 text-slate-400 flex-shrink-0 ${expandedFaqId === item.id ? 'rotate-180' : ''}`}>
                          <ChevronDown className="w-5 h-5" />
                        </div>
                      </button>
                      
                      {expandedFaqId === item.id && (
                        <div className="px-6 pb-6 pt-2 border-t border-slate-50 dark:border-slate-700 animate-fade-in">
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500 dark:text-slate-400">Geen vragen gevonden.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const ArticleDetailView = () => {
    if (!selectedArticle) return null;
    return (
      <div className="bg-white dark:bg-slate-950 min-h-screen py-12 animate-fade-in transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => navigateTo('knowledge')}
            className="flex items-center text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 mb-8 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Terug naar overzicht
          </button>
          
          <span className="inline-block px-3 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
            {selectedArticle.category}
          </span>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            {selectedArticle.title}
          </h1>
          
          <div className="flex items-center space-x-6 text-slate-500 dark:text-slate-400 mb-8 text-sm border-b border-slate-100 dark:border-slate-800 pb-8">
            <span className="flex items-center">
              <UserIcon className="w-4 h-4 mr-2" />
              {selectedArticle.author}
            </span>
            <span className="flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Leestijd: 5 min
            </span>
          </div>

          <img 
            src={selectedArticle.imageUrl} 
            alt={selectedArticle.title}
            className="w-full h-80 object-cover rounded-2xl mb-10 shadow-lg"
          />
          
          <div className="prose prose-slate dark:prose-invert prose-lg max-w-none">
            <p className="font-medium text-xl text-slate-800 dark:text-slate-200 mb-6">{selectedArticle.excerpt}</p>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              {selectedArticle.content}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const DashboardView = () => {
    if (!currentUser) return null;

    // determine last weight
    const currentWeight = weightEntries.length > 0 
      ? weightEntries.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].weight 
      : currentUser.profile.startWeight;

    const difference = (currentWeight - currentUser.profile.startWeight).toFixed(1);
    const isLoss = Number(difference) < 0;

    // Calculate streak
    const dates = new Set([
      ...weightEntries.map(e => e.date),
      ...checkInEntries.map(e => e.date)
    ]);
    const streak = dates.size > 0 ? dates.size : 0;

    return (
      <div className={`${getThemeWrapperClass()} min-h-screen py-8 animate-fade-in transition-all duration-700`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mijn Dashboard</h1>
              <p className="text-slate-500 dark:text-slate-400">Welkom terug, {currentUser.profile.name}.</p>
              {activeChallenge && (
                <div className="mt-2 inline-flex items-center text-xs font-semibold bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                  Huidige Focus: {activeChallenge.title}
                </div>
              )}
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
               <div className={`px-4 py-2 rounded-lg border flex items-center text-sm font-medium transition-colors ${streakFrozen ? 'bg-blue-100 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-200' : 'bg-amber-100 border-amber-200 text-amber-800 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-200'}`}>
                 {streakFrozen ? <Coffee className="w-4 h-4 mr-2" /> : <Flame className="w-4 h-4 mr-2" />}
                 {streakFrozen ? 'Rustdag Actief' : `${streak} Dagen Reeks`}
               </div>
               {/* Streak Freeze Button (Autonomy & Ethical implementation) */}
               {!streakFrozen && (
                 <button 
                    onClick={() => { setStreakFrozen(true); showNotification("Rustdag ingesteld. Uw reeks blijft behouden!"); }}
                    className="text-xs text-slate-500 hover:text-teal-600 underline"
                 >
                   Rustdag nemen
                 </button>
               )}
            </div>
          </div>

          {/* Toast Notification */}
          {notification && (
            <div className="fixed top-24 right-4 z-50 bg-teal-600 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce-short">
              {notification}
            </div>
          )}

          {/* Gamification: Badges Section (Competence) */}
          <div className="mb-8">
             <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-teal-600" />
                Mijlpalen & Badges
             </h3>
             <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {BADGES.map((badge) => {
                   // Simple simulated logic to determine unlocked state
                   let isUnlocked = false;
                   if (badge.conditionType === 'streak') isUnlocked = streak >= badge.threshold;
                   if (badge.conditionType === 'weight_entry') isUnlocked = weightEntries.length >= badge.threshold;
                   if (badge.conditionType === 'checkin') isUnlocked = checkInEntries.length >= badge.threshold;
                   
                   const Icon = IconMap[badge.iconName] || Award;
                   
                   return (
                     <div key={badge.id} className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all ${isUnlocked ? 'bg-white dark:bg-slate-900 border-teal-200 dark:border-teal-800 shadow-sm' : 'bg-white/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 opacity-60 grayscale'}`}>
                        <div className={`p-3 rounded-full mb-3 ${isUnlocked ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                           <Icon className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{badge.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{badge.description}</p>
                     </div>
                   );
                })}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase">Huidig Gewicht</span>
                <div className="bg-teal-50 dark:bg-teal-900/30 p-2 rounded-lg text-teal-600 dark:text-teal-400">
                  <Scale className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{currentWeight}</span>
                <span className="ml-1 text-slate-500 font-medium">kg</span>
              </div>
              <div className={`mt-2 text-sm flex items-center ${isLoss ? 'text-green-600 dark:text-green-400' : 'text-slate-500'}`}>
                {isLoss ? <TrendingDown className="w-4 h-4 mr-1" /> : <PlusCircle className="w-4 h-4 mr-1" />}
                <span>{Math.abs(Number(difference))} kg {isLoss ? 'afgevallen' : 'verschil'}</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
               <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase">Start Gewicht</span>
                <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg text-slate-600 dark:text-slate-400">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{currentUser.profile.startWeight}</span>
                <span className="ml-1 text-slate-500 font-medium">kg</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">Start van uw traject</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase">Doel</span>
                <div className="bg-amber-50 dark:bg-amber-900/30 p-2 rounded-lg text-amber-600 dark:text-amber-400">
                  <Target className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{currentUser.profile.goalWeight}</span>
                <span className="ml-1 text-slate-500 font-medium">kg</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">
                 Nog {(currentWeight - currentUser.profile.goalWeight).toFixed(1)} kg te gaan
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Chart & History & Challenges */}
            <div className="lg:col-span-2 space-y-8">
              <WeightChart 
                data={weightEntries} 
                startWeight={currentUser.profile.startWeight}
                goalWeight={currentUser.profile.goalWeight}
              />

              {/* Gamification: Challenges (Social & Autonomy) */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-amber-500" />
                    Samen Gezond (Challenges)
                </h3>
                <div className="grid gap-4">
                    {CHALLENGES.map(challenge => {
                        const isActive = currentUser.profile.activeChallengeId === challenge.id;
                        const isOtherActive = !!currentUser.profile.activeChallengeId && !isActive;

                        return (
                          <div key={challenge.id} className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-center group transition-all duration-300 ${isActive ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800 shadow-md transform scale-[1.02]' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-teal-500/30'}`}>
                              <div className="mb-4 sm:mb-0">
                                  <div className="flex items-center mb-1">
                                      <span className="text-xs font-bold text-teal-600 bg-white dark:bg-teal-900/50 px-2 py-0.5 rounded mr-2 border border-teal-100 dark:border-teal-800">{challenge.category}</span>
                                      <h4 className="font-bold text-slate-900 dark:text-white">{challenge.title}</h4>
                                      {isActive && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">Actief</span>}
                                  </div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{challenge.description}</p>
                                  <div className="flex items-center text-xs text-slate-400">
                                      <Users className="w-3 h-3 mr-1" />
                                      {challenge.participants} deelnemers • {challenge.duration}
                                  </div>
                              </div>
                              <div className="flex space-x-2">
                                {isActive ? (
                                   <Button size="sm" variant="secondary" onClick={handleLeaveChallenge} className="bg-red-100 text-red-600 hover:bg-red-200 shadow-none">
                                     Stoppen
                                   </Button>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    variant={isOtherActive ? "ghost" : "outline"} 
                                    onClick={() => handleJoinChallenge(challenge)}
                                    className={isOtherActive ? "text-slate-400" : ""}
                                  >
                                    {isOtherActive ? "Wissel" : "Doe mee"}
                                  </Button>
                                )}
                              </div>
                          </div>
                        );
                    })}
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Metingen Geschiedenis</h4>
                 <div className="space-y-3 max-h-64 overflow-y-auto">
                    {weightEntries.length === 0 && <p className="text-slate-500 text-sm">Nog geen metingen.</p>}
                    {weightEntries
                      .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((entry) => (
                      <div key={entry.id} className="flex justify-between items-center text-sm group p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0">
                        <span className="text-slate-500 dark:text-slate-400">{new Date(entry.date).toLocaleDateString('nl-NL')}</span>
                        <div className="flex items-center">
                          <span className="font-medium text-slate-900 dark:text-slate-200 mr-4">{entry.weight} kg</span>
                          <button 
                            onClick={() => handleDeleteWeight(entry.id)}
                            className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Verwijder meting"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
              </div>
            </div>

            {/* Right Column: Combined Action Card */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-teal-100 dark:border-teal-900 overflow-hidden sticky top-24">
                <div className="bg-teal-600 p-4 text-white">
                  <h3 className="text-lg font-bold flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Dagelijkse Update
                  </h3>
                  <p className="text-teal-100 text-sm">Vul uw meting en reflectie samen in.</p>
                </div>

                <div className="p-6">
                  <form onSubmit={handleCombinedSubmit}>
                    {/* Section 1: Weight */}
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-slate-800 dark:text-white mb-2">
                        1. Gewicht (optioneel)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          className="block w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border p-3 pl-4 focus:border-teal-500 focus:ring-teal-500"
                          placeholder="Bijv. 85.5"
                          value={combinedWeight}
                          onChange={(e) => setCombinedWeight(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-slate-400 sm:text-sm">kg</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        * Wij geven een waarschuwing bij te snel gewichtsverlies.
                      </p>
                    </div>

                    <div className="h-px bg-slate-200 dark:bg-slate-700 my-6"></div>

                    {/* Section 2: Reflection */}
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-slate-800 dark:text-white mb-4">
                        2. Hoe voelt u zich vandaag?
                      </label>
                      <div className="space-y-6">
                        {CHECKIN_QUESTIONS.map(q => (
                          <div key={q.id}>
                            <div className="flex justify-between mb-1">
                              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">{q.label}</label>
                              <span className="text-xs font-bold text-teal-600 dark:text-teal-400">{checkInValues[q.id]}</span>
                            </div>
                            <input 
                              type="range" 
                              min="1" 
                              max="10" 
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
                    </div>

                    <Button type="submit" className="w-full justify-center text-lg py-3 shadow-md hover:shadow-lg transition-all">
                      Opslaan & Voltooien
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SettingsView = () => {
    if (!currentUser) return null;
    return (
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-12 animate-fade-in transition-colors duration-300">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Instellingen</h2>
          
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 mb-6">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
              <UserIcon className="w-5 h-5 mr-2 text-teal-600" />
              Profiel
            </h3>
            <p className="text-sm text-slate-500 mb-4">Ingelogd als: {currentUser.email}</p>
            <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gebruikersnaam (Pseudoniem)</label>
                 <input 
                    type="text" 
                    value={currentUser.profile.name}
                    onChange={(e) => handleUpdateProfile({ name: e.target.value })}
                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 border"
                 />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Gewicht (kg)</label>
                   <input 
                      type="number" 
                      value={currentUser.profile.startWeight}
                      onChange={(e) => handleUpdateProfile({ startWeight: parseFloat(e.target.value) })}
                      className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 border"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Doel Gewicht (kg)</label>
                   <input 
                      type="number" 
                      value={currentUser.profile.goalWeight}
                      onChange={(e) => handleUpdateProfile({ goalWeight: parseFloat(e.target.value) })}
                      className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 border"
                   />
                 </div>
               </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 mb-6">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
              {currentUser.profile.themePreference === 'dark' ? <Moon className="w-5 h-5 mr-2 text-teal-600" /> : <Sun className="w-5 h-5 mr-2 text-teal-600" />}
              Weergave
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Dark Mode</p>
                <p className="text-sm text-slate-500">Pas het uiterlijk aan voor minder vermoeide ogen.</p>
              </div>
              <button 
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${currentUser.profile.themePreference === 'dark' ? 'bg-teal-600' : 'bg-slate-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${currentUser.profile.themePreference === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
             <h3 className="text-xl font-semibold text-red-600 mb-4 flex items-center">
              <Trash2 className="w-5 h-5 mr-2" />
              Gegevensbeheer
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
              Als u uw volledige geschiedenis wilt wissen, kunt u dat hier doen. Dit kan niet ongedaan worden gemaakt.
            </p>
            <button 
              onClick={handleDeleteAccount}
              className="text-red-600 hover:text-red-700 font-medium text-sm border border-red-200 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
            >
              Verwijder mijn data
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Footer = () => (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Heart className="h-6 w-6 text-teal-500 fill-teal-500" />
              <span className="ml-2 text-lg font-bold text-white">ProstaVita</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Ondersteuning voor mannen met prostaatkanker. Wij geloven in de kracht van leefstijl, kennis en positiviteit tijdens uw herstelproces.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Snelle Links</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigateTo('knowledge')} className="hover:text-teal-400 transition-colors">Artikelen</button></li>
              <li><button onClick={() => navigateTo(currentUser ? 'dashboard' : 'login')} className="hover:text-teal-400 transition-colors">Gewichtstracker</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Disclaimer</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Deze website biedt geen medisch advies. Raadpleeg altijd uw behandelend arts voor medische vragen. Dit platform is bedoeld als ondersteuning van uw leefstijl.
            </p>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} ProstaVita. Alle rechten voorbehouden.
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
           {activeAnimation === 'Beweging' && <SneakerAnimation />}
           {activeAnimation === 'Mentaal' && <ZenAnimation />}
        </div>
      )}

      <Navbar />
      <main className="flex-grow">
        {currentView === 'home' && <HomeView />}
        {currentView === 'login' && <LoginView onLogin={handleLogin} onNavigateRegister={() => navigateTo('register')} />}
        {currentView === 'register' && <RegisterView onRegister={handleRegister} onNavigateLogin={() => navigateTo('login')} />}
        {currentView === 'knowledge' && <KnowledgeHubView />}
        {currentView === 'article-detail' && <ArticleDetailView />}
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'settings' && <SettingsView />}
        {currentView === 'food-analysis' && <FoodAnalysisView />}
      </main>

      {/* Floating Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {isChatOpen && (
           <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl mb-4 w-80 sm:w-96 h-[500px] flex flex-col border border-slate-200 dark:border-slate-800 animate-fade-in overflow-hidden">
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
             <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
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
                     <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-bl-none px-4 py-3 border border-slate-100 dark:border-slate-700">
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
             <form onSubmit={handleChatSubmit} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
               <div className="flex items-center space-x-2">
                 <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Stel een vraag..."
                    className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
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

      <Footer />
    </div>
  );
}
