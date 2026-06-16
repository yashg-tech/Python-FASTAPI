import { useEffect,useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";

function Admin(){
    const [users,setUsers] = useState([]);

    const [notes,setNotes] = useState([]);

    const [showAddUser, setShowAddUser] = useState(false);
    const navigate = useNavigate();

   const deleteUser = async (id: string) => {

    const confirmDelete = window.confirm("Delete this user?");

    if (!confirmDelete) return;

    await fetch(`http://127.0.0.1:8000/users/${id}`, {
        method: "DELETE",
    });

    setUsers(users.filter((user: any) => user.id !== id));
};

    useEffect(() => {

  const token = sessionStorage.getItem("token");

  fetch("http://127.0.0.1:8000/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => setUsers(data));

}, []);
    const Viewnotes = async(id:string)=>{
        console.log("Clicked", id);
        
        const res = await fetch(
            `http://127.0.0.1:8000/admin/tasks/${id}`
        );
        const data = await res.json();
        
        console.log(data);

        setNotes(data);
    };

    const handleLogout = () => {
      sessionStorage.clear();

        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("refresh_token");

        window.location.reload();
    };

const [newUser, setNewUser] = useState({
  email: "",
  password: "",
  role: "user",
});

const addUser = async () => {

  if (!newUser.email.trim()) {
    alert("Email Required");
    return;
  }

  if (!newUser.password.trim()) {
    alert("Password Required");
    return;
  }

  const res = await fetch("http://127.0.0.1:8000/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  });

  if (res.ok) {
    alert("User Added Successfully");

    setShowAddUser(false);

    setNewUser({
      email: "",
      password: "",
      role: "user",
    });

    window.location.reload();
  }
};

return(
        <div className="admin-container">
  <h1>Admin Dashboard</h1>

 <div style={{ display: "flex", justifyContent: "center", gap: "10px",   marginBottom: "30px", }}>
  
  <button
    className="btn btn-success"
    onClick={() => setShowAddUser(true)}
  >
    + Add User
  </button>



  <button
    className="btn btn-danger"
    onClick={handleLogout}
  >
    Logout
  </button>

</div>
  {users?.map((user:any) => (
    <div className="user-card" key={user.id}>
      <h3>{user.email}</h3>
      <p>{user.role}</p>

      <div className="btn-group">
        <button
          className="delete-btn" 
          onClick={() => deleteUser(user.id)}
        >
          Delete User
        </button>
          <button
    onClick={() => navigate(`/admin/user/${user.id}`)}
>
    View Notes
</button>

      </div>
    </div>
  ))}
  

  {notes.length === 0 ? (
    <p></p>
  ) : (
    notes.map((note: any) => (
      <div key={note._id} className="note-card" style={{ background: "#f9f9f9", padding: "15px", margin: "10px 0", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        
        <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>{note.title}</h3>
        <p style={{ margin: 0, color: "#666" }}>{note.description}</p>

      </div>   
    ))
  )}

<Modal show={showAddUser} onHide={() => setShowAddUser(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Add User</Modal.Title>
  </Modal.Header>

  <Modal.Body>

    <Form.Control
      type="email"
      placeholder="Email"
      value={newUser.email}
      onChange={(e) =>
        setNewUser({ ...newUser, email: e.target.value })
      }
    />

    <br />

    <Form.Control
      type="password"
      placeholder="Password"
      value={newUser.password}
      onChange={(e) =>
        setNewUser({ ...newUser, password: e.target.value })
      }
    />

  </Modal.Body>

  <Modal.Footer>

    <Button
      variant="secondary"
      onClick={() => setShowAddUser(false)}
    >
      Cancel
    </Button>

    <Button
      variant="primary"
      onClick={addUser}
    >
      Add User
    </Button>

  </Modal.Footer>
</Modal>
</div>


)
}
export default Admin;
