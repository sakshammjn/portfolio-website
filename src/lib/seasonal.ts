import type { WardrobeKey } from '@/components/effects/wardrobe'

/**
 * The critter's calendar — on special days the footer walker wears/carries a
 * tiny pixel prop (drawn in wardrobe.tsx) and, on hover, holds up a sign
 * naming the day (most of these are obscure — the sign is the reveal).
 *
 * Only the footer critter dresses up; the palette pet and others stay plain.
 *
 * Preview any day by appending its slug as a bare query param, e.g.
 * `?bee-day`, `?halloween`, `?my-birthday` — checked against every param key
 * so `?utm_…` noise can't collide. Movable observances (sleep day, high five
 * day, space day) are pinned to a fixed nearby date to keep this data-only.
 */

export interface SeasonalDay {
  /** URL slug for previewing (`?slug`) — kebab-case, unique. */
  slug: string
  /** What the hover sign says. */
  label: string
  prop: WardrobeKey
  month: number
  day: number
}

export const SEASONAL_DAYS: SeasonalDay[] = [
  // January
  { slug: 'new-years-day', label: 'happy new year!', prop: 'party', month: 1, day: 1 },
  { slug: 'rubber-ducky-day', label: 'rubber ducky day — explain your code to it', prop: 'duck', month: 1, day: 13 },
  { slug: 'kite-day', label: 'international kite day', prop: 'kite', month: 1, day: 14 },
  { slug: 'hat-day', label: 'national hat day', prop: 'tophat', month: 1, day: 15 },
  { slug: 'compliment-day', label: 'compliment day — you look great', prop: 'bubble-star', month: 1, day: 24 },
  { slug: 'republic-day', label: 'happy republic day', prop: 'tricolor', month: 1, day: 26 },
  { slug: 'privacy-day', label: 'data privacy day — gone incognito', prop: 'shades', month: 1, day: 28 },

  // February — valentine's week, then the rest
  { slug: 'groundhog-day', label: 'groundhog day — again?', prop: 'groundhog', month: 2, day: 2 },
  { slug: 'rose-day', label: 'rose day', prop: 'rose', month: 2, day: 7 },
  { slug: 'propose-day', label: 'propose day', prop: 'ring', month: 2, day: 8 },
  { slug: 'pizza-day', label: 'international pizza day', prop: 'pizza', month: 2, day: 9 },
  { slug: 'teddy-day', label: 'teddy day', prop: 'teddy', month: 2, day: 10 },
  { slug: 'promise-day', label: 'promise day', prop: 'promise', month: 2, day: 11 },
  { slug: 'hug-day', label: 'hug day — free hugs', prop: 'hug', month: 2, day: 12 },
  { slug: 'kiss-day', label: 'kiss day', prop: 'kiss', month: 2, day: 13 },
  { slug: 'valentines-day', label: "happy valentine's day", prop: 'valentine', month: 2, day: 14 },
  { slug: 'love-your-pet-day', label: 'love your pet day', prop: 'pet-leash', month: 2, day: 20 },
  { slug: 'science-day', label: 'national science day', prop: 'flask', month: 2, day: 28 },

  // March
  { slug: 'world-compliment-day', label: 'world compliment day — nice scrolling', prop: 'bubble-heart', month: 3, day: 1 },
  { slug: 'dentist-day', label: "dentist's day — keep flossing", prop: 'tooth', month: 3, day: 6 },
  { slug: 'mario-day', label: "mar10 day — it's-a me", prop: 'mario', month: 3, day: 10 },
  { slug: 'sleep-day', label: 'world sleep day', prop: 'nightcap', month: 3, day: 13 },
  { slug: 'pi-day', label: 'pi day — 3.14159…', prop: 'pi', month: 3, day: 14 },
  { slug: 'happiness-day', label: 'international day of happiness', prop: 'balloon', month: 3, day: 20 },
  { slug: 'water-day', label: 'world water day', prop: 'droplet', month: 3, day: 22 },
  { slug: 'puppy-day', label: 'national puppy day', prop: 'puppy', month: 3, day: 23 },
  { slug: 'backup-day', label: 'world backup day — commit & push', prop: 'floppy', month: 3, day: 31 },

  // April
  { slug: 'april-fools', label: "april fools' day", prop: 'jester', month: 4, day: 1 },
  { slug: '404-day', label: '4/04 — critter not found', prop: 'notfound', month: 4, day: 4 },
  { slug: 'health-day', label: 'world health day', prop: 'red-cross', month: 4, day: 7 },
  { slug: 'pet-day', label: 'national pet day', prop: 'bowl', month: 4, day: 11 },
  { slug: 'high-five-day', label: 'high five day — up top!', prop: 'high-five', month: 4, day: 16 },
  { slug: 'earth-day', label: 'earth day', prop: 'earth', month: 4, day: 22 },
  { slug: 'penguin-day', label: 'world penguin day', prop: 'penguin', month: 4, day: 25 },

  // May
  { slug: 'space-day', label: 'national space day', prop: 'helmet', month: 5, day: 1 },
  { slug: 'star-wars-day', label: 'may the 4th be with you', prop: 'lightsaber', month: 5, day: 4 },
  { slug: 'my-birthday', label: "the maker's birthday", prop: 'birthday', month: 5, day: 12 },
  { slug: 'bee-day', label: 'world bee day', prop: 'bee', month: 5, day: 20 },
  { slug: 'towel-day', label: "towel day — don't panic", prop: 'towel', month: 5, day: 25 },
  { slug: 'web-designer-day', label: 'web designer day', prop: 'cursor', month: 5, day: 31 },

  // June
  { slug: 'dinosaur-day', label: 'dinosaur day — rawr', prop: 'dino', month: 6, day: 1 },
  { slug: 'bicycle-day', label: 'world bicycle day', prop: 'bicycle', month: 6, day: 3 },
  { slug: 'environment-day', label: 'world environment day', prop: 'sprout', month: 6, day: 5 },
  { slug: 'yoga-day', label: 'international yoga day', prop: 'yoga-mat', month: 6, day: 21 },
  { slug: 'turing-day', label: "alan turing's birthday", prop: 'turing', month: 6, day: 23 },

  // July
  { slug: 'emoji-day', label: 'world emoji day', prop: 'emoji', month: 7, day: 17 },
  { slug: 'chess-day', label: 'international chess day', prop: 'pawn', month: 7, day: 20 },
  { slug: 'site-birthday', label: "this site's birthday", prop: 'party', month: 7, day: 24 },
  { slug: 'friendship-day', label: 'international friendship day', prop: 'friend', month: 7, day: 30 },

  // August
  { slug: 'cat-day', label: 'international cat day', prop: 'cat-ears', month: 8, day: 8 },
  { slug: 'independence-day', label: 'happy independence day', prop: 'tricolor', month: 8, day: 15 },
  { slug: 'photography-day', label: 'world photography day', prop: 'camera', month: 8, day: 19 },
  { slug: 'dog-day', label: 'international dog day', prop: 'dog-ears', month: 8, day: 26 },

  // September
  { slug: 'teachers-day', label: "happy teachers' day", prop: 'mortarboard', month: 9, day: 5 },
  { slug: 'book-day', label: 'read a book day', prop: 'book', month: 9, day: 6 },
  { slug: 'first-bug-day', label: 'first bug day — a real moth, 1947', prop: 'moth', month: 9, day: 9 },
  { slug: 'video-games-day', label: 'national video games day', prop: 'gamepad', month: 9, day: 12 },
  { slug: 'programmers-day', label: "programmers' day — day 0x100", prop: 'hex', month: 9, day: 13 },
  { slug: 'peace-day', label: 'international day of peace', prop: 'dove', month: 9, day: 21 },

  // October
  { slug: 'coffee-day', label: 'international coffee day', prop: 'coffee', month: 10, day: 1 },
  { slug: 'gandhi-jayanti', label: 'gandhi jayanti', prop: 'gandhi', month: 10, day: 2 },
  { slug: 'animal-day', label: 'world animal day', prop: 'paw', month: 10, day: 4 },
  { slug: 'mental-health-day', label: 'world mental health day — be kind to your mind', prop: 'soft-heart', month: 10, day: 10 },
  { slug: 'bttf-day', label: 'back to the future day — 88 mph', prop: 'flames', month: 10, day: 21 },
  { slug: 'internet-day', label: 'international internet day', prop: 'wifi', month: 10, day: 29 },
  { slug: 'halloween', label: 'happy halloween — boo.', prop: 'ghost', month: 10, day: 31 },

  // November
  { slug: 'cake-day', label: 'national cake day', prop: 'cake', month: 11, day: 26 },
  { slug: 'security-day', label: 'computer security day', prop: 'padlock', month: 11, day: 30 },

  // December
  { slug: 'ninja-day', label: 'day of the ninja', prop: 'ninja', month: 12, day: 5 },
  { slug: 'time-traveler-day', label: 'time traveler day — what year is it?', prop: 'portal', month: 12, day: 8 },
  { slug: 'mountain-day', label: 'international mountain day', prop: 'mountain', month: 12, day: 11 },
  { slug: 'christmas-eve', label: 'christmas eve', prop: 'gift', month: 12, day: 24 },
  { slug: 'christmas', label: 'merry christmas', prop: 'santa', month: 12, day: 25 },
  { slug: 'new-years-eve', label: "new year's eve — 3…2…1", prop: 'party', month: 12, day: 31 },
]

/** The visitor's night (9pm–6am local) — the critter gets sleepy, the
 *  console gets conspiratorial. Checked at mount. */
export function isLateNight(now: Date = new Date()): boolean {
  const h = now.getHours()
  return h >= 21 || h < 6
}

export function getSeasonalDay(now: Date = new Date()): SeasonalDay | null {
  // URL preview: any query key matching a slug wins (e.g. `?bee-day`).
  try {
    for (const key of new URLSearchParams(window.location.search).keys()) {
      const hit = SEASONAL_DAYS.find((d) => d.slug === key.toLowerCase())
      if (hit) return hit
    }
  } catch {
    /* no window (tests) — fall through to the date */
  }

  const month = now.getMonth() + 1
  const day = now.getDate()
  return SEASONAL_DAYS.find((d) => d.month === month && d.day === day) ?? null
}
