package com.VisionExpress.demo.repository;

import com.VisionExpress.demo.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Integer> {

}
