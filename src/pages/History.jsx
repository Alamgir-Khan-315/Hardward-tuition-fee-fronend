import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Pencil, Trash2, Banknote, Search } from 'lucide-react';
import { api } from '../api.js';
import { Confirm, Empty, ListSkeleton, PageHead } from '../components/ui.jsx';
import { money, monthName, fmtDate } from '../utils/format.js';

export default function History() {
  const [q, setQ] = useState('');
  const [rows, setRows] = useState(null);
  const [del, setDel] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      api.get('/fees/history' + (q.trim() ? '?q=' + encodeURIComponent(q.trim()) : '')).then(setRows).catch((e) => toast.error(e.message));
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  const remove = async () => {
    try { await api.del('/fees/' + del._id); toast.success('Fee record delete ho gaya.'); setRows((r) => r.filter((x) => x._id !== del._id)); }
    catch (e) { toast.error(e.message); }
    setDel(null);
  };

  return (
    <>
      <PageHead title="Payment History" subtitle="Galti se fee jama ho gayi ho to Edit ya Delete karein.">
        <Link className="btn btn-primary btn-sm" to="/fees"><Banknote size={16} />Collect Fee</Link>
      </PageHead>

      <div className="relative mb-4 lg:max-w-md">
        <Search size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" />
        <input className="input pl-11" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Student naam ya ID..." />
      </div>

      {!rows ? <ListSkeleton h="h-24" /> : (
        <>
        <div className="space-y-3 lg:hidden">
          {rows.map((p, i) => (
            <article key={p._id} className="card animate-fade-up p-3.5" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-bold">{p.student?.studentName}</div>
                  <div className="flex items-center gap-2"><span className="chip">{p.student?.studentCode}</span><span className="text-xs text-muted">{monthName(p.month)} {p.year}</span></div>
                </div>
                <span className="badge b-green">{money(p.amount)}</span>
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                <div className="min-w-0 flex-1 text-xs text-muted">
                  <div>{fmtDate(p.paymentDate)}</div>
                  {p.remarks && <div className="truncate">{p.remarks}</div>}
                </div>
                <Link className="btn-icon primary" to={`/fees/${p._id}/edit`} aria-label="Edit"><Pencil size={17} /></Link>
                <button className="btn-icon danger" onClick={() => setDel(p)} aria-label="Delete"><Trash2 size={17} /></button>
              </div>
            </article>
          ))}
          {!rows.length && <div className="card"><Empty icon={Search} text="Koi payment nahi mili." /></div>}
        </div>

        {/* ===== Laptop: table ===== */}
        <div className="card hidden overflow-hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-0 text-sm">
              <thead>
                <tr className="bg-soft text-left text-[11px] font-bold tracking-wide text-muted uppercase">
                  <th className="px-4 py-3.5">Date</th><th className="px-4 py-3.5">ID</th><th className="px-4 py-3.5">Student</th><th className="px-4 py-3.5">Fee Month</th>
                  <th className="px-4 py-3.5 text-right">Amount</th><th className="px-4 py-3.5">Remarks</th><th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => {
                  const td = 'border-b border-line/70 px-4 py-3';
                  return (
                    <tr key={p._id} className="transition-colors hover:bg-blue-600/5">
                      <td className={td + ' whitespace-nowrap'}>{fmtDate(p.paymentDate)}</td>
                      <td className={td}><span className="chip">{p.student?.studentCode}</span></td>
                      <td className={td + ' font-semibold'}>{p.student?.studentName}</td>
                      <td className={td + ' whitespace-nowrap'}>{monthName(p.month)} {p.year}</td>
                      <td className={td + ' text-right'}><span className="badge b-green">{money(p.amount)}</span></td>
                      <td className={td + ' text-muted'}>{p.remarks}</td>
                      <td className={td}>
                        <div className="flex justify-end gap-1.5">
                          <Link className="btn-icon primary size-9" to={`/fees/${p._id}/edit`} aria-label="Edit"><Pencil size={16} /></Link>
                          <button className="btn-icon danger size-9" onClick={() => setDel(p)} aria-label="Delete"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!rows.length && <Empty icon={Search} text="Koi payment nahi mili." />}
        </div>
        </>
      )}

      {del && <Confirm title="Fee record delete karein?" message={`${del.student?.studentName} ki ${monthName(del.month)} ${del.year} wali ${money(del.amount)} entry delete ho jayegi.`} onConfirm={remove} onCancel={() => setDel(null)} />}
    </>
  );
}
