package com.VisionExpress.demo.repository;

import com.VisionExpress.demo.model.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    Optional<Delivery> findByTrackingNo(String trackingNumber);
    Optional<Delivery> findByOrderId(Long orderId);
}
