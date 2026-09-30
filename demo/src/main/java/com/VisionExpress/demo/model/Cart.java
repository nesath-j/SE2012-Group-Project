package com.VisionExpress.demo.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;

import java.util.ArrayList;
import java.util.List;

public class Cart {
    private Long cartId;

    private double totalAmount;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> cartItems = new ArrayList<>();

    public Cart() {}

    // 1. Calculates the total amount across all cart items
    public double calculateTotal() {
        this.totalAmount = cartItems.stream()
                .mapToDouble(CartItem::getSubTotal)
                .sum();
        return this.totalAmount;
    }

    // 2. Adds an item to the cart or increments quantity if already present
    public void addItem(Product product, int quantity) {
        for (CartItem item : cartItems) {
            if (item.getProductId().equals(product.getProductId())) {
                item.setQuantity(item.getQuantity() + quantity);
                calculateTotal();
                return;
            }
        }
        CartItem newItem = new CartItem();
        newItem.setProductId(product.getProductId());
        newItem.setQuantity(quantity);
        newItem.setUnitPrice(product.getPrice());
        newItem.setCart(this);
        cartItems.add(newItem);
        calculateTotal();
    }
}


