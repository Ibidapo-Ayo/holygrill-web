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
    sizes: ['S', 'M', 'L'],
    extras: [
      { title: 'Extra Chicken', price: 700, imageUrl: image('extra-chicken.png') },
      { title: 'Extra Sauce', price: 300, imageUrl: image('extra-sauce.png') },
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
    sizes: ['S', 'M'],
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
    sizes: ['M', 'L'],
  },
  {
    id: '4',
    name: 'Coleslaw Bowl',
    tagLine: 'Simple crunch. Everyday comfort.',
    description:
      'Lightly salted grilled potatoes with hotdog slices, tomato & green pepper bits, choice of mayo ketchup or pepper cream sauce.',
    price: 300,
    imageUrl: image('coleslaw_bowl_menu1.png'),
    category: 'Faith Bowl',
    hpValue: 5,
    isAvailable: true,
    sizes: ['S', 'M', 'L'],
    slashedPrice: 500,
    percentageOff: 20,
  },
  {
    id: '5',
    name: 'Fruit Bowl',
    tagLine: 'Light, fresh and built to keep you going.',
    description:
      'Salt & pepper grilled potatoes with flame-grilled chicken + hotdog mix, pineapple cubes, parsley flakes, Holy MayoKetchup swirl.',
    price: 1000,
    imageUrl: image('fruit_bowl_menu2.png'),
    category: 'Faith Bowl',
    hpValue: 10,
    isAvailable: true,
    sizes: ['S', 'M', 'L'],
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
    sizes: ['M', 'L'],
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
    sizes: ['M', 'L'],
  },
];

export const DELIVERY_FEE = 500;

export function formatPrice(kobo: number): string {
  return `₦${kobo.toLocaleString()}`;
}
