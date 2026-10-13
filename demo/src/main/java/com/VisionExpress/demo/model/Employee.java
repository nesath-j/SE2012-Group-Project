package com.VisionExpress.demo.model;

import jakarta.persistence.*;

@Entity
@PrimaryKeyJoinColumn(name = "employee_id", referencedColumnName = "user_id")
@Table(name = "EMPLOYEE")
public class Employee extends User {

    @Column(name = "role_title", nullable = false, length = 50)
    private String roleTitle;

    @Column(name = "assigned_department", length = 100)
    private String assignedDepartment;

    public Employee() {
        super();
    }

    public Long getEmployeeId() {
        return getUserId();
    }

    public void setEmployeeId(Long employeeId) {
        setUserId(employeeId);
    }

    public String getRoleTitle() {
        return roleTitle;
    }

    public void setRoleTitle(String roleTitle) {
        this.roleTitle = roleTitle;
    }

    public String getAssignedDepartment() {
        return assignedDepartment;
    }

    public void setAssignedDepartment(String assignedDepartment) {
        this.assignedDepartment = assignedDepartment;
    }
}
