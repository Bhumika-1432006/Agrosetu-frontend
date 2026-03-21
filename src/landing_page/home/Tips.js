import React, { useEffect, useState } from "react";

function Tips() {
  const tips = [
    "A single healthy soil teaspoon contains more microorganisms than there are people on Earth.",
    "Crop rotation can naturally reduce soil-borne diseases by up to 50%.",
    "Nitrogen-fixing plants like legumes can add 50–200 kg of nitrogen per hectare per year to the soil.",
    "Mulching can reduce soil evaporation by up to 30%.",
    "Drip irrigation uses 30–50% less water than traditional flood irrigation.",
    "Earthworms can consume half their weight in soil every day, improving soil fertility.",
    "Integrated Pest Management can reduce chemical pesticide use by up to 70%.",
    "Plants communicate stress through chemical signals detectable by neighboring plants.",
    "Rice can survive partial submergence for up to two weeks during floods.",
    "Intercropping maize with legumes can increase overall yield by 20–30%.",
    "Honeybees pollinate around 75% of the world’s food crops.",
    "Organic matter increases water-holding capacity of soil up to tenfold.",
    "Precision farming can improve crop yield by 15–20% using sensors and analytics.",
    "Cover crops help reduce soil erosion by up to 90%.",
    "Healthy soil contains around 25% air and 25% water.",
    "Composting can reduce farm waste by up to 60%.",
    "Agroforestry can increase biodiversity on farms by up to 80%.",
    "No-till farming can reduce carbon emissions by up to 40%.",
    "Vertical farming uses up to 95% less water than conventional farming.",
    "Greenhouses can produce up to 10 times more yield per square meter.",
    "A single earthworm can create nutrient tunnels up to 30 cm deep.",
    "Beneficial insects like ladybugs can eat up to 50 aphids per day.",
    "Zero-budget farming relies on natural resources instead of synthetic inputs.",
    "Biochar enhances soil fertility and captures carbon for centuries.",
    "Windbreaks can reduce soil erosion by up to 50%.",
    "Fungal networks in soil help plants share nutrients over long distances.",
    "Drip irrigation reduces weed pressure by minimizing wet areas.",
    "A mature cow produces 20–30 kg of manure daily, enriching soil.",
    "Potatoes were the first vegetable grown in space.",
    "Bananas are the world’s most traded fruit after apples.",
    "Tomatoes were once believed to be poisonous in Europe.",
    "Smart irrigation sensors can reduce water use by up to 40%.",
    "Chickens help control pests like grasshoppers and beetles naturally.",
    "A single bee colony can pollinate 300 million flowers daily.",
    "Sandy soils drain quickly but need organic matter for fertility.",
    "Clay soils hold nutrients well but need aeration for root growth.",
    "Terracing prevents soil erosion in hilly areas.",
    "Shade nets help protect crops from heat stress and sunburn.",
    "Farm ponds help store rainwater for year-round irrigation.",
    "Goats can clear weeds without disturbing the soil structure.",
    "Hydroponic systems grow plants without soil using nutrient water.",
    "Aeroponics can use 98% less water than soil farming.",
    "Livestock manure improves soil organic carbon significantly.",
    "Solar-powered pumps reduce irrigation costs for farmers.",
    "Natural predators reduce pest populations without chemicals.",
    "Seed priming boosts germination rate and plant vigor.",
    "Biofertilizers improve soil fertility without harming microbes.",
    "Plastic mulching increases soil temperature and boosts yields.",
    "Neem oil is a natural pesticide safe for most beneficial insects.",
    "Farmers adopting weather apps can reduce crop loss by 20%.",
    "Grain moisture levels must be below 14% before storage.",
    "Silage preserves nutrients and increases livestock productivity.",
    "Vertical trellising increases vegetable yield by maximizing space.",
    "Regular soil testing helps avoid overuse of fertilizers.",
    "Beneficial nematodes help control soil-dwelling pests.",
    "Fodder crops like napier grass grow back quickly after cutting.",
    "Micro-irrigation reduces nutrient leaching from soil.",
    "Flood irrigation loses up to 60% of water through evaporation.",
    "Raised beds improve drainage and root growth in heavy soils.",
    "Green manure adds organic nitrogen and prevents weed growth.",
    "Timely weeding can increase yields by up to 25%.",
    "Rainwater harvesting reduces dependency on groundwater sources.",
    "Improved seed varieties can increase production by up to 30%.",
    "Fish farming combined with rice fields improves nutrient cycling.",
    "Balanced fertilizer application prevents nutrient deficiency.",
    "Tractors save up to 90% labor time during field preparation.",
    "Water stress during flowering reduces yields drastically.",
    "Salt-tolerant crops grow well in coastal regions.",
    "Mulberry leaves support silk production in sericulture.",
    "Night-time irrigation can reduce evaporation losses.",
    "Vertical crop stacking increases production per square meter.",
    "Azolla is a natural feed that boosts livestock nutrition.",
    "Fungi like mycorrhiza help plants absorb phosphorus efficiently.",
    "Carbon-rich soils store more water and support healthier crops.",
    "Pheromone traps control pests without chemicals.",
    "Temperature and humidity control increases greenhouse yield.",
    "Hybrid seeds offer higher uniformity and resistance to stress.",
    "Excess nitrogen can cause weak stems and pest attacks.",
    "Leaf color chart helps farmers apply nitrogen correctly.",
    "Fermented plant juice is an organic growth booster.",
    "Drought-resistant varieties reduce crop loss in dry regions.",
    "Polyculture systems increase resilience to climate change.",
    "Wind direction affects the pollination efficiency of crops.",
    "Moisture sensors prevent over-irrigation and root diseases.",
    "Trichoderma fungi protect plants from soil pathogens.",
    "Calcium deficiency causes blossom end rot in tomatoes.",
    "Potassium helps plants tolerate drought and stress.",
    "Zinc deficiency leads to stunted plant growth.",
    "Livestock grazing improves grassland biodiversity.",
    "Waterlogging reduces oxygen supply to plant roots.",
    "Balanced crop spacing improves sunlight exposure.",
    "Organic foliar sprays enhance nutrient uptake quickly.",
    "Cold storage extends the shelf life of fruits and vegetables.",
    "Silicon strengthens plant cell walls against pests.",
    "A well-maintained compost pile can reach 60°C to kill pathogens.",
    "High humidity favors fungal disease outbreaks.",
    "Proper pruning increases fruit production in orchards.",
    "Good pollination can increase fruit size by up to 40%."
  ];

  const [tip, setTip] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const colors = {
    forest: "#1E392A",
    leaf: "#2DCA73",
    white: "#FFFFFF",
    text: "#2C3E50",
    textLight: "#7F8C8D"
  };

  const getRandomTip = () => tips[Math.floor(Math.random() * tips.length)];

  useEffect(() => {
    setTip(getRandomTip());
    const fetchWeather = async (lat, lon) => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
        );
        const data = await response.json();
        const cur = data.current;
        const codes = { 0: "Clear Sky", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast", 45: "Foggy", 61: "Slight Rain", 95: "Stormy" };

        setWeather({
          temp: Math.round(cur.temperature_2m),
          hum: cur.relative_humidity_2m,
          wind: Math.round(cur.wind_speed_10m),
          rain: cur.weather_code > 50 ? "High" : "Low",
          desc: codes[cur.weather_code] || "Clear",
          date: new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })
        });
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => fetchWeather(p.coords.latitude, p.coords.longitude),
        () => fetchWeather(12.97, 77.59)
      );
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getCropAdvice = () => {
    if (!weather) return { g: "...", n: "...", b: "..." };
    if (weather.temp < 22) return { g: "Carrot, Radish, Cabbage, Broccoli", n: "Tomatoes, Beans, Potato", b: "Paddy, Watermelon" };
    if (weather.temp > 32) return { g: "Millets, Sorghum, Guar", n: "Maize, Cotton", b: "Spinach, Lettuce" };
    return { g: "Tomato, Maize, Pulses", n: "Vegetables, Soy", b: "Extreme Tropicals" };
  };

  const advice = getCropAdvice();

  return (
    <div style={{ backgroundColor: "#F8FAF9", minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: colors.text }}>
      <div style={{ 
        background: `linear-gradient(135deg, ${colors.forest} 0%, #2D5A41 100%)`, 
        color: "white", 
        padding: "40px 20px", 
        textAlign: "center",
        position: "relative",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        overflow: "hidden"
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", justifyContent: "center", gap: "15px", alignItems: "center", marginBottom: "15px" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: "800", background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: "20px", letterSpacing: "1px" }}>DAILY FARMER INSIGHT</span>
            <span onClick={() => setTip(getRandomTip())} style={{ cursor: "pointer", fontSize: "0.8rem", opacity: 0.8, textDecoration: "underline" }}>Refresh Tip ↻</span>
          </div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: "500", lineHeight: "1.4", margin: "0 auto", maxWidth: "850px" }}>
            "{tip}"
          </h2>
        </div>
        <div style={{ position: "absolute", right: "-30px", bottom: "-40px", fontSize: "12rem", opacity: 0.05, transform: "rotate(-15deg)" }}>🌿</div>
        <div style={{ position: "absolute", left: "-30px", top: "-40px", fontSize: "12rem", opacity: 0.05, transform: "rotate(15deg)" }}>🌱</div>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "30px 20px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: "900", margin: 0, color: colors.forest, letterSpacing: "-0.5px" }}>Field Intelligence</h1>
            <p style={{ fontSize: "1rem", color: colors.textLight, margin: 0 }}>{weather?.date || "Detecting Location..."}</p>
          </div>
          <div style={{ textAlign: "right" }}>
             <div style={{ fontSize: "0.75rem", fontWeight: "700", color: colors.leaf }}>LIVE CONNECTED</div>
             <div style={{ fontSize: "0.9rem", color: colors.text }}>Bengaluru, IN</div>
          </div>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "30px" }}>
          <div style={{ background: colors.white, borderRadius: "32px", padding: "35px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", border: "1px solid #F0F0F0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "30px", marginBottom: "35px" }}>
              <div style={{ fontSize: "4.5rem" }}>{weather?.temp > 25 ? "☀️" : "⛅"}</div>
              <div>
                <h2 style={{ fontSize: "3.5rem", fontWeight: "900", margin: 0, letterSpacing: "-2px" }}>{weather?.temp ?? "--"}°C</h2>
                <p style={{ color: colors.textLight, margin: 0, fontWeight: "700", fontSize: "1.2rem" }}>{weather?.desc}</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <WeatherBox label="Rain Risk" value={weather?.rain ?? "--"} icon="🌧️" bg="#E3F2FD" text="#1565C0" />
              <WeatherBox label="Humidity" value={`${weather?.hum ?? "--"}%`} icon="💧" bg="#E0F2F1" text="#00695C" />
              <WeatherBox label="Wind" value={`${weather?.wind ?? "--"} km/h`} icon="💨" bg="#F3E5F5" text="#6A1B9A" />
              <WeatherBox label="Soil Info" value="Optimal" icon="🌱" bg="#F1F8E9" text="#33691E" />
            </div>
          </div>

          <div style={{ background: colors.white, borderRadius: "32px", padding: "35px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", border: "1px solid #F0F0F0" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "25px", color: colors.forest }}>Agronomy Recommendation</h3>
            <AdviceRow label="High Potential" items={advice.g} color={colors.leaf} bg="#E8F9F1" icon="✅" />
            <AdviceRow label="Moderate Care" items={advice.n} color="#F39C12" bg="#FEF9E7" icon="⚠️" />
            <AdviceRow label="Avoid Planting" items={advice.b} color="#E74C3C" bg="#FDEDEC" icon="❌" />
            <div style={{ marginTop: "30px", padding: "20px", borderRadius: "20px", backgroundColor: "#F8FAF9", border: "1px dashed #DDD", fontSize: "0.85rem", color: colors.textLight, lineHeight: "1.5" }}>
              <strong>Climate-Smart Tip:</strong> Temperatures below 22°C are ideal for cool-season vegetables. Ensure soil moisture is consistent during these periods.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const WeatherBox = ({ label, value, icon, bg, text }) => (
  <div style={{ background: bg, padding: "18px", borderRadius: "24px", display: "flex", flexDirection: "column", gap: "5px" }}>
    <span style={{ fontSize: "1.5rem" }}>{icon}</span>
    <div>
      <div style={{ fontSize: "1.1rem", fontWeight: "900", color: text }}>{value}</div>
      <div style={{ fontSize: "0.65rem", fontWeight: "800", color: text, opacity: 0.7, textTransform: "uppercase" }}>{label}</div>
    </div>
  </div>
);

const AdviceRow = ({ label, items, color, bg, icon }) => (
  <div style={{ display: "flex", gap: "18px", marginBottom: "20px", alignItems: "flex-start" }}>
    <div style={{ minWidth: "40px", height: "40px", borderRadius: "12px", background: bg, display: "flex", justifyContent: "center", alignItems: "center", color: color, fontSize: "1.1rem" }}>{icon}</div>
    <div>
      <div style={{ fontSize: "0.9rem", fontWeight: "800", color: color }}>{label}</div>
      <div style={{ fontSize: "0.85rem", color: "#555", fontWeight: "500", lineHeight: "1.5" }}>{items}</div>
    </div>
  </div>
);

export default Tips;