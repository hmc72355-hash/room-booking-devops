import { Injectable, signal } from '@angular/core';
import { ROOMS } from '../data/rooms';
import { Booking, Room, StayQuery } from '../models/booking';
import { nightsBetween, overlaps, queryError } from '../utils/stay';

@Injectable({ providedIn: 'root' })
export class BookingService {
  readonly rooms = ROOMS;
  private readonly records = signal<Booking[]>([]);
  readonly bookings = this.records.asReadonly();

  available(room: Room, query: StayQuery): boolean {
    return !queryError(query) && room.capacity >= query.guests &&
      !this.records().some(booking =>
        booking.roomId === room.id && booking.status === 'confirmed' &&
        overlaps(query.checkIn, query.checkOut,
          booking.checkIn, booking.checkOut));
  }

  reserve(roomId: number, query: StayQuery, team: string): Booking {
    const error = queryError(query);
    if (error) throw new Error(error);
    const teamCode = team.trim().toUpperCase();
    if (!/^[A-Z0-9-]{2,16}$/.test(teamCode)) {
      throw new Error('ใช้รหัสทีม A-Z 0-9 หรือ - จำนวน 2 ถึง 16 ตัว');
    }
    const room = this.rooms.find(item => item.id === roomId);
    // ตรวจอีกครั้งขณะกดยืนยัน ไม่เชื่อเฉพาะผลค้นหาเก่า
    if (!room || !this.available(room, query)) {
      throw new Error('ห้องนี้ไม่ว่างหรือรองรับจำนวนผู้พักไม่พอ');
    }
    const nights = nightsBetween(query.checkIn, query.checkOut);
    const booking: Booking = {
      id: `BK-${String(this.records().length + 1).padStart(3, '0')}`,
      roomId: room.id, roomName: room.name, teamCode,
      checkIn: query.checkIn, checkOut: query.checkOut,
      guests: query.guests, nights, total: nights * room.price,
      status: 'confirmed',
    };
    this.records.update(items => [...items, booking]);
    return booking;
  }

  cancel(id: string): void {
    this.records.update(items => items.map(item =>
      item.id === id ? { ...item, status: 'cancelled' } : item));
  }
}
