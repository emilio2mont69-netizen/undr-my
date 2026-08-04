/**
 * @fileoverview UNDR Reusable ProductCard Component
 */

import React, { useState } from 'react';
import { useStore } from '../store/useStore.js';
import { Eye, ShoppingBag, Heart, Wand2, ShieldCheck } from 'lucide-react';

export function ProductCard({ product, onAddToCart, onOpenDetail, onOpenCustom }) {
    const { lang, user } = useStore();
    const [isRevealed, setIsRevealed] = useState(false);
    const [isLiked, setIsLiked] = useState(() => {
        const favs = JSON.parse(localStorage.getItem('undr_favorites')) || [];
        return favs.includes(product.id);
    });

    const title = product[lang]?.title || product.title || 'Lingerie Item';
    const description = product[lang]?.description || product.description || '';
    const creator = product.creator || { name: 'Luna Diamond', handle: '@lunadiamond' };

    const handleToggleLike = (e) => {
        e.stopPropagation();
        let favs = JSON.parse(localStorage.getItem('undr_favorites')) || [];
        if (isLiked) {
            favs = favs.filter(id => id !== product.id);
            setIsLiked(false);
        } else {
            favs.push(product.id);
            setIsLiked(true);
        }
        localStorage.setItem('undr_favorites', JSON.stringify(favs));
    };

    const handleToggleBlur = (e) => {
        e.stopPropagation();
        if (!user || user.role === 'guest' || user.handle === '@guest') {
            if (window.showToast) {
                window.showToast(lang === 'es' ? 'Debes iniciar sesión para ver las fotos sin censura.' : 'Please log in to view uncensored photos.');
            }
            return;
        }
        setIsRevealed(!isRevealed);
    };

    return (
        <article className="product-card">
            <div 
                className="card-creator-header" 
                onClick={() => window.location.hash = `#/creator/${creator.handle.replace('@', '')}`}
                style={{ cursor: 'pointer' }}
            >
                <img 
                    src={creator.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'} 
                    alt={creator.name} 
                    className="creator-avatar-card" 
                />
                <div className="creator-info-card">
                    <span className="card-creator-name">
                        {creator.name} {creator.verified && <ShieldCheck className="w-4 h-4 text-emerald-500 inline ml-1" />}
                    </span>
                    <span className="card-post-time">{lang === 'es' ? 'Hace 3 horas' : '3h ago'}</span>
                </div>
            </div>

            <div 
                className="product-image-wrapper" 
                onClick={() => onOpenDetail && onOpenDetail(product)}
                style={{ cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
            >
                <img 
                    src={product.image} 
                    alt={title} 
                    className="product-image"
                    style={{ 
                        filter: isRevealed ? 'none' : 'blur(14px)',
                        transition: 'filter 0.3s ease, transform 0.3s ease',
                        transform: 'scale(1.05)'
                    }} 
                    loading="lazy"
                />
                <span className="price-tag">${parseFloat(product.price).toFixed(2)} USD</span>
                <button 
                    className="btn-reveal-card" 
                    onClick={handleToggleBlur}
                    title={lang === 'es' ? 'Ver / Previsualizar' : 'Preview Photo'}
                >
                    <Eye className="w-4 h-4" />
                </button>
            </div>

            <div className="card-body">
                <span className="card-category">{product.style || 'Lace'}</span>
                <h3 className="card-title">{title}</h3>
                <p className="card-description">{description}</p>

                <div className="card-spec-tags">
                    <span className="spec-tag">Size {product.size || 'S'}</span>
                    <span className="spec-tag">{product.wearTime || '24h wear'}</span>
                </div>

                <div className="card-footer">
                    <div className="card-actions-row">
                        <button 
                            className="btn-buy-item" 
                            onClick={() => onAddToCart && onAddToCart(product)}
                        >
                            <ShoppingBag className="w-4 h-4 mr-1 inline" /> {lang === 'es' ? 'Comprar' : 'Buy Item'}
                        </button>
                        <button 
                            className="btn-like-post" 
                            onClick={handleToggleLike}
                            style={isLiked ? { color: '#ff4d6d', borderColor: '#ffa6b5' } : {}}
                        >
                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-pink-500' : ''}`} />
                        </button>
                    </div>
                    {onOpenCustom && (
                        <button 
                            className="btn-request-custom" 
                            onClick={() => onOpenCustom(creator)}
                        >
                            <Wand2 className="w-4 h-4 mr-1 inline" /> {lang === 'es' ? 'Pedido a medida' : 'Request Custom'}
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}
