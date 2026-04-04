import "./Home.css"
import { useState } from "react";

export function Home() {
 
 
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  

  

  const addTask = () => {
    if (!input.trim()) return;
    setTasks([...tasks, { text: input, done: false }]);
    setInput("");
  };

  const toggleTask = (index) => {
    const updated = [...tasks];
    updated[index].done = !updated[index].done;
    setTasks(updated);
  };

 



  return (
    <div className="home-container">
      
    
      {/* MAIN CONTENT */}
      <div className="home-content">
        <h1>Time Manager ⚡</h1>

        {/* ADD TASK */}
        <div className="task-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter task..."
          />
          <button onClick={addTask}>Add</button>
        </div>

        {/* TASK LIST */}
        <div className="task-list">
          {tasks.map((task, index) => (
            <div
              key={index}
              className={`task ${task.done ? "done" : ""}`}
              onClick={() => toggleTask(index)}
            >
              {task.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}