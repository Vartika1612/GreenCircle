-- =============================================================================
-- GreenCircle Database Schema
-- MySQL 8.0+
-- Run this after creating the database:
--   CREATE DATABASE greencircle CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
--   USE greencircle;
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Users
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)  NOT NULL,
    email       VARCHAR(150)  NOT NULL UNIQUE,
    password    VARCHAR(255)  NOT NULL,               -- bcrypt hash
    role        ENUM('CUSTOMER', 'FARMER') NOT NULL,
    location    VARCHAR(200),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- Products
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(150)  NOT NULL,
    description     TEXT,
    category        ENUM('VEGETABLES','FRUITS','GRAINS','EGGS','HONEY','DAIRY','HERBS') NOT NULL,
    price           DECIMAL(10, 2) NOT NULL,
    unit            VARCHAR(50)   NOT NULL,           -- e.g. "kg", "dozen", "jar"
    stock           INT           NOT NULL DEFAULT 0,
    image_key       VARCHAR(500),                     -- S3 object key
    farming_method  VARCHAR(200),                     -- e.g. "Certified Organic, No-till"
    location        VARCHAR(200),
    farmer_id       BIGINT        NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_farmer FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Optimise browse/filter queries
CREATE INDEX IF NOT EXISTS idx_product_category ON products (category);
CREATE INDEX IF NOT EXISTS idx_product_location ON products (location);
CREATE INDEX IF NOT EXISTS idx_product_category_location ON products (category, location);
CREATE INDEX IF NOT EXISTS idx_product_farmer ON products (farmer_id);

-- -----------------------------------------------------------------------------
-- Orders
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id     BIGINT         NOT NULL,
    total_amount    DECIMAL(10, 2) NOT NULL,
    status          ENUM('PLACED','CONFIRMED','COMPLETED') NOT NULL DEFAULT 'PLACED',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_customer FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_order_customer ON orders (customer_id);

-- -----------------------------------------------------------------------------
-- Order Items
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id    BIGINT         NOT NULL,
    product_id  BIGINT         NOT NULL,
    quantity    INT            NOT NULL,
    price       DECIMAL(10, 2) NOT NULL,     -- snapshot price at time of order
    CONSTRAINT fk_item_order   FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
    CONSTRAINT fk_item_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_orderitem_order   ON order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_orderitem_product ON order_items (product_id);

-- =============================================================================
-- SEED DATA
-- Passwords are bcrypt hashes of "password123"
-- =============================================================================

INSERT INTO users (name, email, password, role, location) VALUES
    ('Green Valley Farm', 'farmer@greencircle.com',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'FARMER', 'Napa Valley, CA'),
    ('Sunrise Organics',  'farmer2@greencircle.com',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'FARMER', 'Sonoma County, CA'),
    ('Jane Customer',     'customer@greencircle.com',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'CUSTOMER', 'San Francisco, CA');

INSERT INTO products (name, description, category, price, unit, stock, farming_method, location, farmer_id) VALUES
    ('Heirloom Tomatoes',
     'Sun-ripened heirloom tomatoes grown without pesticides. Varieties include Cherokee Purple, Brandywine, and Green Zebra. Picked at peak ripeness for maximum flavour.',
     'VEGETABLES', 4.50, 'lb', 80,
     'Certified Organic, No-till', 'Napa Valley, CA', 1),

    ('Rainbow Chard',
     'Vibrant mix of red, yellow, and orange stemmed Swiss chard. Tender leaves, earthy flavour. Great sautéed or in salads.',
     'VEGETABLES', 3.00, 'bunch', 50,
     'Certified Organic', 'Napa Valley, CA', 1),

    ('Raw Wildflower Honey',
     'Unfiltered, unheated raw honey from our own hives. Floral notes from wildflower meadows. Each jar is hand-labelled.',
     'HONEY', 12.00, 'jar (16oz)', 30,
     'Natural Beekeeping', 'Napa Valley, CA', 1),

    ('Free-Range Eggs',
     'A dozen large eggs from pasture-raised hens that roam freely. Rich orange yolks, superior taste.',
     'EGGS', 7.00, 'dozen', 60,
     'Pasture-Raised, Free-Range', 'Sonoma County, CA', 2),

    ('Organic Blueberries',
     'Plump, sweet-tart blueberries handpicked at the height of summer. Great fresh, frozen, or baked.',
     'FRUITS', 6.50, 'pint', 40,
     'USDA Certified Organic', 'Sonoma County, CA', 2),

    ('Stone-Ground Whole Wheat Flour',
     'Milled from heritage red wheat grown on our farm. Nutty flavour, high in fibre. Great for breads and pastries.',
     'GRAINS', 5.00, 'lb', 100,
     'Regenerative Agriculture', 'Sonoma County, CA', 2),

    ('Fresh Basil',
     'Large, fragrant Genovese basil bunches, perfect for pesto, caprese, or pizza. Harvested same day.',
     'HERBS', 2.50, 'bunch', 45,
     'Certified Organic, Greenhouse-grown', 'Napa Valley, CA', 1),

    ('Whole Milk Yogurt',
     'Creamy, probiotic-rich yogurt from our grass-fed Jersey cows. Lightly sweetened with local honey. No artificial thickeners.',
     'DAIRY', 5.50, 'pint', 25,
     'Grass-Fed, Hormone-Free', 'Sonoma County, CA', 2);
