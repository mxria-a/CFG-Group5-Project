-- Pickier Phase 5 — demo customisation catalogues
-- Run against the SAME database as migration 001, AFTER making a fresh backup.
-- Do not run Database/setup.sql: that script DROPS the entire database.
-- This migration adds three new tables; it does not alter or delete items, customers, or orders.
-- All size prices and extra choices below are ILLUSTRATIVE DEMO data, NOT verified restaurant offerings.
-- On rerun, existing options are left unchanged (prices are not overwritten).

CREATE TABLE IF NOT EXISTS item_customisation_sizes (
  sizeID INT AUTO_INCREMENT PRIMARY KEY,
  itemID INT NOT NULL,
  sizeCode VARCHAR(20) NOT NULL,
  sizeName VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  isDefault BOOLEAN NOT NULL DEFAULT FALSE,
  sortOrder INT NOT NULL DEFAULT 0,
  UNIQUE KEY uq_item_customisation_size (itemID, sizeCode),
  CONSTRAINT fk_custom_size_item FOREIGN KEY (itemID) REFERENCES items(itemID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS item_customisation_removals (
  removalID INT AUTO_INCREMENT PRIMARY KEY,
  itemID INT NOT NULL,
  ingredientName VARCHAR(100) NOT NULL,
  sortOrder INT NOT NULL DEFAULT 0,
  UNIQUE KEY uq_item_customisation_removal (itemID, ingredientName),
  CONSTRAINT fk_custom_removal_item FOREIGN KEY (itemID) REFERENCES items(itemID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS item_customisation_extras (
  extraID INT AUTO_INCREMENT PRIMARY KEY,
  itemID INT NOT NULL,
  extraName VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  sortOrder INT NOT NULL DEFAULT 0,
  UNIQUE KEY uq_item_customisation_extra (itemID, extraName),
  CONSTRAINT fk_custom_extra_item FOREIGN KEY (itemID) REFERENCES items(itemID) ON DELETE CASCADE
);

-- Demo pizza sizes only: leave other categories as single-size dishes for now.
-- Medium = existing price; small - £1.50; large + £3.00.
-- Prices are intentionally generated for this demo, NOT official restaurant prices.
INSERT INTO item_customisation_sizes (itemID, sizeCode, sizeName, price, isDefault, sortOrder)
SELECT i.itemID, sizes.sizeCode, sizes.sizeName,
       CASE sizes.sizeCode
         WHEN 'small' THEN GREATEST(0.01, i.price - 1.50)
         WHEN 'large' THEN i.price + 3.00
         ELSE i.price
       END AS price,
       CASE WHEN sizes.sizeCode = 'medium' THEN 1 ELSE 0 END AS isDefault,
       sizes.sortOrder
FROM items AS i
JOIN (
  SELECT 'small' AS sizeCode, 'Small' AS sizeName, 1 AS sortOrder
  UNION ALL SELECT 'medium', 'Medium', 2
  UNION ALL SELECT 'large', 'Large', 3
) AS sizes
LEFT JOIN item_customisation_sizes AS existing
  ON existing.itemID = i.itemID AND existing.sizeCode = sizes.sizeCode
WHERE i.category = 'pizza' AND existing.sizeID IS NULL;

-- Demo removals come only from comma-separated ingredients already stored on the item.
-- Exclude common dish foundations/main components, which cannot sensibly be omitted.
-- These are still DEMO options: removing a listed ingredient is not a restaurant guarantee.
INSERT INTO item_customisation_removals (itemID, ingredientName, sortOrder)
SELECT DISTINCT t.itemID, t.ingredientName, t.position
FROM (
  SELECT i.itemID,
         TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(i.ingredients, ',', n.position), ',', -1)) AS ingredientName,
         n.position
  FROM items AS i
  JOIN (
    SELECT 1 AS position UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL
    SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL
    SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12
  ) AS n ON i.ingredients IS NOT NULL
          AND n.position <= 1 + LENGTH(i.ingredients) - LENGTH(REPLACE(i.ingredients, ',', ''))
) AS t
LEFT JOIN item_customisation_removals AS existing
  ON existing.itemID = t.itemID AND existing.ingredientName = t.ingredientName
WHERE existing.removalID IS NULL
  AND CHAR_LENGTH(t.ingredientName) BETWEEN 2 AND 100
  AND LOWER(t.ingredientName) NOT IN (
    'beef', 'beef patty', 'chicken', 'chicken breast', 'fish', 'salmon', 'tuna',
    'eel', 'crab', 'crab stick', 'smoked salmon', 'yellowtail', 'bean patty',
    'pea protein patty', 'rice', 'sushi rice', 'noodles', 'udon noodles',
    'pizza dough', 'dough', 'bun', 'brioche bun', 'wholemeal bun',
    'tortilla', 'waffle', 'tofu', 'flour', 'bread', 'pasta', 'nori'
  );

-- Demo extras for ALL eight food categories. Vegan-flagged dishes only
-- receive extras with isVeganCompatible = 1 in the seed catalogue.
INSERT INTO item_customisation_extras (itemID, extraName, price, sortOrder)
SELECT i.itemID, seed.extraName, seed.price, seed.sortOrder
FROM items AS i
JOIN (
  SELECT 'burger' AS category, 'Extra pickles' AS extraName, 0.40 AS price, 1 AS sortOrder, 1 AS isVeganCompatible
  UNION ALL SELECT 'burger', 'Avocado', 1.20, 2, 1
  UNION ALL SELECT 'burger', 'Vegan mayo', 0.50, 3, 1
  UNION ALL SELECT 'burger', 'Extra cheddar', 0.90, 4, 0
  UNION ALL SELECT 'pizza', 'Mushrooms', 0.90, 1, 1
  UNION ALL SELECT 'pizza', 'Olives', 0.80, 2, 1
  UNION ALL SELECT 'pizza', 'Chilli flakes', 0.30, 3, 1
  UNION ALL SELECT 'pizza', 'Extra mozzarella', 1.50, 4, 0
  UNION ALL SELECT 'sushi', 'Extra ginger', 0.50, 1, 1
  UNION ALL SELECT 'sushi', 'Extra wasabi', 0.40, 2, 1
  UNION ALL SELECT 'sushi', 'Avocado', 1.10, 3, 1
  UNION ALL SELECT 'chicken', 'Hot sauce', 0.50, 1, 1
  UNION ALL SELECT 'chicken', 'Garlic dip', 0.75, 2, 0
  UNION ALL SELECT 'chicken', 'Chilli seasoning', 0.40, 3, 1
  UNION ALL SELECT 'waffle', 'Fresh strawberries', 1.50, 1, 1
  UNION ALL SELECT 'waffle', 'Maple syrup', 0.80, 2, 1
  UNION ALL SELECT 'waffle', 'Banana', 0.75, 3, 1
  UNION ALL SELECT 'waffle', 'Whipped cream', 1.00, 4, 0
  UNION ALL SELECT 'burrito', 'Guacamole', 1.50, 1, 1
  UNION ALL SELECT 'burrito', 'Extra rice', 0.70, 2, 1
  UNION ALL SELECT 'burrito', 'Salsa', 0.50, 3, 1
  UNION ALL SELECT 'burrito', 'Cheese', 0.85, 4, 0
  UNION ALL SELECT 'noodles', 'Spring onions', 0.65, 1, 1
  UNION ALL SELECT 'noodles', 'Chilli oil', 0.75, 2, 1
  UNION ALL SELECT 'noodles', 'Extra tofu', 1.75, 3, 1
  UNION ALL SELECT 'noodles', 'Soft-boiled egg', 1.50, 4, 0
  UNION ALL SELECT 'curry', 'Coriander', 0.35, 1, 1
  UNION ALL SELECT 'curry', 'Extra rice', 1.80, 2, 1
  UNION ALL SELECT 'curry', 'Chilli', 0.45, 3, 1
  UNION ALL SELECT 'curry', 'Yoghurt raita', 1.20, 4, 0
) AS seed ON i.category = seed.category
LEFT JOIN item_customisation_extras AS existing
  ON existing.itemID = i.itemID AND existing.extraName = seed.extraName
WHERE existing.extraID IS NULL
  AND (i.isVegan = 0 OR seed.isVeganCompatible = 1);

-- Read-only verification; expect 3 rows and counts depending on menu inventory.
SELECT 'Sizes' AS optionType, COUNT(*) AS optionCount FROM item_customisation_sizes
UNION ALL SELECT 'Removals', COUNT(*) FROM item_customisation_removals
UNION ALL SELECT 'Extras', COUNT(*) FROM item_customisation_extras;
