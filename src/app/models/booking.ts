export interface Room {
  id: number;
  name: string;
  type: 'Standard' | 'Deluxe' | 'Family';
  capacity: number;
  price: number;
  description: string;
}

export interface StayQuery {
  checkIn: string;
  checkOut: string;
  guests: number;
  type: string;
}

export interface Booking {
  id: string;
  roomId: number;
  roomName: string;
  teamCode: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  total: number;
  status: 'confirmed' | 'cancelled';
}
