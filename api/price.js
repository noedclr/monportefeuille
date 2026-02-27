export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const { ticker } = req.query;
  if (!ticker) return res.status(400).json({ error: "Ticker manquant" });

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`;
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json",
      }
    });
    if (!r.ok) throw new Error(`Yahoo HTTP ${r.status}`);
    const data = await r.json();
    const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
    if (!price || price <= 0) return res.status(404).json({ error: "Prix introuvable pour " + ticker });
    res.json({ price: Math.round(price * 100) / 100 });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
