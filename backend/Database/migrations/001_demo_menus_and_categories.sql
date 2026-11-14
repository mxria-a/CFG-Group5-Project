-- Pickier portfolio/demo data migration (safe for existing tables and records).
-- Do NOT run Database/setup.sql: that file drops and recreates the database.
-- Menu items below are illustrative demo records, not restaurant-verified menus.
-- New demo items have no reported allergens; no allergen-free claim is implied.

-- Add category if absent, so running this migration again is safe.
SET @pk_has_category := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'items' AND COLUMN_NAME = 'category'
);
SET @pk_category_ddl := IF(@pk_has_category = 0,
  'ALTER TABLE items ADD COLUMN category VARCHAR(30) NULL',
  'SELECT 1');
PREPARE pk_stmt FROM @pk_category_ddl;
EXECUTE pk_stmt;
DEALLOCATE PREPARE pk_stmt;

-- Backfill only items without a category; preserve any explicit values.
UPDATE items i
JOIN restaurants r ON r.restaurantID = i.restaurantID
SET i.category = CASE
    WHEN r.restaurantName IN ('Burger King', 'Five Guys', 'Shake Shack', 'McDonalds') THEN 'burger'
    WHEN r.restaurantName IN ('Sushi Zen', 'Tokyo Express', 'Samurai Sushi', 'Oishii Eats', 'Sushi Go', 'Blue Fin', 'Raw Fish Co', 'Sashimi Station', 'The Roll House', 'Nippon Bites') THEN 'sushi'
    WHEN r.restaurantName IN ('Cluckin Good', 'Nashville Hot', 'The Roost', 'Wing King', 'Bird & Bun', 'Fried & True', 'Crispy Coop', 'Golden Hen', 'Spicy Bird', 'KFCopy') THEN 'chicken'
    WHEN r.restaurantName IN ('The Waffle House', 'Belgian Delights', 'Sweet Stack', 'Morning Waffle', 'Waffle & Dough', 'Syrup Society', 'The Grid', 'Iron Waffles', 'Batter Up', 'Sugar Rush') THEN 'waffle'
    WHEN r.restaurantName IN ('Benito Burrito', 'Tortilla Bros', 'Wrap It Up', 'Guac & Roll', 'Spicy Bean', 'The Burrito Bar', 'Salsa Street', 'Mexican Wave', 'Loco Burrito', 'Wrap Star') THEN 'burrito'
    WHEN r.restaurantName IN ('Pizza Express', 'Dominos', 'Papa Johns', 'Franco Manca', 'Pizza Pilgrims', 'Homeslice', 'Yard Sale Pizza', 'Joes Pizza', 'Bella Italia', 'Napoli Gang') THEN 'pizza'
    WHEN r.restaurantName IN ('Wagamama', 'Pho', 'Bone Daddies', 'Shoryu Ramen', 'Biang Biang Noodles', 'Tonkotsu', 'Marugame Udon', 'Thai Square', 'Chow Mein Central', 'The Noodle Bar') THEN 'noodles'
    WHEN r.restaurantName IN ('Dishoom', 'Tayyabs', 'Curry House', 'Spice of India', 'Masala Zone', 'The Bombay Bicycle', 'Roti King', 'Cinnamon Club', 'Taste of Bengal', 'Madras Cafe') THEN 'curry'
    ELSE i.category
  END
WHERE i.category IS NULL OR i.category = '';

-- Add 20 alternative items. Restaurant ID is looked up rather than assumed.
-- Guard each restaurant/item pair against repeated inserts.
INSERT INTO items
  (itemName, restaurantID, category, price, avRating, calories, description, ingredients, isVegan)
SELECT seed.itemName, r.restaurantID, seed.category, seed.price,
       seed.avRating, seed.calories, seed.description, seed.ingredients, seed.isVegan
