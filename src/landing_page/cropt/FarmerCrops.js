import React, { useState, useEffect } from "react";

function FarmerCrops() {
  const [crops, setCrops] = useState([]);
  const [formData, setFormData] = useState({
    cropName: "",
    quantity: "",
    price: "",
    image: null,
  });
  const [bidTimes, setBidTimes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const farmerId = localStorage.getItem("userId");

  // --- PREMIUM THEME COLORS ---
  const colors = {
    primary: "#4B6F44", // Forest Green
    gold: "#D4AF37", // Harvest Gold
    textDark: "#1E291B", // Deep Earth
    white: "#FFFFFF",
    bgLight: "#F4F7F2", // Soft Sage Background
    border: "#EAECE9",
  };

  const inputStyle = {
    borderRadius: "12px",
    padding: "14px 18px",
    border: `1px solid ${colors.border}`,
    fontSize: "1rem",
    backgroundColor: "#FFFFFF",
    color: colors.textDark,
    transition: "all 0.3s ease",
    outline: "none",
  };

  const cardStyle = {
    borderRadius: "24px",
    border: "none",
    backgroundColor: "#FFFFFF",
    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
  };

  // ======================
  // Fetch farmer crops (LOGIC UNTOUCHED)
  // ======================
  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/farmer/crops/${farmerId}`,
        );
        const data = await res.json();
        setCrops(data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch crops");
      } finally {
        setLoading(false);
      }
    };
    fetchCrops();
  }, [farmerId]);

  // ======================
  // Handle input change (LOGIC UNTOUCHED)
  // ======================
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ======================
  // Upload crop (LOGIC UNTOUCHED)
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("farmerId", farmerId);
    data.append("cropName", formData.cropName);
    data.append("quantity", formData.quantity);
    data.append("price", formData.price);
    data.append("image", formData.image);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/farmer/crops`,
        {
          method: "POST",
          body: data,
        },
      );
      const result = await res.json();
      if (res.ok) {
        setCrops((prev) => [result.crop, ...prev]);
        setFormData({ cropName: "", quantity: "", price: "", image: null });
        alert("Crop uploaded successfully");
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  const handleBidTimeChange = (cropId, field, value) => {
    setBidTimes((prev) => ({
      ...prev,
      [cropId]: { ...prev[cropId], [field]: value },
    }));
  };

  const submitBidTime = async (cropId) => {
    const times = bidTimes[cropId];
    if (!times?.startTime || !times?.endTime) {
      return alert("Select both start and end time");
    }

    // Use the Render URL from your .env file
    const API_URL = process.env.REACT_APP_API_URL || "https://agrosetu-backend.onrender.com";

    try {
      const res = await fetch(
        `${API_URL}/api/auction/${cropId}/set-bid-time`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            farmerId,
            startTime: times.startTime,
            endTime: times.endTime,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert(data.message); // Will show "Auction is now LIVE!" or "Auction Scheduled"
        setCrops((prev) =>
          prev.map((c) => (c._id === cropId ? { ...c, ...data.crop } : c)),
        );
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error updating auction time");
    }
  };

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: colors.bgLight,
        }}
      >
        <p style={{ color: colors.primary, fontWeight: "700" }}>
          🌾 Loading your harvest...
        </p>
      </div>
    );

  return (
    <div
      style={{
        backgroundColor: colors.bgLight,
        minHeight: "100vh",
        paddingBottom: "80px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="container pt-5">
        {/* UPLOAD SECTION */}
        <div
          className="card shadow-sm mb-5"
          style={{ ...cardStyle, padding: "45px" }}
        >
          <div className="mb-4 text-center">
            <h2
              style={{
                color: colors.textDark,
                fontWeight: "800",
                fontSize: "2.2rem",
              }}
            >
              List New Harvest
            </h2>
            <div
              style={{
                width: "60px",
                height: "4px",
                background: colors.gold,
                borderRadius: "2px",
                margin: "15px auto",
              }}
            ></div>
            <p style={{ color: "#666", fontSize: "1rem" }}>
              Register your crops for the upcoming digital auction.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-md-4">
                <label
                  style={{
                    fontWeight: "700",
                    marginBottom: "8px",
                    display: "block",
                    fontSize: "0.85rem",
                  }}
                >
                  CROP NAME
                </label>
                <input
                  className="form-control shadow-none"
                  style={inputStyle}
                  placeholder="e.g. Organic Wheat"
                  name="cropName"
                  value={formData.cropName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label
                  style={{
                    fontWeight: "700",
                    marginBottom: "8px",
                    display: "block",
                    fontSize: "0.85rem",
                  }}
                >
                  QUANTITY
                </label>
                <input
                  className="form-control shadow-none"
                  style={inputStyle}
                  placeholder="e.g. 500kg"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label
                  style={{
                    fontWeight: "700",
                    marginBottom: "8px",
                    display: "block",
                    fontSize: "0.85rem",
                  }}
                >
                  STARTING PRICE (₹)
                </label>
                <input
                  className="form-control shadow-none"
                  style={inputStyle}
                  placeholder="Base price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12">
                <label
                  style={{
                    fontWeight: "700",
                    marginBottom: "8px",
                    display: "block",
                    fontSize: "0.85rem",
                  }}
                >
                  CROP PHOTOGRAPH
                </label>
                <input
                  type="file"
                  name="image"
                  className="form-control shadow-none"
                  style={{ ...inputStyle, padding: "10px" }}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button
              className="btn w-100 mt-5"
              style={{
                background: colors.primary,
                color: "#fff",
                fontWeight: "700",
                padding: "16px",
                borderRadius: "14px",
                border: "none",
                boxShadow: "0 8px 20px rgba(75, 111, 68, 0.2)",
              }}
            >
              List Crop for Auction
            </button>
          </form>
        </div>

        {/* LISTING SECTION */}
        <div className="mb-4 d-flex align-items-center justify-content-between">
          <div>
            <h3 style={{ color: colors.textDark, fontWeight: "800" }}>
              Active Listings
            </h3>
            <p style={{ color: "#888", fontSize: "0.95rem" }}>
              Manage bidding windows for your uploaded crops.
            </p>
          </div>
        </div>

        <div className="row g-4">
          {crops.map((crop) => (
            <div key={crop._id} className="col-md-4">
              <div
                className="card h-100 border-0 shadow-sm"
                style={{ borderRadius: "24px", overflow: "hidden" }}
              >
                <div style={{ position: "relative" }}>
                  // Line 166 (Inside the crops.map)
                  <img
  src={
    crop.imageUrl && crop.imageUrl.startsWith("http")
      ? crop.imageUrl // ✅ Use Cloudinary URL directly
      : `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/${crop.imageUrl?.replace(/\\/g, "/")}` // Fallback for old local data
  }
  className="card-img-top"
  alt={crop.cropName}
  style={{ height: "200px", objectFit: "cover" }}
  onError={(e) => {
    // This handles cases where the link is broken
    e.target.src = "https://via.placeholder.com/300?text=Image+Not+Found";
  }}
/>
                  <span
                    style={{
                      position: "absolute",
                      top: "15px",
                      right: "15px",
                      backgroundColor:
                        crop.status === "open" ? "#E8F5E9" : "#FFF8E1",
                      color: crop.status === "open" ? "#2E7D32" : "#F57F17",
                      padding: "6px 14px",
                      borderRadius: "12px",
                      fontSize: "0.75rem",
                      fontWeight: "800",
                      textTransform: "uppercase",
                    }}
                  >
                    {crop.status || "Pending"}
                  </span>
                </div>

                <div className="card-body p-4">
                  <h5
                    style={{
                      fontWeight: "800",
                      color: colors.textDark,
                      marginBottom: "15px",
                    }}
                  >
                    {crop.cropName}
                  </h5>
                  <div className="d-flex justify-content-between mb-4">
                    <div style={{ fontSize: "0.9rem" }}>
                      <span style={{ color: "#888", display: "block" }}>
                        Quantity
                      </span>
                      <strong style={{ color: colors.textDark }}>
                        {crop.quantity}
                      </strong>
                    </div>
                    <div className="text-end" style={{ fontSize: "0.9rem" }}>
                      <span style={{ color: "#888", display: "block" }}>
                        Min. Bid
                      </span>
                      <strong style={{ color: colors.primary }}>
                        ₹{crop.price}
                      </strong>
                    </div>
                  </div>

                  <hr
                    style={{ borderColor: colors.border, margin: "20px 0" }}
                  />

                  <h6
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "800",
                      color: colors.gold,
                      textTransform: "uppercase",
                      marginBottom: "15px",
                      letterSpacing: "1px",
                    }}
                  >
                    Set Auction Window
                  </h6>
                  <div className="mb-4">
                    <div className="mb-3">
                      <label
                        style={{
                          fontSize: "0.7rem",
                          color: "#999",
                          fontWeight: "700",
                          marginBottom: "5px",
                          display: "block",
                        }}
                      >
                        START TIME
                      </label>
                      <input
                        type="datetime-local"
                        className="form-control form-control-sm shadow-none"
                        style={{ ...inputStyle, padding: "10px" }}
                        value={bidTimes[crop._id]?.startTime || ""}
                        onChange={(e) =>
                          handleBidTimeChange(
                            crop._id,
                            "startTime",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: "0.7rem",
                          color: "#999",
                          fontWeight: "700",
                          marginBottom: "5px",
                          display: "block",
                        }}
                      >
                        END TIME
                      </label>
                      <input
                        type="datetime-local"
                        className="form-control form-control-sm shadow-none"
                        style={{ ...inputStyle, padding: "10px" }}
                        value={bidTimes[crop._id]?.endTime || ""}
                        onChange={(e) =>
                          handleBidTimeChange(
                            crop._id,
                            "endTime",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>

                  <button
                    className="btn w-100"
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: `2px solid ${colors.primary}`,
                      color: colors.primary,
                      fontWeight: "700",
                      borderRadius: "12px",
                      padding: "12px",
                      transition: "0.3s",
                    }}
                    onClick={() => submitBidTime(crop._id)}
                  >
                    Update Schedule
                  </button>

                  {crop.bidStartTime && (
                    <div
                      className="mt-4 p-3 text-center"
                      style={{
                        backgroundColor: "rgba(75, 111, 68, 0.08)",
                        borderRadius: "12px",
                        fontSize: "0.8rem",
                        color: colors.primary,
                      }}
                    >
                      <strong>Active:</strong>{" "}
                      {new Date(crop.bidStartTime).toLocaleString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                        hour12: true,
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FarmerCrops;
