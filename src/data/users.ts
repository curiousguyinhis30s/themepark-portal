/**
 * User/Guest Data for Admin Management
 */

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar: string;
  membershipTier: 'guest' | 'silver' | 'gold' | 'platinum';
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification';
  registeredAt: string;
  lastVisit: string | null;
  totalVisits: number;
  totalSpent: number;
  country: string;
  state: string;
  preferences: {
    newsletter: boolean;
    sms: boolean;
    pushNotifications: boolean;
    language: string;
  };
  tickets: {
    active: number;
    used: number;
    expired: number;
  };
  reviews: number;
  favoriteAttractions: string[];
}

export const users: User[] = [
  {
    id: 'user_001',
    email: 'tan.mei.ling@gmail.com',
    firstName: 'Mei Ling',
    lastName: 'Tan',
    phone: '+60 12-345-6789',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MeiLing',
    membershipTier: 'platinum',
    status: 'active',
    registeredAt: '2021-03-15T10:30:00Z',
    lastVisit: '2024-12-10T09:15:00Z',
    totalVisits: 47,
    totalSpent: 8945.50,
    country: 'Malaysia',
    state: 'Selangor',
    preferences: { newsletter: true, sms: true, pushNotifications: true, language: 'en' },
    tickets: { active: 1, used: 52, expired: 3 },
    reviews: 23,
    favoriteAttractions: ['attr_001', 'attr_003', 'attr_008'],
  },
  {
    id: 'user_002',
    email: 'ahmad.ibrahim@hotmail.com',
    firstName: 'Ahmad',
    lastName: 'Ibrahim',
    phone: '+60 13-456-7890',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad',
    membershipTier: 'gold',
    status: 'active',
    registeredAt: '2022-06-20T14:00:00Z',
    lastVisit: '2024-12-08T11:30:00Z',
    totalVisits: 18,
    totalSpent: 3456.00,
    country: 'Malaysia',
    state: 'Kuala Lumpur',
    preferences: { newsletter: true, sms: false, pushNotifications: true, language: 'ms' },
    tickets: { active: 0, used: 21, expired: 1 },
    reviews: 8,
    favoriteAttractions: ['attr_002', 'attr_006', 'attr_011'],
  },
  {
    id: 'user_003',
    email: 'sarah.lee@yahoo.com',
    firstName: 'Sarah',
    lastName: 'Lee',
    phone: '+60 17-890-1234',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahLee',
    membershipTier: 'silver',
    status: 'active',
    registeredAt: '2023-01-10T09:00:00Z',
    lastVisit: '2024-11-25T10:00:00Z',
    totalVisits: 6,
    totalSpent: 1234.00,
    country: 'Malaysia',
    state: 'Penang',
    preferences: { newsletter: true, sms: true, pushNotifications: false, language: 'en' },
    tickets: { active: 2, used: 7, expired: 0 },
    reviews: 4,
    favoriteAttractions: ['attr_005', 'attr_010', 'attr_012'],
  },
  {
    id: 'user_004',
    email: 'raj.patel@gmail.com',
    firstName: 'Raj',
    lastName: 'Patel',
    phone: '+60 19-012-3456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raj',
    membershipTier: 'guest',
    status: 'active',
    registeredAt: '2024-08-05T16:30:00Z',
    lastVisit: '2024-12-01T12:00:00Z',
    totalVisits: 2,
    totalSpent: 567.00,
    country: 'Malaysia',
    state: 'Johor',
    preferences: { newsletter: false, sms: false, pushNotifications: true, language: 'en' },
    tickets: { active: 0, used: 2, expired: 0 },
    reviews: 1,
    favoriteAttractions: ['attr_001', 'attr_004'],
  },
  {
    id: 'user_005',
    email: 'wong.kai.ming@outlook.com',
    firstName: 'Kai Ming',
    lastName: 'Wong',
    phone: '+60 11-234-5678',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KaiMing',
    membershipTier: 'gold',
    status: 'active',
    registeredAt: '2022-11-28T11:00:00Z',
    lastVisit: '2024-12-11T08:45:00Z',
    totalVisits: 24,
    totalSpent: 5678.50,
    country: 'Malaysia',
    state: 'Selangor',
    preferences: { newsletter: true, sms: true, pushNotifications: true, language: 'zh' },
    tickets: { active: 1, used: 28, expired: 2 },
    reviews: 15,
    favoriteAttractions: ['attr_003', 'attr_007', 'attr_009'],
  },
  {
    id: 'user_006',
    email: 'nurul.aisyah@gmail.com',
    firstName: 'Nurul',
    lastName: 'Aisyah',
    phone: '+60 14-567-8901',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nurul',
    membershipTier: 'silver',
    status: 'inactive',
    registeredAt: '2023-04-18T13:00:00Z',
    lastVisit: '2024-06-15T09:30:00Z',
    totalVisits: 4,
    totalSpent: 890.00,
    country: 'Malaysia',
    state: 'Perak',
    preferences: { newsletter: true, sms: false, pushNotifications: false, language: 'ms' },
    tickets: { active: 0, used: 4, expired: 1 },
    reviews: 2,
    favoriteAttractions: ['attr_005', 'attr_006'],
  },
  {
    id: 'user_007',
    email: 'david.chen@icloud.com',
    firstName: 'David',
    lastName: 'Chen',
    phone: '+60 16-789-0123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DavidChen',
    membershipTier: 'platinum',
    status: 'active',
    registeredAt: '2020-09-01T10:00:00Z',
    lastVisit: '2024-12-11T14:20:00Z',
    totalVisits: 89,
    totalSpent: 15678.00,
    country: 'Singapore',
    state: '',
    preferences: { newsletter: true, sms: true, pushNotifications: true, language: 'en' },
    tickets: { active: 2, used: 95, expired: 5 },
    reviews: 42,
    favoriteAttractions: ['attr_001', 'attr_002', 'attr_003', 'attr_004', 'attr_007'],
  },
  {
    id: 'user_008',
    email: 'lisa.johnson@yahoo.com',
    firstName: 'Lisa',
    lastName: 'Johnson',
    phone: '+61 412-345-678',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    membershipTier: 'guest',
    status: 'pending_verification',
    registeredAt: '2024-12-10T08:00:00Z',
    lastVisit: null,
    totalVisits: 0,
    totalSpent: 0,
    country: 'Australia',
    state: 'New South Wales',
    preferences: { newsletter: false, sms: false, pushNotifications: false, language: 'en' },
    tickets: { active: 1, used: 0, expired: 0 },
    reviews: 0,
    favoriteAttractions: [],
  },
  {
    id: 'user_009',
    email: 'muhammad.ali@gmail.com',
    firstName: 'Muhammad',
    lastName: 'Ali',
    phone: '+60 18-901-2345',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MuhammadAli',
    membershipTier: 'silver',
    status: 'suspended',
    registeredAt: '2023-07-22T15:00:00Z',
    lastVisit: '2024-09-30T11:00:00Z',
    totalVisits: 8,
    totalSpent: 1567.00,
    country: 'Malaysia',
    state: 'Kedah',
    preferences: { newsletter: false, sms: false, pushNotifications: false, language: 'ms' },
    tickets: { active: 0, used: 9, expired: 2 },
    reviews: 3,
    favoriteAttractions: ['attr_002', 'attr_009'],
  },
  {
    id: 'user_010',
    email: 'jenny.lim@gmail.com',
    firstName: 'Jenny',
    lastName: 'Lim',
    phone: '+60 15-012-3456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jenny',
    membershipTier: 'gold',
    status: 'active',
    registeredAt: '2022-02-14T12:00:00Z',
    lastVisit: '2024-12-09T16:30:00Z',
    totalVisits: 31,
    totalSpent: 6234.50,
    country: 'Malaysia',
    state: 'Selangor',
    preferences: { newsletter: true, sms: true, pushNotifications: true, language: 'en' },
    tickets: { active: 1, used: 35, expired: 1 },
    reviews: 18,
    favoriteAttractions: ['attr_003', 'attr_005', 'attr_008', 'attr_010'],
  },
];

export const getUserById = (id: string) => users.find((u) => u.id === id);
export const getUsersByTier = (tier: string) => users.filter((u) => u.membershipTier === tier);
export const getActiveUsers = () => users.filter((u) => u.status === 'active');
export const getTotalUsers = () => users.length;
export const getTotalRevenue = () => users.reduce((sum, u) => sum + u.totalSpent, 0);
