package com.VisionExpress.demo.controller;

import com.VisionExpress.demo.model.Courier;
import com.VisionExpress.demo.service.CourierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/couriers")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class CourierController {

    private final CourierService courierService;

    @Autowired
    public CourierController(CourierService courierService) {
        this.courierService = courierService;
    }

    @PostMapping
    public ResponseEntity<Courier> addCourier(@RequestBody Courier courier) {

        Courier created = courierService.addCourier(courier);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Courier>> getAllCouriers() {
        return ResponseEntity.ok(courierService.getAllCouriers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Courier> getCourierById(@PathVariable Integer id) {
        return ResponseEntity.ok(courierService.getCourierById(id));
    }

    @GetMapping("/service-type/{serviceType}")
    public ResponseEntity<List<Courier>> getCouriersByServiceType(@PathVariable String serviceType) {

        return ResponseEntity.ok(courierService.getCouriersByServiceType(serviceType));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Courier> updateCourier(@PathVariable Integer id, @RequestBody Courier courier) {
        return ResponseEntity.ok(courierService.updateCourier(id, courier));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourier(@PathVariable Integer id) {
        courierService.deleteCourier(id); return ResponseEntity.noContent().build();
    }
}