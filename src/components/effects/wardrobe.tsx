/**
 * The critter's wardrobe — one tiny pixel accessory per special day.
 *
 * Every piece is an SVG fragment in the critter's own coordinate space
 * (44×36 viewBox, 4px grid, overflow visible), drawn with theme tokens only
 * (fill-accent / fill-accent-soft / fill-fg / fill-ink / fill-fg-muted /
 * fill-line) so each prop reads correctly in both themes. Placement
 * conventions: hats live above the crown (y < 0), held items float just off
 * the right side (x > 44), companions stand on the ground beside it. The
 * fragments render inside the body group, after the eyes — so masks, shades
 * and the halloween sheet can cover the face.
 *
 * Which day maps to which piece lives in lib/seasonal.ts.
 */

import type { ReactNode } from 'react'

/** Classic 8-bit heart (14×12 at scale 1), tip at bottom centre. */
const heart = (x: number, y: number, s: number, cls: string) => (
  <path
    transform={`translate(${x} ${y}) scale(${s})`}
    className={cls}
    d="M2 0 H6 V2 H8 V0 H12 V2 H14 V6 H12 V8 H10 V10 H8 V12 H6 V10 H4 V8 H2 V6 H0 V2 H2 Z"
  />
)

/** Four-point pixel spark ✦. */
const spark = (x: number, y: number, cls: string) => (
  <g className={cls}>
    <rect x={x + 2} y={y} width={2} height={6} />
    <rect x={x} y={y + 2} width={6} height={2} />
  </g>
)

/** The jaunty party hat (new year, birthdays) + a little confetti. */
const partyHat = (
  <>
    <g transform="rotate(-13 22 0)">
      <path d="M22 -16 L30 -1 L14 -1 Z" className="fill-accent-soft" />
      <rect x={19} y={-20} width={5} height={5} className="fill-accent" />
      <rect x={16} y={-7} width={12} height={2} className="fill-ink" />
    </g>
    {spark(42, -8, 'fill-accent')}
    {spark(-6, -2, 'fill-accent-soft')}
  </>
)

/** Speech bubble floating at the right, with a symbol inside. */
const bubble = (inner: ReactNode) => (
  <>
    <rect x={42} y={-4} width={16} height={12} className="fill-fg" />
    <path d="M46 8 L46 13 L51 8 Z" className="fill-fg" />
    {inner}
  </>
)

