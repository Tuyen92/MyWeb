// Tải trước tài nguyên để loader biết khi nào mọi thứ đã sẵn sàng.
// Hàm nào lỗi cũng vẫn resolve — một font/ảnh hỏng không được giữ loader mãi.

const FONTS = ['400 16px "Inter"', '700 16px "Unbounded"', '900 16px "Unbounded"', '400 16px "Michroma"'];

export function preloadFonts(timeout = 6000) {
  if (!document.fonts || !document.fonts.load) return Promise.resolve();
  const all = Promise.all(FONTS.map((f) => document.fonts.load(f).catch(() => {}))).then(() =>
    document.fonts.ready
  );
  return Promise.race([all, new Promise((r) => setTimeout(r, timeout))]).catch(() => {});
}

export function preloadImages(srcs) {
  return Promise.all(
    srcs.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => (img.decode ? img.decode().then(resolve, resolve) : resolve());
          img.onerror = resolve;
          img.src = src;
        })
    )
  );
}
