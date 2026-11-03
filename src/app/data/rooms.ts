import { Room } from '../models/booking';

// ข้อมูลสมมติ ห้องแต่ละ id เป็นห้องจริงหนึ่งห้องในระบบฝึก
export const ROOMS: readonly Room[] = [
  {
    id: 101, name: 'ห้องสายลม 101', type: 'Standard',
    capacity: 2, price: 1200,
    description: 'เตียงคู่ Wi-Fi และโต๊ะทำงาน',
  },
  {
    id: 102, name: 'ห้องสายลม 102', type: 'Standard',
    capacity: 2, price: 1200,
    description: 'เตียงเดี่ยวสองเตียง เหมาะกับเพื่อนร่วมทีม',
  },
  {
    id: 201, name: 'ห้องอันดามัน 201', type: 'Deluxe',
    capacity: 3, price: 1900,
    description: 'ห้องกว้างพร้อมมุมนั่งเล่นและระเบียง',
  },
  {
    id: 301, name: 'ห้องครอบครัว 301', type: 'Family',
    capacity: 4, price: 2800,
    description: 'เตียงใหญ่สองเตียงและพื้นที่ส่วนกลาง',
  },
];
