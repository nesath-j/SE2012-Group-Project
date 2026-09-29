package com.VisionExpress.demo.service;

import com.VisionExpress.demo.model.Order;
import com.VisionExpress.demo.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    // Save/Create a new order
    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    // Retrieve order by ID
    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Update order status
    public boolean updateOrderStatus(Long orderId, String newStatus) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            order.updateOrderStatus(newStatus);
            orderRepository.save(order);
            return true;
        }
        return false;
    }

    // Apply loyalty discount
    public Optional<Order> applyDiscount(Long orderId, double discount) {
        return orderRepository.findById(orderId).map(order -> {
            order.applyLoyaltyDiscount(discount); // Call domain method
            return orderRepository.save(order);
        });
    }
}
