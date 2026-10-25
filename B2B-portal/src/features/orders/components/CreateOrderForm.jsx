import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ordersApi from "../services/ordersApi";
import AwsRouteMap from "./AwsRouteMap";
import LocationAutocompleteInput from "./LocationAutocompleteInput";
import AddVehicleModal from "./AddVehicleModal";
import {
  calculateRoute,
  geocodeText,
} from "../../../lib/awsLocationService";

const initialForm = {
  pickup_location: "",
  delivery_location: "",
  pickup_address: "",
  delivery_address: "",
  pickup_map_url: "",
  delivery_map_url: "",
  cargo_type: "",
  cargo_weight: "",
  vehicle_type: "",
  vehicle_id: null,
  package_count: "",
  pickup_date: "",
  delivery_date: "",
  notes: "",
};

function CreateOrderForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // AWS Location Service Map & Route state
  const [pickupCoords, setPickupCoords] = useState(null); // [lng, lat]
  const [deliveryCoords, setDeliveryCoords] = useState(null); // [lng, lat]
  const [routeGeometry, setRouteGeometry] = useState(null);
  const [routeStats, setRouteStats] = useState(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [activePinMode, setActivePinMode] = useState(null); // 'pickup' | 'delivery' | null

  // Company Registered Vehicles state & modal
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [companyVehicles, setCompanyVehicles] = useState([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);

  const fetchCompanyVehicles = useCallback(async () => {
    setIsLoadingVehicles(true);
    try {
      const data = await ordersApi.listCompanyVehicles("ALL");
      if (Array.isArray(data)) {
        setCompanyVehicles(data);
      }
    } catch (err) {
      console.warn("Could not load company vehicles:", err);
    } finally {
      setIsLoadingVehicles(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanyVehicles();
  }, [fetchCompanyVehicles]);

  const handleVehicleSelect = (e) => {
    const val = e.target.value;
    if (val.startsWith("veh_")) {
      const vId = Number(val.replace("veh_", ""));
      const found = companyVehicles.find((v) => v.id === vId);
      setForm((current) => ({
        ...current,
        vehicle_type: found ? found.vehicle_type : "truck_14ft",
        vehicle_id: vId,
        vehicle_notes: found
          ? `${found.registration_number} (${found.vehicle_type_display || found.vehicle_type})`
          : "",
      }));
    } else {
      setForm((current) => ({
        ...current,
        vehicle_type: val,
        vehicle_id: null,
        vehicle_notes: "",
      }));
    }

    setErrors((current) => ({
      ...current,
      vehicle_type: "",
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setSubmitted(false);
    setSubmitError(null);
  };

  // Calculate connected road route between pickup and delivery via AWS Location Service
  useEffect(() => {
    if (!pickupCoords || !deliveryCoords) {
      setRouteGeometry(null);
      setRouteStats(null);
      return;
    }

    let isMounted = true;
    async function fetchRoute() {
      setIsLoadingRoute(true);
      try {
        const routeData = await calculateRoute(pickupCoords, deliveryCoords);
        if (isMounted && routeData) {
          setRouteGeometry(routeData.geometry);
          setRouteStats({
            distanceKm: routeData.distanceKm,
            durationFormatted: routeData.durationFormatted,
            majorRoads: routeData.majorRoads,
          });
        }
      } catch (err) {
        console.error("AWS Route calculation error:", err);
      } finally {
        if (isMounted) {
          setIsLoadingRoute(false);
        }
      }
    }

    fetchRoute();

    return () => {
      isMounted = false;
    };
  }, [pickupCoords, deliveryCoords]);

  // Handle place selection from autocomplete for Pickup
  const handleSelectPickupPlace = ({ city, address, coords }) => {
    setForm((current) => ({
      ...current,
      pickup_location: city || current.pickup_location,
      pickup_address: address || current.pickup_address,
      pickup_latitude: coords ? coords[1] : current.pickup_latitude,
      pickup_longitude: coords ? coords[0] : current.pickup_longitude,
      pickup_map_url: coords
        ? `https://maps.google.com/?q=${coords[1]},${coords[0]}`
        : current.pickup_map_url,
    }));

    setErrors((current) => ({
      ...current,
      pickup_location: "",
      pickup_address: "",
    }));

    if (coords) {
      setPickupCoords(coords);
    }
  };

  // Handle place selection from autocomplete for Delivery
  const handleSelectDeliveryPlace = ({ city, address, coords }) => {
    setForm((current) => ({
      ...current,
      delivery_location: city || current.delivery_location,
      delivery_address: address || current.delivery_address,
      drop_latitude: coords ? coords[1] : current.drop_latitude,
      drop_longitude: coords ? coords[0] : current.drop_longitude,
      delivery_map_url: coords
        ? `https://maps.google.com/?q=${coords[1]},${coords[0]}`
        : current.delivery_map_url,
    }));

    setErrors((current) => ({
      ...current,
      delivery_location: "",
      delivery_address: "",
    }));

    if (coords) {
      setDeliveryCoords(coords);
    }
  };

  // Handle map click when user activates pin placement mode
  const handleMapPinLocation = ({ type, coords, city, address }) => {
    const lat = coords[1];
    const lng = coords[0];
    const mapUrl = `https://maps.google.com/?q=${lat},${lng}`;
    const locationName = city || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

    if (type === "pickup") {
      setPickupCoords(coords);
      setForm((current) => ({
        ...current,
        pickup_location: locationName,
        pickup_address: address || current.pickup_address || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        pickup_latitude: lat,
        pickup_longitude: lng,
        pickup_map_url: mapUrl,
      }));
      setErrors((current) => ({
        ...current,
        pickup_location: "",
        pickup_address: "",
      }));
    } else if (type === "delivery") {
      setDeliveryCoords(coords);
      setForm((current) => ({
        ...current,
        delivery_location: locationName,
        delivery_address: address || current.delivery_address || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        drop_latitude: lat,
        drop_longitude: lng,
        delivery_map_url: mapUrl,
      }));
      setErrors((current) => ({
        ...current,
        delivery_location: "",
        delivery_address: "",
      }));
    }

    setActivePinMode(null);
  };

  const validateForm = () => {
    const nextErrors = {};

    const requiredFields = [
      ["pickup_location", "Pickup location is required."],
      ["delivery_location", "Delivery location is required."],
      ["pickup_address", "Pickup address is required."],
      ["delivery_address", "Delivery address is required."],
      ["cargo_type", "Cargo type is required."],
      ["vehicle_type", "Vehicle type is required."],
      ["pickup_date", "Pickup date is required."],
      ["delivery_date", "Delivery date is required."],
    ];

    requiredFields.forEach(([field, message]) => {
      if (!form[field].trim()) {
        nextErrors[field] = message;
      }
    });

    if (
      form.cargo_weight &&
      Number(form.cargo_weight) <= 0
    ) {
      nextErrors.cargo_weight =
        "Cargo weight must be greater than 0.";
    }

    if (
      form.package_count &&
      Number(form.package_count) <= 0
    ) {
      nextErrors.package_count =
        "Package count must be greater than 0.";
    }

    if (
      form.pickup_date &&
      form.delivery_date &&
      form.delivery_date < form.pickup_date
    ) {
      nextErrors.delivery_date =
        "Delivery date cannot be before pickup date.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      setSubmitted(false);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const created = await ordersApi.createOrder(form);
      setSubmitted(true);
      setTimeout(() => {
        const targetId = created.id || created.order_number;
        navigate(targetId ? `/orders/${targetId}` : "/orders");
      }, 1200);
    } catch (err) {
      const apiErrors = err?.response?.data;
      let errorMsg = "Failed to submit order. Please check the form and try again.";
      if (apiErrors && typeof apiErrors === "object") {
        errorMsg = Object.entries(apiErrors)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(" ") : v}`)
          .join(" | ");
      } else if (err?.message) {
        errorMsg = err.message;
      }
      setSubmitError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/orders");
  };

  return (
    <form
      className="create-order-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <section className="create-order-section">
        <div className="create-order-section-header">
          <div>
            <span className="create-order-section-number">
              01
            </span>

            <div>
              <h2>Route Details</h2>
              <p>
                Where should the shipment be picked up and delivered? Search locations with AWS Places or pin them directly on the map.
              </p>
            </div>
          </div>
        </div>

        <div className="create-order-grid">
          <LocationAutocompleteInput
            label="Pickup Location"
            name="pickup_location"
            value={form.pickup_location}
            onChange={handleChange}
            onSelectPlace={handleSelectPickupPlace}
            placeholder="Search pickup city, hub or landmark"
            error={errors.pickup_location}
            type="pickup"
            required
          />

          <LocationAutocompleteInput
            label="Delivery Location"
            name="delivery_location"
            value={form.delivery_location}
            onChange={handleChange}
            onSelectPlace={handleSelectDeliveryPlace}
            placeholder="Search delivery city, hub or landmark"
            error={errors.delivery_location}
            type="delivery"
            required
          />

          <FormField
            label="Pickup Address"
            name="pickup_address"
            value={form.pickup_address}
            onChange={handleChange}
            placeholder="Enter complete pickup warehouse / factory address"
            error={errors.pickup_address}
            full
            required
          />

          <FormField
            label="Delivery Address"
            name="delivery_address"
            value={form.delivery_address}
            onChange={handleChange}
            placeholder="Enter complete delivery destination address"
            error={errors.delivery_address}
            full
            required
          />

          <FormField
            label="Pickup Google Maps Link"
            name="pickup_map_url"
            value={form.pickup_map_url}
            onChange={handleChange}
            placeholder="https://maps.app.goo.gl/... (auto-filled on pin/select)"
            error={errors.pickup_map_url}
          />

          <FormField
            label="Delivery Google Maps Link"
            name="delivery_map_url"
            value={form.delivery_map_url}
            onChange={handleChange}
            placeholder="https://maps.app.goo.gl/... (auto-filled on pin/select)"
            error={errors.delivery_map_url}
          />
        </div>

        {/* Embedded AWS Location Service Route Map */}
        <div className="create-order-map-block">
          <div className="create-order-map-header">
            <div>
              <span className="map-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
                </svg>
                AMAZON LOCATION SERVICE
              </span>
              <h3>Interactive Route & Transit Map</h3>
              <p>
                Real-time road connection between pickup (A) and delivery (B) with recommended <strong>Hybrid Satellite</strong> view, street overlays, and live transit estimates.
              </p>
            </div>
          </div>

          <AwsRouteMap
            pickupCoords={pickupCoords}
            deliveryCoords={deliveryCoords}
            pickupLabel={form.pickup_location || "Pickup"}
            deliveryLabel={form.delivery_location || "Delivery"}
            routeGeometry={routeGeometry}
            routeStats={routeStats}
            isLoadingRoute={isLoadingRoute}
            onMapClickLocation={handleMapPinLocation}
            activePinMode={activePinMode}
            setActivePinMode={setActivePinMode}
            height="400px"
          />
        </div>
      </section>

      <section className="create-order-section">
        <div className="create-order-section-header">
          <div>
            <span className="create-order-section-number">
              02
            </span>

            <div>
              <h2>Cargo Details</h2>
              <p>
                Provide information about the shipment.
              </p>
            </div>
          </div>
        </div>

        <div className="create-order-grid">
          <SelectField
            label="Cargo Type"
            name="cargo_type"
            value={form.cargo_type}
            onChange={handleChange}
            error={errors.cargo_type}
            options={[
              ["electronics", "Electronics"],
              ["fmcg", "FMCG"],
              ["industrial", "Industrial"],
              ["textiles", "Textiles"],
              ["machinery", "Machinery"],
              ["consumer_goods", "Consumer Goods"],
              ["furniture", "Furniture"],
              ["other", "Other"],
            ]}
            required
          />

          <NumberField
            label="Cargo Weight"
            name="cargo_weight"
            value={form.cargo_weight}
            onChange={handleChange}
            placeholder="0"
            suffix="kg"
            error={errors.cargo_weight}
          />

          <div className="create-order-field">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
              <span>
                Vehicle Details <em> *</em>
              </span>
              <button
                type="button"
                onClick={() => setIsVehicleModalOpen(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2563eb",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  backgroundColor: "#eff6ff",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>
                  add_circle
                </span>
                + Add Another Vehicle (Upload Docs &amp; Photo)
              </button>
            </div>

            <select
              name="vehicle_type"
              value={form.vehicle_id ? `veh_${form.vehicle_id}` : form.vehicle_type}
              onChange={handleVehicleSelect}
              required
            >
              <option value="" disabled>
                Select vehicle type or approved truck
              </option>

              <optgroup label="Standard Vehicle Presets">
                <option value="truck_14ft">Truck (14 ft)</option>
                <option value="truck_17ft">Truck (17 ft)</option>
                <option value="container">Container (32 ft)</option>
              </optgroup>

              {companyVehicles.filter((v) => v.status === "APPROVED").length > 0 && (
                <optgroup label="Approved Company Fleet">
                  {companyVehicles
                    .filter((v) => v.status === "APPROVED")
                    .map((v) => (
                      <option key={v.id} value={`veh_${v.id}`}>
                        ✓ {v.registration_number} — {v.vehicle_type} ({v.capacity_tonnes}T)
                      </option>
                    ))}
                </optgroup>
              )}
            </select>

            {errors.vehicle_type && (
              <small className="create-order-field-error">{errors.vehicle_type}</small>
            )}

            {companyVehicles.filter((v) => v.status === "PENDING").length > 0 && (
              <div
                style={{
                  marginTop: "6px",
                  padding: "6px 8px",
                  borderRadius: "6px",
                  backgroundColor: "#fffbeb",
                  border: "1px solid #fef3c7",
                  fontSize: "0.75rem",
                  color: "#b45309",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                  pending_actions
                </span>
                <span>
                  {companyVehicles.filter((v) => v.status === "PENDING").length} vehicle(s) currently <strong>PENDING</strong> Admin review:{" "}
                  {companyVehicles
                    .filter((v) => v.status === "PENDING")
                    .map((p) => p.registration_number)
                    .join(", ")}. Status goes to APPROVED once verified.
                </span>
              </div>
            )}
          </div>

          <NumberField
            label="Package Count"
            name="package_count"
            value={form.package_count}
            onChange={handleChange}
            placeholder="Enter quantity"
            error={errors.package_count}
          />
        </div>
      </section>

      <section className="create-order-section">
        <div className="create-order-section-header">
          <div>
            <span className="create-order-section-number">
              03
            </span>

            <div>
              <h2>Schedule</h2>
              <p>
                When should the shipment be picked up and
                delivered?
              </p>
            </div>
          </div>
        </div>

        <div className="create-order-grid">
          <FormField
            label="Pickup Date"
            name="pickup_date"
            type="date"
            value={form.pickup_date}
            onChange={handleChange}
            error={errors.pickup_date}
            required
          />

          <FormField
            label="Expected Delivery Date"
            name="delivery_date"
            type="date"
            value={form.delivery_date}
            onChange={handleChange}
            error={errors.delivery_date}
            required
          />
        </div>
      </section>

      <section className="create-order-section">
        <div className="create-order-section-header">
          <div>
            <span className="create-order-section-number">
              04
            </span>

            <div>
              <h2>Additional Information</h2>
              <p>
                Add any instructions relevant to this order.
              </p>
            </div>
          </div>
        </div>

        <div className="create-order-grid">
          <label className="create-order-field create-order-field-full">
            <span>Special Instructions</span>

            <textarea
              name="notes"
              rows="4"
              value={form.notes}
              onChange={handleChange}
              placeholder="Add loading instructions, handling requirements or other notes..."
            />
          </label>
        </div>
      </section>

      {submitError && (
        <div
          role="alert"
          style={{
            margin: "1.5rem 0 0 0",
            padding: "1rem 1.25rem",
            borderRadius: "0.5rem",
            backgroundColor: "rgba(239, 68, 68, 0.12)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#f87171",
            fontSize: "0.875rem",
          }}
        >
          <strong>Submission Error: </strong>
          <span>{submitError}</span>
        </div>
      )}

      {submitted && (
        <div className="create-order-success">
          <strong>Order submitted successfully!</strong>
          <span>
            Your order has been recorded with status Pending. Redirecting to order details...
          </span>
        </div>
      )}

      <div className="create-order-actions">
        <button
          type="button"
          className="create-order-cancel"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="create-order-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting Order..." : "Submit Order"}
        </button>
      </div>

      <AddVehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        onVehicleAdded={fetchCompanyVehicles}
      />
    </form>
  );
}

function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  full = false,
  required = false,
}) {
  return (
    <label
      className={`create-order-field ${
        full ? "create-order-field-full" : ""
      }`}
    >
      <span>
        {label}
        {required && <em> *</em>}
      </span>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />

      {error && (
        <small className="create-order-field-error">
          {error}
        </small>
      )}
    </label>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
}) {
  return (
    <label className="create-order-field">
      <span>
        {label}
        {required && <em> *</em>}
      </span>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="" disabled>
          Select {label.toLowerCase()}
        </option>

        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>

      {error && (
        <small className="create-order-field-error">
          {error}
        </small>
      )}
    </label>
  );
}

function NumberField({
  label,
  name,
  value,
  onChange,
  placeholder,
  suffix,
  error,
}) {
  return (
    <label className="create-order-field">
      <span>{label}</span>

      <div className="create-order-input-with-unit">
        <input
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          min="0"
          placeholder={placeholder}
        />

        {suffix && <span>{suffix}</span>}
      </div>

      {error && (
        <small className="create-order-field-error">
          {error}
        </small>
      )}
    </label>
  );
}

export default CreateOrderForm;