import Reveal from './Reveal';

export default function Contact({ email }) {
  return (
    <section id="contact" className="contact">
      <Reveal as="h2" className="mono">( Contact )</Reveal>
      <Reveal>
        <a href={`mailto:${email}`}>Let’s talk →</a>
      </Reveal>
    </section>
  );
}
