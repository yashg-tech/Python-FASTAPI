import {useEffect, useState} from "react";


interface Task{
  id: number;
  title: string;
  description: string;
  dateTime: string;
}
function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/tasks")
     .then((res) => res.json())
     .then((data) => setTasks(data))
     .catch((err) => console.log(err));
    },[]);

    return (
      <div>
        <h1>My Tasks</h1>
         {tasks.map((task) => (
          <div key={task.id}>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <p>{task.dateTime}</p>
            
          </div>
         ))}
      </div>
    )


  
}

export default App;