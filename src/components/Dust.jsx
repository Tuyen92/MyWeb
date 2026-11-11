import { useEffect, useRef } from 'react';
import { mouse } from '../lib/mouse';

const BASE_AREA = 1440 * 900;
const wrap = (v, m) => ((v % m) + m) % m;
const rnd = (a, b) => a + Math.random() * (b - a);

/** Bụi vũ trụ: các hạt trắng nhỏ trôi chậm, lấp lánh, có parallax theo chuột và khi cuộn */
export default function Dust({ density = 110 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas && canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let parts = [];
    let raf = 0;
    let last = 0;
    let mx = 0;
    let my = 0;

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      const n = Math.max(45, Math.min(170, Math.round((density * w * h) / BASE_AREA)));
      parts = Array.from({ length: n }, () => {
        const z = Math.random() ** 1.6; // nhiều hạt xa/nhỏ, ít hạt gần/to
        return {
          x: rnd(0, w),
          y: rnd(0, h),
          z,
          r: 0.35 + z * 1.4,
          a: 0.25 + z * 0.55,
          vx: rnd(-3, 3) * (0.3 + z),
          vy: -(2 + z * 8) * rnd(0.6, 1.2),
          ph: rnd(0, Math.PI * 2),
          tw: rnd(0.6, 1.6),
        };
      });
    };

    const draw = (now) => {
      const dt = Math.min((now - last) / 1000 || 0, 0.05);
      last = now;
      mx += (mouse.x - mx) * 0.04;
      my += (mouse.y - my) * 0.04;
      const scroll = window.scrollY;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#eef2ff';
      for (const p of parts) {
        if (!reduce) {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
        }
        const x = wrap(p.x + Math.sin(now * 0.0004 * p.tw + p.ph) * 10 * p.z - mx * 40 * p.z, w);
        const y = wrap(p.y - scroll * (0.04 + 0.22 * p.z) - my * 30 * p.z, h);
        const twinkle = 0.65 + 0.35 * Math.sin(now * 0.0012 * p.tw + p.ph * 2);

        ctx.globalAlpha = p.a * twinkle;
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fill();

        if (p.z > 0.75) {
          // hạt gần có quầng sáng mờ
          ctx.globalAlpha *= 0.18;
          ctx.beginPath();
          ctx.arc(x, y, p.r * 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    const onResize = () => {
      const widthChanged = window.innerWidth !== w;
      sizeCanvas();
      if (widthChanged) seed(); // mobile: thanh địa chỉ co giãn khi cuộn không làm tạo lại hạt
      if (reduce) draw(performance.now());
    };

    sizeCanvas();
    seed();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [density]);

  return <canvas ref={ref} className="dust" aria-hidden="true" />;
}
