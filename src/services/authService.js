import { ref, computed } from 'vue';

const TOKEN_KEY = 'jobpulse_auth_token_v1';
const USER_KEY = 'jobpulse_auth_user_v1';

// Reactive auth state
const token = ref(localStorage.getItem(TOKEN_KEY) || null);
let initialUser = null;
try {
  const storedUser = localStorage.getItem(USER_KEY);
  if (storedUser) initialUser = JSON.parse(storedUser);
} catch {
  initialUser = null;
}
const currentUser = ref(initialUser);

export const authService = {
  // Reactive state getters
  currentUser,
  token,
  isAuthenticated: computed(() => !!token.value && !!currentUser.value),

  getToken() {
    return token.value;
  },

  getCurrentUser() {
    return currentUser.value;
  },

  async login({ email, password }) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed.');
    }

    this.setSession(data.token, data.user);
    return data.user;
  },

  async register({ name, email, password, headline }) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, headline })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed.');
    }

    this.setSession(data.token, data.user);
    return data.user;
  },

  async checkAuth() {
    if (!token.value) return null;

    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        currentUser.value = data.user;
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return data.user;
      } else {
        this.logout();
        return null;
      }
    } catch {
      // Network error, keep offline cache
      return currentUser.value;
    }
  },

  setSession(newToken, newUser) {
    token.value = newToken;
    currentUser.value = newUser;
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  },

  async logout() {
    try {
      if (token.value) {
        fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token.value}` }
        }).catch(() => {});
      }
    } finally {
      token.value = null;
      currentUser.value = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  // 1-Click Demo Login
  async demoLogin() {
    return this.login({
      email: 'alex@jobpulse.io',
      password: 'password123'
    });
  }
};
