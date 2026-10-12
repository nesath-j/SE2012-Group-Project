package com.VisionExpress.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "MANAGER")
@PrimaryKeyJoinColumn(name = "manager_id")
public class Manager extends Employee {

    // Default No-Args Constructor (Required by JPA)
    public Manager() {
        super();
    }

}