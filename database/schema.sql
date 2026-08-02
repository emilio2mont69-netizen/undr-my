-- UNDR Marketplace PostgreSQL Schema
-- Designed for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. PROFILES
-- -----------------------------------------------------------------------------
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255),
    username VARCHAR(255),
    handle VARCHAR(255) UNIQUE,
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'buyer' CHECK (role IN ('buyer', 'creator', 'admin')),
    balance DECIMAL(12, 2) DEFAULT 0 CHECK (balance >= 0),
    kyc_status VARCHAR(50) DEFAULT 'unverified' CHECK (kyc_status IN ('unverified', 'pending', 'approved', 'rejected')),
    age INTEGER CHECK (age >= 18),
    nationality VARCHAR(100),
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 2. PRODUCTS
-- -----------------------------------------------------------------------------
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    title_es VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_es TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    size VARCHAR(50),
    style VARCHAR(100),
    wear_time VARCHAR(100),
    image_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    is_available_today BOOLEAN DEFAULT FALSE,
    is_auction BOOLEAN DEFAULT FALSE,
    auction_end_time TIMESTAMPTZ,
    top_bidder_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    bids_count INTEGER DEFAULT 0,
    includes_signed_photo BOOLEAN DEFAULT FALSE,
    extra_tag_en VARCHAR(100),
    extra_tag_es VARCHAR(100),
    likes_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'removed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. ORDERS
-- -----------------------------------------------------------------------------
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    buyer_id UUID REFERENCES profiles(id) ON DELETE RESTRICT NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT NOT NULL,
    creator_id UUID REFERENCES profiles(id) ON DELETE RESTRICT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    shipping_cost DECIMAL(10, 2) DEFAULT 0 CHECK (shipping_cost >= 0),
    addons_cost DECIMAL(10, 2) DEFAULT 0 CHECK (addons_cost >= 0),
    grand_total DECIMAL(10, 2) NOT NULL CHECK (grand_total >= 0),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'preparing', 'shipped', 'delivered', 'disputed', 'refunded')),
    shipping_address JSONB,
    tracking_number VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 4. CONVERSATIONS
-- -----------------------------------------------------------------------------
CREATE TABLE conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    last_message_preview TEXT,
    last_message_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(buyer_id, creator_id)
);

-- -----------------------------------------------------------------------------
-- 5. MESSAGES
-- -----------------------------------------------------------------------------
CREATE TABLE messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    text TEXT,
    is_ppv BOOLEAN DEFAULT FALSE,
    ppv_price DECIMAL(10, 2) CHECK (ppv_price >= 0),
    ppv_media_url TEXT,
    is_unlocked BOOLEAN DEFAULT FALSE,
    is_proposal BOOLEAN DEFAULT FALSE,
    proposal_style VARCHAR(100),
    proposal_wear VARCHAR(100),
    proposal_notes TEXT,
    proposal_price DECIMAL(10, 2) CHECK (proposal_price >= 0),
    proposal_status VARCHAR(50) DEFAULT 'pending' CHECK (proposal_status IN ('pending', 'accepted', 'rejected')),
    is_tip BOOLEAN DEFAULT FALSE,
    tip_amount DECIMAL(10, 2) CHECK (tip_amount >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 6. KYC APPLICATIONS
-- -----------------------------------------------------------------------------
CREATE TABLE kyc_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    legal_first_name VARCHAR(255) NOT NULL,
    legal_last_name VARCHAR(255) NOT NULL,
    ssn_last4 VARCHAR(4) NOT NULL,
    id_card_url TEXT NOT NULL,
    selfie_url TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 7. NOTIFICATIONS
-- -----------------------------------------------------------------------------
CREATE TABLE notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('order', 'chat', 'auction', 'system')),
    reference_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 8. SUBSCRIPTIONS
-- -----------------------------------------------------------------------------
CREATE TABLE subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'cancelled')),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    cancelled_at TIMESTAMPTZ,
    UNIQUE(buyer_id, creator_id)
);

-- -----------------------------------------------------------------------------
-- 9. FAVORITES
-- -----------------------------------------------------------------------------
CREATE TABLE favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- -----------------------------------------------------------------------------
-- 10. ADDRESSES
-- -----------------------------------------------------------------------------
CREATE TABLE addresses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    alias_name VARCHAR(100),
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100),
    zip_code VARCHAR(20) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 11. BIDS
