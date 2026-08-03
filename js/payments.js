/**
 * @fileoverview NOWPayments Integration Module for UNDR Marketplace
 * Handles live crypto checkout, invoice creation, and payment status listening.
 */

export const NOWPAYMENTS_CONFIG = {
    apiKey: '2AXZ9SB-YK2M935-M7WSHV2-4GNN71A',
    apiBaseUrl: 'https://api.nowpayments.io/v1',
    sandbox: false
};

export const paymentsAPI = {
    /**
     * Check NOWPayments API Status
     */
    async checkStatus() {
        try {
            const response = await fetch(`${NOWPAYMENTS_CONFIG.apiBaseUrl}/status`);
            const data = await response.json();
            return { ok: true, data };
        } catch (error) {
            return { ok: false, error: error.message };
        }
    },

    /**
     * Create a payment invoice
     * @param {Object} params - Invoice params { price_amount, price_currency, order_id, order_description }
     */
    async createInvoice({ priceAmount, priceCurrency = 'usd', orderId, orderDescription }) {
        try {
            const response = await fetch(`${NOWPAYMENTS_CONFIG.apiBaseUrl}/invoice`, {
                method: 'POST',
                headers: {
                    'x-api-key': NOWPAYMENTS_CONFIG.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    price_amount: priceAmount,
                    price_currency: priceCurrency,
                    order_id: orderId || `order_${Date.now()}`,
                    order_description: orderDescription || 'UNDR Exclusive Purchase',
                    ipn_callback_url: 'https://swwlphueayxryooqlwhe.supabase.co/functions/v1/nowpayments-webhook',
                    success_url: window.location.origin,
                    cancel_url: window.location.origin
                })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to generate NOWPayments invoice');
            }
            return { ok: true, invoice: data };
        } catch (error) {
            console.error('NOWPayments Invoice Error:', error);
            return { ok: false, error: error.message };
        }
    },

    /**
     * Get Payment Status
     * @param {string} paymentId
     */
    async getPaymentStatus(paymentId) {
        try {
            const response = await fetch(`${NOWPAYMENTS_CONFIG.apiBaseUrl}/payment/${paymentId}`, {
                headers: {
                    'x-api-key': NOWPAYMENTS_CONFIG.apiKey
                }
            });
            const data = await response.json();
            return { ok: true, payment: data };
        } catch (error) {
            return { ok: false, error: error.message };
        }
    }
};

// Expose globally for legacy app.js
window.undrPayments = paymentsAPI;
