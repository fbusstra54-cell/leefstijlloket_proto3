
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
  Share2,
  Eye,
  EyeOff,
  Info,
  History,
  Edit2,
  Save,
  Star,
  Footprints,
  BarChart2,
  Home as HomeIcon,
  ChevronUp,
  HandMetal
} from 'lucide-react';
import { GoogleGenAI, Chat } from "@google/genai";
import { Button } from './components/Button';
import { ArticleCard } from './components/ArticleCard';
import { WeightChart } from './components/WeightChart';
import { CheckInChart } from './components/CheckInChart';
import { StepsChart } from './components/StepsChart';
import { MealLogbook } from './components/MealLogbook';
import { StepGuideModal } from './components/StepGuideModal';
import { Toast } from './components/Toast';
import { Article, UserProfile, WeightEntry, DailyCheckIn, User, FAQItem, Badge, Challenge, CommunityPost, ReactionType, MealEntry, CarePathId } from './types';
import { ARTICLES, FAQ_ITEMS, CHECKIN_QUESTIONS, BADGES, CHALLENGES, CARE_PATHS, MOCK_COMMUNITY_POSTS, POINTS, LEVELS } from './constants';
import { db } from './services/DatabaseService';

// ---- Views Enum ----
type View = 'home' | 'login' | 'register' | 'knowledge' | 'dashboard' | 'article-detail' | 'settings' | 'food-analysis' | 'forgot-password' | 'reset-password' | 'community' | 'meal-logbook';

// ---- Icon Mapping for Badges ----
const IconMap: Record<string, React.ElementType> = {
  Flag, Flame, Trophy, Brain, Droplets, Activity
};

// ---- Extracted Components ----

const HomeView = ({ onNavigateLogin, onNavigateRegister }: { onNavigateLogin: () => void, onNavigateRegister: () => void }) => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950 animate-fade-in transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative bg-teal-700 overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Actief koppel aan het sporten"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 to-teal-800/50" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 drop-shadow-sm">
            Fit, door dik en dun
          </h1>
          <p className="mt-4 text-xl text-teal-100 max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
            Samen sterk tegen prostaatkanker. Uw persoonlijke coach voor voeding, beweging en mentale balans tijdens en na de behandeling.
          </p>
          <div className="mt-10 flex gap-4 justify-center">
             <Button size="lg" onClick={onNavigateRegister} className="bg-white text-teal-700 hover:bg-teal-50 border-none shadow-lg font-bold">
               Start Vandaag
             </Button>
             <Button variant="outline" size="lg" onClick={onNavigateLogin} className="border-teal-100 text-teal-100 hover:bg-teal-800/50 hover:text-white">
               Inloggen
             </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-20">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
                <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-green-600">
                   <Utensils className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">Voeding op Maat</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Scan uw maaltijden en krijg direct inzicht in calorieën en voedingswaarden specifiek voor uw herstel.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
                <div className="bg-amber-100 dark:bg-amber-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-amber-600">
                   <Activity className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">Blijf in Beweging</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Houd uw stappen en gewicht bij en doe mee aan motiverende challenges om fit te blijven.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
                <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                   <Users className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">Community Steun</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Deel successen en vind steun bij lotgenoten in Het Trefpunt. U staat er niet alleen voor.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

const LoginView = ({ onLogin, onNavigateRegister, onNavigateForgot }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 bg-slate-50 dark:bg-slate-950 animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-700">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 mb-4">
            <UserIcon className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welkom Terug</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Log in om uw voortgang te bekijken.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-mailadres</label>
            <input 
              type="email" required 
              className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-teal-500 focus:border-teal-500 p-2.5 transition-colors"
              value={email} onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Wachtwoord</label>
              <button type="button" onClick={onNavigateForgot} className="text-sm text-teal-600 hover:text-teal-700">Wachtwoord vergeten?</button>
            </div>
            <input 
              type="password" required 
              className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-teal-500 focus:border-teal-500 p-2.5 transition-colors"
              value={password} onChange={e => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full justify-center py-3">Inloggen</Button>
        </form>
        <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Nog geen account? <button onClick={onNavigateRegister} className="text-teal-600 font-bold hover:underline">Registreer hier</button>
        </div>
      </div>
    </div>
  );
};

