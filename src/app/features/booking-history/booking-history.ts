import { Component, input, output, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Booking } from '../../models/booking';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [CurrencyPipe, MatButtonModule],
  templateUrl: './booking-history.html',
  styleUrl: './booking-history.scss',
})
export class BookingHistory {
  readonly bookings = input.required<readonly Booking[]>();
  readonly cancelRequested = output<string>();
  readonly pendingCancel = signal('');

  confirmCancel(id: string): void {
    this.cancelRequested.emit(id);
    this.pendingCancel.set('');
  }
}
