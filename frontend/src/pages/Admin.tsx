import { useEffect,useState } from "react";

function Admin(){
    const [users,setUsers] = useState([]);

    const [notes,setNotes] = useState([])

   const deleteUser = async (id: string) => {

    const confirmDelete = window.confirm("Delete this user?");

    if (!confirmDelete) return;

    await fetch(`http://127.0.0.1:8000/users/${id}`, {
        method: "DELETE",
    });

    setUsers(users.filter((user: any) => user.id !== id));
};

    useEffect(()=> {
        fetch("http://127.0.0.1:8000/users")
        .then(res => res.json())
        .then(data => setUsers(data));
        
    },[])

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
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        window.location.reload();
    };


return(
        <div className="admin-container">
  <h1>Admin Dashboard</h1>

  <button className="logout-btn" onClick={handleLogout}>
    Logout
  </button>

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
          className="view-btn"
          onClick={() => Viewnotes(user.id)}
        >
          View Notes
        </button>

      </div>
      

    </div>
  ))}
  
<div className="notes-container" style={{ marginTop: "30px", padding: "20px", borderTop: "2px solid #ccc" }}>
  <h2>User Tasks</h2>
  
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
</div>
</div>

)
}
export default Admin;
