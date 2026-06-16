import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function UserNotes() {
    

    const { id } = useParams();
   
     const [userName, setUserName] = useState("");
     const [tasks, setTasks] = useState<any[]>([]);


   useEffect(() => {
    fetch(`http://127.0.0.1:8000/admin/user/${id}`)
        .then(res => res.json())
        .then(data => {
            setUserName(data.user);
            setTasks(data.tasks);
        });
}, [id]);
const sendEmail = async (taskId: string) => {
     
    const res = await fetch(
        `http://127.0.0.1:8000/send-warning/${taskId}`,
        {
            method: "POST",
        }
    );

    const data = await res.json();
    alert(data.message);
};



    return (
        <div>

            <h1>{userName}</h1>

            {tasks.length === 0 ? (
                <h3>No Tasks Found</h3>
            ) : (
                tasks.map(task => (
                    <div key={task._id}>
                        <h2>{task.title}</h2>
                        <p>{task.description}</p>
                        <p>{task.dateTime}</p>
                                <button
    className="btn btn-warning"
    onClick={() => sendEmail(task._id)}
>
    📧 Send Warning
</button>
  
    
                        <hr />

                                 </div>
                ))
            )}

        </div>
    );
}

export default UserNotes;