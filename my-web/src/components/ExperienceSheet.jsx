import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const pad = (n) => String(n + 1).padStart(2, '0');

/**
 * Cửa sổ đen kéo từ dưới màn hình lên, hiện chi tiết một mục Experience.
 * Đóng bằng: nút X, phím Esc, hoặc click vào vùng tối phía trên.
 * `item` được giữ lại khi đóng để nội dung không biến mất giữa lúc trượt xuống.
 */
export default function ExperienceSheet({ open, item, index, total, onClose }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  // Esc để đóng + Tab chỉ xoay vòng trong cửa sổ + khoá cuộn trang phía sau
  useEffect(() => {
    if (!open) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const nodes = panelRef.current?.querySelectorAll('button, [href], [tabindex="0"]');
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
    // đợi một nhịp để visibility chuyển sang visible rồi mới focus được
    const t = setTimeout(() => closeRef.current?.focus(), 60);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  // Cuộn nội dung về đầu mỗi lần mở
  useEffect(() => {
    if (open && panelRef.current) panelRef.current.scrollTop = 0;
  }, [open, item]);

  if (!item) return null;

  // portal ra body: thoát khỏi stacking context của section nên luôn nằm trên navbar / grain
  return createPortal(
    <div className={`xs ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div className="xs-back" onClick={onClose} />

      <div
        className="xs-panel"
        role="dialog"
        aria-modal="true"
        aria-label={`${item.company} — ${item.role}`}
      >
        <span className="xs-scan" aria-hidden="true" />

        {/* thanh trạng thái trên cùng (kiểu HUD, giống Contact card) */}
        <div className="xs-bar mono">
          <span>
            EXP.{pad(index)} / {pad(total - 1)}
          </span>
          <span className="xs-live">Log open</span>
          <button ref={closeRef} type="button" className="xs-x" onClick={onClose} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
            </svg>
          </button>
        </div>

        <div className="xs-scroll" tabIndex={0}>
          <div className="xs-body">
            {/* cột trái: nhận diện công ty */}
            <header className="xs-head">
              <small className="mono xs-period xs-in" style={{ '--i': 0 }}>
                {item.period}
              </small>
              <h3 className="xs-company xs-in" style={{ '--i': 1 }}>
                {item.company}
              </h3>
              <p className="xs-role xs-in" style={{ '--i': 2 }}>
                {item.role}
              </p>
              {item.location && (
                <small className="mono xs-loc xs-in" style={{ '--i': 3 }}>
                  {item.location}
                </small>
              )}
            </header>

            {/* cột phải: nội dung chi tiết */}
            <div className="xs-content">
              {item.summary && (
                <section className="xs-sec xs-in" style={{ '--i': 3 }}>
                  <h4 className="mono xs-label">
                    <i>01</i>Overview
                  </h4>
                  <p className="xs-sum">{item.summary}</p>
                </section>
              )}

              {item.highlights?.length > 0 && (
                <section className="xs-sec xs-in" style={{ '--i': 4 }}>
                  <h4 className="mono xs-label">
                    <i>02</i>What I did
                  </h4>
                  <ol className="xs-list">
                    {item.highlights.map((h, n) => (
                      <li key={h}>
                        <span className="mono">{pad(n)}</span>
                        <p>{h}</p>
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              {item.tech?.length > 0 && (
                <section className="xs-sec xs-in" style={{ '--i': 5 }}>
                  <h4 className="mono xs-label">
                    <i>03</i>Stack
                  </h4>
                  <ul className="xs-tags">
                    {item.tech.map((t) => (
                      <li key={t} className="mono">
                        {t}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>
        </div>

        <div className="xs-foot mono">
          <span>Signal ▮▮▮▯</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
