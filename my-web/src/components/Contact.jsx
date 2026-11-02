import Reveal from './Reveal';
import GlitchCycle from './GlitchCycle';

export default function Contact({ names, fonts, onOpen }) {
  return (
    <section id="contact" className="contact">
      <Reveal as="h2" className="mono">( Contact )</Reveal>
      <Reveal effect="tv">
        <button
          type="button"
          className="cta"
          onClick={onOpen}
          aria-label={`Reach out to ${names[0]}`}
        >
          <span aria-hidden="true">
            Reach out to <GlitchCycle words={names} fonts={fonts} className="cta-name" />
          </span>
        </button>
      </Reveal>
    </section>
  );
}
