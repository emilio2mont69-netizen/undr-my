/**
 * @fileoverview UNDR Shipping API Integration
 * Implements real carrier shipping (USPS, FedEx) using EasyPost API.
 */

import { supabase, isSupabaseConfigured } from './supabase-config.js';
import { api } from './api.js';

export const shippingEngine = {
    /**
     * Submit a manual tracking code provided by the creator.
     * @param {string} orderId 
     * @param {string} trackingCode 
     */
    async submitManualTracking(orderId, trackingCode) {
        try {
            // Automatically attach tracking to the order in the database
            await api.orders.addTracking(orderId, trackingCode);

            // In production, we could also send an email to the buyer here via notificationsEngine

            return { 
                ok: true, 
                trackingCode: trackingCode
            };
        } catch (error) {
            return { ok: false, error: error.message };
        }
    },
    updateOrderStatus(orderId, status) {
        // Mock method to update status on the UI side if API not used
        api.orders.updateOrderStatus(orderId, status);
    }
};

window.undrShipping = shippingEngine;
