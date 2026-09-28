package com.VisionExpress.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    private String name;
    private String category;
    private double price;
    private int stockQuantity;
    private String description;
    private String pic;

    // Default Constructor (Required by JPA)
    public Product() {}

    // Business Methods
    public boolean checkStock(int qty) {
        return this.stockQuantity >= qty;
    }

    public void updateStock(int qty) {
        this.stockQuantity = qty;
    }

    public String getProductDetails() {
        return "Product [ID=" + productId + ", Name=" + name + ", Price=$" + price + ", Stock=" + stockQuantity + "]";
    }

    // Standard Getters and Setters
    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(int stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPic() {
        return pic;
    }

    public void setPic(String pic) {
        this.pic = pic;
    }
}