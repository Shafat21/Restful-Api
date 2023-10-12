-- Create a new database
CREATE DATABASE restapiexpress;

-- Use the newly created database
USE restapiexpress;

-- Create a table to store resources
CREATE TABLE resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  key_name VARCHAR(255) NOT NULL,
  value TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
