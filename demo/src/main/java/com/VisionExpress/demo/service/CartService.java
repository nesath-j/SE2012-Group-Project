package com.VisionExpress.demo.service;

import com.VisionExpress.demo.model.Cart;
import com.VisionExpress.demo.model.Product;
import com.VisionExpress.demo.repository.CartRepository;
import com.VisionExpress.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    // Retrieve cart by ID, or create a new one if it doesn't exist yet
    public Cart getCart(Long cartId) {
        return cartRepository.findById(cartId).orElseGet(() -> {
            Cart newCart = new Cart();
            return cartRepository.save(newCart);
        });
    }

    @Transactional
    public Cart addItemToCart(Long cartId, Long productId, int quantity) {
        Cart cart = getCart(cartId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        cart.addItem(product, quantity);
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart removeItemFromCart(Long cartId, Long productId) {
        Cart cart = getCart(cartId);
        cart.removeItem(productId);
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart clearCart(Long cartId) {
        Cart cart = getCart(cartId);
        cart.clearCart();
        return cartRepository.save(cart);
    }
}
