import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Banknote, BarChart3, Info, LogOut, Sun, Moon, ChevronLeft, Menu, Search, Calendar, Headset, X, Phone, Mail, Globe, MessageCircle, Settings as Cog } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context.jsx';
import { api } from '../api.js';
import { DEV } from '../utils/developer.js';
import { waLink } from '../utils/whatsapp.js';

const nav = [
  { to: '/', label: 'Home', long: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/students', label: 'Student', long: 'Students', icon: Users },
  { to: '/fees', label: 'Fee', long: 'Fees', icon: Banknote },
  { to: '/reports', label: 'Report', long: 'Reports', icon: BarChart3 },
  { to: '/about', label: 'About', long: 'About', icon: Info },
];
const tabs = ['', 'students', 'fees', 'reports', 'about'];

function titleFor(pathname) {
  const p = pathname.split('/').filter(Boolean);
  if (!p.length) return 'Dashboard';
  if (p[0] === 'students') {
    if (p.length === 1) return 'Students';
    if (p[1] === 'new') return 'Add Student';
    return p[2] === 'edit' ? 'Edit Student' : 'Student Detail';
  }
  if (p[0] === 'fees') {
    if (p.length === 1) return 'Fees';
    return p[1] === 'history' ? 'Payment History' : 'Edit Fee';
  }
  if (p[0] === 'reports') return 'Report';
  if (p[0] === 'about') return 'About';
  if (p[0] === 'settings') return 'Settings';
  return 'Fee Manager';
}

function ContactMenu() {
  const [open, setOpen] = useState(false);
  const items = [
    DEV.whatsapp && { href: waLink(DEV.whatsapp, 'Assalam o Alaikum ' + DEV.name + ','), label: 'WhatsApp', icon: MessageCircle, cls: 'bg-[#25D366]' },
    DEV.phone && { href: 'tel:' + DEV.phone, label: 'Call', icon: Phone, cls: 'bg-blue-600' },
    DEV.email && { href: 'mailto:' + DEV.email, label: 'Email', icon: Mail, cls: 'bg-amber-500' },
    { href: DEV.portfolio, label: 'Portfolio', icon: Globe, cls: 'bg-cyan-600' },
  ].filter(Boolean);
  return (
    <div className="relative hidden sm:block">
      <button onClick={() => setOpen((o) => !o)} aria-label="Contact" className="btn-icon size-11 rounded-2xl"><Headset size={20} /></button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="card absolute right-0 top-14 z-50 w-64 animate-pop p-3 shadow-nav">
            <div className="mb-2 flex items-center justify-between px-1">
              <div className="leading-tight"><b className="block text-sm text-head">Contact Developer</b><small className="text-xs text-muted">{DEV.name}</small></div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-muted hover:text-head"><X size={18} /></button>
            </div>
            <div className="space-y-1.5">
              {items.map(({ href, label, icon: Icon, cls }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium text-ink transition hover:bg-blue-600/10">
                  <span className={'inline-flex size-9 items-center justify-center rounded-lg text-white ' + cls}><Icon size={17} /></span>{label}
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function Layout() {
  const { theme, toggleTheme, config } = useApp();
  const navigate = useNavigate();
  const { pathname, key } = useLocation();
  const [typing, setTyping] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [q, setQ] = useState('');

  const seg = pathname.split('/').filter(Boolean);
  const isSub = seg.length > 1;
  const idx = Math.max(0, tabs.indexOf(seg[0] || ''));

  // Mobile: keyboard khulne par nav chhup jata hai
  useEffect(() => {
    const isField = (el) => el && ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName) && el.type !== 'checkbox';
    const onIn = (e) => isField(e.target) && setTyping(true);
    const onOut = () => setTimeout(() => setTyping(isField(document.activeElement)), 60);
    document.addEventListener('focusin', onIn);
    document.addEventListener('focusout', onOut);
    return () => { document.removeEventListener('focusin', onIn); document.removeEventListener('focusout', onOut); };
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  // WhatsApp icon: API set ho to message seedha jata hai, warna wa link khulta hai
  useEffect(() => {
    if (!config?.waApiReady) return undefined;
    const onClick = async (e) => {
      const a = e.target.closest && e.target.closest('a[href^="https://api.whatsapp.com/send"]');
      if (!a) return;
      const u = new URL(a.href);
      const to = u.searchParams.get('phone') || '';
      const message = u.searchParams.get('text') || '';
      if (message.length < 40) return; // sirf "Assalam o Alaikum" wali chat: manual khulegi
      e.preventDefault();
      const t = toast.loading('WhatsApp message bheja ja raha hai...');
      try {
        await api.post('/whatsapp/send', { to, message });
        toast.success('Message bhej diya gaya', { id: t });
      } catch (err) {
        toast.error(err.message + ' - WhatsApp khol rahe hain', { id: t });
        window.open(a.href, '_blank', 'noreferrer');
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [config?.waApiReady]);

  const back = () => (window.history.state?.idx > 0 ? navigate(-1) : navigate('/' + seg[0]));
  const search = (e) => { e.preventDefault(); navigate('/students?q=' + encodeURIComponent(q.trim())); };
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="min-h-dvh bg-app">
      {/* ===== Laptop: left sidebar ===== */}
      <aside className={'fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-surface px-4 py-5 transition-transform duration-300 lg:flex ' + (collapsed ? '-translate-x-full' : '')}>
        <div className="mb-4 flex items-center gap-3 border-b border-line px-1 pb-5">
          <img src="/logo.png" alt="The Harvard Academy" className="h-14 w-auto flex-none" />
          <div className="leading-tight">
            <b className="block text-[15px] text-head">The Harvard<br />Academy</b>
            <small className="text-xs text-muted">Fee Manager</small>
          </div>
        </div>
        <nav className="flex flex-col gap-1.5">
          {nav.map(({ to, long, icon: Icon, end }, i) => (
            <NavLink key={to} to={to} end={end}
              className={'flex items-center gap-3 rounded-xl px-3.5 py-3 text-[15px] font-medium transition duration-200 ' + (i === idx ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/35' : 'text-muted hover:bg-blue-600/10 hover:text-blue-600')}>
              <Icon size={20} /><span>{long}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto">
          <div className="px-1 text-xs text-muted">Version 1.1</div>
        </div>
      </aside>

      {/* ===== Content area (mobile: centered 480px, laptop: full width next to sidebar) ===== */}
      <div className={'relative mx-auto min-h-dvh w-full max-w-[480px] bg-app sm:border-x sm:border-line lg:mx-0 lg:w-auto lg:max-w-none lg:border-x-0 lg:transition-[margin] lg:duration-300 ' + (collapsed ? 'lg:ml-0' : 'lg:ml-64')}>
        <header className="sticky top-0 z-30 border-b border-line bg-app/85 backdrop-blur-xl" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
          <div className="flex h-16 items-center gap-3 px-4 lg:px-8">
            <button onClick={() => setCollapsed((c) => !c)} aria-label="Menu" className="btn-icon hidden size-11 !border-blue-600 !bg-blue-600 !text-white lg:inline-flex"><Menu size={22} /></button>
            {isSub ? (
              <button onClick={back} aria-label="Back" className="btn-icon size-11 animate-pop"><ChevronLeft size={22} /></button>
            ) : (
              <img src="/logo.png" alt="The Harvard Academy" className="h-11 w-auto flex-none animate-pop lg:hidden" />
            )}
            <h1 key={key} className="min-w-0 flex-1 animate-fade-in truncate text-lg font-bold text-head lg:text-xl">{titleFor(pathname)}</h1>

            <form onSubmit={search} className="relative hidden w-72 lg:block">
              <input className="input h-11 rounded-full pr-12 pl-5" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search students..." />
              <button type="submit" aria-label="Search" className="absolute top-1/2 right-1.5 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-muted transition hover:text-blue-600"><Search size={18} /></button>
            </form>
            <div className="hidden items-center gap-2 text-sm font-semibold text-head xl:flex"><Calendar size={17} className="text-blue-600" />{today}</div>

            <ContactMenu />
            <NavLink to="/settings" aria-label="Settings" className="btn-icon size-11 rounded-2xl"><Cog size={20} /></NavLink>
            <button onClick={toggleTheme} aria-label="Day / Night" className="btn-icon size-11 rounded-2xl">
              <span key={theme} className="animate-pop">{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</span>
            </button>
          </div>
        </header>

        <main key={pathname} className="animate-fade-up px-4 pt-4 pb-36 lg:max-w-none lg:px-8 lg:pt-6 lg:pb-8">
          <Outlet />
        </main>

        <footer className="hidden items-center justify-between border-t border-line px-8 py-4 text-[13px] text-muted lg:flex">
          <span>&copy; {new Date().getFullYear()} The Harvard Academy. All rights reserved.</span>
          <span>Version 1.1</span>
        </footer>

        {/* ===== Mobile: floating bottom nav ===== */}
        <nav
          className={'fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] px-3 transition-transform duration-300 lg:hidden ' + (typing ? 'translate-y-[140%]' : 'translate-y-0')}
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 10px)' }}
          aria-label="Main"
        >
          <div className="relative grid grid-cols-5 rounded-[28px] border border-line bg-surface/95 p-1.5 shadow-nav backdrop-blur-xl">
            <span
              className="absolute top-1.5 bottom-1.5 left-1.5 rounded-[22px] bg-blue-600 shadow-lg shadow-blue-600/40 transition-transform duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)]"
              style={{ width: 'calc((100% - 12px) / 5)', transform: `translateX(${idx * 100}%)` }}
              aria-hidden="true"
            />
            {nav.map(({ to, label, icon: Icon, end }, i) => (
              <NavLink key={to} to={to} end={end}
                className={'relative z-10 flex flex-col items-center gap-0.5 rounded-[22px] py-2.5 text-[11px] font-semibold transition-colors duration-300 active:scale-90 ' + (i === idx ? 'text-white' : 'text-muted')}>
                <Icon size={22} className={'transition-transform duration-300 ' + (i === idx ? '-translate-y-px scale-110' : '')} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
