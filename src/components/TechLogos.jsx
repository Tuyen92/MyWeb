import { useRef, useState } from 'react';
import { logoUrl } from '../data/techLogos';

const MAX_TILT = 18; // độ nghiêng tối đa (deg)

/** Một công nghệ: logo ảnh nghiêng 3D theo con trỏ; không có ảnh / ảnh lỗi thì hiện tag chữ */
function TechItem({ name, index }) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef(null);
  const src = logoUrl(name);

  if (!src || failed) return <li className="mono">{name}</li>;

  const onMove = (e) => {
    const img = imgRef.current;
    if (!img || e.pointerType === 'touch') return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5; // -0.5 → 0.5
    const py = (e.clientY - r.top) / r.height - 0.5;
    img.style.setProperty('--rx', `${(-py * MAX_TILT * 2).toFixed(2)}deg`);
    img.style.setProperty('--ry', `${(px * MAX_TILT * 2).toFixed(2)}deg`);
  };

  const onLeave = () => {
    const img = imgRef.current;
    if (!img) return;
    img.style.setProperty('--rx', '0deg');
    img.style.setProperty('--ry', '0deg');
  };

  return (
    <li
      className="xs-logo"
      style={{ '--d': `${index * 0.45}s` }}
      title={name}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <img
        ref={imgRef}
        className="xs-logo-in"
        src={src}
        alt={name}
        draggable={false}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </li>
  );
}

export default function TechLogos({ names }) {
  return (
    <ul className="xs-tags xs-tags--logos" aria-label="Technologies">
      {names.map((n, i) => (
        <TechItem key={n} name={n} index={i} />
      ))}
    </ul>
  );
}
