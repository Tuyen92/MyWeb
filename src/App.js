import { useCallback, useEffect, useRef, useState } from 'react';
import { CONFIG } from './config';
import { EXPERIENCE } from './data/experience';
import { SKILLS } from './data/skills';
import BackgroundEffects from './components/BackgroundEffects';
import Navbar from './components/Navbar';
import Hero3D from './components/Hero3D';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Contact from './components/Contact';
import DailyQuote from './components/DailyQuote';
import ShootingStar from './components/ShootingStar';
import ContactCard from './components/ContactCard';
import Footer from './components/Footer';
import Loader from './components/Loader';
import { preloadFonts, preloadImages } from './lib/preload';
import blackhole from './assets/about-blackhole.webp';
import ufo from './assets/about-ufo.webp';

const MAX_WAIT = 10000; // quá lâu (mạng chậm / lỗi) thì vẫn cho vào trang

export default function App() {
  const [cardOpen, setCardOpen] = useState(false);
  const [placement, setPlacement] = useState('center');
  const autoOpened = useRef(false); // thẻ do cuộn tới mục Contact tự mở (khác với bấm nút)
  const dismissed = useRef(false); // người dùng đã tự đóng thẻ trong lần ở mục Contact này
  const cardOpenRef = useRef(false); // trạng thái mở hiện tại, để observer đọc được
  cardOpenRef.current = cardOpen;

  // Nút Contact trên navbar: giữ nguyên như cũ (mở thẻ giữa màn hình)
  const openCard = useCallback(() => {
    autoOpened.current = false;
    setPlacement('center');
    setCardOpen(true);
  }, []);
  // Người dùng kéo thẻ đi chỗ khác: giữ nguyên thẻ, không tự ẩn nữa (chỉ mất khi bấm X)
  const pinCard = useCallback(() => {
    autoOpened.current = false;
  }, []);
  const closeCard = useCallback(() => {
    if (autoOpened.current) dismissed.current = true;
    setCardOpen(false);
  }, []);

  // Các việc cần xong trước khi hiện trang
  const [tasks, setTasks] = useState({ fonts: false, images: false, scene: false });
  const [loaded, setLoaded] = useState(false);
  const mark = useCallback((k) => setTasks((t) => (t[k] ? t : { ...t, [k]: true })), []);
  const onScene = useCallback(() => mark('scene'), [mark]);
  const onComplete = useCallback(() => setLoaded(true), []);

  useEffect(() => {
    preloadFonts().then(() => mark('fonts'));
    preloadImages([blackhole, ufo]).then(() => mark('images'));
    const t = setTimeout(() => setTasks({ fonts: true, images: true, scene: true }), MAX_WAIT);
    return () => clearTimeout(t);
  }, [mark]);

  // body.loaded: mở khoá cuộn + cho navbar, hero, canvas hiện ra (xem CSS)
  useEffect(() => {
    document.body.classList.toggle('loaded', loaded);
  }, [loaded]);

  // Cuộn tới mục Contact thì thẻ tự hiện; cuộn đi chỗ khác thì tự ẩn
  useEffect(() => {
    if (!loaded) return undefined;
    const el = document.getElementById('contact');
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (dismissed.current) return;
          if (cardOpenRef.current) return; // thẻ đã mở (bấm navbar / đã kéo): giữ nguyên
          autoOpened.current = true;
          setPlacement('contact');
          setCardOpen(true);
        } else {
          dismissed.current = false;
          if (autoOpened.current) {
            autoOpened.current = false;
            setCardOpen(false);
          }
        }
      },
      { threshold: 0.45 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loaded]);

  return (
    <>
      <Loader done={Object.values(tasks).filter(Boolean).length} total={3} loaded={loaded} onComplete={onComplete} />
      <BackgroundEffects />
      <Navbar name={CONFIG.name} links={CONFIG.nav} onContact={openCard} />
      <Hero3D started={loaded} onReady={onScene} />
      <Hero role={CONFIG.role} place={CONFIG.place} />
      <DailyQuote />
      <ShootingStar />
      <About />
      <Skills items={SKILLS} />
      <Experience items={EXPERIENCE} />
      <Contact />
      <Footer name={CONFIG.name} />
      <ContactCard open={cardOpen} onClose={closeCard} placement={placement} onMove={pinCard} {...CONFIG.contact} />
    </>
  );
}
