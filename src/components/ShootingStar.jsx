import { useEffect, useRef } from 'react';

const rand = (a, b) => a + Math.random() * (b - a);

// Bấm chuột vào bất kỳ chỗ nào trên trang → một ngôi sao băng xẹt ngang màn hình,
// vị trí, hướng, độ dốc và tốc độ đều ngẫu nhiên.
// Không kích hoạt khi bấm vào link / nút / navbar / thẻ liên hệ / cửa sổ Experience (để không làm phiền thao tác chính).
const IGNORE = 'a, button, input, textarea, select, nav, [role="dialog"], .cc, .xs';
const MAX_AT_ONCE = 6; // bấm liên tục cũng không quá 6 sao cùng lúc
export default function ShootingStar() {
  const layer = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)');

    const spawn = () => {
      const box = layer.current;
      if (!box || reduce?.matches) return;
      if (box.childElementCount >= MAX_AT_ONCE) return;
      const w = window.innerWidth;
      const h = window.innerHeight;

      const len = rand(160, 320); // chiều dài đuôi
      const dir = Math.random() < 0.5 ? 1 : -1; // 1: trái → phải, -1: phải → trái
      const slope = rand(6, 34); // độ dốc (độ), luôn đi chếch xuống
      const rad = (slope * Math.PI) / 180;
      const angle = dir === 1 ? slope : 180 - slope; // hướng của sao
      const dist = rand(0.65, 1.1) * w; // quãng đường bay

      // đầu sao xuất phát ở vị trí ngẫu nhiên (nửa trên màn hình), đi hết quãng đường
      const x0 = dir === 1 ? rand(-0.05 * w, 0.45 * w) : rand(0.55 * w, 1.05 * w);
      const y0 = rand(0.04 * h, 0.55 * h);
      const x1 = x0 + dir * dist * Math.cos(rad);
      const y1 = y0 + dist * Math.sin(rad);

      const el = document.createElement('div');
      el.className = 'shoot';
      el.style.width = `${len}px`;
      box.appendChild(el);

      // transform-origin ở đầu sao (mép phải của phần tử) nên toạ độ translate chính là vị trí đầu sao
      const at = (x, y) => `translate(${x - len}px, ${y}px) rotate(${angle}deg)`;
      const anim = el.animate(
        [
          { transform: at(x0, y0), opacity: 0 },
          { transform: at(x0 + (x1 - x0) * 0.12, y0 + (y1 - y0) * 0.12), opacity: 1, offset: 0.12 },
          { transform: at(x0 + (x1 - x0) * 0.75, y0 + (y1 - y0) * 0.75), opacity: 1, offset: 0.75 },
          { transform: at(x1, y1), opacity: 0 },
        ],
        { duration: rand(750, 1200), easing: 'cubic-bezier(0.3, 0.1, 0.6, 1)' }
      );
      anim.onfinish = () => el.remove();
    };

    const onClick = (e) => {
      if (!document.body.classList.contains('loaded')) return; // đang loading thì chưa bắn
      if (e.target?.closest?.(IGNORE)) return;
      spawn();
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  return <div className="shoot-layer" ref={layer} aria-hidden="true" />;
}
