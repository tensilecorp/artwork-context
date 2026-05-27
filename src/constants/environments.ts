/** Curated environment presets for artwork visualizations */

export interface Environment {
  id: string
  name: string
  description: string
  image: string
  category: 'residential' | 'commercial' | 'cultural'
}

export const environments: Environment[] = [
  {
    id: 'living-room',
    name: 'Living Room',
    description: 'Modern, elegant living space',
    image: '/scenes/artwork-in-living-room-upscaled-2 Medium.jpeg',
    category: 'residential',
  },
  {
    id: 'office',
    name: 'Office',
    description: 'Professional workspace',
    image: '/scenes/artwork-in-office-upscaled Medium.jpeg',
    category: 'commercial',
  },
  {
    id: 'hotel-lobby',
    name: 'Hotel Lobby',
    description: 'Luxury hotel entrance',
    image: '/scenes/artwork-in-hotel-lobby Medium.jpeg',
    category: 'commercial',
  },
  {
    id: 'gallery',
    name: 'Gallery',
    description: 'Contemporary art gallery',
    image: '/scenes/replicate-prediction-epewxcww89rmc0cqv6qre5r5rr Medium.jpeg',
    category: 'cultural',
  },
]
