package com.VisionExpress.demo.model;

public class Manager extends Employee {
    private int managerId;
    private String department;

    public int getAdminId() {
        return managerId;
    }

    public void setAdminId(int adminId) {
        this.managerId = adminId;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
}