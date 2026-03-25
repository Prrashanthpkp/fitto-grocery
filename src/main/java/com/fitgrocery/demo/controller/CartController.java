package com.fitgrocery.demo.controller;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.fitgrocery.demo.dto.*;
import com.fitgrocery.demo.entity.*;
import com.fitgrocery.demo.repository.*;

@RestController
@RequestMapping("/cart")
@CrossOrigin
public class CartController {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartRepository cartRepository;

    // Add product to cart using userId
    @PostMapping("/add/{userId}")
    public CartItem addToCart(@PathVariable Long userId, @RequestBody CartItem cartItem) {

        // find or create cart
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUserId(userId);
                    return cartRepository.save(newCart);
                });

        cartItem.setCartId(cart.getId());

        return cartItemRepository.save(cartItem);
    }

    // Get cart items using userId
    @GetMapping("/{userId}")
    public List<CartItem> getCartItems(@PathVariable Long userId) {

        Optional<Cart> cartOptional = cartRepository.findByUserId(userId);

        if (cartOptional.isEmpty()) {
            return new ArrayList<>(); // 🔥 FIX: return empty instead of crashing
        }

        Cart cart = cartOptional.get();

        return cartItemRepository.findByCartId(cart.getId());
    }
    
    @DeleteMapping("/remove/{cartItemId}")
    public void removeItem(@PathVariable Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }
    
    @DeleteMapping("/remove/product/{userId}/{productId}")
    public void removeProductFromCart(@PathVariable Long userId, @PathVariable Long productId) {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());

        for (CartItem item : items) {
            if (item.getProductId().equals(productId)) {
                cartItemRepository.deleteById(item.getId());
            }
        }
    }

    // Checkout using userId
    @GetMapping("/checkout/{userId}")
    public CheckoutResponse checkout(@PathVariable Long userId) {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());

        List<CartItemResponse> responseItems = new ArrayList<>();

        double totalPrice = 0;
        int totalCalories = 0;

        for (CartItem item : cartItems) {

            Product product = productRepository.findById(item.getProductId()).orElse(null);

            if (product == null) continue;

            double subtotal = item.getPrice() * item.getQuantity();
            int calories = product.getCalories() * item.getQuantity();

            responseItems.add(new CartItemResponse(
                    product.getId(),
                    product.getName(),
                    item.getPrice(),
                    item.getQuantity(),
                    subtotal,
                    calories
            ));

            totalPrice += subtotal;
            totalCalories += calories;
        }

        return new CheckoutResponse(responseItems, totalPrice, totalCalories);
    }
}