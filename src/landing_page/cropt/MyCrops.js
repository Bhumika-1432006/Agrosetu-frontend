import React, { useEffect, useState } from "react";

function MyCrops() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const farmerId = localStorage.getItem("userId"); // logged-in farmer

  // --- THEME COLORS ---
  const colors = {
    primary: "#7A9461",   // Soft Sage Green
    gold: "#D4AF37",      
    textDark: "#4A4A4A",
    bgLight: "#F9FAF8",
    white: "#FFFFFF",
    border: "#E2E8E1"
  };

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/farmer/crops/${farmerId}`);
        if (!res.ok) throw new Error("Failed to fetch your crops");
        const data = await res.json();
        setCrops(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCrops();
  }, [farmerId]);

  if (loading) return (
    <div className="text-center mt-5" style={{ color: colors.primary }}>
      <div className="spinner-border" role="status"></div>
      <p className="mt-2">Loading your crops...</p>
    </div>
  );

  if (error) return (
    <div className="container mt-5 text-center">
      <p className="text-danger" style={{ fontWeight: "600" }}>{error}</p>
    </div>
  );

  return (
    <div style={{ backgroundColor: colors.bgLight, minHeight: "100vh", padding: "40px 20px" }}>
      <div className="container">
        {/* HEADER SECTION */}
        <div className="mb-5">
          <h2 style={{ color: colors.textDark, fontWeight: "800", marginBottom: "10px" }}>
            My Uploaded Crops
          </h2>
          <div style={{ width: "60px", height: "4px", background: colors.gold, borderRadius: "2px" }}></div>
        </div>

        {crops.length === 0 ? (
          <div className="text-center p-5" style={{ backgroundColor: colors.white, borderRadius: "20px", border: `1px solid ${colors.border}` }}>
            <span style={{ fontSize: "3rem" }}>🚜</span>
            <p className="mt-3" style={{ color: "#888" }}>You haven't uploaded any crops yet.</p>
          </div>
        ) : (
          <div className="row">
            {crops.map((crop) => (
              <div key={crop._id} className="col-lg-4 col-md-6 mb-4">
                <div className="card h-100" style={{
                  borderRadius: "20px",
                  border: "none",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                  overflow: "hidden",
                  backgroundColor: colors.white
                }}>
                  {crop.imageUrl && (
                    <img
                      src={`http://localhost:5000${crop.imageUrl}`}
                      alt={crop.cropName}
                      style={{ height: "220px", objectFit: "cover" }}
                    />
                  )}
                  
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 style={{ color: colors.textDark, fontWeight: "700", margin: 0 }}>
                        {crop.cropName}
                      </h5>
                      <span style={{ 
                        backgroundColor: "#F0F4ED", 
                        color: colors.primary, 
                        fontSize: "0.75rem", 
                        padding: "4px 12px", 
                        borderRadius: "20px",
                        fontWeight: "700" 
                      }}>
                        {crop.cropType}
                      </span>
                    </div>

                    <div className="mt-3">
                      <div className="d-flex align-items-center mb-2" style={{ fontSize: "0.9rem", color: "#666" }}>
                        <span className="me-2">📦</span> <strong>Quantity:</strong> &nbsp; {crop.quantity}
                      </div>
                      <div className="d-flex align-items-center mb-2" style={{ fontSize: "0.9rem", color: "#666" }}>
                        <span className="me-2">💰</span> <strong>Price:</strong> &nbsp; <span style={{ color: colors.primary, fontWeight: "700" }}>{crop.price}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2" style={{ fontSize: "0.9rem", color: "#666" }}>
                        <span className="me-2">📍</span> <strong>Location:</strong> &nbsp; {crop.location}
                      </div>
                      <hr style={{ borderTop: `1px solid ${colors.border}`, margin: "15px 0" }} />
                      <div className="d-flex justify-content-between" style={{ fontSize: "0.8rem", color: "#999" }}>
                        <span>Farm Size: {crop.farmSize}</span>
                        <span>ID: {crop._id.substring(0,6)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyCrops;