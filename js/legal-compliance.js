/**
 * @fileoverview UNDR Legal Pages, 18 U.S.C. § 2257 Compliance, GDPR/CCPA & DMCA Module
 * 
 * Contains complete legal text and handlers for:
 * 1. Terms of Service
 * 2. Privacy Policy (GDPR / CCPA Compliant)
 * 3. Cookie Policy & Banner Engine
 * 4. 18 U.S.C. § 2257 Compliance Statement & Custodian of Records
 * 5. Refunds & Escrow Dispute Resolution Policy
 * 6. DMCA Takedown Notice & Takedown Form Handler
 */

import { supabase, isSupabaseConfigured } from './supabase-config.js';

export const LEGAL_DOCUMENTS = {
    terms: {
        title_en: 'Terms of Service',
        title_es: 'Términos y Condiciones de Servicio',
        content_en: `
            <h3>1. Age Restriction & Platform Rules</h3>
            <p>UNDR is strictly restricted to individuals who are at least 18 years of age (or the legal age of majority in their jurisdiction). By accessing or using the platform, you warrant that you are at least 18 years old.</p>
            
            <h3>2. Marketplace Transactions & Escrow Protection</h3>
            <p>All purchases are held securely in UNDR Escrow until the buyer confirms delivery or the standard inspection window expires. Creators are responsible for delivering authentic garments packed in 100% discreet packaging ("UNDR Logistics").</p>
            
            <h3>3. Prohibited Content & Activity</h3>
            <p>Users must not offer or upload non-consensual content, illegal goods, or unverified third-party media. Violation of these terms will result in immediate account termination and forfeiture of pending balances.</p>
        `,
        content_es: `
            <h3>1. Restricción de Edad y Reglas de la Plataforma</h3>
            <p>UNDR está estrictamente restringido a personas mayores de 18 años. Al acceder a la plataforma, garantizas que tienes al menos 18 años de edad.</p>
            
            <h3>2. Transacciones y Protección de Escrow</h3>
            <p>Todas las compras se mantienen seguras en el Escrow de UNDR hasta que el comprador confirme la entrega. Las creadoras son responsables de enviar prendas auténticas en empaques 100% discretos ("UNDR Logistics").</p>
            
            <h3>3. Contenido y Actividades Prohibidas</h3>
            <p>Está prohibido publicar contenido no consentido o productos ilegales. El incumplimiento resultará en la cancelación inmediata de la cuenta.</p>
        `
    },
    privacy: {
        title_en: 'Privacy Policy (GDPR & CCPA Compliant)',
        title_es: 'Política de Privacidad (Cumplimiento GDPR y CCPA)',
        content_en: `
            <h3>1. Information We Collect</h3>
            <p>We collect essential identity verification data (government ID, selfie verification hash), shipping addresses, and transaction records. Sensitive identity documents are encrypted using AES-256 standard and stored in isolated vault storage.</p>
            
            <h3>2. Data Subject Rights (GDPR / CCPA)</h3>
            <p>Under GDPR and CCPA, you have the right to request access to your personal data, request correction or erasure ("Right to be Forgotten"), and object to automated processing.</p>
            
            <h3>3. Contact Data Protection Officer (DPO)</h3>
            <p>For data privacy requests or deletion inquiries, contact our Data Protection Officer at <strong>dpo@undr-app.com</strong>.</p>
        `,
        content_es: `
            <h3>1. Información que Recopilamos</h3>
            <p>Recopilamos datos esenciales de verificación de identidad, direcciones de envío y registros de transacciones. Los documentos de identidad se encriptan con AES-256.</p>
            
            <h3>2. Derechos de los Usuarios (GDPR / CCPA)</h3>
            <p>Tienes derecho a solicitar acceso, corrección o eliminación de tus datos personales ("Derecho al Olvido").</p>
            
            <h3>3. Contacto con el Oficial de Protección de Datos (DPO)</h3>
            <p>Para solicitudes de privacidad, contacta a <strong>dpo@undr-app.com</strong>.</p>
        `
    },
    cookies: {
        title_en: 'Cookie & Tracking Policy',
        title_es: 'Política de Cookies y Rastreadores',
        content_en: `
            <h3>1. Essential & Functional Cookies</h3>
            <p>We use essential session cookies to maintain your login status, language preferences, and shopping cart state across pages.</p>
            
            <h3>2. Managing Cookie Preferences</h3>
            <p>You can adjust your cookie preferences at any time through your browser settings or via our bottom cookie consent banner.</p>
        `,
        content_es: `
            <h3>1. Cookies Esenciales</h3>
            <p>Utilizamos cookies esenciales para mantener tu sesión activa, preferencia de idioma y estado del carrito de compras.</p>
            
            <h3>2. Gestión de Preferencias</h3>
            <p>Puedes ajustar tus preferencias de cookies en cualquier momento desde el banner de consentimiento.</p>
        `
    },
    section2257: {
        title_en: '18 U.S.C. § 2257 Exemption & Compliance Statement',
        title_es: 'Declaración de Cumplimiento 18 U.S.C. § 2257',
        content_en: `
            <h3>18 U.S.C. § 2257 Record-Keeping Compliance</h3>
            <p>All creators participating on UNDR have undergone mandatory government-issued photo ID identity verification and biometric face match prior to publishing content or selling items.</p>
            
            <div style="background:var(--secondary-bg); padding:14px; border-radius:8px; border:1px solid var(--border-color); margin:12px 0;">
                <strong>Custodian of Records Designation:</strong><br>
                UNDR Compliance & Legal Records Dept.<br>
                405 Lexington Avenue, 26th Floor<br>
                New York, NY 10174, United States<br>
                Email: <strong>compliance-2257@undr-app.com</strong>
            </div>
            
            <p>All records required pursuant to 18 U.S.C. § 2257 and 28 C.F.R. Part 75 are maintained by the Custodian of Records at the address listed above.</p>
        `,
        content_es: `
            <h3>Cumplimiento de Registros 18 U.S.C. § 2257</h3>
            <p>Todas las creadoras en UNDR han completado la verificación obligatoria de identidad con documento oficial con fotografía y coincidencia biométrica facial antes de publicar contenido.</p>
            
            <div style="background:var(--secondary-bg); padding:14px; border-radius:8px; border:1px solid var(--border-color); margin:12px 0;">
                <strong>Designación del Custodio de Registros:</strong><br>
                Departamento Legal y de Cumplimiento de UNDR<br>
                405 Lexington Avenue, Piso 26<br>
                Nueva York, NY 10174, EE. UU.<br>
                Email: <strong>compliance-2257@undr-app.com</strong>
            </div>
        `
    },
    refunds: {
        title_en: 'Refunds & Dispute Resolution Policy',
        title_es: 'Política de Reembolsos y Resolución de Disputas',
        content_en: `
            <h3>1. Buyer Escrow Guarantee</h3>
            <p>Payments are held in Escrow for up to 14 days after shipment. If your order arrives damaged, incorrect, or is lost in transit, you can open a dispute from your Order History panel.</p>
            
            <h3>2. Dispute Resolution Steps</h3>
            <p>Upon dispute filing, funds are locked in Escrow. UNDR staff will review the shipping tracking logs and seller dispatch proof. Approved disputes yield a 100% refund to the buyer's balance or original payment method.</p>
        `,
        content_es: `
            <h3>1. Garantía de Escrow para Compradores</h3>
            <p>Los pagos se retienen en Escrow hasta 14 días después del envío. Si tu pedido llega dañado o se pierde en tránsito, puedes abrir una disputa.</p>
            
            <h3>2. Proceso de Resolución</h3>
            <p>El personal de UNDR revisará los registros de envío de USPS/FedEx. Las disputas aprobadas generan un reembolso del 100%.</p>
        `
    },
    dmca: {
        title_en: 'DMCA Takedown Procedure & Notice Form',
        title_es: 'Procedimiento y Formulario de Notificación DMCA',
        content_en: `
            <h3>Digital Millennium Copyright Act (DMCA) Notice</h3>
            <p>UNDR respects intellectual property rights. If you believe your copyrighted work has been uploaded without authorization, submit a notice containing: (a) Identification of copyrighted work, (b) Exact URL of infringing content, and (c) Electronic signature.</p>
            
            <div style="background:var(--secondary-bg); padding:14px; border-radius:8px; border:1px solid var(--border-color); margin:12px 0;">
                <strong>Designated DMCA Agent:</strong><br>
                Copyright Agent — UNDR Legal Dept.<br>
                Email: <strong>dmca@undr-app.com</strong>
            </div>

            <div style="margin-top:16px; padding:14px; background:var(--accent-light); border-radius:8px;">
                <h4 style="margin-bottom:8px;">Submit Online DMCA Takedown Claim:</h4>
                <div style="display:flex; flex-direction:column; gap:8px;">
                    <input type="text" id="dmca-complainant-name" placeholder="Full Legal Name" style="padding:8px; border-radius:6px; border:1px solid var(--border-color);">
                    <input type="email" id="dmca-complainant-email" placeholder="Email Address" style="padding:8px; border-radius:6px; border:1px solid var(--border-color);">
                    <input type="url" id="dmca-infringing-url" placeholder="Infringing Content URL" style="padding:8px; border-radius:6px; border:1px solid var(--border-color);">
                    <textarea id="dmca-proof-desc" placeholder="Description of Copyrighted Work" style="padding:8px; border-radius:6px; border:1px solid var(--border-color); height:60px;"></textarea>
                    <button class="btn btn-primary" onclick="window.undrLegal.submitDmcaClaim()" style="padding:8px; font-weight:bold;">Submit DMCA Notice</button>
                </div>
            </div>
        `,
        content_es: `
            <h3>Notificación Digital Millennium Copyright Act (DMCA)</h3>
            <p>Si consideras que tu obra protegida por derechos de autor ha sido publicada sin autorización, envía una solicitud con los detalles de la infracción.</p>
            
            <div style="background:var(--secondary-bg); padding:14px; border-radius:8px; border:1px solid var(--border-color); margin:12px 0;">
                <strong>Agente DMCA Designado:</strong><br>
                Agente de Derechos de Autor — UNDR Legal<br>
                Email: <strong>dmca@undr-app.com</strong>
            </div>
        `
    }
};

