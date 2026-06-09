import {useEffect, useState} from "react";
import './App.css'
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";




interface Task{
  id: number;
  title: string;
  description: string;
  dateTime: string;
}
function App() {

  const [show, setShow] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);

  const [showForm, setShowForm] = useState(false);

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  

const [newTask, setNewTask] = useState({
  id: 0,
  title: "",
  description: "",
  dateTime: "",
});

  useEffect(() => {
    fetch("http://127.0.0.1:8000/tasks")
     .then((res) => res.json())
     .then((data) => setTasks(data))
     .catch((err) => console.log(err));
    },[]);

    const addTask = async () => {

      

  const task = {
    id: tasks.length + 1,
    title: newTask.title,
    description: newTask.description,
    dateTime: newTask.dateTime,
  }

  const res = await fetch("http://127.0.0.1:8000/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  const data = await res.json();
  

  setTasks([...tasks, data.task]);  
  setShow(false);

  setNewTask({
    id: 0,
    title: "",
    description: "",
    dateTime: "",
  });
    };

    const handleEdit = (task: Task) => {
  setEditingTask(task);
  setNewTask(task);
  setShow(true);
};

const updateTask = async () => {
  await fetch(`http://127.0.0.1:8000/tasks/${newTask.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTask),
  });

  const res = await fetch("http://127.0.0.1:8000/tasks");
  const data = await res.json();

  setTasks(data);
  setShow(false);
  setEditingTask(null);
};

const deleteTask = async (id: number) => {

  if (!window.confirm("Delete this task?")) return;

  await fetch(`http://127.0.0.1:8000/tasks/${id}`, {
    method: "DELETE",
  });

  const res = await fetch("http://127.0.0.1:8000/tasks");
  const data = await res.json();

  setTasks(data);
};

    return (
      <div className="container">

        {showForm && (
  <div className="card">

    <input
      placeholder="Title"
      onChange={(e) =>
        setNewTask({ ...newTask, title: e.target.value })
      }
    />

    <input
      placeholder="Description"
      onChange={(e) =>
        setNewTask({
          ...newTask,
          description: e.target.value,
        })
      }
    />

    <input
      type="date"
      onChange={(e) =>
        setNewTask({
          ...newTask,
          dateTime: e.target.value,
        })
      }
    />

    <button onClick={() => setShow(false)}>
      Cancel
    </button>

  </div>
)}
          <div className="header">
               <h1>My Tasks</h1>

        <button 
        className="addBtn"
        onClick={() => setShow(true)}
        >
          + Add Task
        </button>

          </div>

          <Modal show={show} onHide={() => setShow(false)}>
  <Modal.Header closeButton>
    
    <Modal.Title>Add Task</Modal.Title>
  </Modal.Header>

  <Modal.Body>

    <Form.Control
      type="text"
      placeholder="Title"
      value={newTask.title}
  onChange={(e) =>
    setNewTask({
      ...newTask,
      title: e.target.value,
    })
  }
    />

    <br />

    <Form.Control
      type="text"
      placeholder="Description"
      value={newTask.description}
  onChange={(e) =>
    setNewTask({
      ...newTask,
      description: e.target.value,
    })
  }
    />

    <br />

    <Form.Control
      type="date"
      value={newTask.dateTime}
  onChange={(e) =>
    setNewTask({
      ...newTask,
      dateTime: e.target.value,
    })
  }
    />

  </Modal.Body>

  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShow(false)}>
      Cancel
    </Button>

   <Button
  variant="primary"
  onClick={editingTask ? updateTask : addTask}
>
  {editingTask ? "Update Task" : "Save Task"}
</Button>

  </Modal.Footer>
</Modal>
       
         {tasks.map((task) => (
          <div className ="card" key={task.id}>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <p className="date">{task.dateTime}</p>
            
             <div className="btn-group">
  <Button
    variant="warning"
    onClick={() => handleEdit(task)}
  >
    Update
  </Button>

  <Button
    variant="danger"
    onClick={() => deleteTask(task.id)}
  >
    Delete
  </Button>
</div>
            
            
          </div>
         ))}
      </div>
    )
  
}

export default App;