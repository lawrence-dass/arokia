// Date helpers for the optional Sunday church attendance tracker (Story 5.3).
// Pure, dependency-free — no native module, so the tracker is a Metro-reload change.

// Format a Date as 'YYYY-MM-DD' from LOCAL parts. Never use toISOString(): target users
// are in IST (UTC+5:30), where UTC conversion can shift the calendar day and mark the wrong
// Sunday. Local parts keep the stored date matching what the user tapped.
export function toLocalISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

// Every Sunday (getDay() === 0) of the given month, in chronological order.
// `monthIndex0` is 0-based (0 = January), matching Date.getMonth().
export function getSundaysOfMonth(year: number, monthIndex0: number): Date[] {
  const sundays: Date[] = [];
  const cursor = new Date(year, monthIndex0, 1);
  // Advance to the first Sunday, then step by 7 days until the month rolls over.
  cursor.setDate(1 + ((7 - cursor.getDay()) % 7));
  while (cursor.getMonth() === monthIndex0) {
    sundays.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 7);
  }
  return sundays;
}
