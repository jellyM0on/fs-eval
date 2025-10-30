import { useState } from "react";

import api from "../api/axios";

import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const id = localStorage.getItem("userId");
    const email = localStorage.getItem("email");
    return id ? { id: Number(id), email } : null;
  });

  async function login(email, password) {
    const res = await api.post("/users/login", { email, password });
    const { id, email: e } = res.data;
    localStorage.setItem("userId", String(id));
    localStorage.setItem("email", e);
    setUser({ id, email: e });
    return { id, email: e };
  }

  async function register(email, password) {
    await api.post("/users/register", { email, password });
    return login(email, password);
  }

  function logout() {
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    setUser(null);
  }

  const value = { user, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
