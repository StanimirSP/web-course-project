-- create table users
CREATE TABLE `users` (
	`id` INT NOT NULL AUTO_INCREMENT ,
	 `faculty_number` VARCHAR(6) NOT NULL ,
	 `username` VARCHAR(16) NOT NULL ,
	 `email` VARCHAR(64) NOT NULL ,
	 `password` VARCHAR(256) NOT NULL ,
	 `type` ENUM('ADMIN','REGULAR') NOT NULL DEFAULT 'REGULAR' ,
	 PRIMARY KEY (`id`), UNIQUE (`faculty_number`), 
	 UNIQUE (`username`)
) ENGINE = InnoDB;

-- create table schedules
CREATE TABLE `schedules` (
    `id` INT NOT NULL AUTO_INCREMENT ,
    `title` VARCHAR(255) NOT NULL , 
    `date` DATE NOT NULL , 
    `schedule_start` TIME NOT NULL , 
    `schedule_end` TIME NOT NULL ,
    `schedule_step` TIME NOT NULL ,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE ,
    `created_by` INT NOT NULL ,
    PRIMARY KEY (`id`),
    FOREIGN KEY (created_by) REFERENCES Users(id)
) ENGINE = InnoDB;

-- create table schedule_records
CREATE TABLE `schedule_records` (
	`schedule_id` INT NOT NULL , 
	`slot_number` INT NOT NULL , 
	`presenter_id` INT NOT NULL , 
	`presentation_title` VARCHAR(255) NOT NULL , 
	`keywords` VARCHAR(255) NULL DEFAULT NULL , 
	`grade` DECIMAL(3,2) NULL DEFAULT NULL , 
	PRIMARY KEY (`schedule_id`, `slot_number`) ,
	FOREIGN KEY (schedule_id) REFERENCES schedules(id) ,
	FOREIGN KEY (presenter_id) REFERENCES Users(id)
) ENGINE = InnoDB;
