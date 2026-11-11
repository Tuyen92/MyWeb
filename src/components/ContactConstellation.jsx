import { useEffect, useRef } from 'react';
import { mouse } from '../lib/mouse';

/**
 * Chòm sao Bảo Bình (Aquarius) bên cạnh mục Contact.
 * Toạ độ lấy gần đúng từ vị trí thật trên bầu trời (đông bên trái, bắc ở trên).
 *
 * Mỗi ngôi sao:
 *  - chớp tắt cực chậm theo nhịp riêng (CSS, xem index.css: sky-a / sky-b / sky-c)
 *  - bay lơ lửng theo quỹ đạo riêng (JS bên dưới) + lệch theo chuột như có chiều sâu gần / xa
 */
const W = 800;
const H = 430;

// ====== CHỈNH Ở ĐÂY ======
const FLOAT = 26; // độ xa mỗi sao bay khỏi vị trí gốc (đơn vị SVG ~ px). Tăng = bay xa hơn
const SPEED = 1; // tốc độ bay: 1 = bình thường, 0.5 = chậm một nửa, 2 = nhanh gấp đôi
const PARALLAX = 36; // độ lệch theo chuột (sao "gần" lệch nhiều, sao "xa" lệch ít). 0 = tắt
// ==========================

// [id, x, y, r]
const STARS = [
  ['phi', 40, 175, 1.6],
  ['psi', 32, 238, 1.4],
  ['lam', 150, 212, 2.0],
  ['tau', 178, 328, 1.5],
  ['del', 150, 372, 2.6], // Skat
  ['eta', 238, 62, 1.7],
  ['zet', 272, 58, 2.1],
  ['pi', 292, 28, 1.8],
  ['gam', 308, 84, 2.3], // Sadachbia
  ['alp', 380, 70, 3.3], // Sadalmelik
  ['the', 330, 214, 1.7],
  ['bet', 548, 170, 3.6], // Sadalsuud
  ['xi', 520, 218, 1.6],
  ['eps', 760, 250, 2.7], // Albali
  ['nu', 640, 190, 1.2],
];

// random có seed để mỗi lần render cho cùng kết quả
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}
const rand = rng(92);
const TAU = Math.PI * 2;

// thông số bay riêng cho từng sao: biên độ, tần số, pha lệch nhau để không sao nào đi giống sao nào
const makeFloat = (amp) => ({
  ax: amp * (0.5 + rand() * 0.5),
  ay: amp * (0.5 + rand() * 0.5),
  fx: 0.12 + rand() * 0.2, // rad/s
  fy: 0.1 + rand() * 0.2,
  px: rand() * TAU,
  py: rand() * TAU,
  depth: 0.3 + rand() * 1.2, // 0.3 = xa, 1.5 = gần
});

const TWINKLES = STARS.map(() => ({
  dur: 9 + rand() * 12, // chu kỳ chớp: 9s – 21s
  delay: -rand() * 21,
  variant: Math.floor(rand() * 3), // 3 kiểu chớp khác nhau
  min: 0.04 + rand() * 0.18, // độ mờ thấp nhất
  fl: makeFloat(FLOAT),
}));

// vài hạt sao nền rất nhỏ cho có chiều sâu
const FIELD = Array.from({ length: 26 }, () => ({
  x: rand() * W,
  y: rand() * H,
  r: 0.5 + rand() * 0.7,
  dur: 10 + rand() * 14,
  delay: -rand() * 24,
  fl: { ...makeFloat(FLOAT * 0.5), depth: 0.1 + rand() * 0.4 },
}));

const ALL_FLOATS = [...STARS.map((_, i) => TWINKLES[i].fl), ...FIELD.map((f) => f.fl)];

export default function ContactConstellation() {
  const wrapRef = useRef(null);
  const nodes = useRef([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let mx = 0;
    let my = 0;
    const t0 = performance.now();

    const frame = () => {
      const t = ((performance.now() - t0) / 1000) * SPEED;
      mx += (mouse.x - mx) * 0.04; // làm mượt theo chuột
      my += (mouse.y - my) * 0.04;
      for (let i = 0; i < ALL_FLOATS.length; i++) {
        const el = nodes.current[i];
        if (!el) continue;
        const f = ALL_FLOATS[i];
        const x = Math.sin(t * f.fx + f.px) * f.ax + mx * PARALLAX * f.depth;
        const y = Math.cos(t * f.fy + f.py) * f.ay + my * PARALLAX * f.depth;
        el.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
      }
    };
    const loop = () => {
      frame();
      raf = requestAnimationFrame(loop);
    };

    // chỉ chạy khi chòm sao đang nằm trong màn hình
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting && !reduce) loop();
    });
    io.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <div className="contact-sky" ref={wrapRef} aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} role="presentation" focusable="false">
        <defs>
          <radialGradient id="sky-glow">
            <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="0.35" stopColor="#fff" stopOpacity="0.28" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {FIELD.map((f, i) => (
          <g key={`f${i}`} ref={(el) => (nodes.current[STARS.length + i] = el)}>
            <circle
              className="sky-star sky-v0"
              cx={f.x} cy={f.y} r={f.r}
              style={{ '--dur': `${f.dur}s`, '--delay': `${f.delay}s`, '--min': 0.05 }}
            />
          </g>
        ))}

        {STARS.map(([id, x, y, r], i) => {
          const t = TWINKLES[i];
          return (
            <g key={id} ref={(el) => (nodes.current[i] = el)}>
              <g
                className={`sky-star sky-v${t.variant}`}
                style={{ '--dur': `${t.dur}s`, '--delay': `${t.delay}s`, '--min': t.min }}
              >
                <circle cx={x} cy={y} r={r * 6} fill="url(#sky-glow)" />
                <circle cx={x} cy={y} r={r} fill="#fff" />
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
