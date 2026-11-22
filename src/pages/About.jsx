import { useState } from 'react';
import { LayoutDashboard, Users, Banknote, BarChart3, MessageCircle, ShieldCheck, Globe, Phone, Mail, Code2, Database, Server, Layers } from 'lucide-react';
import { PageHead } from '../components/ui.jsx';
import { DEV } from '../utils/developer.js';
import { waLink } from '../utils/whatsapp.js';

const features = [
  { icon: LayoutDashboard, t: 'Dashboard', d: 'Total fee, wasool hui fee, due fee, charts aur unpaid students ki follow-up list.' },
  { icon: Users, t: 'Students', d: 'Add, list, update, delete. Har student ka automatic ID (STU-0001...) aur parent ka WhatsApp number.' },
  { icon: Banknote, t: 'Fees', d: 'Mahina select karein, fee likh kar Paid dabayein. Galti ho to Edit ya Delete.' },
  { icon: BarChart3, t: 'Report', d: 'Mahine ka paid aur unpaid ka hisaab.' },
  { icon: MessageCircle, t: 'WhatsApp', d: 'Reminder aur receipt ka message tayyar hokar WhatsApp mein khul jata hai.' },
  { icon: ShieldCheck, t: 'Owner Settings', d: 'Owner ka WhatsApp number sirf username aur password dene par badalta hai.' },
];

const skills = [
  { icon: Layers, t: 'Frontend', d: 'React, Tailwind CSS' },
  { icon: Server, t: 'Backend', d: 'Node.js, Express.js, REST APIs, JWT' },
  { icon: Database, t: 'Database', d: 'MongoDB, Mongoose' },
];

export default function About() {
  const [tab, setTab] = useState('app');
  const links = [
    DEV.whatsapp && { href: waLink(DEV.whatsapp, 'Assalam o Alaikum ' + DEV.name + ','), label: 'WhatsApp', icon: MessageCircle, cls: 'bg-[#25D366]' },
    DEV.phone && { href: 'tel:' + DEV.phone, label: 'Call', icon: Phone, cls: 'bg-blue-600' },
    DEV.email && { href: 'mailto:' + DEV.email, label: 'Email', icon: Mail, cls: 'bg-amber-500' },
  ].filter(Boolean);
  return (
    <div>
      <PageHead title="About" subtitle="Project ki tafseel" />

      {/* Mobile tabs: About App | About Developer */}
      <div className="mb-4 grid grid-cols-2 rounded-2xl border border-line bg-surface p-1 sm:hidden">
        {[['app', 'About App'], ['dev', 'About Developer']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={'rounded-xl py-2.5 text-sm font-semibold transition duration-300 ' + (tab === k ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/35' : 'text-muted')}>{l}</button>
        ))}
      </div>

      <div className={(tab === 'app' ? '' : 'hidden ') + 'sm:block'}>
      <div className="space-y-4 lg:grid lg:grid-cols-12 lg:items-start lg:gap-5 lg:space-y-0">
      <div className="space-y-4 lg:col-span-8">
      <section className="card animate-fade-up p-4 lg:p-6">
        <h3 className="text-lg font-bold text-head">The Harvard Academy - Fee Manager</h3>
        <p className="mt-1.5 text-sm text-muted">Ye academy / tuition center ke liye students ki fee manage karne ka web software hai. Isse students add karna, monthly fee jama karna, baqaya (due) fee dekhna aur parents ko WhatsApp par fee ka message bhejna asaan ho jata hai.</p>
      </section>

      <section className="card divide-y divide-line/70 overflow-hidden animate-fade-up" style={{ animationDelay: '70ms' }}>
        {features.map(({ icon: Icon, t, d }) => (
          <div key={t} className="flex gap-3 px-4 py-3.5">
            <span className="inline-flex size-10 flex-none items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-cyan-500 text-white"><Icon size={18} /></span>
            <div className="min-w-0"><div className="font-semibold">{t}</div><div className="text-[13px] text-muted">{d}</div></div>
          </div>
        ))}
      </section>
      </div>

      <div className="space-y-4 lg:col-span-4">
      <section className="card animate-fade-up p-4 lg:p-5" style={{ animationDelay: '140ms' }}>
        <h4 className="mb-1.5 font-semibold text-head">Fee ka hisaab kaise hota hai</h4>
        <p className="text-sm text-muted">Admission ke mahine se aaj ke mahine tak har mahine ki monthly fee banti hai. <b className="text-ink">Due = (mahine x monthly fee) - jama ki hui fee.</b> Ek mahine ki fee kai qiston mein bhi jama ho sakti hai, lekin mahine ki fee se zyada nahi.</p>
      </section>

      <section className="card animate-fade-up p-4 lg:p-5" style={{ animationDelay: '210ms' }}>
        <h4 className="mb-1.5 font-semibold text-head">Technology (MERN)</h4>
        <ul className="list-disc space-y-0.5 pl-5 text-sm text-muted">
          <li>MongoDB Atlas + Mongoose</li>
          <li>Express.js + Node.js</li>
          <li>React (Vite) + Tailwind CSS + Chart.js</li>
          <li>JWT login (httpOnly cookie)</li>
        </ul>
        <div className="mt-3 text-xs text-muted">Version 1.1 · &copy; {new Date().getFullYear()} The Harvard Academy</div>
      </section>
      </div>
      </div>
      </div>

      <div className={(tab === 'dev' ? '' : 'hidden ') + 'mt-0 sm:mt-4 sm:block'}>
        <section className="card animate-fade-up p-4 lg:p-6">
          <div className="flex items-center gap-4">
            <span className="inline-flex size-16 flex-none items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-cyan-500 text-2xl font-bold text-white">{DEV.name.split(' ').map((w) => w[0]).join('')}</span>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-head">{DEV.name}</h3>
              <div className="flex items-center gap-1.5 text-sm text-muted"><Code2 size={15} className="text-blue-600" />{DEV.role}</div>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted">Is software ko {DEV.name} ne design aur develop kiya hai. Frontend se le kar backend aur database tak poora project (MERN stack) ek hi developer ne banaya hai.</p>

          <div className="mt-4 divide-y divide-line/70 overflow-hidden rounded-xl border border-line/70">
            {skills.map(({ icon: Icon, t, d }) => (
              <div key={t} className="flex items-center gap-3 px-3 py-2.5">
                <span className="inline-flex size-9 flex-none items-center justify-center rounded-lg bg-blue-600/10 text-blue-600"><Icon size={17} /></span>
                <div className="min-w-0"><div className="text-sm font-semibold">{t}</div><div className="text-[13px] text-muted">{d}</div></div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <a href={DEV.portfolio} target="_blank" rel="noreferrer" className="btn bg-blue-600 text-white shadow-lg shadow-blue-600/30"><Globe size={17} /> View Portfolio</a>
            {links.map(({ href, label, icon: Icon, cls }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" className={'btn text-white ' + cls}><Icon size={17} /> {label}</a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
