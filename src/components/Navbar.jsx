/**
 * @fileoverview UNDR Reusable Navbar Component
 */

import React from 'react';
import { useStore } from '../store/useStore.js';
import { Search, Globe, ShoppingBag, MessageSquare, Gavel, User, Shield, LogOut } from 'lucide-react';

export function Navbar({ activeSection, onNavigate, onSearch }) {
    const { lang, toggleLang, user, cart, logout } = useStore();
    const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

    return (
        <header className="main-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', background: 'var(--primary-bg)', borderBottom: '1px solid var(--border-color)', sticky: 'top', zIndex: 100 }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <a href="#/explore" onClick={() => onNavigate('explore')} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '2px', color: '#ff4d6d' }}>UNDR</span>
                </a>
            </div>

            {/* Search Input Bar */}
            <div style={{ flex: 1, maxWidth: '400px', margin: '0 20px', position: 'relative' }}>
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input 
                    type="text" 
                    placeholder={lang === 'es' ? 'Buscar creadoras, seda, encaje, fotos firmadas...' : 'Search creators, silk, lace, signed photos...'}
                    onChange={(e) => onSearch && onSearch(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '20px', border: '1px solid var(--border-color)', background: 'var(--secondary-bg)', color: 'var(--text-color)', fontSize: '0.85rem' }}
                />
            </div>

            {/* Header Right Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {/* Language Toggle */}
                <button className="btn btn-login" onClick={toggleLang} style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Globe className="w-4 h-4" /> {lang.toUpperCase()}
                </button>

                {/* User Session Info */}
                {user && user.role !== 'guest' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>
                            ${parseFloat(user.balance || 0).toFixed(2)} USD
                        </span>
                        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => onNavigate(user.role === 'creator' ? 'creator' : 'buyer-settings')}>
                            <img src={user.avatar} alt={user.username} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-hover)' }} />
                        </div>
                        <button className="btn btn-login" onClick={logout} title="Log Out" style={{ padding: '6px' }}>
                            <LogOut className="w-4 h-4 text-rose-500" />
                        </button>
                    </div>
                ) : (
                    <button className="btn btn-primary" onClick={() => document.getElementById('login-modal').style.display = 'flex'} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                        {lang === 'es' ? 'Iniciar Sesión' : 'Log In'}
                    </button>
                )}
            </div>
        </header>
    );
}
