import React, { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");

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
            <span
              onClick={() => toggleTask(task)}
              style={{
                cursor: "pointer",
                textDecoration: task.completed ? "line-through" : "none",
                marginRight: "10px",
              }}
            >
              {task.title} {task.completed ? "✅" : "⏳"}
            </span>
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
              Delete Task
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;