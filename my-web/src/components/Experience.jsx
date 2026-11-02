import Reveal from './Reveal';

export default function Experience({ items }) {
  return (
    <section id="experience" className="exp">
      <Reveal as="h2" className="mono">( Experience )</Reveal>
      {items.map((e, i) => (
        <Reveal key={`${e.company}-${e.period}`} delay={i * 80}>
          <div className="exp-row">
            <small className="mono exp-period">{e.period}</small>
            <div className="exp-main">
              <em>{e.company}</em>
              <span className="exp-role">{e.role}</span>
            </div>
            <small className="mono" style={{ color: 'var(--mut)' }}>{e.stack}</small>
          </div>
        </Reveal>
      ))}
    </section>
  );
}
