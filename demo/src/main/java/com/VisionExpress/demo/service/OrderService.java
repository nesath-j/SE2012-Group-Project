package com.VisionExpress.demo.service;

import com.VisionExpress.demo.model.Order;
import com.VisionExpress.demo.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    private final String UPLOAD_DIR = "uploads/slips/";

    public Order uploadPaymentSlip(Long orderId, MultipartFile file) throws IOException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);

        Files.copy(file.getInputStream(), filePath);

        order.setPaymentSlip(filePath.toString());
        order.setPaymentStatus(Order.PaymentStatus.TO_BE_CONFIRMED);
        return orderRepository.save(order);
    }

    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

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

    public Optional<Order> applyDiscount(Long orderId, double discount) {
        return orderRepository.findById(orderId).map(order -> {
            order.applyLoyaltyDiscount(discount); // Call domain method
            return orderRepository.save(order);
        });
    }
}
