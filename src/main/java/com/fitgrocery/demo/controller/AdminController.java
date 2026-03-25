package com.fitgrocery.demo.controller;

import com.fitgrocery.demo.entity.*;
import com.fitgrocery.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {

    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;

    // ALL ORDERS WITH USER INFO
    @GetMapping("/orders")
    public List<Map<String, Object>> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Order order : orders) {
            User user = userRepository.findById(order.getUserId()).orElse(null);
            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());

            Map<String, Object> map = new HashMap<>();
            map.put("id",            order.getId());
            map.put("userName",      user != null ? user.getName() : "Unknown");
            map.put("userEmail",     user != null ? user.getEmail() : "Unknown");
            map.put("totalAmount",   order.getTotalAmount());
            map.put("paymentMethod", order.getPaymentMethod());
            map.put("orderDate",     order.getOrderDate());
            map.put("items",         items);
            result.add(map);
        }
        return result;
    }

    // ALL USERS
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ALL PRODUCTS WITH STOCK
    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // MOST ORDERED PRODUCTS (BAR CHART)
    @GetMapping("/stats/top-products")
    public List<Map<String, Object>> getTopProducts() {
        List<OrderItem> allItems = orderItemRepository.findAll();

        Map<String, Integer> countMap = new HashMap<>();
        for (OrderItem item : allItems) {
            countMap.merge(item.getProductName(), item.getQuantity(), Integer::sum);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        countMap.forEach((name, qty) -> {
            Map<String, Object> m = new HashMap<>();
            m.put("name", name);
            m.put("orders", qty);
            result.add(m);
        });

        result.sort((a, b) -> (int) b.get("orders") - (int) a.get("orders"));
        return result.subList(0, Math.min(8, result.size()));
    }

    // ORDERS PER DAY THIS WEEK (LINE CHART)
    @GetMapping("/stats/weekly-orders")
    public List<Map<String, Object>> getWeeklyOrders() {
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        List<Order> orders = orderRepository.findAll();

        Map<String, Integer> dayMap = new LinkedHashMap<>();
        String[] days = {"Mon","Tue","Wed","Thu","Fri","Sat","Sun"};
        for (String d : days) dayMap.put(d, 0);

        for (Order order : orders) {
            if (order.getOrderDate() != null &&
                order.getOrderDate().isAfter(weekAgo)) {
                String day = order.getOrderDate()
                    .getDayOfWeek().name().substring(0, 3);
                String key = day.charAt(0) + day.substring(1).toLowerCase();
                dayMap.merge(key, 1, Integer::sum);
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();
        dayMap.forEach((day, count) -> {
            Map<String, Object> m = new HashMap<>();
            m.put("day", day);
            m.put("orders", count);
            result.add(m);
        });
        return result;
    }

    // DASHBOARD SUMMARY
    @GetMapping("/stats/summary")
    public Map<String, Object> getSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalOrders",   orderRepository.count());
        summary.put("totalUsers",    userRepository.count());
        summary.put("totalProducts", productRepository.count());

        double revenue = orderRepository.findAll()
            .stream().mapToDouble(Order::getTotalAmount).sum();
        summary.put("totalRevenue", revenue);
        return summary;
    }
}