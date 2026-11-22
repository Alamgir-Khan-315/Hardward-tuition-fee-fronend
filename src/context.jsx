import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from './api.js';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [user] = useState({ username: 'admin', role: 'Admin' });
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
    try {
      const r = await api.get('/config');
      if (r && typeof r === 'object') setConfig((c) => ({ ...c, ...r }));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    loadConfig().finally(() => setLoading(false));
  }, [loadConfig]);

  const toggleTheme = () => setThemeState((t) => (t === 'dark' ? 'light' : 'dark'));

  return <Ctx.Provider value={{ user, config, setConfig, loading, theme, toggleTheme }}>{children}</Ctx.Provider>;
}
