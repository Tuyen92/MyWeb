import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { latestRole } from '../data/experience';

const pad = (n) => String(n + 1).padStart(2, '0');

/**
 * Cửa sổ đen kéo từ dưới màn hình lên (full màn hình), hiện chi tiết một mục Experience.
 * Đóng bằng: nút X, phím Esc, hoặc click vào vùng tối phía trên.
 * `item` được giữ lại khi đóng để nội dung không biến mất giữa lúc trượt xuống.
 */
export default function ExperienceSheet({ open, item, index, total, onClose, onNavigate }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  // Esc to close sheet
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

  // Mọi mục dùng cùng cấu trúc roles → projects → tasks (xem data/experience.js)
  const roles = item.roles || [];
  const hasProjects = roles.some((r) => r.projects?.length);
  // Dàn phẳng: mỗi dự án mang theo vị trí của nó. Chỉ hiện nhãn vị trí khi có từ 2 vị trí
  // trở lên (một vị trí thì đã có ở header nên không lặp lại).
  const multiRole = roles.length > 1;
  const projects = roles.flatMap((r) => (r.projects || []).map((p) => ({ ...p, role: r.title })));
  const meta = [item.job_type, item.location].filter(Boolean).join(' · ');
  // Đánh số 01/02/03 theo các mục thực sự có, không bị nhảy số khi thiếu mục
  let sec = 0;
  const nextSec = () => pad(sec++);
  // P.01, P.02... đếm liên tục xuyên suốt các vị trí
  let pj = 0;

  // portal ra body: thoát khỏi stacking context của section nên luôn nằm trên navbar / grain
  return createPortal(
    <div className={`xs ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div className="xs-back" onClick={onClose} />

      <div
        className="xs-panel"
        role="dialog"
        aria-modal="true"
        aria-label={`${item.company} — ${latestRole(item)}`}
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
              <span className="xs-navtxt">Prev</span>
            </button>
            <button
              type="button"
              className="xs-navbtn"
              onClick={() => onNavigate(index + 1)}
              disabled={index >= total - 1}
              aria-label="Next company"
            >
              <span className="xs-navtxt">Next</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
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
                  {latestRole(item)}
                </p>
                {meta && (
                  <small className="mono xs-loc xs-in" style={{ '--i': 3 }}>
                    {meta}
                  </small>
                )}
              </header>

              {item.summary && (
                <section className="xs-sec xs-in" style={{ '--i': 3 }}>
                  <h4 className="mono xs-label">
                    <i>{nextSec()}</i>Overview
                  </h4>
                  <p className="xs-sum">{item.summary}</p>
                </section>
              )}
            </div>

            {/* What I did: full ngang, nhóm theo vị trí → dự án */}
            {hasProjects && (
              <section className="xs-sec xs-in" style={{ '--i': 4 }}>
                <h4 className="mono xs-label">
                  <i>{nextSec()}</i>What I did
                </h4>
                <div className="xs-projects">
                  {projects.map((p) => (
                    <article className="xs-proj" key={`${p.role}-${p.name}`}>
                      <header className="xs-proj-head">
                        <div className="xs-proj-meta">
                          <span className="mono xs-proj-n">P.{pad(pj++)}</span>
                          {multiRole && <span className="mono xs-proj-role">{p.role}</span>}
                        </div>
                        <h5>{p.name}</h5>
                        {p.desc && <p>{p.desc}</p>}
                        {p.tech?.length > 0 && (
                          <ul className="xs-proj-tags">
                            {p.tech.map((t) => (
                              <li key={t} className="mono">
                                {t}
                              </li>
                            ))}
                          </ul>
                        )}
                      </header>
                      <ul className="xs-list">
                        {p.tasks.map((t, k) => (
                          <li key={k}>
                            <span className="xs-dot" aria-hidden="true" />
                            <p>{t}</p>
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Tech: full ngang */}
            {item.tech?.length > 0 && (
              <section className="xs-sec xs-in" style={{ '--i': 5 }}>
                <h4 className="mono xs-label">
                  <i>{nextSec()}</i>Tech
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

        <div className="xs-foot mono" />
      </div>
    </div>,
    document.body
  );
}
