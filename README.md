# The Harvard Academy - Fee Manager (Mobile UI)

Mobile-first UI, Tailwind CSS v4, animated, zoom band.

## Chalane ka tareeqa
```bash
npm install
npm run dev        # PC par: http://localhost:5173
```
Phone par test: PC aur phone same WiFi par hon, phir phone me `http://<PC-ka-IP>:5173`
(server ko bhi chalta rakhein, port 5000).

Build: `npm run build`

## Mobile aur Laptop
- Phone (1024px se chhoti screen): neeche floating nav, cards, floating Add button
- Laptop (1024px+): left sidebar (menu button se chhupa sakte hain), upar search + date + day/night, tables, multi-column dashboard

## Kya badla
- Tailwind CSS v4 (`@tailwindcss/vite`), purani custom CSS hata di gayi
- Neeche floating animated nav (Home / Student / Fee / Report / About), upar header (logo, title, dark mode, logout)
- Sab tables ki jagah mobile cards, floating "Add" button, neeche se aane wali delete confirm sheet
- No zoom: viewport `user-scalable=no`, `touch-action: manipulation`, inputs 16px, iPhone pinch-zoom JS se band
- Animations: page fade-up, cards stagger, numbers count-up, loading skeletons, nav pill slide
- Keyboard khulne par nav chhup jata hai
- Dark mode pehle jaisa (day/night button)
- "Add to Home Screen" par full-screen app (manifest + icons)

API / backend / logic bilkul nahi badla.
