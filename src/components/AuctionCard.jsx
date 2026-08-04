/**
 * @fileoverview UNDR Reusable AuctionCard Component
 */

import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore.js';
import { Gavel, Clock, Zap, User } from 'lucide-react';

export function AuctionCard({ auction, onPlaceBid }) {
    const { lang } = useStore();
    const [timeLeftText, setTimeLeftText] = useState('');
    const [isClosed, setIsClosed] = useState(false);

    useEffect(() => {
        const updateTimer = () => {
            const endMs = typeof auction.endTime === 'string' ? new Date(auction.endTime).getTime() : (auction.endTime || Date.now() + 3600000);
            const syncedNow = window.undrAuctions ? window.undrAuctions.getSyncedNow() : Date.now();
            const diff = endMs - syncedNow;

            if (diff <= 0) {
                setTimeLeftText(lang === 'es' ? '¡SUBASTA FINALIZADA!' : 'AUCTION CLOSED');
                setIsClosed(true);
            } else {
                const totalSecs = Math.floor(diff / 1000);
                const h = Math.floor(totalSecs / 3600);
                const m = Math.floor((totalSecs % 3600) / 60);
                const s = totalSecs % 60;
                setTimeLeftText(`${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`);
                setIsClosed(false);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [auction.endTime, lang]);

    const title = auction[lang]?.title || auction.title || 'Gym-worn Silk Panty';
    const currentBid = parseFloat(auction.price || auction.current_bid || 145.00).toFixed(2);
    const topBidder = auction.topBidder || auction.highest_bidder_handle || '@anonymous';

    return (
        <article className="product-card">
            <div className="product-image-wrapper" style={{ paddingTop: '100%' }}>
                <img 
                    src={auction.image || auction.image_url || 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=600&h=600'} 
                    className="product-image" 
                    alt={title}
                />
                <span 
                    className="price-tag" 
                    style={{ backgroundColor: isClosed ? '#555' : '#ff4d6d' }}
                >
                    <Clock className="w-3.5 h-3.5 inline mr-1" /> {timeLeftText}
                </span>
            </div>

            <div className="card-body">
                <span className="card-category" style={{ color: '#ff4d6d' }}>
                    <Gavel className="w-3.5 h-3.5 inline mr-1" /> Live Auction (Public)
                </span>
                <h3 className="card-title">{title}</h3>

                {auction.anti_snipe_extensions > 0 && (
                    <div style={{ background: 'rgba(255, 77, 109, 0.1)', color: '#ff4d6d', border: '1px border #ff4d6d', padding: '4px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 'bold', margin: '6px 0' }}>
                        <Zap className="w-3 h-3 inline mr-1" /> Anti-Sniping Triggered ({auction.anti_snipe_extensions} extensions)
                    </div>
                )}

                <div style={{ background: 'var(--secondary-bg)', padding: '10px', borderRadius: '8px', margin: '8px 0', fontSize: '0.8rem', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{lang === 'es' ? 'Puja Actual:' : 'Current Bid:'}</span>
                        <strong style={{ color: 'var(--accent-hover)', fontSize: '1.05rem' }}>${currentBid} USD</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        <span>{lang === 'es' ? 'Líder de Puja:' : 'Top Bidder:'}</span>
                        <span><User className="w-3 h-3 inline mr-0.5" /> {topBidder}</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    <button 
                        className="btn btn-primary" 
                        disabled={isClosed}
                        style={{
                            flex: 1, 
                            padding: '8px', 
                            fontSize: '0.8rem', 
                            backgroundColor: isClosed ? '#666' : '#ff4d6d', 
                            borderColor: isClosed ? '#666' : '#ff4d6d'
                        }} 
                        onClick={() => onPlaceBid && onPlaceBid(auction)}
                    >
                        {isClosed ? (lang === 'es' ? 'Subasta Cerrada' : 'Auction Ended') : `${lang === 'es' ? 'Pujar' : 'Place Bid'} (+$5.00)`}
                    </button>
                </div>
            </div>
        </article>
    );
}
