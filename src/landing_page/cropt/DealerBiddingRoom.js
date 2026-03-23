import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

// Change this line:
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const socket = io(API_BASE_URL);

function DealerBiddingRoom() {
  const { cropId } = useParams();
  const [crop, setCrop] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBid, setNewBid] = useState("");

  const colors = {
    primary: "#4B6F44", gold: "#D4AF37", textDark: "#1E291B",
    bgLight: "#F2F5F0", white: "#FFFFFF", border: "#E2E8E1", winnerBg: "#FCF9EE"
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
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchCropBids();

    socket.emit("joinAuction", cropId);
    socket.on("bidUpdated", (update) => {
      if (update.cropId === cropId) {
        const sorted = (update.bids || []).sort((a, b) => b.pricePerKg - a.pricePerKg);
        setBids(sorted);
        if (update.status) setCrop((prev) => prev ? { ...prev, status: update.status } : prev);
      }
    });

    return () => {
      socket.emit("leaveAuction", cropId);
      socket.off("bidUpdated");
    };
  }, [cropId]);

  const highestBid = bids.length > 0 ? bids[0].pricePerKg : (crop?.price || 0);

  const submitBid = async () => {
    if (!crop) return;
    const bidAmount = Number(newBid);
    if (!bidAmount || bidAmount <= highestBid) {
      return alert(`Bid must be higher than current highest price (₹${highestBid})`);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/bid/bid/${cropId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          dealerId: localStorage.getItem("userId"), 
          dealerName: localStorage.getItem("username"), 
          pricePerKg: bidAmount 
        }),
      });
      if (res.ok) setNewBid("");
    } catch (err) { alert("Error submitting bid"); }
  };

  if (loading) return <div className="text-center mt-5">Loading Auction Room...</div>;
  if (!crop) return <div className="container mt-5 text-center"><h4>Auction not found.</h4></div>;

  return (
    <div style={{ backgroundColor: colors.bgLight, minHeight: "100vh", padding: "40px 20px" }}>
      <div className="container" style={{ maxWidth: "1000px" }}>
        <div className="row g-4 mb-4">
          <div className="col-lg-7">
            <div style={{ backgroundColor: colors.white, padding: "35px", borderRadius: "30px", border: `1px solid ${colors.border}` }}>
              <span className="badge mb-3" style={{ backgroundColor: crop.status === "open" ? "#E8F5E9" : "#FFEBEE", color: crop.status === "open" ? "#2E7D32" : "#C62828" }}>
                {crop.status === "open" ? "● Live Auction" : "Auction Ended"}
              </span>
              <h2 className="fw-bold">{crop.cropName}</h2>
              <p>Qty: <strong>{crop.quantity} kg</strong> | Base: <strong>₹{crop.price}/kg</strong></p>
            </div>
          </div>
          <div className="col-lg-5">
            <div style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, #2D4429 100%)`, color: "white", padding: "35px", borderRadius: "30px", textAlign: "center" }}>
              <small className="text-uppercase opacity-75">Current High Bid</small>
              <h1 style={{ fontSize: "4rem", fontWeight: "900" }}>₹{highestBid}</h1>
              {bids.length > 0 && <div className="badge bg-white text-dark">🏆 {bids[0].dealerName}</div>}
            </div>
          </div>
        </div>
        {crop.status === "open" && (
          <div className="mb-5 p-4 bg-white shadow-sm" style={{ borderRadius: "25px", border: `2px solid ${colors.gold}` }}>
            <div className="row g-3 align-items-center">
              <div className="col-md-8">
                <input type="number" className="form-control py-3 border-0" style={{ background: "#F2F5F0" }} 
                  placeholder={`Enter more than ₹${highestBid}`} value={newBid} onChange={(e) => setNewBid(e.target.value)} />
              </div>
              <div className="col-md-4">
                <button className="btn btn-lg w-100 py-3 fw-bold" style={{ backgroundColor: colors.gold, color: "white" }} onClick={submitBid}>PLACE BID</button>
              </div>
            </div>
          </div>
        )}
        <h5 className="mb-4 fw-bold">Live Leaderboard</h5>
        <div className="table-responsive bg-white shadow-sm" style={{ borderRadius: "30px" }}>
          <table className="table mb-0">
            <thead className="bg-light">
              <tr><th className="ps-4">RANK</th><th>DEALER</th><th>PRICE</th><th className="text-end pe-4">TIME</th></tr>
            </thead>
            <tbody>
              {bids.map((bid, index) => (
                <tr key={bid._id} style={{ backgroundColor: index === 0 ? colors.winnerBg : "transparent" }}>
                  <td className="ps-4">{index + 1} {index === 0 && "🥇"}</td>
                  <td className="fw-bold">{bid.dealerName}</td>
                  <td className="text-success fw-bold">₹{bid.pricePerKg}</td>
                  <td className="text-end pe-4 text-muted">{new Date(bid.createdAt).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DealerBiddingRoom;