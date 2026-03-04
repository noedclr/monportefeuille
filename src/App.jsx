import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { createClient } from "@supabase/supabase-js";

/* ─── CONFIGURATION SUPABASE ───────────────────────────────────────────────
   Remplacez ces deux valeurs par celles de votre projet Supabase
   (Settings → API dans le dashboard Supabase)
   ────────────────────────────────────────────────────────────────────────── */
const SUPABASE_URL      = "https://ptpiddkrnxmbxqipkzbt.supabase.co";   // ex: https://xxxx.supabase.co
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0cGlkZGtybnhtYnhxaXBremJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNDIyNTcsImV4cCI6MjA4NzcxODI1N30.VsZacJn97476yh-n28zt-R_9OM7gpqA60PYXikmX1eQ";       // ex: eyJhbGciOiJ...
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


/* ────────────────── DONNÉES INITIALES ────────────────── */
const INITIAL_TRANSACTIONS = [
  { id: 1,  date: "2025-02-13", asset: "S&P 500 (Acc)",                    type: "Achat", qty: 1,      price: 29.33,   fees: 1,    total: 30.33,       broker: "Trade Republic", assetType: "ETF",            ticker: "500.PA"    },
  { id: 2,  date: "2025-03-04", asset: "AXA",                              type: "Achat", qty: 2,      price: 37.82,   fees: 1.23, total: 76.87,       broker: "Trade Republic", assetType: "Actions",        ticker: "CS.PA"     },
  { id: 3,  date: "2025-04-03", asset: "Engie",                            type: "Achat", qty: 2,      price: 18.51,   fees: 0.34, total: 37.36,       broker: "Trade Republic", assetType: "Actions",        ticker: "ENGI.PA"   },
  { id: 4,  date: "2025-05-07", asset: "Renault",                          type: "Achat", qty: 1,      price: 47.72,   fees: 0.43, total: 48.15,       broker: "Trade Republic", assetType: "Actions",        ticker: "RNO.PA"    },
  { id: 5,  date: "2025-05-07", asset: "Crédit Agricole",                  type: "Achat", qty: 1,      price: 16.79,   fees: 0.15, total: 16.94,       broker: "Trade Republic", assetType: "Actions",        ticker: "ACA.PA"    },
  { id: 6,  date: "2025-06-25", asset: "S&P 500 (Acc)",                    type: "Achat", qty: 1,      price: 26.29,   fees: 0.13, total: 26.42,       broker: "Trade Republic", assetType: "ETF",            ticker: "500.PA"    },
  { id: 7,  date: "2025-06-25", asset: "Drone Volt Saca",                  type: "Achat", qty: 43,     price: 0.734,   fees: 0.16, total: 31.722,      broker: "Trade Republic", assetType: "Actions",        ticker: "ALDRV.PA"  },
  { id: 8,  date: "2025-07-04", asset: "S&P 500 (Acc)",                    type: "Achat", qty: 2,      price: 26.65,   fees: 0.26, total: 53.56,       broker: "Trade Republic", assetType: "ETF",            ticker: "500.PA"    },
  { id: 9,  date: "2025-09-05", asset: "MSCI World Swap PEA EUR (Acc)",    type: "Achat", qty: 8,      price: 5.785,   fees: 0.23, total: 46.51,       broker: "Trade Republic", assetType: "ETF",            ticker: "MWRD.PA"   },
  { id: 10, date: "2025-09-05", asset: "STOXX Europe 600 Banks EUR (Acc)", type: "Achat", qty: 3,      price: 50,      fees: 0.75, total: 150.75,      broker: "Trade Republic", assetType: "ETF",            ticker: "EXV1.DE"   },
  { id: 11, date: "2025-09-05", asset: "MSCI EMU High Dividend EUR",       type: "Achat", qty: 1,      price: 175.48,  fees: 0.88, total: 176.36,      broker: "Trade Republic", assetType: "ETF",            ticker: "EMUD.PA"   },
  { id: 12, date: "2025-10-14", asset: "AXA",                              type: "Achat", qty: 2,      price: 39.51,   fees: 0.72, total: 79.74,       broker: "Trade Republic", assetType: "Actions",        ticker: "CS.PA"     },
  { id: 13, date: "2025-10-14", asset: "S&P 500 (Acc)",                    type: "Achat", qty: 4,      price: 28.756,  fees: 0.58, total: 115.604,     broker: "Trade Republic", assetType: "ETF",            ticker: "500.PA"    },
  { id: 14, date: "2025-10-14", asset: "Crédit Agricole",                  type: "Achat", qty: 1,      price: 16.44,   fees: 0.15, total: 16.59,       broker: "Trade Republic", assetType: "Actions",        ticker: "ACA.PA"    },
  { id: 15, date: "2025-10-14", asset: "Drone Volt Saca",                  type: "Achat", qty: 7,      price: 0.82,    fees: 0.03, total: 5.77,        broker: "Trade Republic", assetType: "Actions",        ticker: "ALDRV.PA"  },
  { id: 16, date: "2025-12-10", asset: "Renault",                          type: "Achat", qty: 2,      price: 35.63,   fees: 0.65, total: 71.91,       broker: "Trade Republic", assetType: "Actions",        ticker: "RNO.PA"    },
  { id: 17, date: "2025-12-10", asset: "Rexel",                            type: "Achat", qty: 4,      price: 32.97,   fees: 1.19, total: 133.07,      broker: "Trade Republic", assetType: "Actions",        ticker: "RXL.PA"    },
  { id: 18, date: "2025-12-10", asset: "STOXX Europe 600 Banks EUR (Acc)", type: "Achat", qty: 2,      price: 56.64,   fees: 0.57, total: 113.85,      broker: "Trade Republic", assetType: "ETF",            ticker: "EXV1.DE"   },
  { id: 19, date: "2025-12-10", asset: "MSCI World Swap PEA EUR (Acc)",    type: "Achat", qty: 10,     price: 6.102,   fees: 0.31, total: 61.33,       broker: "Trade Republic", assetType: "ETF",            ticker: "MWRD.PA"   },
  { id: 20, date: "2026-02-05", asset: "Vinci",                            type: "Achat", qty: 1,      price: 125.5,   fees: 1.13, total: 126.63,      broker: "Trade Republic", assetType: "Actions",        ticker: "DG.PA"     },
  { id: 21, date: "2026-02-05", asset: "Air Liquide",                      type: "Achat", qty: 1,      price: 167.78,  fees: 1.51, total: 169.29,      broker: "Trade Republic", assetType: "Actions",        ticker: "AI.PA"     },
  { id: 22, date: "2026-02-05", asset: "Bouygues",                         type: "Achat", qty: 2,      price: 46.71,   fees: 0.84, total: 94.26,       broker: "Trade Republic", assetType: "Actions",        ticker: "EN.PA"     },
  { id: 23, date: "2026-02-05", asset: "Banco Sabadell",                   type: "Achat", qty: 12,     price: 3.341,   fees: 0.28, total: 40.372,      broker: "Trade Republic", assetType: "Actions",        ticker: "SAB.MC"    },
  { id: 24, date: "2024-11-11", asset: "Turismo",                          type: "Achat", qty: 4.4927, price: 111.29,  fees: 0,    total: 499.992583,  broker: "Crowd Cube",     assetType: "Private Equity", ticker: ""          },
];

/* ────────────────── PORTFOLIO CALCULÉ DEPUIS LES TRANSACTIONS ────────────────── */
// Les transactions sont la SEULE source de vérité.
// buildPortfolio regroupe les achats/ventes par actif et calcule le PRU (prix moyen pondéré).
function buildPortfolio(transactions, currentPrices = {}) {
  const map = {};
  // Trier par date pour traiter dans l'ordre chronologique
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
  for (const t of sorted) {
    const key = t.asset;
    if (!map[key]) {
      map[key] = {
        id: key,
        name: t.asset,
        type: t.assetType,
        broker: t.broker,
        ticker: t.ticker || "",
        manualMode: t.manualMode || false,
        qty: 0,
        totalCost: 0,
      };
    }
    const entry = map[key];
    if (t.ticker) entry.ticker = t.ticker;
    if (t.manualMode) entry.manualMode = true;
    if (t.type === "Achat") {
      // PRU pondéré : on cumule coût et quantité
      entry.totalCost += t.qty * t.price;
      entry.qty       += t.qty;
    } else if (t.type === "Vente") {
      // À la vente, on retire les quantités en conservant le PRU actuel
      const pru = entry.qty > 0 ? entry.totalCost / entry.qty : 0;
      entry.qty       = Math.max(0, entry.qty - t.qty);
      entry.totalCost = entry.qty * pru;
    }
  }
  return Object.values(map)
    .filter(e => e.qty > 0.00001)
    .map(e => {
      const buyPrice     = e.qty > 0 ? e.totalCost / e.qty : 0;
      const currentPrice = currentPrices[e.name] ?? buyPrice;
      return { ...e, buyPrice, currentPrice };
    });
}

const TYPE_COLORS = {
  "Actions": "#3B82F6",
  "ETF": "#10B981",
  "Private Equity": "#F59E0B",
  "Crypto-monnaies": "#8B5CF6",
  "Immobilier": "#EF4444",
  "Obligations / Fonds": "#6B7280",
};

const fmt = (n, decimals = 2) =>
  new Intl.NumberFormat("fr-FR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n);
const fmtEur = (n) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
const fmtPct = (n) => `${n >= 0 ? "+" : ""}${fmt(n * 100, 2)}%`;

/* ────────────────── CALCULS ────────────────── */
function calcAsset(a) {
  const invested = a.qty * a.buyPrice;
  const value = a.qty * a.currentPrice;
  const pnl = value - invested;
  const perf = invested !== 0 ? pnl / invested : 0;
  return { ...a, invested, value, pnl, perf };
}

/* ────────────────── COMPOSANTS UI ────────────────── */
function KpiCard({ label, value, sub, positive }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16, padding: "20px 24px", backdropFilter: "blur(12px)",
    }}>
      <div style={{ fontSize: 12, color: "#6B7280", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: positive === undefined ? "#F9FAFB" : positive ? "#10B981" : "#EF4444", fontFamily: "'Syne', sans-serif" }}>{value}</div>
      {sub && <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function Badge({ type }) {
  const color = TYPE_COLORS[type] || "#6B7280";
  return (
    <span style={{
      background: color + "22", color: color, border: `1px solid ${color}44`,
      borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap"
    }}>{type}</span>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}>
      <div style={{
        background: "#111827", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20,
        padding: "clamp(16px, 4vw, 32px)", width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#F9FAFB", fontFamily: "'Syne', sans-serif" }}>{title}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#9CA3AF", fontSize: 24, cursor: "pointer" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", fontSize: 12, color: "#9CA3AF", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>}
      <input {...props} style={{
        width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 10, padding: "10px 14px", color: "#F9FAFB", fontSize: 14, outline: "none",
        fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
        ...props.style,
      }} />
    </div>
  );
}

function Select({ label, children, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", fontSize: 12, color: "#9CA3AF", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>}
      <select {...props} style={{
        width: "100%", background: "#1F2937", border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 10, padding: "10px 14px", color: "#F9FAFB", fontSize: 14, outline: "none",
        fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
        ...props.style,
      }}>{children}</select>
    </div>
  );
}

function Btn({ children, variant = "primary", ...props }) {
  const styles = {
    primary: { background: "linear-gradient(135deg,#3B82F6,#6366F1)", color: "#fff" },
    ghost: { background: "rgba(255,255,255,0.06)", color: "#D1D5DB", border: "1px solid rgba(255,255,255,0.1)" },
    danger: { background: "#EF444420", color: "#EF4444", border: "1px solid #EF444440" },
    success: { background: "#10B98120", color: "#10B981", border: "1px solid #10B98140" },
  };
  return (
    <button {...props} style={{
      padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14,
      ...styles[variant], ...props.style,
    }}>{children}</button>
  );
}

/* ────────────────── TABLEAU DE BORD ────────────────── */
function Dashboard({ portfolio, transactions, historique, depenses, revenus, livrets, objectifs }) {
  const assets        = portfolio.map(calcAsset);
  const totalBourse   = assets.reduce((s, a) => s + a.value, 0);
  const totalInvested = assets.reduce((s, a) => s + a.invested, 0);
  const totalPnL      = totalBourse - totalInvested;
  const globalPerf    = totalInvested > 0 ? totalPnL / totalInvested : 0;
  const totalLivrets  = livrets.reduce((s, l) => s + parseFloat(l.solde || 0), 0);
  const totalPatrimoine = totalBourse + totalLivrets;

  // Budget ce mois
  const now   = new Date();
  const month = now.toISOString().slice(0, 7);
  const depMois = depenses.filter(d => d.date.slice(0, 7) === month).reduce((s, d) => s + d.montant, 0);
  const revMois = revenus.filter(r => r.date.slice(0, 7) === month).reduce((s, r) => s + r.montant, 0);
  const soldeMois = revMois - depMois;

  // Objectifs
  const objAtteints = objectifs.filter(o => parseFloat(o.actuel) >= parseFloat(o.cible)).length;
  const objTotal    = objectifs.length;
  const pctObjGlobal = objTotal > 0
    ? (objectifs.reduce((s, o) => s + Math.min(parseFloat(o.actuel || 0) / parseFloat(o.cible || 1), 1), 0) / objTotal) * 100
    : 0;

  // Top performers & worst
  const top3  = [...assets].sort((a, b) => b.perf - a.perf).slice(0, 3);
  const worst = [...assets].sort((a, b) => a.perf - b.perf).slice(0, 1)[0];

  // Graphique évolution
  const investiCumulData = (() => {
    const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
    let cumul = 0;
    const pts = sorted.map(t => {
      cumul += t.type === "Achat" ? t.total : -t.total;
      return { date: t.date, investi: Math.round(cumul * 100) / 100 };
    });
    const merged = {};
    pts.forEach(p => { merged[p.date] = { ...merged[p.date], date: p.date, investi: p.investi }; });
    historique.forEach(h => { merged[h.date] = { ...merged[h.date], date: h.date, valeur: h.valeur, investi: h.investi || merged[h.date]?.investi }; });
    return Object.values(merged).sort((a, b) => a.date.localeCompare(b.date)).map(p => ({
      ...p, dateLabel: new Date(p.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
    }));
  })();
  const hasValeurData = investiCumulData.some(p => p.valeur);

  // Dépenses par catégorie ce mois (top 4)
  const depParCat = depenses.filter(d => d.date.slice(0, 7) === month).reduce((acc, d) => {
    acc[d.categorie] = (acc[d.categorie] || 0) + d.montant;
    return acc;
  }, {});
  const topCats = Object.entries(depParCat).sort((a, b) => b[1] - a[1]).slice(0, 4);

  // Snapshot historique
  const latestSnapshot = historique.length > 0 ? historique[historique.length - 1] : null;
  const firstSnapshot  = historique.length > 1 ? historique[0] : null;
  const evol = latestSnapshot && firstSnapshot ? latestSnapshot.valeur - firstSnapshot.valeur : null;

  const S = { card: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 } };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── HERO : patrimoine total ── */}
      <div style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(99,102,241,0.08) 100%)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 20, padding: "28px 32px" }}>
        <div style={{ fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Patrimoine total</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 48, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-1px", marginBottom: 4 }}>
          {fmtEur(totalPatrimoine)}
        </div>
        <div style={{ display: "flex", gap: 32, marginTop: 16, flexWrap: "wrap" }}>
          {[
            { label: "Bourse",     value: fmtEur(totalBourse),  sub: `${assets.length} positions`,          color: "#60A5FA" },
            { label: "Livrets",    value: fmtEur(totalLivrets), sub: `${livrets.length} compte(s)`,          color: "#34D399" },
            { label: "Plus-value", value: `${totalPnL >= 0 ? "+" : ""}${fmtEur(totalPnL)}`, sub: `${globalPerf >= 0 ? "+" : ""}${(globalPerf * 100).toFixed(2)}%`, color: totalPnL >= 0 ? "#34D399" : "#F87171" },
            { label: "Ce mois",    value: `${soldeMois >= 0 ? "+" : ""}${fmtEur(soldeMois)}`, sub: revMois > 0 ? `${fmtEur(revMois)} revenus` : "Aucun revenu saisi", color: soldeMois >= 0 ? "#A78BFA" : "#F87171" },
          ].map(k => (
            <div key={k.label}>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>{k.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: k.color, fontFamily: "'Syne', sans-serif" }}>{k.value}</div>
              <div style={{ fontSize: 11, color: "#4B5563" }}>{k.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── LIGNE 1 : graphique + objectifs ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>

        {/* Graphique évolution */}
        <div style={S.card}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 600, color: "#F9FAFB", marginBottom: 16 }}>📈 Évolution du portefeuille</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={investiCumulData} margin={{ left: 0, right: 10 }}>
              <XAxis dataKey="dateLabel" tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(1)}k€`} />
              <Tooltip contentStyle={{ background: "#1F2937", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#F9FAFB", fontSize: 12 }} formatter={(v, n) => [fmtEur(v), n === "valeur" ? "Valeur de marché" : "Montant investi"]} />
              <Legend formatter={v => v === "valeur" ? "Valeur de marché" : "Montant investi"} wrapperStyle={{ fontSize: 11, color: "#6B7280" }} />
              <Line type="monotone" dataKey="investi" stroke="#6366F1" strokeWidth={2} dot={false} strokeDasharray="5 5" connectNulls />
              {hasValeurData && <Line type="monotone" dataKey="valeur" stroke="#10B981" strokeWidth={2.5} dot={false} connectNulls />}
            </LineChart>
          </ResponsiveContainer>
          {evol !== null && (
            <div style={{ marginTop: 12, fontSize: 13, color: evol >= 0 ? "#10B981" : "#EF4444", textAlign: "right" }}>
              {evol >= 0 ? "▲" : "▼"} {evol >= 0 ? "+" : ""}{fmtEur(evol)} depuis le {new Date(firstSnapshot.date).toLocaleDateString("fr-FR")}
            </div>
          )}
        </div>

        {/* Objectifs */}
        <div style={S.card}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 600, color: "#F9FAFB", marginBottom: 16 }}>🎯 Objectifs</div>
          {objTotal === 0 ? (
            <div style={{ color: "#6B7280", fontSize: 13, textAlign: "center", padding: "20px 0" }}>Aucun objectif défini</div>
          ) : (
            <>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: "#F9FAFB", fontFamily: "'Syne', sans-serif" }}>{objAtteints}<span style={{ fontSize: 18, color: "#6B7280" }}>/{objTotal}</span></div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>objectifs atteints</div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "#9CA3AF" }}>Progression globale</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#A78BFA" }}>{pctObjGlobal.toFixed(0)}%</span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
                  <div style={{ height: "100%", width: `${pctObjGlobal}%`, background: "linear-gradient(90deg,#8B5CF6,#A78BFA)", borderRadius: 3, transition: "width 0.6s" }} />
                </div>
              </div>
              {objectifs.slice(0, 3).map(o => {
                const pct = Math.min((parseFloat(o.actuel || 0) / parseFloat(o.cible || 1)) * 100, 100);
                const type = [
                  { id: "urgence", emoji: "🛡️", color: "#EF4444" }, { id: "voiture", emoji: "🚗", color: "#F59E0B" },
                  { id: "voyage", emoji: "✈️", color: "#3B82F6" }, { id: "immo", emoji: "🏠", color: "#8B5CF6" },
                  { id: "retraite", emoji: "🌅", color: "#10B981" }, { id: "etudes", emoji: "🎓", color: "#06B6D4" },
                  { id: "projet", emoji: "💡", color: "#F97316" }, { id: "autre", emoji: "🎯", color: "#6B7280" },
                ].find(t => t.id === o.type) || { emoji: "🎯", color: "#6B7280" };
                return (
                  <div key={o.id} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "#D1D5DB" }}>{type.emoji} {o.nom || o.type}</span>
                      <span style={{ fontSize: 11, color: type.color }}>{pct.toFixed(0)}%</span>
                    </div>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: type.color, borderRadius: 2 }} />
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* ── LIGNE 2 : budget mois + top performances + livrets ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>

        {/* Budget ce mois */}
        <div style={S.card}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 600, color: "#F9FAFB", marginBottom: 16 }}>💳 Ce mois-ci</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Revenus</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#34D399" }}>{fmtEur(revMois)}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Dépenses</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#F87171" }}>{fmtEur(depMois)}</div>
            </div>
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 12 }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: "#9CA3AF" }}>Solde</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: soldeMois >= 0 ? "#34D399" : "#F87171" }}>
              {soldeMois >= 0 ? "+" : ""}{fmtEur(soldeMois)}
            </span>
          </div>
          {topCats.length > 0 && (
            <div>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 8 }}>Top dépenses</div>
              {topCats.map(([cat, val]) => (
                <div key={cat} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "#9CA3AF" }}>{cat}</span>
                  <span style={{ fontSize: 12, color: "#F9FAFB", fontWeight: 600 }}>{fmtEur(val)}</span>
                </div>
              ))}
            </div>
          )}
          {topCats.length === 0 && <div style={{ fontSize: 12, color: "#6B7280", textAlign: "center", padding: "8px 0" }}>Aucune dépense ce mois</div>}
        </div>

        {/* Top performances */}
        <div style={S.card}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 600, color: "#F9FAFB", marginBottom: 16 }}>🏆 Meilleures performances</div>
          {top3.map((a, i) => (
            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: ["#F59E0B20","#9CA3AF20","#CD7F3220"][i], border: `1px solid ${["#F59E0B","#9CA3AF","#CD7F32"][i]}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: ["#F59E0B","#9CA3AF","#CD7F32"][i] }}>
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontSize: 13, color: "#F9FAFB", fontWeight: 500 }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: "#6B7280" }}>{fmtEur(a.value)}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: a.perf >= 0 ? "#34D399" : "#F87171" }}>{a.perf >= 0 ? "+" : ""}{(a.perf * 100).toFixed(1)}%</div>
                <div style={{ fontSize: 11, color: "#6B7280" }}>{a.pnl >= 0 ? "+" : ""}{fmtEur(a.pnl)}</div>
              </div>
            </div>
          ))}
          {worst && (
            <>
              <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "8px 0" }} />
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 8 }}>À surveiller</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "#9CA3AF" }}>{worst.name}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#F87171" }}>{worst.perf >= 0 ? "+" : ""}{(worst.perf * 100).toFixed(1)}%</span>
              </div>
            </>
          )}
        </div>

        {/* Livrets */}
        <div style={S.card}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 600, color: "#F9FAFB", marginBottom: 16 }}>🏦 Livrets d'épargne</div>
          {livrets.length === 0 ? (
            <div style={{ color: "#6B7280", fontSize: 13, textAlign: "center", padding: "20px 0" }}>Aucun livret ajouté</div>
          ) : (
            <>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#34D399", fontFamily: "'Syne', sans-serif", marginBottom: 4 }}>{fmtEur(totalLivrets)}</div>
              <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 16 }}>
                Intérêts annuels : <strong style={{ color: "#10B981" }}>+{fmtEur(livrets.reduce((s, l) => s + parseFloat(l.solde || 0) * (parseFloat(l.taux || 0) / 100), 0))}</strong>
              </div>
              {livrets.slice(0, 4).map(l => {
                const type = [
                  { id: "livret_a", color: "#10B981" }, { id: "ldds", color: "#3B82F6" }, { id: "pel", color: "#8B5CF6" },
                  { id: "lep", color: "#EF4444" }, { id: "livret_jeune", color: "#F59E0B" },
                ].find(t => t.id === l.type) || { color: "#6B7280" };
                return (
                  <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 12, color: "#D1D5DB" }}>{l.nom || l.type}</div>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>{l.taux}%/an</div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: type.color }}>{fmtEur(parseFloat(l.solde))}</span>
                  </div>
                );
              })}
              {livrets.length > 4 && <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>+{livrets.length - 4} autre(s)</div>}
            </>
          )}
        </div>
      </div>

    </div>
  );
}

