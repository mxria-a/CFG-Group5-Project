import { useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import BurgerIllustration from "../Components/BurgerIllustration";
import FoodComparisonPage from "./FoodComparisonPage";
import "./Homepage.css";

// The options and the postcode-to-results behaviour are carried over from the original homepage.
const FOOD_OPTIONS = ["Burger", "Pizza", "Sushi", "Chicken", "Noodles", "Curry", "Waffle", "Burrito"];
const POPULAR = ["Burger", "Pizza", "Chicken"];

const STEPS = [
  { number: "01", title: "Find your food", text: "Choose what you're craving and enter your postcode." },
  { number: "02", title: "Compare your options", text: "Explore prices, delivery times and other useful information side by side." },
  { number: "03", title: "Pick your favourite", text: "Choose the option that works best for you." },
];

function DemoCard({ restaurant, dish, price, minutes, accent, badge }) {
  return (
    <div className="pk-demo-card">
      <div className="pk-demo-card-top">
        <span className="pk-demo-letter">{restaurant.slice(-1)}</span>
        <strong>{restaurant}</strong>
      </div>
      <div className="pk-demo-illustration" style={{ backgroundColor: accent }}>
        <BurgerIllustration small />
      </div>
      <div className="pk-demo-details">
        <h3>{dish}</h3>
        <strong className="pk-demo-price">£{price}</strong>
        <p>{minutes} mins</p>
        <span className={`pk-demo-tag ${badge.startsWith("£") ? "pk-demo-tag-green" : ""}`}>{badge}</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [item, setItem] = useState("");
  const [postcode, setPostcode] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [showError, setShowError] = useState(false);

  const performSearch = (event) => {
    if (event) event.preventDefault();
    if (!postcode.trim()) {
      setShowError(true);
      return;
    }
    setHasSearched(true);
  };

  const resetSearch = () => {
    setHasSearched(false);
    setItem("");
    setPostcode("");
  };

  return (
    <>
      {hasSearched ? (
        <section className="pk-legacy-search" aria-label="Food search results">
          <FoodComparisonPage
            searchQuery={item}
            postcode={postcode.trim()}
            onBackToSearch={resetSearch}
          />
        </section>
      ) : (
        <div className="pk-home">
          <section className="pk-hero" aria-labelledby="pk-hero-title">
            <div className="pk-hero-glow" aria-hidden="true" />
            <div className="pk-site-width pk-hero-grid">
              <div className="pk-hero-copy">
                <span className="pk-sticker pk-sticker-intro">Compare before you bite</span>
                <h1 id="pk-hero-title">Craving <span>something?</span></h1>
                <p className="pk-hero-description">Find your favourite dish. Compare prices, delivery times and more — all in one place.</p>

                <form className="pk-search-panel" onSubmit={performSearch}>
                  <div className="pk-search-fields">
                    <label className="pk-field">
                      <span>Dish</span>
                      <select aria-label="Dish" value={item} onChange={(event) => setItem(event.target.value)}>
                        <option value="">What are you craving?</option>
                        {FOOD_OPTIONS.map((food) => <option key={food} value={food}>{food}</option>)}
                      </select>
                    </label>
                    <label className="pk-field">
                      <span>Postcode</span>
                      <input
                        aria-label="Postcode"
                        value={postcode}
                        onChange={(event) => setPostcode(event.target.value)}
                        placeholder="Enter your postcode"
                        autoComplete="postal-code"
                      />
                    </label>
                  </div>
                  <button className="pk-coral-button pk-search-submit" type="submit">Find your takeaway</button>
                </form>
                <div className="pk-popular" aria-label="Popular dishes">
                  <span>Popular:</span>
                  {POPULAR.map((food) => (
                    <button key={food} type="button" className={`pk-food-chip ${item === food ? "selected" : ""}`} onClick={() => setItem(food)}>
                      {food}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pk-hero-art" aria-hidden="true">
                <BurgerIllustration className="pk-hero-burger" />
                <span className="pk-art-label pk-art-low">£8.50 lowest</span>
                <span className="pk-art-label pk-art-fast">25 mins fastest</span>
                <span className="pk-art-label pk-art-rated">4.7 top rated</span>
              </div>
            </div>
          </section>

          <div className="pk-food-marquee" aria-hidden="true">
            <span>BURGER • PIZZA • FRIED CHICKEN • CHIPS • WINGS • KEBAB • BURGER • PIZZA • FRIED CHICKEN • CHIPS • WINGS •</span>
          </div>

          <section className="pk-site-width pk-how" aria-labelledby="pk-how-heading">
            <h2 id="pk-how-heading">Good food. Smarter choices.</h2>
            <div className="pk-steps">
              {STEPS.map((step) => (
                <div key={step.number} className="pk-step">
                  <strong className="pk-step-number">{step.number}</strong>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="pk-compare-section" aria-labelledby="pk-compare-heading">
            <div className="pk-site-width pk-compare-grid">
              <div className="pk-compare-copy">
                <h2 id="pk-compare-heading">Same craving.<br />Better choice.</h2>
                <p>Compare what matters before deciding what to order.</p>
                <span className="pk-demo-disclaimer">Example only, not live offers.</span>
                <button className="pk-coral-button" onClick={() => document.getElementById("pk-hero-title")?.scrollIntoView({ behavior: "smooth" })}>
                  Start comparing
                </button>
              </div>
              <div className="pk-demo-cards" aria-label="Example comparison of two burgers">
                <DemoCard restaurant="Restaurant A" dish="Burger A" price="8.50" minutes="35" accent="#C93F45" badge="£3.50 cheaper" />
                <DemoCard restaurant="Restaurant B" dish="Burger B" price="12.00" minutes="25" accent="#2F6B4F" badge="10 mins faster" />
                <span className="pk-vs" aria-hidden="true">VS</span>
              </div>
            </div>
          </section>
        </div>
      )}
      <Snackbar open={showError} autoHideDuration={4000} onClose={() => setShowError(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="error" variant="filled" onClose={() => setShowError(false)} sx={{ width: "100%" }}>
          Please enter a postcode to find takeaways near you!
        </Alert>
      </Snackbar>
    </>
  );
}
