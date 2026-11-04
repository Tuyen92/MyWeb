import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CONFIG } from '../config';
import { mouse } from '../lib/mouse';
import { buildText } from '../lib/buildText';
import { createDust, createEnvironment, createRings } from '../lib/sceneParts';

/**
 * started: false trong lúc loading → animation vào cảnh (xoay chữ) chưa chạy, chờ loader xong mới bắt đầu
 * onReady: gọi một lần khi chữ 3D đã dựng xong và đã vẽ vài khung hình (shader đã biên dịch)
 */
export default function Hero3D({ started = true, onReady }) {
  const ref = useRef(null);
  const startedRef = useRef(started);
  const readyRef = useRef(onReady);
  startedRef.current = started;
  readyRef.current = onReady;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;

    let dead = false;
    let raf = 0;

    const renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.outputEncoding = THREE.sRGBEncoding;

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    cam.position.z = 12;
    scene.environment = createEnvironment(renderer);

    const root = new THREE.Group();
    scene.add(root);
    const textHolder = new THREE.Group();
    root.add(textHolder);
    if (CONFIG.ring) root.add(createRings());

    const dust = createDust();
    scene.add(dust);

    let visW = 1, visH = 1, tw = 8, th = 4;
    const fit = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
      visH = 2 * Math.tan(THREE.MathUtils.degToRad(17.5)) * cam.position.z;
      visW = visH * cam.aspect;
      root.scale.setScalar(Math.min((visW * (w > 800 ? 0.5 : 0.8)) / tw, (visH * 0.5) / th));
    };
    window.addEventListener('resize', fit);

    buildText(CONFIG)
      .then((r) => {
        if (dead) return;
        textHolder.add(r.group);
        tw = r.width;
        th = r.height;
        fit();
      })
      .catch(() => {
        /* lỗi dựng chữ cũng không được giữ loader mãi */
      })
      .finally(() => {
        // chờ vài khung hình để GPU biên dịch shader xong rồi mới báo sẵn sàng
        let n = 0;
        const wait = () => {
          if (dead) return;
          if (++n >= 3) readyRef.current?.();
          else requestAnimationFrame(wait);
        };
        requestAnimationFrame(wait);
      });
    fit();

    let t0 = performance.now();
    let sx = 0, sy = 0;
    const loop = () => {
      if (!startedRef.current) t0 = performance.now(); // giữ nguyên ở khung đầu cho tới khi loader xong
      const t = (performance.now() - t0) / 1000;
      const p = Math.min(1, t / 2.6);
      const e = 1 - Math.pow(1 - p, 3);
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      sx += (mouse.x - sx) * 0.05;
      sy += (mouse.y - sy) * 0.05;
      root.rotation.y = 0.18 + sx * 0.6 - (1 - e) * 1.1;
      root.rotation.x = -sy * 0.3 + Math.sin(t * 0.7) * 0.03;
      root.rotation.z = CONFIG.tilt;
      root.position.set(
        visW * 0.02,
        -visH * 0.02 + Math.sin(t * 0.9) * 0.08 + (scrollY / vh) * visH * 0.6,
        0,
      );
      dust.rotation.y = t * 0.01;
      dust.position.y = ((t * 0.05) % 1) - 0.5;
      cv.style.opacity = String(Math.max(0, 1 - (scrollY / vh) * 1.4));

      renderer.render(scene, cam);
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', fit);
      renderer.dispose();
    };
  }, []);

  return <canvas className="gl" ref={ref} />;
}