/* ────────────────── HOOK MISE À JOUR PRIX (Yahoo Finance, sans clé API) ────────────────── */
async function fetchYahooPrice(ticker) {
  // Proxy Vercel pour éviter les erreurs CORS
  const res = await fetch(`/api/price?ticker=${encodeURIComponent(ticker)}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  if (!data.price || data.price <= 0) throw new Error("Ticker introuvable");
  return data.price;
}

function isMarketOpen() {
  // Marchés européens : lun-ven 9h-17h30 CET
  const now = new Date();
  const day = now.getDay(); // 0=dim, 6=sam
  if (day === 0 || day === 6) return false;
  const hour = now.getHours();
  const min  = now.getMinutes();
  const t = hour * 60 + min;
  return t >= 9 * 60 && t <= 17 * 60 + 30;
}

function usePriceRefresh(portfolio, setCurrentPrices) {
  const [refreshing, setRefreshing] = useState(false);
  const [loadingIds, setLoadingIds] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [errors, setErrors]         = useState({});
  const [autoStatus, setAutoStatus] = useState("idle");

  // Stocker portfolio dans un ref pour éviter que refreshAll change à chaque render
  const portfolioRef = useRef(portfolio);
  useEffect(() => { portfolioRef.current = portfolio; });

  const refreshAll = useCallback(async (silent = false) => {
    const withTicker = portfolioRef.current.filter(a => a.ticker);
    if (withTicker.length === 0) return;
    if (!silent) setRefreshing(true);
    setAutoStatus("refreshing");
    setLoadingIds(withTicker.map(a => a.id));
    setErrors({});
    const newErrors = {};
    for (const asset of withTicker) {
      try {
        const price = await fetchYahooPrice(asset.ticker);
        setCurrentPrices(p => ({ ...p, [asset.name]: price }));
      } catch (e) {
        newErrors[asset.id] = e.message || "Erreur";
      }
      setLoadingIds(ids => ids.filter(id => id !== asset.id));
      await new Promise(r => setTimeout(r, 300));
    }
    setErrors(newErrors);
    setLastUpdate(new Date());
    setAutoStatus(Object.keys(newErrors).length > 0 ? "error" : "done");
    if (!silent) setRefreshing(false);
  }, [setCurrentPrices]); // ← plus de dépendance sur portfolio

  const refreshOne = useCallback(async (asset) => {
    if (!asset.ticker) return;
    setLoadingIds(ids => [...ids, asset.id]);
    try {
      const price = await fetchYahooPrice(asset.ticker);
      setCurrentPrices(p => ({ ...p, [asset.name]: price }));
      setErrors(e => { const n = { ...e }; delete n[asset.id]; return n; });
    } catch (err) {
      setErrors(e => ({ ...e, [asset.id]: err.message || "Erreur" }));
    }
    setLoadingIds(ids => ids.filter(id => id !== asset.id));
    setLastUpdate(new Date());
  }, [setCurrentPrices]);

  // Auto-refresh au démarrage — une seule fois
  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) return;
    didMount.current = true;
    const timer = setTimeout(() => refreshAll(true), 2000);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line

  // Auto-refresh périodique — stable car refreshAll ne change plus
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAll(true);
    }, isMarketOpen() ? 5 * 60 * 1000 : 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshAll]);

  return { refreshing, loadingIds, lastUpdate, errors, autoStatus, refreshAll, refreshOne };
}

/* ────────────────── PORTEFEUILLE ────────────────── */
function Portfolio({ portfolio, setCurrentPrices, refreshAll, refreshOne, loadingIds, errors, refreshing, lastUpdate }) {
  const [sortKey, setSortKey]         = useState("value");
  const [manualModal, setManualModal] = useState(null); // { name, currentPrice }
  const [manualInput, setManualInput] = useState("");

  const assets = portfolio.map(calcAsset);
  const sorted = [...assets].sort((a, b) => {
    if (sortKey === "value") return b.value - a.value;
    if (sortKey === "perf") return b.perf - a.perf;
    if (sortKey === "pnl") return b.pnl - a.pnl;
    return a.name.localeCompare(b.name);
  });

  const totalValue    = assets.reduce((s, a) => s + a.value, 0);
  const totalInvested = assets.reduce((s, a) => s + a.invested, 0);
  const totalPnL      = totalValue - totalInvested;

  const openManual = (a) => {
    setManualModal(a);
    setManualInput(String(a.currentPrice));
  };

  const saveManual = () => {
    const price = parseFloat(manualInput);
    if (!isNaN(price) && price > 0) {
      setCurrentPrices(p => ({ ...p, [manualModal.name]: price }));
    }
    setManualModal(null);
  };

  return (
    <div>
      {/* En-tête */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "#F9FAFB" }}>Portefeuille</h2>
          <p style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
            📋 Calculé automatiquement depuis vos transactions — ajoutez vos opérations dans l'onglet <strong style={{ color: "#9CA3AF" }}>Transactions</strong>
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Select label="" value={sortKey} onChange={e => setSortKey(e.target.value)} style={{ marginBottom: 0, width: 160 }}>
            <option value="value">Trier: Valeur</option>
            <option value="perf">Trier: Performance</option>
            <option value="pnl">Trier: Plus-value</option>
            <option value="name">Trier: Nom</option>
          </Select>
          <Btn variant="success" onClick={refreshAll} style={{ padding: "10px 16px", opacity: refreshing ? 0.6 : 1 }}>
            {refreshing ? "⏳ Actualisation..." : "🔄 Actualiser les prix"}
          </Btn>
        </div>
      </div>

      {/* Bandeau statut */}
      {lastUpdate && (
        <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 12 }}>
          ✅ Dernière mise à jour : {lastUpdate.toLocaleTimeString("fr-FR")} — via Yahoo Finance
          {Object.keys(errors).length > 0 && <span style={{ color: "#F59E0B", marginLeft: 12 }}>⚠️ {Object.keys(errors).length} ticker(s) en erreur</span>}
        </div>
      )}

      {/* Tableau */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px" }}>
          <thead>
            <tr>
              {["Actif", "Mode", "Type", "Qté", "PRU", "Prix actuel", "Valeur", "P&L", "Perf.", ""].map(h => (
                <th key={h} style={{ padding: "8px 12px", fontSize: 11, color: "#6B7280", textAlign: "left", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map(a => {
              const isLoading = loadingIds.includes(a.id);
              const hasError  = errors[a.id];
              const isManual  = !a.ticker || a.manualMode;
              return (
                <tr key={a.id} style={{ background: "rgba(255,255,255,0.03)", opacity: isLoading ? 0.6 : 1, transition: "opacity 0.3s" }}>
                  <td style={{ padding: "14px 12px", borderRadius: "12px 0 0 12px", color: "#F9FAFB", fontWeight: 500, whiteSpace: "nowrap" }}>{a.name}</td>

                  {/* Mode : auto (ticker) ou manuel */}
                  <td style={{ padding: "14px 12px" }}>
                    {isManual ? (
                      <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 20, background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", color: "#A78BFA", whiteSpace: "nowrap" }}>
                        ✍️ Manuel
                      </span>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: hasError ? "#F59E0B" : "#60A5FA", background: hasError ? "#F59E0B15" : "#3B82F615", padding: "2px 7px", borderRadius: 6 }}>{a.ticker}</span>
                        {hasError && <span title={hasError} style={{ fontSize: 11, color: "#F59E0B" }}>⚠️</span>}
                        {!isLoading && <button onClick={() => refreshOne(a)} title="Rafraîchir" style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 12, padding: 0 }}>🔄</button>}
                        {isLoading && <span style={{ fontSize: 11, color: "#6B7280" }}>⏳</span>}
                      </div>
                    )}
                  </td>

                  <td style={{ padding: "14px 12px" }}><Badge type={a.type} /></td>
                  <td style={{ padding: "14px 12px", color: "#D1D5DB" }}>{fmt(a.qty, a.qty % 1 === 0 ? 0 : 4)}</td>
                  <td style={{ padding: "14px 12px", color: "#9CA3AF" }}>{fmtEur(a.buyPrice)}</td>

                  {/* Prix actuel — cliquable pour saisie manuelle */}
                  <td style={{ padding: "14px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: "#D1D5DB", fontWeight: 500 }}>
                        {isLoading ? <span style={{ color: "#6B7280" }}>...</span> : fmtEur(a.currentPrice)}
                      </span>
                      <button
                        onClick={() => openManual(a)}
                        title={isManual ? "Mettre à jour le prix" : "Saisir un prix manuel (override)"}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: isManual ? "#A78BFA" : "#4B5563", padding: 0, opacity: 0.8 }}
                      >
                        ✏️
                      </button>
                    </div>
                  </td>

                  <td style={{ padding: "14px 12px", color: "#F9FAFB", fontWeight: 600 }}>{fmtEur(a.value)}</td>
                  <td style={{ padding: "14px 12px", color: a.pnl >= 0 ? "#10B981" : "#EF4444", fontWeight: 600 }}>{a.pnl >= 0 ? "+" : ""}{fmtEur(a.pnl)}</td>
                  <td style={{ padding: "14px 12px", borderRadius: "0 12px 12px 0", color: a.perf >= 0 ? "#10B981" : "#EF4444", fontWeight: 700 }}>{fmtPct(a.perf)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal saisie manuelle */}
      {manualModal && (
        <Modal title={`✍️ Prix manuel — ${manualModal.name}`} onClose={() => setManualModal(null)}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>PRU (prix de revient)</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#9CA3AF" }}>{fmtEur(manualModal.buyPrice)}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Prix actuel en base</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#D1D5DB" }}>{fmtEur(manualModal.currentPrice)}</div>
              </div>
            </div>
            {!manualModal.ticker && (
              <div style={{ padding: "10px 14px", background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 10, fontSize: 12, color: "#A78BFA", marginBottom: 16 }}>
                ✍️ Actif en mode manuel — aucun ticker Yahoo configuré. Saisissez la valorisation actuelle.
              </div>
            )}
            {manualModal.ticker && (
              <div style={{ padding: "10px 14px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 10, fontSize: 12, color: "#F59E0B", marginBottom: 16 }}>
                ⚠️ Cet actif a un ticker ({manualModal.ticker}). Le prix saisi remplacera temporairement le cours Yahoo jusqu'à la prochaine actualisation.
              </div>
            )}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, color: "#9CA3AF", display: "block", marginBottom: 8 }}>Nouveau prix / valorisation (€)</label>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                type="number"
                step="0.01"
                value={manualInput}
                onChange={e => setManualInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && saveManual()}
                autoFocus
                style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "12px 16px", color: "#F9FAFB", fontSize: 18, fontWeight: 700, outline: "none", textAlign: "right" }}
              />
              <span style={{ fontSize: 16, color: "#6B7280" }}>€</span>
            </div>
          </div>

          {/* Aperçu de l'impact */}
          {manualInput && !isNaN(parseFloat(manualInput)) && (
            <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 10, marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>Aperçu après mise à jour</div>
              {(() => {
                const newPrice  = parseFloat(manualInput);
                const newValue  = newPrice * manualModal.qty;
                const newPnl    = newValue - manualModal.invested;
                const newPerf   = manualModal.invested > 0 ? newPnl / manualModal.invested : 0;
                return (
                  <div style={{ display: "flex", gap: 24 }}>
                    <div>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>Valeur position</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#F9FAFB" }}>{fmtEur(newValue)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>Plus-value</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: newPnl >= 0 ? "#10B981" : "#EF4444" }}>{newPnl >= 0 ? "+" : ""}{fmtEur(newPnl)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>Performance</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: newPerf >= 0 ? "#10B981" : "#EF4444" }}>{newPerf >= 0 ? "+" : ""}{(newPerf * 100).toFixed(2)}%</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          <div style={{ display: "flex", gap: 12 }}>
            <Btn variant="ghost" onClick={() => setManualModal(null)} style={{ flex: 1 }}>Annuler</Btn>
            <Btn onClick={saveManual} style={{ flex: 1 }} disabled={!manualInput || isNaN(parseFloat(manualInput))}>
              Enregistrer le prix
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ────────────────── TRANSACTIONS ────────────────── */
function Transactions({ transactions, setTransactions }) {
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [form, setForm] = useState({ date: "", asset: "", type: "Achat", qty: "", price: "", fees: "", broker: "Trade Republic", assetType: "Actions", ticker: "", manualMode: false });

  // Suggestions d'actifs déjà connus (nom + ticker + manualMode auto-remplis)
  const knownAssets = Object.values(
    transactions.reduce((acc, t) => {
      if (!acc[t.asset]) acc[t.asset] = { name: t.asset, ticker: t.ticker || "", assetType: t.assetType, broker: t.broker, manualMode: t.manualMode || false };
      if (t.ticker) acc[t.asset].ticker = t.ticker;
      if (t.manualMode) acc[t.asset].manualMode = true;
      return acc;
    }, {})
  );

  const handleAssetChange = (name) => {
    const known = knownAssets.find(a => a.name === name);
    if (known) {
      setForm(f => ({ ...f, asset: name, ticker: known.ticker, assetType: known.assetType, broker: known.broker, manualMode: known.manualMode }));
    } else {
      setForm(f => ({ ...f, asset: name }));
    }
  };

  const openAdd = () => {
    setEditItem(null);
    setForm({ date: new Date().toISOString().slice(0, 10), asset: "", type: "Achat", qty: "", price: "", fees: "", broker: "Trade Republic", assetType: "Actions", ticker: "", manualMode: false });
    setShowModal(true);
  };

  const openEdit = (t) => {
    setEditItem(t);
    setForm({ date: t.date, asset: t.asset, type: t.type, qty: String(t.qty), price: String(t.price), fees: String(t.fees || ""), broker: t.broker, assetType: t.assetType, ticker: t.ticker || "", manualMode: t.manualMode || false });
    setShowModal(true);
  };

  const save = () => {
    if (editItem) {
      const newTicker     = form.manualMode ? "" : form.ticker.toUpperCase();
      const newManualMode = form.manualMode;
      const tickerChanged = newTicker !== (editItem.ticker || "") || newManualMode !== (editItem.manualMode || false);
      setTransactions(ts => ts.map(t => {
        if (t.id === editItem.id) {
          const total = parseFloat(form.qty) * parseFloat(form.price) + parseFloat(form.fees || 0);
          return { ...t, date: form.date, asset: form.asset, type: form.type, qty: parseFloat(form.qty), price: parseFloat(form.price), fees: parseFloat(form.fees || 0), total, broker: form.broker, assetType: form.assetType, ticker: newTicker, manualMode: newManualMode };
        }
        // Propager ticker et manualMode à toutes les transactions du même actif
        if (tickerChanged && t.asset === editItem.asset) {
          return { ...t, ticker: newTicker, manualMode: newManualMode };
        }
        return t;
      }));
    } else {
      const total = parseFloat(form.qty) * parseFloat(form.price) + parseFloat(form.fees || 0);
      const newTicker = form.manualMode ? "" : form.ticker.toUpperCase();
      setTransactions(ts => [...ts, { ...form, id: Date.now(), qty: parseFloat(form.qty), price: parseFloat(form.price), fees: parseFloat(form.fees || 0), total, ticker: newTicker, manualMode: form.manualMode }]);
    }
    setShowModal(false);
  };

  const del = (id) => setTransactions(t => t.filter(x => x.id !== id));

  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));
  const totalAchats = transactions.filter(t => t.type === "Achat").reduce((s, t) => s + t.total, 0);
  const totalVentes = transactions.filter(t => t.type === "Vente").reduce((s, t) => s + t.total, 0);
  const totalFees   = transactions.reduce((s, t) => s + (t.fees || 0), 0);

  // N'alerter QUE les actifs sans ticker ET sans manualMode
  const assetsSansTicker = knownAssets.filter(a => !a.ticker && !a.manualMode);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "#F9FAFB" }}>Transactions</h2>
          <p style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
            ✅ Chaque transaction met à jour <strong style={{ color: "#9CA3AF" }}>automatiquement</strong> votre portefeuille
          </p>
        </div>
        <Btn onClick={openAdd}>+ Nouvelle transaction</Btn>
      </div>

      {/* Alerte actifs sans ticker */}
      {assetsSansTicker.length > 0 && (
        <div style={{ marginBottom: 20, padding: "12px 16px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 12, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: "#F59E0B" }}>⚠️ {assetsSansTicker.length} actif(s) sans ticker Yahoo — les prix ne seront pas mis à jour automatiquement :</span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {assetsSansTicker.map(a => (
              <button key={a.name} onClick={() => openEdit(transactions.find(t => t.asset === a.name))}
                style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#F59E0B", cursor: "pointer" }}>
                ✏️ {a.name}
              </button>
            ))}
          </div>
        </div>
      )}


      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, marginBottom: 24 }}>
        <KpiCard label="Total achats" value={fmtEur(totalAchats)} sub={`${transactions.filter(t => t.type === "Achat").length} opérations`} />
        <KpiCard label="Total ventes" value={fmtEur(totalVentes)} sub={`${transactions.filter(t => t.type === "Vente").length} opérations`} />
        <KpiCard label="Total frais" value={fmtEur(transactions.reduce((s, t) => s + (t.fees || 0), 0))} sub="Tous courtiers" />
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 6px" }}>
          <thead>
            <tr>
              {["Date", "Actif", "Ticker", "Type", "Catégorie", "Qté", "Prix unit.", "Frais", "Total", "Broker", ""].map(h => (
                <th key={h} style={{ padding: "8px 12px", fontSize: 11, color: "#6B7280", textAlign: "left", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map(t => (
              <tr key={t.id} style={{ background: "rgba(255,255,255,0.03)" }}>
                <td style={{ padding: "12px 12px", borderRadius: "12px 0 0 12px", color: "#9CA3AF", fontSize: 13 }}>{t.date}</td>
                <td style={{ padding: "12px 12px", color: "#F9FAFB", fontWeight: 500 }}>{t.asset}</td>
                <td style={{ padding: "12px 12px" }}>
                  {t.manualMode
                    ? <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", color: "#A78BFA" }}>✍️ Manuel</span>
                    : t.ticker
                      ? <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#60A5FA", background: "#3B82F615", padding: "2px 8px", borderRadius: 6 }}>{t.ticker}</span>
                      : <span style={{ fontSize: 12, color: "#EF4444", fontStyle: "italic" }}>— manquant</span>
                  }
                </td>
                <td style={{ padding: "12px 12px" }}>
                  <span style={{ color: t.type === "Achat" ? "#3B82F6" : "#EF4444", fontWeight: 600, fontSize: 13 }}>{t.type}</span>
                </td>
                <td style={{ padding: "12px 12px" }}><Badge type={t.assetType} /></td>
                <td style={{ padding: "12px 12px", color: "#D1D5DB" }}>{fmt(t.qty, 4)}</td>
                <td style={{ padding: "12px 12px", color: "#D1D5DB" }}>{fmtEur(t.price)}</td>
                <td style={{ padding: "12px 12px", color: "#EF4444", fontSize: 13 }}>{fmtEur(t.fees || 0)}</td>
                <td style={{ padding: "12px 12px", color: "#F9FAFB", fontWeight: 600 }}>{fmtEur(t.total)}</td>
                <td style={{ padding: "12px 12px", color: "#9CA3AF", fontSize: 13 }}>{t.broker}</td>
                <td style={{ padding: "12px 12px", borderRadius: "0 12px 12px 0", whiteSpace: "nowrap" }}>
                  <button onClick={() => openEdit(t)} title="Modifier" style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 15, marginRight: 6 }}>✏️</button>
                  <button onClick={() => del(t.id)} title="Supprimer" style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: 15 }}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title={editItem ? `Modifier — ${editItem.asset}` : "Nouvelle transaction"} onClose={() => setShowModal(false)}>
          <Input label="Date" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />

          {/* Nom actif avec suggestions */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: "#9CA3AF", display: "block", marginBottom: 6 }}>Nom de l'actif</label>
            <input
              list="asset-suggestions"
              value={form.asset}
              onChange={e => handleAssetChange(e.target.value)}
              placeholder="ex: Air Liquide, S&P 500 (Acc)..."
              style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px", color: "#F9FAFB", fontSize: 14, outline: "none" }}
            />
            <datalist id="asset-suggestions">
              {knownAssets.map(a => <option key={a.name} value={a.name} />)}
            </datalist>
          </div>

          <Select label="Type d'opération" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
            <option>Achat</option><option>Vente</option>
          </Select>
          <Select label="Catégorie" value={form.assetType} onChange={e => setForm(f => ({ ...f, assetType: e.target.value }))}>
            {Object.keys(TYPE_COLORS).map(t => <option key={t}>{t}</option>)}
          </Select>

          {/* Ticker + option mode manuel */}
          <div style={{
            padding: "14px 16px",
            background: form.manualMode ? "rgba(139,92,246,0.06)" : (editItem && !editItem.ticker && !editItem.manualMode ? "rgba(245,158,11,0.08)" : "rgba(59,130,246,0.06)"),
            border: `1px solid ${form.manualMode ? "rgba(139,92,246,0.25)" : (editItem && !editItem.ticker && !editItem.manualMode ? "rgba(245,158,11,0.3)" : "rgba(59,130,246,0.2)")}`,
            borderRadius: 12, marginBottom: 16
          }}>
            <label style={{ fontSize: 13, color: "#9CA3AF", display: "block", marginBottom: 8 }}>
              🏷️ Ticker Yahoo Finance
              {editItem && !editItem.ticker && !editItem.manualMode && <span style={{ color: "#F59E0B" }}> — manquant !</span>}
              {form.manualMode && <span style={{ color: "#A78BFA" }}> — mode manuel activé</span>}
            </label>

            {/* Champ ticker — grisé si mode manuel */}
            <input
              value={form.ticker}
              onChange={e => setForm(f => ({ ...f, ticker: e.target.value.toUpperCase() }))}
              disabled={form.manualMode}
              placeholder={form.manualMode ? "Désactivé (mode manuel)" : "ex: AI.PA, RNO.PA, AAPL..."}
              style={{ width: "100%", fontFamily: "'DM Mono', monospace", fontSize: 14, background: form.manualMode ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px", color: form.manualMode ? "#4B5563" : "#60A5FA", outline: "none", cursor: form.manualMode ? "not-allowed" : "text" }}
            />

            {!form.manualMode && (
              <div style={{ fontSize: 11, color: "#6B7280", marginTop: 8, lineHeight: 1.6 }}>
                Chercher sur <strong style={{ color: "#60A5FA" }}>finance.yahoo.com</strong>&nbsp;·&nbsp;
                Paris: <code style={{ color: "#9CA3AF" }}>NOM.PA</code>&nbsp;·&nbsp;
                Madrid: <code style={{ color: "#9CA3AF" }}>NOM.MC</code>&nbsp;·&nbsp;
                US: <code style={{ color: "#9CA3AF" }}>NOM</code>
              </div>
            )}

            {/* Case à cocher mode manuel */}
            <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, cursor: "pointer", userSelect: "none" }}>
              <input
                type="checkbox"
                checked={form.manualMode}
                onChange={e => setForm(f => ({ ...f, manualMode: e.target.checked, ticker: e.target.checked ? "" : f.ticker }))}
                style={{ width: 16, height: 16, accentColor: "#A78BFA", cursor: "pointer" }}
              />
              <div>
                <span style={{ fontSize: 13, color: form.manualMode ? "#A78BFA" : "#9CA3AF", fontWeight: form.manualMode ? 600 : 400 }}>
                  ✍️ Prix manuel — pas de ticker Yahoo
                </span>
                <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>
                  {form.manualMode
                    ? "Le prix sera mis à jour manuellement depuis la page Portefeuille. Aucune alerte ne sera affichée."
                    : "Cocher pour les actifs sans cotation : Private Equity, SCPI, crypto hors liste..."}
                </div>
              </div>
            </label>

            {editItem && !form.manualMode && form.ticker && form.ticker !== (editItem.ticker || "") && (
              <div style={{ fontSize: 11, color: "#10B981", marginTop: 8 }}>
                ✅ Le ticker sera propagé sur toutes les transactions de {editItem.asset}
              </div>
            )}
            {editItem && form.manualMode && !(editItem.manualMode) && (
              <div style={{ fontSize: 11, color: "#A78BFA", marginTop: 8 }}>
                ✍️ Le mode manuel sera appliqué à toutes les transactions de {editItem.asset}
              </div>
            )}
          </div>

          <Input label="Quantité" type="number" value={form.qty} onChange={e => setForm(f => ({ ...f, qty: e.target.value }))} />
          <Input label="Prix unitaire (€)" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
          <Input label="Frais (€)" type="number" value={form.fees} onChange={e => setForm(f => ({ ...f, fees: e.target.value }))} placeholder="0" />

          {/* Aperçu du total */}
          {form.qty && form.price && (
            <div style={{ padding: "12px 16px", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 10, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "#9CA3AF" }}>Total de l'opération</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: form.type === "Achat" ? "#60A5FA" : "#34D399" }}>
                  {fmtEur(parseFloat(form.qty) * parseFloat(form.price) + parseFloat(form.fees || 0))}
                </span>
              </div>
            </div>
          )}

          <Input label="Broker / Plateforme" value={form.broker} onChange={e => setForm(f => ({ ...f, broker: e.target.value }))} />
          <div style={{ display: "flex", gap: 12 }}>
            <Btn variant="ghost" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Annuler</Btn>
            <Btn onClick={save} style={{ flex: 1 }} disabled={!form.asset || !form.qty || !form.price}>
              {editItem ? "Enregistrer les modifications" : "Ajouter la transaction"}
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ────────────────── RECOMMANDATIONS IA ────────────────── */
function Recommendations({ portfolio, depenses, revenus, livrets, objectifs }) {
  const [objective, setObjective] = useState("croissance");
  const [horizon, setHorizon]     = useState("5");
  const [risk, setRisk]           = useState("modéré");
  const [analyzed, setAnalyzed]   = useState(false);

  const assets        = portfolio.map(calcAsset);
  const totalBourse   = assets.reduce((s, a) => s + a.value, 0);
  const totalInvested = assets.reduce((s, a) => s + a.invested, 0);
  const totalPnL      = totalBourse - totalInvested;
  const globalPerf    = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;
  const totalLivrets  = livrets.reduce((s, l) => s + parseFloat(l.solde || 0), 0);
  const totalPatrimoine = totalBourse + totalLivrets;

  // Budget 3 derniers mois
  const now = new Date();
  const last3months = [0,1,2].map(i => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return d.toISOString().slice(0,7);
  });
  const avgRev = last3months.reduce((s, m) => s + revenus.filter(r => r.date.slice(0,7) === m).reduce((a, r) => a + r.montant, 0), 0) / 3;
  const avgDep = last3months.reduce((s, m) => s + depenses.filter(d => d.date.slice(0,7) === m).reduce((a, d) => a + d.montant, 0), 0) / 3;
  const avgEpargne = avgRev - avgDep;
  const tauxEpargne = avgRev > 0 ? (avgEpargne / avgRev) * 100 : 0;

  // Composition portefeuille
  const byType      = assets.reduce((acc, a) => { acc[a.type] = (acc[a.type] || 0) + a.value; return acc; }, {});
  const pctActions  = ((byType["Actions"] || 0) / totalBourse) * 100;
  const pctETF      = ((byType["ETF"]     || 0) / totalBourse) * 100;
  const pctPE       = ((byType["Private Equity"] || 0) / totalBourse) * 100;
  const top1        = [...assets].sort((a,b) => b.value - a.value)[0];
  const concentration = top1 ? (top1.value / totalBourse) * 100 : 0;

  // Objectifs
  const objAtteints = objectifs.filter(o => parseFloat(o.actuel) >= parseFloat(o.cible)).length;

  // Score de santé financière (0-100)
  const scoreItems = [
    { label: "Diversification",    score: pctETF >= 40 ? 25 : pctETF >= 20 ? 15 : 5,      max: 25 },
    { label: "Taux d'épargne",     score: tauxEpargne >= 20 ? 25 : tauxEpargne >= 10 ? 15 : tauxEpargne > 0 ? 8 : 0, max: 25 },
    { label: "Épargne de sécurité",score: totalLivrets >= avgDep * 3 ? 25 : totalLivrets >= avgDep ? 12 : 5, max: 25 },
    { label: "Objectifs définis",  score: objectifs.length >= 2 ? 25 : objectifs.length === 1 ? 12 : 0, max: 25 },
  ];
  const scoreTotal = scoreItems.reduce((s, i) => s + i.score, 0);
  const scoreColor = scoreTotal >= 75 ? "#10B981" : scoreTotal >= 50 ? "#F59E0B" : "#EF4444";
  const scoreLabel = scoreTotal >= 75 ? "Bonne santé" : scoreTotal >= 50 ? "À améliorer" : "Attention requise";

  // Alertes automatiques
  const alertes = [];
  if (concentration > 30 && top1) alertes.push({ type: "warning", msg: `${top1.name} représente ${concentration.toFixed(0)}% de votre portefeuille — concentration élevée.` });
  if (pctActions > 60) alertes.push({ type: "warning", msg: `${pctActions.toFixed(0)}% en actions individuelles — risque élevé, envisagez plus d'ETFs.` });
  if (totalLivrets < avgDep * 3 && avgDep > 0) alertes.push({ type: "warning", msg: `Fonds d'urgence insuffisant — visez ${fmtEur(avgDep * 3)} (3 mois de dépenses).` });
  if (tauxEpargne < 10 && avgRev > 0) alertes.push({ type: "warning", msg: `Taux d'épargne de ${tauxEpargne.toFixed(1)}% — l'objectif recommandé est 20%+.` });
  if (pctETF >= 50) alertes.push({ type: "success", msg: `Bonne diversification via ETFs (${pctETF.toFixed(0)}%) — continuez sur cette lancée.` });
  if (tauxEpargne >= 20) alertes.push({ type: "success", msg: `Excellent taux d'épargne (${tauxEpargne.toFixed(1)}%) — vous êtes sur la bonne voie.` });
  if (globalPerf > 15) alertes.push({ type: "success", msg: `Performance portefeuille de +${globalPerf.toFixed(1)}% — au-dessus de la moyenne historique des marchés.` });

  // Recommandations croisées
  const recos = [];

  // Portefeuille × Objectif × Risque
  if (objective === "croissance" && risk === "élevé" && parseInt(horizon) >= 5) {
    recos.push({ cat: "📈 Portefeuille", msg: "Avec votre horizon long terme et tolérance au risque élevée, maximisez les ETFs capitalisants (S&P 500, MSCI World). Objectif : 70%+ en ETFs.", priority: "haute" });
  } else if (objective === "croissance" && risk === "modéré") {
    recos.push({ cat: "📈 Portefeuille", msg: `Votre mix actuel (${pctETF.toFixed(0)}% ETFs, ${pctActions.toFixed(0)}% actions) est correct. Visez 60% ETFs pour réduire la volatilité sans sacrifier la performance.`, priority: "moyenne" });
  } else if (objective === "securite" || risk === "faible") {
    recos.push({ cat: "📈 Portefeuille", msg: "Pour un profil conservateur, limitez les actions individuelles spéculatives et renforcez les ETFs large-cap défensifs.", priority: "haute" });
  }

  // Épargne × Objectifs
  if (avgEpargne > 0 && objectifs.length > 0) {
    const objNonAtteints = objectifs.filter(o => parseFloat(o.actuel) < parseFloat(o.cible));
    if (objNonAtteints.length > 0) {
      const totalRestant = objNonAtteints.reduce((s, o) => s + Math.max(parseFloat(o.cible) - parseFloat(o.actuel), 0), 0);
      recos.push({ cat: "🎯 Objectifs", msg: `Vous épargnez ${fmtEur(avgEpargne)}/mois en moyenne. Il vous reste ${fmtEur(totalRestant)} à accumuler sur ${objNonAtteints.length} objectif(s). Priorisez le fonds d'urgence avant les investissements.`, priority: "haute" });
    }
  } else if (avgEpargne <= 0 && avgRev > 0) {
    recos.push({ cat: "💳 Budget", msg: "Votre solde mensuel est négatif ou nul. Avant d'investir davantage, stabilisez vos dépenses pour dégager une épargne mensuelle régulière.", priority: "haute" });
  }

  // Livrets × Portefeuille
  if (totalLivrets > 0 && totalBourse > 0) {
    const ratioLivrets = (totalLivrets / totalPatrimoine) * 100;
    if (ratioLivrets > 50 && objective === "croissance") {
      recos.push({ cat: "🏦 Épargne", msg: `${ratioLivrets.toFixed(0)}% de votre patrimoine est en livrets. Pour un objectif de croissance, envisagez de transférer une partie vers votre portefeuille boursier.`, priority: "moyenne" });
    } else if (ratioLivrets < 10 && avgDep > 0 && totalLivrets < avgDep * 3) {
      recos.push({ cat: "🏦 Épargne", msg: `Votre épargne de précaution est faible (${fmtEur(totalLivrets)}). Constituez d'abord un fonds d'urgence de ${fmtEur(avgDep * 3)} avant d'investir en bourse.`, priority: "haute" });
    }
  }

  // Dépenses
  if (avgDep > 0) {
    const topCat = Object.entries(depenses.filter(d => last3months.includes(d.date.slice(0,7))).reduce((acc, d) => { acc[d.categorie] = (acc[d.categorie] || 0) + d.montant; return acc; }, {})).sort((a,b) => b[1]-a[1])[0];
    if (topCat) recos.push({ cat: "💸 Dépenses", msg: `Votre plus grosse catégorie de dépenses est "${topCat[0]}" (${fmtEur(topCat[1]/3)}/mois en moyenne). Analysez si c'est optimisable.`, priority: "info" });
  }

  // Projection patrimoine
  if (avgEpargne > 0) {
    const proj5 = totalPatrimoine * Math.pow(1.07, 5) + avgEpargne * 12 * ((Math.pow(1.07, 5) - 1) / 0.07);
    recos.push({ cat: "🔮 Projection", msg: `Si vous maintenez ${fmtEur(avgEpargne)}/mois avec un rendement moyen de 7%/an, votre patrimoine pourrait atteindre ${fmtEur(proj5)} dans 5 ans.`, priority: "info" });
  }

  const PRIORITY_COLORS = { haute: "#EF4444", moyenne: "#F59E0B", info: "#3B82F6" };
  const PRIORITY_LABELS = { haute: "Priorité haute", moyenne: "À considérer", info: "Info" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "#F9FAFB" }}>Analyse & Conseils</h2>
          <p style={{ color: "#6B7280", fontSize: 13, marginTop: 4 }}>⚠️ À titre informatif uniquement — pas de conseil financier réglementé.</p>
        </div>
      </div>

      {/* Score de santé + Profil */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 24 }}>

        {/* Score */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>Score de santé financière</div>
          <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 16px" }}>
            <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
              <circle cx="60" cy="60" r="50" fill="none" stroke={scoreColor} strokeWidth="10"
                strokeDasharray={`${(scoreTotal / 100) * 314} 314`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.8s ease" }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: scoreColor, fontFamily: "'Syne', sans-serif" }}>{scoreTotal}</div>
              <div style={{ fontSize: 10, color: "#6B7280" }}>/100</div>
            </div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: scoreColor, marginBottom: 16 }}>{scoreLabel}</div>
          {scoreItems.map(item => (
            <div key={item.label} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>{item.label}</span>
                <span style={{ fontSize: 11, color: item.score >= item.max * 0.8 ? "#10B981" : item.score >= item.max * 0.4 ? "#F59E0B" : "#EF4444" }}>{item.score}/{item.max}</span>
              </div>
              <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${(item.score / item.max) * 100}%`, background: item.score >= item.max * 0.8 ? "#10B981" : item.score >= item.max * 0.4 ? "#F59E0B" : "#EF4444", borderRadius: 2, transition: "width 0.6s" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Profil + résumé données */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600, color: "#F9FAFB", marginBottom: 14 }}>🎯 Votre profil</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <Select label="Objectif" value={objective} onChange={e => setObjective(e.target.value)}>
                <option value="croissance">Croissance</option>
                <option value="revenus">Revenus / dividendes</option>
                <option value="retraite">Retraite</option>
                <option value="securite">Sécurisation</option>
              </Select>
              <Select label="Tolérance au risque" value={risk} onChange={e => setRisk(e.target.value)}>
                <option value="faible">Faible</option>
                <option value="modéré">Modéré</option>
                <option value="élevé">Élevé</option>
              </Select>
              <Input label="Horizon (années)" type="number" value={horizon} onChange={e => setHorizon(e.target.value)} />
            </div>
            <Btn onClick={() => setAnalyzed(true)} style={{ width: "100%", marginTop: 12, padding: "12px" }}>
              🔍 Analyser toutes mes données
            </Btn>
          </div>

          {/* Résumé données analysées */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600, color: "#F9FAFB", marginBottom: 14 }}>📊 Données analysées</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[
                { label: "Portefeuille",  value: fmtEur(totalBourse),    sub: `${assets.length} lignes`, color: "#60A5FA" },
                { label: "Livrets",       value: fmtEur(totalLivrets),   sub: `${livrets.length} compte(s)`, color: "#34D399" },
                { label: "Ép. mensuelle", value: avgRev > 0 ? `${avgEpargne >= 0 ? "+" : ""}${fmtEur(avgEpargne)}` : "–", sub: avgRev > 0 ? `${tauxEpargne.toFixed(0)}% du revenu` : "Pas de données", color: avgEpargne >= 0 ? "#A78BFA" : "#F87171" },
                { label: "Dépenses/mois", value: avgDep > 0 ? fmtEur(avgDep) : "–",  sub: avgDep > 0 ? "moyenne 3 mois" : "Pas de données", color: "#F97316" },
                { label: "Objectifs",     value: `${objAtteints}/${objectifs.length}`, sub: "atteints", color: "#F59E0B" },
                { label: "Patrimoine",    value: fmtEur(totalPatrimoine), sub: "total", color: "#FFFFFF" },
              ].map(k => (
                <div key={k.label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 4 }}>{k.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: k.color }}>{k.value}</div>
                  <div style={{ fontSize: 10, color: "#4B5563" }}>{k.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alertes automatiques */}
      {alertes.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 600, color: "#F9FAFB", marginBottom: 12 }}>⚡ Alertes automatiques</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {alertes.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", borderRadius: 10, background: a.type === "success" ? "rgba(16,185,129,0.08)" : "rgba(245,158,11,0.08)", border: `1px solid ${a.type === "success" ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)"}` }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{a.type === "success" ? "✅" : "⚠️"}</span>
                <span style={{ fontSize: 13, color: "#D1D5DB", lineHeight: 1.5 }}>{a.msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommandations croisées */}
      {analyzed && (
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 600, color: "#F9FAFB", marginBottom: 12 }}>
            🤖 Recommandations personnalisées — {objective === "croissance" ? "Croissance" : objective === "revenus" ? "Revenus" : objective === "retraite" ? "Retraite" : "Sécurisation"} · Risque {risk} · {horizon} ans
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {recos.map((r, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "16px 20px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ flexShrink: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#F9FAFB", marginBottom: 4 }}>{r.cat}</div>
                  <div style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: `${PRIORITY_COLORS[r.priority]}20`, color: PRIORITY_COLORS[r.priority], border: `1px solid ${PRIORITY_COLORS[r.priority]}40`, whiteSpace: "nowrap" }}>
                    {PRIORITY_LABELS[r.priority]}
                  </div>
                </div>
                <div style={{ width: 1, background: "rgba(255,255,255,0.06)", alignSelf: "stretch", marginTop: 2 }} />
                <p style={{ fontSize: 13, color: "#D1D5DB", lineHeight: 1.6, margin: 0 }}>{r.msg}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {!analyzed && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#6B7280" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#9CA3AF", marginBottom: 8 }}>Configurez votre profil et lancez l'analyse</div>
          <div style={{ fontSize: 13 }}>L'analyse croisera votre portefeuille, épargne, budget et objectifs pour vous donner des conseils personnalisés.</div>
        </div>
      )}
    </div>
  );
}

