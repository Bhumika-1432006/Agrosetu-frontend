import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ChatPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [chat, setChat] = useState(null);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  const colors = {
    primary: "#4B6F44", 
    gold: "#D4AF37", 
    bgLight: "#F2F5F0", 
    chatBg: "#E5DDD5", 
    dealerBubble: "#DCF8C6", 
    farmerBubble: "#FFFFFF", 
    textDark: "#1E291B",
    white: "#FFFFFF"
  };

  const fetchChat = async () => {
    if (!state?.chatId) return;
    try {
      // UPDATED TO USE ENV VARIABLE
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/chat/${state.chatId}`);
      if (!res.ok) throw new Error("Failed to fetch chat");
      const data = await res.json();
      setChat(data);
    } catch (err) {
      console.error("Fetch chat error:", err);
    }
  };

  useEffect(() => {
    if (!state?.chatId) return;
    fetchChat();
    const interval = setInterval(fetchChat, 2000);
    return () => clearInterval(interval);
  }, [state?.chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      // UPDATED TO USE ENV VARIABLE
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/chat/${state.chatId}/message`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ senderRole: "dealer", text }),
        }
      );
      if (!res.ok) throw new Error("Failed to send message");
      const updatedChat = await res.json();
      setChat(updatedChat);
      setText("");
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  if (!chat) return (
    <div className="text-center mt-5" style={{ color: colors.primary }}>
      <div className="spinner-border" role="status"></div>
      <p className="mt-2 fw-bold">Opening Secure Channel...</p>
    </div>
  );

  return (
    <div style={{ backgroundColor: colors.bgLight, minHeight: "100vh", padding: "20px" }}>
      <div className="shadow-lg mx-auto" style={{ 
        maxWidth: "600px", 
        borderRadius: "24px", 
        overflow: "hidden", 
        backgroundColor: colors.white,
        display: "flex",
        flexDirection: "column",
        height: "85vh"
      }}>
        
        <div style={{ 
          backgroundColor: colors.primary, 
          padding: "15px 20px", 
          display: "flex", 
          alignItems: "center", 
          color: "white" 
        }}>
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-link text-white p-0 me-3" 
            style={{ fontSize: "1.2rem" }}
          >
            ←
          </button>
          <div>
            <h6 className="mb-0" style={{ fontWeight: "700" }}>Farmer Connection</h6>
            <small style={{ opacity: 0.8 }}>ID: {state.chatId.slice(-6).toUpperCase()}</small>
          </div>
          <div className="ms-auto">
            <span className="badge rounded-pill" style={{ backgroundColor: colors.gold }}>Live Sync</span>
          </div>
        </div>

        <div style={{ 
          flex: 1, 
          overflowY: "auto", 
          backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')",
          backgroundColor: "#E5DDD5", 
          padding: "20px" 
        }}>
          {chat.messages.length === 0 && (
            <div className="text-center mt-5 p-4" style={{ backgroundColor: "rgba(255,255,255,0.5)", borderRadius: "15px" }}>
              <p className="mb-0 text-muted italic">Start the negotiation. Send a greeting!</p>
            </div>
          )}
          
          {chat.messages.map((m, i) => {
            const isDealer = m.senderRole === "dealer";
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: isDealer ? "flex-end" : "flex-start",
                  marginBottom: "12px",
                }}
              >
                <div style={{
                  maxWidth: "75%",
                  padding: "10px 16px",
                  borderRadius: isDealer ? "18px 18px 2px 18px" : "18px 18px 18px 2px",
                  background: isDealer ? colors.dealerBubble : colors.farmerBubble,
                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  color: colors.textDark,
                  position: "relative"
                }}>
                  <div style={{ fontSize: "0.95rem" }}>{m.text}</div>
                  <div style={{ 
                    fontSize: "0.65rem", 
                    textAlign: "right", 
                    marginTop: "4px", 
                    opacity: 0.5,
                    fontWeight: "700"
                  }}>
                    {isDealer ? "YOU" : "FARMER"}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: "15px", backgroundColor: "white", borderTop: "1px solid #eee" }}>
          <div className="d-flex align-items-center bg-light px-3 py-1" style={{ borderRadius: "30px" }}>
            <input
              className="form-control border-0 bg-transparent shadow-none"
              style={{ fontSize: "0.95rem", padding: "10px 0" }}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Negotiate price or quantity..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button 
              className="btn ms-2 d-flex align-items-center justify-content-center" 
              style={{ 
                backgroundColor: colors.primary, 
                color: "white", 
                borderRadius: "50%", 
                width: "40px", 
                height: "40px",
                transition: "0.3s" 
              }} 
              onClick={sendMessage}
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;