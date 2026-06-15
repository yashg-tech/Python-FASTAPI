import { useEffect, useState } from "react";
import './App.css'
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Admin from "./pages/Admin";



interface Task {
  _id: string;
  title: string;
  description: string;
  dateTime: string;
  user_id: string;
}

function App() {
  const [userId, setUserId] = useState<string | null>(sessionStorage.getItem("userId"));
  const [authView, setAuthView] = useState<"login" | "signup">("login");

  const [show, setShow] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [newTask, setNewTask] = useState({ id: "", title: "", description: "", dateTime: "" });

  const fetchTasks = async (currentUserId: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/tasks?user_id=${currentUserId}`,
        {
          headers: { "Content-Type": "application/json" ,
        "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
      },
        }
        
      );
      if (!res.ok) {
        console.log("Unauthorized");
        setTasks([]);
        return;
      }
      const data = await res.json();
      console.log(data);
      setTasks(data);
    } catch (err) {
      console.log("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTasks(userId);
    }
  }, [userId]);

  const addTask = async () => {

    if (!newTask.title.trim()) {
  alert("Title is required");
  return;
}

if (!newTask.description.trim()) {
  alert("Description is required");
  return;
}

if (!newTask.dateTime) {
  alert("Date is required");
  return;
}

    if (!userId) return;
    const task = { title: newTask.title, description: newTask.description, dateTime: newTask.dateTime, user_id: userId };

    const res = await fetch("http://127.0.0.1:8000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" ,
       Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify(task),
    });

    if (res.ok) {
      fetchTasks(userId);
      setShow(false);
      setNewTask({ id: "", title: "", description: "", dateTime: "" });
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setNewTask({ id: task._id, title: task.title, description: task.description, dateTime: task.dateTime });
    setShow(true);
  };

  const updateTask = async () => {
    if (!userId) return;
    const updatedData = { title: newTask.title, description: newTask.description, dateTime: newTask.dateTime, user_id: userId };

    await fetch(`http://127.0.0.1:8000/tasks/${newTask.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" ,
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify(updatedData),
    });

    fetchTasks(userId);
    setShow(false);
    setEditingTask(null);
    setNewTask({ id: "", title: "", description: "", dateTime: "" });
  };

  const deleteTask = async (id: string) => {
    if (!userId) return;
    if (!window.confirm("Delete this task?")) return;

    await fetch(`http://127.0.0.1:8000/tasks/${id}`, { method: "DELETE",
      headers: { "Content-Type": "application/json" ,
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
     });
    
    
    fetchTasks(userId);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("refresh_token");
    setUserId(null);
    setTasks([]);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    if (year && month && day) return `${day}-${month}-${year}`;
    return dateString;
  };


  if (!userId) {
    return authView === "login" ? (
      <Login onLoginSuccess={(id) => setUserId(id)} onSwitchToSignup={() => setAuthView("signup")} />
    ) : (
      <Signup onSwitchToLogin={() => setAuthView("login")} />
    );
  }
   const role = sessionStorage.getItem("role")

    if(role==="admin"){
      return <Admin/>
    }

  return (
    <div className="container">
      <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <h1>My Tasks</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="addBtn"onClick={() => {
  setEditingTask(null);
  setNewTask({
    id: "",
    title: "",
    description: "",
    dateTime: "",
  });
  setShow(true);
}}>+ Add Task</button>
          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </div>
      </div>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingTask ? "Update Task" : "Add Task"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control type="text" placeholder="Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
          <br />
          <Form.Control type="text" placeholder="Description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
          <br />
          <Form.Control type="date" value={newTask.dateTime} onChange={(e) => setNewTask({ ...newTask, dateTime: e.target.value })} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
          <Button variant="primary" onClick={editingTask ? updateTask : addTask}>{editingTask ? "Update Task" : "Save Task"}</Button>
        </Modal.Footer>
      </Modal>

      {tasks.length === 0 ? (
        <p style={{ marginTop: "20px", textAlign: "center", color: "gray" }}>No tasks found for your account.</p>
      ) : (
        tasks.map((task) => (
          <div className="card" key={task._id}>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <p className="date">{formatDate(task.dateTime)}</p>
            <div className="btn-group">

              
              <Button variant="warning" 
              onClick={() => handleEdit(task)}>
                Update

              </Button>


              <Button variant="danger" 
              onClick={() => deleteTask(task._id)}>
                Delete

              </Button>

              
            </div>
          </div>
          
        ))
      )}
    </div>
  );
}

export default App;