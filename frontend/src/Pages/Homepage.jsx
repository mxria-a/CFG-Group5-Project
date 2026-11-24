import { useContext, useEffect, useId, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { StoreContext } from "../Context/shop-context";
import BurgerIllustration from "../Components/BurgerIllustration";
import FoodComparisonPage from "./FoodComparisonPage";
import { clearLastSearch, getLastSearch, saveLastSearch } from "../utils/searchSession";
import "./Homepage.css";

// The options and the postcode-to-results behaviour are carried over from the original homepage.
const FOOD_OPTIONS = ["Burger", "Pizza", "Sushi", "Chicken", "Noodles", "Curry", "Waffle", "Burrito"];
const POPULAR = ["Burger", "Pizza", "Chicken"];

const STEPS = [
  { number: "01", title: "Find your food", text: "Choose what you're craving and enter your postcode." },
  { number: "02", title: "Compare your options", text: "Explore prices, delivery times and other useful information side by side." },
  { number: "03", title: "Pick your favourite", text: "Choose the option that works best for you." },
];

// A themed, keyboard-accessible dropdown. The selected string is still passed
// to the original search handler and backend exactly as with the native <select>.
const DISH_ICONS = {
  Burger: "🍔", Pizza: "🍕", Sushi: "🍣", Chicken: "🍗",
  Noodles: "🍜", Curry: "🍛", Waffle: "🧇", Burrito: "🌯",
};

function DishDropdown({ value, onChange, labelId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);
  const listboxId = useId();
  const valueId = useId();
  const options = ["", ...FOOD_OPTIONS];

  const openAt = (index) => {
    setActiveIndex(Math.min(Math.max(index, 0), options.length - 1));
    setIsOpen(true);
  };

  const selectOption = (nextValue) => {
    onChange(nextValue);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!isOpen) return undefined;
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) optionRefs.current[activeIndex]?.focus();
  }, [isOpen, activeIndex]);

  const handleTriggerKeyDown = (event) => {
    const current = Math.max(0, options.indexOf(value));
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openAt((current + 1) % options.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openAt((current - 1 + options.length) % options.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      openAt(0);
    } else if (event.key === "End") {
      event.preventDefault();
      openAt(options.length - 1);
    }
  };

  const handleOptionKeyDown = (event, index) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((index + 1) % options.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((index - 1 + options.length) % options.length);
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        selectOption(options[index]);
        break;
      case "Escape":
        event.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
      default:
        if (event.key.length === 1 && /[a-z]/i.test(event.key)) {
          const next = options.findIndex((name, i) =>
            i > index && name.toLowerCase().startsWith(event.key.toLowerCase())
          );
          const first = options.findIndex((name) =>
            name.toLowerCase().startsWith(event.key.toLowerCase())
          );
          if (next !== -1 || first !== -1) {
            event.preventDefault();
            setActiveIndex(next !== -1 ? next : first);
          }
        }
    }
  };

  return (
    <div
      className={`pk-dish-dropdown${isOpen ? " is-open" : ""}`}
      ref={rootRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        className={`pk-dish-trigger${value ? "" : " is-placeholder"}`}
        type="button"
        aria-labelledby={`${labelId} ${valueId}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        onClick={() => isOpen ? setIsOpen(false) : openAt(Math.max(0, options.indexOf(value)))}
        onKeyDown={handleTriggerKeyDown}
      >
        <span id={valueId} className="pk-dish-value">{value || "What are you craving?"}</span>
        <svg className="pk-dish-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {isOpen && (
        <div className="pk-dish-options" role="listbox" id={listboxId} aria-labelledby={labelId}>
          {options.map((food, index) => (
            <button
              key={food || "any"}
              type="button"
              role="option"
              ref={(element) => { optionRefs.current[index] = element; }}
              tabIndex={index === activeIndex ? 0 : -1}
              aria-selected={value === food}
              className="pk-dish-option"
              onKeyDown={(event) => handleOptionKeyDown(event, index)}
              onClick={() => selectOption(food)}
            >
              <span className="pk-dish-option-icon" aria-hidden="true">{DISH_ICONS[food] || "✦"}</span>
              <span>{food || "What are you craving?"}</span>
              {value === food && (
                <svg className="pk-dish-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
  const location = useLocation();
  const { setComparisonItems } = useContext(StoreContext);
  const showdownRequested = new URLSearchParams(location.search).get("showdown") === "1";
  const [lastSearch] = useState(getLastSearch);
  const [item, setItem] = useState(lastSearch?.item || "");
  const [postcode, setPostcode] = useState(lastSearch?.postcode || "");
  const [hasSearched, setHasSearched] = useState(Boolean(lastSearch));
  const [showError, setShowError] = useState(false);

  const performSearch = (event) => {
    if (event) event.preventDefault();
    if (!postcode.trim()) {
      setShowError(true);
      return;
    }
    setShowError(false);
    saveLastSearch({ item, postcode });
    setHasSearched(true);
  };

  const resetSearch = () => {
    setComparisonItems([]);
    clearLastSearch();
    setHasSearched(false);
    setItem("");
    setPostcode("");
    setShowError(false);
  };

  return (
    <>
      {hasSearched ? (
        <section className="pk-search-route" aria-label="Food search results">
          <FoodComparisonPage
            showdownRequested={showdownRequested}
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
              <div className="pk-hero-intro">
                <span className="pk-sticker pk-sticker-intro">Compare before you bite</span>
                <h1 id="pk-hero-title">Craving <span>something?</span></h1>
                <p className="pk-hero-description">Find your favourite dish. Compare prices, delivery times and more — all in one place.</p>
              </div>
              <div className="pk-hero-search">
                <form className="pk-search-panel" onSubmit={performSearch}>
                  <div className="pk-search-fields">
                    <div className="pk-field">
                      <span id="pk-dish-label">Dish</span>
                      <DishDropdown labelId="pk-dish-label" value={item} onChange={setItem} />
                    </div>
                    <label className="pk-field">
                      <span>Postcode</span>
                      <input
                        aria-label="Postcode"
                        aria-invalid={showError}
                        aria-describedby={showError ? "pk-postcode-error" : undefined}
                        value={postcode}
                        onChange={(event) => {
                          setPostcode(event.target.value);
                          if (event.target.value.trim()) setShowError(false);
                        }}
                        placeholder="Enter your postcode"
                        autoComplete="postal-code"
                      />
                      {showError && (
                        <span className="pk-field-error" id="pk-postcode-error" role="alert">
                          Please enter your postcode.
                        </span>
                      )}
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
    </>
  );
}
