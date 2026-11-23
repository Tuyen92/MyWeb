import { useEffect, useRef, useState } from 'react';

// Giờ Việt Nam (UTC+7) bất kể máy người xem đang ở múi giờ nào
const fmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Ho_Chi_Minh',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});
const vnTime = () => fmt.format(new Date());

export default function Navbar({ name, links, onContact }) {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const [time, setTime] = useState(vnTime);

  // chỉ setState khi chuỗi HH:MM đổi, nên thực tế chỉ render lại mỗi phút
  useEffect(() => {
    const id = setInterval(() => setTime(vnTime()), 1000);
    return () => clearInterval(id);
  }, []);

  // Menu "=" (tablet/phone): đóng khi nhấn Esc hoặc chạm ra ngoài navbar
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onDown = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  return (
    <nav className="mono" ref={navRef}>
      <a
        href="#top"
        className="nav-name"
        onClick={(e) => {
          e.preventDefault();
          setOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        {name}
      </a>

      <span className="nav-time">
        HCMC, Vietnam - <time dateTime={time}>{time}</time>
      </span>

      <button
        type="button"
        className="nav-toggle"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="nav-links"
        onClick={() => setOpen((v) => !v)}
      >
        <i />
        <i />
      </button>

      <div className={`links ${open ? 'open' : ''}`} id="nav-links">
        {links.map((n) =>
          n === 'Contact' ? (
            <a
              key={n}
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                onContact();
              }}
            >
              {n}
            </a>
          ) : (
            <a key={n} href={`#${n.toLowerCase()}`} onClick={() => setOpen(false)}>
              {n}
            </a>
          )
        )}
        <span>✦</span>
      </div>
    </nav>
  );
}
