package com.VisionExpress.demo.service;

import com.VisionExpress.demo.model.Delivery;
import com.VisionExpress.demo.repository.DeliveryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
public class DeliveryService {

    @Autowired
    private DeliveryRepository deliveryRepository;

    // Implements dispatchOrderForCourier (from Employee class in diagram)
    public Delivery dispatchOrderForCourier(Long orderId, Long courierId) {
        Delivery delivery = new Delivery();
        delivery.setOrderId(orderId);
        delivery.setCourierId(courierId);
        delivery.setTrackingNo("TRK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        delivery.setDeliveryStatus("DISPATCHED");
        delivery.setDispatchDate(new Date());
        return deliveryRepository.save(delivery);
    }

    // Implements trackOrder (from Member class in diagram)
    public Optional<String> trackOrder(Long orderId) {
        return deliveryRepository.findByOrderId(orderId)
                .map(Delivery::getTrackingDetails);
    }

    // Implements updateShipmentStatus (from Courier/Delivery class in diagram)
    public boolean updateShipmentStatus(String trackingNumber, String newStatus) {
        Optional<Delivery> optionalDelivery = deliveryRepository.findByTrackingNo(trackingNumber);
        if (optionalDelivery.isPresent()) {
            Delivery delivery = optionalDelivery.get();
            delivery.updateStatus(newStatus); // Calls domain entity method
            deliveryRepository.save(delivery);
            return true;
        }
        return false;
    }
}