-- -----------------------------------------------------------------------------
CREATE TABLE bids (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auction_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    bidder_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 12. TRANSACTIONS
-- -----------------------------------------------------------------------------
CREATE TABLE transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('purchase', 'sale', 'withdrawal', 'tip', 'subscription', 'ppv_unlock')),
    amount DECIMAL(12, 2) NOT NULL,
    reference_id UUID,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- INDEXES
-- -----------------------------------------------------------------------------
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_products_creator_id ON products(creator_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_creator_id ON orders(creator_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_conversations_buyer_id ON conversations(buyer_id);
CREATE INDEX idx_conversations_creator_id ON conversations(creator_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_bids_auction_id ON bids(auction_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);

-- -----------------------------------------------------------------------------
-- TRIGGERS & FUNCTIONS
-- -----------------------------------------------------------------------------
-- Auto-update updated_at function
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_products_modtime BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_orders_modtime BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_kyc_applications_modtime BEFORE UPDATE ON kyc_applications FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Auto-create profile on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, handle, role)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'username', 
    new.raw_user_meta_data->>'handle', 
    COALESCE(new.raw_user_meta_data->>'role', 'buyer')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all public profiles, but only update their own
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Products: Viewable by all, insert/update by creators
CREATE POLICY "Products are viewable by everyone." ON products FOR SELECT USING (true);
CREATE POLICY "Creators can insert own products." ON products FOR INSERT WITH CHECK (auth.uid() = creator_id AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'creator');
CREATE POLICY "Creators can update own products." ON products FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Creators can delete own products." ON products FOR DELETE USING (auth.uid() = creator_id);

-- Orders: Buyers and Creators involved can view
CREATE POLICY "Users can view their own orders (as buyer or creator)." ON orders FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = creator_id);
CREATE POLICY "Buyers can insert orders." ON orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Creators and Buyers can update own orders." ON orders FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = creator_id);

-- Conversations
CREATE POLICY "Users can view their conversations." ON conversations FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = creator_id);
CREATE POLICY "Users can create conversations." ON conversations FOR INSERT WITH CHECK (auth.uid() = buyer_id OR auth.uid() = creator_id);

-- Messages
CREATE POLICY "Users can view messages in their conversations." ON messages FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM conversations c
        WHERE c.id = messages.conversation_id AND (c.buyer_id = auth.uid() OR c.creator_id = auth.uid())
    )
);
CREATE POLICY "Users can insert messages in their conversations." ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update messages they sent." ON messages FOR UPDATE USING (auth.uid() = sender_id);

-- KYC Applications
CREATE POLICY "Users can view own KYC." ON kyc_applications FOR SELECT USING (auth.uid() = user_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Users can insert own KYC." ON kyc_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update KYC." ON kyc_applications FOR UPDATE USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Notifications
CREATE POLICY "Users can view own notifications." ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications." ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own notifications." ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications." ON notifications FOR DELETE USING (auth.uid() = user_id);

-- Subscriptions
CREATE POLICY "Users can view own subscriptions." ON subscriptions FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = creator_id);
CREATE POLICY "Buyers can insert subscriptions." ON subscriptions FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Users can update own subscriptions." ON subscriptions FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = creator_id);

-- Favorites
CREATE POLICY "Users can view own favorites." ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites." ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites." ON favorites FOR DELETE USING (auth.uid() = user_id);

-- Addresses
CREATE POLICY "Users can view own addresses." ON addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own addresses." ON addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own addresses." ON addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own addresses." ON addresses FOR DELETE USING (auth.uid() = user_id);

-- Bids
CREATE POLICY "Users can view all bids." ON bids FOR SELECT USING (true);
CREATE POLICY "Users can insert bids." ON bids FOR INSERT WITH CHECK (auth.uid() = bidder_id);

