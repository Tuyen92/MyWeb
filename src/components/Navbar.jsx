import { useEffect, useRef, useState } from 'react';

export default function Navbar({ name, links, onContact }) {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);

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
      <span>{name}</span>

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
        <span className="dot" />
      </div>
    </nav>
  );
}
