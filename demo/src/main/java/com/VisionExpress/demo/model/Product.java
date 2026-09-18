package com.VisionExpress.demo.model;

public class Product {
    private String Name;
    private String Category;
    private double Price;
    private int Stock_quantity;
    private String Description;
    private String pic;

    public String getName() {
        return Name;
    }

    public void setCategory(String category) {
        Category = category;
    }

    public void setName(String name) {
        Name = name;
    }

    public void setPrice(double price) {
        Price = price;
    }

    public void setStock_quantity(int stock_quantity) {
        Stock_quantity = stock_quantity;
    }

    public void setDescription(String description) {
        Description = description;
    }

    public void setPic(String pic) {
        this.pic = pic;
    }

    public String getCategory() {
        return Category;
    }

    public double getPrice() {
        return Price;
    }

    public int getStock_quantity() {
        return Stock_quantity;
    }

    public String getDescription() {
        return Description;
    }

    public String getPic() {
        return pic;
    }
}

