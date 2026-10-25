import { useState } from "react";
import ordersApi from "../services/ordersApi";

export default function AddVehicleModal({ isOpen, onClose, onVehicleAdded }) {
  const [vehicleType, setVehicleType] = useState("truck_14ft");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [capacityTonnes, setCapacityTonnes] = useState("3.5");
  const [vehiclePhoto, setVehiclePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [rcDocument, setRcDocument] = useState(null);
  const [insuranceDocument, setInsuranceDocument] = useState(null);
  const [fitnessDocument, setFitnessDocument] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen) return null;

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setVehiclePhoto(file);
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanReg = registrationNumber.trim().toUpperCase();
    if (!cleanReg) {
      setErrorMsg("Please enter the truck registration number (e.g. KL-07-CD-1234).");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("vehicle_type", vehicleType);
      formData.append("registration_number", cleanReg);
      formData.append("capacity_tonnes", capacityTonnes || "0.0");

      if (vehiclePhoto) {
        formData.append("vehicle_photo", vehiclePhoto);
      }
      if (rcDocument) {
        formData.append("rc_document", rcDocument);
      }
      if (insuranceDocument) {
        formData.append("insurance_document", insuranceDocument);
      }
      if (fitnessDocument) {
        formData.append("fitness_document", fitnessDocument);
      }

      const res = await ordersApi.registerVehicle(formData);
      setSuccessMsg(
        `Vehicle ${cleanReg} successfully submitted! Status is PENDING Admin verification. Admin will inspect the vehicle photo and documents before approving.`
      );
      if (onVehicleAdded) {
        onVehicleAdded(res);
      }
      setTimeout(() => {
        onClose();
      }, 2200);
    } catch (err) {
      console.error("Vehicle registration error:", err);
      const apiErrors = err?.response?.data;
      let msg = "Failed to register vehicle. Please check the inputs.";
      if (apiErrors && typeof apiErrors === "object") {
        msg = Object.entries(apiErrors)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(" ") : v}`)
          .join(" | ");
      } else if (err?.message) {
        msg = err.message;
      }
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "580px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid #e2e8f0",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                className="material-symbols-outlined"
                style={{ color: "#2563eb", fontSize: "24px" }}
              >
                local_shipping
              </span>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Register New Fleet Vehicle
              </h2>
            </div>
            <p
              style={{
                fontSize: "0.825rem",
                color: "#64748b",
                margin: "4px 0 0 0",
              }}
            >
              Add truck details, upload photos &amp; registration documents for Admin verification.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
              padding: "4px",
              borderRadius: "6px",
            }}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} style={{ padding: "1.5rem" }}>
          {errorMsg && (
            <div
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                backgroundColor: "#fee2e2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                fontSize: "0.85rem",
                marginBottom: "1rem",
              }}
            >
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                backgroundColor: "#ecfdf5",
                border: "1px solid #a7f3d0",
                color: "#059669",
                fontSize: "0.85rem",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                check_circle
              </span>
              <span>{successMsg}</span>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {/* Vehicle Type */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#334155" }}>
                Vehicle Type <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                style={{
                  padding: "0.6rem 0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.875rem",
                  backgroundColor: "#fff",
                }}
                required
              >
                <option value="truck_14ft">Truck (14 ft)</option>
                <option value="truck_17ft">Truck (17 ft)</option>
                <option value="truck_20ft">Truck (20 ft / 10-Tyre)</option>
                <option value="container">Container (32 ft MXL)</option>
                <option value="trailer">Trailer / Heavy Haul</option>
                <option value="mini_truck">Mini Truck / LCV</option>
                <option value="pickup">Pickup (1.5T)</option>
              </select>
            </div>

            {/* Capacity (Tonnes) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#334155" }}>
                Capacity (Tonnes) <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={capacityTonnes}
                onChange={(e) => setCapacityTonnes(e.target.value)}
                placeholder="e.g. 3.5"
                style={{
                  padding: "0.6rem 0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.875rem",
                }}
                required
              />
            </div>
          </div>

          {/* Registration Number */}
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#334155" }}>
              Truck Registration Number <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              placeholder="e.g. KL-07-CD-1234 or DL-01-AB-9876"
              style={{
                padding: "0.6rem 0.75rem",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "0.875rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 600,
              }}
              required
            />
          </div>

          {/* Vehicle / Truck Photo Upload */}
          <div style={{ marginTop: "1.25rem" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#334155", display: "block" }}>
              Truck / Vehicle Photo <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <p style={{ fontSize: "0.75rem", color: "#64748b", margin: "2px 0 8px 0" }}>
              Clear photo of the truck showing the license plate &amp; body condition.
            </p>
            <div
              style={{
                border: "2px dashed #cbd5e1",
                borderRadius: "10px",
                padding: "1rem",
                textAlign: "center",
                backgroundColor: "#f8fafc",
                cursor: "pointer",
              }}
              onClick={() => document.getElementById("vehicle-photo-input")?.click()}
            >
              {photoPreview ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <img
                    src={photoPreview}
                    alt="Vehicle Preview"
                    style={{ maxHeight: "120px", borderRadius: "8px", objectFit: "cover" }}
                  />
                  <span style={{ fontSize: "0.75rem", color: "#2563eb", fontWeight: 600 }}>
                    Click to change photo
                  </span>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "#94a3b8" }}>
                    add_a_photo
                  </span>
                  <span style={{ fontSize: "0.825rem", color: "#475569", fontWeight: 500 }}>
                    Upload Truck Photo (PNG, JPG, WEBP)
                  </span>
                  <span style={{ fontSize: "0.725rem", color: "#94a3b8" }}>Up to 10MB</span>
                </div>
              )}
              <input
                id="vehicle-photo-input"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handlePhotoChange}
              />
            </div>
          </div>

          {/* Documents Upload Section */}
          <div style={{ marginTop: "1.25rem" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#334155", display: "block" }}>
              Compliance &amp; Registration Documents
            </label>
            <p style={{ fontSize: "0.75rem", color: "#64748b", margin: "2px 0 8px 0" }}>
              Upload mandatory vehicle paperwork for Admin verification.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {/* RC Document */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.6rem 0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#ffffff",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#64748b" }}>
                    description
                  </span>
                  <div>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1e293b", display: "block" }}>
                      RC (Registration Certificate)
                    </span>
                    <span style={{ fontSize: "0.7rem", color: "#64748b" }}>
                      {rcDocument ? rcDocument.name : "Not selected (PDF or Image)"}
                    </span>
                  </div>
                </div>
                <label
                  style={{
                    fontSize: "0.75rem",
                    color: "#2563eb",
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    backgroundColor: "#eff6ff",
                  }}
                >
                  Choose File
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    style={{ display: "none" }}
                    onChange={(e) => setRcDocument(e.target.files?.[0] || null)}
                  />
                </label>
              </div>

              {/* Insurance Document */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.6rem 0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#ffffff",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#64748b" }}>
                    verified_user
                  </span>
                  <div>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1e293b", display: "block" }}>
                      Commercial Vehicle Insurance
                    </span>
                    <span style={{ fontSize: "0.7rem", color: "#64748b" }}>
                      {insuranceDocument ? insuranceDocument.name : "Not selected (PDF or Image)"}
                    </span>
                  </div>
                </div>
                <label
                  style={{
                    fontSize: "0.75rem",
                    color: "#2563eb",
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    backgroundColor: "#eff6ff",
                  }}
                >
                  Choose File
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    style={{ display: "none" }}
                    onChange={(e) => setInsuranceDocument(e.target.files?.[0] || null)}
                  />
                </label>
              </div>

              {/* Fitness / Permit */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.6rem 0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#ffffff",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#64748b" }}>
                    health_and_safety
                  </span>
                  <div>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1e293b", display: "block" }}>
                      Fitness / National Permit Document
                    </span>
                    <span style={{ fontSize: "0.7rem", color: "#64748b" }}>
                      {fitnessDocument ? fitnessDocument.name : "Not selected (PDF or Image)"}
                    </span>
                  </div>
                </div>
                <label
                  style={{
                    fontSize: "0.75rem",
                    color: "#2563eb",
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    backgroundColor: "#eff6ff",
                  }}
                >
                  Choose File
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    style={{ display: "none" }}
                    onChange={(e) => setFitnessDocument(e.target.files?.[0] || null)}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Info banner about Pending verification */}
          <div
            style={{
              marginTop: "1.25rem",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              backgroundColor: "#fef3c7",
              border: "1px solid #fde68a",
              color: "#92400e",
              fontSize: "0.785rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#d97706" }}>
              info
            </span>
            <span>
              <strong>Verification Workflow:</strong> Once uploaded, this vehicle will be placed in{" "}
              <strong>PENDING</strong> status. The HireD Admin team will inspect the vehicle photo,
              RC certificate, and insurance. Upon approval, its status changes to <strong>APPROVED</strong>,
              allowing you to assign it directly to transport orders.
            </span>
          </div>

          {/* Modal Actions */}
          <div
            style={{
              marginTop: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "12px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: "0.6rem 1.25rem",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#fff",
                color: "#475569",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "0.6rem 1.5rem",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#2563eb",
                color: "#fff",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin" style={{ fontSize: "16px" }}>
                    progress_activity
                  </span>
                  Uploading &amp; Submitting...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                    cloud_upload
                  </span>
                  Submit Vehicle for Approval
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
