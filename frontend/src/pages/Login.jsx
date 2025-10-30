import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      nav("/tasks");
    } catch (err) {
      setError(err?.response?.data ?? "Login failed");
    }
  }
  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    boxSizing: "border-box",
    border: "1px solid #ccc",
    borderRadius: 6,
    fontSize: 15,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  return (
    <div
      style={{
        width: "fit-content",
        margin: "40px",
        padding: 24,
        border: "1px solid #eee",
        borderRadius: 10,
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      <h2>Login</h2>
      {error && <p style={{ color: "crimson" }}>{String(error)}</p>}

      <form onSubmit={onSubmit}>
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.target.style)}
          onBlur={(e) => Object.assign(e.target.style, inputStyle)}
          required
        />

        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.target.style)}
          onBlur={(e) => Object.assign(e.target.style, inputStyle)}
          required
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            border: "none",
            borderRadius: 6,
            backgroundColor: "#010102ff",
            color: "white",
            fontSize: 16,
          }}
        >
          Login
        </button>
      </form>

      <p style={{ marginTop: 12, textAlign: "center" }}>
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
