import type { MenuItem } from '@/types';

export const CATEGORIES = ['All', 'Holy Stack', 'Faith Bowl', 'Protein', 'Veggie', 'Drinks', 'Snacks'];

const IMG_BASE = 'https://raw.githubusercontent.com/Ibidapo-Ayo/holygrill/main/public/images/custom-images/menu';
const image = (file: string) => `${IMG_BASE}/${file}`;

export const MOCK_MENU: MenuItem[] = [
  {
    id: '1',
    name: 'Campus BBQ Stack',
    tagLine: 'Grill the vibe, taste the tribe!',
    description:
      'Grilled potato cubes tossed in smoky BBQ rub, BBQ-marinated chicken thigh slices, coleslaw, Holy BBQ sauce drizzle, crispy herb crumbs.',
    price: 1800,
    imageUrl: image('campus_menu1.jpg'),
    category: 'Holy Stack',
    hpValue: 15,
    isAvailable: true,
    sizes: [
      { label: 'S', price: 1800, description: 'Quick solo fix' },
      { label: 'M', price: 2300, description: 'Best value' },
      { label: 'L', price: 2800, description: 'Squad energy' },
    ],
    extras: [
      { title: 'Extra Chicken', price: 700, imageUrl: image('extra-chicken.png') },
      { title: 'Extra Sauce', price: 300, imageUrl: image('extra-sauce.png') },
    ],
    reviews: [
      { id: 'review-1', author: 'Adewale J.', rating: 5, comment: 'Big portions and that BBQ finish always lands.', createdAt: '2 days ago', rewardHP: 10 },
      { id: 'review-2', author: 'Amara N.', rating: 4, comment: 'Great for late lectures, especially the medium size.', createdAt: '6 days ago', rewardHP: 10 },
    ],
  },
  {
    id: '2',
    name: 'Spicy Campus Fusion',
    tagLine: 'Turn up the heat, feed your street!',
    description:
      'Grilled potato cubes with paprika, cayenne, and chili pepper mix, spicy chili-marinated beef, light creamy coleslaw, chipotle mayo + Holy hot sauce, spring onions & diced green pepper.',
    price: 1900,
    imageUrl: image('campus_menu2.jpg'),
    category: 'Holy Stack',
    hpValue: 16,
    isAvailable: true,
    sizes: [
      { label: 'S', price: 1900, description: 'Campus rush' },
      { label: 'M', price: 2450, description: 'Extra heat' },
    ],
    reviews: [],
  },
  {
    id: '3',
    name: 'Mediterranean Bowl',
    tagLine: 'Escape to the Mediterranean, feed your soul!',
    description:
      'Grilled potato cubes with oregano, lemon zest, and black pepper, herb-marinated turkey slices, creamy yogurt-herb sauce, diced tomato & cucumber topping.',
    price: 2000,
    imageUrl: image('mediterranean_menu3.jpg'),
    category: 'Faith Bowl',
    hpValue: 18,
    isAvailable: true,
    sizes: [
      { label: 'M', price: 2000, description: 'Balanced bowl' },
      { label: 'L', price: 2550, description: 'Post-class power' },
    ],
    reviews: [{ id: 'review-3', author: 'Funmi A.', rating: 5, comment: 'Fresh, bright and actually filling.', createdAt: 'Today', rewardHP: 10 }],
  },
  {
    id: '4',
    name: 'Coleslaw Bowl',
    tagLine: 'Simple crunch. Everyday comfort.',
    description:
      'Lightly salted grilled potatoes with hotdog slices, tomato & green pepper bits, choice of mayo ketchup or pepper cream sauce.',
    price: 1300,
    imageUrl: image('coleslaw_bowl_menu1.png'),
    category: 'Faith Bowl',
    hpValue: 9,
    isAvailable: true,
    sizes: [
      { label: 'S', price: 1300, description: 'Light bite' },
      { label: 'M', price: 1650, description: 'Most popular' },
      { label: 'L', price: 2100, description: 'Extra filling' },
    ],
    slashedPrice: 1500,
    percentageOff: 20,
    reviews: [],
  },
  {
    id: '5',
    name: 'Fruit Bowl',
    tagLine: 'Light, fresh and built to keep you going.',
    description:
      'Salt & pepper grilled potatoes with flame-grilled chicken + hotdog mix, pineapple cubes, parsley flakes, Holy MayoKetchup swirl.',
    price: 1600,
    imageUrl: image('fruit_bowl_menu2.png'),
    category: 'Faith Bowl',
    hpValue: 12,
    isAvailable: true,
    sizes: [
      { label: 'S', price: 1600, description: 'Fresh start' },
      { label: 'M', price: 2100, description: 'Daily driver' },
      { label: 'L', price: 2650, description: 'Shared bowl' },
    ],
    reviews: [{ id: 'review-4', author: 'Blessing E.', rating: 4, comment: 'Super fresh and the sauce balance is nice.', createdAt: '3 days ago', rewardHP: 10 }],
  },
  {
    id: '6',
    name: 'Herby Mediterranean',
    tagLine: 'Bright herbs and citrus.',
    description:
      'Lemon-herb grilled potatoes with turkey slices, oregano, and parsley—cool yogurt-herb drizzle.',
    price: 2200,
    imageUrl: image('mediterranean_menu1.jpg'),
    category: 'Faith Bowl',
    hpValue: 19,
    isAvailable: true,
    sizes: [
      { label: 'M', price: 2200, description: 'Default bowl' },
      { label: 'L', price: 2750, description: 'Protein plus' },
    ],
    reviews: [],
  },
  {
    id: '7',
    name: 'Smoky Mediterranean',
    tagLine: 'Smoky, savory, satisfying.',
    description:
      'Peppery grilled potatoes, charred veggies, and creamy herb sauce.',
    price: 2100,
    imageUrl: image('mediterranean_menu2.jpg'),
    category: 'Faith Bowl',
    hpValue: 18,
    isAvailable: true,
    sizes: [
      { label: 'M', price: 2100, description: 'Good for one' },
      { label: 'L', price: 2600, description: 'Big appetite' },
    ],
    reviews: [],
  },
];

export const DELIVERY_FEE = 500;

export function formatPrice(kobo: number): string {
  return `₦${kobo.toLocaleString()}`;
}
