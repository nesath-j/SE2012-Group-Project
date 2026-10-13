package com.VisionExpress.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "admin")
@PrimaryKeyJoinColumn(
        name = "user_id",
        referencedColumnName = "manager_id"
)
public class Admin extends Manager {

    // Default constructor required by JPA
    public Admin() {
        super();
    }
}
