DROP DATABASE IF EXISTS food_ordering_app; 

CREATE DATABASE food_ordering_app;
USE food_ordering_app;

-- ================================================
-- CREATE TABLES
-- ================================================

-- RESTAURANTS
CREATE TABLE restaurants(
    restaurantID INT AUTO_INCREMENT PRIMARY KEY,
    restaurantName VARCHAR(50) NOT NULL,
    addressLine1 VARCHAR(100),
    city VARCHAR(100),
    postcode VARCHAR(10) NOT NULL,
    deliveryTime INT DEFAULT 30,  
    longitude DECIMAL (10,8),
    latitude DECIMAL (11,8)
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
    emailAddress VARCHAR(100) NOT NULL,
    phoneNumber VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    postcode VARCHAR(10) NOT NULL
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


-- ================================================
--  POPULATE RESTAURANTS (IDs 1-74)
-- ================================================

INSERT INTO restaurants (restaurantName, postcode, deliveryTime, longitude, latitude) VALUES 

-- Burger Places (IDs 1-4)
('Burger King', 'N1 1XR', 35, -0.081463, 51.504845),
('Five Guys', 'SE1 2BY', 25, -0.103612, 51.544332),
('Shake Shack', 'W1F 7HZ', 40, -0.139578, 51.513658),
('McDonalds', 'NN6 7UZ', 35, -1.123064, 52.307442),

-- Sushi (IDs 5-14)
('Sushi Zen', 'EC1A 1BB', 45, -0.100000, 51.520000),
('Tokyo Express', 'WC2H 9JQ', 20, -0.120000, 51.510000),
('Samurai Sushi', 'E1 6AN', 30, -0.075000, 51.518000),
('Oishii Eats', 'N1 9AA', 40, -0.090000, 51.530000),
('Sushi Go', 'SE1 2XY', 25, -0.085000, 51.505000),
('Blue Fin', 'SW1V 1AA', 50, -0.140000, 51.490000),
('Raw Fish Co', 'W1D 4AE', 35, -0.130000, 51.512000),
('Sashimi Station', 'EC4M 7RF', 25, -0.105000, 51.515000),
('The Roll House', 'NW1 2DB', 45, -0.135000, 51.535000),
('Nippon Bites', 'SE10 9EJ', 35, 0.005000, 51.480000),

-- Chicken (IDs 15-24)
('Cluckin Good', 'E2 6AN', 25, -0.060000, 51.525000),
('Nashville Hot', 'N1 8XX', 40, -0.095000, 51.540000),
('The Roost', 'SE15 4QQ', 30, -0.070000, 51.470000),
('Wing King', 'SW9 8LL', 35, -0.110000, 51.460000),
('Bird & Bun', 'W12 7GF', 45, -0.220000, 51.500000),
('Fried & True', 'E14 5AB', 20, -0.020000, 51.505000),
('Crispy Coop', 'NW3 6JJ', 50, -0.170000, 51.550000),
('Golden Hen', 'WC1B 3DG', 30, -0.125000, 51.520000),
('Spicy Bird', 'SE1 9PL', 25, -0.100000, 51.500000),
('KFCopy', 'N7 7QQ', 35, -0.115000, 51.555000),

-- Waffles (IDs 25-34)
('The Waffle House', 'SW1W 9SJ', 30, -0.150000, 51.495000),
('Belgian Delights', 'W1D 5AE', 35, -0.132000, 51.511000),
('Sweet Stack', 'N1 0AA', 25, -0.105000, 51.535000),
('Morning Waffle', 'SE1 3RR', 40, -0.080000, 51.495000),
('Waffle & Dough', 'E1 4TT', 20, -0.055000, 51.520000),
('Syrup Society', 'SW3 4BB', 45, -0.160000, 51.485000),
('The Grid', 'EC2A 4NE', 30, -0.085000, 51.525000),
('Iron Waffles', 'NW5 2HH', 35, -0.145000, 51.555000),
('Batter Up', 'W2 6LG', 40, -0.180000, 51.515000),
('Sugar Rush', 'SE11 5AA', 25, -0.110000, 51.490000),

-- Burrito (IDs 35-44)
('Benito Burrito', 'SE10 9XX', 35, 0.005000, 51.480000),
('Tortilla Bros', 'EC4M 7YY', 25, -0.100000, 51.510000),
('Wrap It Up', 'N1 7HG', 30, -0.090000, 51.535000),
('Guac & Roll', 'SW4 7AA', 40, -0.140000, 51.460000),
('Spicy Bean', 'E8 3QQ', 35, -0.060000, 51.545000),
('The Burrito Bar', 'W11 2EE', 45, -0.200000, 51.510000),
('Salsa Street', 'SE1 9JK', 20, -0.095000, 51.505000),
('Mexican Wave', 'NW6 4AA', 50, -0.190000, 51.540000),
('Loco Burrito', 'WC2N 5DU', 30, -0.125000, 51.510000),
('Wrap Star', 'SW18 4JJ', 25, -0.195000, 51.455000),

-- Pizza Restaurants (IDs 45-54)
('Pizza Express', 'W1B 5AN', 35, -0.137000, 51.515000),
('Dominos', 'SE1 1AA', 25, -0.090000, 51.500000),
('Papa Johns', 'N1 2BB', 30, -0.100000, 51.530000),
('Franco Manca', 'SW9 8JD', 20, -0.110000, 51.460000),
('Pizza Pilgrims', 'W1D 7JQ', 35, -0.130000, 51.512000),
('Homeslice', 'WC2H 9DP', 40, -0.125000, 51.515000),
('Yard Sale Pizza', 'E5 0NH', 30, -0.050000, 51.555000),
('Joes Pizza', 'SE10 8AG', 45, 0.010000, 51.480000),
('Bella Italia', 'WC2N 4JS', 35, -0.127000, 51.510000),
('Napoli Gang', 'E1 6JJ', 25, -0.075000, 51.520000),

-- Noodles Restaurants (IDs 55-64)
('Wagamama', 'SE1 9AA', 30, -0.105000, 51.505000),
('Pho', 'EC4M 9AF', 25, -0.100000, 51.513000),
('Bone Daddies', 'W1F 9RR', 35, -0.135000, 51.514000),
('Shoryu Ramen', 'SW1Y 5JG', 40, -0.132000, 51.508000),
('Biang Biang Noodles', 'E1 7AA', 30, -0.070000, 51.516000),
('Tonkotsu', 'E8 4QJ', 35, -0.060000, 51.538000),
('Marugame Udon', 'W1D 1LA', 20, -0.130000, 51.514000),
('Thai Square', 'WC2N 5BY', 45, -0.126000, 51.509000),
('Chow Mein Central', 'NW1 3JJ', 25, -0.140000, 51.530000),
('The Noodle Bar', 'SW15 2DT', 35, -0.210000, 51.460000),

-- Curry Restaurants (IDs 65-74)
('Dishoom', 'WC2H 9FB', 45, -0.127000, 51.512000),
('Tayyabs', 'E1 1JU', 30, -0.067000, 51.517000),
('Curry House', 'SW1A 1AA', 35, -0.141000, 51.501000),
('Spice of India', 'W1D 6AN', 40, -0.133000, 51.513000),
('Masala Zone', 'N1 0PS', 30, -0.104000, 51.534000),
('The Bombay Bicycle', 'SW11 1EJ', 45, -0.165000, 51.464000),
('Roti King', 'NW1 2ES', 35, -0.134000, 51.528000),
('Cinnamon Club', 'SW1P 3BU', 50, -0.129000, 51.498000),
('Taste of Bengal', 'E14 9GE', 30, -0.015000, 51.503000),
('Madras Cafe', 'WC2H 9JA', 25, -0.126000, 51.511000);

-- ================================================
--  POPULATE ITEMS (1-80)
-- ================================================

INSERT INTO items (itemName, restaurantID, price, avRating, calories, description, ingredients, isVegan) VALUES 

-- Burgers (IDs 1-10)
('Double Cheeseburger', 1, 8.50, 4.5, 850, 'Two beef patties with melted cheddar.', 'Beef, Cheddar Cheese, Pickles, Mustard, Bun', FALSE),
('Vegan Beyond Burger', 2, 12.00, 4.2, 600, 'Plant-based patty with fresh lettuce.', 'Pea Protein Patty, Lettuce, Tomato, Vegan Mayo, Wholemeal Bun', TRUE),
('Crispy Chicken Burger', 3, 9.50, 4.7, 750, 'Fried chicken breast with spicy mayo.', 'Chicken Breast, Flour, Spicy Mayo, Pickles, Brioche Bun', FALSE),
('BBQ Bacon Burger', 1, 9.50, 4.6, 900, 'Smoky BBQ sauce and crispy bacon.', 'Beef, Bacon, BBQ Sauce, Cheese, Bun', FALSE),
('Mushroom Swiss Burger', 2, 10.50, 4.4, 850, 'Sautéed mushrooms and swiss cheese.', 'Beef, Mushrooms, Swiss Cheese, Bun', FALSE),
('Spicy Jalapeno Burger', 3, 9.00, 4.5, 800, 'Loaded with spicy jalapenos and pepper jack.', 'Beef, Jalapenos, Pepper Jack, Spicy Mayo, Bun', FALSE),
('Triple Stacker', 4, 7.50, 4.3, 1100, 'Three patties, three cheese slices.', 'Beef, American Cheese, Ketchup, Bun', FALSE),
('Veggie Bean Burger', 1, 7.00, 4.2, 550, 'Kidney bean patty with spices.', 'Bean Patty, Lettuce, Tomato, Bun', TRUE),
('Blue Cheese Burger', 2, 11.00, 4.7, 950, 'Topped with pungent blue cheese.', 'Beef, Blue Cheese, Onion Jam, Bun', FALSE),
('Fish Fillet Burger', 4, 6.50, 4.1, 500, 'Breaded fish fillet with tartar sauce.', 'Fish, Tartar Sauce, Cheese, Bun', FALSE),

-- Sushi (IDs 11-20)
('Salmon Nigiri Sushi Set', 5, 11.50, 4.8, 320, 'Fresh salmon sushi on vinegared rice.', 'Salmon, Rice, Vinegar', FALSE),
('Spicy Tuna Sushi Roll', 6, 9.00, 4.6, 380, 'Tuna sushi roll with spicy mayo.', 'Tuna, Nori, Rice, Spicy Mayo', FALSE),
('Dragon Sushi Roll', 7, 14.50, 4.9, 520, 'Eel and cucumber sushi topped with avocado.', 'Eel, Avocado, Rice, Eel Sauce', FALSE),
('Avocado Maki Sushi', 8, 5.50, 4.3, 200, 'Simple fresh avocado sushi rolls.', 'Avocado, Nori, Rice', TRUE),
('Sashimi Sushi Platter', 9, 18.00, 4.9, 250, 'Assorted raw fish sushi slices.', 'Salmon, Tuna, Yellowtail', FALSE),
('Veggie Tempura Sushi', 10, 8.00, 4.4, 350, 'Crispy fried veg sushi roll.', 'Tempura Veg, Rice, Nori', TRUE),
('Philadelphia Sushi Roll', 11, 10.50, 4.6, 410, 'Smoked salmon and cream cheese sushi.', 'Smoked Salmon, Cream Cheese', FALSE),
('California Sushi Roll', 12, 8.50, 4.5, 300, 'Crab stick and avocado sushi.', 'Crab Stick, Avocado, Cucumber', FALSE),
('Rainbow Sushi Roll', 13, 13.50, 4.8, 450, 'California roll topped with assorted fish.', 'Crab, Avocado, Salmon, Tuna', FALSE),
('Unagi Don Sushi Bowl', 14, 16.00, 4.9, 600, 'Grilled eel over sushi rice bowl.', 'Eel, Rice, Sweet Soy Sauce', FALSE),

-- Chicken (IDs 21-30)
('6pc Spicy Chicken Wings', 15, 6.99, 4.4, 550, 'Buffalo style chicken wings.', 'Chicken, Hot Sauce', FALSE),
('Fried Chicken Bucket', 16, 15.99, 4.7, 1200, '8 pieces signature fried chicken.', 'Chicken, Flour, Spices', FALSE),
('Grilled Chicken Wrap', 17, 8.50, 4.2, 450, 'Grilled chicken strips with lettuce.', 'Chicken, Tortilla, Lettuce', FALSE),
('Popcorn Chicken Bites', 18, 5.50, 4.1, 400, 'Bite-sized crunchy popcorn chicken.', 'Chicken, Breadcrumbs', FALSE),
('Chicken Tenders Meal', 19, 10.50, 4.6, 850, 'Breaded chicken tenders with fries.', 'Chicken, Fries', FALSE),
('Chicken Salad Sandwich', 20, 7.00, 4.0, 500, 'Mayo chicken on bread.', 'Chicken, Mayo, Bread', FALSE),
('Peri Peri Half Chicken', 21, 11.00, 4.8, 600, 'Spicy grilled half chicken.', 'Chicken, Peri Peri Sauce', FALSE),
('BBQ Chicken Drumsticks', 22, 7.50, 4.5, 550, 'Sticky BBQ glazed chicken legs.', 'Chicken, BBQ Sauce', FALSE),
('Chicken Katsu Curry', 23, 12.00, 4.9, 800, 'Breaded chicken cutlet with curry sauce.', 'Chicken, Panko, Curry Sauce, Rice', FALSE),
('Hot Honey Chicken Wings', 24, 8.00, 4.7, 600, 'Sweet and spicy glazed chicken.', 'Chicken, Honey, Chili', FALSE),

-- Waffles (IDs 31-40)
('Classic Belgian Waffle', 25, 7.50, 4.5, 500, 'Classic waffle with syrup and butter.', 'Flour, Milk, Syrup', FALSE),
('Chicken & Waffles', 26, 13.00, 4.8, 950, 'Savory and sweet combo.', 'Waffle, Fried Chicken, Syrup', FALSE),
('Choco-Hazelnut Waffle', 27, 9.00, 4.7, 700, 'Waffle with Nutella and strawberries.', 'Waffle, Nutella, Strawberries', FALSE),
('Berry Vegan Waffle', 28, 9.50, 4.4, 450, 'Plant-based waffle with fruit.', 'Almond Milk, Flour, Berries', TRUE),
('Salted Caramel Waffle', 29, 8.50, 4.6, 600, 'Waffle with caramel drizzle.', 'Waffle, Caramel, Salt', FALSE),
('Red Velvet Waffle', 30, 9.50, 4.7, 650, 'Red waffle with cream cheese.', 'Cocoa, Red Dye, Cream Cheese', FALSE),
('Banana Foster Waffle', 31, 10.00, 4.8, 700, 'Waffle with caramelized bananas.', 'Waffle, Bananas, Brown Sugar', FALSE),
('Matcha Green Tea Waffle', 32, 9.00, 4.3, 500, 'Japanese style green tea waffle.', 'Matcha Powder, Flour, Milk', FALSE),
('Bacon & Maple Waffle', 33, 11.00, 4.7, 800, 'Crispy bacon on a waffle.', 'Waffle, Bacon, Maple Syrup', FALSE),
('Ice Cream Waffle Sandwich', 34, 8.00, 4.6, 600, 'Ice cream between mini waffles.', 'Waffle, Vanilla Ice Cream', FALSE),

-- Burrito (IDs 41-50)
('Carne Asada Burrito', 35, 11.00, 4.8, 900, 'Steak burrito.', 'Steak, Tortilla, Rice', FALSE),
('Chicken Tinga Burrito', 36, 9.50, 4.5, 800, 'Spicy shredded chicken burrito.', 'Chicken, Chipotle, Rice', FALSE),
('Vegan Bean Burrito', 37, 8.50, 4.3, 600, 'Roasted veg and bean burrito.', 'Beans, Peppers, Rice', TRUE),
('Carnitas Burrito Bowl', 38, 10.50, 4.7, 750, 'Pork burrito bowl (no wrap).', 'Pork, Rice, Corn', FALSE),
('Spicy Shrimp Burrito', 39, 12.00, 4.6, 700, 'Grilled shrimp burrito.', 'Shrimp, Chipotle Crema, Rice', FALSE),
('Breakfast Burrito', 40, 8.00, 4.4, 750, 'Eggs and chorizo burrito.', 'Eggs, Chorizo, Tortilla', FALSE),
('California Burrito', 41, 11.50, 4.8, 950, 'Steak and french fries burrito.', 'Steak, Fries, Cheese, Guac', FALSE),
('Fish Burrito Trio', 42, 10.00, 4.5, 500, 'Three soft shell fish tacos/burritos.', 'Cod, Corn Tortilla, Slaw', FALSE),
('Mole Chicken Burrito', 43, 10.50, 4.7, 850, 'Rich chocolate-chili chicken burrito.', 'Chicken, Mole Sauce, Rice', FALSE),
('Quesarito Burrito', 44, 12.50, 4.9, 1000, 'Burrito wrapped in a quesadilla.', 'Beef, Cheese, Tortilla, Rice', FALSE),

-- Pizza Items (IDs 51-60)
('Margherita Pizza', 45, 9.00, 4.5, 800, 'Tomato, mozzarella and basil pizza.', 'Flour, Mozzarella, Tomato, Basil', FALSE),
('Pepperoni Feast Pizza', 46, 13.50, 4.6, 1100, 'Double pepperoni pizza.', 'Pepperoni, Cheese, Tomato', FALSE),
('The Works Pizza', 47, 15.00, 4.4, 1200, 'Pepperoni, sausage, peppers pizza.', 'Sausage, Pepperoni, Veggies', FALSE),
('Sourdough Special Pizza', 48, 8.50, 4.9, 700, 'Slow rise dough pizza.', 'Sourdough, Tomato, Oil', TRUE),
('Mushroom & Truffle Pizza', 49, 12.00, 4.8, 850, 'Wild mushrooms pizza.', 'Mushrooms, Truffle Oil, Cheese', FALSE),
('20-Inch Pizza Slice', 50, 5.00, 4.7, 400, 'A giant slice of NYC style pizza.', 'Flour, Cheese, Tomato', FALSE),
('Holy Pepperoni Pizza', 51, 11.00, 4.6, 900, 'Spicy pepperoni pizza.', 'Pepperoni, Honey, Chili', FALSE),
('Meatball Marinara Pizza', 52, 12.50, 4.5, 950, 'Beef meatballs pizza.', 'Beef Meatballs, Onion, Cheese', FALSE),
('Pollo Pesto Pizza', 53, 11.50, 4.4, 850, 'Chicken strips pesto pizza.', 'Chicken, Pesto, Pine Nuts', FALSE),
('Burrata Pizza', 54, 14.00, 4.9, 900, 'Whole burrata cheese pizza.', 'Burrata, Tomato, Basil', FALSE),

-- Noodles Items (IDs 61-70)
('Chicken Ramen Noodles', 55, 12.00, 4.6, 600, 'Grilled chicken in miso broth.', 'Chicken, Miso Broth, Noodles, Egg', FALSE),
('Beef Pho Noodles', 56, 11.50, 4.8, 550, 'Flat rice noodles in beef broth.', 'Beef, Rice Noodles, Broth, Herbs', FALSE),
('Tonkotsu Ramen Noodles', 57, 13.00, 4.9, 800, 'Rich pork bone broth.', 'Pork, Noodles, Bone Broth, Egg', FALSE),
('Hakata Ramen Noodles', 58, 12.50, 4.7, 750, 'Thin noodles in milky pork broth.', 'Pork, Noodles, Ginger, Sesame', FALSE),
('Biang Biang Spicy Noodles', 59, 10.50, 4.8, 650, 'Hand-pulled spicy thick noodles.', 'Flour, Chili Oil, Garlic, Bok Choy', TRUE),
('Chilli Chicken Ramen', 60, 11.00, 4.5, 600, 'Spicy broth with pulled chicken.', 'Chicken, Chili Paste, Noodles', FALSE),
('Kake Udon Noodles', 61, 8.50, 4.4, 400, 'Thick wheat noodles.', 'Udon, Dashi, Scallions', TRUE),
('Pad Thai Noodles', 62, 10.00, 4.7, 700, 'Stir-fried rice noodles.', 'Rice Noodles, Peanuts, Tofu, Egg', FALSE),
('Special Chow Mein Noodles', 63, 9.00, 4.3, 850, 'Stir-fried noodles.', 'Egg Noodles, Chicken, Beef, Soy Sauce', FALSE),
('Singapore Vermicelli Noodles', 64, 9.50, 4.5, 600, 'Curry flavored thin rice noodles.', 'Rice Vermicelli, Curry Powder, Shrimp', FALSE),

-- Curry Items (IDs 71-80)
('Chicken Tikka Masala', 65, 12.50, 4.8, 850, 'Creamy tomato curry with grilled chicken.', 'Chicken, Yogurt, Tomato, Cream, Almonds', FALSE),
('Lamb Rogan Josh', 66, 13.50, 4.7, 900, 'Aromatic Kashmiri lamb curry.', 'Lamb, Yogurt, Garlic, Ginger, Spices', FALSE),
('Vegetable Korma', 67, 10.50, 4.6, 750, 'Mild creamy curry with vegetables.', 'Carrots, Peas, Cream, Coconut, Cashews', FALSE),
('Butter Chicken', 68, 13.00, 4.9, 950, 'Rich buttery tomato sauce chicken.', 'Chicken, Butter, Cream, Tomato, Fenugreek', FALSE),
('Prawn Bhuna', 69, 14.00, 4.7, 600, 'Medium spice dry prawn curry.', 'Prawns, Onions, Peppers, Tomatoes', FALSE),
('Saag Paneer', 70, 11.00, 4.5, 700, 'Spinach and cottage cheese curry.', 'Spinach, Paneer Cheese, Cream, Spices', FALSE),
('Spicy Lamb Vindaloo', 71, 13.50, 4.4, 800, 'Very spicy Goan curry with potatoes.', 'Lamb, Potato, Chili, Vinegar, Mustard', FALSE),
('Tandoori Mixed Grill', 72, 16.00, 4.8, 1100, 'Assortment of tandoori meats.', 'Chicken, Lamb, Yogurt, Spices', FALSE),
('Chicken Biryani', 73, 12.50, 4.7, 900, 'Aromatic rice dish with chicken.', 'Basmati Rice, Chicken, Saffron, Ghee', FALSE),
('Chana Masala', 74, 9.50, 4.6, 500, 'Spicy chickpea curry.', 'Chickpeas, Tomato, Onion, Spices', TRUE);

-- ================================================
-- POPULATE CUSTOMERS, ORDERS & ALLERGENS
-- ================================================

INSERT INTO customers (firstName, lastName, emailAddress, phoneNumber, address, postcode) VALUES 
('Alice', 'Green', 'alice@example.com', '07123 456789', '1 Green Street, London', 'SW1 3HP'),
('Bob', 'Brown', 'bob@example.com', '07234 567890', '1 Brown Street, London', 'N6 4GT'),
('Charlie', 'White', 'charlie@example.com', '07345 678901', '1 White Street, London', 'W3, 6HT'),
('David', 'Black', 'david@example.com', '07456 789012', '1 Black Street, London', 'S1 9JT'),
('Emma', 'Blue', 'emma@example.com', '07567 890123', '1 Blue Street, London', 'W6 5QT');

INSERT INTO orders (itemID, customerID, totalPrice, orderDetails) VALUES 
(51, 1, 9.00, 'Margherita Pizza order for Alice'), 
(61, 2, 12.00, 'Chicken Ramen order for Bob'),     
(11, 3, 11.50, 'Salmon Nigiri order for Charlie'),  
(71, 4, 12.50, 'Tikka Masala order for David'),           
(41, 5, 11.00, 'Burrito order for Emma');           

INSERT INTO allergens (allergenName) VALUES 
('Gluten'),     -- ID 1
('Dairy'),      -- ID 2
('Eggs'),       -- ID 3
('Mustard'),    -- ID 4
('Sesame'),     -- ID 5
('Soy'),        -- ID 6
('Shellfish'),  -- ID 7
('Nuts');       -- ID 8

-- ========================================================
-- ALLERGEN MAPPING (Items Mapped to Allergens 1-8)
-- ========================================================

INSERT INTO item_allergens (itemID, allergenID) VALUES 
-- BURGERS (IDs 1-10)
(1, 1), (1, 2), (1, 4),   -- Double Cheeseburger (Gluten, Dairy, Mustard)
(2, 1),                   -- Vegan Beyond (Gluten - bun)
(3, 1), (3, 3), (3, 4),   -- Crispy Chicken (Gluten, Egg, Mustard)
-- New Burgers
(4, 1), (4, 2), (4, 6),   -- BBQ Bacon (Gluten, Dairy, Soy)
(5, 1), (5, 2),           -- Mushroom Swiss (Gluten, Dairy)
(6, 1), (6, 2), (6, 3),   -- Spicy Jalapeno (Gluten, Dairy, Egg)
(7, 1), (7, 2),           -- Triple Stacker (Gluten, Dairy)
(8, 1),                   -- Veggie Bean (Gluten)
(9, 1), (9, 2), (9, 3),   -- Blue Cheese (Gluten, Dairy, Egg)
(10, 1), (10, 2), (10, 3),-- Fish Fillet (Gluten, Dairy, Egg)

-- SUSHI (IDs 11-20)
(11, 6),                    -- Salmon Nigiri (Soy)
(12, 3), (12, 6),           -- Spicy Tuna (Egg, Soy)
(13, 1), (13, 6),           -- Dragon Roll (Gluten, Soy)
-- 14 Avocado Maki (None)
(16, 1),                    -- Veggie Tempura (Gluten)
(17, 2), (17, 6),           -- Philadelphia (Dairy, Soy)
(18, 3), (18, 7), (18,6),   -- California (Egg, Shellfish, Soy)
(19, 3), (19, 7), (19,6),   -- Rainbow (Egg, Shellfish, Soy)
(20, 6),                    -- Unagi Don (Soy)

-- CHICKEN (IDs 21-30)
(21, 4),                  -- Spicy Wings (Mustard)
(22, 1),                  -- Fried Chicken (Gluten)
(23, 1),                  -- Chicken Wrap (Gluten)
(25, 1),                  -- Popcorn Chicken (Gluten)
(26, 1), (26, 3),         -- Tenders (Gluten, Egg)
(27, 1), (27, 3),         -- Sandwich (Gluten, Egg)
(30, 1), (30, 3),         -- Katsu (Gluten, Egg)

-- WAFFLES (IDs 31-40)
(31, 1), (31, 2), (31, 3),          -- Classic
(32, 1), (32, 2), (32, 3),          -- Chicken & Waffles
(33, 1), (33, 2), (33, 3), (33, 8), -- Hazelnut
(34, 1), (34, 8),                   -- Vegan
(35, 1), (35, 2), (35, 3),          -- Caramel
(36, 1), (36, 2), (36, 3),          -- Red Velvet
(37, 1), (37, 2), (37, 3),          -- Banana
(38, 1), (38, 2), (38, 3),          -- Matcha
(39, 1), (39, 2), (39, 3),          -- Bacon
(40, 1), (40, 2), (40, 3),          -- Ice Cream Sandwich

-- BURRITOS (IDs 41-50)
(41, 1), (41, 2),         -- Carne Asada
(42, 1), (42, 2),         -- Chicken Tinga
(43, 1),                  -- Vegan Bean
(44, 2),                  -- Burrito Bowl
(45, 1), (45, 2), (45, 7),-- Shrimp
(46, 1), (46, 2), (46, 3),-- Breakfast
(47, 1), (47, 2),         -- California
(48, 1), (48, 6),         -- Fish
(49, 1), (49, 8),         -- Mole
(50, 1), (50, 2),         -- Quesarito

-- PIZZA (IDs 51-60)
(51, 1), (51, 2),         -- Margherita
(52, 1), (52, 2),         -- Pepperoni
(53, 1), (53, 2),         -- The Works
(54, 1),                  -- Sourdough
(55, 1), (55, 2),         -- Mushroom
(56, 1), (56, 2),         -- Slice
(57, 1), (57, 2),         -- Holy Pepperoni
(58, 1), (58, 2),         -- Meatball
(59, 1), (59, 2), (59, 8),-- Pollo Pesto
(60, 1), (60, 2),         -- Burrata

-- NOODLES (IDs 61-70)
(61, 1), (61, 3), (61, 6),          -- Chicken Ramen
(62, 6),                            -- Pho
(63, 1), (63, 3), (63, 6),          -- Tonkotsu
(64, 1), (64, 3), (64, 5), (64, 6), -- Hakata
(65, 1), (65, 6),                   -- Biang Biang
(66, 1), (66, 3), (66, 6),          -- Chilli Ramen
(67, 1), (67, 6),                   -- Udon
(68, 3), (68, 7), (68, 8),          -- Pad Thai
(69, 1), (69, 3), (69, 6),          -- Chow Mein
(70, 3), (70, 7),                   -- Singapore Vermicelli

-- CURRY (IDs 71-80)
(71, 2), (71, 8),         -- Tikka Masala (Dairy, Nuts)
(72, 2),                  -- Rogan Josh (Dairy)
(73, 2), (73, 8),         -- Korma (Dairy, Nuts)
(74, 2), (74, 8),         -- Butter Chicken (Dairy, Nuts)
(75, 7),                  -- Prawn Bhuna (Shellfish)
(76, 2),                  -- Saag Paneer (Dairy)
(77, 4),                  -- Vindaloo (Mustard)
(78, 2), (78, 4),         -- Tandoori (Dairy, Mustard)
(79, 2),                  -- Biryani (Dairy)
(80, 4);                  -- Chana Masala (Mustard - usually vegan but uses mustard seed)