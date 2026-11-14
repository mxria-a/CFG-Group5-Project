import React, { useState } from "react";
import "./RestaurantLogo.css";

// Established brands use their official-site favicons. These are independent demo data.
const RESTAURANT_DOMAINS = {
  "bella italia": "bellaitalia.co.uk",
  "bone daddies": "bonedaddies.com",
  "burger king": "burgerking.co.uk",
  "cinnamon club": "cinnamonclub.com",
  "dishoom": "dishoom.com",
  "domino's": "dominos.co.uk",
  "dominos": "dominos.co.uk",
  "five guys": "fiveguys.co.uk",
  "franco manca": "francomanca.co.uk",
  "homeslice": "homeslicepizza.co.uk",
  "marugame udon": "marugame.co.uk",
  "masala zone": "masalazone.com",
  "mcdonald's": "mcdonalds.com",
  "mcdonalds": "mcdonalds.com",
  "napoli gang": "napoligang.co.uk",
  "papa john's": "papajohns.co.uk",
  "papa johns": "papajohns.co.uk",
  "pho": "phocafe.co.uk",
  "pizza express": "pizzaexpress.com",
  "pizza pilgrims": "pizzapilgrims.co.uk",
  "pizzaexpress": "pizzaexpress.com",
  "roti king": "rotiking.co.uk",
  "shake shack": "shakeshack.co.uk",
  "shoryu ramen": "shoryuramen.com",
  "tayyabs": "tayyabs.co.uk",
  "thai square": "thaisq.com",
  "tonkotsu": "tonkotsu.co.uk",
  "wagamama": "wagamama.com",
  "yard sale pizza": "yardsalepizza.com",
};

// Original, local SVG artwork for the demo restaurant names in the Pickier database.
const DEMO_LOGOS = {
  "sushi zen": "sushi-zen",
  "tokyo express": "tokyo-express",
  "samurai sushi": "samurai-sushi",
  "oishii eats": "oishii-eats",
  "sushi go": "sushi-go",
  "blue fin": "blue-fin",
  "raw fish co": "raw-fish-co",
  "sashimi station": "sashimi-station",
  "the roll house": "the-roll-house",
  "nippon bites": "nippon-bites",
  "cluckin good": "cluckin-good",
  "nashville hot": "nashville-hot",
  "the roost": "the-roost",
  "wing king": "wing-king",
  "bird & bun": "bird-bun",
  "fried & true": "fried-true",
  "crispy coop": "crispy-coop",
  "golden hen": "golden-hen",
  "spicy bird": "spicy-bird",
  "kfcopy": "kfcopy",
  "the waffle house": "the-waffle-house",
  "belgian delights": "belgian-delights",
  "sweet stack": "sweet-stack",
  "morning waffle": "morning-waffle",
  "waffle & dough": "waffle-dough",
  "syrup society": "syrup-society",
  "the grid": "the-grid",
  "iron waffles": "iron-waffles",
  "batter up": "batter-up",
  "sugar rush": "sugar-rush",
  "benito burrito": "benito-burrito",
  "tortilla bros": "tortilla-bros",
  "wrap it up": "wrap-it-up",
  "guac & roll": "guac-roll",
  "spicy bean": "spicy-bean",
  "the burrito bar": "the-burrito-bar",
  "salsa street": "salsa-street",
  "mexican wave": "mexican-wave",
  "loco burrito": "loco-burrito",
  "wrap star": "wrap-star",
  "joes pizza": "joes-pizza",
  "biang biang noodles": "biang-biang-noodles",
  "chow mein central": "chow-mein-central",
  "the noodle bar": "the-noodle-bar",
  "curry house": "curry-house",
  "spice of india": "spice-of-india",
  "the bombay bicycle": "the-bombay-bicycle",
  "taste of bengal": "taste-of-bengal",
  "madras cafe": "madras-cafe",
};

function initialsFor(name) {
  const words = String(name || "Restaurant").replace(/[^\p{L}\p{N} ]/gu, " ").trim().split(/\s+/).filter(Boolean);
  return words.slice(0, 2).map(word => word[0].toUpperCase()).join("") || "R";
}

export default function RestaurantLogo({ name }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const normalized = String(name || "").trim().toLowerCase().replace(/\s+/g, " ");
  const domain = RESTAURANT_DOMAINS[normalized];
  const demoFile = DEMO_LOGOS[normalized];
  const src = domain
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
    : demoFile
      ? `${process.env.PUBLIC_URL || ""}/restaurant-logos/${demoFile}.svg`
      : null;
  const showIcon = Boolean(src) && failedSrc !== src;

  return (
    <span className="pk-restaurant-logo" aria-hidden="true">
      {showIcon ? (
        <img
          src={src}
          alt=""
          width="30"
          height="30"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <span className="pk-restaurant-logo-initials">{initialsFor(name)}</span>
      )}
    </span>
  );
}
