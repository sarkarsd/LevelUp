import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams  } from 'react-router-dom'; // Correct import for useNavigate
import './TaskForm.css'; // We'll add styling here

function TaskForm() {
  const navigate = useNavigate(); // Using useNavigate for navigation
  const { userId } = useParams(); // Access the userId passed from the HomePage
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('MAIN');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const task = {
      user: { id: userId }, // Using userId from URL parameters
      title,
      description,
      type,
      deadline: (type === 'DAILY') ? null : deadline,
    };

    try {
      const response = await axios.post('http://localhost:8080/tasks', task);
      console.log('Task created:', response.data);
      
      // Reset form fields after successful submission
      setTitle('');
      setDescription('');
      setType('MAIN');
      setDeadline('');
      setError('');
      
      // Navigate back to the homepage after successful task creation
      navigate('/');  // Use navigate() to redirect to the home page
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create task.';
      setError(errorMessage);
    }
  };

  return (
    <div className="task-form-container">
      
      {/* Back button at top */}
      <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Dashboard
      </button>

      <h2>Create a New Task</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title: </label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Description: </label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Type: </label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
          >
            <option value="MAIN">MAIN</option>
            <option value="SIDE">SIDE</option>
            <option value="DAILY">DAILY</option>
          </select>
        </div>
        {(type === 'MAIN' || type === 'SIDE') && (
          <div>
            <label>Deadline: </label>
            <input 
              type="datetime-local" 
              value={deadline} 
              onChange={(e) => setDeadline(e.target.value)} 
              required 
            />
          </div>
        )}
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
}

export default TaskForm;


