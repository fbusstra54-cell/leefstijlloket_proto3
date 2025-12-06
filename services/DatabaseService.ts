
import { User, WeightEntry, DailyCheckIn, UserProfile, MealEntry } from '../types';

// Simulate a secure hashing function (in a real app, this would be server-side bcrypt/argon2)
const hashPassword = async (password: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Database keys
const DB_KEYS = {
  USERS: 'prostavita_db_users',
  DATA_WEIGHTS: 'prostavita_db_weights',
  DATA_CHECKINS: 'prostavita_db_checkins',
  DATA_MEALS: 'prostavita_db_meals',
  SESSION: 'prostavita_db_session',
  RESET_TOKENS: 'prostavita_db_reset_tokens'
};

interface ResetToken {
  email: string;
  token: string;
  expires: number;
}

class DatabaseService {
  // --- Auth & User Management ---

  async registerUser(email: string, password: string, profile: UserProfile): Promise<User> {
    const users = this.getUsers();
    
    // Check if email exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Dit e-mailadres is al in gebruik.');
    }

    const passwordHash = await hashPassword(password);
    
    // Ensure gamification and other fields are set
    const finalProfile: UserProfile = {
        ...profile,
        activeChallengeId: profile.activeChallengeId || null,
        hasSeenOnboarding: false, // Default to false for new users
        points: 0, // Start with 0 points
        level: 'Starter' // Start at level 1
    };

    const newUser: User = {
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      passwordHash,
      profile: finalProfile
    };

    users.push(newUser);
    this.saveUsers(users);
    
    // Auto login
    this.setSession(newUser);
    return newUser;
  }

  async loginUser(email: string, password: string): Promise<User> {
    const users = this.getUsers();
    const passwordHash = await hashPassword(password);
    
    const user = users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.passwordHash === passwordHash
    );

    if (!user) {
      throw new Error('Ongeldige inloggegevens.');
    }

    this.setSession(user);
    return user;
  }

  logoutUser(): void {
    localStorage.removeItem(DB_KEYS.SESSION);
  }

  getCurrentSession(): User | null {
    const sessionStr = localStorage.getItem(DB_KEYS.SESSION);
    if (!sessionStr) return null;
    return JSON.parse(sessionStr);
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<User> {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) throw new Error('Gebruiker niet gevonden');

    users[userIndex].profile = { ...users[userIndex].profile, ...updates };
    this.saveUsers(users);

    // Update session if it's the current user
    const currentSession = this.getCurrentSession();
    if (currentSession && currentSession.id === userId) {
      this.setSession(users[userIndex]);
    }

    return users[userIndex];
  }

  deleteUserFull(userId: string): void {
    // Remove user
    const users = this.getUsers().filter(u => u.id !== userId);
    this.saveUsers(users);

    // Remove data
    const allWeights = this.getAllWeights();
    delete allWeights[userId];
    localStorage.setItem(DB_KEYS.DATA_WEIGHTS, JSON.stringify(allWeights));

    const allCheckins = this.getAllCheckins();
    delete allCheckins[userId];
    localStorage.setItem(DB_KEYS.DATA_CHECKINS, JSON.stringify(allCheckins));

    const allMeals = this.getAllMeals();
    delete allMeals[userId];
    localStorage.setItem(DB_KEYS.DATA_MEALS, JSON.stringify(allMeals));

    // Clear session if it was this user
    const session = this.getCurrentSession();
    if (session && session.id === userId) {
      this.logoutUser();
    }
  }

  // --- Password Reset Flow ---

  async createPasswordResetToken(email: string): Promise<string> {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    // Security: Do not reveal if email exists or not via error
    if (!user) {
      throw new Error('Als dit account bestaat, is er een email verzonden.');
    }

    const token = crypto.randomUUID();
    const tokens = this.getResetTokens();
    
    // Remove old tokens for this email
    const cleanTokens = tokens.filter(t => t.email !== email.toLowerCase());
    
    cleanTokens.push({
      email: email.toLowerCase(),
      token: token,
      expires: Date.now() + 3600000 // 1 hour
    });
    
    this.saveResetTokens(cleanTokens);
    return token;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokens = this.getResetTokens();
    const tokenRecord = tokens.find(t => t.token === token);

    if (!tokenRecord) {
      throw new Error('Ongeldige of verlopen reset link.');
    }

    if (Date.now() > tokenRecord.expires) {
      // Cleanup expired
      this.saveResetTokens(tokens.filter(t => t.token !== token));
      throw new Error('Deze link is verlopen. Vraag een nieuwe aan.');
    }

    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === tokenRecord.email);

    if (userIndex === -1) {
      throw new Error('Gebruiker niet gevonden.');
    }

    // Update Password
    const newHash = await hashPassword(newPassword);
    users[userIndex].passwordHash = newHash;
    this.saveUsers(users);

    // Cleanup Token
    this.saveResetTokens(tokens.filter(t => t.token !== token));
  }

  // --- Data Management (Weights) ---

  getWeightEntries(userId: string): WeightEntry[] {
    const allWeights = this.getAllWeights();
    return allWeights[userId] || [];
  }

  addWeightEntry(userId: string, weight: number): WeightEntry {
    const allWeights = this.getAllWeights();
    const userWeights = allWeights[userId] || [];

    const newEntry: WeightEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      weight: weight
    };

    userWeights.push(newEntry);
    allWeights[userId] = userWeights;
    
    localStorage.setItem(DB_KEYS.DATA_WEIGHTS, JSON.stringify(allWeights));
    return newEntry;
  }

  deleteWeightEntry(userId: string, entryId: string): void {
    const allWeights = this.getAllWeights();
    if (!allWeights[userId]) return;

    allWeights[userId] = allWeights[userId].filter(w => w.id !== entryId);
    localStorage.setItem(DB_KEYS.DATA_WEIGHTS, JSON.stringify(allWeights));
  }

  // --- Data Management (CheckIns) ---

  getCheckIns(userId: string): DailyCheckIn[] {
    const allCheckins = this.getAllCheckins();
    return allCheckins[userId] || [];
  }

  addCheckIn(userId: string, checkIn: Omit<DailyCheckIn, 'id' | 'date'>): DailyCheckIn {
    const allCheckins = this.getAllCheckins();
    const userCheckins = allCheckins[userId] || [];

    const newEntry: DailyCheckIn = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      ...checkIn
    };

    userCheckins.push(newEntry);
    allCheckins[userId] = userCheckins;
    
    localStorage.setItem(DB_KEYS.DATA_CHECKINS, JSON.stringify(allCheckins));
    return newEntry;
  }

  // --- Data Management (Meals) ---

  getMealEntries(userId: string): MealEntry[] {
    const allMeals = this.getAllMeals();
    return allMeals[userId] || [];
  }

  addMealEntry(userId: string, meal: Omit<MealEntry, 'id' | 'date'>): MealEntry {
    const allMeals = this.getAllMeals();
    const userMeals = allMeals[userId] || [];

    const newEntry: MealEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      ...meal
    };

    userMeals.push(newEntry);
    allMeals[userId] = userMeals;
    
    localStorage.setItem(DB_KEYS.DATA_MEALS, JSON.stringify(allMeals));
    return newEntry;
  }

  deleteMealEntry(userId: string, entryId: string): void {
    const allMeals = this.getAllMeals();
    if (!allMeals[userId]) return;

    allMeals[userId] = allMeals[userId].filter(m => m.id !== entryId);
    localStorage.setItem(DB_KEYS.DATA_MEALS, JSON.stringify(allMeals));
  }

  // --- Internal Helpers (Private-ish) ---

  private getUsers(): User[] {
    const usersStr = localStorage.getItem(DB_KEYS.USERS);
    return usersStr ? JSON.parse(usersStr) : [];
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
  }

  private setSession(user: User): void {
    localStorage.setItem(DB_KEYS.SESSION, JSON.stringify(user));
  }

  private getAllWeights(): Record<string, WeightEntry[]> {
    const str = localStorage.getItem(DB_KEYS.DATA_WEIGHTS);
    return str ? JSON.parse(str) : {};
  }

  private getAllCheckins(): Record<string, DailyCheckIn[]> {
    const str = localStorage.getItem(DB_KEYS.DATA_CHECKINS);
    return str ? JSON.parse(str) : {};
  }

  private getAllMeals(): Record<string, MealEntry[]> {
    const str = localStorage.getItem(DB_KEYS.DATA_MEALS);
    return str ? JSON.parse(str) : {};
  }

  private getResetTokens(): ResetToken[] {
    const str = localStorage.getItem(DB_KEYS.RESET_TOKENS);
    return str ? JSON.parse(str) : [];
  }

  private saveResetTokens(tokens: ResetToken[]): void {
    localStorage.setItem(DB_KEYS.RESET_TOKENS, JSON.stringify(tokens));
  }
}

export const db = new DatabaseService();
