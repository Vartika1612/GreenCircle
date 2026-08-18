-- =============================================================================
-- GreenCircle H2 Seed Data (loaded automatically in dev via spring.sql.init.mode=embedded)
-- Passwords are bcrypt hashes of "password123"
-- =============================================================================

INSERT INTO users (name, email, password, role, location) VALUES
    ('Green Valley Farm', 'farmer@greencircle.com',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'FARMER', 'Napa Valley, CA'),
    ('Sunrise Organics',  'farmer2@greencircle.com',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'FARMER', 'Sonoma County, CA'),
    ('Jane Customer',     'customer@greencircle.com',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi', 'CUSTOMER', 'San Francisco, CA');

INSERT INTO products (name, description, category, price, unit, stock, image_key, farming_method, location, farmer_id) VALUES
    ('Heirloom Tomatoes',
     'Sun-ripened heirloom tomatoes grown without pesticides. Varieties include Cherokee Purple, Brandywine, and Green Zebra. Picked at peak ripeness for maximum flavour.',
     'VEGETABLES', 4.50, 'lb', 80, NULL,
     'Certified Organic, No-till', 'Napa Valley, CA', 1),
    ('Rainbow Chard',
     'Vibrant mix of red, yellow, and orange stemmed Swiss chard. Tender leaves, earthy flavour.',
     'VEGETABLES', 3.00, 'bunch', 50, NULL,
     'Certified Organic', 'Napa Valley, CA', 1),
    ('Raw Wildflower Honey',
     'Unfiltered, unheated raw honey from our own hives. Floral notes from wildflower meadows.',
     'HONEY', 12.00, 'jar (16oz)', 30, NULL,
     'Natural Beekeeping', 'Napa Valley, CA', 1),
    ('Free-Range Eggs',
     'A dozen large eggs from pasture-raised hens that roam freely. Rich orange yolks.',
     'EGGS', 7.00, 'dozen', 60, NULL,
     'Pasture-Raised, Free-Range', 'Sonoma County, CA', 2),
    ('Organic Blueberries',
     'Plump, sweet-tart blueberries handpicked at the height of summer.',
     'FRUITS', 6.50, 'pint', 40, NULL,
     'USDA Certified Organic', 'Sonoma County, CA', 2),
    ('Stone-Ground Whole Wheat Flour',
     'Milled from heritage red wheat grown on our farm. Nutty flavour, high in fibre.',
     'GRAINS', 5.00, 'lb', 100, NULL,
     'Regenerative Agriculture', 'Sonoma County, CA', 2),
    ('Fresh Basil',
     'Large, fragrant Genovese basil bunches, perfect for pesto, caprese, or pizza.',
     'HERBS', 2.50, 'bunch', 45, NULL,
     'Certified Organic, Greenhouse-grown', 'Napa Valley, CA', 1),
    ('Whole Milk Yogurt',
     'Creamy, probiotic-rich yogurt from our grass-fed Jersey cows.',
     'DAIRY', 5.50, 'pint', 25, NULL,
     'Grass-Fed, Hormone-Free', 'Sonoma County, CA', 2);
