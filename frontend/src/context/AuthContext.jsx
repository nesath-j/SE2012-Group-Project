import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';
import { DEMO_PRESET_USERS } from '../services/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Default initial session to member Sarah for immediate interactive exploration
    const saved = localStorage.getItem('ve_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return DEMO_PRESET_USERS[0]; }
    }
    return DEMO_PRESET_USERS[0];
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('ve_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [
      {
        product: {
          productId: 1,
          name: 'Ray-Ban Wayfarer Classic',
          price: 165.00,
          category: 'Eyeglasses',
          stockQuantity: 45,
          pic: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80'
        },
        quantity: 1
      }
    ];
  });

  const [toasts, setToasts] = useState([]);
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register' | 'switch'
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Check Spring Boot backend health on port 8081
  useEffect(() => {
    let isMounted = true;
    async function checkBackend() {
      try {
        const res = await fetch('/api/users/services', { method: 'GET', credentials: 'include' });
        if (res.ok && isMounted) {
          setIsBackendOnline(true);
        }
      } catch (err) {
        if (isMounted) setIsBackendOnline(false);
      }
    }
    checkBackend();
    const interval = setInterval(checkBackend, 15000);
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
      showToast(`Welcome back, ${loggedUser.firstName}!`, 'success');
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
      showToast('Registration successful! Logging you in...', 'success');
      // Auto login or set user
      const loggedUser = {
        userId: Date.now(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        role: 'MEMBER',
        loyaltyPoints: 0,
        totalEarnedPoints: 0,
        tier: 'Bronze',
        discountPercentage: 0
      };
      setUser(loggedUser);
      setIsAuthModalOpen(false);
      return loggedUser;
    } catch (err) {
      showToast(err.message || 'Registration failed.', 'error');
      throw err;
    }
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    showToast('You have been logged out.', 'info');
  };

  const switchDemoUser = (preset) => {
    setUser(preset);
    showToast(`Switched active profile to ${preset.firstName} (${preset.role})`, 'success');
    setIsAuthModalOpen(false);
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

  const value = {
    user,
    role: user?.role?.toUpperCase() || 'GUEST',
    isBackendOnline,
    login,
    register,
    logout,
    switchDemoUser,
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
