package com.fitgrocery.demo.dto;

import java.util.List;

public class CheckoutResponse {

    private List<CartItemResponse> items;
    private double totalPrice;
    private int totalCalories;

    public CheckoutResponse(List<CartItemResponse> items, double totalPrice, int totalCalories) {
        this.items = items;
        this.totalPrice = totalPrice;
        this.totalCalories = totalCalories;
    }

    public List<CartItemResponse> getItems() {
        return items;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public int getTotalCalories() {
        return totalCalories;
    }
}