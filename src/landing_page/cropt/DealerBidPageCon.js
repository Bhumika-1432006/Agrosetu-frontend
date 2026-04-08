import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DealerBidPage() {
  const navigate = useNavigate();
  const dealerId = localStorage.getItem("userId");
  const dealerName = localStorage.getItem("username");
  
  const [cart, setCart] = useState([]);
  const [cropsData, setCropsData] = useState({});
  const [bidAmounts, setBidAmounts] = useState({});
  const [now, setNow] = useState(new Date());
const API_BASE = "https://agrosetu-backend.onrender.com";
  
useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const key = `dealerCart_${dealerId}`;
    const storedCart = JSON.parse(localStorage.getItem(key)) || [];
    setCart(storedCart);

    const refreshData = async () => {
      const updatedData = {};
      await Promise.all(storedCart.map(async (item) => {
        try {
          // FIXED URL AND ROUTE
          const res = await fetch(`${API_BASE}/api/auction/bids/${item._id}`);
          const data = await res.json();
          if (data.crop) updatedData[item._id] = { ...data.crop, bids: data.bids };
        } catch (err) { console.error("Fetch error:", err); }
      }));
      setCropsData(updatedData);
    };

    refreshData();
    const interval = setInterval(refreshData, 5000); 
    return () => clearInterval(interval);
  }, [dealerId]);

  const submitBid = async (cropId) => {
    const amount = Number(bidAmounts[cropId]);
    const currentCrop = cropsData[cropId];
    
    if (!amount || amount <= 0) return alert("Please enter a valid amount");
    if (now > new Date(currentCrop.bidEndTime)) return alert("⛔ BID TIME EXCEEDED!");
    
    const highest = currentCrop?.bids?.length 
      ? Math.max(...currentCrop.bids.map(b => b.pricePerKg)) 
      : currentCrop?.price;

    if (amount <= highest) return alert(`Bid must be higher than ₹${highest}`);

    try {
      // FIXED URL AND ROUTE
      const res = await fetch(`${API_BASE}/api/auction/bid/${cropId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          dealerId, 
          dealerName: localStorage.getItem("name"), // Use "name" as per your signin logic
          pricePerKg: amount}),
      });

      const result = await res.json();

      if (res.ok) {
        setBidAmounts({ ...bidAmounts, [cropId]: "" });
        alert("Bid placed successfully!");
      }else {
        alert(result.message || "Bid failed");
      }
    } catch (err) { alert("Bid failed"); 
      console.error("Bid error:", err);
    }
  };

  const removeFromCart = (cropId) => {
    const key = `dealerCart_${dealerId}`;
    const updatedCart = cart.filter(item => item._id !== cropId);
    localStorage.setItem(key, JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  // Helper to format Date and Time
  const formatDateTime = (dateString) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return { date: "N/A", time: "N/A" };
    return {
      date: d.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }),
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getCountdown = (endTime) => {
    const end = new Date(endTime);
    if (isNaN(end.getTime()) || end - now <= 0) return "SESSION CLOSED";
    const diff = end - now;
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${hours}h ${mins}m ${secs}s`;
  };

  return (
    <div className="container-fluid py-5" style={{ backgroundColor: "#F9FBFA", minHeight: "100vh" }}>
      <div className="container">
        <div className="mb-5 border-start border-success border-5 ps-4">
            <h1 className="fw-bold m-0" style={{ color: "#1E291B", fontSize: "2.8rem" }}>Bidding Terminal</h1>
            <p className="text-muted fw-semibold">Real-time auction management</p>
        </div>

        <div className="row">
          {cart.map((item) => {
            const data = cropsData[item._id] || item;
            const endTime = new Date(data.bidEndTime);
            const isExpired = isNaN(endTime.getTime()) || now > endTime;
            const currentHigh = data.bids?.length ? Math.max(...data.bids.map(b => b.pricePerKg)) : data.price;
            
            const startInfo = formatDateTime(data.bidStartTime);
            const endInfo = formatDateTime(data.bidEndTime);

            return (
              <div key={item._id} className="col-lg-4 col-md-6 mb-5">
                <div className="card border-0 shadow-lg" style={{ 
                  borderRadius: "40px", 
                  overflow: "hidden", 
                  background: "#fff", 
                  position: "relative",
                  filter: isExpired ? "grayscale(1)" : "none",
                  opacity: isExpired ? 0.7 : 1,
                  transition: "all 0.4s ease"
                }}>
                  
                  <div style={{ height: "180px" }}>
                    <img src={`${API_BASE}/${data.imageUrl}`} alt={data.cropName} style={{ height: "100%", width: "100%", objectFit: "cover" }} />
                  </div>

                  <div className="card-body p-4">
                    <h4 className="fw-bold mb-3" style={{ color: "#1E291B" }}>{data.cropName}</h4>
                    
                    {/* Updated Date & Time Section */}
                    <div className="d-flex justify-content-between mb-3 p-3" style={{ background: "#f8f9fa", borderRadius: "20px", border: "1px solid #eee" }}>
                        <div className="text-start">
                            <small className="text-muted d-block fw-bold mb-1" style={{ fontSize: '0.7rem' }}>START</small>
                            <div className="fw-bold text-dark" style={{ fontSize: '0.8rem' }}>{startInfo.date}</div>
                            <div className="text-success small" style={{ fontSize: '0.75rem' }}>{startInfo.time}</div>
                        </div>
                        <div className="text-end border-start ps-3">
                            <small className="text-muted d-block fw-bold mb-1" style={{ fontSize: '0.7rem' }}>END</small>
                            <div className="fw-bold text-dark" style={{ fontSize: '0.8rem' }}>{endInfo.date}</div>
                            <div className="text-danger small" style={{ fontSize: '0.75rem' }}>{endInfo.time}</div>
                        </div>
                    </div>

                    <div className="p-2 mb-3 text-center" style={{ background: "#F0F4F0", borderRadius: "15px" }}>
                        <span className="fw-bold" style={{ color: "#1B5E20", fontSize: "0.9rem" }}>
                            {getCountdown(data.bidEndTime)}
                        </span>
                    </div>

                    <div className="text-center mb-4 py-3 shadow-sm" style={{ 
                      background: "linear-gradient(135deg, #2E7D32, #1B5E20)", 
                      borderRadius: "18px", color: "#fff" 
                    }}>
                        <small className="opacity-75 d-block">Highest Bid</small>
                        <h2 className="fw-bold m-0">₹{currentHigh}</h2>
                    </div>

                    <div className="input-group mb-2 shadow-sm" style={{ borderRadius: "15px", overflow: "hidden" }}>
                        <input 
                          type="number" 
                          className="form-control border-0 bg-light px-3" 
                          placeholder="Enter Amount" 
                          value={bidAmounts[item._id] || ""}
                          onChange={(e) => setBidAmounts({...bidAmounts, [item._id]: e.target.value})}
                          disabled={isExpired} 
                        />
                        <button 
                          className="btn px-4 fw-bold" 
                          style={{ backgroundColor: "#D4AF37", color: "#fff" }} 
                          onClick={() => submitBid(item._id)}
                          disabled={isExpired}
                        >
                          BID
                        </button>
                    </div>
                  </div>

                  <div className="card-footer bg-white border-0 p-4 pt-0 text-center">
                    <button 
                      className="btn w-100 py-2 fw-bold mb-2 shadow-sm" 
                      style={{ color: "#4B6F44", background: "rgba(75, 111, 68, 0.12)", borderRadius: "15px", border: "1px solid rgba(75, 111, 68, 0.2)" }} 
                      onClick={() => navigate(`/auction/${item._id}`)}
                    >
                      View Leaderboard
                    </button>
                    
                    <button 
                      className="btn btn-link text-danger text-decoration-none fw-bold small p-0"
                      onClick={() => removeFromCart(item._id)}
                    >
                      ✕ Remove from Terminal
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DealerBidPage;