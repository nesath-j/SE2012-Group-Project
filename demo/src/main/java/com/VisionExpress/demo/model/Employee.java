package com.VisionExpress.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "EMPLOYEE")
public class Employee {

    @Id
    @Column(name = "employee_id")
    private Integer employeeId;

    @Column(name = "role_title", nullable = false, length = 50)
    private String roleTitle;

    @Column(name = "assigned_branch", length = 100)
    private String assignedBranch;


    public Integer getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Integer employeeId) {
        this.employeeId = employeeId;
    }

    public String getRoleTitle() {
        return roleTitle;
    }

    public void setRoleTitle(String roleTitle) {
        this.roleTitle = roleTitle;
    }

    public String getAssignedBranch() {
        return assignedBranch;
    }

    public void setAssignedBranch(String assignedBranch) {
        this.assignedBranch = assignedBranch;
    }
}
