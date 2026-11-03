import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { StayQuery } from '../../models/booking';
import { queryError, todayIso } from '../../utils/stay';

@Component({
  selector: 'app-room-search',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './room-search.html',
  styleUrl: './room-search.scss',
})
export class RoomSearch {
  private readonly fb = inject(FormBuilder);
  readonly searched = output<StayQuery>();
  readonly invalidSearch = output<string>();
  readonly today = todayIso();
  readonly searchForm = this.fb.nonNullable.group({
    checkIn: ['', Validators.required],
    checkOut: ['', Validators.required],
    guests: [1, [Validators.required, Validators.min(1), Validators.max(4)]],
    type: ['all'],
  });

  search(): void {
    const query = this.searchForm.getRawValue();
    const error = queryError(query);
    if (this.searchForm.invalid || error) {
      this.searchForm.markAllAsTouched();
      this.invalidSearch.emit(error || 'กรอกเงื่อนไขการค้นหาให้ครบ');
      return;
    }
    this.searched.emit(query);
  }
}
