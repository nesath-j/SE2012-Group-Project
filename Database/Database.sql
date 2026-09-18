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

CREATE TABLE IF NOT EXISTS EMPLOYEE(
employee_id INT,
role_title VARCHAR(50) NOT NULL,
assigned_branch VARCHAR(100),
CONSTRAINT pk_employee PRIMARY KEY (employee_id),
CONSTRAINT fk_employee_user FOREIGN KEY (employee_id) REFERENCES USER(user_id) 
ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS SERVICE_APPOINTMENT(
service_appointment_id INT AUTO_INCREMENT,
member_id INT NOT NULL,
employee_id INT NOT NULL,
service_type VARCHAR(100) NOT NULL,
appointment_date DATETIME NOT NULL,
service_status VARCHAR(50) NOT NULL,
CONSTRAINT pk_service_appointment PRIMARY KEY (service_appointment_id),
CONSTRAINT fk_service_member FOREIGN KEY (member_id) REFERENCES MEMBER(member_id) ON DELETE CASCADE ON UPDATE CASCADE,
CONSTRAINT fk_service_employee FOREIGN KEY (employee_id) REFERENCES EMPLOYEE(employee_id) ON DELETE CASCADE ON UPDATE CASCADE,
CONSTRAINT chk_service_type CHECK (service_type IN ('Frame Adjustment','Lens Fitting','Repair')),
CONSTRAINT chk_service_status CHECK (service_status IN ('Scheduled', 'In-Progress', 'Completed', 'Cancelled'))
);

CREATE TABLE IF NOT EXISTS COURIER (
courier_id INT AUTO_INCREMENT,
company_name VARCHAR(100) NOT NULL,
contact_number VARCHAR(20) NOT NULL,
service_type VARCHAR(50) NOT NULL, 
CONSTRAINT pk_courier PRIMARY KEY (courier_id)
);
CREATE TABLE Doctor(
	doctor_id INT,
    specialization VARCHAR(100) NOT NULL,
    license_number VARCHAR(50),
    
    CONSTRAINT pk_doctor PRIMARY KEY (doctor_id),
	CONSTRAINT fk_doctor_user FOREIGN KEY (doctor_id) REFERENCES USER(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uq_doctor_license UNIQUE(license_number)
);

CREATE TABLE DOCTOR_SCHEDULE(
	schedule_id INT AUTO_INCREMENT,
    doctor_id INT NOT NULL,
    available_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_booked BOOLEAN NOT NULL DEFAULT FALSE,
    
    CONSTRAINT pk_doctor_schedule PRIMARY KEY (schedule_id),
    CONSTRAINT fk_schedule_doctor FOREIGN KEY (schedule_id) REFERENCES Doctor (doctor_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_schedule_time CHECK (end_time > start_time) ,
    CONSTRAINT uq_doctor_time_slot UNIQUE (doctor_id, available_date,end_time)
);

CREATE TABLE DOCTOR_APPOINMENT(
	doctor_appoinment_id INT AUTO_INCREMENT,
    member_id INT NOT NULL,
    doctor_id INT NOT NULL,
    schedule_id INT NOT NULL,
    appoinment_date DATETIME NOT NULL,
    status VARCHAR(50) NOT NULL,
    consulation_notes TEXT,
    
    CONSTRAINT pk_doctor_appoinment PRIMARY KEY (doctor_appoinment_id),
    CONSTRAINT fk_appoinment_member FOREIGN KEY (member_id) REFERENCES member (member_id) ON DELETE CASCADE ON UPDATE CASCADE ,
    CONSTRAINT fk_appoinment_doctor FOREIGN KEY (doctor_id) REFERENCES doctor (doctor_id) ON DELETE CASCADE ON UPDATE CASCADE ,
    CONSTRAINT fk_appoinment_schedule FOREIGN KEY (schedule_id) REFERENCES member (schedule_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uq_appoinment_schedule UNIQUE (schedule_id),
	CONSTRAINT chk_appoinment_member_status CHECK (status IN('Confirmed', 'Completed','Cancelled'))
);
