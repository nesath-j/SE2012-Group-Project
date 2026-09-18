CREATE DATABASE VisionExpress;
USE VisionExpress;

CREATE TABLE IF NOT EXISTS user (
user_id INT AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(50) NOT NULL,
last_name VARCHAR(50) NOT NULL,
email VARCHAR(100) NOT NULL UNIQUE,
phone VARCHAR(100) NOT NULL,
password_hash VARCHAR(255) NOT NULL,
user_type ENUM('Member','Doctor','Employee','Manager','Admin') NOT NULL);

CREATE TABLE IF NOT EXISTS member (
member_id INT PRIMARY KEY,
loyalty_points INT DEFAULT 0,
tier_id INT,
prescription_doc_path VARCHAR(255) NULL,
CONSTRAINT fk_member_user FOREIGN KEY (member_id) REFERENCES users(user_id) 
	ON DELETE CASCADE 
	ON UPDATE CASCADE,
CONSTRAINT fk_member_tier FOREIGN KEY (tier_id) REFERENCES loyalty_tier(tier_id) 
	ON DELETE SET NULL 
	ON UPDATE CASCADE );
    
CREATE TABLE IF NOT EXISTS loyalty_tier (
tier_id INT AUTO_INCREMENT PRIMARY KEY,
tier_name VARCHAR(50) NOT NULL,
min_points INT NOT NULL,
discount_percentage DECIMAL(5, 2) NOT NULL );
