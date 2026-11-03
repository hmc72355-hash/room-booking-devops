import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';
import { App } from './app';
import { RoomSearch } from './features/room-search/room-search';
import { BookingForm } from './features/booking-form/booking-form';

const stay = {
  checkIn: '2099-11-10', checkOut: '2099-11-12', guests: 2, type: 'all',
};

async function setup() {
  await TestBed.configureTestingModule({ imports: [App] }).compileComponents();
  const fixture = TestBed.createComponent(App);
  await fixture.whenStable();
  return fixture;
}

describe('การทำงานร่วมกันของ component', () => {
  it('แสดงโครงหน้าหลักและ component เริ่มต้น', async () => {
    const fixture = await setup();
    const page: HTMLElement = fixture.nativeElement;
    expect(page.querySelector('h1')?.textContent).toContain('เลือกวันพัก');
    expect(page.querySelector('app-room-search')).not.toBeNull();
    expect(page.querySelector('app-booking-history')?.textContent)
      .toContain('ยังไม่มีรายการจอง');
    expect(page.querySelector('app-room-list')).toBeNull();
  });

  it('ค้นหา เลือก จอง และยกเลิกผ่าน component ลูก', async () => {
    const fixture = await setup();
    const page: HTMLElement = fixture.nativeElement;
    const search = fixture.debugElement.query(By.directive(RoomSearch))
      .componentInstance as RoomSearch;
    search.searchForm.setValue(stay);
    search.search();
    await fixture.whenStable();
    expect(page.querySelectorAll('.room-card')).toHaveLength(4);
    (page.querySelector('.room-card button') as HTMLButtonElement).click();
    await fixture.whenStable();
    const form = fixture.debugElement.query(By.directive(BookingForm))
      .componentInstance as BookingForm;
    form.guestForm.setValue({ teamCode: 'TEAM-01' });
    form.book();
    await fixture.whenStable();
    expect(page.querySelector('tbody')?.textContent).toContain('BK-001');
    expect(page.querySelectorAll('.room-card')).toHaveLength(3);
    const button = (text: string) =>
      [...page.querySelectorAll<HTMLButtonElement>('tbody button')]
        .find(item => item.textContent?.trim() === text)!;
    button('ยกเลิก').click();
    await fixture.whenStable();
    expect(fixture.componentInstance.store.bookings()[0].status)
      .toBe('confirmed');
    button('ยืนยันยกเลิก').click();
    await fixture.whenStable();
    expect(fixture.componentInstance.store.bookings()[0].status)
      .toBe('cancelled');
    expect(page.querySelectorAll('.room-card')).toHaveLength(4);
  });

  it('ล้างฟอร์มเมื่อเปลี่ยนห้องและล้างผลเมื่อค้นหาผิด', async () => {
    const fixture = await setup();
    const page: HTMLElement = fixture.nativeElement;
    const search = fixture.debugElement.query(By.directive(RoomSearch))
      .componentInstance as RoomSearch;
    search.searchForm.setValue(stay);
    search.search();
    await fixture.whenStable();
    (page.querySelector('.room-card button') as HTMLButtonElement).click();
    await fixture.whenStable();
    const form = fixture.debugElement.query(By.directive(BookingForm))
      .componentInstance as BookingForm;
    form.guestForm.setValue({ teamCode: 'TEAM-01' });
    (page.querySelectorAll('.room-card button')[1] as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(form.guestForm.controls.teamCode.value).toBe('');
    form.book();
    await fixture.whenStable();
    expect(page.querySelector('.notice')?.textContent).toContain('รหัสทีม');
    search.searchForm.patchValue({ checkOut: stay.checkIn });
    search.search();
    await fixture.whenStable();
    expect(page.querySelector('app-room-list')).toBeNull();
    expect(page.querySelector('app-booking-form')).toBeNull();
    expect(page.querySelector('.notice')?.textContent).toContain('วันออกหลัง');
  });
});
