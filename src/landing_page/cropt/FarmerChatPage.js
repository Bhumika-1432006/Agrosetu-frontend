import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

function FarmerChatPage() {
  const { chatId } = useParams();
  const [chat, setChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const senderRole = "farmer";

  // --- PREMIUM AGROSETU THEME ---
  const colors = {
    primary: "#4B6F44",      // Forest Green
    gold: "#D4AF37",         // Harvest Gold
    textDark: "#1E291B",     // Deep Earth
    white: "#FFFFFF",
    bgLight: "#F2F5F0",      // Soft Sage Background
    border: "#E2E8E1",
    bubbleFarmer: "#4B6F44", // Sender: Forest Green
    bubbleDealer: "#FFFFFF"  // Receiver: White
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChat = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/chat/${chatId}`);
      if (!res.ok) throw new Error("Failed to fetch chat");
      const data = await res.json();
      setChat(data);
    } catch (err) {
      console.error("Fetch chat error:", err);
    }
  };

  useEffect(() => {
    fetchChat();
    const interval = setInterval(fetchChat, 2000);
    return () => clearInterval(interval);
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/chat/${chatId}/message`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ senderRole, text: newMessage }),
        }
      );

      if (!res.ok) throw new Error("Failed to send message");

      const updatedChat = await res.json();
      setChat(updatedChat);
      setNewMessage(""); 
      scrollToBottom();
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  if (!chat) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: colors.bgLight }}>
      <div style={{ color: colors.primary, textAlign: "center" }}>
        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
        <span style={{ fontWeight: "700" }}>Securing your connection...</span>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: colors.bgLight, minHeight: "100vh", padding: "30px 20px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ 
        maxWidth: "850px", 
        margin: "0 auto", 
        backgroundColor: colors.white, 
        borderRadius: "32px", 
        boxShadow: "0 20px 50px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        height: "85vh",
        border: `1px solid ${colors.border}`,
        overflow: "hidden"
      }}>
        
        {/* HEADER */}
        <div style={{ 
          padding: "20px 35px", 
          borderBottom: `1px solid ${colors.border}`, 
          display: "flex", 
          alignItems: "center",
          background: colors.white,
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ 
              width: "55px", height: "55px", borderRadius: "16px", 
              background: colors.bgLight, display: "flex", 
              alignItems: "center", justifyContent: "center", marginRight: "18px",
              border: `1px solid ${colors.border}`, fontSize: "1.5rem"
            }}>
              🏪
            </div>
            <div>
              <h5 style={{ margin: 0, fontWeight: "800", color: colors.textDark, fontSize: "1.25rem" }}>
                {chat.dealerId?.name || "Dealer"}
              </h5>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "8px", height: "8px", background: "#2ecc71", borderRadius: "50%" }}></span>
                <p style={{ margin: 0, fontSize: "0.9rem", color: colors.primary, fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                   {chat.dealerId?.shopName || "Verified Partner"}
                </p>
              </div>
            </div>
          </div>
          <div style={{ color: colors.gold, fontSize: "1.2rem" }}>⭐</div>
        </div>

        {/* MESSAGES LIST */}
        <div style={{ 
          flex: 1, 
          padding: "35px", 
          overflowY: "auto", 
          display: "flex", 
          flexDirection: "column", 
          gap: "24px",
          background: "#FAFBFA" 
        }}>
          {chat.messages.length === 0 && (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "#AAA", fontSize: "1.1rem", fontStyle: "italic" }}>No messages yet. Start your negotiation!</p>
            </div>
          )}
          
          {chat.messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: msg.senderRole === senderRole ? "flex-end" : "flex-start",
                maxWidth: "75%",
              }}
            >
              <div style={{
                padding: "18px 26px",
                borderRadius: msg.senderRole === senderRole ? "26px 26px 4px 26px" : "26px 26px 26px 4px",
                backgroundColor: msg.senderRole === senderRole ? colors.bubbleFarmer : colors.bubbleDealer,
                color: msg.senderRole === senderRole ? "#fff" : colors.textDark,
                fontSize: "1.2rem", // Bolder and larger text for readability
                lineHeight: "1.6",
                boxShadow: msg.senderRole === senderRole ? "0 6px 15px rgba(75, 111, 68, 0.15)" : "0 4px 12px rgba(0,0,0,0.03)",
                border: msg.senderRole === senderRole ? "none" : `1px solid ${colors.border}`,
                wordWrap: "break-word",
              }}>
                {msg.text}
              </div>
              <div style={{ 
                fontSize: "0.8rem", 
                color: "#999", 
                marginTop: "10px", 
                textAlign: msg.senderRole === senderRole ? "right" : "left",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                {msg.senderRole === senderRole ? "You" : chat.dealerId?.name || "Dealer"}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        {/* INPUT AREA */}
        <form onSubmit={handleSend} style={{ 
          padding: "30px 35px", 
          borderTop: `1px solid ${colors.border}`, 
          display: "flex", 
          gap: "18px", 
          background: colors.white 
        }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Discuss quantity, price, or delivery..."
            style={{ 
              flex: 1, 
              padding: "20px 25px", 
              borderRadius: "18px", 
              border: `1.5px solid ${colors.border}`,
              backgroundColor: "#F9FAF9",
              fontSize: "1.15rem", 
              outline: "none",
              transition: "border-color 0.2s ease"
            }}
            onFocus={(e) => e.target.style.borderColor = colors.primary}
            onBlur={(e) => e.target.style.borderColor = colors.border}
          />
          <button 
            type="submit" 
            style={{ 
              padding: "0 35px", 
              borderRadius: "18px", 
              border: "none", 
              background: colors.primary, 
              color: "#fff", 
              fontWeight: "800",
              fontSize: "1.1rem",
              boxShadow: "0 8px 20px rgba(75, 111, 68, 0.2)",
              transition: "all 0.3s ease",
              cursor: "pointer"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            SEND <span style={{marginLeft: "8px"}}>🚀</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default FarmerChatPage;