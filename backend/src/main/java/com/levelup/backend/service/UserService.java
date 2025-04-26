package com.levelup.backend.service;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.levelup.backend.dto.UserStatsDTO;
import com.levelup.backend.dto.TaskSummaryDTO;
import com.levelup.backend.model.Task;
import com.levelup.backend.model.TaskStatus;
import com.levelup.backend.model.User;
import com.levelup.backend.repository.TaskRepository;
import com.levelup.backend.repository.UserRepository;

import java.util.List;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    // Calculates the level based on XP
    public int calculateLevel(int xp) {
        int level = 0;
        int threshold = 100; // XP needed to go from level 0 to level 1

        // Keep checking if XP is enough to cross current threshold
        while (xp >= threshold) {
            xp -= threshold;   // Subtract current level's XP requirement
            level++;           // Level up
            threshold *= 2;    // XP needed for next level doubles
        }

        return level;
    }


    public UserStatsDTO getUserStats(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        UserStatsDTO stats = new UserStatsDTO();

        // Name, Total XP and current level
        stats.setId(userId);
        stats.setName(user.getName());
        stats.setTotalXp(user.getXp());
        stats.setLevel(calculateLevel(user.getXp()));

        
        // Get user tasks
        List<Task> userTasks = taskRepository.findByUserId(userId);

        // Filter only pending tasks
        List<Task> pendingTasks = userTasks.stream()
            .filter(task -> task.getStatus() == TaskStatus.PENDING)
            .collect(Collectors.toList());
        
        // Count tasks by type (MAIN, SIDE, DAILY)
        Map<String, Long> countByType = userTasks.stream()
            .collect(Collectors.groupingBy(t -> t.getType().toString(), Collectors.counting()));
        stats.setTaskCountByType(countByType);

        // Count tasks by status (PENDING, COMPLETED, FAILED)
        Map<String, Long> countByStatus = userTasks.stream()
            .collect(Collectors.groupingBy(t -> t.getStatus().toString(), Collectors.counting()));
        stats.setTaskCountByStatus(countByStatus);


        // Task details (title, type, xp)
        List<TaskSummaryDTO> taskSummaries = pendingTasks.stream()
            .map(task -> new TaskSummaryDTO(task.getId(), task.getTitle(), task.getType(), task.getXp()))
        .collect(Collectors.toList());
        stats.setTasks(taskSummaries);


        return stats;
    }


}
