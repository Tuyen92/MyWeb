export default function Hero({ role, place, vertical }) {
  return (
    <header className="hero">
      <div className="l1 mono">
        {role.map((r) => (
          <div key={r}>{r}</div>
        ))}
        <i />
      </div>
      <div className="l2 mono" style={{ fontSize: 10 }}>
        {place.map((r) => (
          <div key={r}>{r}</div>
        ))}
        <i />
      </div>
      <div className="vt">
        <i />
        <span className="mono">{vertical}</span>
      </div>
    </header>
  );
}
