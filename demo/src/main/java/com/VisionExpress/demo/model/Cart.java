package com.VisionExpress.demo.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id")
    private Long cartId;

    @Column(name = "total_amount")
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

    // 3. Removes an item by product ID
    public void removeItem(Long productId) {
        cartItems.removeIf(item -> item.getProductId().equals(productId));
        calculateTotal();
    }

    // 4. Clears all items from the cart
    public void clearCart() {
        cartItems.clear();
        this.totalAmount = 0.0;
    }

    public Long getCartId() { return cartId; }
    public void setCartId(Long cartId) { this.cartId = cartId; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public List<CartItem> getCartItems() { return cartItems; }
    public void setCartItems(List<CartItem> cartItems) { this.cartItems = cartItems; }

}