const RegisterView = ({ onRegister, onNavigateLogin }: any) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '', password: '', name: '', 
    startWeight: '', goalWeight: '', height: '', gender: 'man'
  });

  const handleChange = (k: string, v: any) => setFormData(p => ({...p, [k]: v}));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(
      formData.email, formData.password, formData.name, 
      parseFloat(formData.startWeight), parseFloat(formData.goalWeight), 
      parseInt(formData.height), formData.gender
    );
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 bg-slate-50 dark:bg-slate-950 animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-700">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Start uw Reis</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Maak een account aan in enkele stappen.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Naam (of Pseudoniem)</label>
                <input type="text" required className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white p-2.5" 
                  value={formData.name} onChange={e => handleChange('name', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-mailadres</label>
                <input type="email" required className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white p-2.5" 
                  value={formData.email} onChange={e => handleChange('email', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Wachtwoord</label>
                <input type="password" required className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white p-2.5" 
                  value={formData.password} onChange={e => handleChange('password', e.target.value)} />
              </div>
              <Button type="button" onClick={() => setStep(2)} className="w-full justify-center">Volgende</Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Huidig Gewicht (kg)</label>
                   <input type="number" step="0.1" required className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white p-2.5" 
                     value={formData.startWeight} onChange={e => handleChange('startWeight', e.target.value)} />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Doel Gewicht (kg)</label>
                   <input type="number" step="0.1" required className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white p-2.5" 
                     value={formData.goalWeight} onChange={e => handleChange('goalWeight', e.target.value)} />
                 </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Lengte (cm)</label>
                  <input type="number" required className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white p-2.5" 
                    value={formData.height} onChange={e => handleChange('height', e.target.value)} />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Geslacht</label>
                  <select className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white p-2.5"
                    value={formData.gender} onChange={e => handleChange('gender', e.target.value)}>
                    <option value="man">Man</option>
                    <option value="vrouw">Vrouw</option>
                    <option value="anders">Anders</option>
                  </select>
               </div>
               <div className="flex gap-3">
                 <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">Terug</Button>
                 <Button type="submit" className="flex-1">Registreren</Button>
               </div>
            </div>
          )}
        </form>
        <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Al een account? <button onClick={onNavigateLogin} className="text-teal-600 font-bold hover:underline">Log hier in</button>
        </div>
      </div>
    </div>
  );
};

const ForgotPasswordView = ({ onBack, onSubmit }: any) => {
  const [email, setEmail] = useState('');
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 bg-slate-50 dark:bg-slate-950 animate-fade-in">
       <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-700">
         <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 text-center">Wachtwoord Herstellen</h2>
         <p className="text-slate-600 dark:text-slate-400 text-center mb-6">Vul uw e-mailadres in om een reset-link te ontvangen.</p>
         <form onSubmit={(e) => { e.preventDefault(); onSubmit(email); }} className="space-y-4">
            <input type="email" required placeholder="uw@email.nl"
               className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white p-2.5"
               value={email} onChange={e => setEmail(e.target.value)} />
            <Button type="submit" className="w-full justify-center">Verstuur Link</Button>
            <Button type="button" variant="ghost" onClick={onBack} className="w-full justify-center">Terug naar Inloggen</Button>
         </form>
       </div>
    </div>
  );
};

const ResetPasswordView = ({ onReset }: any) => {
    // Simplified simulation
    return (
       <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 bg-slate-50 dark:bg-slate-950">
           <div className="text-center">
               <h2 className="text-xl font-bold mb-4 dark:text-white">Wachtwoord Reset</h2>
               <p className="dark:text-slate-300">Link verstuurd (simulatie). Ga terug naar login.</p>
               <Button onClick={onReset} className="mt-4">Naar Login</Button>
           </div>
       </div>
    )
}