// ─── Legal Document Modal Viewer Handler ──────────────────────────────────────

export function openLegalModal(docKey) {
    const doc = LEGAL_DOCUMENTS[docKey];
    if (!doc) return;

    const modal = document.getElementById('legal-document-modal');
    const titleEl = document.getElementById('legal-modal-title');
    const bodyEl = document.getElementById('legal-modal-body');

    const currentLang = localStorage.getItem('undr_lang') || 'en';

    if (titleEl) titleEl.textContent = doc[`title_${currentLang}`] || doc.title_en;
    if (bodyEl) bodyEl.innerHTML = doc[`content_${currentLang}`] || doc.content_en;

    if (modal) modal.style.display = 'flex';
}

export function closeLegalModal() {
    const modal = document.getElementById('legal-document-modal');
    if (modal) modal.style.display = 'none';
}

// ─── Cookie Consent Banner Engine ─────────────────────────────────────────────

export function initCookieConsentBanner() {
    const consent = localStorage.getItem('undr_cookie_consent');
    const banner = document.getElementById('cookie-consent-banner');

    if (!consent && banner) {
        banner.style.display = 'flex';
    }
}

export function acceptCookieConsent() {
    localStorage.setItem('undr_cookie_consent', 'accepted');
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) banner.style.display = 'none';
    if (window.showToast) {
        const lang = localStorage.getItem('undr_lang') || 'en';
        window.showToast(lang === 'es' ? 'Preferencias de cookies guardadas.' : 'Cookie preferences saved.');
    }
}

