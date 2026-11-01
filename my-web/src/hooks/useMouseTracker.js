import { useEffect } from 'react';
import { mouse } from '../lib/mouse';

/** Theo dõi chuột: cập nhật `mouse` và di chuyển đèn spotlight */
export function useMouseTracker(spotRef) {
  useEffect(() => {
    const onMove = (e) => {
      mouse.x = e.clientX / window.innerWidth - 0.5;
      mouse.y = e.clientY / window.innerHeight - 0.5;
      if (spotRef.current) {
        spotRef.current.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [spotRef]);
}
