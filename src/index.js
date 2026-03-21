import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

// Landing Pages
import Homepage from "./landing_page/home/Homepage";
import Aboutpage from "./landing_page/about/Aboutpage";
import Signup from "./landing_page/signup/Signup";

// Farmer / Dealer Crops
import FarmerCrops from "./landing_page/cropt/FarmerCrops";
import DealerCrops from "./landing_page/cropt/DealerCrops";
import FarmerInterests from "./landing_page/cropt/FarmerInterests";

// Chat
import ChatPage from "./chat/ChatPage";
import FarmerChatPage from "./landing_page/cropt/FarmerChatPage";

// Dealer Bidding
import DealerBidPageCon from "./landing_page/cropt/DealerBidPageCon";
import DealerBiddingRoom from "./landing_page/cropt/DealerBiddingRoom";

// Auction
import AuctionPage from "./landing_page/auction/AuctionPage";
import FarmerAuctionDashboard from "./landing_page/auction/FarmerAuctionDashboard";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Landing & Auth */}
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<Aboutpage />} />
        <Route path="/signup" element={<Signup />} />

        {/* Farmer Section */}
        <Route path="/farmer/crops" element={<FarmerCrops />} />
        <Route path="/farmer/interests" element={<FarmerInterests />} />
        <Route path="/farmer/chat/:chatId" element={<FarmerChatPage />} />

        {/* Dealer Section */}
        <Route path="/dealer/crops" element={<DealerCrops />} />
        
        {/* This is the Main Tracking Dashboard (Cart) */}
        <Route path="/dealer/bid" element={<DealerBidPageCon />} />
        
        {/* This is the Individual Bidding Room with Input */}
        <Route path="/dealer/bid/:cropId" element={<DealerBiddingRoom />} />

        {/* Auction Live History (Shared View) */}
        {/* When you navigate to /auction/:cropId, it triggers the real-time sync */}
        <Route path="/auction/:cropId" element={<AuctionPage />} />
        <Route path="/farmer/auctions" element={<FarmerAuctionDashboard />} />
        {/* Messaging */}
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);