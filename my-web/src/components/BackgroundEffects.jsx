import { useRef } from 'react';
import { useMouseTracker } from '../hooks/useMouseTracker';

/** Ánh neon, đèn theo chuột, và grain phủ toàn trang */
export default function BackgroundEffects() {
  const spotRef = useRef(null);
  useMouseTracker(spotRef);

  return (
    <>
      <div className="neon" />
      <div className="spot" ref={spotRef} />
      <div className="grain" />
    </>
  );
}
