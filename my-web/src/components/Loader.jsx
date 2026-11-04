import { useEffect, useRef, useState } from 'react';

const MIN_MS = 2400; // hiện tối thiểu, để hoạt ảnh kịp "đọc" được dù máy tải rất nhanh
const EXIT_MS = 1300; // khớp với thời gian chuyển ra trong CSS (.ld.out)

const MESSAGES = [
  [0.0, 'Locking onto pulsar'],
  [0.35, 'Spinning up the signal'],
  [0.7, 'Calibrating the field'],
  [1.0, 'Signal acquired'],
];

/**
 * Màn hình chờ: sao neutron (pulsar) với hai tia phát xoay như đèn hải đăng.
 * - `done / total`: số việc nền đã xong (font, cảnh 3D, ảnh)
 * - phần trăm hiển thị chạy mượt tới giá trị thật; chỉ chạm 100% khi mọi việc xong VÀ đủ MIN_MS
 * - chạm 100% thì gọi `onComplete`; App đặt `loaded` → loader loé sáng rồi mờ đi và tự gỡ khỏi DOM
 */
export default function Loader({ done, total, loaded, onComplete }) {
  const pctRef = useRef(null);
  const barRef = useRef(null);
  const msgRef = useRef(null);
  const doneRef = useRef(done);
  const cbRef = useRef(onComplete);
  const [gone, setGone] = useState(false);

  doneRef.current = done;
  cbRef.current = onComplete;

  useEffect(() => {
    const t0 = performance.now();
    let last = t0;
    let v = 0;
    let raf = 0;
    let fired = false;
    let msgIdx = -1;

    const tick = (now) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;

      const work = doneRef.current / total;
      const time = Math.min(1, (now - t0) / MIN_MS);
      const target = Math.min(time, 0.08 + work * 0.92);

      v += (target - v) * (1 - Math.exp(-dt * 5)); // tiến mượt tới mục tiêu
      if (target >= 1 && v > 0.995) v = 1;

      if (pctRef.current) pctRef.current.textContent = `${String(Math.round(v * 100)).padStart(3, '0')}%`;
      if (barRef.current) barRef.current.style.transform = `scaleX(${v})`;

      let m = 0;
      MESSAGES.forEach(([at], i) => {
        if (v >= at) m = i;
      });
      if (m !== msgIdx && msgRef.current) {
        msgIdx = m;
        msgRef.current.textContent = MESSAGES[m][1];
      }

      if (v >= 1 && !fired) {
        fired = true;
        setTimeout(() => cbRef.current?.(), 350); // dừng một nhịp ở 100% cho đẹp
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [total]);

  // đã mờ hẳn thì gỡ khỏi DOM
  useEffect(() => {
    if (!loaded) return undefined;
    const t = setTimeout(() => setGone(true), EXIT_MS);
    return () => clearTimeout(t);
  }, [loaded]);

  if (gone) return null;

  return (
    <div className={`ld ${loaded ? 'out' : ''}`} role="status" aria-label="Loading">
      <div className="ld-bar mono">
        <span>FIG.00</span>
        <span className="ld-live">Acquiring signal</span>
      </div>

      <div className="ld-stage">
        <div className="ld-star" aria-hidden="true">
          <i className="ld-halo" />
          <span className="ld-ring r1" />
          <span className="ld-ring r2" />
          <div className="ld-beams">
            <i className="ld-beam up" />
            <i className="ld-beam dn" />
          </div>
          <i className="ld-core" />
        </div>
        <p className="ld-name mono">PSR · Neutron Star</p>
      </div>

      <div className="ld-bottom">
        <div className="ld-row">
          <span className="mono ld-msg" ref={msgRef}>
            {MESSAGES[0][1]}
          </span>
          <b className="ld-pct" ref={pctRef}>
            000%
          </b>
        </div>
        <div className="ld-track">
          <i ref={barRef} />
        </div>
      </div>

      <div className="ld-foot mono">
        <span>Spin 716 Hz</span>
        <span>Density 4×10¹⁷ kg/m³</span>
      </div>
    </div>
  );
}
