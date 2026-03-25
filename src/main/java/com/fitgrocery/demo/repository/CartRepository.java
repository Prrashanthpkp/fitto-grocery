package com.fitgrocery.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fitgrocery.demo.entity.Cart;
import java.util.Optional;



public interface CartRepository extends JpaRepository<Cart, Long> {
Optional<Cart> findByUserId(Long userId);
}