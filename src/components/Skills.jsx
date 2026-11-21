import { useEffect, useRef } from 'react';
import Reveal from './Reveal';

// số giả ngẫu nhiên cố định theo (chỉ số, khoá) để mỗi nhóm trôi một kiểu riêng
const r = (i, k) => {
  const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return v - Math.floor(v);
};
const sign = (i, k) => (r(i, k) > 0.5 ? 1 : -1);

const GAP = 18; // khoảng hở tối thiểu giữa popup và skill bị đẩy (px)

// Khi hover một nhóm: skill nào bị popup đè thì đẩy nhẹ ra, bỏ hover thì về chỗ cũ
function usePushAway(cloudRef) {
  useEffect(() => {
    const cloud = cloudRef.current;
    if (!cloud) return undefined;
    const mq = window.matchMedia('(min-width: 861px)'); // mobile popup hiện sẵn, không cần đẩy
    let active = null;

    const reset = () => {
      cloud.querySelectorAll('.skill').forEach((el) => {
        el.style.removeProperty('--px');
        el.style.removeProperty('--py');
      });
      active = null;
    };

    // hộp bao sát chữ thật (không phải cả ô <li>), tính theo vị trí gốc chưa bị đẩy
    const textBox = (el, c) => {
      const o = { l: c.left + el.offsetLeft, t: c.top + el.offsetTop };
      const range = document.createRange();
      range.selectNodeContents(el.querySelector('.skill-in'));
      const rs = [...range.getClientRects()].filter((r) => r.width > 0);
      if (!rs.length) {
        return { l: o.l, t: o.t, r: o.l + el.offsetWidth, b: o.t + el.offsetHeight };
      }
      const li = el.getBoundingClientRect(); // cùng hệ quy chiếu với range nên bù trừ được translate đang chạy
      return {
        l: o.l + Math.min(...rs.map((r) => r.left)) - li.left,
        t: o.t + Math.min(...rs.map((r) => r.top)) - li.top,
        r: o.l + Math.max(...rs.map((r) => r.right)) - li.left,
        b: o.t + Math.max(...rs.map((r) => r.bottom)) - li.top,
      };
    };

    const open = (li) => {
      if (!mq.matches || li === active) return;
      reset();
      active = li;
      const box = li.querySelector('.skill-box');
      const pop = li.querySelector('.skill-pop');
      if (!box || !pop) return;

      // Dùng offsetLeft/offsetTop (bố cục gốc, không tính translate đang chạy) để không bị giật
      const c = cloud.getBoundingClientRect();
      const vw = document.documentElement.clientWidth;
      const bx = c.left + li.offsetLeft + box.offsetLeft;
      const by = c.top + li.offsetTop + box.offsetTop;
      const P = {
        l: bx + pop.offsetLeft - GAP,
        t: by + pop.offsetTop - GAP,
        r: bx + pop.offsetLeft + pop.offsetWidth + GAP,
        b: by + pop.offsetTop + pop.offsetHeight + GAP,
      };

      cloud.querySelectorAll('.skill').forEach((el) => {
        if (el === li) return;
        const A = textBox(el, c);

        const ox = Math.min(A.r, P.r) - Math.max(A.l, P.l);
        const oy = Math.min(A.b, P.b) - Math.max(A.t, P.t);
        if (ox <= 0 || oy <= 0) return; // chữ thật không bị đè thì đứng yên

        const sx = (A.l + A.r) / 2 < (P.l + P.r) / 2 ? -1 : 1;
        const sy = (A.t + A.b) / 2 < (P.t + P.b) / 2 ? -1 : 1;
        // quãng cần dịch để thoát hẳn popup (không phải độ sâu chồng lấn)
        const dx = sx > 0 ? P.r - A.l : P.l - A.r;
        const dy = sy > 0 ? P.b - A.t : P.t - A.b;
        // thử đẩy theo trục ít tốn nhất trước; nếu tràn khỏi màn hình thì đẩy theo trục kia
        const cands = [
          { x: dx, y: 0 },
          { x: 0, y: dy },
        ].sort((a, b) => Math.abs(a.x + a.y) - Math.abs(b.x + b.y));
        const fits = (d) => A.l + d.x >= 8 && A.r + d.x <= vw - 8;
        const d = cands.find(fits) || cands.find((v) => v.y !== 0);

        el.style.setProperty('--px', `${Math.round(d.x)}px`);
        el.style.setProperty('--py', `${Math.round(d.y)}px`);
      });
    };

    const liOf = (e) => (e.target.closest ? e.target.closest('.skill') : null);
    const onIn = (e) => {
      const li = liOf(e);
      if (li && cloud.contains(li)) open(li);
    };
    const onOut = (e) => {
      if (active && e.relatedTarget && active.contains(e.relatedTarget)) return;
      reset();
    };

    cloud.addEventListener('mouseover', onIn);
    cloud.addEventListener('mouseout', onOut);
    cloud.addEventListener('focusin', onIn);
    cloud.addEventListener('focusout', onOut);
    mq.addEventListener('change', reset);
    return () => {
      cloud.removeEventListener('mouseover', onIn);
      cloud.removeEventListener('mouseout', onOut);
      cloud.removeEventListener('focusin', onIn);
      cloud.removeEventListener('focusout', onOut);
      mq.removeEventListener('change', reset);
    };
  }, [cloudRef]);
}

export default function Skills({ items }) {
  const cloudRef = useRef(null);
  usePushAway(cloudRef);
  return (
    <section id="skills" className="skills">
      <Reveal as="h2" className="mono">( Skills )</Reveal>
      <ul className="skills-cloud" ref={cloudRef}>
        {items.map((s, i) => (
          <Reveal
            key={s.name}
            as="li"
            effect="tv"
            // so le thời gian để các nhóm nhảy ra lộn xộn, không theo thứ tự
            delay={((i * 7) % 11) * 90}
            className={`skill t${s.tier}`}
            style={{ '--x': `${s.x}%`, '--y': `${s.y}%` }}
          >
            {/* skill-box: vùng rê chuột / bấm (focus) để mở cửa sổ danh sách tech.
                data-h / data-v: cửa sổ bật sang trái / lên trên khi nhóm nằm sát mép phải / mép dưới */}
            <div
              className="skill-box"
              tabIndex={0}
              role="group"
              aria-label={`${s.name}: ${s.items.join(', ')}`}
              data-h={s.x > 55 ? 'r' : 'l'}
              data-v={s.y > 60 ? 'up' : 'down'}
            >
              {/* span trong: lơ lửng như phi hành gia trong không trọng lực */}
              <span
                className="skill-in"
                style={{
                  '--fd': `${(9 + r(i, 1) * 7).toFixed(1)}s`,
                  '--fdel': `${(-r(i, 2) * 16).toFixed(1)}s`,
                  '--fx': `${(sign(i, 3) * (4 + r(i, 4) * 7)).toFixed(1)}px`,
                  '--fy': `${(sign(i, 5) * (5 + r(i, 6) * 8)).toFixed(1)}px`,
                  '--fr': `${(sign(i, 7) * (0.6 + r(i, 8) * 1.6)).toFixed(2)}deg`,
                }}
              >
                {s.name}
              </span>

              {/* small window lists down techs in group */}
              <div className="skill-pop" aria-hidden="true">
                <span className="skill-pop-head mono">
                  {String(i + 1).padStart(2, '0')} · {s.items.length} items
                </span>
                <span className="skill-chips">
                  {s.items.map((t) => (
                    <span key={t} className="skill-chip">
                      {t}
                    </span>
                  ))}
                </span>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
