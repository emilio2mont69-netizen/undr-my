/**
 * @fileoverview UNDR PWA Installation & Add to Home Screen (A2HS) Engine
 */

let deferredInstallPrompt = null;

export function initPWAInstaller() {
    // 1. Register Service Worker if not registered
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then((reg) => {
                console.log('[PWA Engine] Service Worker active with scope:', reg.scope);
            }).catch((err) => {
                console.warn('[PWA Engine] Service Worker registration failed:', err);
            });
        });
    }

    // 2. Listen for Chrome / Android beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredInstallPrompt = e;
        showInstallBanner();
    });

    // 3. Detect iOS Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

    if (isIOS && !isStandalone) {
        const hasShownIos = localStorage.getItem('undr_ios_pwa_prompt_shown');
        if (!hasShownIos) {
            setTimeout(showIOSInstallBanner, 3000);
        }
    }
}

export function triggerPWAInstall() {
    if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('[PWA Engine] User accepted PWA install prompt');
                hideInstallBanner();
            }
            deferredInstallPrompt = null;
        });
    } else {
        const lang = localStorage.getItem('undr_lang') || 'en';
        alert(lang === 'es' ? 
            'Para instalar UNDR: Abre las opciones de tu navegador y selecciona "Añadir a la pantalla de inicio".' : 
            'To install UNDR: Open your browser menu and tap "Add to Home Screen".');
    }
}

function showInstallBanner() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) banner.style.display = 'flex';
}

export function hideInstallBanner() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) banner.style.display = 'none';
}

function showIOSInstallBanner() {
    const lang = localStorage.getItem('undr_lang') || 'en';
    const msg = lang === 'es' ? 
        '📲 Instala UNDR en tu iPhone: Pulsa el botón "Compartir" en Safari y selecciona "Añadir a pantalla de inicio".' : 
        '📲 Install UNDR on your iPhone: Tap the Share button in Safari and select "Add to Home Screen".';
    
    if (window.showToast) {
        window.showToast(msg);
    }
    localStorage.setItem('undr_ios_pwa_prompt_shown', 'true');
}

// Expose globally
window.undrPWA = {
    initPWAInstaller,
    triggerPWAInstall,
    hideInstallBanner
};

initPWAInstaller();

console.log('%c📱 UNDR PWA Add to Home Screen Engine loaded', 'color: #ff4d6d; font-weight: bold; font-size: 13px;');
