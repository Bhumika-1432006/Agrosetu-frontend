import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FarmerAuctionDashboard() {
  const navigate = useNavigate();
  const farmerId = localStorage.getItem("userId");
  const [myCrops, setMyCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState({}); // Stores time for each cropId

  const colors = {
    primary: "#4B6F44",
    textDark: "#1E291B",
    bgLight: "#F4F7F2",
  };

  const fetchMyCrops = async () => {
    try {
      // Use process.env for the live Render URL
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/farmer/crops/${farmerId}`);
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
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/bid/update-time/${cropId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bidEndTime: timeValue }) // Must match backend key!
      });

      if (res.ok) {
        alert("Auction schedule updated!");
        fetchMyCrops(); // Refresh the list
      } else {
        alert("Server Error: Could not update time.");
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  if (loading) return <div className="text-center mt-5">🌾 Syncing live auctions...</div>;

  return (
    <div style={{ backgroundColor: colors.bgLight, minHeight: "100vh", padding: "50px 0" }}>
      <div className="container">
        <h1 className="fw-bold mb-4" style={{ color: colors.textDark }}>Farmer Auction Control</h1>
        <div className="row g-4">
          {myCrops.map((crop) => (
            <div key={crop._id} className="col-md-4">
              <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: "20px" }}>
                <img src={`${process.env.REACT_APP_API_URL}${crop.imageUrl}`} className="card-img-top" style={{ height: "200px", objectFit: "cover", borderRadius: "20px 20px 0 0" }} alt={crop.cropName} />
                <div className="card-body">
                  <h5 className="fw-bold">{crop.cropName}</h5>
                  <p className="text-muted small">Status: <span className="badge bg-success">{crop.status}</span></p>
                  
                  {/* Time Input Field */}
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
          ))}
        </div>
      </div>
    </div>
  );
}

export default FarmerAuctionDashboard;