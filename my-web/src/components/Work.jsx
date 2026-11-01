import Reveal from './Reveal';

export default function Work({ items }) {
  return (
    <section id="work" className="work">
      <Reveal as="h2" className="mono">( Selected Work )</Reveal>
      {items.map((w, i) => (
        <Reveal key={w.id} delay={i * 80}>
          <a href="#work">
            <small className="mono">{w.id}</small>
            <em>{w.title}</em>
            <small className="mono" style={{ color: 'var(--mut)' }}>{w.meta}</small>
          </a>
        </Reveal>
      ))}
    </section>
  );
}
