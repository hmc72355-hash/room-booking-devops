import { StayQuery } from '../models/booking';

const DAY = 86_400_000;

export function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

function dayValue(value: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
  const time = Date.parse(`${value}T00:00:00Z`);
  if (!Number.isFinite(time)) return NaN;
  return new Date(time).toISOString().slice(0, 10) === value
    ? time : NaN;
}

export function nightsBetween(start: string, end: string): number {
  return (dayValue(end) - dayValue(start)) / DAY;
}

export function queryError(
  query: StayQuery, today = todayIso(),
): string {
  const nights = nightsBetween(query.checkIn, query.checkOut);
  if (!Number.isInteger(nights) || nights <= 0) {
    return 'เลือกวันออกหลังวันเข้าอย่างน้อย 1 คืน';
  }
  if (query.checkIn < today) return 'วันเข้าพักต้องไม่ย้อนหลัง';
  if (nights > 30) return 'ระบบฝึกรองรับการพักไม่เกิน 30 คืน';
  if (!Number.isInteger(query.guests) ||
      query.guests < 1 || query.guests > 4) {
    return 'จำนวนผู้เข้าพักต้องเป็นจำนวนเต็ม 1 ถึง 4 คน';
  }
  return '';
}

export function overlaps(
  start: string, end: string, otherStart: string, otherEnd: string,
): boolean {
  // ช่วง [วันเข้า, วันออก) วันออกเดิมจึงเป็นวันเข้าใหม่ได้
  return start < otherEnd && otherStart < end;
}
