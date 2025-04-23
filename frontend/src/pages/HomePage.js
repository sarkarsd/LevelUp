import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './HomePage.css'; 

const HomePage = () => {
  const [userStats, setUserStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch stats for user with id 1 (adjust id as needed)
    axios
      .get("http://localhost:8080/users/1/stats")
      .then((response) => {
        console.log('Getting Stats Response::',response);         // See full response
        console.log('Getting Stats Response Data::', response.data);    // See only the important data part
    
        setUserStats(response.data);
      })
      .catch((err) => {
        setError("Error fetching user stats: " + err.message);
      });
  }, []);

  useEffect(() => {
    if (userStats) {
      console.log('Checking User ID::', userStats.id);
    }
  }, [userStats]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!userStats || !Array.isArray(userStats.tasks)) {
    return <div>Loading...</div>;
  }  

  //Pending Daily tasks
  const pendingDailyTasks = userStats.tasks.filter(
    (task) => task.type === "DAILY" 
  );

  //Pending Main tasks
  const pendingMainTasks = userStats.tasks.filter(
    (task) => task.type === "MAIN" 
  );
  
  //Pending Side tasks
  const pendingSideTasks = userStats.tasks.filter(
    (task) => task.type === "SIDE" 
  );

  return (
    <div className="home-page">
      <h1>{userStats.name}'s Dashboard</h1>
      <div className="user-stats">
        <p>Level: {userStats.level}</p>
        <p>Total XP: {userStats.totalXp}</p>
      </div>

      <div className="task-summary">
        <h2>Tasks Overview</h2>



        {/* Daily Tasks */}
        <div className="task-type">
          <h3>Daily Tasks ({pendingDailyTasks.length||0})</h3>
          {userStats.tasks.filter((task) => task.type === "DAILY").map((task) => (
            <div key={task.title} className="task-item">
              <div className="task-inline">
                <p className="task-title">{task.title}</p>
                <p className="task-xp">XP: {task.xp}</p>
                <p className="task-status">In-Progress</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Tasks */}
        <div className="task-type">
          <h3>Main Task ({pendingMainTasks.length ||0})</h3>
          {userStats.tasks.filter((task) => task.type === "MAIN").map((task) => (
            <div key={task.title} className="task-item">
              <div className="task-inline">
                <p className="task-title">{task.title}</p>
                <p className="task-xp">XP: {task.xp}</p>
                <p className="task-status">In-Progress</p>
              </div>
            </div>
          ))}
        </div>

        {/* Side Tasks */}
        <div className="task-type">
          <h3>Side Tasks ({pendingSideTasks.length||0})</h3>
          {userStats.tasks.filter((task) => task.type === "SIDE").map((task) => (
            <div key={task.title} className="task-item">
              <div className="task-inline">
                <p className="task-title">{task.title}</p>
                <p className="task-xp">XP: {task.xp}</p>
                <p className="task-status">In-Progress</p>
              </div>
            </div>
          ))}
        </div>

        
      </div>

        {/* Link to create a new task */}
        <div className="task-buttons">
          <Link to={`/task-form/${userStats.id}`} className="create-task-btn">Create New Task</Link>
          <Link to={`/task-list/${userStats.id}`} className="view-task-btn">View All Tasks</Link>
        </div>
    </div>
  );
};

export default HomePage;


