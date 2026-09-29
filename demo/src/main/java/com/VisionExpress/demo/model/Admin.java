package com.VisionExpress.model;

import com.VisionExpress.demo.model.Manager;
import jakarta.persistence.*;

@Entity
@Table(name = "admin")
@PrimaryKeyJoinColumn(name = "admin_id")
public class Admin extends Manager {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_id", nullable = false, length = 50)
    private int admin_id;


    public int getAdmin_id() {return admin_id; }
    public void setAdminID(int admin_id) {
        this.admin_id = admin_id;
    }
}