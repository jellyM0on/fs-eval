import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "" });
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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

  const primaryBtn = {
    padding: "10px",
    border: "none",
    borderRadius: 6,
    backgroundColor: "#010102ff",
    color: "white",
    fontSize: 16,
    cursor: "pointer",
  };

  const subtleBtn = {
    padding: "8px 10px",
    border: "1px solid #e6e6e6",
    borderRadius: 6,
    background: "white",
    fontSize: 14,
    cursor: "pointer",
  };

  async function load() {
    setError("");
    try {
      const res = await api.get("/tasks");
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err?.response?.data ?? "Failed to fetch tasks.");
      setTasks([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addTask(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    try {
      await api.post("/tasks", { title: form.title, isDone: false });
      setForm({ title: "" });
      load();
    } catch (err) {
      alert(err?.response?.data ?? "Failed to create task");
    }
  }

  async function toggle(task) {
    try {
      await api.put(`/tasks/${task.id}`, {
        id: task.id,
        title: task.title,
        isDone: !task.isDone,
      });
      load();
    } catch (err) {
      alert(err?.response?.data ?? "Failed to update task");
    }
  }

  function confirmDelete(id) {
    setDeleteId(id);
    setShowModal(true);
  }

  async function handleDelete() {
    if (deleteId == null) return;
    try {
      await api.delete(`/tasks/${deleteId}`);
      setShowModal(false);
      setDeleteId(null);
      load();
    } catch (err) {
      alert(err?.response?.data ?? "Failed to delete task");
    }
  }

  function cancelDelete() {
    setShowModal(false);
    setDeleteId(null);
  }

  return (
    <div
      style={{
        width: "75%",
        margin: "40px",
        padding: 24,
        border: "1px solid #eee",
        borderRadius: 10,
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>Tasks</h2>
      </div>

      {error && (
        <p style={{ color: "crimson", marginTop: 10 }}>{String(error)}</p>
      )}

      <form onSubmit={addTask} style={{ marginTop: 12, marginBottom: 12 }}>
        <input
          placeholder="New task title"
          value={form.title}
          onChange={(e) => setForm({ title: e.target.value })}
          style={inputStyle}
        />
        <button type="submit" style={{ ...primaryBtn, width: "100%" }}>
          Add Task
        </button>
      </form>

      {tasks.length ? (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            marginTop: 8,
            display: "grid",
            gap: 8,
          }}
        >
          {tasks.map((t) => (
            <li
              key={t.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                border: "1px solid #eee",
                borderRadius: 8,
                background: "#fff",
              }}
            >
              <button
                onClick={() => toggle(t)}
                title="Toggle complete"
                style={subtleBtn}
              >
                {t.isDone ? "✅" : "⬜️"}
              </button>

              <span
                style={{
                  flex: 1,
                  textDecoration: t.isDone ? "line-through" : "none",
                }}
              >
                {t.title}
              </span>

              <button
                onClick={() => confirmDelete(t.id)}
                style={{
                  ...subtleBtn,
                  color: "crimson",
                  borderColor: "#f0c4c4",
                }}
                title="Delete task"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        !error && <p style={{ marginTop: 8 }}>No tasks found.</p>
      )}

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 10,
              boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
              width: 320,
              textAlign: "center",
            }}
          >
            <h3 style={{ marginBottom: 16 }}>Delete Task?</h3>
            <p style={{ marginBottom: 24 }}>This action cannot be undone.</p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <button onClick={cancelDelete} style={{ ...subtleBtn, flex: 1 }}>
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{
                  ...primaryBtn,
                  flex: 1,
                  backgroundColor: "crimson",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