export const WARDROBE = {
  /* ---- shared celebrations ---------------------------------------- */
  party: partyHat,

  birthday: (
    <>
      {partyHat}
      <rect x={-14} y={-10} width={10} height={10} rx={3} className="fill-accent-soft" />
      <rect x={-10} y={0} width={2} height={2} className="fill-accent-soft" />
      <path d="M-9 2 Q-12 8 -6 14" className="stroke-fg-muted" strokeWidth={1} fill="none" />
    </>
  ),

  /* ---- january ------------------------------------------------------ */
  kite: (
    <>
      <path d="M30 4 L46 -16" className="stroke-fg-muted" strokeWidth={1} fill="none" />
      <path d="M48 -26 L54 -18 L48 -10 L42 -18 Z" className="fill-accent" />
      <rect x={47} y={-8} width={2} height={2} className="fill-accent-soft" />
      <rect x={49} y={-5} width={2} height={2} className="fill-accent-soft" />
    </>
  ),

  tophat: (
    <>
      <rect x={10} y={-3} width={24} height={3} className="fill-fg" />
      <rect x={15} y={-15} width={14} height={12} className="fill-fg" />
      <rect x={15} y={-6} width={14} height={3} className="fill-accent" />
    </>
  ),

  'bubble-star': bubble(
    <g className="fill-ink">
      <rect x={49} y={-3} width={2} height={10} />
      <rect x={45} y={1} width={10} height={2} />
    </g>,
  ),

  shades: (
    <g className="fill-ink">
      <rect x={9} y={9} width={12} height={7} />
      <rect x={23} y={9} width={12} height={7} />
      <rect x={21} y={11} width={2} height={2} />
      <rect x={4} y={10} width={5} height={2} />
      <rect x={35} y={10} width={5} height={2} />
    </g>
  ),

  /* ---- valentine's week ---------------------------------------------- */
  rose: (
    <>
      <rect x={49} y={12} width={2} height={12} className="fill-fg-muted" />
      <rect x={51} y={17} width={4} height={2} className="fill-fg-muted" />
      <rect x={46} y={6} width={8} height={6} className="fill-accent" />
      <rect x={48} y={4} width={4} height={2} className="fill-accent" />
      <rect x={44} y={8} width={2} height={2} className="fill-accent-soft" />
      <rect x={54} y={8} width={2} height={2} className="fill-accent-soft" />
    </>
  ),

  ring: (
    <>
      <g className="fill-fg">
        <rect x={48} y={10} width={6} height={2} />
        <rect x={48} y={18} width={6} height={2} />
        <rect x={46} y={12} width={2} height={6} />
        <rect x={54} y={12} width={2} height={6} />
      </g>
      <rect x={49} y={5} width={4} height={4} className="fill-accent-soft" />
      {spark(56, 2, 'fill-accent')}
    </>
  ),

  chocolate: (
    <>
      <rect x={44} y={8} width={12} height={16} className="fill-ink" />
      <rect x={49} y={8} width={1} height={16} className="fill-line" />
      <rect x={44} y={13} width={12} height={1} className="fill-line" />
      <rect x={44} y={18} width={12} height={6} className="fill-accent" />
    </>
  ),

  teddy: (
    <>
      <g className="fill-accent-soft">
        <rect x={46} y={15} width={3} height={3} />
        <rect x={53} y={15} width={3} height={3} />
        <rect x={46} y={18} width={10} height={10} />
        <rect x={47} y={28} width={3} height={3} />
        <rect x={52} y={28} width={3} height={3} />
      </g>
      <rect x={48} y={21} width={2} height={3} className="fill-ink" />
      <rect x={52} y={21} width={2} height={3} className="fill-ink" />
    </>
  ),

  promise: (
    <>
      <path d="M40 8 L35 3 L38 10 Z" className="fill-accent-soft" />
      <path d="M45 8 L50 3 L47 10 Z" className="fill-accent-soft" />
      <rect x={41} y={6} width={3} height={3} className="fill-accent" />
    </>
  ),

  hug: (
    <>
      <rect x={-4} y={16} width={8} height={4} className="fill-accent" />
      <rect x={40} y={16} width={8} height={4} className="fill-accent" />
    </>
  ),

  kiss: heart(42, 0, 0.6, 'fill-accent-soft'),

  valentine: heart(13, -19, 1.3, 'fill-accent'),

  'pet-leash': (
    <>
      <g className="fill-accent-soft">
        <rect x={-16} y={24} width={10} height={8} />
        <rect x={-15} y={22} width={2} height={2} />
        <rect x={-9} y={22} width={2} height={2} />
        <rect x={-15} y={32} width={3} height={4} />
        <rect x={-10} y={32} width={3} height={4} />
      </g>
      <rect x={-14} y={27} width={2} height={3} className="fill-ink" />
      <rect x={-10} y={27} width={2} height={3} className="fill-ink" />
      <path d="M-6 25 L4 18" className="stroke-fg-muted" strokeWidth={1} fill="none" />
    </>
  ),

  flask: (
    <>
      <path d="M47 2 h4 v6 l6 12 h-16 l6 -12 Z" className="fill-fg" />
      <path d="M44.5 15 L41 20 h16 l-3.5 -5 Z" className="fill-accent" />
      <rect x={48} y={-2} width={2} height={2} className="fill-accent-soft" />
      <rect x={52} y={-5} width={2} height={2} className="fill-accent-soft" />
    </>
  ),

  /* ---- march ---------------------------------------------------------- */
  'bubble-heart': bubble(heart(45, -3, 0.7, 'fill-ink')),

  tooth: (
    <>
      <rect x={45} y={6} width={12} height={8} className="fill-fg" />
      <rect x={46} y={14} width={4} height={5} className="fill-fg" />
      <rect x={52} y={14} width={4} height={5} className="fill-fg" />
      {spark(57, 0, 'fill-accent')}
    </>
  ),

  nightcap: (
    <>
      <rect x={10} y={-2} width={24} height={3} className="fill-accent" />
      <path d="M10 -2 L34 -2 L40 -9 Z" className="fill-accent-soft" />
      <rect x={39} y={-12} width={5} height={5} className="fill-fg" />
    </>
  ),

  pi: (
    <text x={44} y={20} fontSize={18} className="fill-accent font-mono">
      π
    </text>
  ),

  balloon: (
    <>
      <rect x={46} y={-8} width={10} height={10} rx={3} className="fill-accent" />
      <rect x={50} y={2} width={2} height={2} className="fill-accent" />
      <rect x={48} y={-5} width={2} height={3} className="fill-ink" />
      <rect x={52} y={-5} width={2} height={3} className="fill-ink" />
      <rect x={49} y={0} width={4} height={1} className="fill-ink" />
      <path d="M51 4 Q48 10 51 16" className="stroke-fg-muted" strokeWidth={1} fill="none" />
    </>
  ),

  droplet: (
    <g className="fill-accent-soft">
      <rect x={49} y={0} width={2} height={2} />
      <rect x={47} y={2} width={6} height={4} />
      <rect x={46} y={6} width={8} height={4} />
      <rect x={48} y={10} width={4} height={2} />
    </g>
  ),

  puppy: (
    <>
      <g className="fill-accent-soft">
        <rect x={46} y={13} width={3} height={7} />
        <rect x={55} y={13} width={3} height={7} />
        <rect x={48} y={14} width={8} height={6} />
        <rect x={47} y={20} width={10} height={8} />
        <rect x={57} y={21} width={3} height={2} />
        <rect x={48} y={28} width={3} height={3} />
        <rect x={53} y={28} width={3} height={3} />
      </g>
      <rect x={50} y={16} width={2} height={2} className="fill-ink" />
      <rect x={53} y={16} width={2} height={2} className="fill-ink" />
    </>
  ),

  /* ---- april ---------------------------------------------------------- */
  jester: (
    <>
      <path d="M12 1 L18 -12 L21 -2 Z" className="fill-accent" />
      <path d="M32 1 L26 -12 L23 -2 Z" className="fill-accent" />
      <rect x={16} y={-15} width={4} height={4} className="fill-accent-soft" />
      <rect x={24} y={-15} width={4} height={4} className="fill-accent-soft" />
      <rect x={12} y={-2} width={20} height={3} className="fill-ink" />
    </>
  ),

  'red-cross': (
    <>
      <rect x={44} y={10} width={12} height={12} className="fill-fg" />
      <rect x={49} y={12} width={2} height={8} className="fill-accent" />
      <rect x={46} y={15} width={8} height={2} className="fill-accent" />
    </>
  ),

  bowl: (
    <>
      <rect x={43} y={29} width={16} height={2} className="fill-fg-muted" />
      <rect x={44} y={31} width={14} height={4} className="fill-accent" />
      <rect x={46} y={27} width={2} height={2} className="fill-accent-soft" />
      <rect x={50} y={26} width={2} height={2} className="fill-accent-soft" />
      <rect x={53} y={27} width={2} height={2} className="fill-accent-soft" />
    </>
  ),

  'high-five': (
    <g className="fill-accent-soft">
      <rect x={46} y={4} width={11} height={7} />
      <rect x={46} y={-2} width={2} height={6} />
      <rect x={49} y={-3} width={2} height={7} />
      <rect x={52} y={-3} width={2} height={7} />
      <rect x={55} y={-2} width={2} height={6} />
      <rect x={44} y={6} width={2} height={4} />
    </g>
  ),

  penguin: (
    <>
      <rect x={46} y={14} width={10} height={13} className="fill-fg" />
      <rect x={48} y={19} width={6} height={8} className="fill-ink" />
      <rect x={48} y={16} width={2} height={2} className="fill-ink" />
      <rect x={52} y={16} width={2} height={2} className="fill-ink" />
      <rect x={50} y={18} width={2} height={2} className="fill-accent" />
      <rect x={44} y={18} width={2} height={6} className="fill-fg" />
      <rect x={56} y={18} width={2} height={6} className="fill-fg" />
      <rect x={47} y={27} width={3} height={2} className="fill-accent" />
      <rect x={52} y={27} width={3} height={2} className="fill-accent" />
    </>
  ),

  /* ---- may ------------------------------------------------------------ */
  helmet: (
    <>
      <g className="fill-fg">
        <rect x={14} y={-10} width={16} height={3} />
        <rect x={10} y={-8} width={4} height={3} />
        <rect x={30} y={-8} width={4} height={3} />
        <rect x={8} y={-5} width={3} height={9} />
        <rect x={33} y={-5} width={3} height={9} />
      </g>
      <rect x={29} y={-7} width={2} height={2} className="fill-accent" />
    </>
  ),

  bee: (
    <>
      <rect x={46} y={2} width={10} height={6} className="fill-accent-soft" />
      <rect x={49} y={2} width={2} height={6} className="fill-ink" />
      <rect x={53} y={2} width={2} height={6} className="fill-ink" />
      <rect x={48} y={-2} width={3} height={3} className="fill-fg" />
      <rect x={52} y={-2} width={3} height={3} className="fill-fg" />
    </>
  ),

  cursor: (
    <>
      <path
        d="M46 4 L46 18 L50 14 L53 20 L55.5 18.5 L52.5 13 L57 13 Z"
        className="fill-fg"
      />
      {spark(40, 0, 'fill-accent')}
    </>
  ),

  /* ---- june ------------------------------------------------------------ */
  dino: (
    <g className="fill-accent-soft">
      <path d="M10 1 L13 -6 L16 1 Z" />
      <path d="M17 1 L20 -7 L23 1 Z" />
      <path d="M24 1 L27 -6 L30 1 Z" />
    </g>
  ),

  bicycle: (
    <>
      <rect x={44} y={26} width={8} height={8} fill="none" strokeWidth={2} className="stroke-fg" />
      <rect x={56} y={26} width={8} height={8} fill="none" strokeWidth={2} className="stroke-fg" />
      <path d="M48 30 L53 22 L60 30 M53 22 h5" fill="none" strokeWidth={1.5} className="stroke-fg" />
      <rect x={58} y={20} width={4} height={2} className="fill-accent" />
      <rect x={46} y={21} width={4} height={2} className="fill-accent" />
    </>
  ),

  sprout: (
    <>
      <rect x={21} y={-6} width={2} height={7} className="fill-fg-muted" />
      <path d="M21 -6 L13 -11 L21 -2 Z" className="fill-accent-soft" />
      <path d="M23 -6 L31 -11 L23 -2 Z" className="fill-accent" />
    </>
  ),

  'yoga-mat': (
    <>
      <rect x={42} y={18} width={16} height={7} rx={1} className="fill-accent-soft" />
      <rect x={54} y={18} width={4} height={7} className="fill-accent" />
      <rect x={55} y={20} width={2} height={3} className="fill-ink" />
      <rect x={46} y={17} width={2} height={9} className="fill-ink" />
    </>
  ),

  /* ---- july ------------------------------------------------------------ */
  emoji: (
    <>
      <rect x={44} y={0} width={12} height={12} rx={3} className="fill-accent-soft" />
      <rect x={47} y={3} width={2} height={3} className="fill-ink" />
      <rect x={51} y={3} width={2} height={3} className="fill-ink" />
      <rect x={47} y={8} width={6} height={2} className="fill-ink" />
      <rect x={46} y={7} width={1} height={1} className="fill-ink" />
      <rect x={53} y={7} width={1} height={1} className="fill-ink" />
    </>
  ),

  pawn: (
    <g className="fill-fg">
      <rect x={48} y={4} width={6} height={5} />
      <rect x={47} y={9} width={8} height={2} />
      <rect x={49} y={11} width={4} height={5} />
      <rect x={46} y={16} width={10} height={3} />
      <rect x={44} y={19} width={14} height={2} />
    </g>
  ),

  friend: (
    <>
      <g transform="translate(48 16) scale(0.5)">
        <g className="fill-accent-soft">
          <rect x={8} y={0} width={28} height={4} />
          <rect x={4} y={4} width={36} height={24} />
          <rect x={0} y={12} width={4} height={8} />
          <rect x={40} y={12} width={4} height={8} />
          <rect x={8} y={28} width={8} height={8} />
          <rect x={28} y={28} width={8} height={8} />
        </g>
        <rect x={13} y={10} width={4} height={10} className="fill-ink" />
        <rect x={27} y={10} width={4} height={10} className="fill-ink" />
      </g>
      <rect x={41} y={20} width={7} height={3} className="fill-accent" />
    </>
  ),

  /* ---- august ------------------------------------------------------------ */
  'cat-ears': (
    <>
      <path d="M11 1 L15 -8 L19 1 Z" className="fill-accent" />
      <path d="M25 1 L29 -8 L33 1 Z" className="fill-accent" />
      <path d="M13 0 L15 -4 L17 0 Z" className="fill-ink" />
      <path d="M27 0 L29 -4 L31 0 Z" className="fill-ink" />
    </>
  ),

  'dog-ears': (
    <>
      <path d="M2 -2 h7 l-1 14 h-5 Z" className="fill-accent-soft" />
      <path d="M35 -2 h7 l-1 14 h-5 Z" className="fill-accent-soft" />
      <rect x={14} y={25} width={16} height={3} className="fill-accent" />
      <rect x={21} y={27} width={2} height={2} className="fill-fg" />
    </>
  ),

  /* ---- september ------------------------------------------------------------ */
  book: (
    <>
      <path d="M44 12 L52 15 V25 L44 22 Z" className="fill-fg" />
      <path d="M60 12 L52 15 V25 L60 22 Z" className="fill-fg" />
      <rect x={51} y={15} width={2} height={10} className="fill-fg-muted" />
      <rect x={46} y={15} width={4} height={1} className="fill-line" />
      <rect x={46} y={18} width={4} height={1} className="fill-line" />
      <rect x={54} y={15} width={4} height={1} className="fill-line" />
    </>
  ),

  gamepad: (
    <>
      <rect x={44} y={12} width={16} height={9} rx={2} className="fill-fg" />
      <rect x={43} y={19} width={4} height={4} className="fill-fg" />
      <rect x={57} y={19} width={4} height={4} className="fill-fg" />
      <rect x={47} y={14} width={2} height={5} className="fill-ink" />
      <rect x={45.5} y={15.5} width={5} height={2} className="fill-ink" />
      <rect x={54} y={14} width={2} height={2} className="fill-accent" />
      <rect x={56} y={16} width={2} height={2} className="fill-accent" />
    </>
  ),

  hex: (
    <text x={40} y={19} fontSize={9} className="fill-accent font-mono">
      {'{0x100}'}
    </text>
  ),

  dove: (
    <>
      <rect x={46} y={8} width={9} height={5} className="fill-fg" />
      <rect x={54} y={5} width={4} height={4} className="fill-fg" />
      <rect x={58} y={6} width={2} height={2} className="fill-accent" />
      <path d="M48 8 L52 1 L55 8 Z" className="fill-fg" />
      <path d="M46 9 L41 13 L46 13 Z" className="fill-fg" />
    </>
  ),

  /* ---- october ------------------------------------------------------------ */
  coffee: (
    <>
      <rect x={45} y={12} width={10} height={10} className="fill-fg" />
      <rect x={55} y={14} width={3} height={2} className="fill-fg" />
      <rect x={56} y={16} width={2} height={3} className="fill-fg" />
      <rect x={55} y={19} width={3} height={2} className="fill-fg" />
      <rect x={46} y={13} width={8} height={2} className="fill-ink" />
      <rect x={47} y={6} width={2} height={4} className="fill-fg-muted" />
      <rect x={51} y={4} width={2} height={4} className="fill-fg-muted" />
    </>
  ),

  paw: (
    <g className="fill-accent-soft">
      <rect x={46} y={14} width={9} height={6} rx={2} />
      <rect x={45} y={10} width={3} height={3} />
      <rect x={49} y={9} width={3} height={3} />
      <rect x={53} y={10} width={3} height={3} />
    </g>
  ),

  'soft-heart': (
    <>
      {heart(44, 6, 0.8, 'fill-accent-soft')}
      {spark(58, 2, 'fill-accent')}
    </>
  ),

  wifi: (
    <>
      <rect x={21} y={-4} width={2} height={2} className="fill-accent" />
      <rect x={18} y={-8} width={8} height={2} className="fill-accent" />
      <rect x={16} y={-6} width={2} height={2} className="fill-accent" />
      <rect x={26} y={-6} width={2} height={2} className="fill-accent" />
      <rect x={15} y={-12} width={14} height={2} className="fill-accent-soft" />
      <rect x={13} y={-10} width={2} height={2} className="fill-accent-soft" />
      <rect x={29} y={-10} width={2} height={2} className="fill-accent-soft" />
      <rect x={12} y={-16} width={20} height={2} className="fill-fg-muted" />
      <rect x={10} y={-14} width={2} height={2} className="fill-fg-muted" />
      <rect x={32} y={-14} width={2} height={2} className="fill-fg-muted" />
    </>
  ),

  ghost: (
    <>
      <path
        d="M4 -2 H40 V22 l-4 4 -4 -4 -4 4 -4 -4 -4 4 -4 -4 -4 4 -4 -4 Z"
        className="fill-fg"
      />
      <rect x={14} y={6} width={4} height={9} className="fill-ink" />
      <rect x={26} y={6} width={4} height={9} className="fill-ink" />
    </>
  ),

  /* ---- november ------------------------------------------------------------ */
  cake: (
    <>
      <path d="M44 26 L60 20 V28 H44 Z" className="fill-accent-soft" />
      <path d="M44 25 L60 19 L61 21 L45 27 Z" className="fill-accent" />
      <rect x={50} y={12} width={2} height={7} className="fill-fg" />
      <rect x={50} y={9} width={2} height={3} className="fill-accent" />
    </>
  ),

  padlock: (
    <>
      <rect x={45} y={14} width={12} height={10} className="fill-accent" />
      <rect x={47} y={8} width={2} height={6} className="fill-fg" />
      <rect x={53} y={8} width={2} height={6} className="fill-fg" />
      <rect x={47} y={6} width={8} height={2} className="fill-fg" />
      <rect x={50} y={17} width={2} height={4} className="fill-ink" />
    </>
  ),

  /* ---- december ------------------------------------------------------------ */
  ninja: (
    <>
      <rect x={6} y={5} width={32} height={4} className="fill-ink" />
      <rect x={-4} y={4} width={8} height={3} className="fill-ink" />
      <rect x={-6} y={8} width={8} height={3} className="fill-ink" />
    </>
  ),

  mountain: (
    <>
      <path d="M42 28 L50 12 L55 22 L60 8 L70 28 Z" className="fill-fg-muted" />
      <path d="M48 16 L50 12 L52 16 Z" className="fill-fg" />
      <path d="M58 12 L60 8 L62 12 Z" className="fill-fg" />
    </>
  ),

  gift: (
    <>
      <rect x={44} y={16} width={12} height={10} className="fill-accent" />
      <rect x={49} y={16} width={2} height={10} className="fill-fg" />
      <rect x={44} y={20} width={12} height={2} className="fill-fg" />
      <rect x={46} y={12} width={3} height={4} className="fill-accent-soft" />
      <rect x={51} y={12} width={3} height={4} className="fill-accent-soft" />
      <rect x={49} y={13} width={2} height={3} className="fill-fg" />
    </>
  ),

  santa: (
    <>
      <rect x={10} y={-3} width={24} height={4} className="fill-fg" />
      <path d="M12 -3 L32 -3 L36 -14 Z" className="fill-accent" />
      <rect x={34} y={-18} width={5} height={5} className="fill-fg" />
    </>
  ),

  /* ---- dev / nerd days ------------------------------------------------- */
  duck: (
    <>
      <rect x={46} y={20} width={10} height={7} className="fill-accent-soft" />
      <rect x={52} y={13} width={6} height={6} className="fill-accent-soft" />
      <rect x={58} y={15} width={4} height={2} className="fill-accent" />
      <rect x={54} y={15} width={2} height={2} className="fill-ink" />
      <rect x={48} y={22} width={4} height={3} className="fill-accent" />
    </>
  ),

  groundhog: (
    <>
      <rect x={44} y={30} width={16} height={2} className="fill-line" />
      <rect x={44} y={32} width={16} height={4} className="fill-ink" />
      <rect x={48} y={20} width={2} height={2} className="fill-fg-muted" />
      <rect x={55} y={20} width={2} height={2} className="fill-fg-muted" />
      <rect x={48} y={22} width={9} height={9} className="fill-fg-muted" />
      <rect x={50} y={25} width={2} height={2} className="fill-ink" />
      <rect x={53} y={25} width={2} height={2} className="fill-ink" />
      <rect x={52} y={29} width={2} height={2} className="fill-fg" />
    </>
  ),

  mario: (
    <>
      <rect x={8} y={-1} width={22} height={3} className="fill-accent" />
      <rect x={12} y={-8} width={17} height={7} className="fill-accent" />
      <rect x={19} y={-6} width={5} height={5} className="fill-fg" />
      {/* power-up mushroom beside it */}
      <rect x={45} y={12} width={12} height={6} className="fill-accent" />
      <rect x={47} y={13} width={3} height={3} className="fill-fg" />
      <rect x={53} y={13} width={3} height={3} className="fill-fg" />
      <rect x={48} y={18} width={7} height={5} className="fill-fg" />
      <rect x={50} y={19} width={1} height={3} className="fill-ink" />
      <rect x={53} y={19} width={1} height={3} className="fill-ink" />
    </>
  ),

  floppy: (
    <>
      <rect x={44} y={10} width={12} height={12} className="fill-accent" />
      <rect x={47} y={10} width={6} height={5} className="fill-ink" />
      <rect x={51} y={11} width={2} height={3} className="fill-fg" />
      <rect x={46} y={17} width={8} height={5} className="fill-fg" />
      <rect x={47} y={18} width={6} height={1} className="fill-line" />
      <rect x={47} y={20} width={6} height={1} className="fill-line" />
    </>
  ),

  notfound: (
    <>
      {/* the body vanishes into the page… */}
      <g className="fill-ink">
        <rect x={8} y={0} width={28} height={4} />
        <rect x={4} y={4} width={36} height={24} />
        <rect x={0} y={12} width={4} height={8} />
        <rect x={40} y={12} width={4} height={8} />
      </g>
      {/* …leaving a dashed silhouette, two eyes, and an apology. */}
      <rect
        x={2}
        y={-2}
        width={40}
        height={32}
        fill="none"
        strokeWidth={1.5}
        strokeDasharray="3 3"
        className="stroke-fg-muted"
      />
      <rect x={13} y={10} width={4} height={10} className="fill-fg" />
      <rect x={27} y={10} width={4} height={10} className="fill-fg" />
      <text x={11} y={-7} fontSize={9} className="fill-accent font-mono">
        404
      </text>
    </>
  ),

  lightsaber: (
    <>
      <rect x={45} y={0} width={6} height={21} opacity={0.4} className="fill-accent-soft" />
      <rect x={47} y={1} width={2} height={19} className="fill-accent" />
      <rect x={46} y={20} width={4} height={7} className="fill-fg" />
      <rect x={46} y={22} width={4} height={1} className="fill-ink" />
      <rect x={46} y={24} width={4} height={1} className="fill-ink" />
    </>
  ),

  towel: (
    <>
      <rect x={32} y={4} width={12} height={4} className="fill-accent-soft" />
      <rect x={34} y={8} width={8} height={14} className="fill-accent-soft" />
      <rect x={34} y={11} width={8} height={2} className="fill-accent" />
      <rect x={34} y={17} width={8} height={2} className="fill-accent" />
    </>
  ),

  turing: (
    <g transform="rotate(-6 50 14)">
      <rect x={40} y={10} width={22} height={7} className="fill-fg" />
      <rect x={43} y={12} width={2} height={2} className="fill-ink" />
      <rect x={47} y={12} width={2} height={2} className="fill-ink" />
      <rect x={51} y={12} width={2} height={2} className="fill-ink" />
      <rect x={55} y={12} width={2} height={2} className="fill-ink" />
      <rect x={59} y={12} width={2} height={2} className="fill-ink" />
    </g>
  ),

  moth: (
    <>
      <rect x={48} y={2} width={10} height={3} className="fill-line" />
      <path d="M46 6 L52 10 L46 14 Z" className="fill-fg-muted" />
      <path d="M60 6 L54 10 L60 14 Z" className="fill-fg-muted" />
      <rect x={52} y={7} width={2} height={7} className="fill-accent-soft" />
      <rect x={51} y={4} width={1} height={3} className="fill-fg-muted" />
      <rect x={54} y={4} width={1} height={3} className="fill-fg-muted" />
    </>
  ),

  flames: (
    <>
      <rect x={0} y={29} width={7} height={2} className="fill-accent" />
      <rect x={-6} y={30} width={6} height={2} className="fill-accent-soft" />
      <rect x={-11} y={31} width={5} height={2} className="fill-fg-muted" />
      <rect x={2} y={33} width={7} height={2} className="fill-accent-soft" />
      <rect x={-4} y={34} width={5} height={2} className="fill-fg-muted" />
    </>
  ),

  portal: (
    <>
      <path d="M-6 4 L4 14 L-6 24 L-16 14 Z" fill="none" strokeWidth={2} className="stroke-fg-muted" />
      <path d="M-6 8 L0 14 L-6 20 L-12 14 Z" fill="none" strokeWidth={2} className="stroke-accent" />
      <rect x={-7} y={13} width={3} height={3} className="fill-accent-soft" />
    </>
  ),

  /* ---- national days ---------------------------------------------------- */
  /* The one deliberate palette exception: a national flag has to wear its
     real colours — saffron, white, green, navy — in both themes. */
  tricolor: (
    <>
      <rect x={44} y={2} width={2} height={26} className="fill-fg-muted" />
      <rect x={46} y={2} width={16} height={4} fill="#ff9933" />
      <rect x={46} y={6} width={16} height={4} fill="#ffffff" />
      <rect x={46} y={10} width={16} height={4} fill="#138808" />
      <rect x={53} y={7} width={2} height={2} fill="#000080" />
      <rect x={46} y={2} width={16} height={12} fill="none" strokeWidth={1} className="stroke-line" />
    </>
  ),

  mortarboard: (
    <>
      <path d="M8 -3 L22 -9 L36 -3 L22 3 Z" className="fill-fg" />
      <rect x={16} y={-1} width={12} height={4} className="fill-fg" />
      <rect x={21} y={-5} width={2} height={2} className="fill-fg-muted" />
      <path d="M34 -3 L38 3" strokeWidth={1.5} fill="none" className="stroke-accent" />
      <rect x={37} y={3} width={3} height={3} className="fill-accent" />
    </>
  ),

  gandhi: (
    <>
      <g fill="none" strokeWidth={2} className="stroke-ink">
        <circle cx={14.5} cy={14} r={4.5} />
        <circle cx={29.5} cy={14} r={4.5} />
      </g>
      <rect x={19} y={13} width={6} height={2} className="fill-ink" />
      <rect x={4} y={13} width={6} height={2} className="fill-ink" />
      <rect x={34} y={13} width={6} height={2} className="fill-ink" />
    </>
  ),

  /* ---- more days ---------------------------------------------------------- */
  earth: (
    <>
      <rect x={44} y={0} width={13} height={13} rx={6} className="fill-fg" />
      <rect x={47} y={3} width={4} height={3} className="fill-ink" />
      <rect x={52} y={6} width={4} height={4} className="fill-ink" />
      <rect x={46} y={8} width={3} height={3} className="fill-ink" />
      {spark(58, -4, 'fill-accent-soft')}
    </>
  ),

  pizza: (
    <>
      <rect x={43} y={5} width={16} height={4} className="fill-accent" />
      <path d="M44 9 L58 9 L51 24 Z" className="fill-accent-soft" />
      <rect x={47} y={11} width={2} height={2} className="fill-ink" />
      <rect x={52} y={12} width={2} height={2} className="fill-ink" />
      <rect x={49} y={16} width={2} height={2} className="fill-ink" />
    </>
  ),

  camera: (
    <>
      <rect x={44} y={10} width={14} height={10} className="fill-fg" />
      <rect x={48} y={12} width={6} height={6} className="fill-ink" />
      <rect x={50} y={14} width={2} height={2} className="fill-fg-muted" />
      <rect x={45} y={8} width={4} height={2} className="fill-accent" />
      <rect x={54} y={12} width={3} height={2} className="fill-accent" />
      {spark(58, 2, 'fill-accent-soft')}
    </>
  ),
} satisfies Record<string, ReactNode>

export type WardrobeKey = keyof typeof WARDROBE