/* ────────────────── BUDGET ────────────────── */
const REVENUE_CATEGORIES = [
  { id: "salaire",     label: "Salaire",            emoji: "💼", color: "#10B981" },
  { id: "freelance",   label: "Freelance / Side",   emoji: "💻", color: "#3B82F6" },
  { id: "dividendes",  label: "Dividendes",         emoji: "📈", color: "#F59E0B" },
  { id: "loyer_recu",  label: "Loyer perçu",        emoji: "🏠", color: "#8B5CF6" },
  { id: "aides",       label: "Aides / APL",        emoji: "🏛️", color: "#06B6D4" },
  { id: "autres_rev",  label: "Autres revenus",     emoji: "💰", color: "#6B7280" },
];

function Budget({ depenses, revenus, setRevenus }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0,7) + "-01", label: "", categorie: "salaire", montant: "", note: "", recurrent: true });
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0,7));

  const saveRevenu = () => {
    setRevenus(r => [...r, { ...form, id: Date.now(), montant: parseFloat(form.montant), date: filterMonth + "-01" }]);
    setShowModal(false);
    setForm({ date: filterMonth + "-01", label: "", categorie: "salaire", montant: "", note: "", recurrent: true });
  };
  const delRevenu = (id) => setRevenus(r => r.filter(x => x.id !== id));

  // Données du mois sélectionné
  const revenusMonth  = revenus.filter(r => r.date.slice(0,7) === filterMonth);
  const depensesMonth = depenses.filter(d => d.date.slice(0,7) === filterMonth);
  const totalRevenus  = revenusMonth.reduce((s, r) => s + r.montant, 0);
  const totalDepenses = depensesMonth.reduce((s, d) => s + d.montant, 0);
  const solde         = totalRevenus - totalDepenses;
  const tauxEpargne   = totalRevenus > 0 ? (solde / totalRevenus) : 0;

  // Données pour le graphique 6 derniers mois
  const last6 = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const m = d.toISOString().slice(0,7);
    const rev = revenus.filter(r => r.date.slice(0,7) === m).reduce((s, r) => s + r.montant, 0);
    const dep = depenses.filter(d => d.date.slice(0,7) === m).reduce((s, d) => s + d.montant, 0);
    return { month: d.toLocaleDateString("fr-FR", { month: "short" }), revenus: rev, depenses: dep, solde: rev - dep };
  });

  // 12 derniers mois toujours disponibles + mois avec données
  const allMonths = [...new Set([
    ...Array.from({ length: 12 }, (_, i) => {
      const d = new Date(); d.setMonth(d.getMonth() - i);
      return d.toISOString().slice(0,7);
    }),
    ...revenus.map(r => r.date.slice(0,7)),
    ...depenses.map(d => d.date.slice(0,7)),
  ])].sort().reverse();

  // Revenus récurrents du mois précédent à reconduire
  const prevMonth = (() => { const d = new Date(); d.setMonth(d.getMonth() - 1); return d.toISOString().slice(0,7); })();
  const recurrentsPrevMonth = revenus.filter(r => r.date.slice(0,7) === prevMonth && r.recurrent);
  const alreadyThisMonth = revenus.filter(r => r.date.slice(0,7) === filterMonth).map(r => r.label);
  const suggestedRecurrents = recurrentsPrevMonth.filter(r => !alreadyThisMonth.includes(r.label));

  const applyRecurrents = () => {
    const toAdd = suggestedRecurrents.map(r => ({ ...r, id: Date.now() + Math.random(), date: filterMonth + "-01" }));
    setRevenus(rv => [...rv, ...toAdd]);
  };

  return (
    <div>
      {/* En-tête */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "#F9FAFB" }}>Budget mensuel</h2>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Select label="" value={filterMonth} onChange={e => setFilterMonth(e.target.value)} style={{ marginBottom: 0, width: 180 }}>
            {allMonths.map(m => <option key={m} value={m}>{new Date(m + "-02").toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</option>)}
          </Select>
          <Btn onClick={() => { setForm({ date: filterMonth + "-01", label: "", categorie: "salaire", montant: "", note: "", recurrent: true }); setShowModal(true); }}>+ Revenu</Btn>
        </div>
      </div>

      {/* Suggestion revenus récurrents */}
      {suggestedRecurrents.length > 0 && (
        <div style={{ background: "#10B98115", border: "1px solid #10B98140", borderRadius: 12, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#10B981", fontSize: 14 }}>
            💡 {suggestedRecurrents.length} revenu(s) récurrent(s) du mois dernier détecté(s) — voulez-vous les reconduire ?
            <span style={{ color: "#6B7280", marginLeft: 8 }}>({suggestedRecurrents.map(r => r.label).join(", ")})</span>
          </span>
          <Btn variant="success" onClick={applyRecurrents} style={{ padding: "6px 14px", fontSize: 13 }}>✓ Reconduire</Btn>
        </div>
      )}

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 28 }}>
        <KpiCard label="Revenus" value={fmtEur(totalRevenus)} sub="ce mois" positive={true} />
        <KpiCard label="Dépenses" value={fmtEur(totalDepenses)} sub="ce mois" positive={false} />
        <KpiCard label="Solde" value={fmtEur(solde)} sub={solde >= 0 ? "Bénéficiaire ✓" : "Déficitaire ✗"} positive={solde >= 0} />
        <KpiCard label="Taux d'épargne" value={totalRevenus > 0 ? `${(tauxEpargne * 100).toFixed(1)}%` : "—"} sub="du revenu net" positive={tauxEpargne >= 0.1} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginBottom: 24 }}>
        {/* Revenus du mois */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 600, color: "#F9FAFB", marginBottom: 16 }}>
            💼 Revenus du mois
            <span style={{ fontSize: 13, color: "#10B981", marginLeft: 12 }}>{fmtEur(totalRevenus)}</span>
          </div>
          {revenusMonth.length === 0 ? (
            <div style={{ color: "#6B7280", fontSize: 14, textAlign: "center", padding: "24px 0" }}>
              Aucun revenu saisi — cliquez sur "+ Revenu"
            </div>
          ) : (
            revenusMonth.map(r => {
              const cat = REVENUE_CATEGORIES.find(c => c.id === r.categorie);
              return (
                <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{cat?.emoji}</span>
                    <div>
                      <div style={{ fontSize: 14, color: "#F9FAFB", fontWeight: 500 }}>{r.label}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 11, color: cat?.color || "#6B7280" }}>{cat?.label}</span>
                        {r.recurrent && <span style={{ fontSize: 10, color: "#6B7280", background: "rgba(255,255,255,0.06)", padding: "1px 6px", borderRadius: 10 }}>🔄 récurrent</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#10B981" }}>+{fmtEur(r.montant)}</span>
                    <button onClick={() => delRevenu(r.id)} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: 14 }}>🗑</button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Graphique 6 mois */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 600, color: "#F9FAFB", marginBottom: 16 }}>📊 Revenus vs Dépenses (6 mois)</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={last6} barGap={4}>
              <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}€`} />
              <Tooltip contentStyle={{ background: "#1F2937", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#F9FAFB" }} formatter={(v, n) => [fmtEur(v), n === "revenus" ? "Revenus" : "Dépenses"]} />
              <Bar dataKey="revenus"  fill="#10B981" radius={[4,4,0,0]} />
              <Bar dataKey="depenses" fill="#EF4444" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8 }}>
            <span style={{ fontSize: 12, color: "#10B981" }}>■ Revenus</span>
            <span style={{ fontSize: 12, color: "#EF4444" }}>■ Dépenses</span>
          </div>
        </div>
      </div>

      {/* Solde visuel */}
      <div style={{ background: solde >= 0 ? "rgba(16,185,129,0.05)" : "rgba(239,68,68,0.05)", border: `1px solid ${solde >= 0 ? "#10B98130" : "#EF444430"}`, borderRadius: 16, padding: 24 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 600, color: "#F9FAFB", marginBottom: 16 }}>⚖️ Synthèse mensuelle</div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "#9CA3AF", fontSize: 14 }}>Revenus</span>
              <span style={{ color: "#10B981", fontWeight: 600 }}>{fmtEur(totalRevenus)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "#9CA3AF", fontSize: 14 }}>Dépenses</span>
              <span style={{ color: "#EF4444", fontWeight: 600 }}>−{fmtEur(totalDepenses)}</span>
            </div>
            <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "12px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#F9FAFB", fontSize: 16, fontWeight: 700 }}>Solde</span>
              <span style={{ color: solde >= 0 ? "#10B981" : "#EF4444", fontSize: 20, fontWeight: 800 }}>{solde >= 0 ? "+" : ""}{fmtEur(solde)}</span>
            </div>
          </div>
          {totalRevenus > 0 && (
            <div style={{ textAlign: "center", padding: "16px 32px", background: "rgba(255,255,255,0.03)", borderRadius: 12 }}>
              <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: tauxEpargne >= 0.2 ? "#10B981" : tauxEpargne >= 0.1 ? "#F59E0B" : "#EF4444" }}>
                {(tauxEpargne * 100).toFixed(1)}%
              </div>
              <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>taux d'épargne</div>
              <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>
                {tauxEpargne >= 0.2 ? "🟢 Excellent" : tauxEpargne >= 0.1 ? "🟡 Correct" : "🔴 Faible"}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal ajout revenu */}
      {showModal && (
        <Modal title="Ajouter un revenu" onClose={() => setShowModal(false)}>
          <Input label="Libellé" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="ex: Salaire net, Freelance client X..." />
          <Select label="Catégorie" value={form.categorie} onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))}>
            {REVENUE_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
          </Select>
          <Input label="Montant (€)" type="number" value={form.montant} onChange={e => setForm(f => ({ ...f, montant: e.target.value }))} placeholder="0.00" />
          <Input label="Note (optionnel)" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Détail..." />
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, padding: "10px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 10 }}>
            <input type="checkbox" id="recurrent" checked={form.recurrent} onChange={e => setForm(f => ({ ...f, recurrent: e.target.checked }))} style={{ width: 16, height: 16, cursor: "pointer" }} />
            <label htmlFor="recurrent" style={{ color: "#D1D5DB", fontSize: 14, cursor: "pointer" }}>
              🔄 Revenu récurrent (proposé automatiquement chaque mois)
            </label>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Btn variant="ghost" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Annuler</Btn>
            <Btn onClick={saveRevenu} style={{ flex: 1 }} disabled={!form.label || !form.montant}>Enregistrer</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ────────────────── DÉPENSES ────────────────── */
const EXPENSE_CATEGORIES = [
  { id: "logement",      label: "Logement",        emoji: "🏠", color: "#3B82F6" },
  { id: "alimentation",  label: "Alimentation",    emoji: "🛒", color: "#10B981" },
  { id: "transport",     label: "Transport",       emoji: "🚗", color: "#F59E0B" },
  { id: "sante",         label: "Santé",           emoji: "💊", color: "#EF4444" },
  { id: "loisirs",       label: "Loisirs",         emoji: "🎬", color: "#8B5CF6" },
  { id: "restaurants",   label: "Restaurants",     emoji: "🍽️", color: "#EC4899" },
  { id: "vetements",     label: "Vêtements",       emoji: "👗", color: "#06B6D4" },
  { id: "abonnements",   label: "Abonnements",     emoji: "📱", color: "#6366F1" },
  { id: "epargne",       label: "Épargne",         emoji: "💰", color: "#14B8A6" },
  { id: "autres",        label: "Autres",          emoji: "📦", color: "#6B7280" },
];

const INITIAL_BUDGETS = {
  logement: 800, alimentation: 400, transport: 150, sante: 80,
  loisirs: 150, restaurants: 120, vetements: 100, abonnements: 60,
  epargne: 300, autres: 100,
};

function Depenses({ depenses, setDepenses, budgets, setBudgets, setRevenus }) {
  const [showModal, setShowModal]           = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0,10), label: "", categorie: "alimentation", montant: "", note: "" });
  const [budgetForm, setBudgetForm]         = useState({ ...budgets });
  const [filterMonth, setFilterMonth]       = useState(new Date().toISOString().slice(0,7));
  const [filterCat, setFilterCat]           = useState("toutes");

  // Import CSV
  const [importStep, setImportStep]         = useState("upload");
  const [importDepenses, setImportDepenses] = useState([]);
  const [importRevenus, setImportRevenus]   = useState([]);
  const [selectedDep, setSelectedDep]       = useState({});
  const [selectedRev, setSelectedRev]       = useState({});
  const [importPreviewTab, setImportPreviewTab] = useState("depenses");
  const [importError, setImportError]       = useState("");
  const fileInputRef = useRef(null);

  const saveDepense = () => {
    setDepenses(d => [...d, { ...form, id: Date.now(), montant: parseFloat(form.montant) }]);
    setShowModal(false);
    setForm({ date: new Date().toISOString().slice(0,10), label: "", categorie: "alimentation", montant: "", note: "" });
  };
  const saveBudgets = () => { setBudgets(budgetForm); setShowBudgetModal(false); };
  const delDepense  = (id) => setDepenses(d => d.filter(x => x.id !== id));

  // ── Catégorisation dépenses ──
  const categorizeDepense = (label) => {
    const l = label.toLowerCase();
    if (/loyer|habitation|fonciere|syndic|agence immo|charges|eau |edf|engie|gaz |electricit|pret int|ech pret/.test(l)) return "logement";
    if (/intermarche|carrefour|leclerc|lidl|aldi|monoprix|casino |franprix|super u|auchan|picard|biocoop|fresh |epicerie|supermarche|courses/.test(l)) return "alimentation";
    if (/sncf|navigo|ratp|bus |tram |metro|parking|essence|total |esso|bp |shell|autoroute|peage|uber|blablacar|ouigo|taxi|petroest/.test(l)) return "transport";
    if (/pharmacie|medecin|docteur|hopital|clinique|dentiste|mutuelle|secu|cpam|ameli|optique|kiné/.test(l)) return "sante";
    if (/netflix|spotify|disney|canal\+|deezer|twitch|steam|playstation|xbox|cinema|theatre|concert|loisir|vacances|airbnb|booking|hotel/.test(l)) return "loisirs";
    if (/restaurant|brasserie|bistro|pizza|burger|sushi|kebab|mcdonald|kfc|quick|paul |subway|starbucks|cafe |bar |boulangerie|punto/.test(l)) return "restaurants";
    if (/zara|h&m|primark|uniqlo|nike|adidas|decathlon|kiabi|vetement|chaussure|zalando|asos|aska/.test(l)) return "vetements";
    if (/sfr|orange|bouygues telecom|free |apple\.com|google|microsoft|amazon|abonnement|openai|chatgpt|prlv sepa|ume/.test(l)) return "abonnements";
    if (/livret|epargne|assurance.?vie|trade republic|bourse|invest/.test(l)) return "epargne";
    return "autres";
  };

  // ── Catégorisation revenus ──
  const categorizeRevenu = (label) => {
    const l = label.toLowerCase();
    if (/salaire|paie|virement employeur|soc |sa |sas |sarl/.test(l)) return "salaire";
    if (/freelance|facture|prestation|mission|client/.test(l)) return "freelance";
    if (/dividende|coupon|interet|interest/.test(l)) return "dividendes";
    if (/loyer|quittance|locataire/.test(l)) return "loyer_recu";
    if (/caf|apl|aide|alloc|prime activite|rsa|pole emploi|cpam|remboursement|secu|ameli/.test(l)) return "aides";
    return "autres_rev";
  };

  // ── Parseur CSV ──
  const parseLocalCSV = (text) => {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return { depenses: [], revenus: [] };

    const sep = lines[0].includes(";") ? ";" : lines[0].includes(",") ? "," : "\t";
    const headers = lines[0].split(sep).map(h => h.replace(/['"]/g, "").trim().toLowerCase());

    const iDate   = headers.findIndex(h => h.includes("date") && !h.includes("valeur"));
    const iLabel  = headers.findIndex(h => /libellé|label|opération|description|intitulé/.test(h));
    const iDebit  = headers.findIndex(h => /débit|debit/.test(h));
    const iCredit = headers.findIndex(h => /crédit|credit/.test(h));
    const iMontant = headers.findIndex(h => h === "montant" || h === "amount");

    const depenses = [], revenus = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(sep).map(c => c.replace(/['"]/g, "").trim());
      if (cols.length < 2) continue;

      const rawDate  = cols[iDate]  ?? cols[0];
      const rawLabel = cols[iLabel] ?? cols[2] ?? "";
      const rawDebit  = iDebit  >= 0 ? cols[iDebit]  : "";
      const rawCredit = iCredit >= 0 ? cols[iCredit] : "";
      const rawMontant = iMontant >= 0 ? cols[iMontant] : "";

      const montantDebit  = parseFloat(rawDebit.replace(/\s/g,"").replace(",","."))  || 0;
      const montantCredit = parseFloat(rawCredit.replace(/\s/g,"").replace(",",".")) || 0;
      const montantNet    = parseFloat(rawMontant.replace(/\s/g,"").replace(",","."))|| 0;

      // Convertir date DD/MM/YYYY → YYYY-MM-DD
      let date = rawDate;
      const dmyMatch = rawDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      if (dmyMatch) date = `${dmyMatch[3]}-${dmyMatch[2]}-${dmyMatch[1]}`;

      const labelUp = rawLabel.toUpperCase();
      if (/SOLDE|RELEVE/.test(labelUp)) continue;

      const label = rawLabel
        .replace(/PAIEMENT (PSC|CB) /i, "").replace(/CARTE \d+/i, "")
        .replace(/VIR INST /i, "").replace(/VIR SEPA /i, "").replace(/PRLV SEPA /i, "")
        .trim();

      if (montantDebit > 0) {
        // C'est une dépense
        depenses.push({ id: `dep_${Date.now()}_${i}`, date, label: label || rawLabel, montant: montantDebit, categorie: categorizeDepense(label || rawLabel) });
      } else if (montantCredit > 0) {
        // C'est un revenu
        revenus.push({ id: `rev_${Date.now()}_${i}`, date, label: label || rawLabel, montant: montantCredit, categorie: categorizeRevenu(label || rawLabel), recurrent: false });
      } else if (montantNet !== 0) {
        if (montantNet > 0) {
          revenus.push({ id: `rev_${Date.now()}_${i}`, date, label: label || rawLabel, montant: montantNet, categorie: categorizeRevenu(label || rawLabel), recurrent: false });
        } else {
          depenses.push({ id: `dep_${Date.now()}_${i}`, date, label: label || rawLabel, montant: Math.abs(montantNet), categorie: categorizeDepense(label || rawLabel) });
        }
      }
    }
    return { depenses, revenus };
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImportError("");
    setImportStep("analyzing");
    try {
      const text = await file.text();
      const { depenses: deps, revenus: revs } = parseLocalCSV(text);
      if (deps.length === 0 && revs.length === 0) {
        setImportError("Aucune opération détectée. Vérifiez que le fichier est bien un relevé bancaire CSV.");
        setImportStep("upload");
        return;
      }
      setImportDepenses(deps);
      setImportRevenus(revs);
      setSelectedDep(Object.fromEntries(deps.map(r => [r.id, true])));
      setSelectedRev(Object.fromEntries(revs.map(r => [r.id, true])));
      setImportPreviewTab(deps.length > 0 ? "depenses" : "revenus");
      setImportStep("preview");
    } catch {
      setImportError("Erreur lors de la lecture du fichier.");
      setImportStep("upload");
    }
    e.target.value = "";
  };

  const confirmImport = () => {
    const depsToAdd = importDepenses
      .filter(r => selectedDep[r.id])
      .map(r => ({ ...r, id: Date.now() + Math.random(), note: "Importé CSV" }));
    const revsToAdd = importRevenus
      .filter(r => selectedRev[r.id])
      .map(r => ({ ...r, id: Date.now() + Math.random(), note: "Importé CSV" }));
    if (depsToAdd.length > 0) setDepenses(d => [...d, ...depsToAdd]);
    if (revsToAdd.length > 0) setRevenus(rv => [...rv, ...revsToAdd]);
    setImportStep("done");
    setTimeout(() => { setShowImportModal(false); setImportStep("upload"); setImportDepenses([]); setImportRevenus([]); }, 1800);
  };

  // Filtrage
  const filtered = depenses.filter(d => {
    const okMonth = d.date.slice(0,7) === filterMonth;
    const okCat   = filterCat === "toutes" || d.categorie === filterCat;
    return okMonth && okCat;
  });

  const totalMois    = filtered.reduce((s, d) => s + d.montant, 0);
  const totalBudget  = Object.values(budgets).reduce((s, v) => s + v, 0);
  const byCategorie  = EXPENSE_CATEGORIES.map(cat => {
    const spent = filtered.filter(d => d.categorie === cat.id).reduce((s, d) => s + d.montant, 0);
    const budget = budgets[cat.id] || 0;
    return { ...cat, spent, budget, pct: budget > 0 ? spent / budget : 0 };
  }).filter(c => c.spent > 0 || c.budget > 0);

  // 12 derniers mois toujours disponibles + mois avec données
  const allMonths = [...new Set([
    ...Array.from({ length: 12 }, (_, i) => {
      const d = new Date(); d.setMonth(d.getMonth() - i);
      return d.toISOString().slice(0,7);
    }),
    ...depenses.map(d => d.date.slice(0,7)),
  ])].sort().reverse();

  return (
    <div>
      {/* En-tête */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "#F9FAFB" }}>Dépenses</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="ghost" onClick={() => { setBudgetForm({ ...budgets }); setShowBudgetModal(true); }}>🎯 Budgets</Btn>
          <Btn variant="ghost" onClick={() => { setImportStep("upload"); setImportDepenses([]); setImportRevenus([]); setImportError(""); setShowImportModal(true); }}>📂 Importer relevé</Btn>
          <Btn onClick={() => { setForm({ date: new Date().toISOString().slice(0,10), label: "", categorie: "alimentation", montant: "", note: "" }); setShowModal(true); }}>+ Ajouter</Btn>
        </div>
      </div>

      {/* Filtres */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <Select label="" value={filterMonth} onChange={e => setFilterMonth(e.target.value)} style={{ marginBottom: 0, width: 160 }}>
          {allMonths.map(m => <option key={m} value={m}>{new Date(m + "-01").toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</option>)}
        </Select>
        <Select label="" value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ marginBottom: 0, width: 180 }}>
          <option value="toutes">Toutes catégories</option>
          {EXPENSE_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
        </Select>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
        <KpiCard label="Dépensé ce mois" value={fmtEur(totalMois)} sub={`Budget total: ${fmtEur(totalBudget)}`} positive={totalMois <= totalBudget} />
        <KpiCard label="Budget restant" value={fmtEur(Math.max(0, totalBudget - totalMois))} positive={totalBudget - totalMois >= 0} />
        <KpiCard label="Nb. dépenses" value={filtered.length} sub="ce mois" />
        <KpiCard label="Moyenne / dépense" value={filtered.length > 0 ? fmtEur(totalMois / filtered.length) : "—"} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginBottom: 24 }}>
        {/* Barres de budget */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 600, color: "#F9FAFB", marginBottom: 20 }}>🎯 Suivi des budgets</div>
          {byCategorie.map(cat => (
            <div key={cat.id} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: "#D1D5DB" }}>{cat.emoji} {cat.label}</span>
                <span style={{ fontSize: 13, color: cat.pct > 1 ? "#EF4444" : "#9CA3AF" }}>
                  {fmtEur(cat.spent)} <span style={{ color: "#6B7280" }}>/ {fmtEur(cat.budget)}</span>
                </span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 3, transition: "width 0.5s",
                  width: `${Math.min(cat.pct * 100, 100)}%`,
                  background: cat.pct > 1 ? "#EF4444" : cat.pct > 0.8 ? "#F59E0B" : cat.color,
                }} />
              </div>
            </div>
          ))}
          {byCategorie.length === 0 && (
            <div style={{ textAlign: "center", color: "#6B7280", padding: "24px 0", fontSize: 14 }}>Aucune dépense ce mois</div>
          )}
        </div>

        {/* Répartition graphique */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 600, color: "#F9FAFB", marginBottom: 16 }}>📊 Répartition</div>
          {byCategorie.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={byCategorie} layout="vertical" margin={{ left: 80 }}>
                <XAxis type="number" tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}€`} />
                <YAxis type="category" dataKey="label" tick={{ fill: "#D1D5DB", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1F2937", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#F9FAFB" }} formatter={v => [fmtEur(v), "Dépensé"]} />
                <Bar dataKey="spent" radius={[0, 4, 4, 0]}>
                  {byCategorie.map(c => <Cell key={c.id} fill={c.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: "center", color: "#6B7280", padding: "48px 0", fontSize: 14 }}>Aucune donnée à afficher</div>
          )}
        </div>
      </div>

      {/* Liste des dépenses */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 600, color: "#F9FAFB", marginBottom: 16 }}>
          📋 Détail des dépenses {filtered.length > 0 && <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 400 }}>({filtered.length})</span>}
        </div>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", color: "#6B7280", padding: "32px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>💸</div>
            Aucune dépense pour cette période. Cliquez sur "+ Ajouter" pour commencer.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 6px" }}>
            <thead>
              <tr>
                {["Date", "Libellé", "Catégorie", "Note", "Montant", ""].map(h => (
                  <th key={h} style={{ padding: "6px 12px", fontSize: 11, color: "#6B7280", textAlign: "left", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...filtered].sort((a,b) => b.date.localeCompare(a.date)).map(d => {
                const cat = EXPENSE_CATEGORIES.find(c => c.id === d.categorie);
                return (
                  <tr key={d.id} style={{ background: "rgba(255,255,255,0.02)" }}>
                    <td style={{ padding: "10px 12px", borderRadius: "10px 0 0 10px", color: "#9CA3AF", fontSize: 13 }}>{d.date}</td>
                    <td style={{ padding: "10px 12px", color: "#F9FAFB", fontWeight: 500 }}>{d.label}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <select
                        value={d.categorie}
                        onChange={e => setDepenses(ds => ds.map(x => x.id === d.id ? { ...x, categorie: e.target.value } : x))}
                        style={{ background: (cat?.color || "#6B7280") + "20", color: cat?.color || "#6B7280", border: `1px solid ${(cat?.color || "#6B7280")}40`, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", outline: "none" }}
                      >
                        {EXPENSE_CATEGORIES.map(c => <option key={c.id} value={c.id} style={{ background: "#1F2937", color: "#F9FAFB" }}>{c.emoji} {c.label}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: "10px 12px", color: "#6B7280", fontSize: 13 }}>{d.note || "—"}</td>
                    <td style={{ padding: "10px 12px", color: "#EF4444", fontWeight: 700, fontSize: 15 }}>{fmtEur(d.montant)}</td>
                    <td style={{ padding: "10px 12px", borderRadius: "0 10px 10px 0" }}>
                      <button onClick={() => delDepense(d.id)} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer" }}>🗑</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal ajout dépense */}
      {showModal && (
        <Modal title="Ajouter une dépense" onClose={() => setShowModal(false)}>
          <Input label="Date" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          <Input label="Libellé" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="ex: Courses Monoprix, Loyer..." />
          <Select label="Catégorie" value={form.categorie} onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))}>
            {EXPENSE_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
          </Select>
          <Input label="Montant (€)" type="number" value={form.montant} onChange={e => setForm(f => ({ ...f, montant: e.target.value }))} placeholder="0.00" />
          <Input label="Note (optionnel)" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Détail..." />
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Annuler</Btn>
            <Btn onClick={saveDepense} style={{ flex: 1 }} disabled={!form.label || !form.montant}>Enregistrer</Btn>
          </div>
        </Modal>
      )}

      {/* Modal budgets */}
      {showBudgetModal && (
        <Modal title="🎯 Définir les budgets mensuels" onClose={() => setShowBudgetModal(false)}>
          <p style={{ color: "#9CA3AF", fontSize: 13, marginBottom: 20 }}>Définissez votre budget mensuel par catégorie (en €).</p>
          {EXPENSE_CATEGORIES.map(cat => (
            <div key={cat.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ width: 130, fontSize: 14, color: "#D1D5DB" }}>{cat.emoji} {cat.label}</span>
              <input
                type="number"
                value={budgetForm[cat.id] || ""}
                onChange={e => setBudgetForm(f => ({ ...f, [cat.id]: parseFloat(e.target.value) || 0 }))}
                style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "8px 12px", color: "#F9FAFB", fontSize: 14, outline: "none" }}
                placeholder="0"
              />
              <span style={{ color: "#6B7280", fontSize: 13 }}>€</span>
            </div>
          ))}
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <Btn variant="ghost" onClick={() => setShowBudgetModal(false)} style={{ flex: 1 }}>Annuler</Btn>
            <Btn onClick={saveBudgets} style={{ flex: 1 }}>Sauvegarder</Btn>
          </div>
        </Modal>
      )}

      {/* Modal import CSV */}
      {showImportModal && (
        <Modal title="📂 Importer un relevé bancaire" onClose={() => { setShowImportModal(false); setImportStep("upload"); setImportDepenses([]); setImportRevenus([]); }}>
          {importStep === "upload" && (
            <div>
              <div style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12, padding: 16, marginBottom: 20, fontSize: 13, color: "#93C5FD", lineHeight: 1.8 }}>
                <strong style={{ color: "#60A5FA" }}>Comment exporter votre relevé CSV ?</strong><br />
                • <strong>BNP / Hello Bank</strong> : Mes comptes → Télécharger → CSV<br />
                • <strong>Crédit Agricole</strong> : Mes comptes → Exporter → CSV<br />
                • <strong>Boursorama</strong> : Compte → Télécharger les opérations → CSV<br />
                • <strong>La plupart des banques</strong> : cherchez "export" ou "télécharger" dans votre espace client
              </div>
              {importError && (
                <div style={{ background: "#EF444420", border: "1px solid #EF444440", borderRadius: 10, padding: 12, marginBottom: 16, color: "#EF4444", fontSize: 13 }}>{importError}</div>
              )}
              <input ref={fileInputRef} type="file" accept=".csv,.txt" onChange={handleFileChange} style={{ display: "none" }} />
              <Btn onClick={() => fileInputRef.current?.click()} style={{ width: "100%", padding: 16, fontSize: 15 }}>
                📁 Sélectionner un fichier CSV
              </Btn>
              <p style={{ textAlign: "center", color: "#6B7280", fontSize: 12, marginTop: 12 }}>
                L'IA lit et catégorise vos dépenses automatiquement
              </p>
            </div>
          )}
          {importStep === "analyzing" && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
              <div style={{ color: "#F9FAFB", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Analyse en cours...</div>
              <div style={{ color: "#9CA3AF", fontSize: 14 }}>L'IA lit votre relevé et catégorise chaque dépense</div>
            </div>
          )}
          {importStep === "preview" && (
            <div>
              {/* Onglets dépenses / revenus */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <button onClick={() => setImportPreviewTab("depenses")} style={{ flex: 1, padding: "8px 0", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, background: importPreviewTab === "depenses" ? "#EF4444" : "rgba(255,255,255,0.06)", color: importPreviewTab === "depenses" ? "#fff" : "#9CA3AF" }}>
                  💸 Dépenses ({importDepenses.length})
                </button>
                <button onClick={() => setImportPreviewTab("revenus")} style={{ flex: 1, padding: "8px 0", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, background: importPreviewTab === "revenus" ? "#10B981" : "rgba(255,255,255,0.06)", color: importPreviewTab === "revenus" ? "#fff" : "#9CA3AF" }}>
                  💰 Revenus ({importRevenus.length})
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 10 }}>
                {importPreviewTab === "depenses" ? <>
                  <button onClick={() => setSelectedDep(Object.fromEntries(importDepenses.map(r => [r.id, true])))} style={{ background: "none", border: "none", color: "#3B82F6", cursor: "pointer", fontSize: 13 }}>Tout sélect.</button>
                  <button onClick={() => setSelectedDep({})} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 13 }}>Tout désélect.</button>
                </> : <>
                  <button onClick={() => setSelectedRev(Object.fromEntries(importRevenus.map(r => [r.id, true])))} style={{ background: "none", border: "none", color: "#3B82F6", cursor: "pointer", fontSize: 13 }}>Tout sélect.</button>
                  <button onClick={() => setSelectedRev({})} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 13 }}>Tout désélect.</button>
                </>}
              </div>

              <div style={{ maxHeight: 320, overflowY: "auto", marginBottom: 16 }}>
                {importPreviewTab === "depenses" && importDepenses.map(r => {
                  const cat = EXPENSE_CATEGORIES.find(c => c.id === r.categorie);
                  return (
                    <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: selectedDep[r.id] ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${selectedDep[r.id] ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.06)"}`, borderRadius: 10, marginBottom: 6 }}>
                      <input type="checkbox" checked={!!selectedDep[r.id]} onChange={() => setSelectedDep(s => ({ ...s, [r.id]: !s[r.id] }))} style={{ width: 15, height: 15, cursor: "pointer", flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: "#9CA3AF", width: 86, flexShrink: 0 }}>{r.date}</span>
                      <span style={{ flex: 1, fontSize: 13, color: "#F9FAFB", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.label}</span>
                      <select value={r.categorie} onChange={e => setImportDepenses(rows => rows.map(x => x.id === r.id ? { ...x, categorie: e.target.value } : x))} style={{ background: (cat?.color||"#6B7280")+"20", color: cat?.color||"#6B7280", border: `1px solid ${(cat?.color||"#6B7280")}40`, borderRadius: 8, padding: "3px 8px", fontSize: 11, cursor: "pointer", outline: "none", flexShrink: 0 }}>
                        {EXPENSE_CATEGORIES.map(c => <option key={c.id} value={c.id} style={{ background: "#1F2937", color: "#F9FAFB" }}>{c.emoji} {c.label}</option>)}
                      </select>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#EF4444", flexShrink: 0, width: 60, textAlign: "right" }}>{fmtEur(r.montant)}</span>
                    </div>
                  );
                })}
                {importPreviewTab === "revenus" && importRevenus.map(r => {
                  const cat = REVENUE_CATEGORIES.find(c => c.id === r.categorie);
                  return (
                    <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: selectedRev[r.id] ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${selectedRev[r.id] ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.06)"}`, borderRadius: 10, marginBottom: 6 }}>
                      <input type="checkbox" checked={!!selectedRev[r.id]} onChange={() => setSelectedRev(s => ({ ...s, [r.id]: !s[r.id] }))} style={{ width: 15, height: 15, cursor: "pointer", flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: "#9CA3AF", width: 86, flexShrink: 0 }}>{r.date}</span>
                      <span style={{ flex: 1, fontSize: 13, color: "#F9FAFB", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.label}</span>
                      <select value={r.categorie} onChange={e => setImportRevenus(rows => rows.map(x => x.id === r.id ? { ...x, categorie: e.target.value } : x))} style={{ background: (cat?.color||"#6B7280")+"20", color: cat?.color||"#6B7280", border: `1px solid ${(cat?.color||"#6B7280")}40`, borderRadius: 8, padding: "3px 8px", fontSize: 11, cursor: "pointer", outline: "none", flexShrink: 0 }}>
                        {REVENUE_CATEGORIES.map(c => <option key={c.id} value={c.id} style={{ background: "#1F2937", color: "#F9FAFB" }}>{c.emoji} {c.label}</option>)}
                      </select>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#10B981", flexShrink: 0, width: 60, textAlign: "right" }}>+{fmtEur(r.montant)}</span>
                    </div>
                  );
                })}
                {importPreviewTab === "depenses" && importDepenses.length === 0 && <div style={{ color: "#6B7280", textAlign: "center", padding: 24 }}>Aucune dépense détectée</div>}
                {importPreviewTab === "revenus"  && importRevenus.length  === 0 && <div style={{ color: "#6B7280", textAlign: "center", padding: 24 }}>Aucun revenu détecté</div>}
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, display: "flex", justifyContent: "space-around", fontSize: 13 }}>
                <span style={{ color: "#EF4444" }}>💸 {Object.values(selectedDep).filter(Boolean).length} dépense(s) sélectionnée(s)</span>
                <span style={{ color: "#10B981" }}>💰 {Object.values(selectedRev).filter(Boolean).length} revenu(s) sélectionné(s)</span>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <Btn variant="ghost" onClick={() => { setImportStep("upload"); setImportDepenses([]); setImportRevenus([]); }} style={{ flex: 1 }}>← Retour</Btn>
                <Btn onClick={confirmImport} style={{ flex: 1 }}>✓ Tout importer</Btn>
              </div>
            </div>
          )}
          {importStep === "done" && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <div style={{ color: "#10B981", fontSize: 16, fontWeight: 600 }}>Dépenses importées avec succès !</div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

/* ────────────────── ÉPARGNE ────────────────── */
const LIVRET_TYPES = [
  { id: "livret_a",    label: "Livret A",           emoji: "🟢", color: "#10B981", tauxDefaut: 3.0,  plafond: 22950 },
  { id: "ldds",        label: "LDDS",               emoji: "🔵", color: "#3B82F6", tauxDefaut: 3.0,  plafond: 12000 },
  { id: "pel",         label: "PEL",                emoji: "🏠", color: "#8B5CF6", tauxDefaut: 2.25, plafond: 61200 },
  { id: "cel",         label: "CEL",                emoji: "🏡", color: "#6366F1", tauxDefaut: 2.0,  plafond: 15300 },
  { id: "livret_jeune",label: "Livret Jeune",       emoji: "🟡", color: "#F59E0B", tauxDefaut: 4.0,  plafond: 1600  },
  { id: "lep",         label: "LEP",                emoji: "🔴", color: "#EF4444", tauxDefaut: 6.1,  plafond: 10000 },
  { id: "livret_perso",label: "Livret bancaire",    emoji: "🏦", color: "#6B7280", tauxDefaut: 1.0,  plafond: null  },
  { id: "autre",       label: "Autre",              emoji: "📦", color: "#9CA3AF", tauxDefaut: 0,    plafond: null  },
];

function Epargne({ livrets, setLivrets, portfolio }) {
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [form, setForm] = useState({ nom: "", type: "livret_a", solde: "", taux: "", banque: "", dateOuverture: "" });

  const totalBourse   = portfolio.map(calcAsset).reduce((s, a) => s + a.value, 0);
  const totalLivrets  = livrets.reduce((s, l) => s + parseFloat(l.solde || 0), 0);
  const totalPatrimoine = totalBourse + totalLivrets;
  const interetsAnnuels = livrets.reduce((s, l) => s + parseFloat(l.solde || 0) * (parseFloat(l.taux || 0) / 100), 0);
  const interetsMensuels = interetsAnnuels / 12;

  const openAdd = () => {
    setEditItem(null);
    setForm({ nom: "", type: "livret_a", solde: "", taux: "3.0", banque: "", dateOuverture: new Date().toISOString().slice(0,10) });
    setShowModal(true);
  };
  const openEdit = (l) => {
    setEditItem(l);
    setForm({ nom: l.nom, type: l.type, solde: String(l.solde), taux: String(l.taux), banque: l.banque || "", dateOuverture: l.dateOuverture || "" });
    setShowModal(true);
  };
  const save = () => {
    const item = { ...form, id: editItem?.id || Date.now(), solde: parseFloat(form.solde), taux: parseFloat(form.taux) };
    setLivrets(ls => editItem ? ls.map(l => l.id === editItem.id ? item : l) : [...ls, item]);
    setShowModal(false);
  };
  const del = (id) => setLivrets(ls => ls.filter(l => l.id !== id));

  // Données graphique patrimoine — chaque livret individuellement
  const patrimoineData = [
    ...livrets.map(l => {
      const type = LIVRET_TYPES.find(t => t.id === l.type) || LIVRET_TYPES[6];
      return { name: l.nom || type.label, value: Math.round(parseFloat(l.solde) * 100) / 100, color: type.color, sub: l.banque || type.label };
    }),
    { name: "Portefeuille", value: Math.round(totalBourse * 100) / 100, color: "#3B82F6", sub: "Actions & ETFs" },
  ].filter(d => d.value > 0);

  // Palette de couleurs variées pour les livrets du même type
  const PALETTE = ["#10B981","#34D399","#6EE7B7","#A7F3D0","#F59E0B","#FBBF24","#8B5CF6","#A78BFA","#EF4444","#F87171","#06B6D4","#22D3EE"];
  patrimoineData.forEach((d, i) => {
    if (d.name !== "Portefeuille" && d.color === patrimoineData.find((x, j) => j < i && x.color === d.color)?.color) {
      d.color = PALETTE[i % PALETTE.length];
    }
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "#F9FAFB" }}>Épargne & Livrets</h2>
        <Btn onClick={openAdd}>+ Ajouter un livret</Btn>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 28 }}>
        <KpiCard label="Total livrets"     value={fmtEur(totalLivrets)}    sub={`${livrets.length} compte(s)`} positive={true} />
        <KpiCard label="Portefeuille"      value={fmtEur(totalBourse)}     sub="actions & ETFs" />
        <KpiCard label="Patrimoine total"  value={fmtEur(totalPatrimoine)} sub="livrets + bourse" positive={true} />
        <KpiCard label="Intérêts / an"     value={fmtEur(interetsAnnuels)} sub={`≈ ${fmtEur(interetsMensuels)}/mois`} positive={true} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginBottom: 24 }}>

        {/* Répartition patrimoine */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 600, color: "#F9FAFB", marginBottom: 16 }}>🥧 Répartition du patrimoine</div>
          {patrimoineData.length > 0 ? (
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <ResponsiveContainer width={170} height={170}>
                <PieChart>
                  <Pie data={patrimoineData} dataKey="value" cx="50%" cy="50%" outerRadius={80} innerRadius={36}>
                    {patrimoineData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#1F2937", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#F9FAFB" }} formatter={(v, n) => [fmtEur(v), n]} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, maxHeight: 200, overflowY: "auto" }}>
                {patrimoineData.map((d, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, color: "#F9FAFB", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.name}</div>
                        <div style={{ fontSize: 11, color: "#6B7280" }}>{d.sub}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: d.color }}>{fmtEur(d.value)}</div>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>{((d.value / totalPatrimoine) * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 8, marginTop: 4, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "#F9FAFB", fontWeight: 700 }}>Total patrimoine</span>
                  <span style={{ fontSize: 13, color: "#F9FAFB", fontWeight: 700 }}>{fmtEur(totalPatrimoine)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: "#6B7280", textAlign: "center", padding: 32 }}>Ajoutez un livret pour voir la répartition</div>
          )}
        </div>

        {/* Simulation intérêts */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 600, color: "#F9FAFB", marginBottom: 16 }}>📈 Projection des intérêts</div>
          {livrets.length > 0 ? (
            <div>
              {[1, 2, 3, 5].map(ans => {
                const projection = livrets.reduce((s, l) => {
                  const taux = parseFloat(l.taux) / 100;
                  return s + parseFloat(l.solde) * (Math.pow(1 + taux, ans) - 1);
                }, 0);
                return (
                  <div key={ans} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <span style={{ color: "#9CA3AF", fontSize: 14 }}>Dans {ans} an{ans > 1 ? "s" : ""}</span>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: "#10B981", fontWeight: 700, fontSize: 15 }}>+{fmtEur(projection)}</div>
                      <div style={{ color: "#6B7280", fontSize: 11 }}>→ {fmtEur(totalLivrets + projection)} au total</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ color: "#6B7280", textAlign: "center", padding: 32 }}>Ajoutez un livret pour voir les projections</div>
          )}
        </div>
      </div>

      {/* Liste des livrets */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 600, color: "#F9FAFB", marginBottom: 16 }}>🏦 Mes livrets</div>
        {livrets.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#6B7280" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏦</div>
            Aucun livret ajouté. Cliquez sur "+ Ajouter un livret" pour commencer.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {livrets.map(l => {
              const type     = LIVRET_TYPES.find(t => t.id === l.type) || LIVRET_TYPES[6];
              const interets = parseFloat(l.solde) * (parseFloat(l.taux) / 100);
              const plafond  = type.plafond;
              const pctPlafond = plafond ? (parseFloat(l.solde) / plafond) * 100 : null;
              return (
                <div key={l.id} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${type.color}30`, borderRadius: 14, padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 22 }}>{type.emoji}</span>
                      <div>
                        <div style={{ fontWeight: 700, color: "#F9FAFB", fontSize: 15 }}>{l.nom || type.label}</div>
                        <div style={{ fontSize: 11, color: "#6B7280" }}>{l.banque || type.label}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => openEdit(l)} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 14 }}>✏️</button>
                      <button onClick={() => del(l.id)}   style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: 14 }}>🗑</button>
                    </div>
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: type.color, fontFamily: "'Syne', sans-serif", marginBottom: 4 }}>{fmtEur(parseFloat(l.solde))}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: pctPlafond !== null ? 10 : 0 }}>
                    <span style={{ fontSize: 12, color: "#9CA3AF" }}>Taux : <strong style={{ color: type.color }}>{l.taux}%</strong></span>
                    <span style={{ fontSize: 12, color: "#10B981" }}>+{fmtEur(interets)}/an</span>
                  </div>
                  {pctPlafond !== null && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: "#6B7280" }}>Plafond réglementaire</span>
                        <span style={{ fontSize: 11, color: pctPlafond > 90 ? "#EF4444" : "#6B7280" }}>{pctPlafond.toFixed(0)}% — {fmtEur(plafond)}</span>
                      </div>
                      <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
                        <div style={{ height: "100%", width: `${Math.min(pctPlafond, 100)}%`, background: pctPlafond > 90 ? "#EF4444" : type.color, borderRadius: 2, transition: "width 0.3s" }} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal ajout/modif */}
      {showModal && (
        <Modal title={editItem ? "Modifier le livret" : "Ajouter un livret"} onClose={() => setShowModal(false)}>
          <Select label="Type de livret" value={form.type} onChange={e => {
            const t = LIVRET_TYPES.find(lt => lt.id === e.target.value);
            setForm(f => ({ ...f, type: e.target.value, taux: String(t?.tauxDefaut || 0) }));
          }}>
            {LIVRET_TYPES.map(t => <option key={t.id} value={t.id}>{t.emoji} {t.label} {t.tauxDefaut > 0 ? `— ${t.tauxDefaut}%` : ""}</option>)}
          </Select>
          <Input label="Nom personnalisé (optionnel)" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} placeholder="ex: Mon Livret A BNP" />
          <Input label="Banque" value={form.banque} onChange={e => setForm(f => ({ ...f, banque: e.target.value }))} placeholder="ex: BNP, Crédit Agricole..." />
          <Input label="Solde actuel (€)" type="number" value={form.solde} onChange={e => setForm(f => ({ ...f, solde: e.target.value }))} placeholder="0.00" />
          <Input label="Taux d'intérêt (%)" type="number" value={form.taux} onChange={e => setForm(f => ({ ...f, taux: e.target.value }))} placeholder="3.0" />
          <Input label="Date d'ouverture" type="date" value={form.dateOuverture} onChange={e => setForm(f => ({ ...f, dateOuverture: e.target.value }))} />
          <div style={{ display: "flex", gap: 12 }}>
            <Btn variant="ghost" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Annuler</Btn>
            <Btn onClick={save} style={{ flex: 1 }} disabled={!form.solde}>Enregistrer</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ────────────────── OBJECTIFS ────────────────── */
const OBJECTIF_TYPES = [
  { id: "urgence",   label: "Fonds d'urgence",   emoji: "🛡️", color: "#EF4444" },
  { id: "voiture",   label: "Voiture",            emoji: "🚗", color: "#F59E0B" },
  { id: "voyage",    label: "Voyage",             emoji: "✈️", color: "#3B82F6" },
  { id: "immo",      label: "Immobilier",         emoji: "🏠", color: "#8B5CF6" },
  { id: "retraite",  label: "Retraite",           emoji: "🌅", color: "#10B981" },
  { id: "etudes",    label: "Études",             emoji: "🎓", color: "#06B6D4" },
  { id: "projet",    label: "Projet perso",       emoji: "💡", color: "#F97316" },
  { id: "autre",     label: "Autre",              emoji: "🎯", color: "#6B7280" },
];

function Objectifs({ objectifs, setObjectifs, depenses, revenus, portfolio, livrets }) {
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [form, setForm] = useState({ nom: "", type: "urgence", cible: "", actuel: "", epargne: "", couleur: "" });

  // Calcul patrimoine disponible
  const totalBourse  = portfolio.map(calcAsset).reduce((s, a) => s + a.value, 0);
  const totalLivrets = livrets.reduce((s, l) => s + parseFloat(l.solde || 0), 0);

  // Calcul épargne mensuelle moyenne (3 derniers mois)
  const avgEpargne = (() => {
    const now = new Date();
    let totalEp = 0, months = 0;
    for (let i = 1; i <= 3; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.toISOString().slice(0, 7);
      const rev = revenus.filter(r => r.date.slice(0, 7) === m).reduce((s, r) => s + r.montant, 0);
      const dep = depenses.filter(d => d.date.slice(0, 7) === m).reduce((s, d) => s + d.montant, 0);
      if (rev > 0 || dep > 0) { totalEp += rev - dep; months++; }
    }
    return months > 0 ? Math.round(totalEp / months) : 0;
  })();

  // Projection avec intérêts composés (versements mensuels + rendement annuel)
  const calcProjection = (obj) => {
    const cible     = parseFloat(obj.cible)     || 0;
    const actuel    = parseFloat(obj.actuel)    || 0;
    const epargne   = parseFloat(obj.epargne)   || 0;
    const rendement = parseFloat(obj.rendement) || 0;
    const restant   = cible - actuel;
    if (restant <= 0) return { mois: 0, date: new Date(), atteint: true, totalInterets: 0, totalVerse: 0 };
    if (epargne <= 0 && rendement <= 0) return { mois: null, date: null, atteint: false, totalInterets: 0, totalVerse: 0 };

    const tauxMensuel = rendement > 0 ? Math.pow(1 + rendement / 100, 1 / 12) - 1 : 0;

    // Simulation mois par mois
    let capital = actuel;
    let mois = 0;
    const MAX_MOIS = 600; // 50 ans max
    while (capital < cible && mois < MAX_MOIS) {
      capital = capital * (1 + tauxMensuel) + epargne;
      mois++;
    }
    if (mois >= MAX_MOIS) return { mois: null, date: null, atteint: false, totalInterets: 0, totalVerse: 0 };

    const totalVerse    = epargne * mois;
    const totalInterets = Math.round((capital - actuel - totalVerse) * 100) / 100;
    const date = new Date();
    date.setMonth(date.getMonth() + mois);
    return { mois, date, atteint: false, totalInterets: Math.max(totalInterets, 0), totalVerse };
  };

  const openAdd = () => {
    setEditItem(null);
    setForm({ nom: "", type: "urgence", cible: "", actuel: "0", epargne: String(Math.max(avgEpargne, 0)), rendement: "0" });
    setShowModal(true);
  };
  const openEdit = (o) => { setEditItem(o); setForm({ nom: o.nom, type: o.type, cible: String(o.cible), actuel: String(o.actuel), epargne: String(o.epargne), rendement: String(o.rendement || 0) }); setShowModal(true); };
  const save = () => {
    const item = { ...form, id: editItem?.id || Date.now(), cible: parseFloat(form.cible), actuel: parseFloat(form.actuel), epargne: parseFloat(form.epargne), rendement: parseFloat(form.rendement) || 0 };
    setObjectifs(os => editItem ? os.map(o => o.id === editItem.id ? item : o) : [...os, item]);
    setShowModal(false);
  };
  const del = (id) => setObjectifs(os => os.filter(o => o.id !== id));
  const updateActuel = (id, val) => setObjectifs(os => os.map(o => o.id === id ? { ...o, actuel: parseFloat(val) || 0 } : o));

  const totalCibles  = objectifs.reduce((s, o) => s + (parseFloat(o.cible) || 0), 0);
  const totalActuels = objectifs.reduce((s, o) => s + (parseFloat(o.actuel) || 0), 0);
  const atteints     = objectifs.filter(o => parseFloat(o.actuel) >= parseFloat(o.cible)).length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "#F9FAFB" }}>Objectifs financiers</h2>
          <p style={{ color: "#6B7280", fontSize: 14, marginTop: 4 }}>Définissez vos cibles et suivez votre progression en temps réel.</p>
        </div>
        <Btn onClick={openAdd}>+ Nouvel objectif</Btn>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 28 }}>
        <KpiCard label="Objectifs définis"  value={objectifs.length}              sub="au total" />
        <KpiCard label="Objectifs atteints" value={atteints}                       sub={`sur ${objectifs.length}`} positive={atteints > 0} />
        <KpiCard label="Total à atteindre"  value={fmtEur(totalCibles)}           sub="somme des cibles" />
        <KpiCard label="Déjà accumulé"      value={fmtEur(totalActuels)}          sub={`${totalCibles > 0 ? ((totalActuels/totalCibles)*100).toFixed(0) : 0}% de l'objectif total`} positive={totalActuels > 0} />
      </div>

      {/* Épargne mensuelle détectée */}
      {avgEpargne !== 0 && (
        <div style={{ background: avgEpargne > 0 ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${avgEpargne > 0 ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`, borderRadius: 12, padding: "12px 20px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 14, color: "#D1D5DB" }}>
            💡 Épargne mensuelle moyenne détectée (3 derniers mois) :
            <strong style={{ color: avgEpargne > 0 ? "#10B981" : "#EF4444", marginLeft: 8 }}>{avgEpargne > 0 ? "+" : ""}{fmtEur(avgEpargne)}/mois</strong>
          </span>
          <span style={{ fontSize: 12, color: "#6B7280" }}>Utilisée pour les projections</span>
        </div>
      )}

      {/* Liste des objectifs */}
      {objectifs.length === 0 ? (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 20, padding: "60px 0", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
          <div style={{ color: "#9CA3AF", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Aucun objectif défini</div>
          <div style={{ color: "#6B7280", fontSize: 14, marginBottom: 24 }}>Créez votre premier objectif pour visualiser votre progression</div>
          <Btn onClick={openAdd}>+ Créer mon premier objectif</Btn>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {objectifs.map(obj => {
            const type      = OBJECTIF_TYPES.find(t => t.id === obj.type) || OBJECTIF_TYPES[7];
            const cible     = parseFloat(obj.cible)  || 0;
            const actuel    = parseFloat(obj.actuel) || 0;
            const pct       = cible > 0 ? Math.min((actuel / cible) * 100, 100) : 0;
            const restant   = Math.max(cible - actuel, 0);
            const proj      = calcProjection(obj);
            const atteint   = pct >= 100;

            return (
              <div key={obj.id} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${atteint ? type.color + "50" : "rgba(255,255,255,0.08)"}`, borderRadius: 16, padding: 24, position: "relative", overflow: "hidden" }}>
                {/* Fond coloré subtil */}
                <div style={{ position: "absolute", top: 0, left: 0, width: `${pct}%`, height: "100%", background: `${type.color}06`, transition: "width 0.8s ease", pointerEvents: "none" }} />

                <div style={{ position: "relative", display: "flex", gap: 20, alignItems: "flex-start" }}>
                  {/* Icône */}
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${type.color}20`, border: `1px solid ${type.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                    {atteint ? "✅" : type.emoji}
                  </div>

                  {/* Contenu */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17, color: "#F9FAFB" }}>{obj.nom || type.label}</div>
                        <div style={{ fontSize: 12, color: type.color, marginTop: 2 }}>{type.emoji} {type.label}</div>
                      </div>
                      <div style={{ display: "flex", align: "center", gap: 6 }}>
                        <button onClick={() => openEdit(obj)} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 16 }}>✏️</button>
                        <button onClick={() => del(obj.id)}   style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: 16 }}>🗑</button>
                      </div>
                    </div>

                    {/* Barre de progression */}
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 13, color: "#9CA3AF" }}>
                          <strong style={{ color: type.color, fontSize: 15 }}>{fmtEur(actuel)}</strong>
                          <span style={{ color: "#4B5563" }}> / {fmtEur(cible)}</span>
                        </span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: atteint ? "#10B981" : "#F9FAFB" }}>{pct.toFixed(1)}%</span>
                      </div>
                      <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: atteint ? "#10B981" : `linear-gradient(90deg, ${type.color}90, ${type.color})`, borderRadius: 4, transition: "width 0.8s ease" }} />
                      </div>
                    </div>

                    {/* Infos bas */}
                    <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
                      {/* Mise à jour solde rapide */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, color: "#6B7280" }}>Solde actuel :</span>
                        <input
                          type="number"
                          value={actuel}
                          onChange={e => updateActuel(obj.id, e.target.value)}
                          style={{ width: 90, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "3px 8px", color: "#F9FAFB", fontSize: 13, outline: "none" }}
                        />
                        <span style={{ fontSize: 12, color: "#6B7280" }}>€</span>
                      </div>

                      {/* Tags épargne + rendement */}
                      {parseFloat(obj.epargne) > 0 && (
                        <span style={{ fontSize: 12, background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 20, padding: "3px 10px", color: "#60A5FA" }}>
                          💰 {fmtEur(parseFloat(obj.epargne))}/mois
                        </span>
                      )}
                      {parseFloat(obj.rendement) > 0 && (
                        <span style={{ fontSize: 12, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 20, padding: "3px 10px", color: "#34D399" }}>
                          📈 {obj.rendement}%/an
                        </span>
                      )}
                    </div>

                    {/* Projection détaillée */}
                    {!atteint && (
                      <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
                        {proj.mois !== null ? (
                          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
                            <div>
                              <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 2 }}>Atteint dans</div>
                              <div style={{ fontSize: 15, fontWeight: 700, color: type.color }}>
                                {proj.mois < 12 ? `${proj.mois} mois` : `${Math.floor(proj.mois/12)} ans ${proj.mois%12 > 0 ? `${proj.mois%12} mois` : ""}`}
                              </div>
                              <div style={{ fontSize: 11, color: "#4B5563" }}>{proj.date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 2 }}>Versements totaux</div>
                              <div style={{ fontSize: 14, fontWeight: 600, color: "#60A5FA" }}>{fmtEur(proj.totalVerse)}</div>
                            </div>
                            {proj.totalInterets > 0 && (
                              <div>
                                <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 2 }}>Intérêts générés</div>
                                <div style={{ fontSize: 14, fontWeight: 600, color: "#34D399" }}>+{fmtEur(proj.totalInterets)}</div>
                                <div style={{ fontSize: 11, color: "#4B5563" }}>{((proj.totalInterets / parseFloat(obj.cible)) * 100).toFixed(1)}% de la cible</div>
                              </div>
                            )}
                            <div>
                              <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 2 }}>Reste à accumuler</div>
                              <div style={{ fontSize: 14, fontWeight: 600, color: "#F59E0B" }}>{fmtEur(restant)}</div>
                            </div>
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: "#EF4444" }}>⚠️ Définissez une épargne mensuelle pour voir la projection</span>
                        )}
                      </div>
                    )}
                    {atteint && <span style={{ fontSize: 13, fontWeight: 700, color: "#10B981", marginTop: 8, display: "block" }}>🎉 Objectif atteint !</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <Modal title={editItem ? "Modifier l'objectif" : "Nouvel objectif"} onClose={() => setShowModal(false)}>
          <Select label="Type d'objectif" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
            {OBJECTIF_TYPES.map(t => <option key={t.id} value={t.id}>{t.emoji} {t.label}</option>)}
          </Select>
          <Input label="Nom de l'objectif" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} placeholder="ex: Apport immobilier, Fonds d'urgence..." />
          <Input label="Montant cible (€)" type="number" value={form.cible} onChange={e => setForm(f => ({ ...f, cible: e.target.value }))} placeholder="ex: 10000" />
          <Input label="Montant déjà accumulé (€)" type="number" value={form.actuel} onChange={e => setForm(f => ({ ...f, actuel: e.target.value }))} placeholder="0" />
          <div>
            <Input label="Épargne mensuelle dédiée (€)" type="number" value={form.epargne} onChange={e => setForm(f => ({ ...f, epargne: e.target.value }))} placeholder={`ex: ${Math.max(avgEpargne, 200)}`} />
            {avgEpargne > 0 && <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>💡 Votre épargne moyenne détectée : {fmtEur(avgEpargne)}/mois</div>}
          </div>
          <div>
            <Input label="Rendement annuel visé (%)" type="number" value={form.rendement} onChange={e => setForm(f => ({ ...f, rendement: e.target.value }))} placeholder="ex: 5 (Livret A: 3, Bourse: 7-10, 0 = sans intérêts)" />
            <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>
              💡 Exemples : Livret A 3% • PEL 2,25% • Assurance-vie fonds € 3-4% • ETF World ~7-9%
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Btn variant="ghost" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Annuler</Btn>
            <Btn onClick={save} style={{ flex: 1 }} disabled={!form.cible || !form.nom}>Créer l'objectif</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ────────────────── PAGE AUTHENTIFICATION ────────────────── */
