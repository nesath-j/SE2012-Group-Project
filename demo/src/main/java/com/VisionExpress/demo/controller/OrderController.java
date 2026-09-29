package com.VisionExpress.demo.controller;

import com.VisionExpress.demo.model.Order;
import com.VisionExpress.demo.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // POST /api/orders - Create order
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        Order savedOrder = orderService.createOrder(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder);
    }

    // GET /api/orders - Retrieve all orders
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // GET /api/orders/{id} - Retrieve order by ID
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PATCH /api/orders/{id}/status - Update status
    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        boolean updated = orderService.updateOrderStatus(id, status);
        if (updated) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // PATCH /api/orders/{id}/discount - Apply discount
    @PatchMapping("/{id}/discount")
    public ResponseEntity<Order> applyDiscount(@PathVariable Long id, @RequestParam double discount) {
        return orderService.applyDiscount(id, discount)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

