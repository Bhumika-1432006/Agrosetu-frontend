import React, { useState } from "react";
import Navbar from "../Navbar";

function Aboutpage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const colors = {
    primary: "#4B6F44", 
    gold: "#D4AF37",    
    bgLight: "#F8FAF7", 
    textDark: "#1E291B",
    accent: "#E8F5E9",
    dealerBlue: "#1A3C5E",
    danger: "#d9534f"
  };

  const faqs = [
    {
      id: 1,
      question: "How does AgroSetu help Farmers get a better price?",
      answer: "By opening your crops to a wide network of verified dealers, you are no longer forced to accept the price from a single local buyer. The bidding system creates healthy competition, ensuring you get the highest possible market value for your hard work."
    },
    {
      id: 2,
      question: "Is it safe to deal with people I don't know?",
      answer: "Yes. Every user on AgroSetu must be registered and verified. Furthermore, the 'Interest System' allows farmers to view a dealer's profile before starting a conversation, ensuring transparency for both parties."
    },
    {
      id: 3,
      question: "How do I know if my bid is the highest?",
      answer: "Our marketplace uses a live leaderboard. If another dealer places a higher bid, the price updates instantly on your screen. This transparency ensures a fair auction where the best offer always wins."
    },
    {
      id: 4,
      question: "What happens after the auction ends?",
      answer: "Once a winning bid is established or interest is shown, a direct chat room is opened between the Farmer and the Dealer. Here, you can discuss delivery, quality checks, and final payment terms directly without any middleman interference."
    },
    {
      id: 5,
      question: "Are there any hidden charges or commissions?",
      answer: "No. AgroSetu is built to empower the agricultural community. Unlike traditional mandis or brokers who take a percentage of every sale, our platform facilitates a direct connection so 100% of the agreed price stays in the farmer's pocket."
    }
  ];

  return (
    <>
      <Navbar />
      <div style={{ backgroundColor: colors.bgLight, minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
        
        {/* --- DYNAMIC HERO SECTION --- */}
        <div style={{ 
          background: `linear-gradient(rgba(75, 111, 68, 0.9), rgba(30, 41, 27, 0.9)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: "120px 0", 
          color: "white", 
          textAlign: "center" 
        }}>
          <div className="container">
            <h1 className="display-2 fw-bold mb-3">AgroSetu</h1>
            <p className="fs-4 opacity-75 mx-auto" style={{ maxWidth: "800px" }}>
              The Future of Agricultural Commerce: Transparent, Efficient, and Direct.
            </p>
          </div>
        </div>

        <div className="container" style={{ marginTop: "-80px" }}>
          <div className="row justify-content-center">
            <div className="col-lg-11">
              
              {/* --- MAIN CONTENT CARD --- */}
              <div className="card border-0 shadow-lg p-4 p-md-5 mb-5" style={{ borderRadius: "40px", background: "#fff" }}>
                
                {/* 1. WHY AGROSETU (PROBLEM & SOLUTION) */}
                <div className="row align-items-center mb-5 pb-5">
                  <div className="col-md-6">
                    <h6 className="text-success fw-bold text-uppercase tracking-widest">The Challenge</h6>
                    <h2 className="fw-bold mb-4" style={{ color: colors.textDark }}>Why AgroSetu?</h2>
                    <p className="text-secondary fs-5 mb-4">
                      In the current system, farmers lose up to <b>40% of their potential income</b> to commissions and middlemen. 
                      AgroSetu provides a decentralized marketplace where <b>data drives the price</b>, not negotiation tactics.
                    </p>
                    <div className="d-flex gap-3">
                      <div className="p-3 rounded-4 flex-fill text-center" style={{ background: colors.accent }}>
                        <h4 className="fw-bold text-success mb-1">0%</h4>
                        <small className="text-muted fw-bold">Middleman Fees</small>
                      </div>
                      <div className="p-3 rounded-4 flex-fill text-center" style={{ background: colors.accent }}>
                        <h4 className="fw-bold text-success mb-1">100%</h4>
                        <small className="text-muted fw-bold">Transparency</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mt-4 mt-md-0 px-md-5">
                    <div className="p-4 rounded-4 shadow-sm" style={{ border: "1px dashed #ced4da", backgroundColor: "#fcfdfc" }}>
                        <h5 className="fw-bold mb-3" style={{ color: colors.textDark }}>Our Impact</h5>
                        <p className="small text-muted mb-0">Recovering lost income by connecting <b>Verified Farmers</b> directly to <b>Global Dealers</b>. Our platform ensures that the value created on the field reaches the farmer's pocket without leakages.</p>
                    </div>
                  </div>
                </div>



                {/* 3. INTERACTIVE FAQ SECTION */}
                <div className="py-5">
                  <h3 className="fw-bold text-center mb-5" style={{ color: colors.textDark }}>Frequently Asked Questions</h3>
                  <div className="mx-auto w-100" style={{ maxWidth: "850px" }}>
                    {faqs.map((faq) => (
                      <div key={faq.id} className="mb-3" style={{ borderRadius: "15px", overflow: "hidden", border: "1px solid #edf2f7" }}>
                        <button 
                          onClick={() => toggleFaq(faq.id)}
                          className="w-100 border-0 py-3 px-4 d-flex justify-content-between align-items-center fw-bold"
                          style={{ 
                            background: openFaq === faq.id ? colors.accent : "white", 
                            color: openFaq === faq.id ? colors.primary : colors.textDark,
                            outline: "none", 
                            textAlign: "left",
                            transition: "0.3s all ease"
                          }}
                        >
                          <span>{faq.id}. {faq.question}</span>
                          <span style={{ 
                            transform: openFaq === faq.id ? 'rotate(180deg)' : 'rotate(0deg)', 
                            transition: '0.3s',
                            fontSize: "12px"
                          }}>▼</span>
                        </button>
                        
                        {openFaq === faq.id && (
                          <div className="px-4 py-4 text-secondary border-top" style={{ backgroundColor: "#fcfdfc", lineHeight: "1.6" }}>
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. USER FLOWS (FARMER vs DEALER) */}
                <div className="row g-5 mb-5 mt-2">
                  <div className="col-md-6">
                    <div className="p-5 h-100" style={{ backgroundColor: "#F9FBFA", borderRadius: "30px", border: "1px solid #eee" }}>
                      <h4 className="fw-bold mb-3" style={{ color: colors.primary }}>For Farmers </h4>
                      <ul className="list-unstyled fs-6">
                        <li className="mb-3">🔹 <b>Dashboard:</b> Manage all crop listings in one view.</li>
                        <li className="mb-3">🔹 <b>Auction Control:</b> Set your own timing and base prices.</li>
                        <li className="mb-3">🔹 <b>Direct Chat:</b> Communicate directly with potential buyers.</li>
                        <li className="mb-3">🔹 <b>Analytics:</b> View bid history to understand market trends.</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-5 h-100" style={{ backgroundColor: "#F4F7FB", borderRadius: "30px", border: "1px solid #eee" }}>
                      <h4 className="fw-bold mb-3" style={{ color: colors.dealerBlue }}>For Dealers </h4>
                      <ul className="list-unstyled fs-6">
                        <li className="mb-3">🔹 <b>Global Search:</b> Find any crop across multiple regions.</li>
                        <li className="mb-3">🔹 <b>Live Bidding:</b> Real-time leaderboards with 🥇 status.</li>
                        <li className="mb-3">🔹 <b>Cart System:</b> Track multiple active bids simultaneously.</li>
                        <li className="mb-3">🔹 <b>Verified Profiles:</b> Buy from trusted, rated farmers.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 5. THE PROJECT ROADMAP */}
                <div className="py-5 text-center">
                  <h3 className="fw-bold mb-5">Future Roadmap</h3>
                  <div className="row g-2 justify-content-center">
                    <div className="col-md-3">
                      <div className="p-3 border-bottom border-success border-3">
                        <h6 className="fw-bold">Phase 1</h6>
                        <small className="text-muted">Live Auction Core (Current)</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="p-3 border-bottom border-warning border-3 opacity-50">
                        <h6 className="fw-bold">Phase 2</h6>
                        <small className="text-muted">Payment Gateway Integration</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="p-3 border-bottom border-info border-3 opacity-50">
                        <h6 className="fw-bold">Phase 3</h6>
                        <small className="text-muted">AI Crop Price Prediction</small>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* --- CALL TO ACTION --- */}
              <div className="text-center mb-5 pb-5">
                <h3 className="fw-bold mb-4">Ready to revolutionize your trade?</h3>
                <button 
                  onClick={() => window.location.href='/signup'}
                  className="btn btn-success btn-lg px-5 py-3 fw-bold shadow-lg" 
                  style={{ borderRadius: "15px", backgroundColor: colors.primary }}
                >
                  Join the Marketplace
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* --- FOOTER --- */}
        <footer className="bg-white py-5 border-top">
          <div className="container text-center">
            <p className="text-muted small mb-0">Developed with ❤️ for the Global Farming Community.</p>
            <p className="text-muted small">© 2026 AgroSetu. All Rights Reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Aboutpage;