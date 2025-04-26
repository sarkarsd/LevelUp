package com.levelup.backend.dto;

import com.levelup.backend.model.TaskType;

public class TaskSummaryDTO {
    private Long id;
    private String title;
    private TaskType type;
    private int xp;

    public TaskSummaryDTO(Long id, String title, TaskType type, int xp) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.xp = xp;
    }

    // Getters and setters

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public TaskType getType() {
        return type;
    }

    public int getXp() {
        return xp;
    }

    public void setId(Long id) {
        this.id = id;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }

    public void setType(TaskType type) {
        this.type = type;
    }

    public void setXp(int xp) {
        this.xp = xp;
    }
}
