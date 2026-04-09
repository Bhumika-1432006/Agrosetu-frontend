import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
// Initialize socket outside or use useMemo to prevent multiple connections
const socket = io(API_BASE_URL);

function DealerBiddingRoom() {
  const { cropId } = useParams();
  const [crop, setCrop] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBid, setNewBid] = useState("");

  const colors = {
    primary: "#4B6F44", 
    gold: "#D4AF37", 
    textDark: "#1E291B",
    bgLight: "#F2F5F0", 
    white: "#FFFFFF", 
    border: "#E2E8E1", 
    winnerBg: "#FCF9EE"
  };

  useEffect(() => {
    const fetchCropBids = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/bid/bids/${cropId}`);
        const data = await res.json();
        if (data?.crop) {
          setCrop(data.crop);
          const sorted = (data.bids || []).sort((a, b) => b.pricePerKg - a.pricePerKg);
          setBids(sorted);
        }
      } catch (err) { 
        console.error("Fetch error:", err); 
      } finally { 
        setLoading(false); 
      }
    };

    fetchCropBids();

    // JOIN THE ROOM
    socket.emit("joinAuction", cropId);

    // LISTEN FOR THE CORRECT EVENT NAME: "newBid" (matches backend)
    socket.on("newBid", (update) => {
      if (update.cropId === cropId) {
        const sorted = (update.bids || []).sort((a, b) => b.pricePerKg - a.pricePerKg);
        setBids(sorted);
      }
    });

    // LISTEN FOR TIME UPDATES
    socket.on("bidTimeUpdated", (update) => {
      if (update.cropId === cropId) {
        setCrop((prev) => prev ? { ...prev, status: "open" } : prev);
      }
    });

    return () => {
      socket.emit("leaveAuction", cropId);
      socket.off("newBid");
      socket.off("bidTimeUpdated");
    };
  }, [cropId]);

  const highestBid = bids.length > 0 ? bids[0].pricePerKg : (parseFloat(crop?.price) || 0);

  const submitBid = async () => {
  if (!crop) return;
  const bidAmount = parseFloat(newBid);

  // 1. Explicitly grab the values
  const storedName = localStorage.getItem("username");
  const storedId = localStorage.getItem("userId");

  // 2. Validation: Alert if the session is broken
  if (!storedName || !storedId) {
    console.error("Missing Auth Data:", { storedName, storedId });
    return alert("Session Error: Please Log Out and Log In again to refresh your name.");
  }

  if (!bidAmount || bidAmount <= highestBid) {
    return alert(`Your bid must be HIGHER than ₹${highestBid}`);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/bid/bid/${cropId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        dealerId: storedId, 
        dealerName: storedName, // Use the variable we just checked
        pricePerKg: bidAmount 
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setNewBid("");
      // Success will be reflected via Socket.io automatically
    } else {
      alert(data.message || "Bid failed");
    }
  } catch (err) { 
    console.error("Fetch Error:", err);
    alert("Server error. Please check your connection."); 
  }
};

  if (loading) return <div className="text-center mt-5">Loading Auction Room...</div>;
  if (!crop) return <div className="container mt-5 text-center"><h4>Auction not found.</h4></div>;

  return (
    <div style={{ backgroundColor: colors.bgLight, minHeight: "100vh", padding: "40px 20px" }}>
      <div className="container" style={{ maxWidth: "1000px" }}>
        
        {/* Header Section */}
        <div className="row g-4 mb-4">
          <div className="col-lg-7">
            <div style={{ backgroundColor: colors.white, padding: "35px", borderRadius: "30px", border: `1px solid ${colors.border}` }}>
              <span className="badge mb-3" style={{ 
                backgroundColor: crop.status === "open" ? "#E8F5E9" : "#FFEBEE", 
                color: crop.status === "open" ? "#2E7D32" : "#C62828" 
              }}>
                {crop.status === "open" ? "● Live Auction" : "Auction Ended"}
              </span>
              <h2 className="fw-bold">{crop.cropName}</h2>
              <p className="mb-0 text-muted">Quantity: <strong>{crop.quantity}</strong></p>
              <p className="text-muted">Farmer Base Price: <strong>₹{crop.price}/kg</strong></p>
            </div>
          </div>

          <div className="col-lg-5">
            <div style={{ 
              background: `linear-gradient(135deg, ${colors.primary} 0%, #2D4429 100%)`, 
              color: "white", 
              padding: "35px", 
              borderRadius: "30px", 
              textAlign: "center",
              boxShadow: "0 10px 20px rgba(75, 111, 68, 0.2)"
            }}>
              <small className="text-uppercase opacity-75 fw-bold">Current High Bid</small>
              <h1 style={{ fontSize: "4rem", fontWeight: "900", margin: "10px 0" }}>₹{highestBid}</h1>
              {bids.length > 0 ? (
                <div className="badge bg-white text-dark py-2 px-3" style={{ borderRadius: "10px" }}>
                  🏆 {bids[0].dealerName}
                </div>
              ) : (
                <div className="badge bg-white bg-opacity-25 text-white py-2 px-3">No bids yet</div>
              )}
            </div>
          </div>
        </div>

        {/* Input Section */}
        {crop.status === "open" ? (
          <div className="mb-5 p-4 bg-white shadow-sm" style={{ borderRadius: "25px", border: `2px solid ${colors.gold}` }}>
            <div className="row g-3 align-items-center">
              <div className="col-md-8">
                <div className="input-group">
                  <span className="input-group-text border-0" style={{ background: "#F2F5F0" }}>₹</span>
                  <input 
                    type="number" 
                    className="form-control py-3 border-0" 
                    style={{ background: "#F2F5F0" }} 
                    placeholder={`Enter more than ₹${highestBid}`} 
                    value={newBid} 
                    onChange={(e) => setNewBid(e.target.value)} 
                  />
                </div>
              </div>
              <div className="col-md-4">
                <button 
                  className="btn btn-lg w-100 py-3 fw-bold shadow-sm" 
                  style={{ backgroundColor: colors.gold, color: "white" }} 
                  onClick={submitBid}
                >
                  PLACE BID
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="alert alert-secondary text-center py-4 mb-5" style={{ borderRadius: "25px" }}>
            This auction is currently closed for bidding.
          </div>
        )}

        {/* Leaderboard Section */}
        <h5 className="mb-4 fw-bold">Live Leaderboard</h5>
        <div className="table-responsive bg-white shadow-sm mb-5" style={{ borderRadius: "30px", overflow: "hidden" }}>
          <table className="table mb-0 align-middle">
            <thead className="bg-light">
              <tr style={{ height: "60px" }}>
                <th className="ps-4 border-0">RANK</th>
                <th className="border-0">DEALER</th>
                <th className="border-0">PRICE</th>
                <th className="text-end pe-4 border-0">TIME</th>
              </tr>
            </thead>
            <tbody>
              {bids.length > 0 ? (
                bids.map((bid, index) => (
                  <tr key={bid._id} style={{ 
                    backgroundColor: index === 0 ? colors.winnerBg : "transparent",
                    height: "70px"
                  }}>
                    <td className="ps-4 fw-bold">
                      {index === 0 ? "🥇 1" : index === 1 ? "🥈 2" : index === 2 ? "🥉 3" : index + 1}
                    </td>
                    <td>
                      <div className="fw-bold">{bid.dealerName}</div>
                    </td>
                    <td className="text-success fw-bold">₹{bid.pricePerKg}</td>
                    <td className="text-end pe-4 text-muted">
                      {new Date(bid.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">
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

export default DealerBiddingRoom;