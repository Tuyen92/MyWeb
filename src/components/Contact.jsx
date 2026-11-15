import Reveal from './Reveal';
import ContactConstellation from './ContactConstellation';

// Mục Contact chỉ còn nhãn "( Contact )" + chòm sao; thẻ liên hệ tự hiện khi cuộn tới (xem App.js)
export default function Contact() {
  return (
    <section id="contact" className="contact">
      <ContactConstellation />
      <Reveal as="h2" className="mono">( Contact )</Reveal>
    </section>
  );
}
