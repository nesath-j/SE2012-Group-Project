package com.VisionExpress.demo.repository;

import com.VisionExpress.demo.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    List<Employee> findByAssignedDepartment(String assignedDepartment);

    List<Employee> findByRoleTitle(String roleTitle);
}
