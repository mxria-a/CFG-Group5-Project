import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ItemList from "../Components/ItemList";
import FoodCardIllustration from "../Components/FoodCardIllustration";
import DishDetailsModal from "../Components/DishDetailsModal";
import DishCustomisationModal from "../Components/DishCustomisationModal";
import { getSimilarDishRecommendations, getDishCategory, getRestaurantCategoryItems, pluralCategory } from "../utils/menuDiscovery";
import ResultsLoading from "../Components/ResultsLoading";
import ComparisonTable from "../Components/ComparisonTable";
import { StoreContext } from "../Context/shop-context";
import { fetchCoords } from "../utils/fetchCoords";
import { getDistance } from "../utils/distanceCalculator";
import { getDishRefinementOptions, matchesDishRefinement } from "../utils/foodRefinements";
import { saveLastSearch } from "../utils/searchSession";
import { attachMenuStartingPrices, getItemComparablePrice } from "../utils/menuDisplayPrice";
import "./FoodComparisonPage.css";
import "./RestaurantFilter.css";
import "./CompactCravings.css";

const API = "https://cfg-group5-backend.onrender.com/comparison-table-items";
const MAX_DISTANCE_KM = 50;
const MAX_COMPARISON_ITEMS = 3;
const CRAVING_CATEGORIES = [
  { slug: "burger", label: "Burgers", icon: "🍔" },
  { slug: "sushi", label: "Sushi", icon: "🍣" },
  { slug: "pizza", label: "Pizzas", icon: "🍕" },
  { slug: "noodles", label: "Noodles", icon: "🍜" },
  { slug: "chicken", label: "Chicken", icon: "🍗" },
  { slug: "curry", label: "Curry", icon: "🍛" },
  { slug: "burrito", label: "Burritos", icon: "🌯" },
  { slug: "waffle", label: "Waffles", icon: "🧇" },
];
const CATEGORY_SEARCH_ALIASES = {
  burger: "burger", burgers: "burger", pizza: "pizza", pizzas: "pizza",
  sushi: "sushi", chicken: "chicken", noodles: "noodles", noodle: "noodles",
  curry: "curry", curries: "curry", waffle: "waffle", waffles: "waffle",
  burrito: "burrito", burritos: "burrito",
};
const scrollToResultsTop = () => window.scrollTo?.({ top: 0, behavior: "smooth" });

// Use the same flat vector art in the selected-dish tray as the cards.
const selectionHint = (count) => {
  if (count === 1) return "Pick 1 or 2 more to compare";
  if (count === 2) return "Ready to compare — or add one more";
  return "Your trio is ready to compare!";
};
const SORT_OPTIONS = [
  ["best", "Best match"],
  ["cheapest", "Cheapest"],
  ["fastest", "Fastest"],
  ["nearest", "Nearest"],
  ["rated", "Top rated"],
];

const isNumeric = (value) =>
  value !== null && value !== undefined && value !== "" && Number.isFinite(Number(value));
const metric = (value) => (isNumeric(value) ? Number(value) : Infinity);
const isVegan = (value) => value === true || value === 1 || value === "1" || String(value).toLowerCase() === "true";
const titleCase = (value) => String(value).trim().replace(/\b\w/g, (letter) => letter.toUpperCase());

