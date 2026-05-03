import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://127.0.0.1:5000";

export default function App() {
  const [email, setEmail] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [usage, setUsage] = useState([]);
  const [filteredUsage, setFilteredUsage] = useState([]);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(false); // LIGHT DEFAULT
  const [endpoint, setEndpoint] = useState("todos");

  const theme = dark
    ? {
        bg: "#111827",
        card: "#1f2937",
        text: "#f9fafb",
        accent: "#6366f1",
        border: "#374151",
      }
    : {
        bg: "#f8fafc",
        card: "#ffffff",
        text: "#111827",
        accent: "#4f46e5",
        border: "#e5e7eb",
      };

  useEffect(() => {
    setFilteredUsage(
      usage.filter((u) =>
        u.url.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query, usage]);

  const signup = async () => {
    setLoading(true);
    const res = await axios.post(`${API}/auth/signup`, { email });
    setApiKey(res.data.apiKey);
    setLoading(false);
    setMessage("API Key generated");
  };

  const callAPI = async () => {
    setLoading(true);
    const res = await axios.get(
      `${API}/proxy?url=https://jsonplaceholder.typicode.com/${endpoint}/1&apiKey=${apiKey}`
    );
    setResponse(JSON.stringify(res.data, null, 2));
    setLoading(false);
  };

  const fetchUsage = async () => {
    const res = await axios.get(`${API}/usage/${apiKey}`);
    setUsage(res.data);
  };

  const exportLogs = () => {
    const blob = new Blob([JSON.stringify(usage)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "usage.json";
    a.click();
  };

  const billing = (usage.length * 0.2).toFixed(2);

  return (
    <div style={{ ...styles.container, background: theme.bg, color: theme.text }}>

      {/* NAVBAR */}
      <div style={styles.navbar(theme)}>
        <h2 style={{ fontWeight: "600" }}>MeterFlow</h2>

        <button
          style={styles.toggleBtn(theme)}
          onClick={() => setDark(!dark)}
        >
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <div style={styles.main}>

        <h1 style={styles.heading}>Dashboard</h1>
        {message && <p style={{ color: theme.accent }}>{message}</p>}

        {/* CARDS */}
        <div style={styles.cards}>
          <Card title="Requests" value={usage.length} theme={theme} />
          <Card title="Billing" value={`₹${billing}`} theme={theme} />
          <Card title="Status" value={apiKey ? "Active" : "Inactive"} theme={theme} />
        </div>

        {/* API KEY */}
        <div style={styles.card(theme)}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            style={styles.input(theme)}
          />

          <button style={styles.primaryBtn(theme)} onClick={signup}>
            {loading ? "Generating..." : "Generate Key"}
          </button>

          {apiKey && (
            <div style={styles.apiBox}>
              {apiKey}
            </div>
          )}
        </div>

        {/* PLAYGROUND */}
        {apiKey && (
          <div style={styles.card(theme)}>
            <select
              onChange={(e) => setEndpoint(e.target.value)}
              style={styles.input(theme)}
            >
              <option value="todos">Todos</option>
              <option value="posts">Posts</option>
              <option value="users">Users</option>
            </select>

            <button style={styles.primaryBtn(theme)} onClick={callAPI}>
              Call API
            </button>

            <button style={styles.secondaryBtn(theme)} onClick={fetchUsage}>
              Load Usage
            </button>

            <button style={styles.secondaryBtn(theme)} onClick={exportLogs}>
              Export Logs
            </button>

            {response && <pre style={styles.pre}>{response}</pre>}
          </div>
        )}

        {/* SEARCH */}
        <input
          placeholder="Search logs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ ...styles.input(theme), marginBottom: "20px" }}
        />

        {/* TABLE */}
        <div style={styles.card(theme)}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>URL</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsage.map((u, i) => (
                <tr key={i}>
                  <td>{u.url}</td>
                  <td>{u.status}</td>
                  <td>{new Date(u.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

function Card({ title, value, theme }) {
  return (
    <div style={styles.card(theme)}>
      <h4 style={{ opacity: 0.7 }}>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    fontFamily: "Inter, system-ui, Arial",
  },

  navbar: (theme) => ({
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 30px",
    borderBottom: `1px solid ${theme.border}`,
    background: theme.card,
  }),

  toggleBtn: (theme) => ({
    background: theme.accent,
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
  }),

  main: {
    padding: "30px",
  },

  heading: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "10px",
  },

  cards: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
  },

  card: (theme) => ({
    flex: 1,
    background: theme.card,
    padding: "20px",
    borderRadius: "12px",
    border: `1px solid ${theme.border}`,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    marginBottom: "20px",
  }),

  input: (theme) => ({
    padding: "10px",
    marginRight: "10px",
    borderRadius: "8px",
    border: `1px solid ${theme.border}`,
    background: theme.card,
    color: theme.text,
  }),

  primaryBtn: (theme) => ({
    background: theme.accent,
    color: "white",
    padding: "10px 14px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginRight: "10px",
  }),

  secondaryBtn: (theme) => ({
    background: "transparent",
    border: `1px solid ${theme.border}`,
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
  }),

  key: {
    marginTop: "10px",
    fontSize: "12px",
    opacity: 0.7,
  },

  pre: {
    background: "#020617",
    color: "#22c55e",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
  },

  table: {
    width: "100%",
    marginTop: "10px",
  },
};