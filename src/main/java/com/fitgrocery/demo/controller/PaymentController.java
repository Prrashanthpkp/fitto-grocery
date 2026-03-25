package com.fitgrocery.demo.controller;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import com.razorpay.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.fitgrocery.demo.repository.CartRepository;
import com.fitgrocery.demo.repository.CartItemRepository;
import com.fitgrocery.demo.entity.Cart;
import com.fitgrocery.demo.entity.CartItem;
import java.util.List;

@RestController
@RequestMapping("/payment")
@CrossOrigin
public class PaymentController {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    private static final String KEY_ID     = "rzp_test_SJaIubTFlNBweC";
    private static final String KEY_SECRET = "ykVWRWLxSleazgvNJm9jRkfi";

    // GET TOTAL FROM CART
    @GetMapping("/checkout/{userId}")
    public double checkout(@PathVariable Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());

        double total = 0;
        for (CartItem item : items) {
            total += item.getPrice(); // each row = qty 1
        }
        return total;
    }

    // CREATE RAZORPAY ORDER
    @PostMapping("/create-order/{userId}")
    public String createOrder(@PathVariable Long userId) throws RazorpayException {
        double totalAmount = checkout(userId);

        RazorpayClient razorpay = new RazorpayClient(KEY_ID, KEY_SECRET);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount",   (int)(totalAmount * 100)); // convert to paise
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt",  "txn_" + userId + "_" + System.currentTimeMillis());

        Order order = razorpay.orders.create(orderRequest);
        return order.toString();
    }
}