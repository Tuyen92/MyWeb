import Reveal from './Reveal';
import blackhole from '../assets/about-blackhole.webp';
import ufo from '../assets/about-ufo.webp';

// Ảnh minh hoạ cho phần About (phong cách retro-futuristic: khung HUD, scanline, nhãn mono)
const FIGS = [
  {
    src: blackhole,
    alt: 'img.01',
    no: '01',
    title: 'Event Horizon',
    left: 'SECTOR 7G',
    right: 'LOCKED',
    delay: 150,
    float: { '--fd': '11.5s', '--fdel': '-3s', '--fx': '7px', '--fy': '12px', '--fr': '-1deg' },
  },
  {
    src: ufo,
    alt: 'img.02',
    no: '02',
    title: 'Unidentified Object',
    left: 'SIGNAL 0x2F',
    right: 'TRACKING',
    delay: 350,
    float: { '--fd': '9.5s', '--fdel': '-8s', '--fx': '-9px', '--fy': '-14px', '--fr': '1.3deg' },
  },
];

export default function About() {
  return (
    <section id="about" className="about">
      <Reveal as="h2" className="mono">( About )</Reveal>
      <div className="about-row">
        <Reveal as="p" effect="tv" delay={100} className="intro-txt">
        Xin Chào, I’m Tuyen Nguyen Le aka Sterling Nguyen. I'm a Software Developer with 4 years of experience. I'm willing to learn new things in tech and dedicate myself to contribute the IT domain. Accepting challenges and working hard are my keys.
        </Reveal>

        <div className="about-figs">
          {FIGS.map((f) => (
            <Reveal key={f.no} as="figure" effect="tv" delay={f.delay} className="fig">
              {/* inner class: floating style */}
              <div className="fig-in" style={f.float}>
                <div className="fig-frame">
                  <img src={f.src} alt={f.alt} loading="lazy" decoding="async" />
                  <span className="fig-scan" aria-hidden="true" />
                </div>
                <figcaption className="fig-foot mono">
                  <span>{f.left}</span>
                  <span>{f.right}</span>
                </figcaption>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
