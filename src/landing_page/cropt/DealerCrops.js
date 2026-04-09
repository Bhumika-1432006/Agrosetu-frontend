import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

function DealerCrops() {
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);
  const dealerId = localStorage.getItem("userId");

  // --- BRAND THEME COLORS ---
  const colors = {
    primary: "#4B6F44", // Forest Green
    gold: "#D4AF37", // Harvest Gold
    textDark: "#1E291B", // Deep Earth
    white: "#FFFFFF",
    bgLight: "#F2F5F0", // Soft Sage Background
    border: "#E2E8E1",
  };

  // Initialize Socket.IO connection (LOGIC UNTOUCHED)
  const socket = io(process.env.REACT_APP_API_URL);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/dealer/crops`,
        );
        if (!res.ok) throw new Error("Failed to fetch crops");
        const data = await res.json();
        setCrops(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCrops();

    return () => socket.disconnect();
  }, []);

  // Add crop to cart (LOGIC UNTOUCHED)
  const addToCart = (crop) => {
    const key = `dealerCart_${dealerId}`;
    const existingCart = JSON.parse(localStorage.getItem(key)) || [];

    const alreadyAdded = existingCart.find((c) => c._id === crop._id);
    if (alreadyAdded) {
      alert("Already added to cart");
      return;
    }

    const updatedCart = [...existingCart, crop];
    localStorage.setItem(key, JSON.stringify(updatedCart));
    alert("Added to cart");
  };

  // Start chat with farmer (LOGIC UNTOUCHED)
  const startChat = async (crop) => {
    try {
      const farmerId = crop.farmerId._id || crop.farmerId;

      const res = await fetch("http://localhost:5000/api/chat/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealerId,
          farmerId,
          cropId: crop._id,
        }),
      });

      if (!res.ok) throw new Error("Failed to start chat");

      const chat = await res.json();
      navigate("/chat", { state: { chatId: chat._id } });
    } catch (err) {
      console.error(err);
      alert("Failed to start chat");
    }
  };

  return (
    <div
      style={{
        backgroundColor: colors.bgLight,
        minHeight: "100vh",
        padding: "40px 20px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="container">
        {/* HEADER SECTION */}
        <div style={{ marginBottom: "50px", textAlign: "center" }}>
          <h2
            style={{
              color: colors.textDark,
              fontWeight: "800",
              fontSize: "2.8rem",
              marginBottom: "10px",
            }}
          >
            Available Harvests
          </h2>
          <div
            style={{
              width: "80px",
              height: "5px",
              background: colors.gold,
              borderRadius: "10px",
              margin: "0 auto 20px",
            }}
          ></div>
          <p
            style={{
              color: "#555",
              fontSize: "1.2rem",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Secure the best yields by negotiating directly with our verified
            network of local farmers.
          </p>
        </div>

        {/* GRID SECTION */}
        <div className="row g-4">
          {crops.map((crop) => (
            <div key={crop._id} className="col-lg-4 col-md-6">
              <div
                className="card h-100 border-0 shadow-sm"
                style={{
                  borderRadius: "32px",
                  overflow: "hidden",
                  backgroundColor: colors.white,
                  transition: "all 0.3s ease-in-out",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.05)",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "translateY(-10px)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                {/* CROP IMAGE */}
                <div style={{ position: "relative", overflow: "hidden" }}>
                  {crop.imageUrl ? (
                    // Line 104 (Inside the crops.map)
                    <img
      src={
        crop.imageUrl.startsWith("http") 
          ? crop.imageUrl 
          : `${process.env.REACT_APP_API_URL}${crop.imageUrl.startsWith("/") ? "" : "/"}${crop.imageUrl}`
      }
      alt={crop.cropName}
      style={{
        height: "300px",
        width: "100%",
        objectFit: "cover",
      }}
      // Fallback if the server is up but the specific image file is missing
      onError={(e) => {
        e.target.onerror = null; 
        e.target.src = "https://via.placeholder.com/300?text=Image+Not+Found";
      }}
    />
                  ) : (
                    <div
                      style={{
                        height: "300px",
                        background: "#f8f9fa",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ fontSize: "4rem" }}>🌾</span>
                    </div>
                  )}
                  {/* PRICE BADGE */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "20px",
                      left: "20px",
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      color: colors.primary,
                      padding: "10px 20px",
                      borderRadius: "18px",
                      fontWeight: "900",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                      fontSize: "1.2rem",
                      backdropFilter: "blur(5px)",
                    }}
                  >
                    ₹{crop.price}{" "}
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "#666",
                        fontWeight: "500",
                      }}
                    >
                      / quintal
                    </span>
                  </div>
                </div>

                <div className="card-body p-4">
                  <div className="mb-3 d-flex justify-content-between align-items-center">
                    <div>
                      <h4
                        style={{
                          fontWeight: "800",
                          color: colors.textDark,
                          marginBottom: "2px",
                          fontSize: "1.4rem",
                        }}
                      >
                        {crop.cropName}
                      </h4>
                      <div
                        style={{
                          color: colors.primary,
                          fontWeight: "700",
                          fontSize: "0.9rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: "#2ecc71",
                          }}
                        ></span>
                        Ready for Pickup
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: colors.bgLight,
                      padding: "12px 18px",
                      borderRadius: "16px",
                      marginBottom: "20px",
                    }}
                  >
                    <span
                      style={{
                        color: "#666",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                      }}
                    >
                      Available Stock:{" "}
                    </span>
                    <span
                      style={{
                        color: colors.textDark,
                        fontWeight: "800",
                        fontSize: "1rem",
                      }}
                    >
                      {crop.quantity} kg
                    </span>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <button
                      className="btn shadow-none"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.white,
                        fontWeight: "700",
                        padding: "16px",
                        borderRadius: "18px",
                        border: "none",
                        fontSize: "1.05rem",
                        transition: "0.3s",
                        boxShadow: "0 10px 20px rgba(75, 111, 68, 0.2)",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.filter = "brightness(1.1)")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.filter = "brightness(1)")
                      }
                      onClick={() => startChat(crop)}
                    >
                      💬 Negotiate with Farmer
                    </button>

                    <button
                      className="btn shadow-none"
                      style={{
                        backgroundColor: "transparent",
                        color: colors.textDark,
                        fontWeight: "700",
                        padding: "16px",
                        borderRadius: "18px",
                        border: `2px solid ${colors.border}`,
                        fontSize: "1.05rem",
                        transition: "0.3s",
                      }}
                      onMouseOver={(e) => {
                        e.target.style.borderColor = colors.gold;
                        e.target.style.color = colors.gold;
                      }}
                      onMouseOut={(e) => {
                        e.target.style.borderColor = colors.border;
                        e.target.style.color = colors.textDark;
                      }}
                      onClick={() => addToCart(crop)}
                    >
                      🛒 Add to Purchase Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DealerCrops;
