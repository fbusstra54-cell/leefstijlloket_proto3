
import { User, WeightEntry, DailyCheckIn, UserProfile } from '../types';

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
  SESSION: 'prostavita_db_session'
};

class DatabaseService {
  // --- Auth & User Management ---

  async registerUser(email: string, password: string, profile: UserProfile): Promise<User> {
    const users = this.getUsers();
    
    // Check if email exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Dit e-mailadres is al in gebruik.');
    }

    const passwordHash = await hashPassword(password);
    
    // Ensure activeChallengeId is set, even if profile doesn't have it explicitly yet (defensive)
    const finalProfile: UserProfile = {
        ...profile,
        activeChallengeId: profile.activeChallengeId || null
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

    // Clear session if it was this user
    const session = this.getCurrentSession();
    if (session && session.id === userId) {
      this.logoutUser();
    }
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
}

export const db = new DatabaseService();