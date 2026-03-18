-- Phase 04: Pet Shop & Economics Migration

-- 1. Add stars column to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS stars INTEGER DEFAULT 0;

-- 2. Create shop_items table
CREATE TABLE IF NOT EXISTS shop_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('food', 'accessory', 'toy')),
    price INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    properties JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create user_inventory table
CREATE TABLE IF NOT EXISTS user_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES shop_items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    is_equipped BOOLEAN DEFAULT FALSE,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, item_id)
);

-- 4. Insert some initial shop items
INSERT INTO shop_items (name, description, category, price, image_url, properties)
VALUES 
('Magic Apple', 'A delicious apple that makes your pet very happy!', 'food', 50, 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=200', '{"happiness": 20}'),
('Sizzling Steak', 'Premium protein for a strong dragon.', 'food', 120, 'https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=200', '{"happiness": 50}'),
('Wizard Hat', 'Makes your pet look extra smart.', 'accessory', 250, 'https://images.unsplash.com/photo-1502111023244-77a8b85cc2bc?w=200', '{"style": "wizard"}'),
('Cool Sunglasses', 'Too cool for school.', 'accessory', 150, 'https://images.unsplash.com/photo-1511499767390-91f1976bb400?w=200', '{"style": "cool"}'),
('Golden Ball', 'A shiny toy for hours of fun.', 'toy', 80, 'https://images.unsplash.com/photo-1559131397-f94da358f7ca?w=200', '{"fun": 30}');