function FoodComparisonPage({ searchQuery, postcode, onBackToSearch, showdownRequested = false }) {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [activeQuery, setActiveQuery] = useState(String(searchQuery || "").trim());
  const [activePostcode, setActivePostcode] = useState(String(postcode || "").trim().toUpperCase());
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchDraft, setSearchDraft] = useState(String(searchQuery || ""));
  const [activeRefinement, setActiveRefinement] = useState("");
  const [editingPostcode, setEditingPostcode] = useState(false);
  const [postcodeDraft, setPostcodeDraft] = useState(String(postcode || "").trim().toUpperCase());
  const [postcodeError, setPostcodeError] = useState("");
  const [postcodeChecking, setPostcodeChecking] = useState(false);
  const searchInputRef = useRef(null);
  const [restaurantFilter, setRestaurantFilter] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [customiseItem, setCustomiseItem] = useState(null);
  const [customiseOrigin, setCustomiseOrigin] = useState("details");
  const [view, setView] = useState("selection");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [sortBy, setSortBy] = useState("best");
  const [veganOnly, setVeganOnly] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
  const [noticeLeaving, setNoticeLeaving] = useState(false);
  const { addToBasket, addQuotedCustomLine, showBasketToast, comparisonItems: selectedItems, setComparisonItems: setSelectedItems } = useContext(StoreContext);

  useEffect(() => {
    if (showdownRequested && selectedItems.length < 2) {
      navigate("/", { replace: true });
      setView("selection");
    } else {
      setView(showdownRequested ? "comparison" : "selection");
    }
  }, [showdownRequested, selectedItems.length, navigate]);

  // Home returns to the latest results, even after browsing the basket.
  useEffect(() => {
    saveLastSearch({ item: activeQuery, postcode: activePostcode });
  }, [activeQuery, activePostcode]);

  // Keep the complete nearby menu so a new food search does not require going home.
  // Only the postcode changes which dishes are nearby; selecting a category does not refetch.
  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setErrorMessage("");
      try {
        const res = await fetch(API);
        if (!res.ok) throw new Error("Unable to load dishes");
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Unexpected dishes response");
        let nearby = data;
        if (activePostcode) {
          const coords = await fetchCoords(activePostcode);
          const lat = coords?.latitude;
          const lon = coords?.longitude;
          if (!isNumeric(lat) || !isNumeric(lon)) {
            if (active) setErrorMessage(`We couldn't find the postcode “${activePostcode}”. Please try another.`);
            return;
          }
          nearby = data
            .map((item) => {
              const distance = isNumeric(item.longitude) && isNumeric(item.latitude)
                ? getDistance(Number(lon), Number(lat), Number(item.longitude), Number(item.latitude))
                : Infinity;
              return { ...item, distance };
            })
            .filter((item) => item.distance <= MAX_DISTANCE_KM);
        }
        // Get the actual lowest size price for pizzas before showing their cards.
        // The same enriched items feed results, recommendations, and comparisons.
        const pricedNearby = await attachMenuStartingPrices(nearby);
        if (active) setMenuItems(pricedNearby);
      } catch (error) {
        console.error("Could not load search results:", error);
        if (active) setErrorMessage("We couldn't load dishes right now. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [activePostcode]);

  const allItems = useMemo(() => {
    const query = activeQuery.trim().toLowerCase();
    if (!query) return menuItems;
    const category = CATEGORY_SEARCH_ALIASES[query];
    if (category) return menuItems.filter((item) => getDishCategory(item) === category);
    return menuItems.filter((item) =>
      query.split(/\s+/).every((token) =>
        `${item.itemName || ""} ${item.restaurantName || ""}`.toLowerCase().includes(token)
      )
    );
  }, [menuItems, activeQuery]);

  const chooseCraving = (category) => {
    setActiveQuery(category);
    setSearchDraft(category);
    setRestaurantFilter(null);
    setActiveRefinement("");
    setDetailItem(null);
    setSearchExpanded(false);
    setPostcodeError("");
    scrollToResultsTop();
  };
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setActiveQuery(searchDraft.trim());
    setActiveRefinement("");
    setRestaurantFilter(null);
    setDetailItem(null);
    setSearchExpanded(false);
    scrollToResultsTop();
  };
  const handlePostcodeSubmit = async (event) => {
    event.preventDefault();
    const next = postcodeDraft.trim().toUpperCase().replace(/\s+/g, " ");
    if (!next) {
      setPostcodeError("Enter a postcode to search nearby.");
      return;
    }
    if (next === activePostcode) {
      setEditingPostcode(false);
      setPostcodeError("");
      return;
    }
    setPostcodeChecking(true);
    setPostcodeError("");
    try {
      const coords = await fetchCoords(next);
      if (!isNumeric(coords?.latitude) || !isNumeric(coords?.longitude)) {
        setPostcodeError("We couldn't find that postcode. Please check and try again.");
        return;
      }
      setActivePostcode(next);
      setRestaurantFilter(null);
      setDetailItem(null);
      setEditingPostcode(false);
      scrollToResultsTop();
    } catch (error) {
      setPostcodeError("We couldn't check that postcode. Please try again.");
    } finally {
      setPostcodeChecking(false);
    }
  };

  const restaurantItems = useMemo(() => (
    restaurantFilter
      ? getRestaurantCategoryItems(menuItems, restaurantFilter.item, restaurantFilter.category)
      : allItems
  ), [allItems, menuItems, restaurantFilter]);

  const activeCategory = restaurantFilter?.category || CATEGORY_SEARCH_ALIASES[activeQuery.trim().toLowerCase()] || null;
  const availableToRefine = useMemo(() => (
    veganOnly ? restaurantItems.filter((item) => isVegan(item.isVegan)) : restaurantItems
  ), [restaurantItems, veganOnly]);
  // Counts reflect nearby dishes and any restaurant/vegan filter already applied.
  const refinementOptions = useMemo(() => (
    activeCategory ? getDishRefinementOptions(activeCategory, availableToRefine, activeRefinement) : []
  ), [activeCategory, availableToRefine, activeRefinement]);
  const refinedItems = useMemo(() => (
    activeCategory && activeRefinement
      ? restaurantItems.filter((item) => matchesDishRefinement(item, activeCategory, activeRefinement))
      : restaurantItems
  ), [restaurantItems, activeCategory, activeRefinement]);

  const visibleItems = useMemo(() => {
    const filtered = veganOnly ? refinedItems.filter((item) => isVegan(item.isVegan)) : refinedItems;
    const sorted = [...filtered];
    switch (sortBy) {
      case "cheapest": sorted.sort((a, b) => metric(getItemComparablePrice(a)) - metric(getItemComparablePrice(b))); break;
      case "fastest": sorted.sort((a, b) => metric(a.deliveryTime) - metric(b.deliveryTime)); break;
      case "nearest": sorted.sort((a, b) => metric(a.distance) - metric(b.distance)); break;
      case "rated": sorted.sort((a, b) => (isNumeric(b.avRating) ? Number(b.avRating) : -Infinity) - (isNumeric(a.avRating) ? Number(a.avRating) : -Infinity)); break;
      default: break;
    }

    // All highlights are calculated from the actual loaded dishes, never hard-coded examples.
    const lowest = Math.min(...filtered.map(getItemComparablePrice).filter(isNumeric).map(Number));
    const fastest = Math.min(...filtered.filter((item) => isNumeric(item.deliveryTime)).map((item) => Number(item.deliveryTime)));
    const highest = Math.max(...filtered.filter((item) => isNumeric(item.avRating)).map((item) => Number(item.avRating)));
    return sorted.map((item) => {
      let highlight = null;
      if (isNumeric(getItemComparablePrice(item)) && getItemComparablePrice(item) === lowest) highlight = { kind: "cheapest", text: "Cheapest" };
      else if (isNumeric(item.deliveryTime) && Number(item.deliveryTime) === fastest) highlight = { kind: "fastest", text: "Fastest" };
      else if (isNumeric(item.avRating) && Number(item.avRating) === highest) highlight = { kind: "rated", text: "Top rated" };
      return { ...item, highlight };
    });
  }, [refinedItems, sortBy, veganOnly]);

  const notify = (message, severity = "success") => {
    setNoticeLeaving(false);
    setNotification({ open: true, message, severity });
  };
  const dismissNotice = () => {
    if (notification.open) setNoticeLeaving(true);
  };

  // Hold the notice for 5.2 seconds, then slide/fade it out before unmounting.
  // Clicking dismiss uses the same exit animation; repeated warnings restart the timer.
  useEffect(() => {
    if (!notification.open) return undefined;
    const timeout = window.setTimeout(() => {
      if (noticeLeaving) {
        setNotification((previous) => ({ ...previous, open: false }));
      } else {
        setNoticeLeaving(true);
      }
    }, noticeLeaving ? 220 : 5200);
    return () => window.clearTimeout(timeout);
  }, [notification, noticeLeaving]);
  const handleToggle = (item) => {
    const selected = selectedItems.some((entry) => entry.itemID === item.itemID);
    if (selected) {
      dismissNotice();
      setSelectedItems((previous) => previous.filter((entry) => entry.itemID !== item.itemID));
    } else if (selectedItems.length >= MAX_COMPARISON_ITEMS) {
      notify("Full plate! 🍽️ You've picked 3 dishes. Remove one to make room for another.", "warning");
    } else {
      dismissNotice();
      setSelectedItems((previous) => [...previous, item]);
    }
  };
  const handleCompare = () => {
    if (selectedItems.length < 2) {
      notify("Choose at least 2 dishes to compare.", "info");
      return;
    }
    dismissNotice();
    setView("comparison");
    navigate("/?showdown=1");
    window.scrollTo?.({ top: 0, behavior: "smooth" });
  };
  const handleAddToBasket = () => {
    selectedItems.forEach((item) => addToBasket(item.itemID));
    if (selectedItems.length === 1) {
      const item = selectedItems[0];
      showBasketToast(item, 1, getItemComparablePrice(item));
    } else if (selectedItems.length > 1) {
      showBasketToast({ itemName: "selected dishes" }, selectedItems.length);
    }
    setSelectedItems([]);
  };
  const openCustomisation = (item, origin = "details") => {
    setCustomiseOrigin(origin);
    setDetailItem(null);
    setCustomiseItem(item);
  };
  const saveCustomisation = (item, quote) => {
    const hasCustomisation = Boolean(quote.size || quote.removals?.length || quote.extras?.length);
    if (hasCustomisation) {
      if (!addQuotedCustomLine(item, quote)) {
        notify("We couldn't add that customisation. Please try again.", "warning");
        return;
      }
    } else {
      addToBasket(item.itemID, quote.quantity);
    }
    setCustomiseItem(null);
    showBasketToast(item, quote.quantity, quote.totalPrice);
  };
  const selectFirstThree = () => {
    dismissNotice();
    setSelectedItems((previous) => {
      const available = visibleItems.filter((item) => !previous.some((picked) => picked.itemID === item.itemID));
      return [...previous, ...available].slice(0, MAX_COMPARISON_ITEMS);
    });
  };
  const openRestaurantMenu = (item) => {
    const category = getDishCategory(item);
    if (!category) return;
    dismissNotice();
    setRestaurantFilter({ item, category });
    setActiveRefinement("");
    setActiveQuery(category);
    setSearchDraft(category);
    setDetailItem(null);
    setVeganOnly(false);
    // Keep the visitor’s selected sort when viewing more from a restaurant.
    setView("selection");
    window.scrollTo?.({ top: 0, behavior: "smooth" });
  };
  const restaurantCount = new Set(visibleItems.map((item) => item.restaurantName).filter(Boolean)).size;
  const DISPLAY_NAMES = { burger: "Burgers", pizza: "Pizzas", sushi: "Sushi", chicken: "Chicken", noodle: "Noodles", noodles: "Noodles", curry: "Curry", waffle: "Waffles", burrito: "Burritos" };
  const cleanedQuery = activeQuery.trim();
  const refinementHeading = activeCategory && activeRefinement
    ? `${activeRefinement} ${pluralCategory(activeCategory).toLowerCase()}`
    : null;
  const heading = restaurantFilter
    ? `${refinementHeading || pluralCategory(restaurantFilter.category)} at ${restaurantFilter.item.restaurantName}`
    : refinementHeading ? `${refinementHeading} near you`
    : cleanedQuery ? `${DISPLAY_NAMES[cleanedQuery.toLowerCase()] || titleCase(cleanedQuery)} near you` : "Food near you";
  const hasTray = view === "selection" && selectedItems.length > 0;
  const notice = notification.open && (
    <div className={`pk-results-notice pk-results-notice-${notification.severity}${noticeLeaving ? " is-leaving" : ""}`} role={notification.severity === "warning" ? "alert" : "status"}>
      <span className="pk-results-notice-icon" aria-hidden="true">{notification.severity === "warning" ? "!" : "✓"}</span>
      <span className="pk-results-notice-message">{notification.message}</span>
      <button type="button" className="pk-results-notice-close" aria-label="Dismiss message" onClick={dismissNotice}>×</button>
    </div>
  );

  return (
    <div className="pk-results-page">
      {view === "selection" ? (
        <div className="pk-results-inner">
          <button type="button" className="pk-results-back" onClick={restaurantFilter ? () => setRestaurantFilter(null) : onBackToSearch}>
            {restaurantFilter ? "← Back to all results" : "← Back to search"}
          </button>
          <h1 className="pk-results-heading">{heading}</h1>
          <section className="pk-cravings-bar" aria-label="Switch food category or search again">
            <div className="pk-cravings-row">
              <span className="pk-cravings-label">Switch to</span>
              <div className="pk-cravings-categories" role="group" aria-label="Food categories">
                {CRAVING_CATEGORIES.map(({ slug, label, icon }) => (
                  <button
                    type="button"
                    key={slug}
                    className={`pk-cravings-chip${!restaurantFilter && CATEGORY_SEARCH_ALIASES[cleanedQuery.toLowerCase()] === slug ? " is-active" : ""}`}
                    aria-pressed={!restaurantFilter && CATEGORY_SEARCH_ALIASES[cleanedQuery.toLowerCase()] === slug}
                    onClick={() => chooseCraving(slug)}
                  >
                    <span aria-hidden="true">{icon}</span> {label}
                  </button>
                ))}
              </div>
              <div className="pk-cravings-tools">
                <button
                  type="button"
                  className="pk-cravings-search-toggle"
                  aria-expanded={searchExpanded}
                  aria-controls="pk-cravings-search-form"
                  onClick={() => {
                    setSearchExpanded((open) => !open);
                    if (!searchExpanded) window.requestAnimationFrame?.(() => searchInputRef.current?.focus());
                  }}
                ><span aria-hidden="true">⌕</span> Search</button>
                <div className="pk-cravings-location">
                  <span aria-hidden="true">⌖</span>
                  {editingPostcode ? (
                    <form className="pk-cravings-postcode-form" onSubmit={handlePostcodeSubmit}>
                      <label className="pk-visually-hidden" htmlFor="pk-cravings-postcode">Postcode</label>
                      <input
                        id="pk-cravings-postcode"
                        value={postcodeDraft}
                        onChange={(event) => { setPostcodeDraft(event.target.value); setPostcodeError(""); }}
                        maxLength={12}
                        autoComplete="postal-code"
                        required
                      />
                      <button type="submit" disabled={postcodeChecking}>{postcodeChecking ? "Checking…" : "Save"}</button>
                      <button type="button" onClick={() => { setEditingPostcode(false); setPostcodeDraft(activePostcode); setPostcodeError(""); }}>Cancel</button>
                    </form>
                  ) : (
                    <>
                      <strong>{activePostcode || "No postcode"}</strong>
                      <button type="button" onClick={() => { setPostcodeDraft(activePostcode); setEditingPostcode(true); setPostcodeError(""); }}>Change</button>
                    </>
                  )}
                </div>
              </div>
            </div>
            {searchExpanded && (
              <form id="pk-cravings-search-form" className="pk-cravings-search-form" onSubmit={handleSearchSubmit}>
                <label className="pk-cravings-search-field">
                  <span className="pk-visually-hidden">Search for a dish or restaurant</span>
                  <span aria-hidden="true">⌕</span>
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={searchDraft}
                    onChange={(event) => setSearchDraft(event.target.value)}
                    placeholder="Search any dish or restaurant…"
                    autoComplete="off"
                  />
                </label>
                <button type="submit" className="pk-cravings-search-submit">Search →</button>
              </form>
            )}
            {!loading && !errorMessage && activeCategory && (
              <div className="pk-cravings-refine-row" role="group" aria-label={`Narrow ${pluralCategory(activeCategory).toLowerCase()} by type`}>
                <span className="pk-cravings-refine-label">Narrow it down</span>
                <div className="pk-cravings-refine-options">
                  <button
                    type="button"
                    className={`pk-cravings-refine-chip${!activeRefinement ? " is-active" : ""}`}
                    aria-pressed={!activeRefinement}
                    onClick={() => setActiveRefinement("")}
                  >
                    All {pluralCategory(activeCategory).toLowerCase()}
                    <span className="pk-cravings-refine-count">{availableToRefine.length}</span>
                  </button>
                  {refinementOptions.map(({ label, count }) => (
                    <button
                      type="button"
                      key={label}
                      className={`pk-cravings-refine-chip${activeRefinement === label ? " is-active" : ""}`}
                      aria-pressed={activeRefinement === label}
                      onClick={() => {
                        setActiveRefinement(label);
                        scrollToResultsTop();
                      }}
                    >
                      {label} <span className="pk-cravings-refine-count">{count}</span>
                    </button>
                  ))}
                </div>
                <span className="pk-cravings-refine-hint">Only available dishes shown</span>
              </div>
            )}
            {postcodeError && <p className="pk-cravings-error" role="alert">{postcodeError}</p>}
          </section>
          {restaurantFilter && (
            <div className="pk-results-restaurant-context" role="group" aria-label="Restaurant filter">
              <span>Browsing one restaurant</span>
              <button type="button" onClick={() => setRestaurantFilter(null)} aria-label={`Remove ${restaurantFilter.item.restaurantName} filter`}>
                {restaurantFilter.item.restaurantName} <span aria-hidden="true">×</span>
              </button>
            </div>
          )}
          {!loading && <div className="pk-results-toolbar" aria-label="Sort and filter dishes">
            <span className="pk-results-sort-label">Sort by</span>
            <div className="pk-results-sort-options">
              {SORT_OPTIONS.map(([key, label]) => (
                <button type="button" key={key} className={`pk-results-filter${sortBy === key ? " is-active" : ""}`} aria-pressed={sortBy === key} onClick={() => setSortBy(key)}>{label}</button>
              ))}
            </div>
            <button type="button" className={`pk-results-filter pk-vegan-filter${veganOnly ? " is-active" : ""}`} aria-pressed={veganOnly} onClick={() => setVeganOnly((value) => !value)}>Vegan only</button>
          </div>}
          {!loading && <div className="pk-results-info">
            <p>{`${visibleItems.length} dish${visibleItems.length === 1 ? "" : "es"} from ${restaurantCount} restaurant${restaurantCount === 1 ? "" : "s"}`} {activePostcode && <span>· Near {activePostcode}</span>}</p>
            {visibleItems.length > 0 && <button className="pk-results-select-all" type="button" onClick={selectFirstThree}>Select up to 3</button>}
          </div>}
          {loading ? (
            <ResultsLoading dish={cleanedQuery} postcode={activePostcode} />
          ) : errorMessage ? (
            <div className="pk-results-empty" role="alert"><h2>Something went wrong</h2><p>{errorMessage}</p><button type="button" className="pk-results-empty-btn" onClick={onBackToSearch}>Try another search</button></div>
          ) : visibleItems.length === 0 ? (
            <div className="pk-results-empty">
              <h2>No dishes found</h2>
              <p>{veganOnly ? "No vegan options match this search. Try switching off the vegan filter." : activeRefinement ? `We couldn't find any ${activeRefinement.toLowerCase()} ${pluralCategory(activeCategory).toLowerCase()} in the available menu for this search.` : restaurantFilter ? `No other ${pluralCategory(restaurantFilter.category).toLowerCase()} are listed for ${restaurantFilter.item.restaurantName} in the available menu.` : "We couldn't find matching dishes nearby. Try another food category or search term above."}</p>
              <button type="button" className="pk-results-empty-btn" onClick={veganOnly ? () => setVeganOnly(false) : activeRefinement ? () => setActiveRefinement("") : restaurantFilter ? () => setRestaurantFilter(null) : () => { setSearchExpanded(true); window.requestAnimationFrame?.(() => searchInputRef.current?.focus()); }}>
                {veganOnly ? "Show all dishes" : activeRefinement ? `Show all ${pluralCategory(activeCategory).toLowerCase()}` : restaurantFilter ? "See all results" : "Try another search"}
              </button>
            </div>
          ) : (
            <ItemList items={visibleItems} selectedItems={selectedItems} onToggle={handleToggle} onViewDetails={setDetailItem} />
          )}
        </div>
      ) : (
        <div className="pk-results-legacy-comparison">
          <div className="pk-results-legacy-inner">
            <button type="button" className="pk-results-comparison-back" onClick={() => { setView("selection"); navigate("/"); }}>← Change my picks</button>
            <ComparisonTable items={selectedItems} onCustomiseDish={(item) => openCustomisation(item, "showdown")} />
          </div>
        </div>
      )}

      {detailItem && (
        <DishDetailsModal
          item={detailItem}
          similarItems={getSimilarDishRecommendations(detailItem, menuItems).items}
          similarSource={getSimilarDishRecommendations(detailItem, menuItems).source}
          onViewSimilar={setDetailItem}
          onBrowseSimilar={restaurantFilter ? () => {
            setDetailItem(null);
            setRestaurantFilter(null);
            setView("selection");
            window.scrollTo?.({ top: 0, behavior: "smooth" });
          } : undefined}
          onViewAllSimilar={restaurantFilter && Number(restaurantFilter.item.restaurantID) === Number(detailItem.restaurantID) && restaurantFilter.category === getDishCategory(detailItem)
            ? undefined : () => openRestaurantMenu(detailItem)}
          onCustomise={openCustomisation}
          onClose={() => setDetailItem(null)}
          onAddToBasket={(item) => {
            addToBasket(item.itemID);
            showBasketToast(item, 1, getItemComparablePrice(item));
          }}
          onToggleCompare={handleToggle}
          selected={selectedItems.some((item) => item.itemID === detailItem.itemID)}
          selectedCount={selectedItems.length}
          maxCompare={MAX_COMPARISON_ITEMS}
        />
      )}

      {customiseItem && (
        <DishCustomisationModal
          item={customiseItem}
          onClose={() => setCustomiseItem(null)}
          backLabel={customiseOrigin === "showdown" ? "Back to comparison" : "Back to dish details"}
          onBack={() => { if (customiseOrigin !== "showdown") setDetailItem(customiseItem); setCustomiseItem(null); }}
          onAddToBasket={saveCustomisation}
        />
      )}

      {hasTray && (
        <div className="pk-results-tray" role="region" aria-label="Selected dishes">
          {notice}
          <div className="pk-results-tray-left">
            <div className="pk-results-tray-avatars" aria-hidden="true">{selectedItems.map((item, index) => <span key={item.itemID} title={item.itemName} style={{ backgroundColor: ["#FF4B4B", "#7A4A8C", "#2F6B4F"][index] }}><FoodCardIllustration name={item.itemName} /></span>)}</div>
            <div className="pk-results-tray-copy"><strong>{selectedItems.length} of {MAX_COMPARISON_ITEMS} dishes selected</strong><small>{selectionHint(selectedItems.length)}</small></div>
          </div>
          <div className="pk-results-tray-actions">
            <button type="button" className="pk-results-tray-clear" onClick={() => { dismissNotice(); setSelectedItems([]); }}>Clear</button>
            <button type="button" className="pk-results-tray-basket" onClick={handleAddToBasket}>Add to basket</button>
            <button type="button" className="pk-results-tray-compare" disabled={selectedItems.length < 2} onClick={handleCompare}>Compare options</button>
          </div>
        </div>
      )}
      {!hasTray && notice && <div className="pk-results-floating-notice">{notice}</div>}
    </div>
  );
}

export default FoodComparisonPage;
