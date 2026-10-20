import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ve_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.userId && parsed.email) {
          return parsed;
        }
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('ve_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [toasts, setToasts] = useState([]);
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Synchronize authentication session with Spring Boot backend
  useEffect(() => {
    let isMounted = true;

    async function syncSessionAndBackend() {
      try {
        const res = await fetch('/api/users/services', { method: 'GET', credentials: 'include' });
        if (res.ok && isMounted) {
          setIsBackendOnline(true);
        } else if (isMounted) {
          setIsBackendOnline(false);
        }
      } catch (err) {
        if (isMounted) setIsBackendOnline(false);
      }

      try {
        const currentSessionUser = await authApi.me();
        if (isMounted) {
          if (currentSessionUser && currentSessionUser.userId) {
            setUser(currentSessionUser);
          } else {
            setUser(null);
          }
        }
      } catch (err) {
        // If 401 or offline, keep or clear state appropriately
      } finally {
        if (isMounted) setIsLoadingAuth(false);
      }
    }

    syncSessionAndBackend();
    const interval = setInterval(syncSessionAndBackend, 20000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Save cart to local storage
  useEffect(() => {
    localStorage.setItem('ve_cart', JSON.stringify(cart));
  }, [cart]);

  // Save user to local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem('ve_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ve_current_user');
    }
  }, [user]);

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const login = async (email, password) => {
    try {
      const loggedUser = await authApi.login(email, password);
      setUser(loggedUser);
      showToast(`Welcome back, ${loggedUser.firstName}! Signed in as ${loggedUser.role}.`, 'success');
      setIsAuthModalOpen(false);
      return loggedUser;
    } catch (err) {
      showToast(err.message || 'Login failed. Please check your credentials.', 'error');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      await authApi.register(userData);
      showToast('Registration successful! Logging in...', 'success');
      // Automatically authenticate with backend credentials
      return await login(userData.email, userData.password);
    } catch (err) {
      showToast(err.message || 'Registration failed.', 'error');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn('Logout error:', err);
    } finally {
      setUser(null);
      setCart([]);
      showToast('You have been logged out.', 'info');
    }
  };

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.productId === product.productId);
      if (existing) {
        return prev.map(item =>
          item.product.productId === product.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${product.name} to cart.`, 'success');
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.productId !== productId));
  };

  const updateCartQuantity = (productId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.product.productId === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((acc, it) => acc + (it.product.price * it.quantity), 0);
  const cartCount = cart.reduce((acc, it) => acc + it.quantity, 0);

  const role = user?.role?.toUpperCase() || 'GUEST';
  const isAuthenticated = Boolean(user);
  const isGuest = !user;
  const isMember = role === 'MEMBER';
  const isDoctor = role === 'DOCTOR';
  const isEmployee = role === 'EMPLOYEE';
  const isManager = role === 'MANAGER';
  const isAdmin = role === 'ADMIN';
  const isStaff = ['DOCTOR', 'EMPLOYEE', 'MANAGER', 'ADMIN'].includes(role);

  const value = {
    user,
    role,
    isAuthenticated,
    isGuest,
    isMember,
    isDoctor,
    isEmployee,
    isManager,
    isAdmin,
    isStaff,
    isLoadingAuth,
    isBackendOnline,
    login,
    register,
    logout,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    cartCount,
    toasts,
    showToast,
    removeToast,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    isCartOpen,
    setIsCartOpen,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
