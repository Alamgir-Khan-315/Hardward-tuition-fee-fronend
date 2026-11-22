import { money, monthName, fmtDate } from './format.js';

// 0300... -> 92300...  (mulk ka code config se)
export function normalize(number, cc = '92') {
  let d = String(number || '').replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  else if (d.startsWith('0')) d = cc + d.slice(1);
  return d;
}

export const waLink = (number, message, cc) =>
  `https://api.whatsapp.com/send?phone=${normalize(number, cc)}&text=${encodeURIComponent(message)}`;

const footer = (cfg) => `\n\n${cfg.academyName}${cfg.academyPhone ? '\nContact: ' + cfg.academyPhone : ''}`;

export const reminderLink = (s, due, cfg) =>
  waLink(
    s.parentWhatsApp,
    `Assalam o Alaikum ${s.parentName},\n${s.studentName} ki tuition fee ${money(due)} baqaya hai.\nMeherbani karke jald fee ada karein. Shukriya.` + footer(cfg),
    cfg.countryCode
  );

export const receiptLink = (s, p, monthBalance, cfg) =>
  waLink(
    s.parentWhatsApp,
    `Assalam o Alaikum ${s.parentName},\n${s.studentName} ki ${monthName(p.month)} ${p.year} ki fee ${money(p.amount)} ${fmtDate(p.paymentDate)} ko wasool hui.\n` +
      (monthBalance > 0 ? `Is mahine ki baqaya fee: ${money(monthBalance)}.\n` : 'Is mahine ki fee mukammal ada ho gayi hai.\n') +
      'Shukriya.' + footer(cfg),
    cfg.countryCode
  );

export const chatLink = (s, cfg) => waLink(s.parentWhatsApp, `Assalam o Alaikum ${s.parentName},`, cfg.countryCode);