function AuthPage() {
  const [mode, setMode]         = useState("login"); // "login" | "register" | "reset"
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  const handle = async () => {
    setLoading(true); setError(""); setSuccess("");
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === "register") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccess("Compte créé ! Vérifiez votre boîte mail pour confirmer votre adresse.");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
        if (error) throw error;
        setSuccess("Email de réinitialisation envoyé !");
      }
    } catch (e) { setError(e.message || "Une erreur est survenue"); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#070B14", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #070B14; font-family: 'DM Sans', sans-serif; }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 40px #111827 inset !important; -webkit-text-fill-color: #F9FAFB !important; }
      `}</style>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📈</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: "#F9FAFB", letterSpacing: "-0.5px" }}>MonPortefeuille</div>
          <div style={{ fontSize: 13, color: "#6B7280", marginTop: 6 }}>Votre suivi financier personnel</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 32 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: "#F9FAFB", marginBottom: 24 }}>
            {mode === "login" ? "Connexion" : mode === "register" ? "Créer un compte" : "Mot de passe oublié"}
          </h2>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: "#9CA3AF", display: "block", marginBottom: 6 }}>Adresse e-mail</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()} placeholder="vous@exemple.fr"
              style={{ width: "100%", background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 16px", color: "#F9FAFB", fontSize: 14, outline: "none" }} />
          </div>
          {mode !== "reset" && (
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, color: "#9CA3AF", display: "block", marginBottom: 6 }}>Mot de passe</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()} placeholder="••••••••"
                style={{ width: "100%", background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 16px", color: "#F9FAFB", fontSize: 14, outline: "none" }} />
            </div>
          )}
          {error   && <div style={{ fontSize: 13, color: "#F87171", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>⚠️ {error}</div>}
          {success && <div style={{ fontSize: 13, color: "#34D399", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>✅ {success}</div>}
          <button onClick={handle} disabled={loading || !email || (mode !== "reset" && !password)}
            style={{ width: "100%", padding: "13px 0", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #3B82F6, #2563EB)", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", marginBottom: 20, opacity: loading ? 0.6 : 1 }}>
            {loading ? "Chargement..." : mode === "login" ? "Se connecter" : mode === "register" ? "Créer mon compte" : "Envoyer le lien"}
          </button>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
            {mode === "login" && <>
              <button onClick={() => { setMode("register"); setError(""); setSuccess(""); }} style={{ background: "none", border: "none", color: "#60A5FA", cursor: "pointer", fontSize: 13 }}>Pas encore de compte ? Créer un compte</button>
              <button onClick={() => { setMode("reset"); setError(""); setSuccess(""); }} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 12 }}>Mot de passe oublié ?</button>
            </>}
            {mode !== "login" && <button onClick={() => { setMode("login"); setError(""); setSuccess(""); }} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 13 }}>← Retour à la connexion</button>}
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "#374151" }}>Vos données sont privées et chiffrées 🔒</div>
      </div>
    </div>
  );
}

/* ────────────────── APP PRINCIPALE ────────────────── */
export default function App() {
  const [user, setUser]               = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoaded, setDataLoaded]   = useState(false);
  const [tab, setTab] = useState("dashboard");

  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [currentPrices, setCurrentPrices] = useState({});
  const [depenses, setDepenses] = useState([]);
  const [budgets, setBudgets]   = useState(INITIAL_BUDGETS);
  const [revenus, setRevenus]   = useState([]);
  const [historique, setHistorique] = useState([]);
  const [livrets, setLivrets]   = useState([]);
  const [objectifs, setObjectifs] = useState([]);

  // Auth : écoute les changements de session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) setDataLoaded(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Chargement des données depuis Supabase à la connexion
  useEffect(() => {
    if (!user || dataLoaded) return;
    (async () => {
      const { data } = await supabase.from("user_data").select("*").eq("id", user.id).single();
      if (data) {
        if (data.transactions)   setTransactions(data.transactions);
        if (data.current_prices) setCurrentPrices(data.current_prices);
        if (data.depenses)       setDepenses(data.depenses);
        if (data.budgets)        setBudgets(data.budgets);
        if (data.revenus)        setRevenus(data.revenus);
        if (data.historique)     setHistorique(data.historique);
        if (data.livrets)        setLivrets(data.livrets);
        if (data.objectifs)      setObjectifs(data.objectifs);
      } else {
        // Nouveau compte : partir de zéro
        setTransactions([]);
        setBudgets(INITIAL_BUDGETS);
      }
      setDataLoaded(true);
    })();
  }, [user, dataLoaded]);

  // Sauvegarde automatique dans Supabase (debounce 1,5s)
  const saveTimer = useRef(null);
  const saveToSupabase = useCallback(async (payload) => {
    if (!user || !dataLoaded) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      await supabase.from("user_data").upsert({ id: user.id, ...payload, updated_at: new Date().toISOString() });
    }, 1500);
  }, [user, dataLoaded]);

  useEffect(() => {
    if (!dataLoaded) return;
    saveToSupabase({ transactions, current_prices: currentPrices, depenses, budgets, revenus, historique, livrets, objectifs });
  }, [transactions, currentPrices, depenses, budgets, revenus, historique, livrets, objectifs]); // eslint-disable-line

  // Portefeuille calculé automatiquement
  const portfolio = useMemo(() => buildPortfolio(transactions, currentPrices), [transactions, currentPrices]);

  // Auto-snapshot quotidien
  useEffect(() => {
    if (portfolio.length === 0) return;
    const today = new Date().toISOString().slice(0, 10);
    const totalValue    = portfolio.reduce((s, a) => s + calcAsset(a).value, 0);
    const totalInvested = portfolio.reduce((s, a) => s + calcAsset(a).invested, 0);
    setHistorique(prev => {
      const last = prev.find(h => h.date === today);
      if (last && Math.abs(last.valeur - totalValue) < 0.01) return prev;
      const filtered = prev.filter(h => h.date !== today);
      return [...filtered, { date: today, valeur: Math.round(totalValue * 100) / 100, investi: Math.round(totalInvested * 100) / 100 }].sort((a, b) => a.date.localeCompare(b.date));
    });
  }, [currentPrices, transactions]);

  // Tous les hooks doivent être déclarés AVANT tout return conditionnel
  const { refreshing, loadingIds, lastUpdate, errors, autoStatus, refreshAll, refreshOne } = usePriceRefresh(portfolio, setCurrentPrices);

  const [showBackupModal, setShowBackupModal] = useState(false);
  const [importBackupError, setImportBackupError] = useState("");
  const [backupSuccess, setBackupSuccess] = useState("");
  const backupInputRef = useRef(null);

  // Écrans de chargement / auth (après tous les hooks)
  if (authLoading) return (
    <div style={{ minHeight: "100vh", background: "#070B14", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>📈</div>
        <div style={{ color: "#6B7280", fontSize: 14 }}>Chargement...</div>
      </div>
    </div>
  );
  if (!user) return <AuthPage />;
  if (!dataLoaded) return (
    <div style={{ minHeight: "100vh", background: "#070B14", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>📊</div>
        <div style={{ color: "#6B7280", fontSize: 14 }}>Chargement de vos données...</div>
      </div>
    </div>
  );

  const exportBackup = () => {
    const data = {
      version: 2,
      exportedAt: new Date().toISOString(),
      transactions, currentPrices, depenses, budgets, revenus, historique, livrets, objectifs,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `monportefeuille_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupSuccess("✅ Sauvegarde téléchargée !");
    setTimeout(() => setBackupSuccess(""), 3000);
  };

  const importBackup = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImportBackupError("");
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data.version || !data.transactions) throw new Error("Fichier invalide");
      if (data.transactions)  setTransactions(data.transactions);
      if (data.currentPrices) setCurrentPrices(data.currentPrices);
      if (data.depenses)      setDepenses(data.depenses);
      if (data.budgets)       setBudgets(data.budgets);
      if (data.revenus)       setRevenus(data.revenus);
      if (data.historique)    setHistorique(data.historique);
      if (data.livrets)       setLivrets(data.livrets);
      if (data.objectifs)     setObjectifs(data.objectifs);
      setBackupSuccess(`✅ Données restaurées depuis le ${new Date(data.exportedAt).toLocaleDateString("fr-FR")} !`);
      setTimeout(() => { setBackupSuccess(""); setShowBackupModal(false); }, 2500);
    } catch {
      setImportBackupError("Fichier invalide. Utilisez uniquement un fichier exporté depuis MonPortefeuille.");
    }
    e.target.value = "";
  };

  const NAV = [
    { type: "item",    id: "dashboard",    label: "Tableau de bord", icon: "🏠" },
    { type: "section", label: "Patrimoine" },
    { type: "item",    id: "portfolio",    label: "Portefeuille",    icon: "📈" },
    { type: "item",    id: "epargne",      label: "Épargne",         icon: "🏦" },
    { type: "item",    id: "transactions", label: "Transactions",    icon: "📋" },
    { type: "section", label: "Budget & Dépenses" },
    { type: "item",    id: "budget",       label: "Budget mensuel",  icon: "💰" },
    { type: "item",    id: "depenses",     label: "Dépenses",        icon: "💸" },
    { type: "item",    id: "objectifs",    label: "Objectifs",       icon: "🎯" },
    { type: "section", label: "Analyse" },
    { type: "item",    id: "ai",           label: "Conseils",        icon: "🤖" },
  ];

  // KPIs rapides pour la sidebar
  const totalBourse  = portfolio.map(calcAsset).reduce((s, a) => s + a.value, 0);
  const totalLivrets = livrets.reduce((s, l) => s + parseFloat(l.solde || 0), 0);
  const totalPatrimoine = totalBourse + totalLivrets;
  const totalPnL     = portfolio.map(calcAsset).reduce((s, a) => s + a.pnl, 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&family=DM+Mono&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #070B14; color: #F9FAFB; font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        select option { background: #1F2937; }

        /* ── SIDEBAR DESKTOP ── */
        .sidebar {
          width: 60px;
          transition: width 0.25s cubic-bezier(0.4,0,0.2,1);
          overflow: hidden;
        }
        .sidebar:hover { width: 260px; }
        .sidebar-label {
          opacity: 0; white-space: nowrap;
          transition: opacity 0.15s ease; pointer-events: none;
        }
        .sidebar:hover .sidebar-label { opacity: 1; }
        .sidebar-kpi {
          opacity: 0; max-height: 0; overflow: hidden;
          transition: opacity 0.2s ease, max-height 0.25s ease;
        }
        .sidebar:hover .sidebar-kpi { opacity: 1; max-height: 160px; }
        .sidebar-logo-text {
          opacity: 0; transition: opacity 0.2s ease 0.1s;
          overflow: hidden; white-space: nowrap; min-width: 0; flex-shrink: 1;
        }
        .sidebar:hover .sidebar-logo-text { opacity: 1; }
        .main-content {
          margin-left: 60px;
          transition: margin-left 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .sidebar:hover ~ .main-content { margin-left: 260px; }
        .nav-btn {
          width: 100%; display: flex; align-items: center; gap: 10px;
          padding: 10px 18px; border-radius: 10px; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 14px; margin-bottom: 2px;
          text-align: left; transition: all 0.15s; border-left: 3px solid transparent;
        }
        .nav-btn:hover { background: rgba(255,255,255,0.06) !important; color: #F9FAFB !important; }
        .sidebar-section {
          opacity: 0; transition: opacity 0.15s ease; pointer-events: none;
          font-size: 10px; font-weight: 700; color: #4B5563;
          text-transform: uppercase; letter-spacing: 0.1em;
          padding: 20px 8px 6px 20px; white-space: nowrap;
        }
        .sidebar:hover .sidebar-section { opacity: 1; }
        .sidebar-divider {
          height: 1px; background: rgba(255,255,255,0.06);
          margin: 8px 12px; transition: margin 0.25s ease;
        }
        .sidebar:hover .sidebar-divider { margin: 0; }

        /* ── RESPONSIVE MOBILE ── */
        @media (max-width: 768px) {
          .sidebar { display: none !important; }
          .main-content { margin-left: 0 !important; padding-bottom: 72px; }
          .bottom-nav {
            display: flex !important;
            position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
            background: rgba(7,11,20,0.97); backdrop-filter: blur(20px);
            border-top: 1px solid rgba(255,255,255,0.08);
            padding: 8px 0 max(8px, env(safe-area-inset-bottom)) 0;
          }
          .topbar-market { display: none !important; }
          .topbar-time   { display: none !important; }
          .topbar-refresh span:last-child { display: none; }
          .responsive-grid-3 { grid-template-columns: repeat(2, 1fr) !important; }
          .responsive-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
          .responsive-grid-2-1 { grid-template-columns: 1fr !important; }
          .responsive-grid-3cols { grid-template-columns: 1fr !important; }
          .hero-kpis { grid-template-columns: repeat(2, 1fr) !important; }
          .hero-amount { font-size: clamp(28px, 8vw, 52px) !important; }
          .page-padding { padding: 16px !important; }
          .topbar-padding { padding: 0 16px !important; }
          .table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .hide-mobile { display: none !important; }
          .card-mobile { padding: 16px !important; }
        }
        @media (min-width: 769px) {
          .bottom-nav { display: none !important; }
        }
      `}</style>

      {/* Fond ambiant */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: -200, left: -200, width: 600, height: 600, background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: -200, right: -200, width: 600, height: 600, background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, display: "flex", minHeight: "100vh" }}>

        {/* ── SIDEBAR ── */}
        <aside className="sidebar" style={{
          flexShrink: 0,
          background: "rgba(7,11,20,0.97)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0, left: 0, bottom: 0,
          zIndex: 100,
          overflowY: "auto",
          overflowX: "hidden",
        }}>
          {/* Logo */}
          <div style={{ padding: "18px 12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
              <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#3B82F6,#6366F1)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>💼</div>
              <div className="sidebar-logo-text">
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, color: "#FFFFFF", whiteSpace: "nowrap", letterSpacing: "-0.2px" }}>MonPortefeuille</div>
                <div style={{ fontSize: 10, color: "#6B7280", marginTop: 1 }}>{new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}</div>
              </div>
            </div>

            {/* Mini KPIs — visibles seulement au survol */}
            <div className="sidebar-kpi" style={{ marginTop: 14 }}>
              <div style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Patrimoine total</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#FFFFFF", fontFamily: "'Syne', sans-serif", letterSpacing: "-0.5px" }}>{fmtEur(totalPatrimoine)}</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <div>
                    <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 2 }}>Bourse</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#60A5FA" }}>{fmtEur(totalBourse)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 2 }}>Livrets</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#34D399" }}>{fmtEur(totalLivrets)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 2 }}>+/−</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: totalPnL >= 0 ? "#34D399" : "#F87171" }}>{totalPnL >= 0 ? "+" : ""}{fmtEur(totalPnL)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav style={{ flex: 1, padding: "12px 6px" }}>
            {NAV.map((item, i) => {
              if (item.type === "section") return (
                <div key={i}>
                  <div className="sidebar-divider" />
                  <div className="sidebar-section">{item.label}</div>
                </div>
              );
              const active = tab === item.id;
              return (
                <button key={item.id} onClick={() => setTab(item.id)} className="nav-btn" style={{
                  background: active ? "rgba(59,130,246,0.15)" : "transparent",
                  color: active ? "#3B82F6" : "#9CA3AF",
                  fontWeight: active ? 600 : 400,
                  borderLeft: `3px solid ${active ? "#3B82F6" : "transparent"}`,
                }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                  <span className="sidebar-label" style={{ color: active ? "#3B82F6" : "#9CA3AF" }}>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer sidebar : email + déconnexion */}
          <div style={{ padding: "12px 6px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: 6 }}>
            <div className="sidebar-kpi" style={{ padding: "8px 12px", marginBottom: 4 }}>
              <div style={{ fontSize: 10, color: "#4B5563", marginBottom: 2 }}>Connecté en tant que</div>
              <div style={{ fontSize: 11, color: "#6B7280", wordBreak: "break-all" }}>{user?.email}</div>
            </div>
            <button onClick={() => { setImportBackupError(""); setBackupSuccess(""); setShowBackupModal(true); }} className="nav-btn" style={{ background: "rgba(255,255,255,0.03)", color: "#6B7280", border: "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>💾</span>
              <span className="sidebar-label">Sauvegarder / Importer</span>
            </button>
            <button onClick={() => supabase.auth.signOut()} className="nav-btn" style={{ background: "rgba(239,68,68,0.06)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.15)" }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>🚪</span>
              <span className="sidebar-label">Déconnexion</span>
            </button>
          </div>
        </aside>

        {/* ── BOTTOM NAV MOBILE ── */}
        <nav className="bottom-nav" style={{ display: "none" }}>
          {NAV.filter(n => n.type === "item").map(item => {
            const active = tab === item.id;
            return (
              <button key={item.id} onClick={() => setTab(item.id)} style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                gap: 3, padding: "6px 0", background: "none", border: "none",
                color: active ? "#3B82F6" : "#6B7280", cursor: "pointer", fontSize: 10,
                fontFamily: "'DM Sans', sans-serif", fontWeight: active ? 600 : 400,
              }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <span style={{ fontSize: 9, whiteSpace: "nowrap" }}>{item.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </nav>

        {/* ── CONTENU PRINCIPAL ── */}
        <div className="main-content" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

          {/* Topbar */}
          <div style={{
            background: "rgba(7,11,20,0.8)", backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            padding: "0 32px", height: 56,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            position: "sticky", top: 0, zIndex: 50,
          }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#F9FAFB" }}>
              {NAV.find(n => n.id === tab)?.icon} {NAV.find(n => n.id === tab)?.label}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Badge marché ouvert/fermé */}
              <div className="topbar-market" style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 20, background: isMarketOpen() ? "rgba(16,185,129,0.1)" : "rgba(107,114,128,0.1)", border: `1px solid ${isMarketOpen() ? "rgba(16,185,129,0.3)" : "rgba(107,114,128,0.2)"}` }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: isMarketOpen() ? "#10B981" : "#6B7280", boxShadow: isMarketOpen() ? "0 0 6px #10B981" : "none" }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: isMarketOpen() ? "#10B981" : "#6B7280" }}>
                  {isMarketOpen() ? "Marché ouvert" : "Marché fermé"}
                </span>
              </div>

              {/* Dernière mise à jour */}
              {lastUpdate && (
                <span className="topbar-time" style={{ fontSize: 12, color: "#6B7280" }}>
                  Cours : {lastUpdate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
              {!lastUpdate && (
                <span className="topbar-time" style={{ fontSize: 12, color: "#6B7280" }}>Chargement des cours...</span>
              )}

              {/* Bouton refresh */}
              <button className="topbar-refresh"
                onClick={() => refreshAll(false)}
                disabled={refreshing}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
                  background: refreshing ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.04)",
                  color: refreshing ? "#3B82F6" : "#9CA3AF",
                  cursor: refreshing ? "not-allowed" : "pointer", fontSize: 12, fontWeight: 500,
                }}
              >
                <span style={{ display: "inline-block", animation: refreshing ? "spin 1s linear infinite" : "none", fontSize: 14 }}>↻</span>
                <span>{refreshing ? "Mise à jour..." : "Actualiser"}</span>
              </button>
            </div>
          </div>

          <style>{`
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
          `}</style>

          <main style={{ flex: 1, padding: "clamp(16px, 4vw, 32px)" }}>
            {tab === "dashboard"    && <Dashboard portfolio={portfolio} transactions={transactions} historique={historique} depenses={depenses} revenus={revenus} livrets={livrets} objectifs={objectifs} />}
            {tab === "portfolio"    && <Portfolio portfolio={portfolio} setCurrentPrices={setCurrentPrices} refreshAll={refreshAll} refreshOne={refreshOne} loadingIds={loadingIds} errors={errors} refreshing={refreshing} lastUpdate={lastUpdate} />}
            {tab === "transactions" && <Transactions transactions={transactions} setTransactions={setTransactions} />}
            {tab === "epargne"      && <Epargne livrets={livrets} setLivrets={setLivrets} portfolio={portfolio} />}
            {tab === "budget"       && <Budget depenses={depenses} revenus={revenus} setRevenus={setRevenus} />}
            {tab === "depenses"     && <Depenses depenses={depenses} setDepenses={setDepenses} budgets={budgets} setBudgets={setBudgets} setRevenus={setRevenus} />}
            {tab === "objectifs"    && <Objectifs objectifs={objectifs} setObjectifs={setObjectifs} depenses={depenses} revenus={revenus} portfolio={portfolio} livrets={livrets} />}
            {tab === "ai"           && <Recommendations portfolio={portfolio} depenses={depenses} revenus={revenus} livrets={livrets} objectifs={objectifs} />}
          </main>
        </div>
      </div>

      {/* Modal sauvegarde */}
      {showBackupModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowBackupModal(false)}>
          <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "clamp(16px,4vw,32px)", width: 480, maxWidth: "92vw" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: "#F9FAFB", marginBottom: 8 }}>💾 Sauvegarde des données</div>
            <p style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>Vos données sont stockées dans votre navigateur. Exportez-les régulièrement pour éviter toute perte.</p>
            {backupSuccess && <div style={{ background: "#10B98120", border: "1px solid #10B98140", borderRadius: 10, padding: 12, marginBottom: 16, color: "#10B981", fontSize: 14, textAlign: "center" }}>{backupSuccess}</div>}
            {importBackupError && <div style={{ background: "#EF444420", border: "1px solid #EF444440", borderRadius: 10, padding: 12, marginBottom: 16, color: "#EF4444", fontSize: 14 }}>{importBackupError}</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button onClick={exportBackup} style={{ background: "linear-gradient(135deg,#3B82F6,#6366F1)", border: "none", borderRadius: 12, padding: "14px 20px", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>⬇️ Exporter ma sauvegarde (.json)</button>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.15)", borderRadius: 12, padding: "14px 20px", textAlign: "center", cursor: "pointer" }} onClick={() => backupInputRef.current?.click()}>
                <div style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 4 }}>⬆️ Restaurer depuis un fichier</div>
                <div style={{ color: "#6B7280", fontSize: 12 }}>Cliquez pour sélectionner votre fichier .json</div>
              </div>
              <input ref={backupInputRef} type="file" accept=".json" onChange={importBackup} style={{ display: "none" }} />
            </div>
            <div style={{ marginTop: 20, padding: "12px 16px", background: "#F59E0B10", border: "1px solid #F59E0B20", borderRadius: 10, fontSize: 12, color: "#F59E0B", lineHeight: 1.6 }}>
              💡 Exportez une fois par semaine et stockez dans Google Drive ou OneDrive.
            </div>
            <button onClick={() => setShowBackupModal(false)} style={{ marginTop: 16, width: "100%", background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px", color: "#9CA3AF", cursor: "pointer", fontSize: 14 }}>Fermer</button>
          </div>
        </div>
      )}
    </>
  );
}