const KnowledgeHubView = ({ onArticleClick }: any) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Alle');
  const categories = ['Alle', 'Voeding', 'Beweging', 'Mentaal', 'Medisch'];

  const filteredArticles = ARTICLES.filter(a => {
      const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = activeCategory === 'Alle' || a.category === activeCategory;
      return matchesSearch && matchesCat;
  });

  return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
          <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Kenniscentrum</h1>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  Betrouwbare informatie over leefstijl, voeding en bewegen tijdens en na uw behandeling.
              </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                      type="text" 
                      placeholder="Zoek artikelen..." 
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                  />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                  {categories.map(cat => (
                      <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                              activeCategory === cat 
                              ? 'bg-teal-600 text-white' 
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-teal-500'
                          }`}
                      >
                          {cat}
                      </button>
                  ))}
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredArticles.map(article => (
                  <ArticleCard key={article.id} article={article} onClick={onArticleClick} />
              ))}
          </div>

          {/* FAQ Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                  <HelpCircle className="w-6 h-6 mr-2 text-teal-600" />
                  Veelgestelde Vragen
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {FAQ_ITEMS.slice(0, 4).map(faq => (
                      <div key={faq.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">{faq.question}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{faq.answer}</p>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );
};

const ArticleDetailView = ({ article, onBack }: any) => {
    if (!article) return null;
    return (
        <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
            <button onClick={onBack} className="flex items-center text-slate-500 hover:text-teal-600 mb-6 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-1" /> Terug naar overzicht
            </button>
            <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <img src={article.imageUrl} alt={article.title} className="w-full h-64 md:h-96 object-cover" />
                <div className="p-8 md:p-12">
                    <div className="flex items-center gap-4 mb-6 text-sm text-slate-500 dark:text-slate-400">
                        <span className="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 px-3 py-1 rounded-full font-bold uppercase text-xs">
                            {article.category}
                        </span>
                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-1"/> {article.date}</span>
                        <span className="flex items-center"><UserIcon className="w-4 h-4 mr-1"/> {article.author}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                        {article.title}
                    </h1>
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <p className="text-xl font-medium text-slate-600 dark:text-slate-300 mb-8">{article.excerpt}</p>
                        {article.content.split('\n').map((paragraph: string, idx: number) => (
                            <p key={idx} className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>
            </article>
        </div>
    );
};

const CommunityView = ({ posts, onReact }: any) => {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Het Trefpunt</h2>
                <p className="text-slate-600 dark:text-slate-400">Deel uw successen en motiveer elkaar.</p>
            </div>
            <div className="space-y-6">
                {posts.map((post: any) => (
                    <div key={post.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold mr-3 shadow-sm">
                                    {post.userPseudonym.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">{post.userPseudonym}</h4>
                                    <p className="text-xs text-slate-500">{new Date(post.timestamp).toLocaleString('nl-NL')}</p>
                                </div>
                            </div>
                            {post.actionType === 'streak_milestone' && <Flame className="w-5 h-5 text-orange-500" />}
                            {post.actionType === 'badge_earned' && <Award className="w-5 h-5 text-amber-500" />}
                            {post.actionType === 'challenge_join' && <Flag className="w-5 h-5 text-teal-500" />}
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 mb-4 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                            {post.content}
                        </p>
                        <div className="flex gap-4 border-t border-slate-100 dark:border-slate-700 pt-3">
                            <button 
                                onClick={() => onReact(post.id, 'heart')}
                                className={`flex items-center text-sm transition-all transform active:scale-125 duration-200 ${post.currentUserReacted?.includes('heart') ? 'text-red-500 font-bold' : 'text-slate-500 hover:text-red-500'}`}
                            >
                                <Heart className={`w-4 h-4 mr-1 ${post.currentUserReacted?.includes('heart') ? 'fill-current' : ''}`} /> 
                                {post.reactions.heart}
                            </button>
                             <button 
                                onClick={() => onReact(post.id, 'clap')}
                                className={`flex items-center text-sm transition-all transform active:scale-125 duration-200 ${post.currentUserReacted?.includes('clap') ? 'text-blue-500 font-bold' : 'text-slate-500 hover:text-blue-500'}`}
                             >
                                <ThumbsUp className="w-4 h-4 mr-1" /> {post.reactions.clap}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DashboardView = ({ user, weightData, checkInData, onLogWeight, onCheckIn, onNavigateMealLog, onNavigateFoodAnalysis, onNavigateTrends }: any) => {
  const [activeTab, setActiveTab] = useState<'today' | 'trends' | 'achievements'>('today');
  
  // Check-in State
  const [checkInValues, setCheckInValues] = useState<any>({});
  const [checkInSteps, setCheckInSteps] = useState('');
  const [checkInWeight, setCheckInWeight] = useState('');
  const [isStepModalOpen, setIsStepModalOpen] = useState(false);
  const [isCheckInSubmitted, setIsCheckInSubmitted] = useState(false);

  // VitaBot logic
  const getLast4DaysAvg = () => {
    if (checkInData.length === 0) return null;
    const last4 = checkInData.slice(-4);
    let sumMood = 0; let sumEnergy = 0;
    last4.forEach((c: any) => { sumMood += c.mood; sumEnergy += c.energy; });
    return { mood: sumMood / last4.length, energy: sumEnergy / last4.length };
  };
  
  const avgs = getLast4DaysAvg();
  const showVitaBot = avgs && (avgs.mood < 5.5 || avgs.energy < 5.5);

  const handleRangeChange = (id: string, val: string) => {
    setCheckInValues((prev: any) => ({...prev, [id]: parseInt(val)}));
  };

  const submitCheckIn = () => {
    if (Object.keys(checkInValues).length === 0 && !checkInSteps && !checkInWeight) return;
    
    const stepsInt = parseInt(checkInSteps);
    const weightFloat = parseFloat(checkInWeight.replace(',', '.'));

    const fullCheckIn = {
        energy: checkInValues.energy || 5,
        strength: checkInValues.strength || 5,
        hunger: checkInValues.hunger || 5,
        mood: checkInValues.mood || 5,
        stress: checkInValues.stress || 5,
        sleep: checkInValues.sleep || 5,
        steps: isNaN(stepsInt) ? 0 : stepsInt
    };

    onCheckIn(fullCheckIn);
    if (!isNaN(weightFloat) && weightFloat > 0) {
      onLogWeight(weightFloat);
    }
    setIsCheckInSubmitted(true);
  };

  const handleMiniChartClick = () => {
      setActiveTab('trends');
  };

  return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in space-y-8">
          <StepGuideModal isOpen={isStepModalOpen} onClose={() => setIsStepModalOpen(false)} />

          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                    Hallo, {user.profile.name}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">Vandaag is een nieuwe kans om te werken aan uw gezondheid.</p>
              </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-6 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
             {['today', 'trends', 'achievements'].map(tab => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab as any)}
                   className={`pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === tab ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                 >
                     {tab === 'today' && 'Vandaag'}
                     {tab === 'trends' && 'Trends & Inzichten'}
                     {tab === 'achievements' && 'Prestaties & Challenges'}
                 </button>
             ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'today' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column (Daily Check-in) */}
                  <div className="lg:col-span-2 space-y-8">
                      {/* Daily Check-in Card */}
                      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6 flex items-center">
                              <Activity className="w-5 h-5 mr-2 text-teal-600" />
                              Dagelijkse Check-in
                          </h3>
                          
                          {isCheckInSubmitted ? (
                              <div className="text-center py-10 animate-fade-in">
                                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                      <Check className="w-8 h-8" />
                                  </div>
                                  <h4 className="font-bold text-slate-900 dark:text-white">Ingevuld!</h4>
                                  <p className="text-slate-500 dark:text-slate-400">Goed bezig! Uw data is opgeslagen.</p>
                              </div>
                          ) : (
                            <div className="space-y-6">
                                {CHECKIN_QUESTIONS.map(q => (
                                    <div key={q.id}>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{q.label}</label>
                                            <span className="text-sm font-bold text-teal-600">{checkInValues[q.id] || 5}</span>
                                        </div>
                                        <input 
                                            type="range" min="1" max="10" step="1"
                                            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
                                            value={checkInValues[q.id] || 5}
                                            onChange={(e) => handleRangeChange(q.id, e.target.value)}
                                        />
                                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                                            <span>{q.minLabel}</span>
                                            <span>{q.maxLabel}</span>
                                        </div>
                                    </div>
                                ))}

                                {/* Extra Inputs: Steps & Weight */}
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                                            <Footprints className="w-4 h-4 mr-2 text-orange-500" />
                                            Stappen
                                        </label>
                                        <div className="flex">
                                            <input 
                                                type="number"
                                                placeholder="0"
                                                className="w-full rounded-l-lg border-y border-l border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-teal-500 focus:border-teal-500 transition-colors p-2 text-sm"
                                                value={checkInSteps}
                                                onChange={(e) => setCheckInSteps(e.target.value)}
                                            />
                                            <button onClick={() => setIsStepModalOpen(true)} className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 px-3 rounded-r-lg hover:bg-slate-200 dark:hover:bg-slate-600">
                                                <HelpCircle className="w-4 h-4 text-slate-500" />
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                                            <Scale className="w-4 h-4 mr-2 text-blue-500" />
                                            Gewicht (kg)
                                        </label>
                                        <input 
                                            type="number"
                                            step="0.1"
                                            placeholder="0.0"
                                            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-teal-500 focus:border-teal-500 transition-colors p-2 text-sm"
                                            value={checkInWeight}
                                            onChange={(e) => setCheckInWeight(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <Button onClick={submitCheckIn} className="w-full justify-center mt-4">Opslaan</Button>
                            </div>
                          )}
                      </div>
                  </div>

                  {/* Right Column (Mini Chart & Tools) */}
                  <div className="lg:col-span-1 space-y-6">
                      {/* Mini Weight Chart */}
                      <div 
                        onClick={handleMiniChartClick}
                        className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer hover:shadow-md transition-all group"
                      >
                          <div className="flex justify-between items-center mb-2">
                              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Gewicht Trend</h3>
                              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                          </div>
                          <WeightChart 
                            data={weightData} 
                            startWeight={user.profile.startWeight} 
                            goalWeight={user.profile.goalWeight} 
                            isDark={user.profile.themePreference === 'dark'} 
                            minimal={true}
                          />
                      </div>

                      {/* Quick Tools */}
                      <div onClick={onNavigateMealLog} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer hover:shadow-md transition-all flex items-center group">
                          <div className="bg-orange-100 dark:bg-orange-900/30 p-4 rounded-full mr-4 text-orange-600 group-hover:scale-110 transition-transform">
                              <Utensils className="w-6 h-6" />
                          </div>
                          <div>
                              <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">Maaltijd Logboek</h3>
                              <p className="text-sm text-slate-500">Houd uw voeding bij</p>
                          </div>
                          <ChevronRight className="ml-auto w-5 h-5 text-slate-400 group-hover:text-teal-600" />
                      </div>
                      
                      <div onClick={onNavigateFoodAnalysis} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer hover:shadow-md transition-all flex items-center group">
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mr-4 text-blue-600 group-hover:scale-110 transition-transform">
                              <ScanBarcode className="w-6 h-6" />
                          </div>
                          <div>
                              <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">AI Voedingsscanner</h3>
                              <p className="text-sm text-slate-500">Analyseer met foto's</p>
                          </div>
                          <ChevronRight className="ml-auto w-5 h-5 text-slate-400 group-hover:text-teal-600" />
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'trends' && (
              <div className="space-y-8 animate-fade-in">
                  {/* Charts */}
                  <StepsChart data={checkInData} isDark={user.profile.themePreference === 'dark'} />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <WeightChart data={weightData} startWeight={user.profile.startWeight} goalWeight={user.profile.goalWeight} isDark={user.profile.themePreference === 'dark'} />
                      <CheckInChart data={checkInData} isDark={user.profile.themePreference === 'dark'} />
                  </div>
              </div>
          )}

          {activeTab === 'achievements' && (
              <div className="space-y-8 animate-fade-in">
                  {/* Active Challenges */}
                  <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                          <Flag className="w-6 h-6 mr-2 text-teal-600" />
                          Actieve Challenges
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {CHALLENGES.map(challenge => {
                              const isActive = user.profile.activeChallengeId === challenge.id;
                              return (
                                  <div key={challenge.id} className={`rounded-xl p-6 border transition-all ${isActive ? 'bg-teal-50 border-teal-200 dark:bg-teal-900/20 dark:border-teal-800 ring-1 ring-teal-500/20' : 'bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700 opacity-80 hover:opacity-100'}`}>
                                      <div className="flex justify-between items-start mb-2">
                                          <h4 className="font-bold text-slate-900 dark:text-white">{challenge.title}</h4>
                                          <span className="text-xs px-2 py-1 bg-white dark:bg-slate-700 rounded-full border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300">
                                              {challenge.duration}
                                          </span>
                                      </div>
                                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{challenge.description}</p>
                                      
                                      {isActive ? (
                                          <div className="space-y-2">
                                              <div className="flex justify-between text-xs font-medium text-teal-700 dark:text-teal-300">
                                                  <span>Voortgang</span>
                                                  <span>4 / 7 dagen</span>
                                              </div>
                                              <div className="h-2 w-full bg-teal-200 dark:bg-teal-800 rounded-full overflow-hidden">
                                                  <div className="h-full bg-teal-600 w-[60%] rounded-full"></div>
                                              </div>
                                              <p className="text-xs text-teal-600 dark:text-teal-400 mt-2 italic">Nog 3 dagen te gaan! U bent goed bezig.</p>
                                          </div>
                                      ) : (
                                          <Button variant="outline" size="sm" className="w-full">Start Challenge</Button>
                                      )}
                                  </div>
                              )
                          })}
                      </div>
                  </div>

                  {/* Badges */}
                  <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                          <Award className="w-6 h-6 mr-2 text-amber-500" />
                          Mijn Badges
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {BADGES.map((badge, idx) => {
                              // Check if badge is earned
                              const isEarned = user.profile.earnedBadges?.includes(badge.id);
                              const Icon = IconMap[badge.iconName] || Star;
                              
                              return (
                                  <div key={badge.id} className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all ${isEarned ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 scale-105 shadow-sm' : 'bg-slate-50 border-slate-100 dark:bg-slate-900 dark:border-slate-800 grayscale opacity-60'}`}>
                                      <div className={`p-3 rounded-full mb-3 ${isEarned ? 'bg-amber-100 text-amber-600 dark:bg-amber-800 dark:text-amber-200' : 'bg-slate-200 text-slate-400 dark:bg-slate-800'}`}>
                                          <Icon className="w-8 h-8" />
                                      </div>
                                      <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{badge.title}</h4>
                                      <p className="text-xs text-slate-500 dark:text-slate-400">{badge.description}</p>
                                  </div>
                              );
                          })}
                      </div>
                  </div>
              </div>
          )}
      </div>
  );
};

const FoodAnalysisView = ({ onSaveToLog }: { onSaveToLog: (data: any) => void }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<{name: string, calories: number, description: string} | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      // @ts-ignore
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1] || 'image/jpeg';
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                {
                    inlineData: {
                        mimeType: mimeType,
                        data: base64Data
                    }
                },
                {
                    text: "Identify this meal. Return a JSON object with keys: name (string), calories (number), and description (string). Output JSON only."
                }
            ]
        },
        config: {
            responseMimeType: 'application/json'
        }
      });

      const text = response.text;
      if (text) {
          setAnalysis(JSON.parse(text));
      }
    } catch (err) {
      console.error(err);
      alert('Analyse mislukt.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 animate-fade-in">
       <div className="text-center mb-8">
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">AI Voedingsscanner</h2>
           <p className="text-slate-600 dark:text-slate-400">Maak een foto van uw maaltijd voor directe inzichten.</p>
       </div>

       <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
           {image ? (
               <div className="relative">
                   <img src={image} alt="Preview" className="w-full h-64 object-cover" />
                   <button onClick={() => { setImage(null); setAnalysis(null); }} className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors">
                       <X className="w-5 h-5" />
                   </button>
               </div>
           ) : (
               <div className="h-64 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                   <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                   <div className="flex gap-4">
                       <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center w-32 h-32 bg-white dark:bg-slate-800 rounded-xl shadow-sm border-2 border-dashed border-slate-200 dark:border-slate-600 hover:border-teal-500 hover:text-teal-600 transition-all group">
                            <Upload className="w-8 h-8 mb-2 text-slate-400 group-hover:text-teal-600" />
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Uploaden</span>
                       </button>
                        <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center w-32 h-32 bg-white dark:bg-slate-800 rounded-xl shadow-sm border-2 border-dashed border-slate-200 dark:border-slate-600 hover:border-teal-500 hover:text-teal-600 transition-all group">
                            <Camera className="w-8 h-8 mb-2 text-slate-400 group-hover:text-teal-600" />
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Camera</span>
                       </button>
                   </div>
               </div>
           )}

           <div className="p-6">
               {!analysis && (
                   <Button disabled={!image || loading} onClick={handleAnalyze} className="w-full justify-center">
                       {loading ? 'Analyseren...' : 'Start Analyse'}
                   </Button>
               )}

               {analysis && (
                   <div className="animate-fade-in space-y-4">
                       <div className="flex justify-between items-start">
                           <h3 className="text-xl font-bold text-slate-900 dark:text-white">{analysis.name}</h3>
                           <span className="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-full text-sm font-bold">
                               {analysis.calories} kcal
                           </span>
                       </div>
                       <p className="text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                           {analysis.description}
                       </p>
                       <div className="flex gap-3 pt-2">
                           <Button variant="outline" onClick={() => { setImage(null); setAnalysis(null); }} className="flex-1">Nieuwe Scan</Button>
                           <Button onClick={() => onSaveToLog(analysis)} className="flex-1">Opslaan</Button>
                       </div>
                   </div>
               )}
           </div>
       </div>
    </div>
  );
};

