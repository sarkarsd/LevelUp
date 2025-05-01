import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* Start with login */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard/:userId" element={<HomePage />} /> {/* HomePage uses userId */}
        <Route path="/task-form/:userId" element={<TaskForm />} />
        <Route path="/task-list/:userId" element={<TaskList />} />
      </Routes>
  );
}

export default App;


