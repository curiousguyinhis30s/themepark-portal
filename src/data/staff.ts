/**
 * Staff Management Data
 */

export interface Staff {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  department: string;
  role: string;
  zoneAssignment: string | null;
  hireDate: string;
  status: 'active' | 'on_leave' | 'inactive' | 'training';
  shiftStatus: 'on_duty' | 'off_duty' | 'break' | 'overtime';
  currentShift: {
    start: string;
    end: string;
    type: 'morning' | 'afternoon' | 'night' | 'split';
  } | null;
  certifications: string[];
  languages: string[];
  rating: number;
  reviewCount: number;
  attendance: {
    present: number;
    absent: number;
    late: number;
    totalDays: number;
  };
  contact: {
    emergencyName: string;
    emergencyPhone: string;
    address: string;
  };
}

export const staff: Staff[] = [
  {
    id: 'staff_001',
    employeeId: 'EMP-2019-0342',
    firstName: 'Ahmad',
    lastName: 'bin Hassan',
    email: 'ahmad.hassan@themepark.my',
    phone: '+60 12-345-6789',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad',
    department: 'Operations',
    role: 'Ride Operator - Senior',
    zoneAssignment: 'zone_001',
    hireDate: '2019-03-15',
    status: 'active',
    shiftStatus: 'on_duty',
    currentShift: { start: '08:00', end: '16:00', type: 'morning' },
    certifications: ['Coaster Operations', 'First Aid', 'Emergency Evacuation'],
    languages: ['Malay', 'English', 'Mandarin'],
    rating: 4.8,
    reviewCount: 156,
    attendance: { present: 245, absent: 3, late: 7, totalDays: 255 },
    contact: { emergencyName: 'Siti Aminah', emergencyPhone: '+60 12-111-2222', address: 'Petaling Jaya, Selangor' },
  },
  {
    id: 'staff_002',
    employeeId: 'EMP-2021-0891',
    firstName: 'Priya',
    lastName: 'Nair',
    email: 'priya.nair@themepark.my',
    phone: '+60 13-456-7890',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    department: 'Guest Services',
    role: 'Guest Relations Specialist',
    zoneAssignment: null,
    hireDate: '2021-06-01',
    status: 'active',
    shiftStatus: 'on_duty',
    currentShift: { start: '09:00', end: '17:00', type: 'morning' },
    certifications: ['Guest Services Excellence', 'Conflict Resolution', 'First Aid'],
    languages: ['English', 'Malay', 'Tamil', 'Hindi'],
    rating: 4.9,
    reviewCount: 89,
    attendance: { present: 180, absent: 2, late: 3, totalDays: 185 },
    contact: { emergencyName: 'Raj Nair', emergencyPhone: '+60 13-333-4444', address: 'Shah Alam, Selangor' },
  },
  {
    id: 'staff_003',
    employeeId: 'EMP-2018-0156',
    firstName: 'Wei Lin',
    lastName: 'Tan',
    email: 'weilin.tan@themepark.my',
    phone: '+60 11-234-5678',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=WeiLin',
    department: 'Maintenance',
    role: 'Technical Engineer',
    zoneAssignment: null,
    hireDate: '2018-09-20',
    status: 'active',
    shiftStatus: 'break',
    currentShift: { start: '06:00', end: '14:00', type: 'morning' },
    certifications: ['Mechanical Engineering', 'Electrical Safety', 'Coaster Maintenance Specialist'],
    languages: ['Mandarin', 'English', 'Malay'],
    rating: 4.7,
    reviewCount: 42,
    attendance: { present: 298, absent: 5, late: 2, totalDays: 305 },
    contact: { emergencyName: 'Tan Mei Ling', emergencyPhone: '+60 11-555-6666', address: 'Subang Jaya, Selangor' },
  },
  {
    id: 'staff_004',
    employeeId: 'EMP-2022-1203',
    firstName: 'Sarah',
    lastName: 'Abdullah',
    email: 'sarah.abdullah@themepark.my',
    phone: '+60 17-890-1234',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    department: 'Food & Beverage',
    role: 'Restaurant Supervisor',
    zoneAssignment: 'zone_004',
    hireDate: '2022-02-14',
    status: 'active',
    shiftStatus: 'on_duty',
    currentShift: { start: '10:00', end: '18:00', type: 'afternoon' },
    certifications: ['Food Safety', 'ServSafe Manager', 'Hospitality Management'],
    languages: ['Malay', 'English'],
    rating: 4.6,
    reviewCount: 67,
    attendance: { present: 145, absent: 4, late: 6, totalDays: 155 },
    contact: { emergencyName: 'Fatimah Abdullah', emergencyPhone: '+60 17-777-8888', address: 'Klang, Selangor' },
  },
  {
    id: 'staff_005',
    employeeId: 'EMP-2020-0567',
    firstName: 'Raj',
    lastName: 'Kumar',
    email: 'raj.kumar@themepark.my',
    phone: '+60 19-012-3456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raj',
    department: 'Security',
    role: 'Security Team Lead',
    zoneAssignment: null,
    hireDate: '2020-01-08',
    status: 'active',
    shiftStatus: 'off_duty',
    currentShift: null,
    certifications: ['Security Operations', 'Crowd Management', 'Emergency Response', 'First Aid'],
    languages: ['English', 'Malay', 'Tamil'],
    rating: 4.8,
    reviewCount: 38,
    attendance: { present: 220, absent: 1, late: 0, totalDays: 221 },
    contact: { emergencyName: 'Lakshmi Kumar', emergencyPhone: '+60 19-999-0000', address: 'Puchong, Selangor' },
  },
  {
    id: 'staff_006',
    employeeId: 'EMP-2023-0089',
    firstName: 'Michelle',
    lastName: 'Wong',
    email: 'michelle.wong@themepark.my',
    phone: '+60 16-567-8901',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michelle',
    department: 'Entertainment',
    role: 'Character Performer',
    zoneAssignment: 'zone_004',
    hireDate: '2023-04-01',
    status: 'active',
    shiftStatus: 'on_duty',
    currentShift: { start: '09:00', end: '17:00', type: 'morning' },
    certifications: ['Performance Arts', 'Child Safety', 'First Aid'],
    languages: ['English', 'Mandarin', 'Malay'],
    rating: 4.9,
    reviewCount: 234,
    attendance: { present: 95, absent: 2, late: 1, totalDays: 98 },
    contact: { emergencyName: 'Wong Mei Fong', emergencyPhone: '+60 16-123-4567', address: 'Damansara, Selangor' },
  },
  {
    id: 'staff_007',
    employeeId: 'EMP-2019-0789',
    firstName: 'Amir',
    lastName: 'Razak',
    email: 'amir.razak@themepark.my',
    phone: '+60 18-234-5678',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amir',
    department: 'Operations',
    role: 'Area Manager',
    zoneAssignment: 'zone_002',
    hireDate: '2019-11-15',
    status: 'active',
    shiftStatus: 'on_duty',
    currentShift: { start: '08:00', end: '16:00', type: 'morning' },
    certifications: ['Operations Management', 'Leadership Excellence', 'Safety Coordinator'],
    languages: ['Malay', 'English', 'Arabic'],
    rating: 4.7,
    reviewCount: 28,
    attendance: { present: 238, absent: 6, late: 4, totalDays: 248 },
    contact: { emergencyName: 'Nurul Razak', emergencyPhone: '+60 18-456-7890', address: 'Cyberjaya, Selangor' },
  },
  {
    id: 'staff_008',
    employeeId: 'EMP-2021-0445',
    firstName: 'Jessica',
    lastName: 'Lee',
    email: 'jessica.lee@themepark.my',
    phone: '+60 14-678-9012',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
    department: 'Retail',
    role: 'Merchandise Manager',
    zoneAssignment: 'zone_005',
    hireDate: '2021-08-22',
    status: 'on_leave',
    shiftStatus: 'off_duty',
    currentShift: null,
    certifications: ['Retail Management', 'Inventory Control', 'Visual Merchandising'],
    languages: ['English', 'Mandarin', 'Malay', 'Cantonese'],
    rating: 4.5,
    reviewCount: 56,
    attendance: { present: 165, absent: 8, late: 5, totalDays: 178 },
    contact: { emergencyName: 'Lee Kok Wai', emergencyPhone: '+60 14-890-1234', address: 'Bangsar, KL' },
  },
];

export const getStaffById = (id: string) => staff.find((s) => s.id === id);
export const getStaffByDepartment = (department: string) => staff.filter((s) => s.department === department);
export const getOnDutyStaff = () => staff.filter((s) => s.shiftStatus === 'on_duty');
export const getStaffByZone = (zoneId: string) => staff.filter((s) => s.zoneAssignment === zoneId);
export const getDepartments = () => [...new Set(staff.map((s) => s.department))];
