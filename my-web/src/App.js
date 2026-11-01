import { useCallback, useState } from 'react';
import { CONFIG } from './config';
import { WORKS } from './data/works';
import BackgroundEffects from './components/BackgroundEffects';
import Navbar from './components/Navbar';
import Hero3D from './components/Hero3D';
import Hero from './components/Hero';
import About from './components/About';
import Work from './components/Work';
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
      <Work items={WORKS} />
      <Contact email={CONFIG.email} />
      <Footer name={CONFIG.name} />
      <ContactCard open={cardOpen} onClose={closeCard} {...CONFIG.contact} />
    </>
  );
}
