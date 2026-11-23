import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const pad = (n) => String(n + 1).padStart(2, '0');

/**
 * Hồ sơ nhân sự (cùng nội dung với ProfileCard) nhưng thiết kế theo cửa sổ Experience:
 * kéo từ dưới màn hình lên, full màn hình, dùng lại các class xs-* trong index.css.
 * Đóng bằng: nút X, phím Esc, hoặc click vào vùng tối phía trên.
 */
export default function ProfileSheet({ open, onClose, profile }) {
  const panelRef = useRef(null);
  const scrollRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const nodes = panelRef.current?.querySelectorAll('button:not([disabled]), [href], [tabindex="0"]');
      if (!nodes || !nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    const t = setTimeout(() => closeRef.current?.focus(), 60);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  // Cuộn về đầu mỗi lần mở
  useEffect(() => {
    if (open && scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [open]);

  const { name, alias, photo, status, stats = [], languages = [], cv, intro } = profile;
  const employed = status !== 'unemployed';

  // CV nằm ở domain khác (R2) nên thuộc tính `download` của <a> bị trình duyệt bỏ qua.
  // Tải file về dạng blob rồi mới cho tải xuống; nếu lỗi (vd chưa bật CORS) thì mở file ở tab mới.
  const downloadCv = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(cv.file);
      if (!res.ok) throw new Error('bad status');
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement('a');
      a.href = url;
      a.download = cv.downloadName || 'CV.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      window.open(cv.file, '_blank', 'noopener');
    }
  };

  return createPortal(
    <div className={`xs ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div className="xs-back" onClick={onClose} />

      <div className="xs-panel" ref={panelRef} role="dialog" aria-modal="true" aria-label={`${name} profile`}>
        <span className="xs-scan" aria-hidden="true" />

        <div className="xs-bar mono">
          <span className={`pc-status mono ${employed ? 'is-employed' : 'is-unemployed'}`}>
            <i /> STATUS: {employed ? 'EMPLOYED' : 'UNEMPLOYED'}
          </span>
          <div className="xs-nav" />
          <button ref={closeRef} type="button" className="xs-x" onClick={onClose} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
            </svg>
          </button>
        </div>

        <div className="xs-scroll" tabIndex={0} ref={scrollRef}>
          <div className="xs-body">
            <div className="xs-top">
              <header className="xs-head">
                <div className="xs-head-l">
                  <h3 className="xs-company xs-in" style={{ '--i': 1 }}>
                    {name}
                  </h3>
                  <small className="mono xs-period xs-in" style={{ '--i': 0 }}>
                    {alias}
                  </small>
                </div>
              </header>
            </div>

            {/* 2 cột: trái = avatar + mã vạch (CV) + status, phải = danh sách 01 → 06 */}
            <section className="xs-sec xs-in xs-pf" style={{ '--i': 3 }}>
              <aside className="xs-pf-id">
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
                  <a className="pc-cv" href={cv.file} download={cv.downloadName || true} onClick={downloadCv} aria-label={`Download ${cv.label || 'CV'}`}>
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
              </aside>

              <div className="xs-pf-main">
                {intro && <p className="xs-sum xs-pf-intro">{intro}</p>}

              {/* 2 cột, xếp theo hàng: 01 02 / 03 04 / 05 06 */}
              <ul className="xs-pf-grid">
                {stats.map((s, k) => (
                  <li key={s.label} className="xs-pf-cell">
                    <span className="mono xs-pf-l">
                      <i>{pad(k)}</i>
                      {s.label}
                    </span>
                    <h5 className="xs-ach-t">{s.value}</h5>
                    {s.lines && <p className="xs-ach-d">{s.lines}</p>}
                    {s.period && <p className="xs-ach-d">{s.period}</p>}
                  </li>
                ))}
                {languages.length > 0 && (
                  <li className="xs-pf-cell">
                    <span className="mono xs-pf-l">
                      <i>{pad(stats.length)}</i>
                      Languages
                    </span>
                    <ul className="pc-abil xs-pf-lang">
                      {languages.map((a) => (
                        <li key={a.name}>
                          <h5 className="xs-ach-t">{a.name}</h5>
                          <span className="pc-pips" aria-label={`${a.level} / 5`}>
                            {[1, 2, 3, 4, 5].map((p) => (
                              <i key={p} className={p <= a.level ? 'on' : ''} />
                            ))}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </li>
                )}
              </ul>
              </div>
            </section>
          </div>
        </div>

        <div className="xs-foot mono" />
      </div>
    </div>,
    document.body
  );
}
