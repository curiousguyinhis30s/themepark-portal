/**
 * Ticket Types and Pricing Data
 */

export interface TicketType {
  id: string;
  name: string;
  description: string;
  category: 'admission' | 'annual_pass' | 'special_event' | 'vip' | 'group';
  price: number;
  originalPrice?: number;
  currency: string;
  validDays: number; // 1 = single day, 365 = annual
  includes: string[];
  excludes: string[];
  restrictions: string[];
  availability: 'available' | 'limited' | 'sold_out';
  remainingToday?: number;
  popular?: boolean;
  bestValue?: boolean;
  image: string;
  sales: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    revenue: number;
  };
}

export const ticketTypes: TicketType[] = [
  {
    id: 'ticket_001',
    name: 'Day Pass',
    description: 'Full day access to all zones and attractions',
    category: 'admission',
    price: 189,
    currency: 'MYR',
    validDays: 1,
    includes: [
      'All zones access',
      'All rides & attractions',
      'Shows & entertainment',
      'Virtual Queue access',
    ],
    excludes: ['FastPass', 'VIP experiences', 'Special events', 'Food & beverages'],
    restrictions: ['Valid for selected date only', 'Non-refundable', 'Non-transferable'],
    availability: 'available',
    remainingToday: 2847,
    popular: true,
    image: '/images/tickets/day-pass.jpg',
    sales: { today: 1247, thisWeek: 8234, thisMonth: 34521, revenue: 6524469 },
  },
  {
    id: 'ticket_002',
    name: 'Day Pass + FastPass',
    description: 'Skip the queues with unlimited FastPass access',
    category: 'admission',
    price: 289,
    originalPrice: 339,
    currency: 'MYR',
    validDays: 1,
    includes: [
      'All zones access',
      'All rides & attractions',
      'Unlimited FastPass',
      'Priority queue access',
      'Shows & entertainment',
    ],
    excludes: ['VIP experiences', 'Special events', 'Food & beverages'],
    restrictions: ['Valid for selected date only', 'Non-refundable', 'Non-transferable'],
    availability: 'available',
    remainingToday: 456,
    bestValue: true,
    image: '/images/tickets/day-pass-fp.jpg',
    sales: { today: 423, thisWeek: 2891, thisMonth: 11234, revenue: 3246626 },
  },
  {
    id: 'ticket_003',
    name: 'Annual Pass - Silver',
    description: 'Unlimited visits for a full year with exclusions',
    category: 'annual_pass',
    price: 599,
    currency: 'MYR',
    validDays: 365,
    includes: [
      'Unlimited park visits',
      'All zones access',
      '10% discount on food',
      '10% discount on merchandise',
      'Member newsletter',
    ],
    excludes: ['Peak days (school holidays)', 'Special events', 'FastPass', 'Parking'],
    restrictions: ['Blackout dates apply', 'Photo ID required', 'Non-transferable'],
    availability: 'available',
    image: '/images/tickets/annual-silver.jpg',
    sales: { today: 34, thisWeek: 178, thisMonth: 712, revenue: 426488 },
  },
  {
    id: 'ticket_004',
    name: 'Annual Pass - Gold',
    description: 'Unlimited visits with minimal blackout dates',
    category: 'annual_pass',
    price: 899,
    currency: 'MYR',
    validDays: 365,
    includes: [
      'Unlimited park visits',
      'All zones access',
      '15% discount on food',
      '15% discount on merchandise',
      'Free parking',
      '4 guest discount vouchers',
      'Member events access',
    ],
    excludes: ['Special ticketed events', 'FastPass (can purchase separately)'],
    restrictions: ['Limited blackout dates', 'Photo ID required', 'Non-transferable'],
    availability: 'available',
    popular: true,
    image: '/images/tickets/annual-gold.jpg',
    sales: { today: 21, thisWeek: 134, thisMonth: 523, revenue: 470177 },
  },
  {
    id: 'ticket_005',
    name: 'Annual Pass - Platinum',
    description: 'The ultimate pass with no restrictions',
    category: 'annual_pass',
    price: 1299,
    currency: 'MYR',
    validDays: 365,
    includes: [
      'Unlimited park visits - no blackouts',
      'All zones access',
      'Unlimited FastPass',
      '20% discount on food',
      '20% discount on merchandise',
      'Free valet parking',
      'VIP lounge access',
      'Exclusive member events',
      '10 guest discount vouchers',
      'Early park entry (30 min)',
    ],
    excludes: [],
    restrictions: ['Photo ID required', 'Non-transferable'],
    availability: 'limited',
    remainingToday: 50,
    bestValue: true,
    image: '/images/tickets/annual-platinum.jpg',
    sales: { today: 8, thisWeek: 45, thisMonth: 167, revenue: 216933 },
  },
  {
    id: 'ticket_006',
    name: 'VIP Experience',
    description: 'Premium all-inclusive experience with personal guide',
    category: 'vip',
    price: 899,
    currency: 'MYR',
    validDays: 1,
    includes: [
      'All zones access',
      'Personal VIP guide',
      'Unlimited FastPass',
      'Reserved viewing for shows',
      'Gourmet lunch included',
      'Free parking',
      'Exclusive VIP lounge',
      'Complimentary photos',
      'Premium gift pack',
    ],
    excludes: [],
    restrictions: ['Advance booking required', 'Maximum 6 guests per guide', 'Non-refundable'],
    availability: 'limited',
    remainingToday: 12,
    image: '/images/tickets/vip.jpg',
    sales: { today: 4, thisWeek: 23, thisMonth: 89, revenue: 80011 },
  },
  {
    id: 'ticket_007',
    name: 'After 4pm Pass',
    description: 'Evening admission from 4pm until closing',
    category: 'admission',
    price: 119,
    currency: 'MYR',
    validDays: 1,
    includes: [
      'All zones access from 4pm',
      'All rides & attractions',
      'Evening shows & fireworks',
    ],
    excludes: ['FastPass', 'Morning/afternoon access'],
    restrictions: ['Entry from 4pm only', 'Valid for selected date only'],
    availability: 'available',
    image: '/images/tickets/after4pm.jpg',
    sales: { today: 312, thisWeek: 2134, thisMonth: 8567, revenue: 1019473 },
  },
  {
    id: 'ticket_008',
    name: 'Group Package (20+)',
    description: 'Discounted rates for groups of 20 or more',
    category: 'group',
    price: 149,
    originalPrice: 189,
    currency: 'MYR',
    validDays: 1,
    includes: [
      'All zones access',
      'All rides & attractions',
      'Group coordinator assistance',
      'Meeting point arrangement',
    ],
    excludes: ['FastPass', 'Food & beverages'],
    restrictions: ['Minimum 20 guests', 'Advance booking required', 'Group must enter together'],
    availability: 'available',
    image: '/images/tickets/group.jpg',
    sales: { today: 0, thisWeek: 3, thisMonth: 12, revenue: 35760 },
  },
  {
    id: 'ticket_009',
    name: 'School Package',
    description: 'Educational visit package for schools',
    category: 'group',
    price: 89,
    currency: 'MYR',
    validDays: 1,
    includes: [
      'All zones access',
      'All rides & attractions',
      'Educational activity booklet',
      'Teacher free (1:10 ratio)',
      'Dedicated school coordinator',
    ],
    excludes: ['FastPass', 'Food (lunch packages available)'],
    restrictions: ['Schools only', 'Weekdays only', 'Minimum 30 students', 'Advance booking required'],
    availability: 'available',
    image: '/images/tickets/school.jpg',
    sales: { today: 0, thisWeek: 2, thisMonth: 8, revenue: 21360 },
  },
  {
    id: 'ticket_010',
    name: 'Holiday Special',
    description: '2-Day pass at special holiday pricing',
    category: 'special_event',
    price: 299,
    originalPrice: 378,
    currency: 'MYR',
    validDays: 2,
    includes: [
      '2 consecutive days access',
      'All zones access',
      'All rides & attractions',
      'Holiday shows & events',
    ],
    excludes: ['FastPass', 'Food & beverages'],
    restrictions: ['Valid during holiday period only', 'Days must be consecutive'],
    availability: 'limited',
    remainingToday: 234,
    popular: true,
    image: '/images/tickets/holiday.jpg',
    sales: { today: 156, thisWeek: 1023, thisMonth: 3456, revenue: 1033344 },
  },
];

export const getTicketById = (id: string) => ticketTypes.find((t) => t.id === id);
export const getTicketsByCategory = (category: string) => ticketTypes.filter((t) => t.category === category);
export const getAvailableTickets = () => ticketTypes.filter((t) => t.availability !== 'sold_out');
export const getPopularTickets = () => ticketTypes.filter((t) => t.popular);
export const getTotalTodaySales = () => ticketTypes.reduce((sum, t) => sum + t.sales.today, 0);
export const getTotalTodayRevenue = () => ticketTypes.reduce((sum, t) => sum + (t.sales.today * t.price), 0);
