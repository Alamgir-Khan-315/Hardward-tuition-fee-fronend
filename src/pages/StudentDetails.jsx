import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Pencil, Trash2, MessageCircle, CheckCircle2, MessagesSquare, Phone, GraduationCap, CalendarDays } from 'lucide-react';
import { api } from '../api.js';
import { useApp } from '../context.jsx';
import { Avatar, Confirm, Empty, ListSkeleton, MonthSelect } from '../components/ui.jsx';
import { money, monthName, fmtDate } from '../utils/format.js';
import { reminderLink, receiptLink, chatLink } from '../utils/whatsapp.js';

export default function StudentDetails() {
  const { id } = useParams();
  const { config } = useApp();
  const [s, setS] = useState(null);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [del, setDel] = useState(null);
  const now = new Date();
  const [form, setForm] = useState({ month: now.getMonth() + 1, year: now.getFullYear(), amount: '', remarks: '' });
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api.get('/students/' + id).then((d) => {
      setS(d);
      setForm((f) => (f.amount === '' ? { ...f, amount: d.monthlyFee } : f));
    }).catch((e) => setError(e.message));
  }, [id]);
  useEffect(load, [load]);

  const pay = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await api.post('/fees/pay', { studentId: id, ...form });
      toast.success(`${money(r.payment.amount)} fee jama ho gayi.`);
      setReceipt(receiptLink(r.student, r.payment, r.monthBalance, config));
      load();
    } catch (err) { toast.error(err.message); }
    setBusy(false);
  };

  const removePayment = async () => {
    try { await api.del('/fees/' + del._id); toast.success('Fee record delete ho gaya.'); load(); }
    catch (e) { toast.error(e.message); }
    setDel(null);
  };

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!s) return <ListSkeleton rows={3} h="h-40" />;
  const sum = s.summary;

  return (
    <div className="space-y-4 lg:grid lg:grid-cols-12 lg:items-start lg:gap-5 lg:space-y-0">
      {receipt && (
        <div className="alert alert-success animate-pop !mb-0 lg:col-span-12">
          <CheckCircle2 size={18} /> Fee jama ho gayi.
          <a className="btn btn-wa btn-sm ml-auto" target="_blank" rel="noreferrer" href={receipt}><MessageCircle size={15} />WhatsApp receipt</a>
        </div>
      )}

      {/* Profile */}
      <section className="card animate-fade-up p-4 lg:col-span-5 lg:p-5">
        <div className="flex items-center gap-3">
          <Avatar name={s.studentName} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-lg font-bold text-head">{s.studentName}</div>
            <div className="flex items-center gap-2"><span className="chip">{s.studentCode}</span>{s.isActive ? <span className="badge b-green !py-0.5">Active</span> : <span className="badge b-gray !py-0.5">Inactive</span>}</div>
          </div>
          <Link className="btn-icon primary" to={`/students/${id}/edit`} aria-label="Edit"><Pencil size={17} /></Link>
        </div>
        <dl className="mt-4 space-y-2.5 text-sm">
          <div className="flex items-center gap-3"><Phone size={16} className="flex-none text-muted" /><dt className="w-20 flex-none text-muted">Parent</dt><dd className="min-w-0 truncate font-medium">{s.parentName} · {s.parentWhatsApp}</dd></div>
          <div className="flex items-center gap-3"><GraduationCap size={16} className="flex-none text-muted" /><dt className="w-20 flex-none text-muted">Class</dt><dd className="font-medium">{s.className} · {money(s.monthlyFee)}/mahina</dd></div>
          <div className="flex items-center gap-3"><CalendarDays size={16} className="flex-none text-muted" /><dt className="w-20 flex-none text-muted">Admission</dt><dd className="font-medium">{fmtDate(s.admissionDate)}</dd></div>
        </dl>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <a className="btn btn-wa" target="_blank" rel="noreferrer" href={reminderLink(s, sum.due, config)}><MessageCircle size={17} />Fee Reminder</a>
          <a className="btn btn-outline" target="_blank" rel="noreferrer" href={chatLink(s, config)}><MessagesSquare size={17} />Chat</a>
        </div>
      </section>

      {/* Hisaab */}
      <section className="card animate-fade-up p-4 lg:col-span-7 lg:p-5" style={{ animationDelay: '70ms' }}>
        <h4 className="mb-3 font-semibold text-head">Fee ka hisaab</h4>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="min-w-0 rounded-xl bg-soft px-1.5 py-2.5"><div className="truncate text-[11px] text-muted">Total ({sum.months} mahine)</div><div className="mt-0.5 truncate text-[14px] font-bold">{money(sum.totalFee)}</div></div>
          <div className="min-w-0 rounded-xl bg-green-600/10 px-1.5 py-2.5"><div className="text-[11px] text-muted">Paid</div><div className="mt-0.5 truncate text-[14px] font-bold text-green-600">{money(sum.paid)}</div></div>
          <div className="min-w-0 rounded-xl bg-red-500/10 px-1.5 py-2.5"><div className="text-[11px] text-muted">Due</div><div className="mt-0.5 truncate text-[14px] font-bold text-red-500">{money(sum.due)}</div></div>
        </div>

        <h4 className="mt-5 mb-3 font-semibold text-head">Fee jama karein</h4>
        <form onSubmit={pay} className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
          <div className="grid grid-cols-5 gap-3">
            <MonthSelect className="col-span-3" value={form.month} onChange={(month) => setForm({ ...form, month })} />
            <input className="input col-span-2" type="number" inputMode="numeric" min="2000" max="2100" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} aria-label="Year" />
          </div>
          <input className="input" type="number" inputMode="decimal" min="1" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Amount" required />
          <input className="input" placeholder="Remarks (optional)" maxLength={200} value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
          <button className="btn btn-success h-12 w-full" disabled={busy}><CheckCircle2 size={18} />{busy ? 'Please wait...' : 'Paid'}</button>
        </form>
      </section>

      {/* History */}
      <section className="animate-fade-up lg:col-span-12" style={{ animationDelay: '140ms' }}>
        <h4 className="mb-2.5 font-semibold text-head">Payment History</h4>
        <div className="card divide-y divide-line/70 overflow-hidden">
          {s.payments.map((p) => (
            <div key={p._id} className="flex items-center gap-3 px-3.5 py-3">
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{monthName(p.month)} {p.year}</div>
                <div className="truncate text-xs text-muted">{fmtDate(p.paymentDate)}{p.remarks ? ' · ' + p.remarks : ''}</div>
              </div>
              <span className="badge b-green">{money(p.amount)}</span>
              <Link className="btn-icon primary size-9" to={`/fees/${p._id}/edit`} aria-label="Edit"><Pencil size={15} /></Link>
              <button className="btn-icon danger size-9" onClick={() => setDel(p)} aria-label="Delete"><Trash2 size={15} /></button>
            </div>
          ))}
          {!s.payments.length && <Empty text="Abhi koi fee jama nahi hui." />}
        </div>
      </section>

      {del && <Confirm title="Fee record delete karein?" message={`${monthName(del.month)} ${del.year} ki ${money(del.amount)} wali entry delete ho jayegi.`} onConfirm={removePayment} onCancel={() => setDel(null)} />}
    </div>
  );
}
