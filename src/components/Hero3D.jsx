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
    // mobile: thanh địa chỉ co giãn khi cuộn chỉ đổi chiều cao vài chục px -> bỏ qua để scene không giật
    let lastW = window.innerWidth;
    let lastH = window.innerHeight;
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w === lastW && Math.abs(h - lastH) < 160) return;
      lastW = w;
      lastH = h;
      fit();
    };
    window.addEventListener('resize', onResize);

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

    // ---- Rê chuột lên vật thể 3D → đổi con trỏ (sao băng do ShootingStar xử lý, bấm ở đâu cũng bắn) ----
    // canvas có pointer-events: none nên tự kiểm tra: toạ độ chuột nằm trong khung chiếu của chữ, hoặc trúng vòng elip
    const box = new THREE.Box3();
    const corner = new THREE.Vector3();
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const overObject = (cx, cy) => {
      if (!textHolder.children.length) return false;
      const rect = cv.getBoundingClientRect();
      box.setFromObject(textHolder);
      if (box.isEmpty()) return false;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (let i = 0; i < 8; i++) {
        corner.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z).project(cam);
        const x = ((corner.x + 1) / 2) * rect.width + rect.left;
        const y = ((1 - corner.y) / 2) * rect.height + rect.top;
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      }
      if (cx >= minX && cx <= maxX && cy >= minY && cy <= maxY) return true;
      ndc.set(((cx - rect.left) / rect.width) * 2 - 1, -((cy - rect.top) / rect.height) * 2 + 1);
      ray.setFromCamera(ndc, cam);
      return ray.intersectObject(root, true).length > 0;
    };
    // bỏ qua khi bấm vào link / nút / navbar / thẻ liên hệ / cửa sổ Experience
    const ignored = (el) =>
      !!(el && el.closest && el.closest('a, button, input, textarea, nav, [role="dialog"], .cc, .xs'));
    const onObject = (e) =>
      startedRef.current &&
      window.scrollY < window.innerHeight * 0.5 && // chỉ khi đang ở phần đầu trang (canvas còn hiện)
      !ignored(e.target) &&
      overObject(e.clientX, e.clientY);
    const onMove = (e) => document.body.classList.toggle('over-3d', onObject(e));
    window.addEventListener('pointermove', onMove, { passive: true });

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
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
      document.body.classList.remove('over-3d');
      renderer.dispose();
    };
  }, []);

  return <canvas className="gl" ref={ref} />;
}
