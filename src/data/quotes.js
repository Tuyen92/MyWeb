// Quote will be changed daily. Quote's length should be <= 55 chars
export const QUOTES = [
  { text: 'Seize your moment', author: 'Ernesto de la Cruz' },
  { text: 'Just keep swimming', author: 'Dory' },
  { text: 'To infinity and beyond!', author: 'Buzz Lightyear' },
];

export function quoteOfTheDay(date = new Date()) {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  return QUOTES[day % QUOTES.length];
}
