/**
 * @fileoverview UNDR Main Application Entry Point & Modern Dynamic Router
 */

import React, { useState, useEffect } from 'react';
import { useStore } from './store/useStore.js';
import { Navbar } from './components/Navbar.jsx';
import { ProductCard } from './components/ProductCard.jsx';
import { AuctionCard } from './components/AuctionCard.jsx';
import { SEOHead } from './components/SEOHead.jsx';
import { Search, Gavel, ShieldCheck, Heart, Truck, Bell, Lock } from 'lucide-react';

export function App() {
    const { lang, user, cart, addToCart } = useStore();
    const [currentRoute, setCurrentRoute] = useState('explore');
    const [creatorHandle, setCreatorHandle] = useState(null);
    const [products, setProducts] = useState([]);
    const [auctionsList, setAuctionsList] = useState([]);

    // Hash routing handler
    useEffect(() => {
        const handleHash = () => {
            const hash = decodeURIComponent(window.location.hash).trim();
            if (!hash || hash === '#' || hash === '#/' || hash === '#/explore') {
                setCurrentRoute('explore');
                setCreatorHandle(null);
            } else if (hash.startsWith('#/creator/')) {
                setCurrentRoute('creator-profile');
                setCreatorHandle(hash.replace('#/creator/', ''));
            } else if (hash.startsWith('#@')) {
                setCurrentRoute('creator-profile');
                setCreatorHandle(hash.replace('#@', ''));
            } else if (hash === '#/auctions') {
                setCurrentRoute('auctions');
            } else if (hash === '#/chat') {
                setCurrentRoute('chat');
            } else if (hash === '#/buyer-settings') {
                setCurrentRoute('buyer-settings');
            } else if (hash === '#/admin') {
                setCurrentRoute('admin');
            }
        };

        handleHash();
        window.addEventListener('hashchange', handleHash);
        return () => window.removeEventListener('hashchange', handleHash);
    }, []);

    // Initial products load
    useEffect(() => {
        const loadInitialData = async () => {
            if (window.undrSearchEngine) {
                const res = await window.undrSearchEngine.searchProducts();
                if (res && res.products) {
                    setProducts(res.products);
                }
            } else {
                const local = JSON.parse(localStorage.getItem('undr_products')) || [];
                setProducts(local);
            }
        };
        loadInitialData();
    }, []);

    const handleSearchInput = async (query) => {
        if (window.undrSearchEngine) {
            const res = await window.undrSearchEngine.searchProducts({ query });
            if (res && res.products) setProducts(res.products);
        }
    };

    return (
        <div className="undr-app-container">
            {/* Dynamic SEO SSR OpenGraph Meta Tags */}
            <SEOHead 
                title={creatorHandle ? `${creatorHandle} — Verified Shop on UNDR` : 'UNDR — Exclusive Verified Lingerie Marketplace'}
                description="Direct-from-creator authentic wear, live auctions, 100% discreet packaging, and 18 U.S.C. § 2257 identity protection."
                creatorName={creatorHandle}
            />

            {/* Navbar */}
            <Navbar 
                activeSection={currentRoute} 
                onNavigate={(route) => window.location.hash = `#/${route}`}
                onSearch={handleSearchInput}
            />

            {/* Main Application Layout */}
            <main className="main-content-layout" style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 16px' }}>
                {/* EXPLORE MARKETPLACE FEED ROUTE */}
                {currentRoute === 'explore' && (
                    <section id="section-explore" className="content-section-panel active">
                        <div className="section-header" style={{ marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                                <ShieldCheck className="w-5 h-5 text-emerald-500 inline mr-2" />
                                {lang === 'es' ? 'Prendas Verificadas de Creadoras' : 'Verified Direct Garments'}
                            </h2>
                        </div>

                        <div className="products-grid">
                            {products.map(product => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    onAddToCart={addToCart}
                                    onOpenCustom={(creator) => {
                                        if (window.openCustomRequest) window.openCustomRequest(creator.name);
                                    }}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* CREATOR PROFILE ROUTE */}
                {currentRoute === 'creator-profile' && (
                    <section id="section-creator-profile" className="content-section-panel active">
                        <div className="widget" style={{ padding: '24px', background: 'var(--secondary-bg)', borderRadius: '16px' }}>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>@{creatorHandle || 'lunadiamond'}</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                {lang === 'es' ? 'Tienda oficial verificada. Foto firmada enviada con cada pedido.' : 'Official verified shop. Signed photo included with every order.'}
                            </p>
                        </div>
                    </section>
                )}

                {/* LIVE AUCTIONS ROUTE */}
                {currentRoute === 'auctions' && (
                    <section id="section-auctions" className="content-section-panel active">
                        <div className="section-header" style={{ marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                                <Gavel className="w-5 h-5 text-pink-500 inline mr-2" />
                                {lang === 'es' ? 'Subastas en Vivo con Anti-Sniping' : 'Live Lingerie Auctions'}
                            </h2>
                        </div>
                        <div className="products-grid">
                            {products.filter(p => p.isAuction).map(auc => (
                                <AuctionCard 
                                    key={auc.id} 
                                    auction={auc}
                                    onPlaceBid={(auction) => {
                                        if (window.undrAuctions) window.undrAuctions.placeServerAuctionBid(auction.id, (auction.price || 50) + 5);
                                    }}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
