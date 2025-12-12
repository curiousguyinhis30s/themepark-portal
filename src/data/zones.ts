/**
 * Theme Park Zones Data
 */

export interface Zone {
  id: string;
  name: string;
  slug: string;
  description: string;
  theme: string;
  color: string; // For UI theming
  capacity: number;
  currentVisitors: number;
  attractionCount: number;
  diningCount: number;
  shopCount: number;
  openingTime: string;
  closingTime: string;
  coordinates: { lat: number; lng: number };
  amenities: string[];
  image: string;
}

export const zones: Zone[] = [
  {
    id: 'zone_001',
    name: 'Adventure Peak',
    slug: 'adventure-peak',
    description: 'Home to our most thrilling coasters and extreme attractions. Experience adrenaline-pumping rides set against dramatic mountain scenery.',
    theme: 'Mountain Adventure',
    color: '#0f766e', // Teal
    capacity: 5000,
    currentVisitors: 3247,
    attractionCount: 6,
    diningCount: 4,
    shopCount: 3,
    openingTime: '10:00',
    closingTime: '22:00',
    coordinates: { lat: 3.1575, lng: 101.7125 },
    amenities: ['Lockers', 'First Aid', 'Baby Care', 'ATM', 'Photo Services'],
    image: '/images/zones/adventure-peak.jpg',
  },
  {
    id: 'zone_002',
    name: 'Tropical Paradise',
    slug: 'tropical-paradise',
    description: 'Cool off in our water-themed zone featuring rapids, splash pads, and lush tropical landscaping. Perfect for hot Malaysian days!',
    theme: 'Tropical Rainforest',
    color: '#15803d', // Green
    capacity: 4000,
    currentVisitors: 2891,
    attractionCount: 5,
    diningCount: 5,
    shopCount: 2,
    openingTime: '10:00',
    closingTime: '20:00',
    coordinates: { lat: 3.1570, lng: 101.7130 },
    amenities: ['Changing Rooms', 'Towel Rental', 'Lockers', 'Cabanas', 'Sunscreen Station'],
    image: '/images/zones/tropical-paradise.jpg',
  },
  {
    id: 'zone_003',
    name: 'Future World',
    slug: 'future-world',
    description: 'Step into tomorrow with cutting-edge technology and immersive experiences. From space adventures to robot encounters.',
    theme: 'Science Fiction',
    color: '#1d4ed8', // Blue
    capacity: 4500,
    currentVisitors: 3102,
    attractionCount: 4,
    diningCount: 3,
    shopCount: 4,
    openingTime: '10:00',
    closingTime: '22:00',
    coordinates: { lat: 3.1565, lng: 101.7118 },
    amenities: ['Charging Stations', 'VR Experience Center', 'First Aid', 'Gift Shop'],
    image: '/images/zones/future-world.jpg',
  },
  {
    id: 'zone_004',
    name: 'Fantasy Kingdom',
    slug: 'fantasy-kingdom',
    description: 'A magical wonderland for families with younger children. Classic rides, character meet-and-greets, and enchanting entertainment.',
    theme: 'Fairy Tale',
    color: '#a21caf', // Purple
    capacity: 6000,
    currentVisitors: 4523,
    attractionCount: 8,
    diningCount: 6,
    shopCount: 5,
    openingTime: '10:00',
    closingTime: '21:00',
    coordinates: { lat: 3.1558, lng: 101.7112 },
    amenities: ['Baby Care', 'Stroller Rental', 'Character Meet & Greet', 'Play Areas', 'Family Restrooms'],
    image: '/images/zones/fantasy-kingdom.jpg',
  },
  {
    id: 'zone_005',
    name: 'Heritage Harbor',
    slug: 'heritage-harbor',
    description: 'Explore Malaysian culture and maritime history in this beautifully themed zone featuring traditional architecture and local cuisine.',
    theme: 'Malaysian Heritage',
    color: '#b45309', // Amber
    capacity: 3500,
    currentVisitors: 1876,
    attractionCount: 4,
    diningCount: 8,
    shopCount: 6,
    openingTime: '10:00',
    closingTime: '21:00',
    coordinates: { lat: 3.1560, lng: 101.7135 },
    amenities: ['Cultural Exhibits', 'Artisan Workshops', 'Traditional Performances', 'Local Cuisine'],
    image: '/images/zones/heritage-harbor.jpg',
  },
];

export const getZoneById = (id: string) => zones.find((z) => z.id === id);
export const getTotalVisitors = () => zones.reduce((sum, z) => sum + z.currentVisitors, 0);
export const getTotalCapacity = () => zones.reduce((sum, z) => sum + z.capacity, 0);
export const getZoneOccupancy = (id: string) => {
  const zone = getZoneById(id);
  return zone ? Math.round((zone.currentVisitors / zone.capacity) * 100) : 0;
};
