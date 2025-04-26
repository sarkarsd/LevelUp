package com.levelup.backend.controller;


import com.levelup.backend.model.*;
import com.levelup.backend.repository.TaskRepository;
import com.levelup.backend.repository.UserRepository;
import com.levelup.backend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController{

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

     @Autowired
    private UserService userService; // Inject UserService for level calculation

    // POST /tasks – Create a task

    @PostMapping
    public String createTask(@RequestBody Task task) {
        // Step 1: Find the user from DB
        User user = userRepository.findById(task.getUser().getId())
                .orElse(null);

        if (user == null) {
            return "User not found!";
        }

    
        // Step 2: Check if user already has a MAIN task

        if (task.getType() == TaskType.MAIN) {
            List<Task> existingMainTasks = taskRepository.findByUserIdAndType(user.getId(), TaskType.MAIN);
            boolean hasPendingMainTask = existingMainTasks.stream().anyMatch(existingTask -> existingTask.getStatus() == TaskStatus.PENDING);
            if (hasPendingMainTask) {
                return "User already has a MAIN task!";
            }
        }

        // Set deadline for DAILY task if its a daily task
        if (task.getType() == TaskType.DAILY) {
            task.setDeadline(LocalDateTime.now().plusDays(1));
        }


        
        // Step 3: Set default values
        task.setUser(user);
        task.setStatus(TaskStatus.PENDING);
        task.setCreatedAt(LocalDateTime.now());
        
        
        
        // Step 4: Assign XP based on type

        switch (task.getType()) {
            case MAIN -> task.setXp(50);
            case SIDE -> task.setXp(20);
            case DAILY -> task.setXp(10);
        }
    
        taskRepository.save(task);
        return "Task created!";
    
    }



    // GET /tasks/user/{userId} – fetch tasks by user

    @GetMapping("/user/{userId}")
    public List<Task> getTasksByUser(@PathVariable Long userId) {
        return taskRepository.findByUserId(userId);
    }


    // POST /tasks/{id}/complete – Mark a task as completed

    @PostMapping("/{id}/complete")
    public String completeTask(@PathVariable Long id) {

        // Step 1: Get the task from DB
        Task task = taskRepository.findById(id).orElse(null);
        if (task == null) {
            return "Task not found!";
        }

        // Step 2: Check if already completed
        if (task.getStatus() == TaskStatus.COMPLETED) {
            return "Task already completed!";
        }

        // Step 3: Mark task as COMPLETED
        task.setStatus(TaskStatus.COMPLETED);
        taskRepository.save(task); // Save status change

        // Step 4: Add task XP to user
        User user = task.getUser();
        int newXp = user.getXp() + task.getXp();
        user.setXp(newXp);

        // Step 5: Recalculate user level
        int newLevel = userService.calculateLevel(newXp);
        user.setLevel(newLevel);

        // Step 6: Save updated user
        userRepository.save(user);

        return "Task completed! XP added and level updated.";
    }


    // DELETE /tasks/{id} – Delete a task by ID
    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable Long id) {
        if (!taskRepository.existsById(id)) {
            return "Task not found!";
        }

        taskRepository.deleteById(id);
        return "Task deleted successfully!";
    }




}
