import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './HomePage.css'; 
import { useParams } from 'react-router-dom';

const HomePage = () => {
  const [userStats, setUserStats] = useState(null);
  const [error, setError] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showModal, setShowModal] = useState(false); // Control visibility of the modal
  const { userId } = useParams();

  useEffect(() => {
    // Fetch stats for user with id 1 (adjust id as needed)
    axios
      .get("http://localhost:8080/users/${userId}/stats")
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

  const calculateXpForNextLevel = (level) => {
    return 100 * Math.pow(2, level);
  };

  const handleCompleteTask = (taskId) => {
    // Send the POST request to mark the task as completed
    axios
      .post(`http://localhost:8080/tasks/${taskId}/complete`)
      .then((response) => {
        setUserStats((prevStats) => {
          // Update the task's status in the userStats state
          const updatedTasks = prevStats.tasks.map((task) => 
            task.id === taskId ? { ...task, status: 'COMPLETED' } : task
          ).filter((task) => task.status !== "COMPLETED"); // ✨ Immediately remove completed task;
          return { ...prevStats, tasks: updatedTasks };
        });
        setShowModal(false); // Hide the modal
        window.location.reload(); // Force reload to refresh everything
      })
      .catch((err) => {
        alert("Error completing task: " + err.message);
        setShowModal(false); // Hide the modal in case of error
      });
  };

  const handleTaskClick = (taskId) => {
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null); // Deselect the task if it’s already selected
    } else {
      setSelectedTaskId(taskId); // Select a new task
      console.log('Selected Task ID::', taskId);
    }
  };

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
        <p> Total XP: {userStats.totalXp} / {calculateXpForNextLevel(userStats.level)}</p>
      </div>

      <div className="task-summary">
        <h2>Tasks Overview</h2>



        {/* Daily Tasks */}
        <div className="task-type">
          <h3>Daily Tasks ({pendingDailyTasks.length||0})</h3>
          {userStats.tasks.filter((task) => task.type === "DAILY").map((task) => (
            <div key={task.id} className="task-item"   onClick={() => handleTaskClick(task.id)}>
              <div className="task-inline">
                <p className="task-title">{task.title}</p>
                <p className="task-xp">XP: {task.xp}</p>
                <p className="task-status">In-Progress</p>
              </div>
              {selectedTaskId === task.id && !showModal && (
                <button
                  className="complete-text"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering parent div’s onClick
                    setShowModal(true);
                  }}
                >
                  Complete
                </button>
              )}

            </div>
          ))}
        </div>

        {/* Main Tasks */}
        <div className="task-type">
          <h3>Main Task ({pendingMainTasks.length ||0})</h3>
          {userStats.tasks.filter((task) => task.type === "MAIN").map((task) => (
            <div key={task.id} className="task-item"   onClick={() => handleTaskClick(task.id)}>
              <div className="task-inline">
                <p className="task-title">{task.title}</p>
                <p className="task-xp">XP: {task.xp}</p>
                <p className="task-status">In-Progress</p>
              </div>
              {selectedTaskId === task.id && !showModal && (
                <button
                  className="complete-text"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering parent div’s onClick
                    setShowModal(true);
                  }}
                >
                  Complete
                </button>
              )}

            </div>
          ))}
        </div>

        {/* Side Tasks */}
        <div className="task-type">
          <h3>Side Tasks ({pendingSideTasks.length||0})</h3>
          {userStats.tasks.filter((task) => task.type === "SIDE").map((task) => (
            <div key={task.id} className="task-item"  onClick={() => handleTaskClick(task.id)}>
              <div className="task-inline">
                <p className="task-title">{task.title}</p>
                <p className="task-xp">XP: {task.xp}</p>
                <p className="task-status">In-Progress</p>
              </div>
              {selectedTaskId === task.id && !showModal && (
                <button
                  className="complete-text"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering parent div’s onClick
                    setShowModal(true);
                  }}
                >
                  Complete
                </button>
              )}

            </div>
          ))}
        </div>

        
      </div>

        {/* Link to create a new task */}
        <div className="task-buttons">
          <Link to={`/task-form/${userStats.id}`} className="create-task-btn">Create New Task</Link>
          <Link to={`/task-list/${userStats.id}`} className="view-task-btn">View All Tasks</Link>
        </div>



        {/* Modal for confirmation */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <p>Are you sure you want to mark this task as completed?</p>
              <button onClick={() => handleCompleteTask(selectedTaskId)}>Yes</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>

        )}
    </div>
  );
};

export default HomePage;