-- Transactions
CREATE POLICY "Users can view own transactions." ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert transactions." ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- SEED DATA (Mocks)
-- -----------------------------------------------------------------------------
-- Seed Profiles (for development/demo purposes)
INSERT INTO profiles (id, username, handle, avatar_url, role, balance, kyc_status, age, nationality, bio) VALUES
('d0000001-0000-0000-0000-000000000001', 'Guest Buyer', '@guest', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100', 'buyer', 250.00, 'unverified', NULL, NULL, NULL),
('d0000001-0000-0000-0000-000000000002', 'Luna Diamond', '@lunadiamond', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100', 'creator', 45.00, 'approved', 23, 'American', 'Premium wear and custom requests. Signed photos included with every order.'),
('d0000001-0000-0000-0000-000000000003', 'Aria Fox', '@ariafox', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=100&h=100', 'creator', 18.00, 'approved', 25, 'Canadian', 'Gym wear specialist. Fresh scent guaranteed.'),
('d0000001-0000-0000-0000-000000000004', 'Staff Admin', '@admin_staff', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100&h=100', 'admin', 0.00, 'unverified', NULL, NULL, 'Platform administrator');

-- Seed Products (matching the current localStorage products)
INSERT INTO products (id, creator_id, title_en, title_es, description_en, description_es, price, size, style, wear_time, image_url, is_featured, is_new, is_available_today, is_auction, includes_signed_photo, extra_tag_en, extra_tag_es, likes_count, status) VALUES
(gen_random_uuid(), 'd0000001-0000-0000-0000-000000000002', 'Custom Worn Satin Lace Set', 'Conjunto de Encaje de Satén Personalizado', 'Signature premium lace underwear set. Custom worn during a full day photoshoot.', 'Conjunto de ropa interior de encaje premium. Usado durante una sesión de fotos completa.', 89.00, 'S', 'Lace', '24h wear', 'https://images.unsplash.com/photo-1616166330003-8e550d40d023?auto=format&fit=crop&q=80&w=600&h=600', true, false, true, false, true, 'Includes signed photo', 'Incluye foto firmada', 154, 'active'),
(gen_random_uuid(), 'd0000001-0000-0000-0000-000000000003', 'Lavender Silk Slip Panty', 'Braguita de Seda Lavanda', 'Very soft pure silk underwear worn during gym workout. Extra fragrance preserved.', 'Ropa interior de seda pura muy suave usada durante entrenamiento. Fragancia preservada.', 65.00, 'M', 'Silk', '12h wear', 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=600&h=600', false, true, true, false, true, 'Fragrance sealed', 'Fragancia sellada', 88, 'active'),
(gen_random_uuid(), 'd0000001-0000-0000-0000-000000000002', '48-Hour Worn Intimate Bodysuit', 'Body Íntimo Usado 48 Horas', 'Worn continuously for 48 hours. Double vacuum sealed to guarantee high scent profile.', 'Usado continuamente durante 48 horas. Con doble sellado al vacío para garantizar la fragancia.', 110.00, 'S', 'Lace', '48h wear', 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=600&h=600', true, false, true, false, true, 'Scent & Photo included', 'Scent y Foto incluidos', 245, 'active');

-- Seed Conversations
INSERT INTO conversations (id, buyer_id, creator_id, last_message_preview, last_message_at) VALUES
('c0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000002', 'Hey love! Welcome to my private page.', NOW()),
('c0000001-0000-0000-0000-000000000002', 'd0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000003', 'Hey! Just listed my workout slips.', NOW());

-- Seed Messages
INSERT INTO messages (conversation_id, sender_id, text) VALUES
('c0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000002', 'Hey love! Welcome to my private page. Let me know if you want any custom wear items or special activity during my wear time.'),
('c0000001-0000-0000-0000-000000000002', 'd0000001-0000-0000-0000-000000000003', 'Hey! Just listed my workout slips. Let me know if you want them freshly packed today.');

-- Seed Notifications
INSERT INTO notifications (user_id, text, is_read, type) VALUES
('d0000001-0000-0000-0000-000000000001', 'Welcome to UNDR. Direct wear verified thongs are ready today!', false, 'system'),
('d0000001-0000-0000-0000-000000000001', 'Luna Diamond posted a locked PPV photoset in direct messages.', false, 'chat');

-- Seed KYC Applications
INSERT INTO kyc_applications (user_id, legal_first_name, legal_last_name, ssn_last4, id_card_url, selfie_url, status) VALUES
('d0000001-0000-0000-0000-000000000002', 'Luna', 'Diamond', '1234', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=150&h=150', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150', 'approved');

-- Seed Addresses
INSERT INTO addresses (user_id, alias_name, street, city, zip_code, is_default) VALUES
('d0000001-0000-0000-0000-000000000001', 'John Doe (Secure Route)', '405 Lexington Ave', 'New York', '10174', true);
