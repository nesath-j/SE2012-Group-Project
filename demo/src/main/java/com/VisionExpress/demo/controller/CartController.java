package com.VisionExpress.demo.controller;

import com.VisionExpress.demo.model.Cart;
import com.VisionExpress.demo.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    // GET /api/cart/{cartId} - View cart details
    @GetMapping("/{cartId}")
    public ResponseEntity<Cart> getCart(@PathVariable Long cartId) {
        Cart cart = cartService.getCart(cartId);
        return ResponseEntity.ok(cart);
    }

    // POST /api/cart/{cartId}/items?productId=1&quantity=2 - Add product to cart
    @PostMapping("/{cartId}/items")
    public ResponseEntity<Cart> addItem(
            @PathVariable Long cartId,
            @RequestParam Long productId,
            @RequestParam int quantity) {
        Cart updatedCart = cartService.addItemToCart(cartId, productId, quantity);
        return ResponseEntity.ok(updatedCart);
    }

    // DELETE /api/cart/{cartId}/items/{productId} - Remove specific product from cart
    @DeleteMapping("/{cartId}/items/{productId}")
    public ResponseEntity<Cart> removeItem(
            @PathVariable Long cartId,
            @PathVariable Long productId) {
        Cart updatedCart = cartService.removeItemFromCart(cartId, productId);
        return ResponseEntity.ok(updatedCart);
    }

    // DELETE /api/cart/{cartId} - Clear the entire cart
    @DeleteMapping("/{cartId}")
    public ResponseEntity<Cart> clearCart(@PathVariable Long cartId) {
        Cart clearedCart = cartService.clearCart(cartId);
        return ResponseEntity.ok(clearedCart);
    }
}