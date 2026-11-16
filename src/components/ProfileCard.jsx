import { useCallback, useEffect, useRef, useState } from 'react';

const KEEP = 80; // số px tối thiểu của thẻ phải còn nằm trong màn hình

/**
 * Hồ sơ nhân sự kiểu "Guardians of the Galaxy": cửa sổ nổi, kéo được, đóng bằng nút X / Esc.
 * Dùng chung style với ContactCard (class cc-*), thêm layout riêng (class pc-*).
 * Toàn bộ nội dung lấy từ props (xem CONFIG.profile trong config.js).
 */
export default function ProfileCard({ open, onClose, profile }) {
  const wrapRef = useRef(null);
  const closeRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const drag = useRef(null);
  const [dragging, setDragging] = useState(false);

  const moveTo = useCallback((x, y) => {
    const el = wrapRef.current;
    if (!el) return;
    const w = el.offsetWidth;
    const nx = Math.min(window.innerWidth - KEEP, Math.max(KEEP - w, x));
    const ny = Math.min(window.innerHeight - KEEP, Math.max(0, y));
    pos.current = { x: nx, y: ny };
    el.style.transform = `translate3d(${nx}px, ${ny}px, 0)`;
  }, []);

  // Mỗi lần mở: đặt thẻ giữa màn hình
  useEffect(() => {
    if (!open) return;
    const el = wrapRef.current;
    if (!el) return;
    const x = Math.max(8, (window.innerWidth - el.offsetWidth) / 2);
    const y = Math.max(8, (window.innerHeight - el.offsetHeight) / 2);
    moveTo(x, y);
    const t = setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 80);
    return () => clearTimeout(t);
  }, [open, moveTo]);

  // Esc + giữ thẻ trong màn hình khi đổi kích thước cửa sổ
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
    // phần nội dung cuộn được thì không kéo thẻ (để cuộn / chọn link)
    if (e.target.closest('a, button, .pc-body')) return;
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

  const { name, alias, id, photo, status, stats, languages, cv } = profile;
  const employed = status !== 'unemployed';

  return (
    <div className={`cc pc ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div className="cc-pos" ref={wrapRef}>
        <div
          className={`cc-card pc-card ${dragging ? 'dragging' : ''}`}
          role="dialog"
          aria-label={`${name} profile`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <span className="cc-scan" aria-hidden="true" />

          <div className="cc-bar mono">
            <span className="cc-live">PERSONNEL FILE</span>
            <span className="pc-fileno">{id}</span>
          </div>

          <button ref={closeRef} type="button" className="cc-x" onClick={onClose} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
            </svg>
          </button>

          <div className="pc-body">
            <div className="pc-top">
              {/* ảnh chân dung + mã vạch */}
              <div className="pc-id">
                <div className="pc-photo">
                  {photo ? (
                    <img src={photo} alt="" draggable="false" />
                  ) : (
                    <svg viewBox="0 0 120 160" aria-hidden="true">
                      <circle cx="60" cy="58" r="24" />
                      <path d="M12 160c0-34 22-54 48-54s48 20 48 54z" />
                    </svg>
                  )}
                </div>
                {cv?.file ? (
                  <a
                    className="pc-cv"
                    href={cv.file}
                    download={cv.downloadName || true}
                    aria-label={`Download ${cv.label || 'CV'}`}
                  >
                    <span className="pc-barcode" aria-hidden="true" />
                    <span className="pc-cv-label mono">
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M6 1v7M3 5.5L6 8.5l3-3M1.5 11h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
                      </svg>
                      {cv.label || 'CV'}
                    </span>
                  </a>
                ) : (
                  <div className="pc-barcode" aria-hidden="true" />
                )}
                <div className={`pc-status mono ${employed ? 'is-employed' : 'is-unemployed'}`}>
                  <i /> STATUS: {employed ? 'EMPLOYED' : 'UNEMPLOYED'}
                </div>
              </div>

              {/* tên + bảng thông tin */}
              <div className="pc-main">
                <h3 className="cc-h3 pc-name">{name}</h3>
                <p className="pc-aka mono">
                  AKA <b>“{alias}”</b>
                </p>
                <div className="pc-stats">
                  {stats.map((s, n) => (
                    <div className="cc-item" key={s.label}>
                      <span className="cc-l">
                        <i>{String(n + 1).padStart(2, '0')}</i>
                        {s.label}
                      </span>
                      <span className="cc-v">{s.value}</span>
                      <span className="cc-v">{s.lines}</span>
                      {s.period && <span className="cc-v pc-period">{s.period}</span>}
                    </div>
                  ))}

                  {/* 06 — Languages */}
                  <div className="cc-item pc-lang">
                    <span className="cc-l">
                      <i>{String(stats.length + 1).padStart(2, '0')}</i>
                      Languages
                    </span>
                    <ul className="pc-abil">
                      {languages.map((a) => (
                        <li key={a.name}>
                          <span className="cc-v">{a.name}</span>
                          <span className="pc-pips" aria-label={`${a.level} / 5`}>
                            {[1, 2, 3, 4, 5].map((p) => (
                              <i key={p} className={p <= a.level ? 'on' : ''} />
                            ))}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="cc-foot mono">
            <span>Drag to move</span>
            <span>Esc to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
