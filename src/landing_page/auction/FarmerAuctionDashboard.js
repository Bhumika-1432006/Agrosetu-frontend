import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FarmerAuctionDashboard() {
  const navigate = useNavigate();
  const farmerId = localStorage.getItem("userId");
  const [myCrops, setMyCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState({});

  const colors = {
    primary: "#4B6F44",
    textDark: "#1E291B",
    bgLight: "#F4F7F2",
  };

  // Fallback ensures it works even if Environment Variables are missing in Vercel
  const API_BASE_URL = process.env.REACT_APP_API_URL || "https://agrosetu-backend.onrender.com";

  const fetchMyCrops = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/farmer/crops/${farmerId}`);
      const data = await res.json();
      setMyCrops(data || []);
      setLoading(false);
    } catch (err) {
      console.error("Dashboard error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (farmerId) fetchMyCrops();
  }, [farmerId]);

  const handleUpdateTime = async (cropId) => {
    const timeValue = selectedTime[cropId];
    if (!timeValue) return alert("Please select a time first!");

    try {
      const res = await fetch(`${API_BASE_URL}/api/bid/update-time/${cropId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ bidEndTime: timeValue })
      });

      if (res.ok) {
        alert("Auction schedule updated!");
        fetchMyCrops(); 
      } else {
        const errorMsg = await res.json();
        alert(`Server Error: ${errorMsg.message}`);
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Connection failed. Ensure the backend is awake!");
    }
  };

  if (loading) return <div className="text-center mt-5">🌾 Syncing live auctions...</div>;

  return (
    <div style={{ backgroundColor: colors.bgLight, minHeight: "100vh", padding: "50px 0" }}>
      <div className="container">
        <h1 className="fw-bold mb-4" style={{ color: colors.textDark }}>Farmer Auction Control</h1>
        <div className="row g-4">
          {myCrops.length === 0 ? (
             <div className="text-center">No crops uploaded yet.</div>
          ) : (
            myCrops.map((crop) => (
              <div key={crop._id} className="col-md-4">
                <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: "20px" }}>
                  <img 
                    src={crop.imageUrl ? `${API_BASE_URL}${crop.imageUrl}` : "https://via.placeholder.com/200"} 
                    className="card-img-top" 
                    style={{ height: "200px", objectFit: "cover", borderRadius: "20px 20px 0 0" }} 
                    alt={crop.cropName} 
                  />
                  <div className="card-body">
                    <h5 className="fw-bold">{crop.cropName}</h5>
                    <p className="text-muted small">Status: <span className="badge bg-success">{crop.status}</span></p>
                    
                    <div className="mb-3">
                      <label className="small fw-bold">Set Auction End Time:</label>
                      <input 
                        type="datetime-local" 
                        className="form-control form-control-sm"
                        onChange={(e) => setSelectedTime({ ...selectedTime, [crop._id]: e.target.value })}
                      />
                    </div>

                    <button className="btn btn-outline-success btn-sm w-100 mb-2" onClick={() => handleUpdateTime(crop._id)}>
                      Update Schedule
                    </button>
                    <button className="btn btn-success w-100 fw-bold" onClick={() => navigate(`/auction/${crop._id}`)}>
                      View Leaderboard
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default FarmerAuctionDashboard;