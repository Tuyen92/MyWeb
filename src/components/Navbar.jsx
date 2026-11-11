export default function Navbar({ name, links, onContact }) {
  return (
    <nav className="mono">
      <span>{name}</span>
      <div className="links">
        {links.map((n) =>
          n === 'Contact' ? (
            <a
              key={n}
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                onContact();
              }}
            >
              {n}
            </a>
          ) : (
            <a key={n} href={`#${n.toLowerCase()}`}>
              {n}
            </a>
          )
        )}
        <span className="dot" />
      </div>
    </nav>
  );
}
