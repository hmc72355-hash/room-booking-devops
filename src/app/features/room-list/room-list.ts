import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Room, StayQuery } from '../../models/booking';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [CurrencyPipe, MatButtonModule, MatCardModule],
  templateUrl: './room-list.html',
  styleUrl: './room-list.scss',
})
export class RoomList {
  readonly rooms = input.required<readonly Room[]>();
  readonly stay = input.required<StayQuery>();
  readonly nights = input.required<number>();
  readonly roomSelected = output<Room>();
}
