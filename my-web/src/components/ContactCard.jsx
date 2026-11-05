import { useCallback, useEffect, useRef, useState } from 'react';

const KEEP = 80; // số px tối thiểu của thẻ phải còn nằm trong màn hình

/** Thẻ visit nổi trên trang: draggable, close with  button or Esc */
export default function ContactCard({ open, onClose, heading, items, avatar }) {
  const wrapRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const drag = useRef(null);
  const [dragging, setDragging] = useState(false);

  /** Handle card not drag over the screen */
  const moveTo = useCallback((x, y) => {
    const el = wrapRef.current;
    if (!el) return;
    const w = el.offsetWidth;
    // const h = el.offsetHeight;
    const nx = Math.min(window.innerWidth - KEEP, Math.max(KEEP - w, x));
    const ny = Math.min(window.innerHeight - KEEP, Math.max(0, y));
    pos.current = { x: nx, y: ny };
    el.style.transform = `translate3d(${nx}px, ${ny}px, 0)`;
  }, []);

  // Evertime open: place card in the middle of the screen
  useEffect(() => {
    if (!open) return;
    const el = wrapRef.current;
    if (!el) return;
    const x = (window.innerWidth - el.offsetWidth) / 2;
    const y = window.innerHeight - el.offsetHeight - 20;
    moveTo(x, y);
  }, [open, moveTo]);

  // Phím Esc + giữ thẻ trong màn hình khi đổi kích thước cửa sổ
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const onResize = () => moveTo(pos.current.x, pos.current.y);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open, onClose, moveTo]);

  const onPointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    if (e.target.closest('a, button')) return;
    drag.current = { dx: e.clientX - pos.current.x, dy: e.clientY - pos.current.y };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };

  const onPointerMove = (e) => {
    if (!drag.current) return;
    moveTo(e.clientX - drag.current.dx, e.clientY - drag.current.dy);
  };

  const endDrag = (e) => {
    if (!drag.current) return;
    drag.current = null;
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setDragging(false);
  };

  return (
    <div className={`cc ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div className="cc-pos" ref={wrapRef}>
        <div
          className={`cc-card ${dragging ? 'dragging' : ''}`}
          role="dialog"
          aria-label={heading}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >

          {/* thanh trạng thái trên cùng (kiểu HUD) */}
          <div className="cc-bar mono">
            <span>FIG.03</span>
            <span className="cc-live">Channel open</span>
          </div>

          <button type="button" className="cc-x" onClick={onClose} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
            </svg>
          </button>

          <h3 className="cc-h3">{heading}</h3>

          <div className="cc-grid">
            {items.map((it, n) => (
              <div className="cc-item" key={it.label}>
                <span className="cc-l">
                  <i>{String(n + 1).padStart(2, '0')}</i>
                  {it.label}
                </span>
                {it.lines.map((l) =>
                  l.href ? (
                    <a key={l.text} className="cc-v" href={l.href} target="_blank" rel="noreferrer">
                      {l.text}
                    </a>
                  ) : (
                    <span key={l.text} className="cc-v">
                      {l.text}
                    </span>
                  )
                )}
              </div>
            ))}
          </div>

          <div className="cc-foot mono">
            <span>Drag to move</span>
          </div>

          {avatar && <img className="cc-avatar" src={avatar} alt="" draggable="false" />}
        </div>
      </div>
    </div>
  );
}
