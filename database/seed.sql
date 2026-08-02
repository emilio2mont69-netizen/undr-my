-- UNDR Marketplace PostgreSQL Seed Data
-- -----------------------------------------------------------------------------
-- SEED DATA
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
