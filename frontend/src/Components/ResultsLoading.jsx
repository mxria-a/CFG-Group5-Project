import React from "react";
import FoodCardIllustration from "./FoodCardIllustration";
import "./ResultsLoading.css";

export default function ResultsLoading({ dish, postcode }) {
  const food = String(dish || "food").trim();
  const location = String(postcode || "").trim().toUpperCase();

  return (
    <section className="pk-results-loading" role="status" aria-live="polite" aria-label="Searching for nearby dishes">
      <div className="pk-loading-header">
        <div className="pk-loading-art-frame" aria-hidden="true">
          <span className="pk-loading-art-orbit" />
          <span className="pk-loading-art-star pk-loading-art-star-one">✦</span>
          <span className="pk-loading-art-star pk-loading-art-star-two">✦</span>
          <div className="pk-loading-art-food"><FoodCardIllustration name={food} /></div>
        </div>
        <p className="pk-loading-kicker"><span className="pk-loading-pulse" /> ON THE HUNT</p>
        <h2>Finding your next favourite<span className="pk-loading-ellipsis" aria-hidden="true">...</span></h2>
        <p className="pk-loading-description">
          {location
            ? <>We're searching for {food} near <strong>{location}</strong>. Something tasty is coming together!</>
            : <>We're searching for {food}. Something tasty is coming together!</>}
        </p>
      </div>

      <div className="pk-loading-skeleton-header" aria-hidden="true">
        <span className="pk-loading-section-label">Getting your options ready</span>
        <span className="pk-loading-section-detail">One tasty shortlist coming up</span>
      </div>
      <div className="pk-loading-grid" aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <div key={index} className="pk-loading-card">
            <div className="pk-loading-card-top"><span className="pk-loading-shimmer pk-loading-line pk-loading-restaurant" /></div>
            <div className={`pk-loading-card-picture pk-loading-card-picture-${index}`}>
              <div className="pk-loading-shimmer pk-loading-food-placeholder" />
            </div>
            <div className="pk-loading-card-copy">
              <span className="pk-loading-shimmer pk-loading-line pk-loading-title" />
              <span className="pk-loading-shimmer pk-loading-line pk-loading-meta" />
              <span className="pk-loading-shimmer pk-loading-line pk-loading-button" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
