import React, { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const fetchTasks = () => {
    fetch("http://127.0.0.1:8000/api/tasks/")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    if (newTitle.trim() === "") return;

    fetch("http://127.0.0.1:8000/api/tasks/add/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newTitle }),
    })
      .then((res) => res.json())
      .then(() => {
        setNewTitle("");
        fetchTasks();
      });
  };

  const deleteTask = (id) => {
    fetch(`http://127.0.0.1:8000/api/tasks/delete/${id}/`, {
      method: "DELETE",
    })
      .then(() => fetchTasks());
  };

  const toggleTask = (task) => {
    fetch(`http://127.0.0.1:8000/api/update/${task.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: !task.completed, }),
    })
      .then(() => fetchTasks());
  }

  const updateTaskTitle = (id, newTitle) => {
    fetch(`http://127.0.0.1:8000/api/update/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newTitle }),
    })
      .then((res) => res.json())
      .then(() => {
        setEditingTaskId(null);
        fetchTasks(); // refresh the list
      });
  };


  return (
    <div style={{ padding: "2rem" }}>
      <h1>📝 Task List</h1>

      <form onSubmit={handleAdd} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a task..."
          style={{ padding: "0.5rem", width: "250px", marginRight: "10px" }}
        />
        <button type="submit" style={{ padding: "0.5rem" }}>
          ➕ Add
        </button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {editingTaskId === task.id ? (
              <input
                type="text"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateTaskTitle(task.id, editingTitle);
                  }
                }}
                onBlur={() => setEditingTaskId(null)}
                autoFocus
                style={{ padding: "0.3rem", marginRight: "10px" }}
              />
            ) : (
              <>
                <span
                  onClick={() => {
                    setEditingTaskId(task.id);
                    setEditingTitle(task.title);
                  }}
                  style={{
                    cursor: "pointer",
                    textDecoration: task.completed ? "line-through" : "none",
                    marginRight: "10px",
                  }}
                >
                  {task.title}
                </span>
                <button
                  onClick={() => toggleTask(task)}
                  style={{
                    marginRight: "10px",
                    background: task.completed ? "green" : "orange",
                    color: "white",
                    border: "none",
                    padding: "2px 8px",
                    cursor: "pointer",
                    borderRadius: "5px",
                  }}
                >
                  {task.completed ? "✅" : "⏳"}
                </button>
              </>
            )}

            <button
              onClick={() => deleteTask(task.id)}
              style={{
                background: "grey",
                color: "white",
                border: "none",
                padding: "2px 8px",
                cursor: "pointer",
                borderRadius: "5px",
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;