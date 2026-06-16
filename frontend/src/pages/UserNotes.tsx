import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function UserNotes() {
    

    const { id } = useParams();
  
    
     const [tasks, setTasks] = useState<any[]>([]);


    useEffect(() => {

    fetch(`http://127.0.0.1:8000/admin/user/${id}`)
    .then(res => res.json())
    .then(data => setTasks(data));

}, [id]);

const deleteTask = async (id: string) => {
  if (!window.confirm("Delete this task?")) return;

  await fetch(`http://127.0.0.1:8000/tasks/${id}`, {
    method: "DELETE",
  });

  setTasks(tasks.filter((task) => task._id !== id));
};


    return (
        <div>

            <h1>User ID : {id}</h1>

            {tasks.length === 0 ? (
                <h3>No Tasks Found</h3>
            ) : (
                tasks.map(task => (
                    <div key={task._id}>
                        <h2>{task.title}</h2>
                        <p>{task.description}</p>
                        <p>{task.dateTime}</p>
                                <button
  className="btn btn-danger"
  onClick={() => deleteTask(task._id)}
>
    🗑 Delete Task
</button>
    
                        <hr />

                                 </div>
                ))
            )}

        </div>
    );
}

export default UserNotes;