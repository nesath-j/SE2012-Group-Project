package com.VisionExpress.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "MANAGER")
public class Manager {

    @Id
    @Column(name = "manager_id")
    private Integer managerId;

    public Integer getManagerId() {
        return managerId;
    }

    public void setManagerId(Integer managerId) {
        this.managerId = managerId;
    }

}