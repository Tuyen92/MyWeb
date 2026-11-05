import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const pad = (n) => String(n + 1).padStart(2, '0');

/**
 * Cửa sổ đen kéo từ dưới màn hình lên (full màn hình), hiện chi tiết một mục Experience.
 * Đóng bằng: nút X, phím Esc, hoặc click vào vùng tối phía trên.
 * `item` được giữ lại khi đóng để nội dung không biến mất giữa lúc trượt xuống.
 */
export default function ExperienceSheet({ open, item, index, total, items, onClose, onNavigate }) {
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
      if (e.key === 'ArrowRight' && index < total - 1) {
        onNavigate(index + 1);
        return;
      }
      if (e.key === 'ArrowLeft' && index > 0) {
        onNavigate(index - 1);
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
  }, [open, onClose, onNavigate, index, total]);

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
          <div className="xs-nav">
            <button
              type="button"
              className="xs-navbtn"
              onClick={() => onNavigate(index - 1)}
              disabled={index <= 0}
              aria-label="Previous company"
            >
              <span aria-hidden="true">←</span>
              <span className="xs-navtxt">Prev{index > 0 && items?.[index - 1] ? ` · ${items[index - 1].company}` : ''}</span>
            </button>
            <button
              type="button"
              className="xs-navbtn"
              onClick={() => onNavigate(index + 1)}
              disabled={index >= total - 1}
              aria-label="Next company"
            >
              <span className="xs-navtxt">Next{index < total - 1 && items?.[index + 1] ? ` · ${items[index + 1].company}` : ''}</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
          <span className="xs-live">Log open</span>
          <button ref={closeRef} type="button" className="xs-x" onClick={onClose} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
            </svg>
          </button>
        </div>

        <div className="xs-scroll" tabIndex={0}>
          {/* key theo index: đổi công ty thì nội dung mount lại và chạy lại hiệu ứng hiện ra */}
          <div className="xs-body" key={index}>
            {/* hàng trên: nhận diện công ty (trái) + overview (phải) */}
            <div className="xs-top">
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

              {item.summary && (
                <section className="xs-sec xs-in" style={{ '--i': 3 }}>
                  <h4 className="mono xs-label">
                    <i>01</i>Overview
                  </h4>
                  <p className="xs-sum">{item.summary}</p>
                </section>
              )}
            </div>

            {/* What I did: full ngang, chia theo dự án */}
            {item.projects?.length > 0 && (
              <section className="xs-sec xs-in" style={{ '--i': 4 }}>
                <h4 className="mono xs-label">
                  <i>02</i>What I did
                </h4>
                <div className="xs-projects">
                  {item.projects.map((pj, n) => (
                    <article className="xs-proj" key={pj.name}>
                      <header className="xs-proj-head">
                        <span className="mono xs-proj-n">P.{pad(n)}</span>
                        <h5>{pj.name}</h5>
                        {pj.desc && <p>{pj.desc}</p>}
                      </header>
                      <ol className="xs-list">
                        {pj.tasks.map((t, k) => (
                          <li key={t}>
                            <span className="mono">{pad(k)}</span>
                            <p>{t}</p>
                          </li>
                        ))}
                      </ol>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Tech: full ngang */}
            {item.tech?.length > 0 && (
              <section className="xs-sec xs-in" style={{ '--i': 5 }}>
                <h4 className="mono xs-label">
                  <i>03</i>Tech
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

        <div className="xs-foot mono">
          <span className="xs-hint">Esc to close</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
