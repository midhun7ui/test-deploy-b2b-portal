import { useEffect, useRef, useState } from "react";
import {
  autocompletePlaces,
  getPlaceDetails,
} from "../../../lib/awsLocationService";

/**
 * Intelligent location input with live AWS Location Service Places Autocomplete.
 */
export default function LocationAutocompleteInput({
  label,
  name,
  value = "",
  onChange,
  onSelectPlace, // ({ city, address, coords, placeId }) => void
  placeholder = "Search location or address...",
  error,
  required = false,
  full = false,
  biasCoords = null,
  type = "pickup", // 'pickup' | 'delivery'
}) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Sync external value
  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange?.({ target: { name, value: val } });

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (val.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const results = await autocompletePlaces(val, biasCoords);
        setSuggestions(results);
        setIsOpen(results.length > 0);
        setActiveIndex(-1);
      } catch (err) {
        console.error("Autocomplete error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 280);
  };

  const handleSelect = async (suggestion) => {
    setIsLoading(true);
    setIsOpen(false);
    try {
      const details = await getPlaceDetails(suggestion.placeId);
      if (details) {
        const resolvedCity = details.city || suggestion.title.split(",")?.[0]?.trim();
        const resolvedAddress = details.formattedAddress || suggestion.label;

        setQuery(resolvedCity);
        onChange?.({ target: { name, value: resolvedCity } });

        onSelectPlace?.({
          placeId: details.placeId,
          city: resolvedCity,
          address: resolvedAddress,
          coords: details.position, // [lng, lat]
          type,
        });
      }
    } catch (err) {
      console.error("Failed to fetch place details:", err);
      // Fallback with suggestion title
      const city = suggestion.title.split(",")?.[0]?.trim() || suggestion.title;
      setQuery(city);
      onChange?.({ target: { name, value: city } });
      onSelectPlace?.({
        placeId: suggestion.placeId,
        city,
        address: suggestion.label,
        coords: null,
        type,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const targetIdx = activeIndex >= 0 ? activeIndex : 0;
      if (suggestions[targetIdx]) {
        handleSelect(suggestions[targetIdx]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const isPickup = type === "pickup";

  return (
    <div
      ref={wrapperRef}
      className={`create-order-field ${
        full ? "create-order-field-full" : ""
      } location-autocomplete-field`}
    >
      <span>
        {label}
        {required && <em> *</em>}
      </span>

      <div className="autocomplete-input-box">
        <span className={`location-input-icon ${isPickup ? "icon-pickup" : "icon-delivery"}`}>
          {isPickup ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="7" fill="currentColor" fillOpacity="0.2"/>
              <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/>
              <circle cx="12" cy="10" r="3" fill="white"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          )}
        </span>

        <input
          id={name}
          name={name}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className={error ? "input-error" : ""}
          autoComplete="off"
        />

        {isLoading ? (
          <span className="autocomplete-spinner" />
        ) : query ? (
          <button
            type="button"
            className="autocomplete-clear-btn"
            onClick={() => {
              setQuery("");
              onChange?.({ target: { name, value: "" } });
              setSuggestions([]);
              setIsOpen(false);
            }}
          >
            ×
          </button>
        ) : null}
      </div>

      {error && (
        <small className="create-order-field-error">
          {error}
        </small>
      )}

      {/* Dropdown Suggestions */}
      {isOpen && suggestions.length > 0 && (
        <ul className="autocomplete-dropdown">
          <li className="autocomplete-header">
            <span>SUGGESTED PLACES (AWS LOCATION)</span>
          </li>
          {suggestions.map((item, idx) => (
            <li
              key={item.placeId || idx}
              className={`autocomplete-item ${idx === activeIndex ? "active" : ""}`}
              onClick={() => handleSelect(item)}
            >
              <div className="item-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div className="item-content">
                <strong className="item-title">{item.title}</strong>
                <span className="item-label">{item.label}</span>
              </div>
              <span className="item-type-badge">{item.placeType}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
