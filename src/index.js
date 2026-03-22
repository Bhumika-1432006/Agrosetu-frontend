import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";

import Homepage from "./landing_page/home/Homepage";
import Aboutpage from "./landing_page/about/Aboutpage";
import Signup from "./landing_page/signup/Signup";
import FarmerCrops from "./landing_page/cropt/FarmerCrops";
import DealerCrops from "./landing_page/cropt/DealerCrops";
import FarmerInterests from "./landing_page/cropt/FarmerInterests";
import ChatPage from "./chat/ChatPage";
import FarmerChatPage from "./landing_page/cropt/FarmerChatPage";
import DealerBidPageCon from "./landing_page/cropt/DealerBidPageCon";
import DealerBiddingRoom from "./landing_page/cropt/DealerBiddingRoom";
import AuctionPage from "./landing_page/auction/AuctionPage";
import FarmerAuctionDashboard from "./landing_page/auction/FarmerAuctionDashboard";

// Auth Guard
const ProtectedRoute = ({ children, allowedRole }) => {
  const role = localStorage.getItem("role");
  if (!role) return <Navigate to="/signup" replace />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/" replace />;
  return children;
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<Aboutpage />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/farmer/crops" element={<ProtectedRoute allowedRole="farmer"><FarmerCrops /></ProtectedRoute>} />
        <Route path="/farmer/interests" element={<ProtectedRoute allowedRole="farmer"><FarmerInterests /></ProtectedRoute>} />
        <Route path="/farmer/chat/:chatId" element={<FarmerChatPage />} />

        <Route path="/dealer/crops" element={<ProtectedRoute allowedRole="dealer"><DealerCrops /></ProtectedRoute>} />
        <Route path="/dealer/bid" element={<ProtectedRoute allowedRole="dealer"><DealerBidPageCon /></ProtectedRoute>} />
        <Route path="/dealer/bid/:cropId" element={<DealerBiddingRoom />} />

        <Route path="/auction/:cropId" element={<AuctionPage />} />
        <Route path="/farmer/auctions" element={<ProtectedRoute allowedRole="farmer"><FarmerAuctionDashboard /></ProtectedRoute>} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);