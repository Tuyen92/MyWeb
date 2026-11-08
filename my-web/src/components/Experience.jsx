import { useCallback, useRef, useState } from 'react';
import Reveal from './Reveal';
import ExperienceSheet from './ExperienceSheet';
import { latestRole, stackOf } from '../data/experience';

export default function Experience({ items }) {
  const [active, setActive] = useState(0); // giữ mục cuối cùng được chọn để nội dung không mất khi đóng
  const [open, setOpen] = useState(false);
  const trigger = useRef(null); // phần tử đã mở cửa sổ, để trả focus khi đóng

  const openSheet = (i, el) => {
    trigger.current = el;
    setActive(i);
    setOpen(true);
  };

  const closeSheet = useCallback(() => {
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  }, []);

  return (
    <section id="experience" className="exp">
      <Reveal as="h2" className="mono">( Experience )</Reveal>
      {items.map((e, i) => (
        <Reveal key={`${e.company}-${e.period}`} delay={i * 80}>
          <button
            type="button"
            className="exp-row"
            aria-haspopup="dialog"
            onClick={(ev) => openSheet(i, ev.currentTarget)}
          >
            <small className="mono exp-period">{e.period}</small>
            <div className="exp-main">
              <em>{e.company}</em>
              <span className="exp-role">{latestRole(e)}</span>
            </div>
            <small className="mono" style={{ color: 'var(--mut)' }}>{stackOf(e)}</small>
          </button>
        </Reveal>
      ))}

      <ExperienceSheet
        open={open}
        item={items[active]}
        index={active}
        total={items.length}
        onClose={closeSheet}
        onNavigate={setActive}
      />
    </section>
  );
}
