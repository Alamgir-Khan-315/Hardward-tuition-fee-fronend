import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserPlus, Eye, Pencil, Trash2, MessageCircle, Search, Phone } from 'lucide-react';
import { api } from '../api.js';
import { useApp } from '../context.jsx';
import { Avatar, Confirm, Empty, Fab, ListSkeleton, PageHead, Segmented } from '../components/ui.jsx';
import { money } from '../utils/format.js';
import { reminderLink, chatLink } from '../utils/whatsapp.js';

export default function Students() {
  const { config } = useApp();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const [status, setStatus] = useState(params.get('status') || '');
  const [rows, setRows] = useState(null);
  const [del, setDel] = useState(null);

  useEffect(() => { setQ(params.get('q') || ''); }, [params]);

  useEffect(() => {
    const t = setTimeout(() => {
      const qs = new URLSearchParams();
      if (q.trim()) qs.set('q', q.trim());
      if (status) qs.set('status', status);
      api.get('/students?' + qs.toString()).then(setRows).catch((e) => toast.error(e.message));
    }, 250);
    return () => clearTimeout(t);
  }, [q, status]);

  const remove = async () => {
    try {
      await api.del('/students/' + del._id);
      toast.success('Student delete ho gaya.');
      setRows((r) => r.filter((x) => x._id !== del._id));
    } catch (e) { toast.error(e.message); }
    setDel(null);
  };

  const waHref = (s) => (s.summary.due > 0 ? reminderLink(s, s.summary.due, config) : chatLink(s, config));

  return (
    <>
      <PageHead title="Students" subtitle={rows ? `${rows.length} students` : 'Sab students ki list'}>
        <Link className="btn btn-primary hidden lg:inline-flex" to="/students/new"><UserPlus size={17} />Add Student</Link>
      </PageHead>

      <div className="mb-4 space-y-3 lg:flex lg:items-center lg:gap-3 lg:space-y-0">
        <div className="relative lg:max-w-md lg:flex-1">
          <Search size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" />
          <input
            className="input pl-11"
            type="search"
            enterKeyHint="search"
            value={q}
            onChange={(e) => { setQ(e.target.value); setParams(e.target.value ? { q: e.target.value } : {}); }}
            placeholder="Naam, ID, class ya number se search..."
          />
        </div>
        <div className="lg:w-80">
          <Segmented value={status} onChange={setStatus} options={[{ value: '', label: 'Sab' }, { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
        </div>
      </div>

      {!rows ? <ListSkeleton h="h-44" /> : (
        <>
          {/* ===== Mobile: cards ===== */}
          <div className="space-y-3 lg:hidden">
            {rows.map((s, i) => (
              <article key={s._id} className="card animate-fade-up p-3.5" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
                <Link to={`/students/${s._id}`} className="flex items-center gap-3">
                  <Avatar name={s.studentName} size="lg" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[15px] font-bold">{s.studentName}</div>
                    <div className="mt-0.5 flex items-center gap-2"><span className="chip">{s.studentCode}</span><span className="truncate text-xs text-muted">{s.className}</span></div>
                  </div>
                  {s.isActive ? <span className="badge b-green">Active</span> : <span className="badge b-gray">Inactive</span>}
                </Link>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-soft px-3 py-2"><div className="text-[11px] text-muted">Monthly Fee</div><div className="truncate text-sm font-bold">{money(s.monthlyFee)}</div></div>
                  <div className="rounded-xl bg-soft px-3 py-2"><div className="text-[11px] text-muted">Due</div><div className={'truncate text-sm font-bold ' + (s.summary.due > 0 ? 'text-red-500' : 'text-green-600')}>{money(s.summary.due)}</div></div>
                </div>
                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted"><Phone size={13} /><span className="truncate">{s.parentName} · {s.parentWhatsApp}</span></div>
                <div className="mt-3 flex items-center gap-2">
                  <a className="btn btn-wa h-10 flex-1" target="_blank" rel="noreferrer" href={waHref(s)}><MessageCircle size={17} />WhatsApp</a>
                  <Link className="btn-icon" to={`/students/${s._id}`} aria-label="Details"><Eye size={18} /></Link>
                  <Link className="btn-icon primary" to={`/students/${s._id}/edit`} aria-label="Edit"><Pencil size={17} /></Link>
                  <button className="btn-icon danger" onClick={() => setDel(s)} aria-label="Delete"><Trash2 size={17} /></button>
                </div>
              </article>
            ))}
            {!rows.length && <div className="card"><Empty icon={Search} text="Koi student nahi mila." /></div>}
          </div>

          {/* ===== Laptop: table ===== */}
          <div className="card hidden overflow-hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-0 text-sm">
                <thead>
                  <tr className="bg-soft text-left text-[11px] font-bold tracking-wide text-muted uppercase">
                    <th className="px-4 py-3.5">ID</th><th className="px-4 py-3.5">Student</th><th className="px-4 py-3.5">Parent</th><th className="px-4 py-3.5">WhatsApp</th><th className="px-4 py-3.5">Class</th>
                    <th className="px-4 py-3.5 text-right">Monthly Fee</th><th className="px-4 py-3.5 text-right">Due</th><th className="px-4 py-3.5">Status</th><th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((s) => (
                    <tr key={s._id} className="group transition-colors hover:bg-blue-600/5">
                      <td className="border-b border-line/70 px-4 py-3"><span className="chip">{s.studentCode}</span></td>
                      <td className="border-b border-line/70 px-4 py-3"><Link to={`/students/${s._id}`} className="flex items-center gap-3 font-semibold hover:text-blue-600"><Avatar name={s.studentName} />{s.studentName}</Link></td>
                      <td className="border-b border-line/70 px-4 py-3">{s.parentName}</td>
                      <td className="border-b border-line/70 px-4 py-3 whitespace-nowrap">{s.parentWhatsApp}</td>
                      <td className="border-b border-line/70 px-4 py-3">{s.className}</td>
                      <td className="border-b border-line/70 px-4 py-3 text-right whitespace-nowrap">{money(s.monthlyFee)}</td>
                      <td className={'border-b border-line/70 px-4 py-3 text-right font-semibold whitespace-nowrap ' + (s.summary.due > 0 ? 'text-red-500' : 'text-green-600')}>{money(s.summary.due)}</td>
                      <td className="border-b border-line/70 px-4 py-3">{s.isActive ? <span className="badge b-green">Active</span> : <span className="badge b-gray">Inactive</span>}</td>
                      <td className="border-b border-line/70 px-4 py-3">
                        <div className="flex justify-end gap-1.5">
                          <a className="btn-icon wa size-9" target="_blank" rel="noreferrer" aria-label="WhatsApp" href={waHref(s)}><MessageCircle size={16} /></a>
                          <Link className="btn-icon size-9" to={`/students/${s._id}`} aria-label="Details"><Eye size={16} /></Link>
                          <Link className="btn-icon primary size-9" to={`/students/${s._id}/edit`} aria-label="Edit"><Pencil size={16} /></Link>
                          <button className="btn-icon danger size-9" onClick={() => setDel(s)} aria-label="Delete"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!rows.length && <Empty icon={Search} text="Koi student nahi mila." />}
          </div>
        </>
      )}

      <Fab to="/students/new" icon={UserPlus} label="Add" />

      {del && (
        <Confirm
          title="Student delete karein?"
          message={`${del.studentName} aur iski sab fee records delete ho jayengi. Ye wapas nahi ho sakta.`}
          onConfirm={remove}
          onCancel={() => setDel(null)}
        />
      )}
    </>
  );
}
