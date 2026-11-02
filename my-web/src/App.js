import { useCallback, useState } from 'react';
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

export default function App() {
  const [cardOpen, setCardOpen] = useState(false);
  const openCard = useCallback(() => setCardOpen(true), []);
  const closeCard = useCallback(() => setCardOpen(false), []);

  return (
    <>
      <BackgroundEffects />
      <Navbar name={CONFIG.name} links={CONFIG.nav} onContact={openCard} />
      <Hero3D />
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
