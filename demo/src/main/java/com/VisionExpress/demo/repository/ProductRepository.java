package com.VisionExpress.demo.repository;

import com.VisionExpress.demo.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Custom query method for search functionality
    List<Product> findByNameContainingIgnoreCase(String keyword);
}