FROM (
  SELECT 'Burger King' AS restaurantName, 'Classic Cheese Burger' AS itemName, 'burger' AS category, 7.75 AS price, 4.4 AS avRating, 730 AS calories, 'Demo beef burger with cheddar and pickles.' AS description, 'Beef, Cheddar, Pickles, Lettuce, Bun' AS ingredients, 0 AS isVegan
  UNION ALL SELECT 'Burger King', 'Smoky BBQ Burger', 'burger', 9.25, 4.6, 870, 'Demo burger with smoky sauce and onions.', 'Beef, BBQ Sauce, Onions, Bun', 0
  UNION ALL SELECT 'Burger King', 'Spicy Bean Burger', 'burger', 7.45, 4.3, 560, 'Demo spiced bean burger with lettuce.', 'Bean Patty, Lettuce, Tomato, Bun', 1
  UNION ALL SELECT 'Five Guys', 'Double Melt Burger', 'burger', 12.75, 4.7, 940, 'Demo double beef burger with melted cheese.', 'Beef, Cheese, Bun, Tomato', 0
  UNION ALL SELECT 'Five Guys', 'Grilled Mushroom Burger', 'burger', 10.9, 4.5, 780, 'Demo mushroom-topped burger.', 'Beef, Mushrooms, Bun, Lettuce', 0
  UNION ALL SELECT 'Pizza Express', 'Four Cheese Pizza', 'pizza', 12.5, 4.6, 930, 'Demo pizza with a blend of four cheeses.', 'Pizza Dough, Tomato, Mozzarella, Cheddar, Blue Cheese', 0
  UNION ALL SELECT 'Pizza Express', 'Roasted Pepper Pizza', 'pizza', 10.75, 4.4, 790, 'Demo roasted pepper and tomato pizza.', 'Pizza Dough, Tomato, Peppers, Basil', 1
  UNION ALL SELECT 'Pizza Express', 'Mushroom Truffle Pizza', 'pizza', 13.75, 4.7, 910, 'Demo mushroom pizza with a truffle-style dressing.', 'Pizza Dough, Mushrooms, Cheese, Truffle Dressing', 0
  UNION ALL SELECT 'Pizza Express', 'Spicy Veggie Pizza', 'pizza', 11.25, 4.5, 810, 'Demo pizza with chilli and vegetables.', 'Pizza Dough, Tomato, Chilli, Peppers, Onions', 1
  UNION ALL SELECT 'The Waffle House', 'Chocolate Drizzle Waffle', 'waffle', 8.95, 4.8, 680, 'Demo waffle with chocolate-style drizzle.', 'Waffle, Chocolate Sauce', 0
  UNION ALL SELECT 'The Waffle House', 'Strawberry Delight Waffle', 'waffle', 9.25, 4.6, 620, 'Demo waffle topped with strawberries.', 'Waffle, Strawberries, Cream', 0
  UNION ALL SELECT 'The Waffle House', 'Caramel Banana Waffle', 'waffle', 9.75, 4.7, 710, 'Demo waffle with caramel and banana.', 'Waffle, Banana, Caramel Sauce', 0
  UNION ALL SELECT 'Sushi Zen', 'Salmon Avocado Sushi Roll', 'sushi', 10.95, 4.7, 430, 'Demo sushi roll with salmon and avocado.', 'Salmon, Avocado, Nori, Rice', 0
  UNION ALL SELECT 'Sushi Zen', 'Cucumber Avocado Sushi Roll', 'sushi', 7.5, 4.5, 320, 'Demo vegetable sushi roll.', 'Cucumber, Avocado, Nori, Rice', 1
  UNION ALL SELECT 'Wagamama', 'Chilli Ginger Noodles', 'noodles', 11.25, 4.5, 640, 'Demo chilli and ginger noodle bowl.', 'Noodles, Ginger, Chilli, Spring Onion', 1
  UNION ALL SELECT 'Wagamama', 'Crispy Tofu Noodles', 'noodles', 12.25, 4.6, 710, 'Demo noodles with tofu and vegetables.', 'Noodles, Tofu, Broccoli, Sesame', 1
  UNION ALL SELECT 'Benito Burrito', 'Chipotle Chicken Burrito', 'burrito', 10.5, 4.6, 830, 'Demo chicken burrito with chipotle seasoning.', 'Chicken, Rice, Beans, Tortilla, Chipotle', 0
  UNION ALL SELECT 'Benito Burrito', 'Roasted Veggie Burrito', 'burrito', 9.45, 4.5, 680, 'Demo burrito filled with roasted vegetables.', 'Tortilla, Peppers, Rice, Beans, Onions', 1
  UNION ALL SELECT 'Dishoom', 'Coconut Chickpea Curry', 'curry', 11.5, 4.7, 620, 'Demo chickpea curry with coconut.', 'Chickpeas, Coconut Milk, Tomato, Spices', 1
  UNION ALL SELECT 'Dishoom', 'Spiced Chicken Curry', 'curry', 13.25, 4.8, 750, 'Demo chicken curry with warming spices.', 'Chicken, Tomato, Onion, Spices', 0
) AS seed
JOIN restaurants r ON r.restaurantName = seed.restaurantName
LEFT JOIN items existing
  ON existing.restaurantID = r.restaurantID AND existing.itemName = seed.itemName
WHERE existing.itemID IS NULL;

-- Optional check: list the populated demo menus.
SELECT r.restaurantName, i.category, COUNT(*) AS itemCount
FROM items i JOIN restaurants r ON r.restaurantID = i.restaurantID
WHERE r.restaurantName IN ('Burger King', 'Five Guys', 'Pizza Express', 'The Waffle House',
                           'Sushi Zen', 'Wagamama', 'Benito Burrito', 'Dishoom')
GROUP BY r.restaurantName, i.category ORDER BY r.restaurantName, i.category;
