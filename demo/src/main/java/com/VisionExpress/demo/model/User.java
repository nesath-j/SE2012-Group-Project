package com.VisionExpress.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
public class User {

     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     @Column(name = "user_id")
     private int userId;

     @Column(name = "first_name", nullable = false, length = 50)
     private String firstName;

     @Column(name = "last_name", nullable = false, length = 50)
     private String lastName;

     @Column(name = "email", nullable = false, unique = true, length = 100)
     private String email;

     @Column(name = "password_hash", nullable = false, length = 255)
     private String passwordHash;

     @Column(name = "phone", length = 20)
     private String phone;

     @Column(name = "user_type", nullable = false, length = 20)
     private String userType;

     public User() {}

     public User(int userId, String firstName, String lastName, String email, String passwordHash, String phone, String userType) {
          this.userId = userId;
          this.firstName = firstName;
          this.lastName = lastName;
          this.email = email;
          this.passwordHash = passwordHash;
          this.phone = phone;
          this.userType = userType;
     }

     public int getUserId() {
          return userId;
     }

     public void setUserId(int userId) {
          this.userId = userId;
     }

     public String getFirstName() {
          return firstName;
     }

     public void setFirstName(String firstName) {
          this.firstName = firstName;
     }

     public String getLastName() {
          return lastName;
     }

     public void setLastName(String lastName) {
          this.lastName = lastName;
     }

     public String getEmail() {
          return email;
     }

     public void setEmail(String email) {
          this.email = email;
     }

     public String getPasswordHash() {
          return passwordHash;
     }

     public void setPasswordHash(String passwordHash) {
          this.passwordHash = passwordHash;
     }

     public String getPhone() {
          return phone;
     }

     public void setPhone(String phone) {
          this.phone = phone;
     }

     public String getUserType() {
          return userType;
     }

     public void setUserType(String userType) {
          this.userType = userType;
     }
}