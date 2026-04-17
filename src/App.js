import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);

  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const savedTheme = JSON.parse(localStorage.getItem("theme"));
    if (savedTheme) setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(darkMode));
  }, [darkMode]);

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 1800);
  };

  const addTask = () => {
    if (text.trim() === "") return;

    if (editId) {
      setTasks(tasks.map(t => (t.id === editId ? { ...t, title: text } : t)));
      setEditId(null);
      showToast("Görev güncellendi ✏️", "info");
    } else {
      setTasks([...tasks, { id: Date.now(), title: text, done: false }]);
      showToast("Görev eklendi ✔️", "success");
    }

    setText("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
    showToast("Görev silindi 🗑️", "error");
  };

  const editTask = (task) => {
    setText(task.title);
    setEditId(task.id);
  };

  const toggleDone = (id) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.done;
    if (filter === "done") return task.done;
    return true;
  });

  return (
    <div className={darkMode ? "bg-dark text-light min-vh-100" : "bg-light min-vh-100"}>

      {/* TOAST */}
      {toast.show && (
        <div
          className={`position-fixed top-0 end-0 m-3 p-3 rounded shadow text-white ${
            toast.type === "success"
              ? "bg-success"
              : toast.type === "error"
              ? "bg-danger"
              : "bg-info"
          }`}
          style={{ zIndex: 9999 }}
        >
          {toast.message}
        </div>
      )}

      {/* CENTER + FULL HEIGHT */}
      <div className="container py-5 min-vh-100 d-flex align-items-center justify-content-center">

        <div className="col-md-8 col-lg-6">

          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold">🏢 Apartman Görev Takip</h4>

            <button
              className={`btn ${darkMode ? "btn-light text-dark" : "btn-dark"}`}
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>

          {/* CARD */}
          <div className={`card shadow-lg border-0 rounded-4 ${darkMode ? "bg-secondary text-light" : ""}`}>

            <div className="card-header text-center fw-semibold">
              Toplam görev: {tasks.length}
            </div>

            <div className="card-body">

              {/* FILTER */}
              <div className="d-flex justify-content-center mb-3 gap-2">
                <button className="btn btn-light btn-sm text-dark fw-semibold" onClick={() => setFilter("all")}>
                  Tümü
                </button>
                <button className="btn btn-warning btn-sm text-dark fw-semibold" onClick={() => setFilter("active")}>
                  Aktif
                </button>
                <button className="btn btn-success btn-sm text-dark fw-semibold" onClick={() => setFilter("done")}>
                  Tamamlanan
                </button>
              </div>

              {/* INPUT */}
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Görev yaz..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                />
                <button
                  className={`btn ${editId ? "btn-warning" : "btn-success"}`}
                  onClick={addTask}
                >
                  {editId ? "Güncelle" : "Ekle"}
                </button>
              </div>

              {/* LIST */}
              <ul className="list-group" style={{ maxHeight: "400px", overflowY: "auto" }}>

                {filteredTasks.length === 0 && (
                  <p className="text-center text-muted mt-3">
                    Görev bulunamadı
                  </p>
                )}

                {filteredTasks.map(task => (
                  <li
                    key={task.id}
                    className={`list-group-item d-flex justify-content-between align-items-center ${
                      task.done ? "list-group-item-success" : ""
                    } ${darkMode ? "bg-dark text-light border-light" : ""}`}
                  >
                    <span
                      style={{
                        textDecoration: task.done ? "line-through" : "none",
                        cursor: "pointer"
                      }}
                      onClick={() => toggleDone(task.id)}
                    >
                      {task.title}
                    </span>

                    <div>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => editTask(task)}
                      >
                        ✏️
                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteTask(task.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </li>
                ))}

              </ul>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;