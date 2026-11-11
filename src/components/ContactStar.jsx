import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { mouse } from '../lib/mouse';
import { createEnvironment } from '../lib/sceneParts';
import { buildStar } from '../lib/buildStar';

/**
 * Ngôi sao 4 cánh chrome ở mục Contact.
 * Cùng tone mapping, môi trường phản chiếu và cách xoay theo chuột với chữ STERLING ở Hero3D.
 * Chỉ vẽ khi đang nằm trong màn hình để không tốn GPU.
 */
export default function ContactStar() {
  const wrapRef = useRef(null);
  const cvRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const cv = cvRef.current;
    if (!wrap || !cv) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
    } catch {
      return; // thiết bị không có WebGL: bỏ qua, trang vẫn dùng bình thường
    }
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.outputEncoding = THREE.sRGBEncoding;

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    cam.position.z = 12;
    scene.environment = createEnvironment(renderer);

    const star = buildStar();
    const root = new THREE.Group();
    root.add(star.group);
    scene.add(root);

    const visH = 2 * Math.tan(THREE.MathUtils.degToRad(17.5)) * cam.position.z;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const fit = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h, false);
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
      root.scale.setScalar((visH * 0.82) / star.size); // chừa chỗ để xoay không bị cắt mép
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);

    let raf = 0;
    let visible = false;
    let sx = 0;
    let sy = 0;
    let shown = false;
    const t0 = performance.now();

    const frame = () => {
      const t = (performance.now() - t0) / 1000;
      sx += (mouse.x - sx) * 0.05;
      sy += (mouse.y - sy) * 0.05;
      root.rotation.y = reduce ? 0.3 : sx * 0.8 + Math.sin(t * 0.6) * 0.45;
      root.rotation.x = reduce ? 0 : -sy * 0.4 + Math.sin(t * 0.45) * 0.08;
      root.rotation.z = -0.07;
      root.position.y = reduce ? 0 : Math.sin(t * 0.9) * 0.1;
      renderer.render(scene, cam);
      if (!shown) {
        shown = true;
        wrap.classList.add('ready'); // fade-in sau khi khung hình đầu đã vẽ
      }
    };
    const loop = () => {
      frame();
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) (reduce ? frame() : loop());
    });
    io.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      star.dispose();
      scene.environment?.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="contact-star" ref={wrapRef} aria-hidden="true">
      <canvas ref={cvRef} />
    </div>
  );
}
