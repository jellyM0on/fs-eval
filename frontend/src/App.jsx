import {
  BrowserRouter,
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "./auth/AuthContext";

import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Tasks from "./pages/Tasks";

function HomeRedirect() {
  const { user } = useAuth() || {};
  return user ? (
    <Navigate to="/tasks" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}

function PrivateRoute({ children }) {
  const { user } = useAuth() || {};
  return user ? children : <Navigate to="/login" replace />;
}

function Layout() {
  const auth = useAuth();
  const user = auth?.user;
  const logout = auth?.logout;
  const navigate = useNavigate();

  function handleLogout() {
    logout?.();
    navigate("/login", { replace: true });
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100vw",
        margin: 0,
        backgroundColor: "#fff",
      }}
    >
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 24px",
          borderBottom: "1px solid #eee",
          backgroundColor: "#f8f9fa",
          width: "100%",
          boxSizing: "border-box",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/">Home</Link>
          {user && <Link to="/tasks">Tasks</Link>}
        </div>

        {user ? (
          <div>
            {user.email}{" "}
            <button onClick={handleLogout} style={{ marginLeft: 6 }}>
              Logout
            </button>
          </div>
        ) : (
          <div>
            <Link to="/login">Login</Link> ·{" "}
            <Link to="/register">Register</Link>
          </div>
        )}
      </nav>

      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomeRedirect />} />

          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                {/* <Tasks /> */}
              </PrivateRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
