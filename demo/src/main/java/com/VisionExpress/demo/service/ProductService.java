package com.VisionExpress.demo.service;

import com.VisionExpress.demo.model.Product;
import com.VisionExpress.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;     // Added import
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // 1. ADD PRODUCT (Added)
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    // 2. UPDATE PRODUCT
    public Optional<Product> updateProduct(Long id, Product details) {
        return productRepository.findById(id).map(existingProduct -> {
            existingProduct.setName(details.getName());
            existingProduct.setPrice(details.getPrice());
            existingProduct.setCategory(details.getCategory());
            existingProduct.setStockQuantity(details.getStockQuantity());
            existingProduct.setDescription(details.getDescription());
            existingProduct.setPic(details.getPic());
            return productRepository.save(existingProduct);
        });
    }

    // 3. DELETE PRODUCT (Added)
    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // 4. SEARCH PRODUCTS (Added)
    public List<Product> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }

    // 5. CHECK STOCK
    public boolean checkStock(Long id, int qty) {
        return productRepository.findById(id)
                .map(Product -> Product.checkStock(qty))
                .orElse(false);
    }

    // 6. UPDATE STOCK
    public boolean updateStock(Long id, int newQty) {
        return productRepository.findById(id).map(Product -> {
            Product.updateStock(newQty);
            productRepository.save(Product);
            return true;
        }).orElse(false);
    }
}