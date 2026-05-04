/**
 * heroSlides.ts
 * ---------------------------------------------------------------------------
 * In-memory "database" for hero carousel slides.
 *
 * In a production app this data would live in a real database (e.g. Postgres,
 * MongoDB) and be read/written via server-side API calls. For demo purposes we
 * use a mutable module-level array so that:
 *  - The GET /api/hero route can return the current slides.
 *  - The PUT /api/hero route can update the array in place.
 *  - The Next.js server component in app/page.tsx reads the same array on each
 *    request, giving true SSR behaviour with zero client-side delay.
 *
 * The demo slides intentionally reuse existing menu images and titles so you
 * can see the carousel working immediately without any external assets.
 */

import type { HeroSlide } from '@/types';

const IMG_BASE =
  'https://raw.githubusercontent.com/Ibidapo-Ayo/holygrill/main/public/images/custom-images/menu';

/** Mutable store – mutated by the admin PUT /api/hero route */
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    tag: "FUTA's #1 Food Platform",
    title: "Every Meal,\nEvery Point,\nEvery Moment.",
    description:
      'Order delicious grills, earn Holy Points, and join the most vibrant food community on campus.',
    ctaButtons: [
      { label: 'Order Now', href: '/menu', variant: 'primary' },
      { label: 'Join for Free', href: '/signup', variant: 'secondary' },
    ],
    imageUrl: `${IMG_BASE}/campus_menu1.jpg`,
    isActive: true,
  },
  {
    id: 'slide-2',
    tag: 'New on the Menu',
    title: "Mediterranean\nFlavours,\nCampus Vibes.",
    description:
      'Herb-marinated turkey, lemon-zest grilled potatoes and a cool yogurt drizzle — your midday escape is here.',
    ctaButtons: [
      { label: 'Explore Menu', href: '/menu', variant: 'primary' },
      { label: 'Learn More', href: '/about', variant: 'secondary' },
    ],
    imageUrl: `${IMG_BASE}/mediterranean_menu3.jpg`,
    isActive: true,
  },
  {
    id: 'slide-3',
    tag: 'Fan Favourite',
    title: "Turn Up\nThe Heat,\nFeed Your Street.",
    description:
      'Spicy chili-marinated beef, chipotle mayo, Holy hot sauce — the Spicy Campus Fusion is calling your name.',
    ctaButtons: [
      { label: 'Order Now', href: '/menu', variant: 'primary' },
      { label: 'Earn Holy Points', href: '/signup', variant: 'secondary' },
    ],
    imageUrl: `${IMG_BASE}/campus_menu2.jpg`,
    isActive: true,
  },
];
