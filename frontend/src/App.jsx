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
// import Login from "./pages/Login";
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
    <div>
      <nav
        style={{
          display: "flex",
          gap: 12,
          padding: 12,
          borderBottom: "1px solid #eee",
        }}
      >
        <Link to="/">Home</Link>
        <Link to="/tasks">Tasks</Link>

        {user ? (
          <span style={{ marginLeft: "auto" }}>
            {user.email}{" "}
            <button onClick={handleLogout} style={{ marginLeft: 6 }}>
              Logout
            </button>
          </span>
        ) : (
          <span style={{ marginLeft: "auto" }}>
            <Link to="/login">Login</Link> ·{" "}
            <Link to="/register">Register</Link>
          </span>
        )}
      </nav>

      <div style={{ padding: 16 }}>
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomeRedirect />} />
          {/* <Route path="/tasks" element={<Tasks />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
