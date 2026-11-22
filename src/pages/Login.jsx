import { useState } from 'react';
import { User, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context.jsx';

export default function Login() {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-linear-to-br from-[#0f1d4d] via-navy to-blue-600 p-5" style={{ paddingTop: 'max(1.25rem, env(safe-area-inset-top))', paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}>
      <span className="pointer-events-none absolute -top-24 -right-20 size-80 animate-float rounded-full bg-white/10" />
      <span className="pointer-events-none absolute -bottom-24 -left-16 size-64 animate-float-slow rounded-full bg-cyan-400/20" />

      <form className="relative z-10 w-full max-w-[400px] animate-fade-up rounded-3xl bg-surface p-6 shadow-2xl" onSubmit={submit}>
        <img src="/logo.png" alt="The Harvard Academy" className="mx-auto mb-3 h-24 w-auto animate-pop" />
        <h3 className="text-center text-xl font-bold text-head">The Harvard Academy</h3>
        <p className="mt-0.5 mb-5 text-center text-[13px] text-muted">Fee Manager &middot; Admin login</p>

        {error && <div className="alert alert-error animate-pop" role="alert">{error}</div>}

        <div className="mb-4">
          <label className="label" htmlFor="u">Username</label>
          <div className="relative">
            <User size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" />
            <input id="u" className="input pl-11" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" autoCapitalize="none" autoCorrect="off" required />
          </div>
        </div>
        <div className="mb-6">
          <label className="label" htmlFor="p">Password</label>
          <div className="relative">
            <Lock size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" />
            <input id="p" type={show ? 'text' : 'password'} className="input px-11" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
            <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute top-1/2 right-1.5 flex size-10 -translate-y-1/2 items-center justify-center rounded-lg text-muted active:scale-90">
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <button className="btn btn-primary h-12 w-full text-base" disabled={busy}>
          <LogIn size={19} /> {busy ? 'Please wait...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
