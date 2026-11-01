import Reveal from './Reveal';

export default function About() {
  return (
    <section id="about" className="about">
      <Reveal as="h2" className="mono">( About )</Reveal>
      <Reveal as="p" delay={100}>
        Mình là Tuyên, frontend developer yêu thích giao diện tối giản, chuyển động tinh tế và những chi tiết nhỏ làm nên cảm giác cao cấp.
      </Reveal>
    </section>
  );
}
