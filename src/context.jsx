import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from './api.js';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [config, setConfig] = useState({ academyName: 'Academy', academyPhone: '', countryCode: '92' });
  const [loading, setLoading] = useState(true);
  const [theme, setThemeState] = useState(() => {
    try { return localStorage.getItem('theme') || 'light'; } catch { return 'light'; }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch { /* ignore */ }
  }, [theme]);

  const loadConfig = useCallback(async () => {
    try { setConfig(await api.get('/config')); } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    api.get('/auth/me')
      .then(async (r) => { setUser(r.user); await loadConfig(); })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
    const onUnauth = () => setUser(null);
    window.addEventListener('unauthorized', onUnauth);
    return () => window.removeEventListener('unauthorized', onUnauth);
  }, [loadConfig]);

  const login = async (username, password) => {
    const r = await api.post('/auth/login', { username, password });
    setUser(r.user);
    await loadConfig();
  };
  const logout = async () => {
    try { await api.post('/auth/logout'); } catch { /* ignore */ }
    setUser(null);
  };
  const toggleTheme = () => setThemeState((t) => (t === 'dark' ? 'light' : 'dark'));

  return <Ctx.Provider value={{ user, config, loading, theme, toggleTheme, login, logout }}>{children}</Ctx.Provider>;
}
