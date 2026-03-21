import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FarmerAuctionDashboard() {
  const navigate = useNavigate();
  const farmerId = localStorage.getItem("userId");
  const [myCrops, setMyCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- PREMIUM THEME COLORS (Matching your FarmerCrops style) ---
  const colors = {
    primary: "#4B6F44",   // Forest Green
    textDark: "#1E291B",  // Deep Earth
    bgLight: "#F4F7F2",   // Soft Sage
  };

  useEffect(() => {
    const fetchMyCrops = async () => {
      try {
        // ✅ EXACT URL MATCH from your FarmerCrops logic
        const res = await fetch(`http://localhost:5000/api/farmer/crops/${farmerId}`);
        const data = await res.json();
        
        // Your API returns the array directly
        setMyCrops(data || []);
        setLoading(false);
      } catch (err) {
        console.error("Dashboard error:", err);
        setLoading(false);
      }
    };

    if (farmerId) {
      fetchMyCrops();
    }
  }, [farmerId]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: colors.bgLight }}>
      <p style={{ color: colors.primary, fontWeight: "700" }}>🌾 Syncing your live auctions...</p>
    </div>
  );

  return (
    <div style={{ backgroundColor: colors.bgLight, minHeight: "100vh", paddingBottom: "80px", fontFamily: "'Inter', sans-serif" }}>
      <div className="container pt-5">
        
        <div className="mb-5 border-start border-success border-5 ps-4">
          <h1 className="fw-bold m-0" style={{ color: colors.textDark, fontSize: "2.5rem" }}>My Auctioned Crops</h1>
          <p className="text-muted m-0 fw-semibold">Track real-time bidding for your listings</p>
        </div>

        <div className="row g-4">
          {myCrops.length > 0 ? (
            myCrops.map((crop) => (
              <div key={crop._id} className="col-md-4">
                <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: "24px", overflow: "hidden", backgroundColor: "#fff" }}>
                  <div style={{ position: "relative" }}>
                    <img 
                      src={`http://localhost:5000${crop.imageUrl}`} 
                      className="card-img-top" 
                      alt={crop.cropName} 
                      style={{ height: "220px", objectFit: "cover" }} 
                    />
                    <div style={{
                      position: "absolute", bottom: "15px", right: "15px",
                      background: "rgba(255,255,255,0.9)", padding: "5px 15px",
                      borderRadius: "12px", fontWeight: "800", fontSize: "0.75rem", color: colors.primary
                    }}>
                      {crop.quantity}
                    </div>
                  </div>

                  <div className="card-body p-4 text-center">
                    <h5 style={{ fontWeight: "800", color: colors.textDark, marginBottom: "10px" }}>{crop.cropName}</h5>
                    <p style={{ color: "#888", fontSize: "0.9rem" }}>Base Price: <strong style={{color: colors.primary}}>₹{crop.price}</strong></p>
                    
                    <button 
                      className="btn w-100 mt-3" 
                      style={{ 
                        background: colors.primary, 
                        color: "#fff", 
                        fontWeight: "700", 
                        padding: "14px", 
                        borderRadius: "14px", 
                        border: "none",
                        boxShadow: "0 6px 15px rgba(75, 111, 68, 0.15)"
                      }}
                      onClick={() => navigate(`/auction/${crop._id}`)}
                    >
                      View Live Leaderboard
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
               <div className="p-5 rounded-4 bg-white shadow-sm border border-dashed">
                  <h4 className="text-muted">No crops found.</h4>
                  <p>Add crops in the "My Crops" section to see them here.</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FarmerAuctionDashboard;