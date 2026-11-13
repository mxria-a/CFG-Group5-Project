import { useContext, useEffect, useMemo, useState } from "react";
import ItemList from "../Components/ItemList";
import FoodCardIllustration from "../Components/FoodCardIllustration";
import DishDetailsModal from "../Components/DishDetailsModal";
import DishCustomisationModal from "../Components/DishCustomisationModal";
import { findSimilarDishes } from "../utils/menuDiscovery";
import ResultsLoading from "../Components/ResultsLoading";
import ComparisonTable from "../Components/ComparisonTable";
import { StoreContext } from "../Context/shop-context";
import { fetchCoords } from "../utils/fetchCoords";
import { getDistance } from "../utils/distanceCalculator";
import "./FoodComparisonPage.css";

const API = "https://cfg-group5-backend.onrender.com/comparison-table-items";
const MAX_DISTANCE_KM = 50;
const MAX_COMPARISON_ITEMS = 3;

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

function FoodComparisonPage({ searchQuery, postcode, onBackToSearch }) {
  const [allItems, setAllItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
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
  const { addToBasket, addDemoCustomLine } = useContext(StoreContext);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setErrorMessage("");
      setAllItems([]);
      setMenuItems([]);
      setSelectedItems([]);
      setDetailItem(null);
      setView("selection");
      try {
        const res = await fetch(API);
        if (!res.ok) throw new Error("Unable to load dishes");
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Unexpected dishes response");
        const query = String(searchQuery || "").trim().toLowerCase();
        let nearby = data;
        if (postcode) {
          const coords = await fetchCoords(postcode);
          const lat = coords?.latitude;
          const lon = coords?.longitude;
          if (!isNumeric(lat) || !isNumeric(lon)) {
            if (active) setErrorMessage(`We couldn't find the postcode “${postcode}”. Please try another.`);
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
        const matches = query
          ? nearby.filter((item) =>
              String(item.itemName || "").toLowerCase().includes(query) ||
              String(item.restaurantName || "").toLowerCase().includes(query))
          : nearby;
        if (active) { setMenuItems(nearby); setAllItems(matches); }
      } catch (error) {
        console.error("Could not load search results:", error);
        if (active) setErrorMessage("We couldn't load dishes right now. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [searchQuery, postcode]);

  const visibleItems = useMemo(() => {
    const filtered = veganOnly ? allItems.filter((item) => isVegan(item.isVegan)) : allItems;
    const sorted = [...filtered];
    switch (sortBy) {
      case "cheapest": sorted.sort((a, b) => metric(a.price) - metric(b.price)); break;
      case "fastest": sorted.sort((a, b) => metric(a.deliveryTime) - metric(b.deliveryTime)); break;
      case "nearest": sorted.sort((a, b) => metric(a.distance) - metric(b.distance)); break;
      case "rated": sorted.sort((a, b) => (isNumeric(b.avRating) ? Number(b.avRating) : -Infinity) - (isNumeric(a.avRating) ? Number(a.avRating) : -Infinity)); break;
      default: break;
    }

    // All highlights are calculated from the actual loaded dishes, never hard-coded examples.
    const lowest = Math.min(...filtered.filter((item) => isNumeric(item.price)).map((item) => Number(item.price)));
    const fastest = Math.min(...filtered.filter((item) => isNumeric(item.deliveryTime)).map((item) => Number(item.deliveryTime)));
    const highest = Math.max(...filtered.filter((item) => isNumeric(item.avRating)).map((item) => Number(item.avRating)));
    return sorted.map((item) => {
      let highlight = null;
      if (isNumeric(item.price) && Number(item.price) === lowest) highlight = { kind: "cheapest", text: "Cheapest" };
      else if (isNumeric(item.deliveryTime) && Number(item.deliveryTime) === fastest) highlight = { kind: "fastest", text: "Fastest" };
      else if (isNumeric(item.avRating) && Number(item.avRating) === highest) highlight = { kind: "rated", text: "Top rated" };
      return { ...item, highlight };
    });
  }, [allItems, sortBy, veganOnly]);

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
    window.scrollTo?.({ top: 0, behavior: "smooth" });
  };
  const handleAddToBasket = () => {
    selectedItems.forEach((item) => addToBasket(item.itemID));
    notify(`${selectedItems.length} dish${selectedItems.length === 1 ? "" : "es"} added to your basket.`);
    setSelectedItems([]);
  };
  const openCustomisation = (item, origin = "details") => {
    setCustomiseOrigin(origin);
    setDetailItem(null);
    setCustomiseItem(item);
  };
  const saveCustomisation = (item, choices) => {
    if (!choices.removed.length && !choices.extras.length) {
      addToBasket(item.itemID, choices.quantity);
    } else {
      addDemoCustomLine(item, choices);
    }
    setCustomiseItem(null);
    notify(`Added ${choices.quantity} × ${item.itemName} to your basket${choices.removed.length || choices.extras.length ? " (demo customisations)" : ""}.`);
  };
  const selectFirstThree = () => { dismissNotice(); setSelectedItems(visibleItems.slice(0, MAX_COMPARISON_ITEMS)); };
  const restaurantCount = new Set(visibleItems.map((item) => item.restaurantName).filter(Boolean)).size;
  const DISPLAY_NAMES = { burger: "Burgers", pizza: "Pizzas", sushi: "Sushi", chicken: "Chicken", noodle: "Noodles", noodles: "Noodles", curry: "Curry", waffle: "Waffles", burrito: "Burritos" };
  const cleanedQuery = String(searchQuery || "").trim();
  const heading = cleanedQuery ? `${DISPLAY_NAMES[cleanedQuery.toLowerCase()] || titleCase(cleanedQuery)} near you` : "Food near you";
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
          <button type="button" className="pk-results-back" onClick={onBackToSearch}>← Back to search</button>
          <h1 className="pk-results-heading">{heading}</h1>
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
            <p>{`${visibleItems.length} dish${visibleItems.length === 1 ? "" : "es"} from ${restaurantCount} restaurant${restaurantCount === 1 ? "" : "s"}`} {postcode && <span>· Near {postcode.toUpperCase()}</span>}</p>
            {visibleItems.length > 0 && <button className="pk-results-select-all" type="button" onClick={selectFirstThree}>Select up to 3</button>}
          </div>}
          {loading ? (
            <ResultsLoading dish={cleanedQuery} postcode={postcode} />
          ) : errorMessage ? (
            <div className="pk-results-empty" role="alert"><h2>Something went wrong</h2><p>{errorMessage}</p><button type="button" className="pk-results-empty-btn" onClick={onBackToSearch}>Try another search</button></div>
          ) : visibleItems.length === 0 ? (
            <div className="pk-results-empty"><h2>No dishes found</h2><p>{veganOnly ? "No vegan options match this search. Try switching off the vegan filter." : "We couldn't find matching dishes nearby. Try a different dish or postcode."}</p><button type="button" className="pk-results-empty-btn" onClick={veganOnly ? () => setVeganOnly(false) : onBackToSearch}>{veganOnly ? "Show all dishes" : "Search again"}</button></div>
          ) : (
            <ItemList items={visibleItems} selectedItems={selectedItems} onToggle={handleToggle} onViewDetails={setDetailItem} />
          )}
        </div>
      ) : (
        <div className="pk-results-legacy-comparison">
          <div className="pk-results-legacy-inner">
            <button type="button" className="pk-results-comparison-back" onClick={() => setView("selection")}>← Change my picks</button>
            <ComparisonTable items={selectedItems} onCustomiseDish={(item) => openCustomisation(item, "showdown")} />
          </div>
        </div>
      )}

      {detailItem && (
        <DishDetailsModal
          item={detailItem}
          similarItems={findSimilarDishes(detailItem, menuItems)}
          onViewSimilar={setDetailItem}
          onBrowseSimilar={() => setDetailItem(null)}
          onCustomise={openCustomisation}
          onClose={() => setDetailItem(null)}
          onAddToBasket={(item) => addToBasket(item.itemID)}
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
