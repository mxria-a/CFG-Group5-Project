import React from "react";

/** Flat SVG artwork for food items in the results and details views. */
export default function FoodCardIllustration({ name = "" }) {
  const food = String(name).toLowerCase();

  if (/chicken|wing|drumstick/.test(food) && !/pizza/.test(food)) {
    return (
      <svg className="pk-food-art" viewBox="0 0 200 150" aria-hidden="true" focusable="false">
        <g transform="rotate(-25 100 75)">
          <ellipse cx="86" cy="68" rx="50" ry="36" fill="#D9822B" />
          <ellipse cx="76" cy="58" rx="22" ry="12" fill="#F2A33A" />
          <rect x="126" y="60" width="42" height="12" rx="6" fill="#FFF3E6" />
          <circle cx="170" cy="60" r="8" fill="#FFF3E6" />
          <circle cx="170" cy="74" r="8" fill="#FFF3E6" />
        </g>
      </svg>
    );
  }
  if (/pizza/.test(food)) {
    return (
      <svg className="pk-food-art" viewBox="0 0 200 150" aria-hidden="true" focusable="false">
        <path d="M24 32Q101-4 175 34L104 144Z" fill="#ECA33F" stroke="#B56A24" strokeWidth="9" strokeLinejoin="round" />
        <path d="M35 42Q100 17 162 43L105 129Z" fill="#FFC93C" />
        <path d="M26 33Q100-8 176 34" fill="none" stroke="#D68B47" strokeWidth="16" strokeLinecap="round" />
        <circle cx="87" cy="53" r="12" fill="#C93F45" /><circle cx="125" cy="65" r="12" fill="#C93F45" /><circle cx="102" cy="102" r="11" fill="#C93F45" />
        <path d="M72 78l10 4m48 10l-6 8" stroke="#2F6B4F" strokeWidth="7" strokeLinecap="round" />
      </svg>
    );
  }
  if (/sushi/.test(food)) {
    return (
      <svg className="pk-food-art" viewBox="0 0 200 150" aria-hidden="true" focusable="false">
        {[42, 100, 158].map((x) => (
          <g key={x} transform={`translate(${x - 31} 42)`}>
            <rect x="0" y="22" width="60" height="54" rx="15" fill="#19211B" />
            <rect x="5" y="6" width="50" height="58" rx="18" fill="#FFF3E6" />
            <rect x="12" y="16" width="36" height="33" rx="12" fill="#FF8A70" />
          </g>
        ))}
      </svg>
    );
  }
  if (/noodle|ramen|curry/.test(food)) {
    return (
      <svg className="pk-food-art" viewBox="0 0 200 150" aria-hidden="true" focusable="false">
        <path d="M32 64h136c-4 48-29 70-68 70S36 112 32 64Z" fill="#FFF3E6" />
        <path d="M40 65h120" stroke="#FF4B4B" strokeWidth="7" strokeLinecap="round" />
        <path d="M64 53q-11-18 4-23t5-16M97 53q-11-18 4-23t5-16M128 53q-11-18 4-23t5-16" fill="none" stroke="#FFC93C" strokeWidth="7" strokeLinecap="round" />
        <path d="M85 84l30 6" stroke="#FF4B4B" strokeWidth="8" strokeLinecap="round" />
      </svg>
    );
  }
  if (/waffle|pancake/.test(food)) {
    return (
      <svg className="pk-food-art" viewBox="0 0 200 150" aria-hidden="true" focusable="false">
        <rect x="35" y="29" width="130" height="108" rx="26" fill="#CB7B2D" />
        <rect x="42" y="36" width="116" height="94" rx="24" fill="#F2A33A" />
        {[66, 100, 134].map((x) => <path key={x} d={`M${x} 41v82`} stroke="#D78931" strokeWidth="7" />)}
        {[63, 96].map((y) => <path key={y} d={`M48 ${y}h104`} stroke="#D78931" strokeWidth="7" />)}
        <path d="M78 34q14-24 38-1" stroke="#FFF3E6" strokeWidth="10" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg className="pk-food-art" viewBox="0 0 200 150" aria-hidden="true" focusable="false">
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
