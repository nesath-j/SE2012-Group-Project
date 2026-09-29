package com.VisionExpress.demo.controller;

import com.VisionExpress.demo.model.Delivery;
import com.VisionExpress.demo.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/deliveries")
@CrossOrigin(origins = "http://localhost:5173")
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;

    // POST /api/deliveries/dispatch - Employee dispatches order
    @PostMapping("/dispatch")
    public ResponseEntity<Delivery> dispatchOrder(@RequestParam Long orderId, @RequestParam Long courierId) {
        Delivery delivery = deliveryService.dispatchOrderForCourier(orderId, courierId);
        return ResponseEntity.status(HttpStatus.CREATED).body(delivery);
    }

    // GET /api/deliveries/track/{orderId} - Member tracks order
    @GetMapping("/track/{orderId}")
    public ResponseEntity<String> trackOrder(@PathVariable Long orderId) {
        return deliveryService.trackOrder(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PATCH /api/deliveries/status - Courier/Employee updates shipment status
    @PatchMapping("/status")
    public ResponseEntity<Void> updateStatus(@RequestParam String trackingNumber, @RequestParam String status) {
        boolean updated = deliveryService.updateShipmentStatus(trackingNumber, status);
        if (updated) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
