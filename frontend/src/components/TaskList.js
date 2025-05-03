import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './TaskList.css';

function TaskList() {
  const { userId } = useParams();
  const navigate = useNavigate(); // initialize navigate
  const [tasks, setTasks] = useState([]);
  const [selectedDescription, setSelectedDescription] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/tasks/user/${userId}`);
        setTasks(response.data);
      } catch (err) {
        setError('Failed to fetch tasks');
      }
    };

    fetchTasks();
  }, [userId]);

  const toggleDescription = (description) => {
    setSelectedDescription(selectedDescription === description ? null : description);
  };

  
  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8080/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId)); // Remove from UI
      setSelectedDescription(null); // Close description box if deleted
    } catch (err) {
      setError('Failed to delete task');
    }
  };
  
  
  
  
  return (
    <div className="task-list-container">
       
       {/* Back button at top */}
        <button className="back-button" onClick={() => navigate(`/dashboard/${userId}`)}>
          ← Back to Dashboard
        </button>


      <h2>All Tasks</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className="task-item" onClick={() => toggleDescription(task.description)}>
              <div><strong>Title:</strong> {task.title}</div>
              <div><strong>Type:</strong> {task.type}</div>
              <div><strong>Status:</strong> {task.status}</div>
              <div><strong>Created:</strong> {new Date(task.createdAt).toLocaleString()}</div>
              <div><strong>Deadline:</strong> {task.deadline ? new Date(task.deadline).toLocaleString() : 'N/A'}</div>
              {selectedDescription === task.description && (
                <div className="description-box">
                  <strong>Description:</strong> {task.description || 'No description'}
                  {/* Delete Button */}
                  <button className="delete-button" onClick={(e) => {
                      e.stopPropagation(); // Prevent toggling description again
                      handleDelete(task.id);
                    }}
                  >
                    🗑️ Delete Task
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;