const SettingsView = ({ user, onLogout, onUpdateProfile }: { user: User, onLogout: () => void, onUpdateProfile: (id: string, p: UserProfile) => void }) => {
    const [theme, setTheme] = useState(user.profile.themePreference || 'light');
    
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        if (newTheme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        onUpdateProfile(user.id, { ...user.profile, themePreference: newTheme });
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Instellingen</h2>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden mb-6">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <h3 className="font-bold text-slate-900 dark:text-white">Account</h3>
                </div>
                <div className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-300">Naam</span>
                        <span className="font-medium text-slate-900 dark:text-white">{user.profile.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-300">Email</span>
                        <span className="font-medium text-slate-900 dark:text-white">{user.email}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-300">Level</span>
                        <span className="font-medium text-teal-600">{user.profile.level}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden mb-6">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <h3 className="font-bold text-slate-900 dark:text-white">Voorkeuren</h3>
                </div>
                <div className="p-4">
                    <div className="flex justify-between items-center">
                         <div className="flex items-center">
                             {theme === 'dark' ? <Moon className="w-5 h-5 mr-3 text-slate-400"/> : <Sun className="w-5 h-5 mr-3 text-amber-500"/>}
                             <span className="text-slate-700 dark:text-slate-300">Donkere Modus</span>
                         </div>
                         <button 
                            onClick={toggleTheme}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-teal-600' : 'bg-slate-200'}`}
                         >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                         </button>
                    </div>
                </div>
            </div>

            <Button variant="outline" onClick={onLogout} className="w-full justify-center text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 dark:border-red-900/30 dark:hover:bg-red-900/20">
                <LogOut className="w-4 h-4 mr-2" /> Uitloggen
            </Button>
            
            <p className="text-center text-xs text-slate-400 mt-8">Versie 1.0.0 • ProstaVita</p>
        </div>
    );
};

// Main App Component
export default function App() {
  const [view, setView] = useState<View>('home');
  const [user, setUser] = useState<User | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [weightData, setWeightData] = useState<WeightEntry[]>([]);
  const [checkInData, setCheckInData] = useState<DailyCheckIn[]>([]);
  const [mealData, setMealData] = useState<MealEntry[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS);
  
  // Notification State
  const [notification, setNotification] = useState<{ message: string; points: number; visible: boolean }>({
    message: '', points: 0, visible: false
  });

  // Load session
  useEffect(() => {
     const session = db.getCurrentSession();
     if (session) {
        setUser(session);
        loadUserData(session.id);
        if (session.profile.themePreference === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        setView('dashboard');
     }
  }, []);

  const loadUserData = (userId: string) => {
      setWeightData(db.getWeightEntries(userId));
      setCheckInData(db.getCheckIns(userId));
      setMealData(db.getMealEntries(userId));
  };

  const showPointsNotification = (points: number, message: string) => {
      setNotification({ message, points, visible: true });
  };

  const checkBadges = async (currentUser: User, type: 'weight' | 'checkin' | 'streak') => {
      let newBadges: string[] = [];
      const currentBadges = currentUser.profile.earnedBadges || [];

      BADGES.forEach(badge => {
          if (currentBadges.includes(badge.id)) return; // Already earned

          let earned = false;
          if (badge.conditionType === 'weight_entry' && type === 'weight') {
              if (weightData.length + 1 >= badge.threshold) earned = true;
          }
          if (badge.conditionType === 'checkin' && type === 'checkin') {
              if (checkInData.length + 1 >= badge.threshold) earned = true;
          }
          // Simple streak check (mock logic for demo)
          if (badge.conditionType === 'streak' && type === 'streak') {
              // Real implementation would calculate consecutive dates
              if (checkInData.length + 1 >= badge.threshold) earned = true; 
          }

          if (earned) {
              newBadges.push(badge.id);
              showPointsNotification(100, `Badge verdiend: ${badge.title}`);
          }
      });

      if (newBadges.length > 0) {
          const updatedProfile = { 
              ...currentUser.profile, 
              earnedBadges: [...currentBadges, ...newBadges],
              points: currentUser.profile.points + (newBadges.length * 100)
          };
          const updatedUser = await db.updateUserProfile(currentUser.id, updatedProfile);
          setUser(updatedUser);
      }
  };

  const addPoints = async (amount: number, reason: string) => {
      if (!user) return;
      const newPoints = user.profile.points + amount;
      
      // Check Level Up
      let newLevel = user.profile.level;
      for (const level of LEVELS) {
          if (newPoints >= level.minPoints && newPoints < level.maxPoints) {
              if (newLevel !== level.name) {
                  showPointsNotification(0, `Nieuw Niveau: ${level.name}!`);
                  newLevel = level.name;
              }
              break;
          }
      }

      const updatedUser = await db.updateUserProfile(user.id, { points: newPoints, level: newLevel });
      setUser(updatedUser);
      showPointsNotification(amount, reason);
  };

  const handleLogin = async (e: string, p: string) => {
      try {
          const u = await db.loginUser(e, p);
          setUser(u);
          loadUserData(u.id);
          setView('dashboard');
      } catch (err: any) {
          alert(err.message);
      }
  };

  const handleRegister = async (e: string, p: string, n: string, s: number, g: number, h: number, gen: 'man'|'vrouw'|'anders') => {
      try {
          const u = await db.registerUser(e, p, {
              name: n, startWeight: s, goalWeight: g, height: h, gender: gen, points: 0, level: 'Starter', carePathId: 'active_surveillance', earnedBadges: []
          });
          setUser(u);
          loadUserData(u.id);
          setView('dashboard');
      } catch (err: any) {
          alert(err.message);
      }
  };
  
  const handleLogout = () => {
      db.logoutUser();
      setUser(null);
      setView('home');
      document.documentElement.classList.remove('dark');
  };

  const handleCheckIn = (data: any) => {
     if(user) {
         db.addCheckIn(user.id, data);
         loadUserData(user.id);
         addPoints(POINTS.LOG_CHECKIN, 'Check-in Voltooid');
         checkBadges(user, 'checkin');
     }
  };
  
  const handleLogWeight = (weight: number) => {
      if(user) {
          db.addWeightEntry(user.id, weight);
          loadUserData(user.id);
          addPoints(POINTS.LOG_WEIGHT, 'Gewicht Geregistreerd');
          checkBadges(user, 'weight');
      }
  };

  const handleUpdateProfile = async (userId: string, profile: UserProfile) => {
      const updatedUser = await db.updateUserProfile(userId, profile);
      setUser(updatedUser);
  };

  const handleSaveMealFromScan = (mealData: any) => {
      if(user) {
          const newMeal = db.addMealEntry(user.id, {
              name: mealData.name,
              calories: mealData.calories,
              description: mealData.description
          });
          setMealData([...mealData, newMeal]);
          addPoints(POINTS.LOG_MEAL, 'Maaltijd Opgeslagen');
          setView('meal-logbook'); 
      }
  };

  const handleCommunityReaction = (postId: string, type: ReactionType) => {
      setCommunityPosts(prevPosts => prevPosts.map(post => {
          if (post.id !== postId) return post;

          const hasReacted = post.currentUserReacted?.includes(type);
          let newReactions = { ...post.reactions };
          let newUserReactions = [...(post.currentUserReacted || [])];

          if (hasReacted) {
              newReactions[type]--;
              newUserReactions = newUserReactions.filter(r => r !== type);
          } else {
              newReactions[type]++;
              newUserReactions.push(type);
              addPoints(POINTS.COMMUNITY_REACTION, 'Reactie Geplaatst');
          }

          return {
              ...post,
              reactions: newReactions,
              currentUserReacted: newUserReactions
          };
      }));
  };

  return (
      <div className={user?.profile.themePreference === 'dark' ? 'dark' : ''}>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 flex flex-col">
              {/* Toast Notification */}
              <Toast 
                message={notification.message} 
                points={notification.points} 
                visible={notification.visible} 
                onClose={() => setNotification(prev => ({...prev, visible: false}))} 
              />

              {/* Header/Navigation */}
              <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
                  <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                      <div className="flex items-center cursor-pointer" onClick={() => setView(user ? 'dashboard' : 'home')}>
                          <Heart className="w-8 h-8 text-teal-600 mr-2" />
                          <span className="font-bold text-xl tracking-tight hidden sm:block">Fit, door dik en dun</span>
                          <span className="font-bold text-xl tracking-tight sm:hidden">Fit</span>
                      </div>
                      
                      {/* Desktop Nav */}
                      <nav className="flex items-center space-x-1">
                          {user ? (
                              <>
                                  <div className="hidden md:flex items-center space-x-1">
                                      <button onClick={() => setView('dashboard')} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'dashboard' ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                                          Dashboard
                                      </button>
                                      <button onClick={() => setView('food-analysis')} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'food-analysis' ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                                          Scan
                                      </button>
                                      <button onClick={() => setView('meal-logbook')} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'meal-logbook' ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                                          Logboek
                                      </button>
                                      <button onClick={() => setView('knowledge')} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'knowledge' ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                                          Kennis
                                      </button>
                                      <button onClick={() => setView('community')} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'community' ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                                          Trefpunt
                                      </button>
                                  </div>
                                  
                                  <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden md:block"></div>
                                  
                                  {/* User Points Badge */}
                                  <div className="flex items-center mr-2 bg-slate-50 dark:bg-slate-800 rounded-full px-3 py-1 border border-slate-100 dark:border-slate-700">
                                      <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mr-2 text-xs font-bold">
                                          {user.profile.name.charAt(0)}
                                      </div>
                                      <div className="flex flex-col items-start leading-none">
                                          <span className="text-[10px] uppercase font-bold text-slate-400">{user.profile.level}</span>
                                          <span className="text-xs font-bold text-teal-600 dark:text-teal-400">{user.profile.points} ptn</span>
                                      </div>
                                  </div>

                                  <button onClick={() => setView('settings')} className={`p-2 rounded-full transition-colors ${view === 'settings' ? 'bg-slate-100 dark:bg-slate-800 text-teal-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                                      <Settings className="w-5 h-5" />
                                  </button>
                              </>
                          ) : (
                              <>
                                  <button onClick={() => setView('home')} className={`text-sm font-medium px-3 py-2 hover:text-teal-600 hidden sm:block ${view === 'home' ? 'text-teal-600' : 'text-slate-600 dark:text-slate-300'}`}>Home</button>
                                  <button onClick={() => setView('knowledge')} className={`text-sm font-medium px-3 py-2 hover:text-teal-600 hidden sm:block ${view === 'knowledge' ? 'text-teal-600' : 'text-slate-600 dark:text-slate-300'}`}>Kennis</button>
                                  <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden sm:block"></div>
                                  <Button variant="outline" size="sm" onClick={() => setView('login')} className="mr-2">Inloggen</Button>
                                  <Button size="sm" onClick={() => setView('register')}>Registreren</Button>
                              </>
                          )}
                          
                          {/* Mobile Menu Button */}
                          <button className="md:hidden p-2 ml-1" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                          </button>
                      </nav>
                  </div>
              </header>

              {/* Mobile Menu Drawer */}
              {isSidebarOpen && (
                  <div className="md:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm top-16" onClick={() => setIsSidebarOpen(false)}>
                      <div className="bg-white dark:bg-slate-900 w-64 h-full shadow-xl p-4 flex flex-col space-y-4" onClick={e => e.stopPropagation()}>
                          {user ? (
                              <>
                                  <button onClick={() => { setView('dashboard'); setIsSidebarOpen(false); }} className="flex items-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                                      <Activity className="w-5 h-5 mr-3 text-teal-600" /> Dashboard
                                  </button>
                                  <button onClick={() => { setView('food-analysis'); setIsSidebarOpen(false); }} className="flex items-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                                      <ScanBarcode className="w-5 h-5 mr-3 text-teal-600" /> Voedingsscan
                                  </button>
                                  <button onClick={() => { setView('meal-logbook'); setIsSidebarOpen(false); }} className="flex items-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                                      <Utensils className="w-5 h-5 mr-3 text-teal-600" /> Logboek
                                  </button>
                                  <button onClick={() => { setView('knowledge'); setIsSidebarOpen(false); }} className="flex items-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                                      <BookOpen className="w-5 h-5 mr-3 text-teal-600" /> Kennis
                                  </button>
                                  <button onClick={() => { setView('community'); setIsSidebarOpen(false); }} className="flex items-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                                      <Users className="w-5 h-5 mr-3 text-teal-600" /> Trefpunt
                                  </button>
                                  
                                  <div className="border-t border-slate-100 dark:border-slate-800 my-2"></div>
                                  <button onClick={() => { setView('settings'); setIsSidebarOpen(false); }} className="flex items-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                                      <Settings className="w-5 h-5 mr-3 text-slate-500" /> Instellingen
                                  </button>
                                  <button onClick={() => { handleLogout(); setIsSidebarOpen(false); }} className="flex items-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-red-600">
                                      <LogOut className="w-5 h-5 mr-3" /> Uitloggen
                                  </button>
                              </>
                          ) : (
                             // ...
                             <div className="flex flex-col space-y-2">
                                 <button onClick={() => { setView('home'); setIsSidebarOpen(false); }} className="flex items-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                                      <HomeIcon className="w-5 h-5 mr-3 text-teal-600" /> Home
                                  </button>
                                 <Button onClick={() => { setView('login'); setIsSidebarOpen(false); }} variant="outline">Inloggen</Button>
                                 <Button onClick={() => { setView('register'); setIsSidebarOpen(false); }}>Registreren</Button>
                             </div>
                          )}
                      </div>
                  </div>
              )}

              {/* Main Content */}
              <main className="flex-grow">
                  {view === 'home' && <HomeView onNavigateLogin={() => setView('login')} onNavigateRegister={() => setView('register')} />}
                  {view === 'login' && <LoginView onLogin={handleLogin} onNavigateRegister={() => setView('register')} onNavigateForgot={() => setView('forgot-password')} />}
                  {view === 'register' && <RegisterView onRegister={handleRegister} onNavigateLogin={() => setView('login')} />}
                  {view === 'forgot-password' && <ForgotPasswordView onBack={() => setView('login')} onSubmit={() => alert('Mail verzonden!')} />}
                  {view === 'reset-password' && <ResetPasswordView onReset={() => setView('login')} />}
                  {view === 'knowledge' && <KnowledgeHubView onArticleClick={(a) => { setSelectedArticle(a); setView('article-detail'); }} />}
                  {view === 'article-detail' && <ArticleDetailView article={selectedArticle} onBack={() => setView('knowledge')} />}
                  {view === 'community' && <CommunityView posts={communityPosts} onReact={handleCommunityReaction} />}
                  {view === 'dashboard' && user && (
                      <DashboardView 
                        user={user} 
                        weightData={weightData} 
                        checkInData={checkInData} 
                        onLogWeight={handleLogWeight}
                        onCheckIn={handleCheckIn}
                        onNavigateMealLog={() => setView('meal-logbook')}
                        onNavigateFoodAnalysis={() => setView('food-analysis')}
                        onNavigateTrends={() => setView('dashboard')} // Actually switches tab internal to dashboard via ref or props if structured, here simplified
                      />
                  )}
                  {view === 'meal-logbook' && user && (
                      <MealLogbook 
                        entries={mealData} 
                        onAdd={(m) => { const n = db.addMealEntry(user.id, m); setMealData([...mealData, n]); }} 
                        onDelete={(id) => { db.deleteMealEntry(user.id, id); setMealData(mealData.filter(m => m.id !== id)); }} 
                      />
                  )}
                  {view === 'food-analysis' && <FoodAnalysisView onSaveToLog={handleSaveMealFromScan} />}
                  {view === 'settings' && user && <SettingsView user={user} onLogout={handleLogout} onUpdateProfile={handleUpdateProfile} />}
              </main>
          </div>
      </div>
  );
}
