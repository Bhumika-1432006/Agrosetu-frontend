import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import Hero from './Hero';
import Tips from './Tips';
import Govtnotice from './Govtnotice';

function Homepage() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) setUsername(storedName);
  }, []);

  const colors = {
    bg: "#F4F7F2",      // Light App Background from your reference
    highlight: "#A7D489", 
    textDark: "#2D3436"
  };

  return (
    <div style={{ backgroundColor: colors.bg, fontFamily: "'Inter', sans-serif", color: colors.textDark }}>
      <Navbar />

      {/* NOTE: The "Hello, Farmer" welcome has been moved inside <Hero /> 
         to match the middle reference image's top-green-header style.
      */}

      <div style={{ position: "relative" }}>
        
        {/* HERO SECTION (Now includes Weather and Farmer Welcome) */}
        <section>
            <Hero username={username} />
        </section>

        {/* 📐 ORGANIC DIVIDER */}
        <div style={{ 
          margin: "60px 0", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center" 
        }}>
            <div style={{ width: "80px", height: "2px", background: colors.highlight, borderRadius: "2px" }} />
        </div>

        {/* TIPS SECTION */}
        <section style={{ padding: "20px 0" }}>
            <Tips />
        </section>

        {/* GOVT NOTICE - Deep Forest Curved Section */}
        <section style={{ 
          background: "#1E291B", 
          color: "#fff",
          borderRadius: "60px 60px 0 0", 
          padding: "100px 20px",
          marginTop: "100px"
        }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <Govtnotice />
            </div>
        </section>
      </div>

      <Footer />

      {/* ⚙️ GLOBAL STYLE REFINEMENTS */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap');
          
          button, .btn {
            background: #4B6F44 !important;
            color: #ffffff !important;
            border: none !important;
            border-radius: 14px !important;
            padding: 14px 28px !important;
            font-weight: 600 !important;
            box-shadow: 0 4px 14px rgba(75, 111, 68, 0.2) !important;
            transition: all 0.3s ease !important;
          }

          button:hover {
            background: #3A5A34 !important;
            transform: translateY(-2px) !important;
          }

          /* Hide scrollbar for cleaner mobile look if needed */
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-thumb { background: #8FBC8F; border-radius: 10px; }
        `}
      </style>
    </div>
  );
}

export default Homepage;