package com.VisionExpress.demo.service;

import com.VisionExpress.demo.model.Order;
import com.VisionExpress.demo.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.VisionExpress.demo.model.Member;
import com.VisionExpress.demo.repository.MemberRepository;
import org.springframework.transaction.annotation.Transactional;
import com.VisionExpress.demo.model.OrderItem;
import com.VisionExpress.demo.model.Product;
import com.VisionExpress.demo.repository.ProductRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.time.LocalDateTime;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private ProductRepository productRepository;

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

    @Transactional
    public Order createOrder(Order order) {

        if (order == null ||
                order.getOrderItems() == null ||
                order.getOrderItems().isEmpty()) {
            throw new IllegalArgumentException(
                    "An order must contain at least one product.");
        }

        double totalAmount = 0.0;

        for (OrderItem item : order.getOrderItems()) {

            if (item == null ||
                    item.getProduct() == null ||
                    item.getProduct().getProductId() == null) {
                throw new IllegalArgumentException(
                        "Each order item must contain a valid product ID.");
            }

            if (item.getQuantity() <= 0) {
                throw new IllegalArgumentException(
                        "Product quantity must be greater than zero.");
            }

            Long productId = item.getProduct().getProductId();

            Product product = productRepository.findById(productId)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Product not found: " + productId
                            ));

            if (!Double.isFinite(product.getPrice()) ||
                    product.getPrice() < 0) {
                throw new IllegalStateException(
                        "Invalid product price.");
            }

            if (!product.checkStock(item.getQuantity())) {
                throw new IllegalArgumentException(
                        "Insufficient stock for: " + product.getName()
                );
            }

            item.setProduct(product);
            item.setUnitPrice(product.getPrice());
            item.setOrder(order);

            totalAmount += item.getSubTotal();

            if (!Double.isFinite(totalAmount)) {
                throw new IllegalArgumentException(
                        "Order amount is too large.");
            }
        }

        order.setTotalAmount(totalAmount);
        order.setDiscountAmount(0.0);
        order.setPaymentStatus(Order.PaymentStatus.PENDING);
        order.setLoyaltyPointsAwarded(false);

        order.setOrderDate(java.time.LocalDateTime.now());
        order.setOrderStatus("Processing");
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

    // Confirm payment and award loyalty points
    @Transactional
    public Order confirmPayment(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Order not found."));

        if (order.getPaymentStatus() == Order.PaymentStatus.CONFIRMED) {
            return order;
        }

        if (order.getPaymentStatus() !=
                Order.PaymentStatus.TO_BE_CONFIRMED) {
            throw new IllegalStateException(
                    "Payment slip must be submitted before confirmation.");
        }

        if (order.getMemberId() == null) {
            throw new IllegalStateException(
                    "Order is not linked to a Member.");
        }

        Member member = memberRepository.findById(order.getMemberId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Member not found."));

        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();

            if (product == null) {
                throw new IllegalStateException("Product missing from order item.");
            }

            int newStock = product.getStockQuantity() - item.getQuantity();

            if (newStock < 0) {
                throw new IllegalStateException(
                        "Insufficient stock for product: " + product.getName()
                                + ". Available: " + product.getStockQuantity()
                                + ", Requested: " + item.getQuantity());
            }

            product.setStockQuantity(newStock);
            productRepository.save(product);
        }

        order.setPaymentStatus(Order.PaymentStatus.CONFIRMED);

        if (!order.isLoyaltyPointsAwarded()) {

            double finalTotal = order.calculateFinalTotal();

            if (!Double.isFinite(finalTotal) || finalTotal < 0) {
                throw new IllegalStateException(
                        "Invalid order total.");
            }

            int points = (int) Math.floor(finalTotal / 100);

            if (points > 0) {
                member.setLoyaltyPoints(
                        Math.addExact(member.getLoyaltyPoints(), points)
                );

                member.setTotalEarnedPoints(
                        Math.addExact(member.getTotalEarnedPoints(), points)
                );

                memberRepository.save(member);
            }

            order.setLoyaltyPointsAwarded(true);
        }

        return orderRepository.save(order);
    }
    // Retrieve orders belonging to a Member
    public List<Order> getOrdersByMemberId(Long memberId) {
        return orderRepository.findByMemberId(memberId);
    }

}
