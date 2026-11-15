export default function Hero({ role, place }) {
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
    </header>
  );
}
