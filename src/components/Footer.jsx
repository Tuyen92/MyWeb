import { useEffect, useState } from 'react';

// Giờ Việt Nam (UTC+7) bất kể máy người xem đang ở múi giờ nào
const fmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Ho_Chi_Minh',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});
const vnTime = () => fmt.format(new Date());

export default function Footer({ name }) {
  const [time, setTime] = useState(vnTime);

  // chỉ setState khi chuỗi HH:MM đổi, nên thực tế chỉ render lại mỗi phút
  useEffect(() => {
    const id = setInterval(() => setTime(vnTime()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="mono">
      <span>© 2026 {name}</span>
      <span>
        HCMC, Vietnam - <time dateTime={time}>{time}</time>
      </span>
    </footer>
  );
}
