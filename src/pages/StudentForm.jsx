import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Check, Phone } from 'lucide-react';
import { api } from '../api.js';
import { Field, ListSkeleton, PageHead } from '../components/ui.jsx';
import { toInputDate } from '../utils/format.js';

const empty = { studentName: '', parentName: '', parentWhatsApp: '', className: '', monthlyFee: '', admissionDate: toInputDate(new Date()), isActive: true };

export default function StudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [f, setF] = useState(empty);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(!!id);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get('/students/' + id).then((s) => {
      setCode(s.studentCode);
      setF({ studentName: s.studentName, parentName: s.parentName, parentWhatsApp: s.parentWhatsApp, className: s.className, monthlyFee: s.monthlyFee, admissionDate: toInputDate(s.admissionDate), isActive: s.isActive });
    }).catch((e) => toast.error(e.message)).finally(() => setLoading(false));
  }, [id]);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (id) await api.put('/students/' + id, f);
      else await api.post('/students', f);
      toast.success(id ? 'Student update ho gaya.' : 'Student add ho gaya.');
      navigate('/students');
    } catch (err) { toast.error(err.message); }
    setBusy(false);
  };

  if (loading) return <ListSkeleton rows={3} h="h-24" />;

  return (
    <>
      <PageHead title={id ? 'Edit Student' : 'Add Student'} subtitle={id ? 'Student ID change nahi hoti.' : 'Student ID (STU-0001...) khud ban jayegi.'} />
      <form className="card space-y-4 p-4 lg:grid lg:max-w-3xl lg:grid-cols-2 lg:gap-5 lg:space-y-0 lg:p-6" onSubmit={submit}>
        {id && <Field label="Student ID"><input className="input" value={code} readOnly /></Field>}
        <Field label="Student Name"><input className="input" value={f.studentName} onChange={set('studentName')} maxLength={100} autoComplete="off" required /></Field>
        <Field label="Parent / Father Name"><input className="input" value={f.parentName} onChange={set('parentName')} maxLength={100} autoComplete="off" required /></Field>
        <Field label="Parent WhatsApp Number">
          <div className="relative">
            <Phone size={17} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" />
            <input className="input pl-11" type="tel" inputMode="tel" value={f.parentWhatsApp} onChange={set('parentWhatsApp')} placeholder="0300 1234567" required />
          </div>
        </Field>
        <div className="grid grid-cols-2 gap-3 lg:contents">
          <Field label="Class"><input className="input" value={f.className} onChange={set('className')} placeholder="Class 5" maxLength={50} required /></Field>
          <Field label="Monthly Fee"><input className="input" type="number" inputMode="decimal" min="1" step="0.01" value={f.monthlyFee} onChange={set('monthlyFee')} required /></Field>
        </div>
        <Field label="Admission Date"><input className="input" type="date" value={f.admissionDate} onChange={set('admissionDate')} required /></Field>

        <label className="flex cursor-pointer items-center justify-between rounded-xl bg-soft px-4 py-3 select-none lg:col-span-2">
          <span className="text-sm font-medium">Active (fee dene wala)</span>
          <span className="relative inline-flex h-7 w-12 items-center">
            <input type="checkbox" className="peer sr-only" checked={f.isActive} onChange={set('isActive')} />
            <span className="absolute inset-0 rounded-full bg-line transition-colors duration-300 peer-checked:bg-blue-600" />
            <span className="absolute left-0.5 size-6 rounded-full bg-white shadow transition-transform duration-300 peer-checked:translate-x-5" />
          </span>
        </label>

        <div className="grid grid-cols-3 gap-3 pt-1 lg:col-span-2 lg:flex lg:justify-end">
          <button type="button" className="btn btn-outline h-12 lg:w-36" onClick={() => navigate(-1)}>Cancel</button>
          <button className="btn btn-primary col-span-2 h-12 lg:w-44" disabled={busy}><Check size={18} />{busy ? 'Saving...' : id ? 'Update' : 'Save'}</button>
        </div>
      </form>
    </>
  );
}
