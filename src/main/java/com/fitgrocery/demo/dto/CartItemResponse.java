package com.fitgrocery.demo.dto;

public class CartItemResponse {

    private Long productId;
    private String productName;
    private double price;
    private int quantity;
    private double subtotal;
    private int calories;

    public CartItemResponse(Long productId, String productName, double price, int quantity, double subtotal, int calories) {
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
        this.subtotal = subtotal;
        this.calories = calories;
    }

    public Long getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public double getPrice() {
        return price;
    }

    public int getQuantity() {
        return quantity;
    }

    public double getSubtotal() {
        return subtotal;
    }

    public int getCalories() {
        return calories;
    }
}