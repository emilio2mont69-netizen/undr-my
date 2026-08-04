/**
 * @fileoverview UNDR Legal Pages, 18 U.S.C. § 2257 Compliance, GDPR/CCPA & Escrow Dispute Module
 * 
 * Contains comprehensive, formal legal text and handlers for:
 * 1. Terms of Service
 * 2. Privacy Policy (GDPR / CCPA Compliant)
 * 3. Cookie Policy & Banner Engine
 * 4. 18 U.S.C. § 2257 Compliance Statement & Custodian of Records
 * 5. Refunds & Escrow Dispute Resolution Policy
 */

import { supabase, isSupabaseConfigured } from './supabase-config.js';

export const LEGAL_DOCUMENTS = {
    terms: {
        title_en: 'Terms of Service & User Agreement',
        title_es: 'Términos y Condiciones de Servicio y Acuerdo de Usuario',
        content_en: `
            <div style="display:flex; flex-direction:column; gap:16px;">
                <p><strong>Effective Date:</strong> August 2026 | <strong>Version:</strong> 3.2.0</p>
                
                <h4>1. Acceptance of Terms & Eligibility</h4>
                <p>Welcome to UNDR. By creating an account, browsing, or transacting on this platform, you enter into a legally binding agreement. Access is strictly restricted to individuals who are at least <strong>18 years of age</strong> (or the legal age of majority in your jurisdiction). Misrepresentation of age or identity constitutes a material breach of contract and will result in immediate permanent suspension and reporting where required by law.</p>

                <h4>2. Platform Role & Marketplace Functionality</h4>
                <p>UNDR operates strictly as an intermediary peer-to-peer marketplace facilitating transactions between independent Sellers ("Creators") and Buyers. UNDR provides technical infrastructure, identity verification tools, and Escrow protection services. UNDR does not own, manufacture, or directly handle physical inventory posted by independent Sellers.</p>

                <h4>3. Seller (Creator) Obligations & Standards</h4>
                <ul>
                    <li><strong>Biometric & ID Verification:</strong> All Sellers must complete mandatory identity verification (valid government-issued photo ID and biometric face match) prior to listing any items.</li>
                    <li><strong>Dispatch & 24-Hour Tracking Mandate:</strong> Upon receipt of a paid order, Sellers must package the item securely and submit a valid postal tracking number within 24 hours. Failure to submit tracking within 24 hours entitles the Buyer to cancel the order for a full refund.</li>
                    <li><strong>Item Authenticity & Hygiene:</strong> Sellers warrant that all items match the exact descriptions, wear duration, and specifications advertised. Items must be dispatched in sealed, 100% discreet outer packaging.</li>
                </ul>

                <h4>4. Buyer Conduct & Escrow Protection</h4>
                <p>All payments made by Buyers are held in UNDR Escrow until delivery is confirmed by tracking or the inspection window expires. Buyers agree not to engage in harassment, extortion, or chargeback fraud. Unfounded chargebacks will result in account forfeiture and legal action to recover funds.</p>

                <h4>5. Prohibited Conduct & Content Rules</h4>
                <p>Users are strictly prohibited from uploading, requesting, or distributing: non-consensual media, illegal goods, stolen items, or content depicting minors. Any violation will lead to immediate account termination, forfeiture of balances held in Escrow, and referral to law enforcement agencies.</p>

                <h4>6. Limitation of Liability & Governing Law</h4>
                <p>UNDR shall not be held liable for indirect, incidental, or consequential damages resulting from platform use, postal transit delays, or third-party seller conduct. These Terms are governed by applicable commerce laws and dispute resolution protocols established herein.</p>
            </div>
        `,
        content_es: `
            <div style="display:flex; flex-direction:column; gap:16px;">
                <p><strong>Fecha de Entrada en Vigor:</strong> Agosto de 2026 | <strong>Versión:</strong> 3.2.0</p>
                
                <h4>1. Aceptación de Términos y Elegibilidad</h4>
                <p>Bienvenido a UNDR. Al crear una cuenta, navegar o realizar transacciones en esta plataforma, aceptas un acuerdo legalmente vinculante. El acceso está estrictamente reservado a personas que tengan al menos <strong>18 años de edad</strong> (o la mayoría de edad en su jurisdicción). La tergiversación de la edad o identidad constituye un incumplimiento grave del contrato y resultará en la suspensión permanente inmediata de la cuenta.</p>

                <h4>2. Rol de la Plataforma y Función del Marketplace</h4>
                <p>UNDR opera estrictamente como una plataforma intermediaria que facilita transacciones entre Vendedoras independientes ("Creadoras") y Compradores. UNDR proporciona la infraestructura técnica, verificación de identidad y custodia segura de fondos (Escrow). UNDR no posee ni manipula directamente los productos físicos publicados por las vendedoras independientes.</p>

                <h4>3. Obligaciones y Estándares de las Vendedoras (Creadoras)</h4>
                <ul>
                    <li><strong>Verificación Biométrica e Identidad:</strong> Todas las Vendedoras deben completar la verificación obligatoria de identidad (documento de identidad oficial con fotografía y validación biométrica facial) antes de publicar cualquier prenda o contenido.</li>
                    <li><strong>Envío Obligatorio y Código de Rastreo en 24 Horas:</strong> Tras recibir una orden pagada, la Vendedora debe empaquetar el producto de forma segura y proporcionar un número de guía o seguimiento postal válido en un plazo máximo de 24 horas. Si no se proporciona el rastreo en 24 horas, el Comprador tiene derecho a cancelar el pedido con reembolso del 100%.</li>
                    <li><strong>Autenticidad e Higiene de las Prendas:</strong> Las Vendedoras garantizan que los productos coinciden exactamente con la descripción, tiempo de uso y especificaciones anunciadas. Los envíos deben realizarse en empaques 100% discretos y sellados.</li>
                </ul>

                <h4>4. Conducta del Comprador y Protección de Escrow</h4>
                <p>Todos los pagos realizados por los Compradores permanecen protegidos en el sistema Escrow de UNDR hasta que la paquetería confirme la entrega o venza el periodo de inspección. Los compradores se comprometen a no realizar conductas de extorsión ni fraudes de contracargo. Los contracargos infundados resultarán en la cancelación de la cuenta y acciones legales para la recuperación del saldo.</p>

                <h4>5. Contenido y Actividades Prohibidas</h4>
                <p>Queda estrictamente prohibido solicitar, publicar o distribuir: contenido sin consentimiento, sustancias o productos ilegales, o cualquier material que involucre a menores de edad. Cualquier infracción provocará la cancelación inmediata de la cuenta, la congelación de saldos y la notificación a las autoridades competentes.</p>

                <h4>6. Limitación de Responsabilidad y Ley Aplicable</h4>
                <p>UNDR no será responsable de daños indirectos, incidentales o resultantes del uso de la plataforma, retrasos en las empresas de paquetería o la conducta de vendedoras independientes. Estos Términos se rigen por la legislación comercial aplicable y los protocolos de resolución de disputas aquí establecidos.</p>
            </div>
        `
    },
    privacy: {
        title_en: 'Privacy Policy & Data Protection (GDPR / CCPA)',
        title_es: 'Política de Privacidad y Protección de Datos (GDPR / CCPA)',
        content_en: `
            <div style="display:flex; flex-direction:column; gap:16px;">
                <h4>1. Information Collection & Verification Vault</h4>
                <p>We collect only essential data required to operate a secure marketplace: account login credentials, encrypted verification records (government photo ID hashes and biometric selfie hashes), shipping addresses, and transaction histories. Sensitive identity documents are encrypted using AES-256 standards and stored in isolated security vaults.</p>

                <h4>2. Purpose of Data Processing</h4>
                <p>Personal data is processed strictly for: (a) verifying age and legal seller identity, (b) preventing fraud and underage access, (c) facilitating discreet order dispatch, and (d) maintaining transaction records required by financial regulations.</p>

                <h4>3. Data Subject Rights (GDPR & CCPA Compliance)</h4>
                <p>Under the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA), you maintain the right to:</p>
                <ul>
                    <li>Access the personal data stored in your account.</li>
                    <li>Request correction of inaccurate personal records.</li>
                    <li>Request full erasure of your account and personal data ("Right to be Forgotten"), subject to legal retention obligations.</li>
                    <li>Opt out of non-essential communications.</li>
                </ul>

                <h4>4. Data Sharing & Third-Party Processors</h4>
                <p>We do not sell, rent, or trade personal information to third parties or marketing brokers. Data is shared exclusively with verified operational infrastructure providers (encrypted database vaults and secure payment gateways) necessary to fulfill service requests.</p>

                <h4>5. Contact Data Protection Officer (DPO)</h4>
                <p>To submit a data access request or execute your Right to Deletion, contact our dedicated privacy team at: <strong>privacy@undr-app.com</strong>.</p>
            </div>
        `,
        content_es: `
            <div style="display:flex; flex-direction:column; gap:16px;">
                <h4>1. Recopilación de Información y Bóveda de Verificación</h4>
                <p>Recopilamos únicamente los datos esenciales para operar un marketplace seguro: credenciales de cuenta, registros de verificación encriptados (hashes de documentos oficiales e identidad biométrica), direcciones de entrega y registro de transacciones. Los documentos sensibles se encriptan bajo el estándar AES-256 en bóvedas de seguridad aisladas.</p>

                <h4>2. Finalidad del Tratamiento de Datos</h4>
                <p>Los datos personales se procesan exclusivamente para: (a) verificar la mayoría de edad e identidad de las vendedoras, (b) prevenir fraudes y acceso a menores de edad, (c) gestionar los envíos discretos de pedidos, y (d) mantener registros contables exigidos por las regulaciones financieras.</p>

                <h4>3. Derechos de los Usuarios (Cumplimiento GDPR y CCPA)</h4>
                <p>Conforme al Reglamento General de Protección de Datos (GDPR) y la Ley de Privacidad del Consumidor de California (CCPA), tienes derecho a:</p>
                <ul>
                    <li>Acceder a los datos personales almacenados en tu perfil.</li>
                    <li>Solicitar la rectificación de información inexacta.</li>
                    <li>Solicitar la eliminación total de tus datos personales ("Derecho al Olvido"), sujeto a los plazos legales de retención contable.</li>
                    <li>Revocar el consentimiento para comunicaciones no esenciales.</li>
                </ul>

                <h4>4. Transferencia de Datos a Terceros</h4>
                <p>No vendemos, alquilamos ni comercializamos datos personales con corredores de marketing ni terceros ajenos. La información solo se comparte de forma estrictamente confidencial con proveedores de infraestructura tecnológica (servidores encriptados y pasarelas de pago seguras) necesarios para la operación.</p>

                <h4>5. Contacto con el Oficial de Protección de Datos (DPO)</h4>
                <p>Para ejercer tus derechos de acceso, rectificación o eliminación de datos, contacta a nuestro equipo de privacidad en: <strong>privacy@undr-app.com</strong>.</p>
            </div>
        `
    },
    cookies: {
        title_en: 'Cookie & Local Storage Policy',
        title_es: 'Política de Cookies y Almacenamiento Local',
        content_en: `
            <div style="display:flex; flex-direction:column; gap:16px;">
                <h4>1. Essential Session Cookies</h4>
                <p>UNDR utilizes essential technical cookies and browser storage strictly required for application functionality, including authentication token storage, language settings, and shopping cart persistence.</p>

                <h4>2. Analytical & Security Cookies</h4>
                <p>We use encrypted security tokens to protect against Cross-Site Request Forgery (CSRF) attacks and maintain secure session states. We do not deploy third-party advertising cookies or cross-site tracking pixels.</p>

                <h4>3. Managing Preferences</h4>
                <p>You can manage or clear stored cookie data directly from your web browser settings at any time. Disabling essential session cookies may impair login functionality and shopping cart operation.</p>
            </div>
        `,
        content_es: `
            <div style="display:flex; flex-direction:column; gap:16px;">
                <h4>1. Cookies Esenciales de Sesión</h4>
                <p>UNDR utiliza cookies técnicas esenciales y almacenamiento local del navegador requeridos estrictamente para el funcionamiento de la aplicación, incluyendo la autenticación del usuario, preferencia de idioma y persistencia del carrito de compras.</p>

                <h4>2. Cookies de Seguridad y Rendimiento</h4>
                <p>Empleamos tokens encriptados de seguridad para proteger la plataforma contra ataques de falsificación de peticiones (CSRF) y mantener sesiones seguras. No utilizamos cookies publicitarias de terceros ni rastreadores entre sitios web.</p>

                <h4>3. Control de Preferencias</h4>
                <p>Puedes administrar o eliminar las cookies almacenadas directamente desde la configuración de tu navegador web en cualquier momento. La deshabilitación de cookies esenciales puede afectar la capacidad de iniciar sesión o procesar pedidos.</p>
            </div>
        `
    },
    section2257: {
        title_en: '18 U.S.C. § 2257 Record-Keeping Exemption & Compliance Statement',
        title_es: 'Declaración de Cumplimiento y Exención 18 U.S.C. § 2257',
        content_en: `
            <div style="display:flex; flex-direction:column; gap:16px;">
                <h4>Official Compliance & Record Exemption Statement</h4>
                <p>UNDR operates primarily as an online peer-to-peer marketplace for exclusive pre-worn intimate apparel, lingerie, and digital fan engagement. To the extent that imagery or video content is posted on the platform by independent Creators, all such participants are verified adults.</p>

                <h4>Mandatory Age & Identity Verification Protocol</h4>
                <p>Pursuant to 18 U.S.C. § 2257, 18 U.S.C. § 2257A, and 28 C.F.R. Part 75, UNDR mandates that all Sellers ("Creators") complete comprehensive identity verification before publishing any content or offering products. Verification requires submission of a valid, unexpired government-issued photo ID (passport, driver license, or national ID card) and biometric facial matching.</p>

                <div style="background:var(--secondary-bg); padding:16px; border-radius:10px; border:1px solid var(--border-color); margin:8px 0;">
                    <strong style="color:var(--accent-hover);">Designated Custodian of Records:</strong><br>
                    UNDR Compliance & Legal Department<br>
                    Email: <strong>compliance-2257@undr-app.com</strong>
                </div>

                <p>All required records, identification proofs, and verification hashes are securely stored and maintained by the Custodian of Records in compliance with federal record-keeping standards.</p>
            </div>
        `,
        content_es: `
            <div style="display:flex; flex-direction:column; gap:16px;">
                <h4>Declaración Oficial de Cumplimiento y Registro</h4>
                <p>UNDR opera como una plataforma y marketplace entre usuarios para la compraventa de ropa interior exclusiva usada y contenido de fans. En lo relativo a imágenes o materiales publicados en el sitio por Creadoras independientes, se garantiza que la totalidad de los participantes son personas adultas verificadas.</p>

                <h4>Protocolo Obligatorio de Verificación de Edad e Identidad</h4>
                <p>De conformidad con las disposiciones de la ley 18 U.S.C. § 2257, 18 U.S.C. § 2257A y 28 C.F.R. Parte 75, UNDR exige de forma obligatoria que todas las Vendedoras ("Creadoras") completen un proceso de verificación de identidad antes de publicar contenido o productos. La verificación requiere la presentación de una identificación oficial con fotografía (pasaporte, licencia o documento de identidad) y validación biométrica facial.</p>

                <div style="background:var(--secondary-bg); padding:16px; border-radius:10px; border:1px solid var(--border-color); margin:8px 0;">
                    <strong style="color:var(--accent-hover);">Designación del Custodio de Registros:</strong><br>
                    Departamento Legal y de Cumplimiento de UNDR<br>
                    Email de Contacto: <strong>compliance-2257@undr-app.com</strong>
                </div>

                <p>Todos los registros exigidos, comprobantes de identidad y certificados de verificación son custodiados y mantenidos por el Custodio de Registros conforme a los estándares legales exigidos.</p>
            </div>
        `
    },
    refunds: {
        title_en: 'Refunds & Escrow Dispute Resolution Policy',
        title_es: 'Política de Reembolsos y Resolución de Disputas en Escrow',
        content_en: `
            <div style="display:flex; flex-direction:column; gap:16px;">
                <h4>1. Buyer Protection & Escrow Guarantee</h4>
                <p>All funds paid by Buyers are placed in UNDR Escrow upon order placement. Escrow funds are held securely and are not released to the Seller until tracking confirms delivery or the inspection window expires without dispute.</p>

                <h4>2. Mandatory Seller Dispatch Window (24 Hours)</h4>
                <p>Sellers are required to dispatch orders and provide a valid postal tracking code within <strong>24 hours</strong> of purchase. If a Seller fails to submit valid tracking within 24 hours, the Buyer may request an immediate 100% refund of the purchase price.</p>

                <h4>3. Valid Grounds for Opening a Dispute</h4>
                <p>A Buyer may file a dispute within 14 days of shipment under the following verified conditions:</p>
                <ul>
                    <li><strong>Non-Delivery / Package Loss:</strong> Postal tracking confirms the package was lost or returned to sender.</li>
                    <li><strong>Incorrect or Damaged Item:</strong> The received item differs materially from the listing photos or specifications.</li>
                    <li><strong>Non-Compliance with Wear Duration:</strong> Breach of agreed custom specifications.</li>
                </ul>

                <h4>4. Dispute Review & Resolution Execution</h4>
                <p>Upon dispute initiation, Escrow funds remain frozen. UNDR Support reviews tracking telemetry, seller dispatch logs, and buyer evidence. Approved disputes result in a 100% refund returned to the Buyer's balance or original payment method within 3-5 business days.</p>
            </div>
        `,
        content_es: `
            <div style="display:flex; flex-direction:column; gap:16px;">
                <h4>1. Protección al Comprador y Garantía de Escrow</h4>
                <p>Todos los pagos realizados por los Compradores son retenidos en el sistema Escrow de UNDR al realizar la orden. Los fondos permanecen protegidos y no se liberan a la Vendedora hasta que la paquetería confirme la entrega o venza el plazo de inspección sin reclamos.</p>

                <h4>2. Plazo Obligatorio de Envío de la Vendedora (24 Horas)</h4>
                <p>Las Vendedoras tienen la obligación de realizar el envío y proporcionar un código de rastreo postal válido en un plazo máximo de <strong>24 horas</strong> tras la compra. Si la vendedora no proporciona la guía en 24 horas, el Comprador puede solicitar la cancelación inmediata y el reembolso del 100% de su dinero.</p>

                <h4>3. Causales Válidas para Abrir una Disputa</h4>
                <p>El Comprador puede abrir una disputa durante los 14 días posteriores al envío bajo los siguientes supuestos verificables:</p>
                <ul>
                    <li><strong>Falta de Entrega o Extravío:</strong> El rastreo de la paquetería confirma que el paquete se perdió o fue devuelto.</li>
                    <li><strong>Producto Incorrecto o Dañado:</strong> El producto recibido difiere significativamente de las fotos o descripción.</li>
                    <li><strong>Incumplimiento de Especificaciones:</strong> No se respetó el tiempo de uso o personalización acordada.</li>
                </ul>

                <h4>4. Proceso de Revisión y Ejecución de Reembolso</h4>
                <p>Al abrir la disputa, los fondos en Escrow quedan congelados. El equipo de soporte de UNDR analiza el historial de envío y las pruebas presentadas. Las disputas resolutivas a favor del comprador generan un reembolso del 100% acreditado a su saldo o método de pago original en un lapso de 3 a 5 días hábiles.</p>
            </div>
        `
    }
};

// 📄 Legal Document Modal Viewer Handler

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

// 🍪 Cookie Consent Banner Engine

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

// Expose globally
window.undrLegal = {
    openLegalModal,
    closeLegalModal,
    initCookieConsentBanner,
    acceptCookieConsent
};

setTimeout(initCookieConsentBanner, 800);

console.log('%c⚖️ UNDR Formal Legal Pages & 18 U.S.C. § 2257 Compliance Engine loaded', 'color: #3b82f6; font-weight: bold; font-size: 13px;');
