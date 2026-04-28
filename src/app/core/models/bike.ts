export interface Bike {
  id: string;
  name: string;
  type: 'road' | 'mountain' | 'electric' | 'hybrid';
  pricePerHour: number;
  description: string;
  imageUrl: string;
  specs: {
    weight: string;
    frame: string;
    battery?: string;
    gears: string;
  };
  rating: number;
  reviewsCount: number;
  available: boolean;
}

export const MOCK_BIKES: Bike[] = [
  {
    id: '1',
    name: 'Summit Pro Carbon',
    type: 'mountain',
    pricePerHour: 15,
    description: 'A high-performance trail beast for serious climbers and descenders.',
    imageUrl: 'https://images.unsplash.com/photo-1532298229144-0ee0eb070868?q=80&w=2000&auto=format&fit=crop',
    specs: {
      weight: '12.5kg',
      frame: 'Carbon Fiber',
      gears: '12 Speed'
    },
    rating: 4.8,
    reviewsCount: 124,
    available: true
  },
  {
    id: '2',
    name: 'Velocity Aero X',
    type: 'road',
    pricePerHour: 18,
    description: 'Designed for pure speed on flat roads and long-distance endurance.',
    imageUrl: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?q=80&w=2000&auto=format&fit=crop',
    specs: {
      weight: '7.8kg',
      frame: 'Advanced Aluminum',
      gears: '22 Speed'
    },
    rating: 4.9,
    reviewsCount: 89,
    available: true
  },
  {
    id: '3',
    name: 'Electron Flow 3000',
    type: 'electric',
    pricePerHour: 25,
    description: 'Premium electric assistance to conquer the city or the hills with ease.',
    imageUrl: 'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?q=80&w=2000&auto=format&fit=crop',
    specs: {
      weight: '18kg',
      frame: 'Hydroformed Alloy',
      battery: '500Wh',
      gears: '9 Speed'
    },
    rating: 4.7,
    reviewsCount: 56,
    available: true
  },
  {
    id: '4',
    name: 'Urban Glide Hybrid',
    type: 'hybrid',
    pricePerHour: 12,
    description: 'The perfect companion for commuting and weekend leisure rides.',
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=2000&auto=format&fit=crop',
    specs: {
      weight: '14kg',
      frame: 'Aluminum',
      gears: '21 Speed'
    },
    rating: 4.5,
    reviewsCount: 210,
    available: true
  }
];