// ─── DMCA Claim Submitter ─────────────────────────────────────────────────────

export async function submitDmcaClaim() {
    const name = document.getElementById('dmca-complainant-name')?.value.trim();
    const email = document.getElementById('dmca-complainant-email')?.value.trim();
    const url = document.getElementById('dmca-infringing-url')?.value.trim();
    const proof = document.getElementById('dmca-proof-desc')?.value.trim();

    if (!name || !email || !url || !proof) {
        alert('Please fill out all DMCA claim fields.');
        return;
    }

    if (isSupabaseConfigured() && supabase) {
        try {
            await supabase.rpc('submit_dmca_takedown_request', {
                p_name: name,
                p_email: email,
                p_url: url,
                p_proof: proof
            });
        } catch (e) {
            console.warn('[DMCA Engine] Supabase RPC warning:', e.message);
        }
    }

    if (window.showToast) {
        window.showToast('DMCA Takedown Notice submitted successfully. Ticket ID #' + Date.now().toString().slice(-6));
    }

    closeLegalModal();
}

// Expose globally
window.undrLegal = {
    openLegalModal,
    closeLegalModal,
    initCookieConsentBanner,
    acceptCookieConsent,
    submitDmcaClaim
};

setTimeout(initCookieConsentBanner, 800);

console.log('%c⚖️ UNDR Legal Pages, 18 U.S.C. § 2257 & Compliance Engine loaded', 'color: #3b82f6; font-weight: bold; font-size: 13px;');
