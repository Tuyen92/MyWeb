import { useEffect, useId, useRef, useState } from 'react';

const OUT_MS = 260;  // nhiễu tăng dần trên tên cũ
const IN_MS = 1200;  // đổi tên rồi rõ nét dần
const rand = (a, b) => a + Math.random() * (b - a);

/**
 * Đổi lần lượt qua danh sách `words`, mỗi 3–5 giây một lần,
 * mỗi lần đổi có hiệu ứng nhiễu sóng TV (nhòe, tách màu RGB, xé ngang, chớp).
 * `words`: danh sách tên (chuỗi). `fonts`: danh sách { font, weight, style, scale, spacing }.
 * Mỗi lần đổi tên sẽ đổi luôn sang một font ngẫu nhiên khác, như nhảy sang "vũ trụ" khác.
 */
export default function GlitchCycle({ words, fonts = [], className = '' }) {
  const ref = useRef(null);
  const turbRef = useRef(null);
  const dispRef = useRef(null);
  const blurRef = useRef(null);
  const [i, setI] = useState(0);
  const [f, setF] = useState(0);
  const fid = `tvcycle${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  // tải trước các font (kèm đủ ký tự tiếng Việt) để lúc đổi tên không bị nháy font dự phòng
  useEffect(() => {
    if (!document.fonts || !document.fonts.load) return;
    const sample = words.join(' ');
    fonts.forEach((x) => {
      document.fonts
        .load(`${x.style || 'normal'} ${x.weight || 400} 1em ${x.font}`, sample)
        .catch(() => {});
    });
  }, [words, fonts]);

  useEffect(() => {
    if (words.length < 2 && fonts.length < 2) return undefined;
    const el = ref.current;
    const turb = turbRef.current;
    const disp = dispRef.current;
    const blur = blurRef.current;
    if (!el || !turb || !disp || !blur) return undefined;

    const next = () => {
      setI((v) => (v + 1) % words.length);
      if (fonts.length > 1) {
        // chọn font ngẫu nhiên, không trùng font vừa rồi
        setF((v) => {
          let n = v;
          while (n === v) n = Math.floor(Math.random() * fonts.length);
          return n;
        });
      }
    };
    const wait = () => rand(3000, 5000);
    let raf = 0;
    let timer = 0;

    // người dùng giảm chuyển động: chỉ đổi chữ, không có nhiễu
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      timer = setInterval(next, 4000);
      return () => clearInterval(timer);
    }

    const clear = () => {
      el.style.removeProperty('opacity');
      el.style.removeProperty('filter');
      el.style.removeProperty('transform');
    };

    const apply = (k, st) => {
      turb.setAttribute('seed', String(st.seed));
      disp.setAttribute('scale', String(110 * k * k * st.rgb));
      const b = 6 * k * k;
      blur.setAttribute('stdDeviation', `${b} ${b * 0.3}`);
      const split = 7 * k * st.rgb;
      el.style.opacity = String(Math.max(0.1, (1 - 0.6 * k) * st.flick));
      el.style.transform = `translateX(${((st.rgb - 0.65) * 18 * k).toFixed(2)}px)`;
      el.style.filter =
        `url(#${fid}) ` +
        `drop-shadow(${split}px 0 0 rgba(255,45,85,.8)) ` +
        `drop-shadow(${-split}px 0 0 rgba(45,220,255,.8))`;
    };

    const play = () => {
      const t0 = performance.now();
      const st = { seed: 1, rgb: 1, flick: 1, step: -1 };
      let swapped = false;

      const tick = (now) => {
        const t = now - t0;
        let k;
        if (t < OUT_MS) {
          k = t / OUT_MS;
        } else {
          if (!swapped) {
            swapped = true;
            next(); // đổi tên đúng lúc nhiễu mạnh nhất
          }
          k = 1 - Math.min((t - OUT_MS) / IN_MS, 1);
        }
        if (t >= OUT_MS + IN_MS) {
          clear();
          timer = setTimeout(play, wait());
          return;
        }
        const step = Math.floor(now / 70);
        if (step !== st.step) {
          st.step = step;
          st.seed = Math.floor(rand(1, 9999));
          st.rgb = rand(0.3, 1);
          st.flick = Math.random() < 0.45 * k ? rand(0.05, 0.55) : 1;
        }
        apply(k, st);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    timer = setTimeout(play, wait());
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      clear();
    };
  }, [words.length, fonts.length, fid]);

  const text = words[i];
  const fx = fonts[f] || {};

  return (
    <span ref={ref} className={className} aria-hidden="true">
      <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: 'absolute' }}>
        <filter id={fid} x="-20%" y="-40%" width="140%" height="180%" colorInterpolationFilters="sRGB">
          <feTurbulence ref={turbRef} type="fractalNoise" baseFrequency="0.003 0.22" numOctaves="2" seed="1" result="noise" />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="1 0 0 0 0  0 0 0 0 0.5  0 0 1 0 0  0 0 0 0 1"
            result="map"
          />
          <feDisplacementMap
            ref={dispRef}
            in="SourceGraphic"
            in2="map"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
            result="torn"
          />
          <feGaussianBlur ref={blurRef} in="torn" stdDeviation="0 0" />
        </filter>
      </svg>
      <span
        className="cta-word"
        style={{
          fontFamily: fx.font,
          fontWeight: fx.weight,
          fontStyle: fx.style,
          fontSize: fx.scale ? `${fx.scale}em` : undefined,
          letterSpacing: fx.spacing,
        }}
      >
        {text}
      </span>
    </span>
  );
}
