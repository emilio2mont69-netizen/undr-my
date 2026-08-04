/**
 * @fileoverview UNDR SEO & OpenGraph SSR Metadata Component
 */

import React, { useEffect } from 'react';

export function SEOHead({
    title = 'UNDR — Exclusive Verified Lingerie Marketplace',
    description = 'Direct-from-creator authentic wear, live auctions, 100% discreet packaging, and 18 U.S.C. § 2257 age-verified identity protection.',
    image = 'https://swwlphueayxryooqlwhe.supabase.co/storage/v1/object/public/product-images/undr_og_preview.png',
    url = window.location.href,
    creatorName = null
}) {
    useEffect(() => {
        const fullTitle = creatorName ? `${creatorName} — Verified Shop on UNDR` : title;

        // Update Document Title
        document.title = fullTitle;

        // Helper to set meta tag content
        const setMetaTag = (selector, content) => {
            let tag = document.querySelector(selector);
            if (!tag) {
                tag = document.createElement('meta');
                if (selector.startsWith('meta[name=')) {
                    tag.setAttribute('name', selector.match(/name="([^"]+)"/)[1]);
                } else if (selector.startsWith('meta[property=')) {
                    tag.setAttribute('property', selector.match(/property="([^"]+)"/)[1]);
                }
                document.head.appendChild(tag);
            }
            tag.setAttribute('content', content);
        };

        setMetaTag('meta[name="description"]', description);
        setMetaTag('meta[property="og:title"]', fullTitle);
        setMetaTag('meta[property="og:description"]', description);
        setMetaTag('meta[property="og:image"]', image);
        setMetaTag('meta[property="og:url"]', url);
        setMetaTag('meta[property="og:type"]', 'website');
        setMetaTag('meta[name="twitter:card"]', 'summary_large_image');
        setMetaTag('meta[name="twitter:title"]', fullTitle);
        setMetaTag('meta[name="twitter:description"]', description);
        setMetaTag('meta[name="twitter:image"]', image);
    }, [title, description, image, url, creatorName]);

    return null;
}
