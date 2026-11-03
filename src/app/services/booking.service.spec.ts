import { describe, expect, it } from 'vitest';
import { BookingService } from './booking.service';
import { StayQuery } from '../models/booking';
import { nightsBetween, overlaps, queryError } from '../utils/stay';

const stay: StayQuery = {
  checkIn: '2099-11-10', checkOut: '2099-11-12', guests: 2, type: 'all',
};

describe('กฎการจองห้องพัก', () => {
  it('คิดราคา 1200 x 2 คืน และปรับรหัสทีม', () => {
    const store = new BookingService();
    const booking = store.reserve(101, stay, 'team-01');
    expect(booking.total).toBe(2400);
    expect(booking.teamCode).toBe('TEAM-01');
    expect(store.bookings()).toHaveLength(1);
  });
  it('ปฏิเสธห้องเดียวกันที่ช่วงวันพักทับกัน', () => {
    const store = new BookingService();
    store.reserve(101, stay, 'TEAM-01');
    expect(() => store.reserve(101, stay, 'TEAM-02')).toThrow();
    expect(store.bookings()).toHaveLength(1);
  });
  it('รับการเข้าพักใหม่ตรงกับวันออกเดิม', () => {
    expect(overlaps('2099-11-12', '2099-11-13',
      stay.checkIn, stay.checkOut)).toBe(false);
    const store = new BookingService();
    store.reserve(101, stay, 'TEAM-01');
    const next = { ...stay, checkIn: '2099-11-12', checkOut: '2099-11-13' };
    expect(store.reserve(101, next, 'TEAM-02').total).toBe(1200);
  });
  it('ยกเลิกแล้วห้องกลับมาว่าง', () => {
    const store = new BookingService();
    const booking = store.reserve(101, stay, 'TEAM-01');
    store.cancel(booking.id);
    expect(store.available(store.rooms[0], stay)).toBe(true);
    expect(store.bookings()[0].status).toBe('cancelled');
  });
  it('ปฏิเสธผู้พักเกินความจุและห้องที่ไม่มีจริง', () => {
    const store = new BookingService();
    expect(() => store.reserve(101, { ...stay, guests: 3 }, 'T1')).toThrow();
    expect(() => store.reserve(999, stay, 'T1')).toThrow();
  });
  it('ปฏิเสธวันเดียวกัน ย้อนหลัง และพักเกิน 30 คืน', () => {
    expect(queryError({ ...stay, checkOut: stay.checkIn })).not.toBe('');
    expect(queryError(stay, '2100-01-01')).not.toBe('');
    expect(queryError({ ...stay, checkOut: '2099-12-20' })).not.toBe('');
  });
  it('ไม่ยอมรับวันที่ไม่มีจริงและจำนวนคนเป็นทศนิยม', () => {
    expect(nightsBetween('2099-02-30', '2099-03-03')).toBeNaN();
    expect(queryError({ ...stay, guests: 1.5 })).not.toBe('');
  });
  it('ปฏิเสธรหัสทีมที่มีอักขระไม่อนุญาต', () => {
    expect(() => new BookingService().reserve(101, stay, '<script>')).toThrow();
  });
});
