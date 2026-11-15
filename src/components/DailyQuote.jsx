import { useEffect, useState } from 'react';
import { quoteOfTheDay } from '../data/quotes';

// Câu trích dẫn dọc, cố định ở góc phải màn hình khi cuộn; mỗi ngày một câu.
export default function DailyQuote() {
  const [q, setQ] = useState(() => quoteOfTheDay());

  // Nếu để trang mở qua nửa đêm thì tự đổi sang câu mới
  useEffect(() => {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5);
    const t = setTimeout(() => setQ(quoteOfTheDay()), next - now);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <aside className="vt" aria-label="Quote of the day">
      <i />
      <div className="mono vt-text">
        <span className="vt-quote">{q.text} ✦ </span>
        <span className="vt-author">{q.author}</span>
      </div>
    </aside>
  );
}
