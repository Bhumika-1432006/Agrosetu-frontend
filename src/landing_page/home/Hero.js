import React, { useEffect, useState } from "react";

function Hero() {
  const [news, setNews] = useState([]);
  const [error, setError] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const API_KEY = "ad6289a097f94ee8a75aeaecfb244ed5";
    const API_URL = `https://newsapi.org/v2/everything?q=agriculture OR farming OR crops OR horticulture&sortBy=publishedAt&pageSize=6&language=en&apiKey=${API_KEY}`;

    async function fetchNews() {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        const shuffled = data.articles.sort(() => 0.5 - Math.random());
        setNews(shuffled.slice(0, 6));
      } catch (err) {
        console.error(err);
        setError("Could not load news. Please try again later.");
      }
    }
    fetchNews();
  }, []);

  const colors = {
    primary: "#4B6F44",
    accent: "#8FBC8F",
    highlight: "#A7D489",
    bg: "#F9FBF7",
    textMain: "#2D3436",
    white: "#FFFFFF",
    glass: "rgba(255,255,255,0.7)"
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        minHeight: "100vh",
        backgroundColor: colors.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowX: "hidden"
      }}
    >
      {/* HERO */}
      <div style={{ width: "100%", position: "relative" }}>
        <div
          style={{
            height: "60vh",
            minHeight: "320px",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <img
            src="media/images/agrosetu.png"
            alt="Hero"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.7))"
            }}
          />

          <div
            style={{
              position: "absolute",
              bottom: "40px",
              left: "5%",
              right: "5%",
              color: "#fff"
            }}
          >
            <h2
              style={{
                fontSize: "clamp(1.8rem, 6vw, 3.5rem)",
                fontWeight: "800",
                lineHeight: "1.2",
                margin: 0
              }}
            >
              The New Era of <br />
              <span style={{ color: colors.highlight }}>
                Agriculture.
              </span>
            </h2>

            <p
              style={{
                fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)",
                marginTop: "10px"
              }}
            >
              Harnessing smart data for a better harvest tomorrow.
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div
        style={{
          width: "90%",
          maxWidth: "1200px",
          marginTop: "40px"
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "30px"
          }}
        >
          <div>
            <h3 style={{ fontSize: "0.9rem", color: colors.primary }}>
              GLOBAL INSIGHTS
            </h3>
            <h1
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
                margin: 0
              }}
            >
              Agri News Stream
            </h1>
          </div>

          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              border: `1px solid ${colors.primary}`,
              background: "#fff",
              cursor: "pointer"
            }}
          >
            REFRESH ↺
          </button>
        </div>

        {/* NEWS GRID */}
        {news.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px"
            }}
          >
            {news.map((item, index) => (
              <div
                key={index}
                onClick={() => setSelectedArticle(item)}
                style={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  background: "#fff",
                  cursor: "pointer",
                  boxShadow: "0 5px 20px rgba(0,0,0,0.08)"
                }}
              >
                {item.urlToImage && (
                  <img
                    src={item.urlToImage}
                    alt=""
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover"
                    }}
                  />
                )}

                <div style={{ padding: "15px" }}>
                  <h3
                    style={{
                      fontSize: "1rem",
                      color: colors.textMain
                    }}
                  >
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Loading...</p>
        )}

        {/* MODAL */}
        {selectedArticle && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "15px",
              zIndex: 999
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "20px",
                maxWidth: "700px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto"
              }}
            >
              <button
                onClick={() => setSelectedArticle(null)}
                style={{
                  float: "right",
                  margin: "10px",
                  border: "none",
                  background: "none",
                  fontSize: "20px",
                  cursor: "pointer"
                }}
              >
                ✕
              </button>

              {selectedArticle.urlToImage && (
                <img
                  src={selectedArticle.urlToImage}
                  alt=""
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover"
                  }}
                />
              )}

              <div style={{ padding: "20px" }}>
                <h2>{selectedArticle.title}</h2>
                <p>{selectedArticle.description}</p>

                <a
                  href={selectedArticle.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read Full →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Hero;