import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function AuctionPage() {
  const { cropId } = useParams();
  const [crop, setCrop] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  const colors = {
    primary: "#4B6F44", 
    gold: "#D4AF37", 
    bgLight: "#F4F7F2",
    white: "#FFFFFF", 
    textDark: "#1E291B", 
    winnerBg: "rgba(212, 175, 55, 0.08)"
  };

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchAuctionData = async () => {
    try {
      // UPDATED TO USE ENV VARIABLE
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/bid/bids/${cropId}`);
      const data = await res.json();
      if (data?.crop) {
        setCrop(data.crop);
        const sorted = (data.bids || []).sort((a, b) => b.pricePerKg - a.pricePerKg);
        setBids(sorted);
      }
    } catch (err) {
      console.error("Polling error:", err);
    }
  };

  useEffect(() => {
    let isMounted = true; 

    const initFetch = async () => {
      await fetchAuctionData();
      if (isMounted) setLoading(false);
    };

    initFetch();

    const interval = setInterval(() => {
      if (isMounted) fetchAuctionData();
    }, 3000); 

    return () => {
      isMounted = false; 
      clearInterval(interval);
    };
  }, [cropId]);

  const getCountdown = (endTime) => {
    if (!endTime) return "PENDING";
    const diff = new Date(endTime) - now;
    if (diff <= 0) return "AUCTION CLOSED";
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${hours}h ${mins}m ${secs}s`;
  };

  if (loading) return <div className="text-center mt-5 fw-bold" style={{color: colors.primary}}>Syncing with Live Auction...</div>;
  if (!crop) return <p className="text-center mt-4">Auction session not found.</p>;

  const isExpired = crop.bidEndTime && now > new Date(crop.bidEndTime);

  return (
    <div style={{ backgroundColor: colors.bgLight, minHeight: "100vh", paddingBottom: "60px" }}>
      <div style={{ position: "relative", height: "350px", width: "100%", overflow: "hidden" }}>
        <img 
          // UPDATED TO USE ENV VARIABLE
          src={`${process.env.REACT_APP_API_URL}${crop.imageUrl}`} 
          alt={crop.cropName} 
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.6)" }} 
        />
        <div className="container" style={{ 
            position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)", color: "white" 
        }}>
          <span className="badge bg-warning text-dark mb-2 fw-bold px-3 py-2" style={{ borderRadius: "10px" }}>
            {isExpired ? "FINAL RESULTS" : "LIVE AUCTION"}
          </span>
          <h1 className="display-4 fw-bold m-0">{crop.cropName}</h1>
          <p className="fs-5 opacity-90"> Farmer: {crop.farmerName || "Registered Farmer"}</p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: "1000px", marginTop: "-50px" }}>
        <div className="card border-0 shadow-lg mb-5" style={{ borderRadius: "25px", background: colors.white }}>
          <div className="row g-0 text-center py-4">
            <div className="col-4 border-end">
                <small className="text-muted text-uppercase fw-bold" style={{ fontSize: "0.7rem" }}>Quantity</small>
                <h4 className="fw-bold m-0" style={{ color: colors.textDark }}>{crop.quantity} kg</h4>
            </div>
            <div className="col-4 border-end">
                <small className="text-muted text-uppercase fw-bold" style={{ fontSize: "0.7rem" }}>Time Remaining</small>
                <h4 className="fw-bold m-0" style={{ color: isExpired ? "#C62828" : colors.primary }}>
                    {getCountdown(crop.bidEndTime)}
                </h4>
            </div>
            <div className="col-4">
                <small className="text-muted text-uppercase fw-bold" style={{ fontSize: "0.7rem" }}>Highest Bid</small>
                <h4 className="fw-bold m-0 text-success">
                    ₹{bids?.length > 0 ? bids[0]?.pricePerKg : crop?.price}
                </h4>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-4 px-2">
          <h3 className="fw-bold m-0" style={{ color: colors.textDark }}>Live Leaderboard</h3>
          <div className="d-flex align-items-center">
             <div className="spinner-grow spinner-grow-sm text-success me-2" role="status"></div>
             <small className="text-muted fw-bold">Live Updates Every 3s</small>
          </div>
        </div>

        <div className="card border-0 shadow-sm" style={{ borderRadius: "24px", overflow: "hidden" }}>
          <table className="table mb-0 align-middle">
            <thead style={{ backgroundColor: "#F8F9F7" }}>
              <tr>
                <th className="ps-5 py-4 text-muted small fw-bold">RANK</th>
                <th className="py-4 text-muted small fw-bold">DEALER NAME</th>
                <th className="py-4 text-muted small fw-bold">PRICE</th>
                <th className="text-end pe-5 py-4 text-muted small fw-bold">BID TIME</th>
              </tr>
            </thead>
            <tbody>
              {(bids || []).map((bid, index) => (
                <tr key={index} style={{ 
                    backgroundColor: index === 0 ? colors.winnerBg : "transparent",
                    transition: "0.3s" 
                }}>
                  <td className="ps-5 py-4 fw-bold">
                    {index === 0 ? (
                        <span style={{ fontSize: "1.5rem" }}>🥇</span>
                    ) : (
                        <span className="ms-2" style={{ color: "#999" }}>{index + 1}</span>
                    )}
                  </td>
                  <td className="fw-bold" style={{ color: colors.textDark, fontSize: "1.1rem" }}>
                    {bid.dealerName}
                  </td>
                  <td className="fw-bold">
                    <span className="badge px-3 py-2" style={{ 
                        backgroundColor: index === 0 ? colors.primary : "#E9F0E8", 
                        color: index === 0 ? "#fff" : colors.primary,
                        borderRadius: "10px",
                        fontSize: "1rem"
                    }}>
                        ₹{bid.pricePerKg}
                    </span>
                  </td>
                  <td className="text-end pe-5 text-muted small fw-medium">
                    {new Date(bid.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                </tr>
              ))}
              {(!bids || bids.length === 0) && (
                <tr>
                    <td colSpan="4" className="text-center py-5 text-muted fw-bold">
                        No bids have been placed yet. Be the first!
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AuctionPage;