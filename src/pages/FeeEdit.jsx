import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Check } from 'lucide-react';
import { api } from '../api.js';
import { Field, ListSkeleton, MonthSelect, PageHead } from '../components/ui.jsx';
import { money, toInputDate } from '../utils/format.js';

export default function FeeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [p, setP] = useState(null);
  const [f, setF] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get('/fees/' + id).then((d) => {
      setP(d);
      setF({ month: d.month, year: d.year, amount: d.amount, paymentDate: toInputDate(d.paymentDate), remarks: d.remarks || '' });
    }).catch((e) => toast.error(e.message));
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.put('/fees/' + id, f);
      toast.success('Fee record update ho gaya.');
      navigate(-1);
    } catch (err) { toast.error(err.message); }
    setBusy(false);
  };

  if (!f) return <ListSkeleton rows={2} h="h-40" />;
  return (
    <>
      <PageHead title="Edit Fee" subtitle={`${p.student?.studentName} (${p.student?.studentCode}) · Monthly fee ${money(p.student?.monthlyFee)}`} />
      <form className="card space-y-4 p-4 lg:max-w-2xl lg:p-6" onSubmit={submit}>
        <div className="grid grid-cols-5 gap-3">
          <Field label="Month" className="col-span-3"><MonthSelect value={f.month} onChange={(month) => setF({ ...f, month })} /></Field>
          <Field label="Year" className="col-span-2"><input className="input" type="number" inputMode="numeric" min="2000" max="2100" value={f.year} onChange={(e) => setF({ ...f, year: e.target.value })} /></Field>
        </div>
        <Field label="Amount"><input className="input" type="number" inputMode="decimal" min="1" step="0.01" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} required /></Field>
        <Field label="Payment Date"><input className="input" type="date" value={f.paymentDate} onChange={(e) => setF({ ...f, paymentDate: e.target.value })} required /></Field>
        <Field label="Remarks"><input className="input" maxLength={200} value={f.remarks} onChange={(e) => setF({ ...f, remarks: e.target.value })} /></Field>
        <div className="grid grid-cols-3 gap-3 pt-1 lg:flex lg:justify-end">
          <button type="button" className="btn btn-outline h-12 lg:w-36" onClick={() => navigate(-1)}>Cancel</button>
          <button className="btn btn-primary col-span-2 h-12 lg:w-44" disabled={busy}><Check size={18} />{busy ? 'Saving...' : 'Update'}</button>
        </div>
      </form>
    </>
  );
}
