import Reveal from './Reveal';

// số giả ngẫu nhiên cố định theo (chỉ số, khoá) để mỗi chữ trôi một kiểu riêng
const r = (i, k) => {
  const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return v - Math.floor(v);
};
const sign = (i, k) => (r(i, k) > 0.5 ? 1 : -1);

export default function Skills({ items }) {
  return (
    <section id="skills" className="skills">
      <Reveal as="h2" className="mono">( Skills )</Reveal>
      <ul className="skills-cloud">
        {items.map((s, i) => (
          <Reveal
            key={s.name}
            as="li"
            effect="tv"
            // so le thời gian để các chữ nhảy ra lộn xộn, không theo thứ tự
            delay={((i * 7) % 11) * 90}
            className={`skill t${s.tier}`}
            style={{ '--x': `${s.x}%`, '--y': `${s.y}%` }}
          >
            {/* span trong: lơ lửng như phi hành gia trong không trọng lực */}
            <span
              className="skill-in"
              style={{
                '--fd': `${(9 + r(i, 1) * 7).toFixed(1)}s`,
                '--fdel': `${(-r(i, 2) * 16).toFixed(1)}s`,
                '--fx': `${(sign(i, 3) * (4 + r(i, 4) * 7)).toFixed(1)}px`,
                '--fy': `${(sign(i, 5) * (5 + r(i, 6) * 8)).toFixed(1)}px`,
                '--fr': `${(sign(i, 7) * (0.6 + r(i, 8) * 1.6)).toFixed(2)}deg`,
              }}
            >
              {s.name}
            </span>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
