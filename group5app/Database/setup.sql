DROP DATABASE IF EXISTS food_ordering_app; 

CREATE DATABASE food_ordering_app;
USE food_ordering_app;

-- RESTAURANTS
CREATE TABLE restaurants(
    restaurantID INT AUTO_INCREMENT PRIMARY KEY,
    restaurantName VARCHAR(50) NOT NULL,
    addressLine1 VARCHAR(100),
    city VARCHAR(100),
    postcode VARCHAR(10) NOT NULL,
    deliveryTime INT DEFAULT 30  
);

-- ITEMS
CREATE TABLE items(
    itemID INT AUTO_INCREMENT PRIMARY KEY,
    itemName VARCHAR(100) NOT NULL,
    restaurantID INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    avRating DECIMAL (3,2),
    calories INT,
    description TEXT,              
    ingredients TEXT,              
    isVegan BOOLEAN DEFAULT FALSE, 
    FOREIGN KEY (restaurantID) REFERENCES restaurants(restaurantID)
);

-- CUSTOMERS
CREATE TABLE customers(
    customerID INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    emailAddress VARCHAR(100) NOT NULL
);

-- ORDERS
CREATE TABLE orders(
    orderID INT AUTO_INCREMENT PRIMARY KEY,
    itemID INT NOT NULL,
    customerID INT NOT NULL,
    totalPrice DECIMAL(10,2),       
    orderDetails VARCHAR(500),     
    orderTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (itemID) REFERENCES items(itemID),
    FOREIGN KEY (customerID) REFERENCES customers(customerID)
);

-- ALLERGENS
CREATE TABLE allergens(
    allergenID INT AUTO_INCREMENT PRIMARY KEY,
    allergenName VARCHAR(100) NOT NULL
);

-- ITEM_ALLERGENS (Linking Table)
CREATE TABLE item_allergens(
    itemID INT NOT NULL,
    allergenID INT NOT NULL,
    PRIMARY KEY (itemID, allergenID),
    FOREIGN KEY (itemID) REFERENCES items(itemID),
    FOREIGN KEY (allergenID) REFERENCES allergens(allergenID)
);

/* 
USE food_ordering_app;

-- 1. Restaurants
INSERT INTO restaurants (restaurantName, postcode, deliveryTime) VALUES 
('Burger King', 'W1 1AA', 35),      
('Five Guys', 'W2 2BB', 25),        
('Shake Shack', 'WC2 3CC', 40);     

-- 2. Items 
INSERT INTO items (itemName, restaurantID, price, avRating, calories, description, ingredients, isVegan) VALUES 
('Double Cheeseburger', 1, 8.50, 4.5, 850, 'Two beef patties with melted cheddar.', 'Beef, Cheddar Cheese, Pickles, Mustard, Bun', FALSE),
('Vegan Beyond Burger', 2, 12.00, 4.2, 600, 'Plant-based patty with fresh lettuce.', 'Pea Protein Patty, Lettuce, Tomato, Vegan Mayo, Wholemeal Bun', TRUE),
('Crispy Chicken Burger', 3, 9.50, 4.7, 750, 'Fried chicken breast with spicy mayo.', 'Chicken Breast, Flour, Spicy Mayo, Pickles, Brioche Bun', FALSE);

-- 3. Allergens
INSERT INTO allergens (allergenName) VALUES 
('Gluten'), ('Dairy'), ('Eggs'), ('Mustard'), ('Sesame'), ('Soy');

-- 4. Item Allergens
-- Burger 1 (Beef): Gluten (Bun), Dairy (Cheese), Mustard, Sesame
INSERT INTO item_allergens (itemID, allergenID) VALUES 
(1, 1), (1, 2), (1, 4), (1, 5);

-- Burger 2 (Vegan): Gluten (Bun), Sesame, Soy
INSERT INTO item_allergens (itemID, allergenID) VALUES 
(2, 1), (2, 5), (2, 6);

-- Burger 3 (Chicken): Gluten (Breading), Eggs (Mayo), Dairy (Brioche Bun)
INSERT INTO item_allergens (itemID, allergenID) VALUES 
(3, 1), (3, 3), (3, 2);

-- 5. Customer
INSERT INTO customers (firstName, lastName, emailAddress) VALUES 
('Test', 'User', 'test@gmail.com'),
('Oliver', 'Smith', 'oliver@gmail.com'); */
