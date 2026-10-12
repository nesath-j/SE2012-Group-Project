DROP DATABASE IF EXISTS VisionExpress;
CREATE DATABASE VisionExpress;
USE VisionExpress;


CREATE TABLE IF NOT EXISTS user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('Member','Doctor','Employee','Manager','Admin') NOT NULL
);

CREATE TABLE IF NOT EXISTS loyalty_tier (
    tier_id INT AUTO_INCREMENT PRIMARY KEY,
    tier_name VARCHAR(50) NOT NULL,
    min_points INT NOT NULL,
    discount_percentage DECIMAL(5, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS Product (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    pName VARCHAR(100) NOT NULL,
    pCategory VARCHAR(50) NOT NULL,
    pPrice DECIMAL(10, 2) NOT NULL,
    pStock_quantity INT NOT NULL DEFAULT 0,
    pDescription TEXT
);

CREATE TABLE IF NOT EXISTS COURIER (
    courier_id INT AUTO_INCREMENT,
    company_name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    service_type VARCHAR(50) NOT NULL,
    CONSTRAINT pk_courier PRIMARY KEY (courier_id)
);

CREATE TABLE IF NOT EXISTS user_phone (
    user_id INT,
    phone VARCHAR(100) NOT NULL,
    CONSTRAINT pk_user_phone PRIMARY KEY (user_id, phone),
    CONSTRAINT fk_user_phone FOREIGN KEY (user_id) REFERENCES user(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS member (
    member_id INT PRIMARY KEY,
    loyalty_points INT DEFAULT 0,
    tier_id INT,
    prescription_doc_path VARCHAR(255) NULL,
    CONSTRAINT fk_member_user FOREIGN KEY (member_id) REFERENCES user(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_member_tier FOREIGN KEY (tier_id) REFERENCES loyalty_tier(tier_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS EMPLOYEE (
    employee_id INT,
    role_title VARCHAR(50) NOT NULL,
    assigned_department VARCHAR(100),
    CONSTRAINT pk_employee PRIMARY KEY (employee_id),
    CONSTRAINT fk_employee_user FOREIGN KEY (employee_id) REFERENCES user(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Doctor (
    doctor_id INT,
    specialization VARCHAR(100) NOT NULL,
    license_number VARCHAR(50),
    CONSTRAINT pk_doctor PRIMARY KEY (doctor_id),
    CONSTRAINT fk_doctor_user FOREIGN KEY (doctor_id) REFERENCES user(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT uq_doctor_license UNIQUE (license_number)
);

CREATE TABLE IF NOT EXISTS manager (
    manager_id INT PRIMARY KEY,
    CONSTRAINT fk_manager_employee FOREIGN KEY (manager_id) REFERENCES EMPLOYEE(employee_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS admin (
    admin_id INT PRIMARY KEY,
    CONSTRAINT fk_admin_manager FOREIGN KEY (admin_id) REFERENCES manager(manager_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS SERVICE_APPOINTMENT (
    service_appointment_id INT AUTO_INCREMENT,
    member_id INT NOT NULL,
    employee_id INT NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    appointment_date DATETIME NOT NULL,
    service_status VARCHAR(50) NOT NULL,
    CONSTRAINT pk_service_appointment PRIMARY KEY (service_appointment_id),
    CONSTRAINT fk_service_member FOREIGN KEY (member_id) REFERENCES member(member_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_service_employee FOREIGN KEY (employee_id) REFERENCES EMPLOYEE(employee_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_service_type CHECK (service_type IN ('Frame Adjustment','Lens Fitting','Repair')),
    CONSTRAINT chk_service_status CHECK (service_status IN ('Scheduled', 'In-Progress', 'Completed', 'Cancelled'))
);

CREATE TABLE IF NOT EXISTS DOCTOR_SCHEDULE (
    schedule_id INT AUTO_INCREMENT,
    doctor_id INT NOT NULL,
    available_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_booked BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT pk_doctor_schedule PRIMARY KEY (schedule_id),
    CONSTRAINT fk_schedule_doctor FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_schedule_time CHECK (end_time > start_time),
    CONSTRAINT uq_doctor_time_slot UNIQUE (doctor_id, available_date, end_time)
);

CREATE TABLE IF NOT EXISTS DOCTOR_APPOINMENT (
    doctor_appoinment_id INT AUTO_INCREMENT,
    member_id INT NOT NULL,
    doctor_id INT NOT NULL,
    schedule_id INT NOT NULL,
    appoinment_date DATETIME NOT NULL,
    status VARCHAR(50) NOT NULL,
    consulation_notes TEXT,
    CONSTRAINT pk_doctor_appoinment PRIMARY KEY (doctor_appoinment_id),
    CONSTRAINT fk_appoinment_member FOREIGN KEY (member_id) REFERENCES member(member_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_appoinment_doctor FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_appoinment_schedule FOREIGN KEY (schedule_id) REFERENCES DOCTOR_SCHEDULE(schedule_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uq_appoinment_schedule UNIQUE (schedule_id),
    CONSTRAINT chk_appoinment_member_status CHECK (status IN ('Confirmed', 'Completed', 'Cancelled'))
);

CREATE TABLE IF NOT EXISTS Orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    order_date DATETIME,
    total_amount DECIMAL(10, 2),
    discount_applied DECIMAL(10, 2) DEFAULT 0.00,
    order_status VARCHAR(50),
    member_id INT,
    CONSTRAINT fk_order_member FOREIGN KEY (member_id) REFERENCES member(member_id)
);

CREATE TABLE IF NOT EXISTS Order_item (
    orderItem_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    product_id INT,
    quantity INT,
    unitPrice DECIMAL(10, 2),
    CONSTRAINT fk_orderItem_order FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    CONSTRAINT fk_orderItem_product FOREIGN KEY (product_id) REFERENCES Product(product_id)
);

CREATE TABLE IF NOT EXISTS Cart (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    member_id INT,
    total_amount DECIMAL(10, 2) DEFAULT 0.00,
    CONSTRAINT fk_cart_member FOREIGN KEY (member_id) REFERENCES member(member_id)
);

CREATE TABLE IF NOT EXISTS Cart_item (
    cartItem_id INT PRIMARY KEY AUTO_INCREMENT,
    cart_id INT,
    product_id INT,
    quantity INT,
    unitPrice DECIMAL(10, 2),
    CONSTRAINT fk_cartItem_cart FOREIGN KEY (cart_id) REFERENCES Cart(cart_id),
    CONSTRAINT fk_cartItem_product FOREIGN KEY (product_id) REFERENCES Product(product_id)
);

CREATE TABLE IF NOT EXISTS Delivery (
    delivery_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT UNIQUE,
    courier_id INT,
    tracking_number VARCHAR(100) UNIQUE,
    delivery_status VARCHAR(50),
    dispatch_date DATE,
    estimated_delivery_date DATE,
    CONSTRAINT fk_delivery_orders FOREIGN KEY (order_id) REFERENCES Orders(order_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_delivery_courier FOREIGN KEY (courier_id) REFERENCES COURIER(courier_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

USE VisionExpress;

-- Loyalty Tiers
INSERT INTO loyalty_tier (tier_id, tier_name, min_points, discount_percentage) VALUES
    (1, 'Bronze', 0, 0.00),
    (2, 'Silver', 500, 5.00),
    (3, 'Gold', 1500, 10.00),
    (4, 'Platinum', 3000, 15.00);

-- Products
INSERT INTO Product (product_id, pName, pCategory, pPrice, pStock_quantity, pDescription) VALUES
    (1, 'Ray-Ban Wayfarer Classic', 'Eyeglasses', 165.00, 45, 'Classic square black acetate frame with clear demo lenses.'),
    (2, 'Oakley Holbrook Prizm', 'Sunglasses', 182.00, 30, 'Matte black frame with Prizm polarized lenses.'),
    (3, 'Acuvue Oasys 1-Day (90 pack)', 'Contact Lenses', 85.50, 120, 'Daily disposable silicone hydrogel contact lenses.'),
    (4, 'Air Optix Night & Day Aqua', 'Contact Lenses', 72.00, 80, 'Monthly extended wear contact lenses with high oxygen transmissibility.'),
    (5, 'Anti-Fog Microfiber Cleaning Kit', 'Accessories', 14.99, 200, '60ml lens cleaning spray, microfiber cloth, and screw set.');

-- Couriers
INSERT INTO COURIER (courier_id, company_name, contact_number, service_type) VALUES
    (1, 'DHL Express', '077 045 7894', 'Express Air'),
    (2, 'FedEx Ground', '076 784 7054', 'Standard Ground'),
    (3, 'UPS Worldwide', '074 705 7994', 'Priority Overnight');

-- Base Users (Members, Employees, Doctors, Manager, Admin)
INSERT INTO user (user_id, first_name, last_name, email, phone, password_hash, user_type) VALUES
    (1, 'Sarah', 'Edirisingha', 'sarah.e@example.com', '074 683 7004', '$2y$10$hashUser01', 'Member'),
    (2, 'Navod', 'Pathirana', 'navod.p@example.com', '073 705 7994', '$2y$10$hashUser02', 'Member'),
    (3, 'Samantha', 'Perera', 'sam.p@example.com', '073 606 9034', '$2y$10$hashUser03', 'Member'),
    (4, 'Janaki', 'Gunarathne', 'anki.gune@visionexpress.com', '077 755 7874', '$2y$10$hashDoc01', 'Doctor'),
    (5, 'Thilini', 'Jayalath', 'thilini.jay@visionexpress.com', '074 890 0238', '$2y$10$hashDoc02', 'Doctor'),
    (6, 'Damini', 'Mendis', 'dam.m@visionexpress.com', '074 892 7344', '$2y$10$hashEmp01', 'Employee'),
    (7, 'Dilini', 'Perera', 'dilini.p@visionexpress.com', '074 702 9094', '$2y$10$hashEmp02', 'Employee'),
    (8, 'Saman', 'De Silva', 'saman.ds@visionexpress.com', '072 632 7994', '$2y$10$hashMgr01', 'Manager'),
    (9, 'Tharindu', 'Gunasekara', 'tharindu.g@visionexpress.com', '074 023 7344', '$2y$10$hashAdm01', 'Admin');


-- User Secondary Phones
INSERT INTO user_phone (user_id, phone) VALUES
    (1, '074 683 7004'),
    (1, '072 895 3589'),
    (2, '073 705 7994'),
    (4, '077 755 7874'),
    (6, '074 892 7344'),
    (8, '072 632 7994');

-- Members
INSERT INTO member (member_id, loyalty_points, tier_id, prescription_doc_path) VALUES
    (1, 650, 2, '/uploads/prescriptions/rx_user_1.pdf'),
    (2, 1750, 3, '/uploads/prescriptions/rx_user_2.pdf'),
    (3, 120, 1, NULL);

-- Employees
INSERT INTO EMPLOYEE (employee_id, role_title, assigned_department) VALUES
    (6, 'Optical Technician', 'Lens Fabrication & Repair'),
    (7, 'Dispensing Optician', 'Floor Services'),
    (8, 'General Store Manager', 'Operations');

-- Doctors
INSERT INTO Doctor (doctor_id, specialization, license_number) VALUES
    (4, 'Optometry & Contact Lenses', 'OPT-99412'),
    (5, 'Ophthalmology & Cornea Care', 'OPH-44821');

-- Managers (References EMPLOYEE)
INSERT INTO manager (manager_id) VALUES
    (8);

-- Admins (References manager)
INSERT INTO admin (admin_id) VALUES
    (8);


-- Service Appointments (Technician/Floor Services)
INSERT INTO SERVICE_APPOINTMENT (service_appointment_id, member_id, employee_id, service_type, appointment_date, service_status) VALUES
    (1, 1, 6, 'Frame Adjustment', '2026-10-02 10:30:00', 'Scheduled'),
    (2, 2, 6, 'Lens Fitting', '2026-09-15 14:00:00', 'Completed'),
    (3, 3, 7, 'Repair', '2026-10-04 11:15:00', 'In-Progress');

-- Doctor Schedules
INSERT INTO DOCTOR_SCHEDULE (schedule_id, doctor_id, available_date, start_time, end_time, is_booked) VALUES
    (1, 4, '2026-10-05', '09:00:00', '09:45:00', TRUE),
    (2, 4, '2026-10-05', '10:00:00', '10:45:00', FALSE),
    (3, 4, '2026-10-05', '11:00:00', '11:45:00', FALSE),
    (4, 5, '2026-10-06', '14:00:00', '14:45:00', TRUE),
    (5, 5, '2026-10-06', '15:00:00', '15:45:00', FALSE);

-- Doctor Appointments
INSERT INTO DOCTOR_APPOINMENT (doctor_appoinment_id, member_id, doctor_id, schedule_id, appoinment_date, status, consulation_notes) VALUES
    (1, 1, 4, 1, '2026-10-05 09:00:00', 'Confirmed', 'Annual prescription renewal and dry-eye evaluation.'),
    (2, 2, 5, 4, '2026-10-06 14:00:00', 'Confirmed', 'Corneal topography check post-laser procedure.');


-- Active Shopping Carts
INSERT INTO Cart (cart_id, member_id, total_amount) VALUES
    (1, 1, 14.99),
    (2, 3, 171.00);

-- Cart Items
INSERT INTO Cart_item (cartItem_id, cart_id, product_id, quantity, unitPrice) VALUES
    (1, 1, 5, 1, 14.99),
    (2, 2, 3, 2, 85.50);

-- Orders
INSERT INTO Orders (order_id, order_date, total_amount, discount_applied, order_status, member_id) VALUES
    (1, '2026-09-24 10:15:00', 165.00, 8.25, 'Delivered', 1),
    (2, '2026-09-28 16:40:00', 196.99, 19.70, 'Shipped', 2),
    (3, '2026-09-29 11:05:00', 85.50, 0.00, 'Processing', 3);

-- Order Items
INSERT INTO Order_item (orderItem_id, order_id, product_id, quantity, unitPrice) VALUES
    (1, 1, 1, 1, 165.00),
    (2, 2, 2, 1, 182.00),
    (3, 2, 5, 1, 14.99),
    (4, 3, 3, 1, 85.50);

-- Deliveries
INSERT INTO Delivery (delivery_id, order_id, courier_id, tracking_number, delivery_status, dispatch_date, estimated_delivery_date) VALUES
    (1, 1, 1, 'DHL-908124110', 'Delivered', '2026-09-25', '2026-09-27'),
    (2, 2, 2, 'FEDX-441029411', 'In Transit', '2026-09-29', '2026-10-02');

