package com.VisionExpress.demo.repository;

import com.VisionExpress.demo.model.Courier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourierRepository extends JpaRepository<Courier, Integer> {

    List<Courier> findByServiceType(String serviceType);
    List<Courier> findByCompanyNameContainingIgnoreCase(String companyName);
}