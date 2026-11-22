import { useState } from 'react';
import toast from 'react-hot-toast';
import { Phone, Lock, Pencil, KeyRound } from 'lucide-react';
import { PageHead, Field } from '../components/ui.jsx';
import { useApp } from '../context.jsx';
import { api } from '../api.js';

export default function Settings() {
  const { config, setConfig } = useApp();
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [phoneId, setPhoneId] = useState('');
  const [busy, setBusy] = useState(false);

  const open = () => { setPhone(config.academyPhone || ''); setUsername(''); setPassword(''); setApiKey(''); setPhoneId(''); setEditing(true); };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await api.put('/settings/owner-phone', { phone, username, password, waApiKey: apiKey, waPhoneId: phoneId });
      setConfig((c) => ({ ...c, academyPhone: r.academyPhone, waApiKeyMasked: r.waApiKeyMasked, waPhoneId: r.waPhoneId, waApiReady: r.waApiReady }));
      toast.success('Owner ka WhatsApp number update ho gaya');
      setEditing(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
      setPassword('');
    }
  };

  return (
    <div>
      <PageHead title="Settings" subtitle="Academy ki settings" />
      <section className="card animate-fade-up max-w-xl p-4 lg:p-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-11 flex-none items-center justify-center rounded-xl bg-[#25D366] text-white"><Phone size={20} /></span>
          <div className="min-w-0 flex-1">
            <div className="text-sm text-muted">Owner WhatsApp / Contact number</div>
            <div className="text-lg font-bold text-head">{config.academyPhone || 'Set nahi hai'}</div>
          </div>
          {!editing && (
            <button onClick={open} className="btn btn-outline btn-sm"><Pencil size={15} /> Change</button>
          )}
        </div>
        <p className="mt-3 text-[13px] text-muted">Ye number parents ko bheje gaye fee reminder aur receipt ke message mein "Contact" ke taur par jata hai.</p>

        <div className="mt-4 flex items-center gap-3 border-t border-line pt-4">
          <span className="inline-flex size-11 flex-none items-center justify-center rounded-xl bg-blue-600 text-white"><KeyRound size={20} /></span>
          <div className="min-w-0 flex-1">
            <div className="text-sm text-muted">WhatsApp API key</div>
            <div className="truncate font-mono text-sm font-semibold text-head">{config.waApiKeyMasked || 'Set nahi hai'}</div>
            <div className="text-xs text-muted">Phone Number ID: {config.waPhoneId || 'Set nahi hai'} · {config.waApiReady ? 'Auto-send chalu hai' : 'Auto-send band (wa link khulega)'}</div>
          </div>
        </div>

        {editing && (
          <form onSubmit={save} className="mt-4 space-y-3 border-t border-line pt-4">
            <Field label="Naya number">
              <input className="input" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="03001234567" required />
            </Field>
            <Field label="WhatsApp API key (optional)">
              <input className="input font-mono" autoComplete="off" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Khali chhorein to purani key wahi rahegi" />
            </Field>
            <Field label="WhatsApp Phone Number ID (optional)">
              <input className="input font-mono" inputMode="numeric" autoComplete="off" value={phoneId} onChange={(e) => setPhoneId(e.target.value)} placeholder="Meta dashboard se; khali = purana rahega" />
            </Field>
            <div className="flex items-center gap-1.5 text-[13px] font-medium text-muted"><Lock size={14} /> Tasdeeq ke liye owner ka username aur password likhein</div>
            <Field label="Username">
              <input className="input" autoComplete="off" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </Field>
            <Field label="Password">
              <input className="input" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Field>
            <div className="flex gap-2">
              <button type="submit" disabled={busy} className="btn btn-primary flex-1">{busy ? 'Save ho raha hai...' : 'Save'}</button>
              <button type="button" onClick={() => setEditing(false)} className="btn btn-outline">Cancel</button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
