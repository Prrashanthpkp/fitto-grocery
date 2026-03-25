package com.fitgrocery.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fitgrocery.demo.entity.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByCartId(Long cartId);

}