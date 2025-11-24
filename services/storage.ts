import { User, CartItem, Product } from '../types';

const USERS_KEY = 'vantage_users';
const SESSION_KEY = 'vantage_session';

// Helper to simulate network delay for realism
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const storageService = {
  // --- Auth Methods ---

  async login(username: string, password: string): Promise<User> {
    await delay(500); // Simulate API call
    const users = this.getUsers();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
    
    if (!user) {
      throw new Error('Invalid username or password');
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(user.username));
    return user;
  },

  async signup(username: string, password: string, name: string): Promise<User> {
    await delay(500);
    const users = this.getUsers();
    
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      throw new Error('Username already taken');
    }

    const newUser: User = {
      username,
      name,
      password,
      cart: []
    };

    users.push(newUser);
    this.saveUsers(users);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser.username));
    
    return newUser;
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser(): User | null {
    const username = localStorage.getItem(SESSION_KEY);
    if (!username) return null;
    
    const users = this.getUsers();
    const parsedUsername = JSON.parse(username);
    return users.find(u => u.username === parsedUsername) || null;
  },

  // --- Cart Methods ---

  async addToCart(username: string, product: Product): Promise<User> {
    await delay(200);
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.username === username);
    
    if (userIndex === -1) throw new Error('User not found');

    const newItem: CartItem = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
      addedAt: Date.now()
    };

    // Check if already exists to prevent duplicates (by URL)
    const exists = users[userIndex].cart.some(item => item.url === product.url);
    if (!exists) {
      users[userIndex].cart.push(newItem);
      this.saveUsers(users);
    }
    
    return users[userIndex];
  },

  async removeFromCart(username: string, itemId: string): Promise<User> {
    await delay(200);
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.username === username);
    
    if (userIndex === -1) throw new Error('User not found');

    users[userIndex].cart = users[userIndex].cart.filter(item => item.id !== itemId);
    this.saveUsers(users);
    
    return users[userIndex];
  },

  // --- Internal Helpers ---

  getUsers(): User[] {
    const usersStr = localStorage.getItem(USERS_KEY);
    return usersStr ? JSON.parse(usersStr) : [];
  },

  saveUsers(users: User[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
};
