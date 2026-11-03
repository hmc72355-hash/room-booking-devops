import { Component, computed, effect, inject, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Room, StayQuery } from '../../models/booking';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CurrencyPipe, ReactiveFormsModule, MatButtonModule,
    MatCardModule, MatFormFieldModule, MatInputModule],
  templateUrl: './booking-form.html',
  styleUrl: './booking-form.scss',
})
export class BookingForm {
  private readonly fb = inject(FormBuilder);
  readonly room = input.required<Room>();
  readonly stay = input.required<StayQuery>();
  readonly nights = input.required<number>();
  readonly confirmed = output<string>();
  readonly invalidBooking = output<string>();
  readonly guestForm = this.fb.nonNullable.group({
    teamCode: ['', [Validators.required,
      Validators.pattern(/^[A-Za-z0-9-]{2,16}$/)]],
  });
  readonly total = computed(() => this.room().price * this.nights());

  constructor() {
    effect(() => {
      this.room();
      this.stay();
      this.guestForm.reset();
    });
  }

  book(): void {
    if (this.guestForm.invalid) {
      this.guestForm.markAllAsTouched();
      this.invalidBooking.emit('กรอกรหัสทีมให้ถูกต้องก่อนยืนยัน');
      return;
    }
    this.confirmed.emit(this.guestForm.getRawValue().teamCode);
  }
}
