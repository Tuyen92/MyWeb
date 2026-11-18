import Reveal from './Reveal';
import { CONFIG } from '../config';

const { blackhole, ufo } = CONFIG.assets;

// Pics
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

export default function About({ onOpenProfile }) {

  return (
    <section id="about" className="about">
      <Reveal as="h2" className="mono">( About )</Reveal>
      <div className="about-row">
        <Reveal as="p" effect="tv" delay={100} className="intro-txt">
        Hi, I'm Tuyen Nguyen, also known as <i>Sterling</i>.<br />
        A Software Engineer with 4 years of experience, specializing in Python.<br />
        Always learning. Always building.
        </Reveal>

        <div className="about-figs">
          {FIGS.map((f) => (
            <Reveal key={f.no} as="figure" effect="tv" delay={f.delay} className="fig">
              {/* inner class: floating style; bấm / Enter / Space để mở hồ sơ */}
              <div
                className="fig-in fig-btn"
                style={f.float}
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                aria-label={`Open profile (${f.title})`}
                onClick={(e) => onOpenProfile?.(e.currentTarget, f.src)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenProfile?.(e.currentTarget, f.src);
                  }
                }}
              >
                <div className="fig-frame">
                  <img src={f.src} alt={f.alt} loading="lazy" decoding="async" />
                  <span className="fig-scan" aria-hidden="true" />
                  <span className="fig-open mono" aria-hidden="true">
                    Open file
                  </span>
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
