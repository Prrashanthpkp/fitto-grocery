package com.fitgrocery.demo.controller;

import com.fitgrocery.demo.entity.*;
import com.fitgrocery.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/orders")
@CrossOrigin
public class OrderController {

    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private CartRepository cartRepository;
    @Autowired private CartItemRepository cartItemRepository;
    @Autowired private ProductRepository productRepository;

    // PLACE ORDER
    @PostMapping("/place/{userId}")
    public Order placeOrder(@PathVariable Long userId,
                            @RequestParam String paymentMethod) {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());

        if (cartItems.isEmpty()) throw new RuntimeException("Cart is empty");

        double total = 0;
        for (CartItem item : cartItems) {
            total += item.getPrice();
        }

        Order order = new Order();
        order.setUserId(userId);
        order.setTotalAmount(total);
        order.setPaymentMethod(paymentMethod);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PLACED");              // ← NEW
        Order savedOrder = orderRepository.save(order);

        for (CartItem item : cartItems) {
            Product product = productRepository.findById(item.getProductId()).orElse(null);
            OrderItem orderItem = new OrderItem();
            orderItem.setOrderId(savedOrder.getId());
            orderItem.setProductId(item.getProductId());
            orderItem.setProductName(product != null ? product.getName() : "Unknown");
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPrice(item.getPrice());
            orderItemRepository.save(orderItem);
        }

        for (CartItem item : cartItems) {
            cartItemRepository.deleteById(item.getId());
        }

        return savedOrder;
    }

    // GET ORDERS BY USER
    @GetMapping("/{userId}")
    public List<Map<String, Object>> getOrders(@PathVariable Long userId) {

        List<Order> orders = orderRepository.findByUserIdOrderByOrderDateDesc(userId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (Order order : orders) {
            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
            Map<String, Object> map = new HashMap<>();
            map.put("id",            order.getId());
            map.put("totalAmount",   order.getTotalAmount());
            map.put("paymentMethod", order.getPaymentMethod());
            map.put("orderDate",     order.getOrderDate());
            map.put("status",        order.getStatus());    // ← NEW
            map.put("items",         items);
            result.add(map);
        }

        return result;
    }

    // CANCEL ORDER
    @PutMapping("/cancel/{orderId}")
    public Order cancelOrder(@PathVariable Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if ("DELIVERED".equals(order.getStatus())) {
            throw new RuntimeException("Cannot cancel delivered order");
        }

        order.setStatus("CANCELLED");
        return orderRepository.save(order);
    }

    // AUTO DELIVER
    @PutMapping("/deliver/{orderId}")
    public Order deliverOrder(@PathVariable Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!"CANCELLED".equals(order.getStatus())) {
            order.setStatus("DELIVERED");
            orderRepository.save(order);
        }

        return order;
    }
}