import { Component, computed, inject, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BookingService } from './services/booking.service';
import { Room, StayQuery } from './models/booking';
import { nightsBetween } from './utils/stay';
import { RoomSearch } from './features/room-search/room-search';
import { RoomList } from './features/room-list/room-list';
import { BookingForm } from './features/booking-form/booking-form';
import { BookingHistory } from './features/booking-history/booking-history';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatToolbarModule, RoomSearch, RoomList, BookingForm, BookingHistory],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly store = inject(BookingService);
  readonly query = signal<StayQuery | null>(null);
  readonly selected = signal<Room | null>(null);
  readonly notice = signal('');
  readonly results = computed(() => {
    const query = this.query();
    if (!query) return [];
    return this.store.rooms.filter(room =>
      (query.type === 'all' || room.type === query.type) &&
      this.store.available(room, query));
  });
  readonly nights = computed(() => {
    const query = this.query();
    return query ? nightsBetween(query.checkIn, query.checkOut) : 0;
  });

  search(query: StayQuery): void {
    this.selected.set(null);
    this.query.set(query);
    this.notice.set('ค้นหาแล้ว เลือกห้องจากผลลัพธ์ด้านล่าง');
  }

  rejectSearch(message: string): void {
    this.selected.set(null);
    this.query.set(null);
    this.notice.set(message);
  }

  select(room: Room): void {
    this.selected.set(room);
    this.notice.set('เลือกห้องแล้ว ตรวจสรุปและกรอกรหัสทีม');
  }

  book(teamCode: string): void {
    const room = this.selected();
    const query = this.query();
    if (!room || !query) return;
    try {
      const booking = this.store.reserve(room.id, query, teamCode);
      this.selected.set(null);
      this.notice.set(`จองสำเร็จ ${booking.id} ข้อมูลอยู่ในหน้านี้เท่านั้น`);
    } catch (error) {
      this.notice.set(error instanceof Error ? error.message : 'จองไม่สำเร็จ');
    }
  }

  cancel(id: string): void {
    this.store.cancel(id);
    this.notice.set(`ยกเลิก ${id} แล้ว ห้องกลับมาว่างตามช่วงวันที่`);
  }
}
