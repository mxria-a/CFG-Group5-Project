/** Decorative illustration recreated as SVG from the supplied Claude homepage mockup. */
export default function BurgerIllustration({ small = false, className = "" }) {
  if (small) {
    return (
      <svg className={className} viewBox="0 0 200 150" role="img" aria-label="Illustrated burger">
        <path d="M30 70C30 30 65 10 100 10s70 20 70 60z" fill="#F2A33A" />
        <ellipse cx="80" cy="36" rx="6" ry="3" fill="#FFF3E6" />
        <ellipse cx="112" cy="26" rx="6" ry="3" fill="#FFF3E6" />
        <ellipse cx="138" cy="46" rx="6" ry="3" fill="#FFF3E6" />
        <path d="M24 74q10 10 22 0t22 0 22 0 22 0 22 0 22 0 22 0v12H24z" fill="#7BD389" />
        <path d="M30 86h140l-14 18-20-12-26 14-26-14-20 12z" fill="#FFC93C" />
        <rect x="24" y="96" width="152" height="24" rx="12" fill="#5A2E22" />
        <path d="M30 120h140v8c0 14-14 20-34 20H64c-20 0-34-6-34-20z" fill="#F2A33A" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 360 320" role="img" aria-label="Playful illustrated cheeseburger">
      {/* Separate SVG groups let each ingredient hop independently on hover. */}
      <g className="pk-burger-layer pk-burger-top-bun">
        <path d="M40 140C40 60 100 20 180 20s140 40 140 120z" fill="#F2A33A" />
        <ellipse cx="120" cy="70" rx="9" ry="5" fill="#FFF3E6" transform="rotate(-20 120 70)" />
        <ellipse cx="190" cy="50" rx="9" ry="5" fill="#FFF3E6" transform="rotate(10 190 50)" />
        <ellipse cx="245" cy="85" rx="9" ry="5" fill="#FFF3E6" transform="rotate(30 245 85)" />
        <ellipse cx="160" cy="100" rx="9" ry="5" fill="#FFF3E6" />
      </g>
      <g className="pk-burger-layer pk-burger-lettuce">
        <path d="M30 146q20 20 40 0t40 0 40 0 40 0 40 0 40 0 40 0v24H30z" fill="#7BD389" />
      </g>
      <g className="pk-burger-layer pk-burger-cheese">
        <path d="M40 170h280l-26 36-34-24-46 28-46-28-34 24-48-36z" fill="#FFC93C" />
      </g>
      <g className="pk-burger-layer pk-burger-patty">
        <rect x="30" y="190" width="300" height="46" rx="22" fill="#5A2E22" />
      </g>
      <g className="pk-burger-layer pk-burger-sauce">
        <rect x="40" y="236" width="280" height="16" rx="8" fill="#FF4B4B" />
      </g>
      <g className="pk-burger-layer pk-burger-bottom-bun">
        <path d="M40 252h280v16c0 22-24 36-60 36H100c-36 0-60-14-60-36z" fill="#F2A33A" />
      </g>
    </svg>
  );
}
