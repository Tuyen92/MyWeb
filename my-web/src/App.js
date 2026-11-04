import { useCallback, useEffect, useState } from 'react';
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
import ContactCard from './components/ContactCard';
import Footer from './components/Footer';
import Loader from './components/Loader';
import { preloadFonts, preloadImages } from './lib/preload';
import blackhole from './assets/about-blackhole.webp';
import ufo from './assets/about-ufo.webp';

const MAX_WAIT = 10000; // quá lâu (mạng chậm / lỗi) thì vẫn cho vào trang

export default function App() {
  const [cardOpen, setCardOpen] = useState(false);
  const openCard = useCallback(() => setCardOpen(true), []);
  const closeCard = useCallback(() => setCardOpen(false), []);

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

  return (
    <>
      <Loader done={Object.values(tasks).filter(Boolean).length} total={3} loaded={loaded} onComplete={onComplete} />
      <BackgroundEffects />
      <Navbar name={CONFIG.name} links={CONFIG.nav} onContact={openCard} />
      <Hero3D started={loaded} onReady={onScene} />
      <Hero role={CONFIG.role} place={CONFIG.place} vertical={CONFIG.vertical} />
      <About />
      <Skills items={SKILLS} />
      <Experience items={EXPERIENCE} />
      <Contact names={CONFIG.aliases} fonts={CONFIG.aliasFonts} onOpen={openCard} />
      <Footer name={CONFIG.name} />
      <ContactCard open={cardOpen} onClose={closeCard} {...CONFIG.contact} />
    </>
  );
}
