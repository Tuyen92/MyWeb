import { useEffect, useId, useRef, useState } from 'react';

const TV_MS = 1300; // thời gian của hiệu ứng nhiễu sóng

const rand = (a = 0, b = 1) => a + Math.random() * (b - a);

/**
 * Reveal: hiện phần tử khi cuộn tới.
 *  - mặc định: trượt lên + mờ dần (CSS .rv / .rv.in)
 *  - effect="tv": nhiễu sóng TV (nhòe, tách màu RGB, rách ngang, chớp tắt)
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  className = '',
  style,
  effect,
}) {
  const ref = useRef(null);
  const turbRef = useRef(null);
  const dispRef = useRef(null);
  const blurRef = useRef(null);
  const [on, setOn] = useState(false);
  const [done, setDone] = useState(false);

  const tv = effect === 'tv';
  // id duy nhất cho mỗi bộ lọc SVG (bỏ ký tự ":" mà useId sinh ra)
  const fid = `tvfx${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  // 1) Theo dõi phần tử cuộn vào / ra khỏi màn hình
  //    - mặc định: hiện một lần rồi thôi
  //    - effect="tv": ra hẳn khỏi màn hình thì reset, cuộn vào lại sẽ chạy lại hiệu ứng
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1]; // cuộn nhanh có thể dồn nhiều bản ghi
        if (!tv) {
          if (entry.isIntersecting) {
            setOn(true);
            io.disconnect();
          }
          return;
        }
        if (entry.intersectionRatio >= 0.15) {
          setOn(true);
        } else if (!entry.isIntersecting) {
          setOn(false);
          setDone(false);
        }
      },
      { threshold: tv ? [0, 0.15] : 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [tv]);

  // 2) Chạy hiệu ứng nhiễu sóng (chỉ khi effect="tv")
  useEffect(() => {
    if (!tv || !on) return;
    const el = ref.current;
    const turb = turbRef.current;
    const disp = dispRef.current;
    const blur = blurRef.current;
    if (!el || !turb || !disp || !blur) return;

    const finish = () => {
      el.style.opacity = '1';
      el.style.removeProperty('filter');
      el.style.removeProperty('transform');
      setDone(true);
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return;
    }

    // ẩn ngay trong lúc chờ delay để không bị nháy khung cũ
    el.style.opacity = '0';
    el.style.removeProperty('filter');
    el.style.removeProperty('transform');

    let raf = 0;
    let t0 = 0;
    let lastStep = -1;
    let seed = 1;
    let rgb = 0;
    let flick = 1;

    const tick = (now) => {
      if (!t0) t0 = now;
      const p = Math.min((now - t0) / TV_MS, 1);
      if (p >= 1) {
        finish();
        return;
      }
      const k = 1 - p; // 1 → 0

      // "nhiễu" đổi ngẫu nhiên mỗi ~70ms để có cảm giác tín hiệu giật
      const step = Math.floor(now / 70);
      if (step !== lastStep) {
        lastStep = step;
        seed = Math.floor(rand(1, 9999));
        rgb = rand(0.3, 1);
        flick = Math.random() < 0.45 * k ? rand(0.05, 0.55) : 1;
      }

      turb.setAttribute('seed', String(seed));
      disp.setAttribute('scale', String(110 * k * k * rgb));
      const b = 6 * k * k;
      blur.setAttribute('stdDeviation', `${b} ${b * 0.3}`);

      const split = 7 * k * rgb;
      el.style.opacity = String(Math.min(1, (0.2 + 0.8 * p) * flick + 0.05));
      el.style.transform = `translateX(${((rgb - 0.65) * 18 * k).toFixed(2)}px)`;
      raf = requestAnimationFrame(tick);
    };

    const timer = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      // reset về trạng thái ẩn (class .rv đặt opacity: 0)
      el.style.removeProperty('opacity');
      el.style.removeProperty('filter');
      el.style.removeProperty('transform');
    };
  }, [tv, on, delay, fid]);

  const cls = tv
    ? `rv rv-tv ${done ? 'fx-done' : ''} ${className}`
    : `rv ${on ? 'in' : ''} ${className}`;

  return (
    <Tag
      ref={ref}
      className={cls.replace(/\s+/g, ' ').trim()}
      style={tv ? style : { transitionDelay: `${delay}ms`, ...style }}
    >
      {tv && (
        <svg
          aria-hidden="true"
          focusable="false"
          width="0"
          height="0"
          style={{ position: 'absolute' }}
        >
          <filter
            id={fid}
            x="-20%"
            y="-40%"
            width="140%"
            height="180%"
            colorInterpolationFilters="sRGB"
          >
            {/* nhiễu dạng sọc ngang: tần số x thấp, y cao */}
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.003 0.22"
              numOctaves="2"
              seed="1"
              result="noise"
            />
            {/* chỉ giữ kênh R để dịch ngang (kênh G cố định = không dịch dọc) */}
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
      )}
      {children}
    </Tag>
  );
}
