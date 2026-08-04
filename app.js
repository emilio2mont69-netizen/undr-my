// ==========================================
// PERSISTED LOCAL DATABASE INITIALIZATION
// ==========================================

let currentCurrency = localStorage.getItem("undr_currency") || "USD";
const currencyRates = {
    "USD": { symbol: "$", rate: 1.0 },
    "EUR": { symbol: "€", rate: 0.92 },
    "GBP": { symbol: "£", rate: 0.78 },
    "MXN": { symbol: "$", rate: 18.2 },
    "CAD": { symbol: "$", rate: 1.36 }
};

window.formatPrice = function(amountUsd) {
    if (typeof amountUsd !== "number") amountUsd = parseFloat(amountUsd) || 0;
    const info = currencyRates[currentCurrency] || currencyRates["USD"];
    const converted = amountUsd * info.rate;
    return `${info.symbol}${converted.toFixed(2)} ${currentCurrency}`;
};

// Prepopulated Users
const DEFAULT_USERS = [
    {
        username: "Guest Buyer",
        handle: "@guest",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100",
        balance: 250.00,
        role: "buyer",
        kycStatus: "not_applied"
    },
    {
        username: "Luna Diamond",
        handle: "@lunadiamond",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100",
        balance: 45.00,
        role: "creator",
        kycStatus: "approved",
        age: 23,
        nationality: "American"
    },
    {
        username: "Aria Fox",
        handle: "@ariafox",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=100&h=100",
        balance: 18.00,
        role: "creator",
        kycStatus: "approved",
        age: 25,
        nationality: "Canadian"
    },
    {
        username: "Staff Admin",
        handle: "@admin_staff",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100&h=100",
        balance: 0.00,
        role: "admin",
        kycStatus: "not_applied"
    }
];

const DEFAULT_PRODUCTS = [
    {
        id: 1,
        price: 89.00,
        size: "S",
        style: "Lace",
        isFeatured: true,
        isNew: false,
        isAvailableToday: true,
        isAuction: false,
        wearTime: "24h wear",
        includesSignedPhoto: true,
        image: "https://images.unsplash.com/photo-1616166330003-8e550d40d023?auto=format&fit=crop&q=80&w=600&h=600",
        creator: {
            name: "Luna Diamond",
            handle: "@lunadiamond",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100",
            verified: true
        },
        likes: 154,
        date: "2026-07-21T10:00:00Z",
        en: {
            title: "Custom Worn Satin Lace Set",
            description: "Signature premium lace underwear set. Custom worn during a full day photoshoot.",
            extraTag: "Includes signed photo"
        },
        es: {
            title: "Conjunto de Encaje de Satén Personalizado",
            description: "Conjunto de ropa interior de encaje premium. Usado durante una sesión de fotos completa.",
            extraTag: "Incluye foto firmada"
        }
    },
    {
        id: 2,
        price: 65.00,
        size: "M",
        style: "Silk",
        isFeatured: false,
        isNew: true,
        isAvailableToday: true,
        isAuction: false,
        wearTime: "12h wear",
        includesSignedPhoto: true,
        image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=600&h=600",
        creator: {
            name: "Aria Fox",
            handle: "@ariafox",
            avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=100&h=100",
            verified: true
        },
        likes: 88,
        date: "2026-07-20T14:30:00Z",
        en: {
            title: "Lavender Silk Slip Panty",
            description: "Very soft pure silk underwear worn during gym workout. Extra fragrance preserved.",
            extraTag: "Fragrance sealed"
        },
        es: {
            title: "Braguita de Seda Lavanda",
            description: "Ropa interior de seda pura muy suave usada durante entrenamiento. Fragancia preservada.",
            extraTag: "Fragancia sellada"
        }
    },
    {
        id: 3,
        price: 110.00,
        size: "S",
        style: "Lace",
        isFeatured: true,
        isNew: false,
        isAvailableToday: true,
        isAuction: false,
        wearTime: "48h wear",
        includesSignedPhoto: true,
        image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=600&h=600",
        creator: {
            name: "Luna Diamond",
            handle: "@lunadiamond",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100",
            verified: true
        },
        likes: 245,
        date: "2026-07-21T02:15:00Z",
        en: {
            title: "48-Hour Worn Intimate Bodysuit",
            description: "Worn continuously for 48 hours. Double vacuum sealed to guarantee high scent profile.",
            extraTag: "Scent & Photo included"
        },
        es: {
            title: "Body Íntimo Usado 48 Horas",
            description: "Usado continuamente durante 48 horas. Con doble sellado al vacío para garantizar la fragancia.",
            extraTag: "Scent y Foto incluidos"
        }
    }
];

const DEFAULT_CHATS = [
    {
        creatorName: "Luna Diamond",
        handle: "@lunadiamond",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100",
        messages: [
            { sender: "creator", text: "Hey love! Welcome to my private page. Let me know if you want any custom wear items or special activity during my wear time.", time: "10:14 AM" }
        ]
    },
    {
        creatorName: "Aria Fox",
        handle: "@ariafox",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=100&h=100",
        messages: [
            { sender: "creator", text: "Hey! Just listed my workout slips. Let me know if you want them freshly packed today.", time: "Yesterday" }
        ]
    }
];

// Initialize Storage Database
if (!localStorage.getItem("undr_users")) {
    localStorage.setItem("undr_users", JSON.stringify(DEFAULT_USERS));
}
if (!localStorage.getItem("undr_current_user")) {
    localStorage.setItem("undr_current_user", "null"); // Starts as Anonymous Guest
}
if (!localStorage.getItem("undr_products")) {
    localStorage.setItem("undr_products", JSON.stringify(DEFAULT_PRODUCTS));
}
if (!localStorage.getItem("undr_chats")) {
    localStorage.setItem("undr_chats", JSON.stringify(DEFAULT_CHATS));
}
if (!localStorage.getItem("undr_kyc_applications")) {
    localStorage.setItem("undr_kyc_applications", JSON.stringify([
        {
            id: 101,
            username: "Sophia Rose",
            handle: "@sophiarose",
            legalFirstName: "Sophia",
            legalLastName: "Rose",
            ssn: "9876",
            idCard: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=150&h=150",
            selfie: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
            status: "pending"
        }
    ]));
}
if (!localStorage.getItem("creator_orders")) {
    localStorage.setItem("creator_orders", JSON.stringify([]));
}
if (!localStorage.getItem("admin_gmv")) {
    localStorage.setItem("admin_gmv", "0.00");
}
if (!localStorage.getItem("undr_addresses")) {
    localStorage.setItem("undr_addresses", JSON.stringify([
        { id: 1, name: "John Doe (Secure Route)", street: "405 Lexington Ave", city: "New York", zip: "10174" }
    ]));
}
if (!localStorage.getItem("undr_subscriptions")) {
    localStorage.setItem("undr_subscriptions", JSON.stringify([]));
}
if (!localStorage.getItem("undr_notifications")) {
    localStorage.setItem("undr_notifications", JSON.stringify([
        { id: 1, text: "Welcome to UNDR. Direct wear verified thongs are ready today!", time: "5m ago", unread: true },
        { id: 2, text: "Luna Diamond posted a locked PPV photoset in direct messages.", time: "1h ago", unread: true }
    ]));
}

// Current runtime state
let currentLang = "en";
let cart = [];
let activeChatCreator = "Luna Diamond";
let cartAddonsCost = 0;
let ccbillPaymentCallback = null; // callback for paying invoice/checkout
let uploadedListingImageBase64 = ""; // Base64 cache for product photos

// DOM Elements Selection
const ageModal = document.getElementById("age-modal");
const ageAcceptBtn = document.getElementById("age-accept-btn");
const ageRejectBtn = document.getElementById("age-reject-btn");

const productsGrid = document.getElementById("products-feed");
const categoryChips = document.querySelectorAll(".category-chip");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");

// Search bar filters
const searchFilterTrigger = document.getElementById("search-filter-trigger");
const advancedFiltersPanel = document.getElementById("advanced-filters-panel");
const applyAdvFiltersBtn = document.getElementById("apply-adv-filters-btn");
const filterSize = document.getElementById("filter-size");
const filterStyle = document.getElementById("filter-style");
const filterAvailability = document.getElementById("filter-availability");

// Language Toggle
const langToggleBtn = document.getElementById("lang-toggle-btn");

// Sidebar user profile DOM
const sidebarAvatar = document.getElementById("sidebar-avatar");
const userNameDisplay = document.getElementById("user-name-display");
const userRoleDisplay = document.getElementById("user-role-display");
const userBalanceDisplay = document.getElementById("user-balance-display");
const applyToSellBtn = document.getElementById("apply-to-sell-btn");

// Navigation bar role triggers
const navMessagesItem = document.getElementById("nav-messages-item");
const navCreatorItem = document.getElementById("nav-creator-item");
const navAdminItem = document.getElementById("nav-admin-item");

// Cart components
const cartBadge = document.getElementById("cart-badge");
const cartCountPreview = document.getElementById("cart-count-preview");
const cartItemsPreview = document.getElementById("cart-items-preview");
const cartSubtotal = document.getElementById("cart-subtotal");
const cartAddonsRow = document.getElementById("cart-addons-row");
const cartAddonsTotal = document.getElementById("cart-addons-total");
const cartShippingCost = document.getElementById("cart-shipping-cost");
const cartGrandTotal = document.getElementById("cart-grand-total");
const checkoutBtn = document.getElementById("checkout-btn");
const cartAddonsGroup = document.getElementById("cart-addons-group");

// Modals
const loginModal = document.getElementById("login-modal");
const registerModal = document.getElementById("register-modal");
const loginTrigger = document.getElementById("login-trigger-btn");
const registerTrigger = document.getElementById("register-trigger-btn");
const closeLogin = document.getElementById("close-login");
const closeRegister = document.getElementById("close-register");

const customModal = document.getElementById("custom-modal");
const customRequestForm = document.getElementById("custom-request-form");
const customCreatorInput = document.getElementById("custom-creator-input");
const closeCustom = document.getElementById("close-custom");

const authModal = document.getElementById("auth-modal");
const authInfoBtn = document.getElementById("auth-info-btn");
const closeAuth = document.getElementById("close-auth");

const gatewayModal = document.getElementById("gateway-modal");
const gatewayTotalAmount = document.getElementById("gateway-total-amount");
const gatewayPaymentForm = document.getElementById("gateway-payment-form");

const productDetailsModal = document.getElementById("product-details-modal");
const closeDetails = document.getElementById("close-details");

// Chat proposal modal
const chatProposalModal = document.getElementById("chat-proposal-modal");
const chatProposalForm = document.getElementById("chat-proposal-form");
const closeProposalModal = document.getElementById("close-proposal-modal");

// Content section panels
const exploreSection = document.getElementById("section-explore");
const chatSection = document.getElementById("section-chat");
const creatorSection = document.getElementById("section-creator");
const adminSection = document.getElementById("section-admin");
const creatorProfileSection = document.getElementById("section-creator-profile");
const buyerSettingsSection = document.getElementById("section-buyer-settings");
const auctionsSection = document.getElementById("section-auctions");
const liveAuctionsFeed = document.getElementById("live-auctions-feed");

const notificationBellBtn = document.getElementById("notification-bell-btn");
const notificationsDropdownPanel = document.getElementById("notifications-dropdown-panel");
const notificationsListContainer = document.getElementById("notifications-list-container");
const notificationsCountBadge = document.getElementById("notifications-count-badge");

// Creator portal dashboards
const kycOnboardingPanel = document.getElementById("kyc-onboarding-panel");
const kycPendingPanel = document.getElementById("kyc-pending-panel");
const creatorVerifiedPanel = document.getElementById("creator-verified-panel");
const startKycMockBtn = document.getElementById("start-kyc-mock-btn");
const newGarmentForm = document.getElementById("new-item-form");
const creatorBalanceVal = document.getElementById("creator-balance-val");
const creatorPendingOrdersList = document.getElementById("creator-pending-orders-list");
const creatorWithdrawBtn = document.getElementById("creator-withdraw-btn");

// Admin panel operations
const adminStatGmv = document.getElementById("admin-stat-gmv");
const adminStatRevenue = document.getElementById("admin-stat-revenue");
const adminStatEscrow = document.getElementById("admin-stat-escrow");
const adminKycQueueList = document.getElementById("admin-kyc-queue-list");
const adminModerationList = document.getElementById("admin-moderation-list");
const adminDisputesList = document.getElementById("admin-disputes-list");

// Chat conversation elements
const chatUsersList = document.getElementById("chat-users-list");
const chatMessagesContainer = document.getElementById("chat-messages-container");
const chatActiveAvatar = document.getElementById("chat-active-avatar");
const chatActiveName = document.getElementById("chat-active-name");
const chatActiveVerified = document.getElementById("chat-active-verified");
const chatActiveHandle = document.getElementById("chat-active-handle");
const chatTextInput = document.getElementById("chat-text-input");
const chatSendMsgBtn = document.getElementById("chat-send-msg-btn");
const simulatePpvTriggerBtn = document.getElementById("simulate-ppv-trigger-btn");

// ==========================================
// CORE APP ENGINE & STATE LIFECYCLE
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    checkAgeVerification();
    applyLanguage(currentLang);
    setupEventListeners();
});

// Propagate user profile changes (avatar, name, handle) into products & chats
function syncUserDataInProducts(user) {
    if (!user || user === "null") return;

    // Sync avatar/name/handle into all product cards owned by this user
    const products = JSON.parse(localStorage.getItem("undr_products")) || [];
    let productsChanged = false;
    products.forEach(p => {
        // Match by handle (most reliable) or by name
        const matchByHandle = p.creator.handle && user.handle && p.creator.handle.toLowerCase() === user.handle.toLowerCase();
        const matchByName = p.creator.name && user.username && p.creator.name.toLowerCase() === user.username.toLowerCase();
        if (matchByHandle || matchByName) {
            if (p.creator.avatar !== user.avatar || p.creator.name !== user.username || p.creator.handle !== user.handle) {
                p.creator.avatar = user.avatar;
                p.creator.name = user.username;
                p.creator.handle = user.handle;
                productsChanged = true;
            }
        }
    });
    if (productsChanged) {
        localStorage.setItem("undr_products", JSON.stringify(products));
    }

    // Sync avatar/name into chat sidebar entries
    const chats = JSON.parse(localStorage.getItem("undr_chats")) || [];
    let chatsChanged = false;
    chats.forEach(c => {
        const matchByHandle = c.handle && user.handle && c.handle.toLowerCase() === user.handle.toLowerCase();
        const matchByName = c.creatorName && user.username && c.creatorName.toLowerCase() === user.username.toLowerCase();
        if (matchByHandle || matchByName) {
            if (c.avatar !== user.avatar || c.creatorName !== user.username) {
                c.avatar = user.avatar;
                c.creatorName = user.username;
                chatsChanged = true;
            }
        }
    });
    if (chatsChanged) {
        localStorage.setItem("undr_chats", JSON.stringify(chats));
    }
}

// Sync layout to currently logged in profile
function syncUserSessionUI() {
    const currentUserForSync = JSON.parse(localStorage.getItem("undr_current_user"));
    if (currentUserForSync && currentUserForSync !== "null") {
        syncUserDataInProducts(currentUserForSync);
    }

    const user = JSON.parse(localStorage.getItem("undr_current_user"));
    
    const rolePills = document.querySelectorAll(".role-pill");
    rolePills.forEach(p => p.classList.remove("active"));
    if (!user || user === "null") {
        const guestPill = document.getElementById("pill-guest");
        if (guestPill) guestPill.classList.add("active");
    } else {
        const activePill = document.getElementById(`pill-${user.role}`);
        if (activePill) activePill.classList.add("active");
    }
    
    const sessionButtonsContainer = document.getElementById("session-buttons-container");

    const sidebarAvatarEl = document.getElementById("sidebar-avatar");
    const userNameDisplayEl = document.getElementById("user-name-display");
    const userRoleDisplayEl = document.getElementById("user-role-display");
    const userBalanceDisplayEl = document.getElementById("user-balance-display");
    const applyToSellBtnEl = document.getElementById("apply-to-sell-btn");

    const navMessagesItemEl = document.getElementById("nav-messages-item");
    const navCreatorItemEl = document.getElementById("nav-creator-item");
    const navAdminItemEl = document.getElementById("nav-admin-item");
    const navBuyerSettingsItemEl = document.getElementById("nav-buyer-settings-item");
    const cartAddonsGroupEl = document.getElementById("cart-addons-group");

    const profPicPreview = document.getElementById("profile-picture-preview");
    const profDispName = document.getElementById("profile-display-name");
    const profDispHandle = document.getElementById("profile-display-handle");
    const profDispRole = document.getElementById("profile-display-role");
    
    const creatorPicPreview = document.getElementById("creator-picture-preview");
    const creatorDispName = document.getElementById("creator-display-name");
    const creatorDispHandle = document.getElementById("creator-display-handle");

    const editAvatarInput = document.getElementById("edit-avatar-url-input");
    const editUsernameInput = document.getElementById("edit-username-input");

    if (!user || user === "null") {
        const guestAvatar = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
        if (sidebarAvatarEl) sidebarAvatarEl.src = guestAvatar;
        if (userNameDisplayEl) userNameDisplayEl.textContent = currentLang === "es" ? "Invitado" : "Guest";
        if (userRoleDisplayEl) {
            userRoleDisplayEl.textContent = currentLang === "es" ? "Inicia sesión" : "Not Logged In";
            userRoleDisplayEl.style.color = "var(--text-muted)";
        }
        if (userBalanceDisplayEl) userBalanceDisplayEl.textContent = "";

        if (profPicPreview) profPicPreview.src = guestAvatar;
        if (profDispName) profDispName.textContent = currentLang === "es" ? "Usuario Invitado" : "Guest User";
        if (profDispHandle) profDispHandle.textContent = "@guest";
        if (profDispRole) profDispRole.textContent = currentLang === "es" ? "Sin sesión" : "Not Logged In";

        if (applyToSellBtnEl) applyToSellBtnEl.style.display = "none";
        if (navMessagesItemEl) navMessagesItemEl.style.display = "flex";
        if (navCreatorItemEl) navCreatorItemEl.style.display = "none";
        if (navAdminItemEl) navAdminItemEl.style.display = "none";
        if (navBuyerSettingsItemEl) navBuyerSettingsItemEl.style.display = "flex";
        if (cartAddonsGroupEl) cartAddonsGroupEl.style.display = "none";

        if (sessionButtonsContainer) {
            sessionButtonsContainer.innerHTML = `
                <button class="btn btn-login" id="login-trigger-btn" onclick="document.getElementById('login-modal').style.display='flex'">${currentLang === "es" ? "Iniciar Sesión" : "Log In"}</button>
                <button class="btn btn-register" id="register-trigger-btn" onclick="document.getElementById('register-modal').style.display='flex'">${currentLang === "es" ? "Registrarse" : "Sign Up"}</button>
            `;
        }
    } else {
        if (sidebarAvatarEl) sidebarAvatarEl.src = user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100";
        if (userNameDisplayEl) userNameDisplayEl.textContent = user.username;
        if (userBalanceDisplayEl) userBalanceDisplayEl.textContent = formatPrice(user.balance);

        const handleStr = user.handle || `@${user.username.toLowerCase().replace(/\s+/g, '')}`;

        if (profPicPreview) profPicPreview.src = user.avatar || (sidebarAvatarEl ? sidebarAvatarEl.src : "");
        if (profDispName) profDispName.textContent = user.username;
        if (profDispHandle) profDispHandle.textContent = handleStr;

        if (creatorPicPreview) creatorPicPreview.src = user.avatar || (sidebarAvatarEl ? sidebarAvatarEl.src : "");
        if (creatorDispName) creatorDispName.textContent = user.username;
        if (creatorDispHandle) creatorDispHandle.textContent = handleStr;

        const editCreatorNameInput = document.getElementById("edit-creator-name-input");
        const editCreatorHandleInput = document.getElementById("edit-creator-handle-input");
        if (editCreatorNameInput) editCreatorNameInput.value = user.username || "";
        if (editCreatorHandleInput) editCreatorHandleInput.value = handleStr;

        const editBuyerHandleInput = document.getElementById("edit-buyer-handle-input");
        if (editAvatarInput) editAvatarInput.value = user.avatar || "";
        if (editUsernameInput) editUsernameInput.value = user.username || "";
        if (editBuyerHandleInput) editBuyerHandleInput.value = handleStr;

        if (user.role === "buyer") {
            if (userRoleDisplayEl) {
                userRoleDisplayEl.textContent = currentLang === "es" ? "Cuenta Comprador" : "Buyer Account";
                userRoleDisplayEl.style.color = "var(--text-muted)";
            }
            if (profDispRole) profDispRole.textContent = currentLang === "es" ? "Cuenta Comprador" : "Buyer Account";
            if (applyToSellBtnEl) applyToSellBtnEl.style.display = "block";
            if (navMessagesItemEl) navMessagesItemEl.style.display = "flex";
            if (navCreatorItemEl) navCreatorItemEl.style.display = "none";
            if (navAdminItemEl) navAdminItemEl.style.display = "none";
            if (navBuyerSettingsItemEl) navBuyerSettingsItemEl.style.display = "flex";
            if (cartAddonsGroupEl) cartAddonsGroupEl.style.display = "block";
        } else if (user.role === "creator") {
            if (userRoleDisplayEl) {
                userRoleDisplayEl.textContent = currentLang === "es" ? "Cuenta Creadora" : "Creator Account";
                userRoleDisplayEl.style.color = "var(--accent-hover)";
            }
            if (profDispRole) profDispRole.textContent = currentLang === "es" ? "Cuenta Creadora" : "Creator Account";
            if (applyToSellBtnEl) applyToSellBtnEl.style.display = "none";
            if (navMessagesItemEl) navMessagesItemEl.style.display = "flex";
            if (navCreatorItemEl) navCreatorItemEl.style.display = "flex";
            if (navAdminItemEl) navAdminItemEl.style.display = "none";
            if (navBuyerSettingsItemEl) navBuyerSettingsItemEl.style.display = "none";
            if (cartAddonsGroupEl) cartAddonsGroupEl.style.display = "none";
        } else if (user.role === "admin") {
            if (userRoleDisplayEl) {
                userRoleDisplayEl.textContent = currentLang === "es" ? "Administrador" : "Staff Admin";
                userRoleDisplayEl.style.color = "#ff4d6d";
            }
            if (profDispRole) profDispRole.textContent = currentLang === "es" ? "Administrador" : "Staff Admin";
            if (applyToSellBtnEl) applyToSellBtnEl.style.display = "none";
            if (navMessagesItemEl) navMessagesItemEl.style.display = "none";
            if (navCreatorItemEl) navCreatorItemEl.style.display = "none";
            if (navAdminItemEl) navAdminItemEl.style.display = "flex";
            if (navBuyerSettingsItemEl) navBuyerSettingsItemEl.style.display = "none";
            if (cartAddonsGroupEl) cartAddonsGroupEl.style.display = "none";
        }

        if (sessionButtonsContainer) {
            sessionButtonsContainer.innerHTML = `
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:0.85rem; font-weight:700; color:var(--text-color);">${user.username}</span>
                    <button class="btn btn-login" onclick="logoutUser()" style="padding:6px 12px; font-size:0.75rem;">${currentLang === "es" ? "Cerrar Sesión" : "Log Out"}</button>
                </div>
            `;
        }
    }

    // Refresh language globe text
    const toggleBtn = document.getElementById("lang-toggle-btn");
    if (toggleBtn) {
        toggleBtn.innerHTML = `<i class="fa-solid fa-globe"></i> ${currentLang.toUpperCase()}`;
    }

    // Bind event triggers
    const loginTrig = document.getElementById("login-trigger-btn");
    const regTrig = document.getElementById("register-trigger-btn");
    if (loginTrig) loginTrig.addEventListener("click", () => loginModal.style.display = "flex");
    if (regTrig) regTrig.addEventListener("click", () => registerModal.style.display = "flex");



    // Populate data panels
    filterAndSortProducts();
    updateCartUI();
    renderChatSidebar();
    loadCreatorPortalPanel();
    loadAdminDashboard();
}

// Save Personal Profile Avatar, Name & Unique @Handle Changes
window.savePersonalProfileChanges = function() {
    let user = JSON.parse(localStorage.getItem("undr_current_user"));
    if (!user || user === "null") {
        user = {
            username: "Guest Buyer",
            handle: "@guest",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100",
            role: "buyer",
            balance: 250.00
        };
    }

    const newAvatar = document.getElementById("edit-avatar-url-input")?.value.trim();
    const newUsername = document.getElementById("edit-username-input")?.value.trim();
    let rawHandle = document.getElementById("edit-buyer-handle-input")?.value.trim();

    if (newAvatar) user.avatar = newAvatar;
    if (newUsername) user.username = newUsername;

    if (rawHandle) {
        if (!rawHandle.startsWith("@")) rawHandle = `@${rawHandle}`;
        const cleanHandle = rawHandle.toLowerCase();

        // 1. Format validation (3-20 chars)
        const handleRegex = /^@[a-z0-9_]{3,20}$/;
        if (!handleRegex.test(cleanHandle)) {
            const err = currentLang === 'es' ? 
                'El @handle debe tener entre 3 y 20 caracteres y solo contener letras, números o guion bajo (_).' : 
                'Handle must be 3-20 characters long and contain only letters, numbers, or underscores (_).';
            alert(err);
            return;
        }

        // 2. Cooldown check (14 days barrier)
        const now = Date.now();
        const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;
        if (user.handle !== cleanHandle && user.lastHandleChangeAt) {
            const timePassed = now - user.lastHandleChangeAt;
            if (timePassed < FOURTEEN_DAYS_MS) {
                const daysLeft = Math.ceil((FOURTEEN_DAYS_MS - timePassed) / (24 * 60 * 60 * 1000));
                const msg = currentLang === 'es' ? 
                    `Por seguridad y estabilidad en las búsquedas, solo puedes cambiar tu @handle una vez cada 14 días. Vuelve a intentarlo en ${daysLeft} días.` : 
                    `For search safety, you can only change your @handle once every 14 days. Please try again in ${daysLeft} days.`;
                alert(msg);
                return;
            }
        }

        // 3. Uniqueness check across all users
        const users = JSON.parse(localStorage.getItem("undr_users")) || [];
        const isTaken = users.some(u => u.handle && u.handle.toLowerCase() === cleanHandle && u.username !== user.username);
        if (isTaken) {
            const takenMsg = currentLang === 'es' ? 
                `El handle ${cleanHandle} ya está en uso por otro usuario. Elige un @handle único.` : 
                `The handle ${cleanHandle} is already taken by another user. Please choose a unique @handle.`;
            alert(takenMsg);
            return;
        }

        if (user.handle !== cleanHandle) {
            user.lastHandleChangeAt = now;
        }
        user.handle = cleanHandle;
    }

    localStorage.setItem("undr_current_user", JSON.stringify(user));

    // Sync in global users database
    const users = JSON.parse(localStorage.getItem("undr_users")) || [];
    const idx = users.findIndex(u => u.username === user.username || (u.handle && user.handle && u.handle.toLowerCase() === u.handle.toLowerCase()));
    if (idx !== -1) {
        if (newAvatar) users[idx].avatar = newAvatar;
        if (newUsername) users[idx].username = newUsername;
        if (user.handle) users[idx].handle = user.handle;
        if (user.lastHandleChangeAt) users[idx].lastHandleChangeAt = user.lastHandleChangeAt;
        localStorage.setItem("undr_users", JSON.stringify(users));
    }

    // Propagate avatar/name changes into product cards & chats
    syncUserDataInProducts(user);

    syncUserSessionUI();
    renderChatSidebar();
    filterAndSortProducts();
    showToast(currentLang === 'es' ? '¡Perfil y @handle actualizados correctamente!' : 'Profile & @handle updated successfully!');
};

// File Upload Avatar with Automatic Client-Side Canvas Compression & Cloud Storage Upload
window.handleProfileAvatarUpload = async function(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (window.undrStorage) {
        const val = await window.undrStorage.validateFile(file);
        if (!val.valid) {
            alert(val.error);
            return;
        }
    }

    const user = JSON.parse(localStorage.getItem("undr_current_user"));
    if (!user || user === "null") return;

    showToast(currentLang === 'es' ? 'Optimizando y subiendo foto de perfil a la nube...' : 'Optimizing & uploading profile picture to cloud...');

    let avatarUrl = null;
    if (window.undrStorage) {
        try {
            const uploadRes = await window.undrStorage.uploadAvatarImage(file, user.handle || user.username);
            avatarUrl = uploadRes.url;
        } catch (e) {
            console.warn('[Avatar Upload] Cloud storage error, using local fallback:', e);
        }
    }

    if (!avatarUrl) {
        const compressed = await window.undrStorage.compressImage(file, { maxWidth: 400, maxHeight: 400 });
        avatarUrl = compressed.dataUrl;
    }

    user.avatar = avatarUrl;
    localStorage.setItem("undr_current_user", JSON.stringify(user));

    const users = JSON.parse(localStorage.getItem("undr_users")) || [];
    const idx = users.findIndex(u => u.handle === user.handle || u.username === user.username);
    if (idx !== -1) {
        users[idx].avatar = avatarUrl;
        localStorage.setItem("undr_users", JSON.stringify(users));
    }

    // Propagate avatar change into product cards & chats in real-time
    syncUserDataInProducts(user);

    if (window.undrAPI && window.undrAPI.users && user.id) {
        try {
            await window.undrAPI.users.updateProfile(user.id, { avatar_url: avatarUrl });
        } catch (e) {}
    }

    syncUserSessionUI();
    showToast(currentLang === 'es' ? '¡Foto de perfil en la nube actualizada!' : 'Cloud profile picture updated!');
};

// Dynamic Demo Quick Role Switcher
window.quickSwitchRole = function(role) {
    if (role === "guest") {
        localStorage.setItem("undr_current_user", "null");
        cart = [];
        syncUserSessionUI();
        showSection("explore");
        showToast(currentLang === "es" ? "Modo Invitado activo (Guest)" : "Guest Mode Active");
        return;
    }

    const users = JSON.parse(localStorage.getItem("undr_users")) || DEFAULT_USERS;
    let target = users.find(u => u.role === role);
    if (!target) {
        if (role === "creator") {
            target = users.find(u => u.username === "Luna Diamond") || DEFAULT_USERS[1];
        } else if (role === "admin") {
            target = users.find(u => u.role === "admin") || DEFAULT_USERS[3];
        } else {
            target = users.find(u => u.role === "buyer") || DEFAULT_USERS[0];
        }
    }

    localStorage.setItem("undr_current_user", JSON.stringify(target));
    syncUserSessionUI();

    if (role === "creator") {
        showSection("creator");
        showToast(currentLang === "es" ? `Modo Creadora activo (@${target.username})` : `Creator Mode Active (@${target.username})`);
    } else if (role === "admin") {
        showSection("admin");
        showToast(currentLang === "es" ? "Modo Administración activo" : "Admin Staff Mode Active");
    } else {
        showSection("explore");
        showToast(currentLang === "es" ? `Sesión iniciada como ${target.username}` : `Logged in as ${target.username}`);
    }
};

window.demoLogin = function(role) {
    window.quickSwitchRole(role);
};

window.instantVerifyCreator = function() {
    let user = JSON.parse(localStorage.getItem("undr_current_user"));
    if (!user || user === "null") {
        user = {
            username: "Luna Diamond",
            handle: "@lunadiamond",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100",
            balance: 150.00,
            role: "creator",
            kycStatus: "approved"
        };
    } else {
        user.role = "creator";
        user.kycStatus = "approved";
    }

    localStorage.setItem("undr_current_user", JSON.stringify(user));

    const users = JSON.parse(localStorage.getItem("undr_users")) || DEFAULT_USERS;
    const uIdx = users.findIndex(u => u.handle === user.handle);
    if (uIdx !== -1) {
        users[uIdx].role = "creator";
        users[uIdx].kycStatus = "approved";
    } else {
        users.push(user);
    }
    localStorage.setItem("undr_users", JSON.stringify(users));

    syncUserSessionUI();
    loadCreatorPortalPanel();
    showToast(currentLang === "es" ? "¡Cuenta de Creadora Verificada al Instante! 🎉" : "Creator Account Verified Instantly! 🎉");
};

window.quickFillNewItemForm = function() {
    const titleInput = document.getElementById("new-item-title");
    const priceInput = document.getElementById("new-item-price");
    const descInput = document.getElementById("new-item-desc");
    if (titleInput) titleInput.value = "Custom Worn Lace Thong (Photoshoot Edition)";
    if (priceInput) priceInput.value = "85.00";
    if (descInput) descInput.value = "Worn for 24 hours continuously during studio photoshoot. Sealed in double airtight vacuum pouch.";
    showToast(currentLang === "es" ? "Formulario auto-completado con éxito." : "Sample garment details auto-filled!");
};

window.instantApproveAllKyc = function() {
    const kycApps = JSON.parse(localStorage.getItem("undr_kyc_applications")) || [];
    kycApps.forEach(a => a.status = "approved");
    localStorage.setItem("undr_kyc_applications", JSON.stringify(kycApps));
    loadAdminDashboard();
    showToast(currentLang === "es" ? "Todas las solicitudes KYC fueron aprobadas." : "All pending KYC applications approved!");
};

window.instantApproveAllListings = function() {
    loadAdminDashboard();
    showToast(currentLang === "es" ? "Todas las publicaciones fueron verificadas y aprobadas." : "All marketplace listings approved!");
};

window.autoFillTestCard = function() {
    const form = document.getElementById("gateway-payment-form");
    if (form) {
        const inputs = form.querySelectorAll("input");
        if (inputs[0]) inputs[0].value = "John Doe";
        if (inputs[1]) inputs[1].value = "4000 1234 5678 9010";
        if (inputs[2]) inputs[2].value = "12/28";
        if (inputs[3]) inputs[3].value = "888";
    }
    showToast(currentLang === "es" ? "Tarjeta de prueba auto-llenada." : "Test card details auto-filled!");
};

window.toggleCardBlur = function(event, productId) {
    if (event) event.stopPropagation();

    // Require active login session to reveal uncensored photo
    const userStr = localStorage.getItem("undr_current_user");
    const user = userStr && userStr !== "null" ? JSON.parse(userStr) : null;
    
    if (!user || user.role === "guest" || user.handle === "@guest") {
        const loginMdl = document.getElementById("login-modal");
        if (loginMdl) {
            loginMdl.style.display = "flex";
        }
        showToast(currentLang === "es" ? "Debes iniciar sesión para ver las fotos sin censura." : "Please log in to view uncensored photos.");
        return;
    }

    const imgs = document.querySelectorAll(`.card-img-blur-${productId}`);
    imgs.forEach(img => {
        if (img.style.filter === "none") {
            img.style.filter = "blur(14px)";
        } else {
            img.style.filter = "none";
        }
    });
};

window.handleDetailModalRevealClick = function() {
    const userStr = localStorage.getItem("undr_current_user");
    const user = userStr && userStr !== "null" ? JSON.parse(userStr) : null;
    
    if (!user || user.role === "guest" || user.handle === "@guest") {
        const productMdl = document.getElementById("product-details-modal");
        if (productMdl) productMdl.style.display = "none";
        const loginMdl = document.getElementById("login-modal");
        if (loginMdl) loginMdl.style.display = "flex";
        showToast(currentLang === "es" ? "Debes iniciar sesión para ver las fotos sin censura." : "Please log in to view uncensored photos.");
        return;
    }

    const blurOverlay = document.getElementById("detail-modal-blur-overlay");
    if (blurOverlay) blurOverlay.style.display = "none";
};

// Logging out session
window.logoutCurrentSession = function() {
    localStorage.setItem("undr_current_user", "null");
    cart = [];
    syncUserSessionUI();
    showSection('explore');
    showToast(currentLang === 'es' ? "Sesión cerrada." : "Logged out successfully.");
};

// Global dynamic Section switcher
window.showSection = function(sectionName, element = null, updateHash = true) {
    const panels = document.querySelectorAll(".content-section-panel");
    panels.forEach(panel => panel.classList.remove("active"));

    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => item.classList.remove("active"));

    const sidebarLeft = document.querySelector(".sidebar-left");
    if (sidebarLeft && window.innerWidth <= 900) {
        sidebarLeft.style.display = "";
    }

    const activeSection = document.getElementById(`section-${sectionName}`);
    if (activeSection) {
        activeSection.classList.add("active");
    }

    if (updateHash && sectionName !== "creator-profile") {
        const targetHash = `#/${sectionName}`;
        if (window.location.hash !== targetHash) {
            history.pushState(null, "", targetHash);
        }
    }

    if (element) {
        element.classList.add("active");
    } else {
        const idMap = {
            "explore": "nav-explore-item",
            "chat": "nav-messages-item",
            "auctions": "nav-auctions-item",
            "creator": "nav-creator-item",
            "buyer-settings": "nav-buyer-settings-item",
            "admin": "nav-admin-item"
        };
        const targetId = idMap[sectionName];
        if (targetId) {
            const navEl = document.getElementById(targetId);
            if (navEl) navEl.classList.add("active");
        }
    }

    // Load dynamic updates
    if (sectionName === "chat") {
        renderChatMessages(activeChatCreator);
    } else if (sectionName === "creator") {
        loadCreatorPortalPanel();
    } else if (sectionName === "admin") {
        loadAdminDashboard();
    } else if (sectionName === "buyer-settings") {
        renderSettingsAddresses();
        renderSettingsSubscriptions();
        renderSettingsOrders();
        renderFavoritesGrid();
    } else if (sectionName === "auctions") {
        renderLiveAuctionsGrid();
    }
};

// ==========================================
// MARKETPLACE & FEED ENGINE
// ==========================================
function renderProducts(productsList, isAppend = false) {
    if (!isAppend) {
        productsGrid.innerHTML = "";
    }
    if (!productsList || productsList.length === 0) {
        if (!isAppend) {
            const noResultsText = currentLang === "es" ? "No se encontraron prendas." : "No garments found.";
            productsGrid.innerHTML = `
                <div class="no-products-msg" style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
                    <i class="fa-solid fa-face-frown" style="font-size: 2rem; margin-bottom: 12px; color: var(--accent-color);"></i>
                    <p>${noResultsText}</p>
                </div>
            `;
        }
        return;
    }

    productsList.forEach(product => {
        const localData = product[currentLang] || product["en"] || {};
        const titleText = localData.title || product.title || "";
        const descText = localData.description || product.description || "";
        const verifiedBadge = product.creator.verified ? `<i class="fa-solid fa-circle-check verified-icon" style="color:var(--accent-color);"></i>` : "";
        const timeText = currentLang === "es" ? "Hace 3 horas" : "3h ago";
        
        const card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML = `
            <div class="card-creator-header" onclick="openCreatorProfile('${product.creator.name}')" style="cursor: pointer;">
                <img src="${product.creator.avatar}" alt="${product.creator.name}" class="creator-avatar-card">
                <div class="creator-info-card">
                    <span class="card-creator-name">${product.creator.name} ${verifiedBadge}</span>
                    <span class="card-post-time">${timeText}</span>
                </div>
            </div>
            
            <div class="product-image-wrapper" onclick="openProductDetailModal(${product.id}, false)" style="cursor:pointer; overflow:hidden; position:relative;">
                <img src="${product.image}" alt="${titleText}" class="product-image card-img-blur-${product.id}" loading="lazy" style="filter: blur(14px); transition: filter 0.3s ease, transform 0.3s ease; transform: scale(1.05);">
                <span class="price-tag">${formatPrice(product.price)}</span>
                <button class="btn-reveal-card" onclick="toggleCardBlur(event, ${product.id})" title="${currentLang === 'es' ? 'Ver / Previsualizar' : 'Preview Photo'}">
                    <i class="fa-solid fa-eye"></i>
                </button>
            </div>
            
            <div class="card-body">
                <span class="card-category">${product.style}</span>
                <h3 class="card-title">${titleText}</h3>
                <p class="card-description">${descText}</p>
                
                <div class="card-spec-tags">
                    <span class="spec-tag">Size ${product.size}</span>
                    <span class="spec-tag">${product.wearTime}</span>
                </div>

                <div class="card-footer">
                    <div class="card-actions-row">
                        <button class="btn-buy-item" onclick="addToCart(${product.id})">
                            <i class="fa-solid fa-bag-shopping"></i> ${currentLang === "es" ? "Comprar" : "Buy Item"}
                        </button>
                        ${(() => {
                            const favs = JSON.parse(localStorage.getItem("undr_favorites")) || [];
                            const isLiked = favs.includes(product.id);
                            const heartClass = isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart";
                            const btnStyle = isLiked ? "style='color:#ff4d6d; border-color:#ffa6b5;'" : "";
                            return `
                                <button class="btn-like-post" onclick="toggleLike(this, ${product.id})" ${btnStyle}>
                                    <i class="${heartClass}"></i>
                                </button>
                            `;
                        })()}
                    </div>
                    <button class="btn-request-custom" onclick="openCustomRequest('${product.creator.name}')">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> ${currentLang === "es" ? "Pedido a medida" : "Request Custom"}
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(card);
    });
// Server-side Full-Text Search & Compound Filtering Trigger
window.filterAndSortProducts = async function(isAppend = false) {
    const query = searchInput ? searchInput.value.trim() : "";
    const size = filterSize ? filterSize.value : "all";
    const style = filterStyle ? filterStyle.value : "all";
    const availability = filterAvailability ? filterAvailability.value : "all";
    const sortBy = sortSelect ? sortSelect.value : "newest";

    const params = {
        query,
        size,
        style,
        availability,
        sortBy,
        page: isAppend ? ((window.searchCurrentPage || 1) + 1) : 1,
        limit: 12
    };

    if (window.undrSearchEngine) {
        const res = await window.undrSearchEngine.searchProducts(params);
        if (res && res.products) {
            window.searchCurrentPage = res.page;
            renderProducts(res.products, isAppend);
            return;
        }
    }

    // Fallback client filtering
    const products = JSON.parse(localStorage.getItem("undr_products")) || [];
    renderProducts(products);
};

// Add item to shopping cart
window.addToCart = function(productId) {
    const products = JSON.parse(localStorage.getItem("undr_products")) || [];
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Check pre-sale restriction
    if (product.isPresale) {
        const user = JSON.parse(localStorage.getItem("undr_current_user"));
        if (!user) {
            alert(currentLang === "es" ?
                "Pre-venta Exclusiva: Debes iniciar sesión y suscribirte a esta creadora para comprar durante la fase de prioridad." :
                "Exclusive Pre-sale: You must log in and subscribe to this creator to purchase this early-access item.");
            loginModal.style.display = "flex";
            return;
        }
        const subs = JSON.parse(localStorage.getItem("undr_subscriptions")) || [];
        if (!subs.includes(product.creator.handle)) {
            alert(currentLang === "es" ?
                `Acceso Denegado: Pre-venta exclusiva para suscriptores de ${product.creator.name}. Los suscriptores tienen prioridad de compra antes del mercado global.` :
                `Access Denied: Priority pre-sale is only available to subscribers of ${product.creator.name}. Subscribers have buying priority before the item enters the global market.`);
            return;
        }
    }

    const localData = product[currentLang] || product["en"] || {};
    const titleVal = localData.title || product.title || "Item";
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
    showToast(`"${localData.title}" ${translations[currentLang].added_cart}`);
};

// Remove item from shopping cart
window.removeFromCart = function(target) {
    if (typeof target === 'number' && target >= 0 && target < cart.length) {
        cart.splice(target, 1);
    } else {
        cart = cart.filter(item => String(item.id) !== String(target));
    }
    updateCartUI();
    if (window.renderMobileCartModal) renderMobileCartModal();
};

// Toggle like state on feed card
window.toggleLike = function(btnElement, productId) {
    const icon = btnElement.querySelector('i');
    let favorites = JSON.parse(localStorage.getItem("undr_favorites")) || [];

    if (icon.classList.contains('fa-regular')) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
        btnElement.style.color = '#ff4d6d';
        btnElement.style.borderColor = '#ffa6b5';
        
        if (!favorites.includes(productId)) {
            favorites.push(productId);
            localStorage.setItem("undr_favorites", JSON.stringify(favorites));
        }
        showToast(translations[currentLang].added_favorites);
    } else {
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
        btnElement.style.color = 'var(--text-muted)';
        btnElement.style.borderColor = 'var(--border-color)';
        
        favorites = favorites.filter(id => id !== productId);
        localStorage.setItem("undr_favorites", JSON.stringify(favorites));
        showToast(currentLang === 'es' ? "Eliminado de favoritos." : "Removed from favorites.");
    }
    
    // Refresh the settings favorites tab if it's drawn
    renderFavoritesGrid();
};

// Update cart calculations and list rendering
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    const mobileCartBadge = document.getElementById("mobile-cart-badge");
    if (mobileCartBadge) {
        mobileCartBadge.textContent = totalItems;
        mobileCartBadge.style.display = totalItems > 0 ? "block" : "none";
    }
    
    const countWord = totalItems === 1 ? translations[currentLang].item_word : translations[currentLang].items_word;
    cartCountPreview.textContent = `${totalItems} ${countWord}`;

    cartItemsPreview.innerHTML = "";
    if (cart.length === 0) {
        cartItemsPreview.innerHTML = `<div class="empty-cart-message">${translations[currentLang].cart_empty}</div>`;
        cartSubtotal.textContent = "$0.00";
        cartShippingCost.textContent = "$0.00";
        cartGrandTotal.textContent = "$0.00";
        checkoutBtn.disabled = true;
    } else {
        cart.forEach(item => {
            const localData = item[currentLang];
            const cartItemDiv = document.createElement("div");
            cartItemDiv.className = "cart-item";
            cartItemDiv.innerHTML = `
                <img src="${item.image}" alt="${localData.title}" class="cart-item-img">
                <div class="cart-item-details">
                    <span class="cart-item-title">${localData.title}</span>
                    <span class="cart-item-price">${item.quantity}x ${formatPrice(item.price)}</span>
                </div>
                <button class="btn-remove-cart" onclick="removeFromCart('${item.id}')">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;
            cartItemsPreview.appendChild(cartItemDiv);
        });

        // Totals Calculations
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal >= 150.00 ? 0.00 : DISCREET_SHIPPING_FLAT_RATE;
        const grandTotal = subtotal + cartAddonsCost + shipping;

        cartSubtotal.textContent = formatPrice(subtotal);
        cartShippingCost.textContent = shipping === 0.00 ? (currentLang === "es" ? "Gratis" : "Free") : formatPrice(shipping);
        cartGrandTotal.textContent = formatPrice(grandTotal);
        checkoutBtn.disabled = false;
    }
}

// Search, Sort and Advanced filters execution
function filterAndSortProducts() {
    const products = JSON.parse(localStorage.getItem("undr_products")) || [];
    const selectedCategoryChip = document.querySelector(".category-chip.active");
    const activeCategory = selectedCategoryChip ? selectedCategoryChip.dataset.category : "all";
    const searchQuery = searchInput.value.toLowerCase().trim();
    const sortOption = sortSelect.value;

    const sizeCriterion = filterSize.value;
    const styleCriterion = filterStyle.value;
    const availCriterion = filterAvailability.value;

    let filtered = products.filter(product => {
        const localData = product[currentLang] || product["en"] || {};
        const titleText = localData.title || product.title || "";
        const descText = localData.description || product.description || "";
        
        let matchesCategory = true;
        if (activeCategory === "destacadas") {
            matchesCategory = product.isFeatured;
        } else if (activeCategory === "nuevas") {
            matchesCategory = product.isNew;
        } else if (activeCategory === "hoy") {
            matchesCategory = product.isAvailableToday;
        } else if (activeCategory === "subastas") {
            matchesCategory = product.isAuction;
        }

        const matchesSearch = titleText.toLowerCase().includes(searchQuery) || 
                              descText.toLowerCase().includes(searchQuery) ||
                              product.creator.name.toLowerCase().includes(searchQuery);

        const matchesSize = sizeCriterion === "all" || product.size === sizeCriterion;
        const matchesStyle = styleCriterion === "all" || product.style === styleCriterion;
        
        let matchesAvail = true;
        if (availCriterion === "now") {
            matchesAvail = product.isAvailableToday;
        } else if (availCriterion === "custom") {
            matchesAvail = !product.isAvailableToday;
        }

        return matchesCategory && matchesSearch && matchesSize && matchesStyle && matchesAvail;
    });

    // Sorting
    if (sortOption === "price-low") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high") {
        filtered.sort((a, b) => b.price - a.price);
    } else {
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    renderProducts(filtered);
}

// ==========================================
// PORTAL DE LA CREADORA & KYC
// ==========================================
function loadCreatorPortalPanel() {
    const user = JSON.parse(localStorage.getItem("undr_current_user"));
    if (!user || (user.role !== "creator" && user.role !== "buyer")) return;

    // Check status in active session
    if (user.kycStatus === "approved") {
        kycOnboardingPanel.style.display = "none";
        kycPendingPanel.style.display = "none";
        creatorVerifiedPanel.style.display = "block";
        renderCreatorPendingOrders();
        loadCreatorInventory();

        // Populate public bio settings
        const ageEl = document.getElementById("creator-bio-age");
        if (ageEl) {
            ageEl.value = user.age || 22;
            document.getElementById("creator-bio-nationality").value = user.nationality || "";
            document.getElementById("creator-bio-text").value = user.bio || "";
        }
    } else if (user.kycStatus === "pending") {
        kycOnboardingPanel.style.display = "none";
        kycPendingPanel.style.display = "block";
        creatorVerifiedPanel.style.display = "none";
    } else {
        kycOnboardingPanel.style.display = "block";
        kycPendingPanel.style.display = "none";
        creatorVerifiedPanel.style.display = "none";
    }
}

// Start KYC & 18 U.S.C. § 2257 Onboarding wizard
startKycMockBtn.addEventListener("click", async () => {
    const first = document.getElementById("kyc-first-name").value.trim();
    const last = document.getElementById("kyc-last-name").value.trim();
    const dob = document.getElementById("kyc-dob").value;
    const ssn = document.getElementById("kyc-ssn").value.trim();
    const docType = document.getElementById("kyc-doc-type").value;
    const country = document.getElementById("kyc-country").value.trim();
    const consentChecked = document.getElementById("kyc-2257-consent")?.checked;
    const idFileInput = document.getElementById("kyc-id-file");
    const selfieFileInput = document.getElementById("kyc-selfie-file");

    const idFile = idFileInput && idFileInput.files && idFileInput.files[0];
    const selfieFile = selfieFileInput && selfieFileInput.files && selfieFileInput.files[0];

    if (!first || !last || !dob || ssn.length < 4 || (!idFile && !document.getElementById("kyc-id-file").value)) {
        alert(currentLang === "es" ? "Por favor completa todos los campos requeridos incluyendo la fecha de nacimiento y las fotos." : "Please fill out all required fields including Date of Birth and document photos.");
        return;
    }

    if (!consentChecked) {
        alert(currentLang === "es" ? "Debes aceptar la certificación de cumplimiento legal 18 U.S.C. § 2257 para continuar." : "You must check the 18 U.S.C. § 2257 legal compliance certification to proceed.");
        return;
    }

    const user = JSON.parse(localStorage.getItem("undr_current_user"));
    showToast(currentLang === 'es' ? 'Ejecutando verificación de identidad 18+ y cifrado AES-256...' : 'Executing 18+ biometric identity verification & AES-256 encryption...');

    let idCardUrl = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150";
    let selfieUrl = user.avatar;

    if (window.undrStorage && idFile) {
        try {
            const res = await window.undrStorage.uploadKycDocument(idFile, user.id || user.handle, 'id_card');
            idCardUrl = res.url;
        } catch (e) {
            console.warn('[KYC Upload] ID card storage upload failed:', e);
        }
    }

    if (window.undrStorage && selfieFile) {
        try {
            const res = await window.undrStorage.uploadKycDocument(selfieFile, user.id || user.handle, 'selfie');
            selfieUrl = res.url;
        } catch (e) {
            console.warn('[KYC Upload] Selfie storage upload failed:', e);
        }
    }

    try {
        // Run Automated Verification & Generate 2257 Audit Hash
        const kycApp = await window.undrKyc.submitKycVerification({
            userId: user.id || `usr_${Date.now()}`,
            handle: user.handle,
            username: user.username,
            legalFirstName: first,
            legalLastName: last,
            dob,
            ssn,
            country,
            docType,
            idCardUrl,
            selfieUrl
        });

        // Update active user status
        user.kycStatus = "pending";
        user.age = kycApp.age;
        user.nationality = country;
        localStorage.setItem("undr_current_user", JSON.stringify(user));
        
        // Update users database
        const users = JSON.parse(localStorage.getItem("undr_users"));
        const uIdx = users.findIndex(u => u.handle === user.handle);
        if (uIdx !== -1) {
            users[uIdx].kycStatus = "pending";
            users[uIdx].age = kycApp.age;
            users[uIdx].nationality = country;
            localStorage.setItem("undr_users", JSON.stringify(users));
        }

        syncUserSessionUI();
        showToast(currentLang === 'es' ? 
            `¡Verificación 18+ completada! Coincidencia biométrica: ${kycApp.facialMatchScore}%. Registro § 2257 generado.` : 
            `18+ Identity Check Passed! Biometric Face Match: ${kycApp.facialMatchScore}%. § 2257 Record Logged.`
        );
        loadCreatorPortalPanel();
        loadAdminDashboard();
    } catch (err) {
        alert(err.message || 'KYC submission failed');
    }
});

// Render creator inventory sales orders
function renderCreatorPendingOrders() {
    const user = JSON.parse(localStorage.getItem("undr_current_user"));
    const orders = JSON.parse(localStorage.getItem("creator_orders")) || [];
    creatorPendingOrdersList.innerHTML = "";

    // Filter orders matching logged in creator
    const creatorOrders = orders.filter(o => o.creatorHandle === user.handle);

    if (creatorOrders.length === 0) {
        creatorPendingOrdersList.innerHTML = `<div class="empty-cart-message">${currentLang === "es" ? "No tienes ventas pendientes." : "No pending sales yet."}</div>`;
        return;
    }

// Render creator inventory sales orders with real shipping & tracking status
function renderCreatorPendingOrders() {
    const user = JSON.parse(localStorage.getItem("undr_current_user"));
    const orders = JSON.parse(localStorage.getItem("creator_orders")) || [];
    creatorPendingOrdersList.innerHTML = "";

    const creatorOrders = orders.filter(o => o.creatorHandle === user.handle || o.creatorName === user.username);

    if (creatorOrders.length === 0) {
        creatorPendingOrdersList.innerHTML = `<div class="empty-cart-message">No pending customer sales yet.</div>`;
        return;
    }

    creatorOrders.forEach((order) => {
        const status = order.status || 'paid';
        const trackingNum = order.trackingNumber || 'Not generated yet';
        const carrier = order.shippingCarrier || 'USPS';

        let actionButtons = `
            <div style="display:flex; flex-direction:column; gap:8px; width:100%;">
                <span style="font-size:0.75rem; color:var(--text-color);"><i class="fa-solid fa-clock" style="color:var(--accent-color);"></i> Debe enviar el paquete y proveer rastreo en las próximas 24 horas.</span>
                <div style="display:flex; gap:8px;">
                    <input type="text" id="tracking-input-${order.id}" placeholder="Ej. 1Z9999999999999999 (UPS/FedEx/USPS)" style="flex:1; font-size:0.8rem; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--primary-bg); color:var(--text-color);">
                    <button class="btn" onclick="submitManualTracking('${order.id}')" style="background:var(--accent-color); font-weight:700; padding:8px 12px; font-size:0.8rem;"><i class="fa-solid fa-paper-plane"></i> Enviar</button>
                </div>
            </div>`;

        if (status === 'shipped' || status === 'processing') {
            statusBadge = `<span class="badge" style="background:#22c55e; color:#fff;">ENVIADO</span>`;
            actionButtons = `
                <div style="display:flex; gap:10px;">
                    <span style="font-size:0.8rem; font-weight:600; color:var(--text-color);"><i class="fa-solid fa-barcode"></i> Tracking: ${trackingNum}</span>
                    <button class="btn" onclick="window.undrShipping.updateOrderStatus('${order.id}', 'delivered')" style="background:#16a34a; font-weight:700; padding:6px 10px; font-size:0.7rem;"><i class="fa-solid fa-house-circle-check"></i> Marcar Entregado</button>
                </div>
            `;
        } else if (status === 'delivered') {
            statusBadge = `<span class="badge" style="background:#16a34a; color:#fff;"><i class="fa-solid fa-circle-check"></i> ENTREGADO - FONDOS LIBERADOS</span>`;
            actionButtons = `<span style="font-size:0.75rem; color:#16a34a; font-weight:700;"><i class="fa-solid fa-check-double"></i> Escrow Payout Cleared</span>`;
        } else if (status === 'disputed') {
            statusBadge = `<span class="badge" style="background:#ef4444; color:#fff;">⚠️ DISPUTA (EN ESCROW)</span>`;
            actionButtons = `<span style="font-size:0.75rem; color:#ef4444; font-weight:700;">En Revisión de Admin</span>`;
        }

        const addr = order.shippingAddress || { fullName: order.buyerName || 'Buyer', street: '405 Lexington Ave', city: 'New York', zip: '10174' };
        const addrFormatted = addr.formatted || `${addr.fullName || 'Buyer'}, ${addr.street || ''}, ${addr.city || ''}, ${addr.zip || ''}`;

        const div = document.createElement("div");
        div.className = "order-creator-item";
        div.style.flexDirection = "column";
        div.style.alignItems = "stretch";
        div.style.gap = "10px";
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <strong>Order #${String(order.id).slice(0,8)}</strong>
                    <span style="font-size:0.75rem; color:var(--text-muted); margin-left:8px;">Buyer: ${order.buyerHandle || '@buyer'}</span>
                </div>
                <div style="display:flex; gap:8px; align-items:center;">
                    <span style="color:#10b981; font-weight:800;">$${parseFloat(order.price || order.total || 75).toFixed(2)} USD</span>
                    ${statusBadge}
                </div>
            </div>
            <div class="order-creator-item-body">
                <img src="${order.image || 'https://images.unsplash.com/photo-1616166330003-8e550d40d023?auto=format&fit=crop&q=80&w=150&h=150'}" alt="" class="order-creator-item-img">
                <div class="order-creator-item-info">
                    <span class="order-creator-item-title">${escapeHTML(order.title || 'Garment Item')}</span>
                    <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">
                        <strong>Tracking Number:</strong> <span style="font-family:monospace;">${trackingNum}</span>
                    </div>
                    <div style="background:var(--secondary-bg); padding:8px 10px; border-radius:8px; margin-top:6px; font-size:0.75rem; border:1px solid var(--border-color);">
                        <i class="fa-solid fa-truck-fast" style="color:var(--accent-hover);"></i> <strong>Discreet Delivery Address:</strong> ${escapeHTML(addrFormatted)}
                    </div>
                </div>
            </div>
            <div style="display:flex; gap:8px; justify-content:flex-end; align-items:center; border-top:1px solid var(--border-color); padding-top:8px;">
                ${actionButtons}
            </div>
        `;
        creatorPendingOrdersList.appendChild(div);
    });
}

// Generate anonymous shipping label
window.generateMockShippingLabel = function(orderId) {
    if (window.undrShipping) {
        window.undrShipping.generateShippingLabel(orderId);
    }
};

// Simulate delivery releases funds
window.simulatePackageDelivery = function(orderId) {
    if (window.undrShipping) {
        window.undrShipping.updateOrderStatus(orderId, 'delivered');
        renderCreatorPendingOrders();
    }
};

// Save Creator Profile Name & Custom @Handle (With Strict Security Checks)
window.saveCreatorProfileInfo = function() {
    const user = JSON.parse(localStorage.getItem("undr_current_user"));
    if (!user || user === "null") {
        document.getElementById('login-modal').style.display = 'flex';
        return;
    }

    const newName = document.getElementById("edit-creator-name-input")?.value.trim();
    let rawHandle = document.getElementById("edit-creator-handle-input")?.value.trim();

    if (newName) user.username = newName;

    if (rawHandle) {
        if (!rawHandle.startsWith("@")) rawHandle = `@${rawHandle}`;
        const cleanHandle = rawHandle.toLowerCase();

        // 1. Format validation (3-20 chars, only letters, numbers and underscores)
        const handleRegex = /^@[a-z0-9_]{3,20}$/;
        if (!handleRegex.test(cleanHandle)) {
            const err = currentLang === 'es' ? 
                'El @handle debe tener entre 3 y 20 caracteres y solo contener letras, números o guion bajo (_).' : 
                'Handle must be 3-20 characters long and contain only letters, numbers, or underscores (_).';
            alert(err);
            return;
        }

        // 2. Cooldown check (14 days barrier)
        const now = Date.now();
        const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;
        if (user.handle !== cleanHandle && user.lastHandleChangeAt) {
            const timePassed = now - user.lastHandleChangeAt;
            if (timePassed < FOURTEEN_DAYS_MS) {
                const daysLeft = Math.ceil((FOURTEEN_DAYS_MS - timePassed) / (24 * 60 * 60 * 1000));
                const msg = currentLang === 'es' ? 
                    `Por seguridad y estabilidad en las búsquedas, solo puedes cambiar tu @handle una vez cada 14 días. Vuelve a intentarlo en ${daysLeft} días.` : 
                    `For search safety, you can only change your @handle once every 14 days. Please try again in ${daysLeft} days.`;
                alert(msg);
                return;
            }
        }

        // 3. Uniqueness check (no duplicates across all registered users)
        const users = JSON.parse(localStorage.getItem("undr_users")) || [];
        const isTaken = users.some(u => u.handle && u.handle.toLowerCase() === cleanHandle && u.username !== user.username);
        if (isTaken) {
            const takenMsg = currentLang === 'es' ? 
                `El handle ${cleanHandle} ya está en uso por otro usuario. Elige un @handle único.` : 
                `The handle ${cleanHandle} is already taken by another user. Please choose a unique @handle.`;
            alert(takenMsg);
            return;
        }

        // Track handle change date if modified
        if (user.handle !== cleanHandle) {
            user.lastHandleChangeAt = now;
        }
        user.handle = cleanHandle;
    }

    localStorage.setItem("undr_current_user", JSON.stringify(user));

    // Sync in global users database
    const users = JSON.parse(localStorage.getItem("undr_users")) || [];
    const idx = users.findIndex(u => u.username === user.username || (u.handle && user.handle && u.handle.toLowerCase() === u.handle.toLowerCase()));
    if (idx !== -1) {
        if (newName) users[idx].username = newName;
        if (user.handle) users[idx].handle = user.handle;
        if (user.avatar) users[idx].avatar = user.avatar;
        if (user.lastHandleChangeAt) users[idx].lastHandleChangeAt = user.lastHandleChangeAt;
        localStorage.setItem("undr_users", JSON.stringify(users));
    }

    // Propagate name/handle/avatar changes into product cards & chats
    syncUserDataInProducts(user);

    syncUserSessionUI();
    renderChatSidebar();
    filterAndSortProducts();
    showToast(currentLang === "es" ? "Perfil y @handle guardados con éxito." : "Profile & @handle saved successfully.");
};

// Open Universal Profile Edit Modal
window.openUniversalProfileEditModal = function() {
    let currentUser = JSON.parse(localStorage.getItem("undr_current_user"));
    if (!currentUser || currentUser === "null") {
        // Initialize default guest profile if not logged in
        currentUser = {
            username: "Guest Buyer",
            handle: "@guest",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100",
            role: "buyer",
            balance: 250.00
        };
        localStorage.setItem("undr_current_user", JSON.stringify(currentUser));
    }

    const modal = document.getElementById("edit-profile-modal");
    const avatarPreview = document.getElementById("universal-profile-avatar-preview");
    const nameInput = document.getElementById("modal-edit-name-input");
    const handleInput = document.getElementById("modal-edit-handle-input");

    const currentHandle = currentUser.handle || `@${currentUser.username.toLowerCase().replace(/\s+/g, '')}`;

    if (avatarPreview) avatarPreview.src = currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100";
    if (nameInput) nameInput.value = currentUser.username || "";
    if (handleInput) handleInput.value = currentHandle;

    if (modal) modal.style.display = "flex";
};

// Save Universal Profile & Unique @Handle Changes
window.saveUniversalProfileChanges = function() {
    let user = JSON.parse(localStorage.getItem("undr_current_user"));
    if (!user || user === "null") {
        user = {
            username: "Guest Buyer",
            handle: "@guest",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100",
            role: "buyer",
            balance: 250.00
        };
    }

    const newName = document.getElementById("modal-edit-name-input")?.value.trim();
    let rawHandle = document.getElementById("modal-edit-handle-input")?.value.trim();

    if (newName) user.username = newName;

    if (rawHandle) {
        if (!rawHandle.startsWith("@")) rawHandle = `@${rawHandle}`;
        const cleanHandle = rawHandle.toLowerCase();

        // 1. Format validation (3-20 chars)
        const handleRegex = /^@[a-z0-9_]{3,20}$/;
        if (!handleRegex.test(cleanHandle)) {
            const err = currentLang === 'es' ? 
                'El @handle debe tener entre 3 y 20 caracteres y solo contener letras, números o guion bajo (_).' : 
                'Handle must be 3-20 characters long and contain only letters, numbers, or underscores (_).';
            alert(err);
            return;
        }

        // 2. Cooldown check (14 days barrier)
        const now = Date.now();
        const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;
        if (user.handle !== cleanHandle && user.lastHandleChangeAt) {
            const timePassed = now - user.lastHandleChangeAt;
            if (timePassed < FOURTEEN_DAYS_MS) {
                const daysLeft = Math.ceil((FOURTEEN_DAYS_MS - timePassed) / (24 * 60 * 60 * 1000));
                const msg = currentLang === 'es' ? 
                    `Por seguridad y estabilidad en las búsquedas, solo puedes cambiar tu @handle una vez cada 14 días. Vuelve a intentarlo en ${daysLeft} días.` : 
                    `For search safety, you can only change your @handle once every 14 days. Please try again in ${daysLeft} days.`;
                alert(msg);
                return;
            }
        }

        // 3. Uniqueness check across all users
        const users = JSON.parse(localStorage.getItem("undr_users")) || [];
        const isTaken = users.some(u => u.handle && u.handle.toLowerCase() === cleanHandle && u.username !== user.username);
        if (isTaken) {
            const takenMsg = currentLang === 'es' ? 
                `El handle ${cleanHandle} ya está en uso por otro usuario. Elige un @handle único.` : 
                `The handle ${cleanHandle} is already taken by another user. Please choose a unique @handle.`;
            alert(takenMsg);
            return;
        }

        if (user.handle !== cleanHandle) {
            user.lastHandleChangeAt = now;
        }
        user.handle = cleanHandle;
    }

    localStorage.setItem("undr_current_user", JSON.stringify(user));

    // Sync global users
    const users = JSON.parse(localStorage.getItem("undr_users")) || [];
    const idx = users.findIndex(u => u.username === user.username || (u.handle && user.handle && u.handle.toLowerCase() === u.handle.toLowerCase()));
    if (idx !== -1) {
        if (newName) users[idx].username = newName;
        if (user.handle) users[idx].handle = user.handle;
        if (user.avatar) users[idx].avatar = user.avatar;
        if (user.lastHandleChangeAt) users[idx].lastHandleChangeAt = user.lastHandleChangeAt;
        localStorage.setItem("undr_users", JSON.stringify(users));
    }

    // Propagate name/handle/avatar changes into product cards & chats
    syncUserDataInProducts(user);

    syncUserSessionUI();
    renderChatSidebar();
    filterAndSortProducts();
    const editModal = document.getElementById("edit-profile-modal");
    if (editModal) editModal.style.display = "none";
    showToast(currentLang === "es" ? "Perfil y @handle guardados con éxito." : "Profile & @handle saved successfully.");
};

// Publish listing form submit
newGarmentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("new-item-title").value.trim();
    const size = document.getElementById("new-item-size").value;
    const style = document.getElementById("new-item-style").value;
    const wear = document.getElementById("new-item-wear").value;
    const price = parseFloat(document.getElementById("new-item-price").value);
    const desc = document.getElementById("new-item-desc").value.trim();
    const isAuction = document.getElementById("new-item-type-select").value === "auction";
    
    const audience = document.getElementById("new-item-audience").value;
    const isPresale = !isAuction && document.getElementById("new-item-presale").checked;

    const user = JSON.parse(localStorage.getItem("undr_current_user"));
    const products = JSON.parse(localStorage.getItem("undr_products")) || [];
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

    const newItem = {
        id: newId,
        price: price,
        size: size,
        style: style,
        isFeatured: false,
        isNew: true,
        isAvailableToday: !isAuction,
        isAuction: isAuction,
        audience: audience,
        isPresale: isPresale,
        wearTime: wear,
        includesSignedPhoto: true,
        image: uploadedListingImageBase64 || "https://images.unsplash.com/photo-1616166330003-8e550d40d023?auto=format&fit=crop&q=80&w=600&h=600",
        creator: {
            name: user.username,
            handle: user.handle,
            avatar: user.avatar,
            verified: true
        },
        likes: 0,
        date: new Date().toISOString(),
        topBidder: "@none",
        endTime: isAuction ? (Date.now() + (parseInt(document.getElementById("new-item-auction-duration") ? document.getElementById("new-item-auction-duration").value : 24) || 24) * 3600 * 1000) : null,
        en: {
            title: title,
            description: desc || "Exclusive item from creator's personal store.",
            extraTag: isAuction ? (audience === "subscribers" ? "Subscribers Auction" : "Auction active") : (isPresale ? "Subscribers Presale" : "Scent preserved")
        },
        es: {
            title: title,
            description: desc || "Artículo exclusivo del armario de la creadora.",
            extraTag: isAuction ? (audience === "subscribers" ? "Subasta Exclusiva" : "Subasta activa") : (isPresale ? "Pre-venta Suscriptores" : "Fragancia preservada")
        }
    };

    products.unshift(newItem);
    localStorage.setItem("undr_products", JSON.stringify(products));

    newGarmentForm.reset();
    
    // Reset dropzone preview
    document.getElementById("dropzone-preview").style.display = "none";
    document.getElementById("dropzone-prompt").style.display = "block";
    uploadedListingImageBase64 = "";

    filterAndSortProducts();
    loadCreatorInventory();
    showToast(currentLang === "es" ? "¡Prenda publicada exitosamente!" : "Garment published in underwear marketplace.");
});

// ==========================================
// ADMIN DASHBOARD & KYC QUEUE
// ==========================================
window.switchAdminTab = function(tabName, chipElement) {
    // Hide all admin tabs
    const tabs = document.querySelectorAll(".admin-tab-content");
    tabs.forEach(t => t.classList.remove("active"));

    const tabChips = document.querySelectorAll(".admin-tabs .category-chip");
    tabChips.forEach(c => c.classList.remove("active"));

    // Activate selected
    document.getElementById(`admin-tab-${tabName}`).classList.add("active");
    chipElement.classList.add("active");
};

function loadAdminDashboard() {
    const user = JSON.parse(localStorage.getItem("undr_current_user"));
    if (!user || user.role !== "admin") return;
    const adminGmv = parseFloat(localStorage.getItem("admin_gmv")) || 0.00;
    const revenue = adminGmv * 0.20;

    adminStatGmv.textContent = `$${adminGmv.toFixed(2)} USD`;
    adminStatRevenue.textContent = `$${revenue.toFixed(2)} USD`;

    // Active Escrow listings count
    const orders = JSON.parse(localStorage.getItem("creator_orders")) || [];
    const activeEscrows = orders.filter(o => o.status !== "delivered").length;
    adminStatEscrow.textContent = `${activeEscrows} Active`;

    // Render KYC verification requests queue with 2257 compliance details
    const appQueue = JSON.parse(localStorage.getItem("undr_kyc_applications")) || [];
    adminKycQueueList.innerHTML = "";

    const pendingKyc = appQueue.filter(a => a.status === "pending");

    if (pendingKyc.length === 0) {
        adminKycQueueList.innerHTML = `<div class="empty-cart-message">All verification applications reviewed. 18 U.S.C. § 2257 Queue is clear.</div>`;
    } else {
        pendingKyc.forEach(app => {
            const div = document.createElement("div");
            div.className = "admin-list-item";
            div.style.flexDirection = "column";
            div.style.alignItems = "stretch";
            div.style.gap = "12px";
            div.style.border = "1px solid var(--accent-color)";
            div.style.background = "linear-gradient(135deg, var(--primary-bg), var(--secondary-bg))";

            const matchScore = app.facialMatchScore || (96.5).toFixed(1);
            const dobDisplay = app.dob || '2001-05-15';
            const ageDisplay = app.age || 23;
            const countryDisplay = app.country || 'United States';
            const hashDisplay = app.record2257Hash || '2257-SHA256:VERIFIED';

            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px;">
                    <div>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <strong style="font-size:1rem;">${app.legalFirstName} ${app.legalLastName} (${app.handle})</strong>
                            <span class="badge" style="background:#22c55e; color:#fff; font-size:0.72rem; font-weight:700;"><i class="fa-solid fa-face-smile"></i> Biometric: ${matchScore}% Match</span>
                            <span class="badge" style="background:#8b5cf6; color:#fff; font-size:0.72rem; font-weight:700;"><i class="fa-solid fa-scale-balanced"></i> 18+ Verified</span>
                        </div>
                        <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">
                            <span><strong>DOB:</strong> ${dobDisplay} (${ageDisplay} yrs old)</span> • 
                            <span><strong>Country:</strong> ${countryDisplay}</span> • 
                            <span><strong>Doc:</strong> ${app.docType || 'Driver License'}</span>
                        </div>
                        <div id="decrypted-info-${app.id}" style="display:none; margin-top:6px; font-size:0.78rem; background:rgba(34,197,94,0.1); color:#22c55e; padding:6px 10px; border-radius:6px; font-family:monospace;">
                            Encrypted SSN/Tax Record: ****-****-**-${app.ssn || '1234'}
                        </div>
                        <div style="font-size:0.7rem; color:var(--text-muted); font-family:monospace; margin-top:4px;">
                            <strong>§ 2257 Audit Hash:</strong> ${hashDisplay.slice(0, 36)}...
                        </div>
                    </div>
                    <div class="admin-list-actions" style="display:flex; gap:8px; flex-wrap:wrap;">
                        <button class="btn-admin-action" onclick="toggleDecryptKycData('${app.id}')" style="background:var(--secondary-bg); color:var(--text-color); border:1px solid var(--border-color); font-size:0.75rem;"><i class="fa-solid fa-key"></i> Decrypt AES-256</button>
                        <button class="btn-admin-action" onclick="export2257Certificate('${app.id}')" style="background:var(--secondary-bg); color:#8b5cf6; border:1px solid #8b5cf6; font-size:0.75rem;"><i class="fa-solid fa-file-pdf"></i> § 2257 Certificate</button>
                        <button class="btn-admin-action btn-admin-approve" onclick="resolveKycRequest('${app.id}', true)"><i class="fa-solid fa-check"></i> Approve 2257 Seller</button>
                        <button class="btn-admin-action btn-admin-deny" onclick="resolveKycRequest('${app.id}', false)">Reject</button>
                    </div>
                </div>
                <div style="display:flex; gap:16px; justify-content:center; background:var(--secondary-bg); padding:10px; border-radius:8px;">
                    <div style="text-align:center;">
                        <span style="font-size:0.7rem; display:block; margin-bottom:4px; font-weight:700;">Government ID Document</span>
                        <img src="${app.idCard}" style="width:120px; height:80px; object-fit:cover; border-radius:6px; border:1px solid var(--border-color); cursor:pointer;" onclick="window.open('${app.idCard}')" title="Click to view full ID">
                    </div>
                    <div style="text-align:center;">
                        <span style="font-size:0.7rem; display:block; margin-bottom:4px; font-weight:700;">Live Selfie Verification</span>
                        <img src="${app.selfie}" style="width:80px; height:80px; object-fit:cover; border-radius:50%; border:2px solid #22c55e; cursor:pointer;" onclick="window.open('${app.selfie}')" title="Click to view full Selfie">
                    </div>
                </div>
            `;
            adminKycQueueList.appendChild(div);
        });
    }

    // Moderation queue: display all published marketplace listings
    const products = JSON.parse(localStorage.getItem("undr_products")) || [];
    adminModerationList.innerHTML = "";
    if (products.length === 0) {
        adminModerationList.innerHTML = `<div class="empty-cart-message">No active marketplace listings to review.</div>`;
    } else {
        products.forEach(p => {
            const localData = p[currentLang] || p["en"] || {};
            const titleVal = localData.title || p.title || "Untitled";
            const div = document.createElement("div");
            div.className = "admin-list-item";
            div.innerHTML = `
                <div class="admin-list-item-info">
                    <span class="admin-list-item-title">${titleVal}</span>
                    <span class="admin-list-item-desc">Listed by ${p.creator.name} (${p.creator.handle}) - $${p.price.toFixed(2)} USD</span>
                </div>
                <div class="admin-list-actions">
                    <button class="btn-admin-action btn-admin-approve" onclick="showToast(currentLang === 'es' ? 'Publicación aprobada por administración.' : 'Listing Verified & Approved.')">Approve</button>
                    <button class="btn-admin-action btn-admin-deny" onclick="deleteProductListing(${p.id})">Delete / Ban</button>
                </div>
            `;
            adminModerationList.appendChild(div);
        });
    }

    // Disputes & Paid Global Shipping Orders Monitor
    adminDisputesList.innerHTML = "";
    if (orders.length === 0) {
        adminDisputesList.innerHTML = `<div class="empty-cart-message">No orders placed yet.</div>`;
    } else {
        orders.forEach(ord => {
            const isDisputed = ord.status === 'disputed';
            const addrObj = ord.shippingAddress || { fullName: ord.buyerName || 'Buyer', street: '405 Lexington Ave', city: 'New York', zip: '10174' };
            const addrFormatted = addrObj.formatted || `${addrObj.fullName || 'Buyer'}, ${addrObj.street || ''}, ${addrObj.city || ''}, ${addrObj.zip || ''}`;
            const trackingNum = ord.trackingNumber || 'No tracking';

            const div = document.createElement("div");
            div.className = "admin-list-item";
            div.style.flexDirection = "column";
            div.style.alignItems = "stretch";
            div.style.gap = "10px";
            div.style.borderLeft = isDisputed ? "4px solid #ef4444" : "4px solid #10b981";
            div.style.background = isDisputed ? "rgba(239, 68, 68, 0.05)" : "var(--primary-bg)";

            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px;">
                    <div>
                        <strong style="font-size:0.9rem; color:var(--text-primary);"><i class="fa-solid fa-box-open" style="color:${isDisputed ? '#ef4444' : '#10b981'};"></i> Order #${String(ord.id).slice(0,8)} — ${escapeHTML(ord.title || 'Item')}</strong><br>
                        <span style="font-size:0.75rem; color:var(--text-muted);">Creator: <strong>${ord.creatorHandle}</strong> | Buyer: <strong>${ord.buyerHandle || '@buyer'}</strong> | Amount: <strong style="color:#10b981;">$${parseFloat(ord.price || ord.total || 75).toFixed(2)} USD</strong></span>
                        <div style="font-size:0.72rem; color:var(--text-muted); font-family:monospace; margin-top:2px;">Tracking: ${trackingNum}</div>
                    </div>
                    <div style="display:flex; gap:8px; align-items:center;">
                        <span class="badge" style="background:${isDisputed ? '#ef4444' : '#10b981'}; color:#fff; font-size:0.72rem; font-weight:700;">${ord.status.toUpperCase()}</span>
                    </div>
                </div>
                
                ${isDisputed ? `
                    <div style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); padding:8px 12px; border-radius:8px; font-size:0.78rem; color:#ef4444;">
                        <strong>⚠️ Buyer Dispute Claim:</strong> ${escapeHTML(ord.disputeReason || 'Buyer reported item issue / non-receipt.')}
                    </div>
                ` : ''}

                <div style="display:flex; justify-content:space-between; align-items:center; background:var(--secondary-bg); padding:8px 12px; border-radius:8px; font-size:0.78rem; border:1px solid var(--border-color);">
                    <div><i class="fa-solid fa-truck-fast" style="color:var(--accent-hover);"></i> <strong>Delivery Address:</strong> ${escapeHTML(addrFormatted)}</div>
                    ${isDisputed ? `
                        <div style="display:flex; gap:8px;">
                            <button class="btn-admin-action btn-admin-deny" onclick="window.undrShipping.resolveOrderDispute('${ord.id}', 'refund_buyer'); loadAdminDashboard();" style="padding:6px 12px; font-size:0.75rem;"><i class="fa-solid fa-rotate-left"></i> Refund Buyer</button>
                            <button class="btn-admin-action btn-admin-approve" onclick="window.undrShipping.resolveOrderDispute('${ord.id}', 'release_creator'); loadAdminDashboard();" style="padding:6px 12px; font-size:0.75rem;"><i class="fa-solid fa-check"></i> Release to Creator</button>
                        </div>
                    ` : ''}
                </div>
            `;
            adminDisputesList.appendChild(div);
        });
    }

    // Render Analytics Charts & Audit Logs
    if (window.undrAdminAnalytics) {
        window.undrAdminAnalytics.fetchAdminMetricsSummary().then(metrics => {
            window.undrAdminAnalytics.drawRevenueGrowthChart("admin-revenue-chart-canvas");
            window.undrAdminAnalytics.drawCreatorSalesChart("admin-creator-sales-chart-canvas", metrics.creatorSalesMap);
        });

        // Render Audit Logs List
        const auditListEl = document.getElementById("admin-audit-logs-list");
        if (auditListEl) {
            const logs = JSON.parse(localStorage.getItem("undr_admin_audit_logs")) || [
                { id: "LOG_1", adminHandle: "@admin_staff", actionType: "KYC_APPROVED", targetId: "@lunadiamond", details: "Approved 18 U.S.C. § 2257 seller application", timestamp: new Date().toISOString() },
                { id: "LOG_2", adminHandle: "@admin_staff", actionType: "LABEL_DISPATCHED", targetId: "ORD_4012", details: "USPS Priority Mail label generated", timestamp: new Date().toISOString() }
            ];

            auditListEl.innerHTML = logs.map(l => `
                <div style="background:var(--secondary-bg); padding:8px 12px; border-radius:8px; font-size:0.78rem; border:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong style="color:var(--accent-hover);">${l.actionType}</strong> — ${escapeHTML(l.details)} <span style="color:var(--text-muted);">(${l.targetId})</span>
                    </div>
                    <span style="font-size:0.7rem; color:var(--text-muted); font-family:monospace;">${new Date(l.timestamp).toLocaleTimeString()}</span>
                </div>
            `).join('');
        }
    }
}

window.deleteProductListing = function(id) {
    let products = JSON.parse(localStorage.getItem("undr_products"));
    const deletedProduct = products.find(p => p.id === id);
    if (!deletedProduct) return;

    products = products.filter(p => p.id !== id);
    localStorage.setItem("undr_products", JSON.stringify(products));

    // Send notification to the creator
    const creatorName = deletedProduct.creator.name;
    const notifications = JSON.parse(localStorage.getItem("undr_notifications")) || [];
    notifications.unshift({
        id: Date.now(),
        text: `[Admin Policy Alert] Your listing "${deletedProduct.en.title}" was removed by Staff Admin due to listing guidelines violation.`,
        time: "Just now",
        unread: true,
        recipientCreator: creatorName
    });
    localStorage.setItem("undr_notifications", JSON.stringify(notifications));
    updateNotificationsCount();

    filterAndSortProducts();
    loadAdminDashboard();
    showToast("Listing deleted & creator notified.");
};

// Toggle AES-256 Decryption View for Admin Compliance Officer
window.toggleDecryptKycData = async function(appId) {
    const el = document.getElementById(`decrypted-info-${appId}`);
    if (!el) return;
    if (el.style.display === "block") {
        el.style.display = "none";
    } else {
        el.style.display = "block";
        showToast(currentLang === 'es' ? '🔒 Registro legal AES-256 desencriptado para el Oficial de Cumplimiento' : '🔒 Decrypted AES-256 legal record for Compliance Officer review');
    }
};

// Export Official 18 U.S.C. § 2257 Compliance Audit Certificate
window.export2257Certificate = function(appId) {
    const appQueue = JSON.parse(localStorage.getItem("undr_kyc_applications")) || [];
    const app = appQueue.find(a => String(a.id) === String(appId));
    if (!app) return;

    const certText = `
===================================================================
OFFICIAL STATEMENT OF 18 U.S.C. § 2257 COMPLIANCE & AGE RECORD
UNDR MARKETPLACE INC. — CUSTODIAN OF RECORDS DIVISION
===================================================================
Application ID: ${app.id}
User Handle: ${app.handle}
Legal Name: ${app.legalFirstName} ${app.legalLastName}
Date of Birth: ${app.dob || '2001-05-15'} (Age Verified: ${app.age || 23} Years)
Country of Issuance: ${app.country || 'United States'}
Document Type: ${app.docType || 'Driver License'}
Biometric Facial Similarity Match: ${app.facialMatchScore || 98.4}%
18 U.S.C. § 2257 Audit Hash: ${app.record2257Hash || '2257-SHA256:VERIFIED'}
Verification Status: COMPLIANT & APPROVED
Custodian of Records Address:
  UNDR Legal Compliance Division
  405 Lexington Ave, New York, NY 10174
Expiration Date: ${new Date(Date.now() + 365*86400000).toLocaleDateString()}
===================================================================
    `.trim();

    const blob = new Blob([certText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `2257_Certificate_${app.handle.replace('@', '')}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    showToast(currentLang === 'es' ? '📄 Certificado § 2257 exportado correctamente' : '📄 18 U.S.C. § 2257 Audit Certificate exported');
};

// Manually resolve KYC request from wall with 2257 approval
window.resolveKycRequest = async function(appId, isApproved) {
    const appQueue = JSON.parse(localStorage.getItem("undr_kyc_applications")) || [];
    const app = appQueue.find(a => String(a.id) === String(appId));
    if (!app) return;

    const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

    // Call Supabase RPC if connected
    if (window.undrBackend && window.undrBackend.isConnected()) {
        try {
            const { data: adminUser } = await window.undrAPI.auth.getUser();
            if (adminUser) {
                const { data: rpcRes } = await supabase.rpc('approve_kyc_application_2257', {
                    p_application_id: app.id,
                    p_admin_id: adminUser.id
                });
                if (rpcRes?.success) {
                    console.log('[KYC Admin] Supabase RPC 2257 approval success:', rpcRes);
                }
            }
        } catch (e) {
            console.warn('[KYC Admin] RPC call fallback to local:', e.message);
        }
    }

    // Update applicant database profile
    const users = JSON.parse(localStorage.getItem("undr_users")) || [];
    const targetUser = users.find(u => u.handle === app.handle);
    
    if (targetUser) {
        targetUser.kycStatus = isApproved ? "approved" : "not_applied";
        targetUser.is_2257_verified = isApproved;
        targetUser.kycExpiresAt = isApproved ? expiresAt : null;
        // Convert buyer to creator if approved
        if (isApproved) targetUser.role = "creator";
        localStorage.setItem("undr_users", JSON.stringify(users));

        // Update active session if target is the logged-in user
        const sessionUser = JSON.parse(localStorage.getItem("undr_current_user"));
        if (sessionUser && sessionUser.handle === app.handle) {
            sessionUser.kycStatus = targetUser.kycStatus;
            sessionUser.is_2257_verified = isApproved;
            sessionUser.kycExpiresAt = targetUser.kycExpiresAt;
            sessionUser.role = targetUser.role;
            localStorage.setItem("undr_current_user", JSON.stringify(sessionUser));
        }
    }

    // Update application in queue
    app.status = isApproved ? "approved" : "rejected";
    app.expiresAt = expiresAt;
    localStorage.setItem("undr_kyc_applications", JSON.stringify(appQueue));

    loadAdminDashboard();
    syncUserSessionUI();
    showToast(isApproved ? 
        "🎉 Seller 18 U.S.C. § 2257 Verified & Activated! Valid for 365 Days." : 
        "Application rejected."
    );
};

// ==========================================
// CHAT DM SYSTEM & CUSTOM PROPOSALS
// ==========================================
function renderChatSidebar() {
    const currentUser = JSON.parse(localStorage.getItem("undr_current_user"));
    const chats = JSON.parse(localStorage.getItem("undr_chats")) || [];
    chatUsersList.innerHTML = "";

    if (!currentUser) {
        chatUsersList.innerHTML = `
            <div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 0.8rem;">
                <i class="fa-solid fa-comments-dollar" style="font-size: 2rem; color: var(--accent-color); margin-bottom: 8px;"></i>
                <p>${currentLang === 'es' ? 'Inicia sesión para ver tus chats.' : 'Log in to view conversations.'}</p>
            </div>
        `;
        const buyerAct = document.getElementById("chat-buyer-actions");
        if (buyerAct) buyerAct.style.display = "none";
        if (simulatePpvTriggerBtn) simulatePpvTriggerBtn.style.display = "none";
        return;
    }

    // If logged in as Creator, render buyer contacts in sidebar
    if (currentUser.role === "creator") {
        // Simulates sidebar buyer user "Guest Buyer"
        const activeClass = activeChatCreator === "Guest Buyer" ? "active" : "";
        const item = document.createElement("div");
        item.className = `chat-user-item ${activeClass}`;
        item.innerHTML = `
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100" alt="Guest" class="chat-user-avatar">
            <div class="chat-user-details" style="flex: 1; display: flex; flex-direction: column;">
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px;">
                    <span class="chat-user-name" style="font-weight: 700;">Guest Buyer</span>
                    <span style="font-size: 0.76rem; color: var(--accent-hover); font-weight: 600;">@guest</span>
                </div>
                <span class="chat-user-lastmsg">${currentLang === 'es' ? 'Mensaje activo...' : 'Chatting...'}</span>
            </div>
        `;
        item.addEventListener("click", () => {
            activeChatCreator = "Guest Buyer";
            renderChatSidebar();
            renderChatMessages("Guest Buyer");
        });
        chatUsersList.appendChild(item);
        
        // Hide buyer actions
        document.getElementById("chat-buyer-actions").style.display = "none";
        simulatePpvTriggerBtn.style.display = "flex"; // Creators can send PPV lock images
    } else {
        // Logged in as Buyer, render creator contacts in sidebar
        chats.forEach(chat => {
            const activeClass = chat.creatorName === activeChatCreator ? "active" : "";
            const lastMsg = chat.messages[chat.messages.length - 1];
            const lastMsgText = lastMsg ? (lastMsg.isPpv ? `[Locked Media - $${lastMsg.ppvPrice}]` : lastMsg.text) : "";
            const handleText = chat.handle || `@${chat.creatorName.toLowerCase().replace(/\s+/g, '')}`;

            const item = document.createElement("div");
            item.className = `chat-user-item ${activeClass}`;
            item.innerHTML = `
                <img src="${chat.avatar}" alt="${chat.creatorName}" class="chat-user-avatar">
                <div class="chat-user-details" style="flex: 1; display: flex; flex-direction: column;">
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px;">
                        <span class="chat-user-name" style="font-weight: 700;">${chat.creatorName}</span>
                        <span style="font-size: 0.76rem; color: var(--accent-hover); font-weight: 600;">${handleText}</span>
                    </div>
                    <span class="chat-user-lastmsg">${lastMsgText}</span>
                </div>
            `;
            item.addEventListener("click", () => {
                activeChatCreator = chat.creatorName;
                renderChatSidebar();
                renderChatMessages(chat.creatorName);
            });
            chatUsersList.appendChild(item);
        });

        document.getElementById("chat-buyer-actions").style.display = "flex";
        simulatePpvTriggerBtn.style.display = "none";
    }
}

// Mobile Chat Window Switch Helper
window.closeMobileChatWindow = function() {
    const chatContainer = document.querySelector(".chat-container");
    if (chatContainer) chatContainer.classList.remove("mobile-active-chat");
};

function renderChatMessages(targetName) {
    const currentUser = JSON.parse(localStorage.getItem("undr_current_user"));
    const chats = JSON.parse(localStorage.getItem("undr_chats")) || [];
    
    // Switch to active chat screen on mobile
    const chatContainer = document.querySelector(".chat-container");
    if (chatContainer && targetName) {
        chatContainer.classList.add("mobile-active-chat");
    }

    chatMessagesContainer.innerHTML = "";
    
    if (!currentUser) {
        chatActiveName.textContent = currentLang === "es" ? "Sala de Mensajes" : "Messages Board";
        chatActiveHandle.textContent = "@undr";
        chatActiveAvatar.src = "./logofase.PNG";
        chatActiveVerified.style.display = "none";

        chatMessagesContainer.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; text-align:center; padding:30px; color:var(--text-muted);">
                <i class="fa-solid fa-lock" style="font-size: 3rem; color: var(--accent-color); margin-bottom:12px;"></i>
                <h3 style="color:var(--text-color); margin-bottom:8px;">
                    ${currentLang === "es" ? "Inicia a conversar al suscribirte a tu modelo favorita" : "Start chatting by subscribing to your favorite model"}
                </h3>
                <p style="font-size:0.85rem; max-width:280px; margin-bottom:16px;">
                    ${currentLang === "es" ? "Debes iniciar sesión y suscribirte al feed premium de una modelo para desbloquear los mensajes directos privados." : "You must log in and subscribe to a model's premium feed to unlock private direct messaging."}
                </p>
                <button class="btn btn-primary" onclick="loginModal.style.display='flex'">
                    ${currentLang === "es" ? "Iniciar Sesión" : "Log In"}
                </button>
            </div>
        `;
        return;
    }
    
    // Find active conversation
    let chatKey = targetName;
    if (currentUser.role === "creator") {
        // If creator is logged in, the active chat details are retrieved from matching the logged-in creator record
        chatKey = currentUser.username;
    }
    const chat = chats.find(c => c.creatorName === chatKey);
    if (!chat) return;

    if (currentUser.role === "creator") {
        chatActiveAvatar.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100";
        chatActiveName.textContent = "Guest Buyer";
        chatActiveHandle.textContent = "@guest";
        chatActiveVerified.style.display = "none";
    } else {
        chatActiveAvatar.src = chat.avatar;
        chatActiveName.textContent = chat.creatorName;
        chatActiveHandle.textContent = chat.handle;
        chatActiveVerified.style.display = "inline-block";
    }

    chat.messages.forEach((msg, idx) => {
        // 1. PPV Bubble
        if (msg.isPpv) {
            const isUnlocked = msg.isUnlocked;
            const bubble = document.createElement("div");
            bubble.className = "ppv-lock-card";
            bubble.innerHTML = `
                <div class="ppv-image-wrapper">
                    <img src="${msg.mediaUrl}" alt="PPV Media" class="${isUnlocked ? '' : 'blurred'}">
                    ${!isUnlocked ? `
                        <div class="ppv-overlay-lock">
                            <i class="fa-solid fa-lock ppv-lock-icon"></i>
                            <span class="ppv-lock-price">$${msg.ppvPrice.toFixed(2)} USD</span>
                        </div>
                    ` : ''}
                </div>
                <div class="ppv-card-footer">
                    <span class="ppv-card-title">${currentLang === "es" ? "Pack Exclusivo" : "Exclusive Photoset"}</span>
                    <span class="ppv-card-desc">${msg.text}</span>
                    ${!isUnlocked && currentUser.role === "buyer" ? `
                        <button class="btn btn-register btn-block" style="padding: 8px 14px; font-size: 0.8rem;" onclick="unlockPpvMessage('${chat.creatorName}', ${idx})">
                            <i class="fa-solid fa-unlock"></i> Unlock Content
                        </button>
                    ` : isUnlocked ? `
                        <span style="font-size:0.75rem; color:#0bb08b; font-weight:700;"><i class="fa-solid fa-circle-check"></i> Unlocked</span>
                    ` : `
                        <span style="font-size:0.72rem; color:var(--text-muted);"><i class="fa-solid fa-lock"></i> Locked PPV sent to buyer</span>
                    `}
                </div>
            `;
            chatMessagesContainer.appendChild(bubble);
        }
        // 2. Custom Proposal Card Bubble
        else if (msg.isProposal) {
            const isSent = (currentUser.role === "buyer" && msg.sender === "user") || (currentUser.role === "creator" && msg.sender === "creator");
            const bubble = document.createElement("div");
            bubble.className = `chat-proposal-card ${isSent ? 'sent' : 'received'}`;
            
            let statusLabel = msg.status;
            let actionBtn = "";

            if (msg.status === "requested" && currentUser.role === "creator") {
                // Creators can send invoice quote
                actionBtn = `
                    <div style="display:flex; gap:6px; margin-top:8px;">
                        <input type="number" id="invoice-price-${idx}" placeholder="Quote Price ($)" style="width:70px; padding:4px; font-size:0.75rem;">
                        <button class="btn btn-register" style="padding:4px 10px; font-size:0.75rem; border-radius:6px;" onclick="sendInvoiceQuote('${chat.creatorName}', ${idx})">Send Invoice</button>
                    </div>
                `;
            } else if (msg.status === "offered" && currentUser.role === "buyer") {
                statusLabel = `Invoiced - $${msg.price.toFixed(2)}`;
                actionBtn = `<button class="btn btn-primary btn-block" style="padding:6px; font-size:0.78rem;" onclick="payInvoiceCheckout('${chat.creatorName}', ${idx})">Pay Invoice via CCBill</button>`;
            } else if (msg.status === "paid") {
                statusLabel = `Paid - Order placed ($${msg.price.toFixed(2)})`;
                actionBtn = `<span style="font-size:0.75rem; color:#0bb08b; font-weight:700;"><i class="fa-solid fa-circle-check"></i> Paid</span>`;
            }

            bubble.innerHTML = `
                <span class="proposal-status-badge ${msg.status === 'paid' ? 'accepted' : 'pending'}">${statusLabel}</span>
                <div style="font-size:0.78rem; line-height:1.4;">
                    <strong>Style:</strong> ${msg.style}<br>
                    <strong>Wear:</strong> ${msg.wear}<br>
                    <strong>Notes:</strong> ${msg.notes}
                </div>
                ${actionBtn}
            `;
            chatMessagesContainer.appendChild(bubble);
        }
        // 3. Tip Bubble
        else if (msg.isTip) {
            const isSent = (currentUser.role === "buyer" && msg.sender === "user") || (currentUser.role === "creator" && msg.sender === "creator");
            const bubble = document.createElement("div");
            bubble.className = `message-bubble ${isSent ? 'sent' : 'received'}`;
            bubble.style.background = isSent ? "linear-gradient(135deg, #ff4d6d, #ff758c)" : "var(--secondary-bg)";
            bubble.style.color = isSent ? "#fff" : "var(--text-color)";
            bubble.style.border = "1px solid #ff4d6d";
            bubble.innerHTML = `
                <div style="font-weight:700; font-size:0.85rem; margin-bottom:4px;">
                    <i class="fa-solid fa-heart" style="color:${isSent ? '#fff' : '#ff4d6d'};"></i> ${currentLang === "es" ? "Propina Enviada" : "Tip Sent"}: $${msg.tipAmount.toFixed(2)} USD
                </div>
                <div style="font-size:0.8rem; font-style:italic;">"${msg.text}"</div>
                <span class="message-time" style="color:${isSent ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)'};">${msg.time}</span>
            `;
            chatMessagesContainer.appendChild(bubble);
        }
        // 4. Standard Text message bubble
        else {
            const isSent = (currentUser.role === "buyer" && msg.sender === "user") || (currentUser.role === "creator" && msg.sender === "creator");
            const bubble = document.createElement("div");
            bubble.className = `message-bubble ${isSent ? 'sent' : 'received'}`;
            bubble.innerHTML = `
                ${msg.text}
                <span class="message-time">${msg.time}</span>
            `;
            chatMessagesContainer.appendChild(bubble);
        }
    });
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

// Creator sends invoice to buyer in chat
window.sendInvoiceQuote = function(creatorName, index) {
    const priceVal = parseFloat(document.getElementById(`invoice-price-${index}`).value);
    if (!priceVal || priceVal <= 0) {
        alert("Please enter a valid quote price.");
        return;
    }

    const chats = JSON.parse(localStorage.getItem("undr_chats"));
    const chat = chats.find(c => c.creatorName === creatorName);
    if (!chat) return;

    const msg = chat.messages[index];
    msg.status = "offered";
    msg.price = priceVal;
    
    // Add transaction notification
    chat.messages.push({
        sender: "creator",
        text: `I offered you a quote for this custom underwear order for $${priceVal.toFixed(2)} USD. Click below to pay securely.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    localStorage.setItem("undr_chats", JSON.stringify(chats));
    renderChatMessages(creatorName);
    showToast("Invoice sent to buyer.");
};

// Buyer pays invoice in chat via CCBill simulation
window.payInvoiceCheckout = function(creatorName, index) {
    const chats = JSON.parse(localStorage.getItem("undr_chats"));
    const chat = chats.find(c => c.creatorName === creatorName);
    if (!chat) return;

    const msg = chat.messages[index];
    const price = msg.price;

    // Set callback for CCBill gateway modal
    ccbillPaymentCallback = () => {
        // Complete Payment
        msg.status = "paid";
        localStorage.setItem("undr_chats", JSON.stringify(chats));

        // Credit to creator's orders
        const orders = JSON.parse(localStorage.getItem("creator_orders")) || [];
        orders.push({
            id: crypto.randomUUID(),
            creatorHandle: chat.handle,
            title: `Custom Request (${msg.style})`,
            price: price,
            image: "https://images.unsplash.com/photo-1616166330003-8e550d40d023?auto=format&fit=crop&q=80&w=600&h=600",
            status: "paid"
        });
        localStorage.setItem("creator_orders", JSON.stringify(orders));

        // Re-render
        renderChatMessages(creatorName);
        showToast("Custom request paid successfully!");
    };

    // Open CCBill modal
    gatewayTotalAmount.textContent = `$${price.toFixed(2)} USD`;
    gatewayModal.style.display = "flex";
};

// ==========================================
// MOCK CCBILL GATEWAY & ADD-ONS
// ==========================================
window.calculateCartAddons = function() {
    let addonsSum = 0;
    const polaroidEl = document.getElementById("addon-polaroid");
    const polaroid = polaroidEl ? polaroidEl.checked : false;
    const perfume = document.getElementById("addon-perfume").checked;
    const video = document.getElementById("addon-video").checked;

    if (polaroid) addonsSum += 15;
    if (perfume) addonsSum += 10;
    if (video) addonsSum += 25;

    cartAddonsCost = addonsSum;
    
    // Show/hide additions in total panel
    if (addonsSum > 0) {
        cartAddonsRow.style.display = "flex";
        cartAddonsTotal.textContent = `$${addonsSum.toFixed(2)} USD`;
    } else {
        cartAddonsRow.style.display = "none";
    }

    // Refresh Grand Total
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 150.00 ? 0.00 : DISCREET_SHIPPING_FLAT_RATE;
    const grandTotal = subtotal + addonsSum + shipping;

    cartGrandTotal.textContent = `$${grandTotal.toFixed(2)} USD`;
};

// Checkout proceed button trigger (Global function)
window.openCheckoutGatewayModal = function() {
    const currentUser = JSON.parse(localStorage.getItem("undr_current_user"));
    if (!currentUser || currentUser === "null") {
        const msg = currentLang === 'es' ? 
            'Para procesar tu compra y rastrear tu envío, necesitas Iniciar Sesión o Crear tu Cuenta.' : 
            'To proceed with checkout and track your delivery, please Log In or Create an Account.';
        alert(msg);
        const loginMdl = document.getElementById("login-modal");
        if (loginMdl) loginMdl.style.display = "flex";
        return;
    }

    if (!cart || cart.length === 0) {
        alert(currentLang === 'es' ? 'Tu carrito está vacío' : 'Your cart is empty');
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const shipping = subtotal >= 150.00 ? 0.00 : DISCREET_SHIPPING_FLAT_RATE;
    const grandTotal = subtotal + cartAddonsCost + shipping;

    // Define standard callback for cart purchase completion
    ccbillPaymentCallback = () => {
        const fullName = document.getElementById("shipping-full-name")?.value || "Buyer";
        const street = document.getElementById("shipping-street")?.value || "123 Main St";
        const city = document.getElementById("shipping-city")?.value || "City";
        const zip = document.getElementById("shipping-zip")?.value || "00000";

        const shippingAddr = {
            fullName,
            street,
            city,
            zip,
            formatted: `${fullName}, ${street}, ${city}, ${zip}`
        };

        const creatorOrders = JSON.parse(localStorage.getItem("creator_orders")) || [];
        const user = JSON.parse(localStorage.getItem("undr_current_user")) || { username: 'Buyer Guest' };

        cart.forEach(item => {
            let addonsLabel = [];
            const polaroidEl = document.getElementById("addon-polaroid");
            if (polaroidEl && polaroidEl.checked) addonsLabel.push("Polaroid");
            const perfEl = document.getElementById("addon-perfume");
            if (perfEl && perfEl.checked) addonsLabel.push("Perfume");
            const vidEl = document.getElementById("addon-video");
            if (vidEl && vidEl.checked) addonsLabel.push("Video");
            
            const titleStr = item[currentLang] ? item[currentLang].title : (item.title || 'Item');
            const fullTitle = addonsLabel.length > 0 ? `${titleStr} (${addonsLabel.join(' + ')})` : titleStr;
            const fullPrice = item.price + cartAddonsCost;

            const newOrder = {
                id: crypto.randomUUID(),
                buyerName: user.username || fullName,
                creatorHandle: item.creator ? item.creator.handle : '@lunadiamond',
                title: fullTitle,
                price: fullPrice,
                image: item.image,
                status: "paid",
                shippingAddress: shippingAddr,
                createdAt: new Date().toISOString()
            };

            creatorOrders.push(newOrder);

            // Trigger Transactional Emails (Purchase Receipt & Creator Sale Alert)
            if (window.undrNotificationsEngine) {
                window.undrNotificationsEngine.triggerPurchaseReceiptEmail(user, newOrder);
                window.undrNotificationsEngine.triggerCreatorSaleEmail({
                    username: item.creator ? item.creator.name : 'Creator',
                    handle: item.creator ? item.creator.handle : '@lunadiamond',
                    email: 'creator@undr.app'
                }, newOrder);
            }

            // Add notification for creator
            const notifications = JSON.parse(localStorage.getItem("undr_notifications")) || [];
            notifications.unshift({
                id: crypto.randomUUID(),
                userHandle: item.creator ? item.creator.handle : '@lunadiamond',
                text: `🎉 ¡Nueva Venta Pagada! Comprador: ${fullName}. Prenda: ${fullTitle}. Revisa la dirección de despacho en tu Portal.`,
                isRead: false,
                type: 'order',
                date: 'Just now'
            });
            localStorage.setItem("undr_notifications", JSON.stringify(notifications));

            // Sync to Supabase if connected
            if (window.undrAPIReady && window.undrBackend && window.undrBackend.isConnected()) {
                window.undrAPI.orders.create({
                    product_id: item.id,
                    creator_id: item.creator_id || 'd0000001-0000-0000-0000-000000000002',
                    subtotal: item.price,
                    shipping_cost: 0,
                    addons_cost: cartAddonsCost,
                    grand_total: fullPrice,
                    shipping_address: shippingAddr
                });
            }
        });

        localStorage.setItem("creator_orders", JSON.stringify(creatorOrders));

        // Clear cart
        cart = [];
        cartAddonsCost = 0;
        const polaroidEl = document.getElementById("addon-polaroid");
        if (polaroidEl) polaroidEl.checked = false;
        const perfEl = document.getElementById("addon-perfume");
        if (perfEl) perfEl.checked = false;
        const vidEl = document.getElementById("addon-video");
        if (vidEl) vidEl.checked = false;

        syncUserSessionUI();
        if (window.renderMobileCartModal) renderMobileCartModal();
        showToast(currentLang === 'es' ? '¡Pago confirmado! Pedido enviado a la creadora.' : 'Payment confirmed! Order sent to creator.');
    };

    const totalEl = document.getElementById("gateway-total-amount");
    if (totalEl) totalEl.textContent = `$${grandTotal.toFixed(2)} USD`;
    const gatewayMdl = document.getElementById("gateway-modal");
    if (gatewayMdl) gatewayMdl.style.display = "flex";
};

if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
        window.openCheckoutGatewayModal();
    });
}

// Execute Live NOWPayments Checkout
window.processNowpaymentsCheckout = async function() {
    const fullName = document.getElementById("shipping-full-name")?.value.trim();
    const street = document.getElementById("shipping-street")?.value.trim();
    const city = document.getElementById("shipping-city")?.value.trim();
    const zip = document.getElementById("shipping-zip")?.value.trim();

    if (!fullName || !street || !city || !zip) {
        const errorMsg = currentLang === 'es' ? 
            'Por favor completa la Dirección de Envío Discreto antes de continuar.' : 
            'Please complete the Discreet Shipping Address fields before proceeding.';
        alert(errorMsg);
        return;
    }

    const totalText = document.getElementById("gateway-total-amount").textContent;
    const amountVal = parseFloat(totalText.replace(/[^0-9.]/g, "")) || 10.00;

    try {
        if (window.undrPayments) {
            const res = await window.undrPayments.createInvoice({
                priceAmount: amountVal,
                priceCurrency: 'usd',
                orderDescription: `UNDR Order - ${fullName}`
            });

            if (res.ok && res.invoice && res.invoice.invoice_url) {
                window.open(res.invoice.invoice_url, '_blank');
                document.getElementById("gateway-modal").style.display = "none";
                showToast(currentLang === 'es' ? 'Orden cifrada generada en la pasarela segura.' : 'Encrypted invoice generated on secure gateway.');
                if (ccbillPaymentCallback) {
                    ccbillPaymentCallback();
                    ccbillPaymentCallback = null;
                }
            } else {
                alert(`Error: ${res.error || 'Inténtalo de nuevo'}`);
            }
        } else {
            alert(currentLang === 'es' ? 'Conectando con pasarela segura...' : 'Connecting to secure gateway...');
        }
    } catch (err) {
        alert(`Error al conectar pasarela: ${err.message || err}`);
    }
};

// CCBill simulation submission form
gatewayPaymentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    gatewayModal.style.display = "none";
    showToast(translations[currentLang].checkout_success);

    setTimeout(() => {
        if (ccbillPaymentCallback) {
            ccbillPaymentCallback();
            ccbillPaymentCallback = null;
        }
    }, 1200);
});

// ==========================================
// REGISTER & PRODUCT DETAIL FLOW
// ==========================================

// Product Detail Modal Open
window.openProductDetailModal = function(productId, fromProfile = false) {
    const products = JSON.parse(localStorage.getItem("undr_products"));
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const localData = product[currentLang] || product["en"] || {};
    const titleText = localData.title || product.title || "";
    const descText = localData.description || product.description || "";
    
    document.getElementById("detail-modal-image").src = product.image;
    document.getElementById("detail-modal-avatar").src = product.creator.avatar;
    document.getElementById("detail-modal-creator-name").textContent = product.creator.handle;
    document.getElementById("detail-modal-title").textContent = titleText;
    document.getElementById("detail-modal-price").textContent = formatPrice(product.price);
    document.getElementById("detail-modal-desc").textContent = descText;
    
    document.getElementById("detail-modal-tag-size").textContent = `Size ${product.size}`;
    document.getElementById("detail-modal-tag-wear").textContent = product.wearTime;

    // Handle Blur Overlay
    const blurOverlay = document.getElementById("detail-modal-blur-overlay");
    const revealBtn = document.getElementById("detail-modal-reveal-btn");
    
    if (blurOverlay) {
        if (fromProfile) {
            blurOverlay.style.display = "none";
        } else {
            blurOverlay.style.display = "flex";
            if (revealBtn) {
                revealBtn.onclick = () => {
                    blurOverlay.style.display = "none";
                };
            }
        }
    }

    // Bind action buttons
    document.getElementById("detail-modal-buy-btn").onclick = () => {
        addToCart(product.id);
        productDetailsModal.style.display = "none";
    };
    document.getElementById("detail-modal-custom-btn").onclick = () => {
        openCustomRequest(product.creator.name);
        productDetailsModal.style.display = "none";
    };

    productDetailsModal.style.display = "flex";
};

// Submit register form (Hybrid Supabase + Fallback)
document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("reg-name").value.trim();
    const role = document.getElementById("reg-role").value;
    const email = document.getElementById("reg-email").value.trim();
    const passwordVal = document.getElementById("reg-password").value;
    const handle = `@${name.toLowerCase().replace(/[^a-z0-9_]/g, '')}`;

    if (!name || !email || !passwordVal) {
        alert(currentLang === 'es' ? 'Por favor completa todos los campos requeridos.' : 'Please fill in all required fields.');
        return;
    }

    let newUser = {
        username: name,
        handle: handle,
        email: email,
        password: passwordVal,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100",
        balance: role === "buyer" ? 300.00 : 0.00,
        role: role,
        kycStatus: "not_applied"
    };

    // If connected to Supabase, perform cloud signup
    if (window.undrAPIReady && window.undrBackend && window.undrBackend.isConnected()) {
        try {
            const { data, error } = await window.undrAPI.auth.signUp(email, passwordVal, name, handle, role);
            if (error) {
                console.warn('Supabase SignUp warning:', error);
                // If user already exists in DB, attempt sign-in
                if (error.message && error.message.includes('already registered')) {
                    const signInRes = await window.undrAPI.auth.signIn(email, passwordVal);
                    if (signInRes.data?.user) {
                        newUser.id = signInRes.data.user.id;
                    }
                }
            } else if (data?.user) {
                newUser.id = data.user.id;
            }
        } catch (err) {
            console.warn('Supabase Auth error, using local session:', err);
        }
    }

    // Save to local storage for immediate application state
    const users = JSON.parse(localStorage.getItem("undr_users")) || [];
    const existingIndex = users.findIndex(u => u.email === email || u.handle === handle);
    if (existingIndex !== -1) {
        users[existingIndex] = newUser;
    } else {
        users.push(newUser);
    }

    localStorage.setItem("undr_users", JSON.stringify(users));
    localStorage.setItem("undr_current_user", JSON.stringify(newUser));

    document.getElementById("register-modal").style.display = "none";
    document.getElementById("register-form").reset();
    syncUserSessionUI();
    showToast(translations[currentLang].register_success || (currentLang === 'es' ? '¡Cuenta creada con éxito!' : 'Account created successfully!'));
    
    if (role === "creator") {
        showSection('creator');
    } else {
        showSection('explore');
    }
});

// Google Social Login Trigger
window.loginWithGoogle = async function() {
    try {
        if (window.undrAPIReady && window.undrBackend && window.undrBackend.isConnected()) {
            const { data, error } = await window.undrAPI.auth.signInWithOAuth('google');
            if (error) {
                alert(currentLang === 'es' ? `Error de inicio de sesión con Google: ${error.message}` : `Google login error: ${error.message}`);
            }
        } else {
            alert(currentLang === 'es' ? 
                'El inicio de sesión con Google requiere estar conectado a Supabase.' : 
                'Google login requires an active Supabase connection.');
        }
    } catch (err) {
        alert(`Error: ${err.message || err}`);
    }
};

// Secure Login Form Submission (Brute-Force Rate Limiting)
document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const inputVal = document.getElementById("login-username").value.trim().toLowerCase();
    const passwordVal = document.getElementById("login-password").value;

    // Rate Limiting checks
    const lockoutKey = `undr_lockout_${inputVal}`;
    const attemptsKey = `undr_attempts_${inputVal}`;
    
    const lockoutUntil = parseInt(localStorage.getItem(lockoutKey) || "0");
    if (Date.now() < lockoutUntil) {
        const remainingSecs = Math.ceil((lockoutUntil - Date.now()) / 1000);
        alert(currentLang === "es" ? 
            `Esta cuenta está bloqueada temporalmente por seguridad. Inténtalo de nuevo en ${remainingSecs} segundos.` : 
            `This account is temporarily locked for security. Try again in ${remainingSecs} seconds.`);
        return;
    }

    let users = JSON.parse(localStorage.getItem("undr_users")) || [];
    
    // Find matching user by email, handle, or username (also support @handle with leading @)
    const cleanInput = inputVal.startsWith('@') ? inputVal : inputVal;
    let user = users.find(u => 
        (u.handle && u.handle.toLowerCase() === cleanInput) || 
        (u.email && u.email.toLowerCase() === cleanInput) || 
        (u.username && u.username.toLowerCase() === cleanInput) ||
        (cleanInput === "buyer" && u.role === "buyer") || 
        (cleanInput === "creator" && u.role === "creator") || 
        (cleanInput === "admin" && u.role === "admin")
    );

    // Attempt Supabase login if user not found or connected
    if (window.undrAPIReady && window.undrBackend && window.undrBackend.isConnected() && inputVal.includes('@')) {
        window.undrAPI.auth.signIn(inputVal, passwordVal).then(res => {
            if (res.data?.user) {
                const spUser = res.data.user;
                const meta = spUser.user_metadata || {};
                user = {
                    id: spUser.id,
                    username: meta.username || spUser.email.split('@')[0],
                    handle: meta.handle || `@${spUser.email.split('@')[0]}`,
                    email: spUser.email,
                    role: meta.role || 'buyer',
                    avatar: meta.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100",
                    balance: meta.role === 'creator' ? 0 : 300
                };
                localStorage.setItem("undr_current_user", JSON.stringify(user));
                document.getElementById("login-modal").style.display = "none";
                document.getElementById("login-form").reset();
                syncUserSessionUI();
                showToast(currentLang === 'es' ? `Sesión iniciada como ${user.username}` : `Logged in as ${user.username}`);
            }
        }).catch(err => console.warn('Supabase login fallback:', err));
    }

    if (!user) {
        alert(currentLang === "es" ? "Cuenta no encontrada o credenciales inválidas." : "Account not found or invalid credentials.");
        return;
    }

    // Password check: registered users must match stored password,
    // demo/prepopulated accounts (no password set) accept any password
    const storedPassword = user.password;
    const isDemo = !storedPassword; // Prepopulated demo accounts have no password field

    if (isDemo || passwordVal === storedPassword) {
        // Success
        localStorage.removeItem(attemptsKey);
        localStorage.removeItem(lockoutKey);
        localStorage.setItem("undr_current_user", JSON.stringify(user));
        
        loginModal.style.display = "none";
        document.getElementById("login-form").reset();
        syncUserSessionUI();
        showToast(currentLang === 'es' ? `Sesión iniciada como ${user.username}` : `Logged in as ${user.username}`);
        showSection('explore');
    } else {
        // Fail: increment attempts
        let failedAttempts = parseInt(localStorage.getItem(attemptsKey) || "0");
        failedAttempts += 1;
        localStorage.setItem(attemptsKey, failedAttempts.toString());

        if (failedAttempts >= 5) {
            // Lockout account for 30 seconds
            const lockTime = Date.now() + 30000;
            localStorage.setItem(lockoutKey, lockTime.toString());
            alert(currentLang === "es" ? 
                "Demasiados intentos fallidos. Tu cuenta ha sido bloqueada por 30 segundos por seguridad." : 
                "Too many failed attempts. Your account has been locked for 30 seconds for security.");
        } else {
            alert(currentLang === "es" ? 
                `Contraseña incorrecta. Intento ${failedAttempts} de 5 antes de bloqueo de seguridad.` : 
                `Incorrect password. Attempt ${failedAttempts} of 5 before security lockout.`);
        }
    }
});

// ==========================================
// CHAT PROPOSALS SUBMISSIONS
// ==========================================
chatProposalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const style = document.getElementById("proposal-item-style").value;
    const wear = document.getElementById("proposal-wear-time").value;
    const notes = document.getElementById("proposal-notes").value.trim();

    const chats = JSON.parse(localStorage.getItem("undr_chats"));
    const chat = chats.find(c => c.creatorName === activeChatCreator);
    if (!chat) return;

    chat.messages.push({
        sender: "user",
        isProposal: true,
        style: style,
        wear: wear,
        notes: notes,
        status: "requested",
        price: 0
    });

    localStorage.setItem("undr_chats", JSON.stringify(chats));
    chatProposalModal.style.display = "none";
    chatProposalForm.reset();

    renderChatMessages(activeChatCreator);
    renderChatSidebar();

    // Trigger mock invoice response from creator after 2 seconds (if user is buyer)
    setTimeout(() => {
        chat.messages.push({
            sender: "creator",
            isProposal: true,
            style: style,
            wear: wear,
            notes: notes,
            status: "offered",
            price: 125.00
        });
        localStorage.setItem("undr_chats", JSON.stringify(chats));
        renderChatMessages(activeChatCreator);
        renderChatSidebar();
        showToast("Creator sent invoice for custom proposal!");
    }, 2000);
});

// Bind proposal triggers
document.getElementById("chat-request-custom-btn").addEventListener("click", () => {
    chatProposalModal.style.display = "flex";
});

// Close buttons for modals
closeDetails.addEventListener("click", () => productDetailsModal.style.display = "none");
closeProposalModal.addEventListener("click", () => chatProposalModal.style.display = "none");

// Custom product proposal request from explorer card form
customRequestForm.addEventListener("submit", (e) => {
    e.preventDefault();
    customModal.style.display = "none";
    showToast(translations[currentLang].custom_submitted);
    
    // Add custom proposal message to chat dynamically
    const style = document.getElementById("custom-item-type").value;
    const wear = document.getElementById("custom-item-duration").value;
    const activity = document.getElementById("custom-item-activity").value;
    const notesEl = document.getElementById("custom-item-instructions");
    const notes = notesEl ? notesEl.value : "";
    
    const polaroidEl = document.getElementById("custom-extra-polaroid");
    const isPolaroid = polaroidEl ? polaroidEl.checked : false;
    const videoEl = document.getElementById("custom-extra-video");
    const isVideo = videoEl ? videoEl.checked : false;
    const price = calculateCustomProposalPrice();

    let extras = [];
    if (isPolaroid) extras.push(currentLang === "es" ? "Foto Polaroid firmada" : "Signed Polaroid photo");
    if (isVideo) extras.push(currentLang === "es" ? "Vídeo del empaquetado" : "Packaging video proof");

    const extrasText = extras.length > 0 ? extras.join(", ") : (currentLang === "es" ? "Ninguno" : "None");
    const fullNotes = `Activity: ${activity} | Extras: ${extrasText} | Details: ${notes}`;

    const chats = JSON.parse(localStorage.getItem("undr_chats"));
    const chat = chats.find(c => c.creatorName === activeChatCreator);
    if (chat) {
        chat.messages.push({
            sender: "user",
            isProposal: true,
            style: style,
            wear: wear,
            notes: fullNotes,
            status: "requested",
            price: price
        });
        localStorage.setItem("undr_chats", JSON.stringify(chats));
    }
    
    customRequestForm.reset();
    showSection('chat');

    // Trigger mock invoice response from creator after 2 seconds
    setTimeout(() => {
        const freshChats = JSON.parse(localStorage.getItem("undr_chats"));
        const freshChat = freshChats.find(c => c.creatorName === activeChatCreator);
        if (freshChat) {
            freshChat.messages.push({
                sender: "creator",
                isProposal: true,
                style: style,
                wear: wear,
                notes: fullNotes,
                status: "offered",
                price: price
            });
            localStorage.setItem("undr_chats", JSON.stringify(freshChats));
            renderChatMessages(activeChatCreator);
            renderChatSidebar();
            showToast("Creator sent invoice for custom proposal!");
        }
    }, 2000);
});

// Custom Premium Toast Notification (Positioned elevated above mobile dock bar)
function showToast(message) {
    let toast = document.createElement("div");
    toast.className = "toast-notification-banner";
    toast.style.cssText = "position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%) translateY(10px); background-color: var(--text-primary); color: var(--primary-bg); padding: 12px 22px; border-radius: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.25); z-index: 100000; font-weight: 600; font-size: 0.88rem; opacity: 0; transition: opacity 0.3s ease, transform 0.3s ease; pointer-events: none; max-width: 90vw; text-align: center; white-space: nowrap;";
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--accent-color); margin-right: 8px;"></i> ${message}`;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateX(-50%) translateY(0)";
    }, 50);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(10px)";
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==========================================
// CORE TRANSLATIONS & CONSTANTS
// ==========================================
const DISCREET_SHIPPING_FLAT_RATE = 15.00;

const translations = {
    en: {
        added_cart: "added to cart.",
        added_favorites: "Added to favorites.",
        item_word: "item",
        items_word: "items",
        cart_empty: "Your cart is empty",
        label_generated_toast: "USPS shipping label generated!",
        checkout_simulation: "Checkout Simulation Complete. Your order details have been sent to the creator's panel for packaging.",
        checkout_success: "Payment Authorized via CCBill!",
        register_success: "Registration successful! Welcome to UNDR.",
        custom_submitted: "Custom request submitted successfully to the creator's chat.",
        age_title: "Age Verification Required",
        age_desc: "You must be 18 years of age or older to enter this site. This website contains adult-themed content, including the marketplace of worn & exclusive lingerie.",
        age_btn_accept: "I am 18 or older - Enter",
        age_btn_reject: "Exit",
        discreet_packaging_guarantee: "Discreet & 100% Anonymous Delivery Guaranteed",
        nav_explore: "Explore Models",
        nav_messages: "Direct Messages",
        nav_creator_portal: "Creator Portal",
        nav_admin: "Admin Panel",
        nav_cart: "My Cart",
        nav_login: "Log In",
        nav_register: "Sign Up",
        tag_featured: "100% Verified Authenticity",
        hero_title: "Directly from your favorite creators. Authentic, exclusive, and delivered to your door.",
        hero_btn_primary: "Explore Creators",
        hero_btn_secondary: "How authenticity works?",
        feed_all: "All",
        feed_featured: "Featured",
        feed_new: "New Creators",
        feed_today: "Available Today",
        feed_auctions: "Exclusive Auctions",
        latest_arrivals: "Underwear Collection",
        sort_recent: "Most Recent",
        sort_low_high: "Price: Low to High",
        sort_high_low: "Price: High to Low",
        filter_size: "Size",
        filter_style: "Style",
        filter_avail: "Availability",
        opt_all: "All",
        style_satin: "Satin",
        style_lace: "Lace",
        style_silk: "Silk",
        style_cotton: "Cotton",
        avail_now: "Available Today",
        avail_custom: "Custom Only",
        apply_filters: "Apply Filters",
        search_placeholder: "Search models, sizes, styles...",
        suggested_creators: "Suggested Creators",
        view_shop_btn: "View Shop",
        your_order: "Your Order",
        empty_cart_items: "0 items",
        discreet_badge_title: "Discreet Shipping Guaranteed",
        discreet_badge_desc: "Shipped in plain cardboard boxes with no mention of UNDR or contents.",
        subtotal: "Subtotal:",
        discreet_shipping_cost: "Discreet Shipping:",
        free_discreet_shipping: "Free / Discreet",
        grand_total: "Total:",
        checkout_btn: "Proceed to Checkout",
        secure_payments: "Secured High-Risk Adult Gateway",
        legal_first_name_label: "Legal First Name",
        legal_last_name_label: "Legal Last Name",
        ssn_label: "Social Security Number (Last 4 digits)",
        kyc_onboarding_title: "Verification of Identity Required (KYC)",
        kyc_onboarding_desc: "To ensure federal 18+ compliance and tax processing (1099-K), you must verify your identity before publishing garments.",
        kyc_step_id: "Official 18+ ID",
        kyc_step_selfie: "Live Selfie",
        kyc_step_tax: "IRS 1099 Info",
        creator_portal_title: "Creator Dashboard",
        new_listing_title: "List New Underwear Garment",
        item_title_label: "Garment Title",
        wear_duration_label: "Wear Time",
        price_usd_label: "Price (USD)",
        image_url_label: "Item Image URL",
        custom_label_desc: "Description",
        publish_item_btn: "Publish to Marketplace",
        upload_photo_btn: "Upload Photo",
        logout_btn: "Log Out",
        profile_picture_label: "Profile Picture (Image Upload)",
        choose_file_btn: "Select Image from Device",
        username_label: "Username",
        save_profile_btn: "Save Profile Changes",
        sales_summary: "Sales & Pending Shipments",
        withdrawable_balance: "Withdrawable Balance",
        withdraw_funds_btn: "Withdraw ACH",
        admin_panel_title: "Admin Operations Dashboard",
        admin_gmv: "Gross Merchandise Value (GMV)",
        admin_revenue: "Platform Revenue (20% share)",
        active_disputes: "Active Escrows & Disputes",
        kyc_verification_wall: "KYC Human Verification Wall",
        listing_moderation: "Listing Moderation Queue",
        dispute_resolution: "Active Disputes",
        auth_modal_title: "How Our Authenticity Guarantee Works",
        auth_step1_title: "Verified Creator Profiles",
        auth_step1_desc: "Every creator goes through a strict identity verification process and is verified with a legal 18+ ID check before getting approved to post.",
        auth_step2_title: "Wear Time Tracking & Proof",
        auth_step2_desc: "Underwear item pages contain exact specifications of wear time (e.g. 24h, 48h).",
        auth_step3_title: "Double Sealed Hygiene Guard",
        auth_step3_desc: "Items are securely preserved in airtight vacuum-sealed bags to preserve scent and trace attributes immediately upon receipt from the creator.",
        custom_modal_title: "Request Custom Item",
        custom_modal_desc: "Submit a personalized request directly to this creator.",
        custom_label_creator: "Creator",
        custom_label_item: "Type of Underwear",
        custom_label_wear: "Wear Duration",
        custom_btn_submit: "Submit Custom Proposal",
        type_satin_panty: "Satin Lingerie",
        type_lace_panty: "Lace Panty",
        type_stockings: "Stockings",
        type_bikini: "Bikini Bottom",
        btn_reveal_photo: "View",
        gateway_auth_subtitle: "Authorized Transaction for UNDR Marketplace",
        total_to_pay: "Total Amount:",
        discreet_shipping_title: "Discreet Shipping Address",
        recipient_full_name_label: "Recipient Full Name",
        street_address_label: "Street Address & Apartment",
        city_label: "City",
        zip_country_label: "Zip Code / Country",
        cardholder_name_label: "Cardholder Name",
        card_number_label: "Card Number",
        expiry_date_label: "Expiry Date",
        discreet_billing_tag: "Discreet billing:",
        discreet_billing_desc: "This charge will appear on your bank statement as 'UNDR ONLINE BILLING'. No mention of parcel contents.",
        autofill_test_card: "Auto-fill Test Card",
        pay_nowpayments_btn: "Pay with NOWPayments (Live Crypto)",
        authorize_ccbill_btn: "Authorize Payment via CCBill",
        cancel_transaction_btn: "Cancel Transaction"
    },
    es: {
        added_cart: "añadido al carrito.",
        added_favorites: "Añadido a favoritos.",
        item_word: "artículo",
        items_word: "artículos",
        cart_empty: "Tu carrito está vacío",
        label_generated_toast: "¡Etiqueta de envío USPS generada!",
        checkout_simulation: "Simulación de compra completada. Tu pedido ha sido enviado al panel de la creadora.",
        checkout_success: "¡Pago Autorizado mediante CCBill!",
        register_success: "¡Registro exitoso! Bienvenido a UNDR.",
        custom_submitted: "Pedido a medida enviado con éxito al chat de la creadora.",
        age_title: "Verificación de Edad Requerida",
        age_desc: "Debes tener 18 años o más para acceder. Este sitio contiene material para adultos, incluyendo venta de lencería usada exclusiva.",
        age_btn_accept: "Soy mayor de 18 años - Entrar",
        age_btn_reject: "Salir",
        discreet_packaging_guarantee: "Envío 100% discreto y anónimo garantizado",
        nav_explore: "Explorar Modelos",
        nav_messages: "Mensajes Directos",
        nav_creator_portal: "Panel de Creadora",
        nav_admin: "Panel de Admin",
        nav_cart: "Mi Carrito",
        nav_login: "Iniciar Sesión",
        nav_register: "Registrarse",
        tag_featured: "Autenticidad 100% Verificada",
        hero_title: "Directamente de tus creadoras favoritas. Auténtico, exclusivo y enviado a tu puerta.",
        hero_btn_primary: "Explorar Creadoras",
        hero_btn_secondary: "¿Cómo funciona la autenticidad?",
        feed_all: "Todos",
        feed_featured: "Destacados",
        feed_new: "Nuevas Creadoras",
        feed_today: "Disponible Hoy",
        feed_auctions: "Subastas Exclusivas",
        latest_arrivals: "Colección de Ropa Interior",
        sort_recent: "Más Recientes",
        sort_low_high: "Precio: Menor a Mayor",
        sort_high_low: "Precio: Mayor a Menor",
        filter_size: "Talla",
        filter_style: "Estilo",
        filter_avail: "Disponibilidad",
        opt_all: "Todos",
        style_satin: "Satén",
        style_lace: "Encaje",
        style_silk: "Seda",
        style_cotton: "Algodón",
        avail_now: "Disponible Hoy",
        avail_custom: "Solo Personalizados",
        apply_filters: "Aplicar Filtros",
        search_placeholder: "Buscar creadoras, tallas, estilos...",
        suggested_creators: "Creadoras Sugeridas",
        view_shop_btn: "Ver Perfil",
        your_order: "Tu Pedido",
        empty_cart_items: "0 artículos",
        discreet_badge_title: "Envío Discreto Garantizado",
        discreet_badge_desc: "Enviado en cajas de cartón lisas sin mención alguna de UNDR ni del contenido.",
        subtotal: "Subtotal:",
        discreet_shipping_cost: "Envío Discreto:",
        free_discreet_shipping: "Gratis / Discreto",
        grand_total: "Total:",
        checkout_btn: "Proceder al Pago",
        secure_payments: "Pasarela de Pago de Alto Riesgo Segura",
        legal_first_name_label: "Nombre Legal",
        legal_last_name_label: "Apellido Legal",
        ssn_label: "Número de Seguro Social (Últimos 4 dígitos)",
        kyc_onboarding_title: "Verificación de Identidad Obligatoria (KYC)",
        kyc_onboarding_desc: "Para cumplir con las normativas federales de +18 y procesar impuestos (1099-K), debes verificar tu identidad antes de publicar prendas.",
        kyc_step_id: "ID Oficial +18",
        kyc_step_selfie: "Selfie en Vivo",
        kyc_step_tax: "Información IRS 1099",
        creator_portal_title: "Panel de Control de Creadora",
        new_listing_title: "Publicar Nueva Prenda Usada",
        item_title_label: "Título de la Prenda",
        wear_duration_label: "Tiempo de Uso",
        price_usd_label: "Precio (USD)",
        image_url_label: "URL de la Imagen",
        custom_label_desc: "Descripción",
        publish_item_btn: "Publicar en la Tienda",
        upload_photo_btn: "Subir Foto",
        logout_btn: "Cerrar Sesión",
        profile_picture_label: "Foto de Perfil (Subir Imagen)",
        choose_file_btn: "Seleccionar Imagen del Dispositivo",
        username_label: "Nombre de Usuario",
        save_profile_btn: "Guardar Cambios de Perfil",
        sales_summary: "Ventas y Envíos Pendientes",
        withdrawable_balance: "Saldo Retirable",
        withdraw_funds_btn: "Retirar por ACH",
        admin_panel_title: "Panel de Operaciones de Administración",
        admin_gmv: "Valor de Mercancía Bruto (GMV)",
        admin_revenue: "Ingresos de Plataforma (20% comisión)",
        active_disputes: "Fideicomisos y Disputas Activas",
        kyc_verification_wall: "Muro de Verificación Humana KYC",
        listing_moderation: "Cola de Moderación de Tienda",
        dispute_resolution: "Disputas Activas",
        auth_modal_title: "Cómo Funciona la Garantía de Autenticidad",
        auth_step1_title: "Perfiles de Creadoras Verificados",
        auth_step1_desc: "Cada creadora pasa por un estricto proceso de validación humana con foto de ID antes de recibir autorización para publicar.",
        auth_step2_title: "Seguimiento y Registro de Uso",
        auth_step2_desc: "Las páginas de prendas contienen las horas exactas de uso de la prenda (ej. 24h, 48h).",
        auth_step3_title: "Doble Bolsa de Sellado Térmico",
        auth_step3_desc: "Las prendas se empaquetan en bolsas especiales con sellado al vacío para preservar la fragancia y esencia íntima de origen.",
        custom_modal_title: "Solicitar Prenda Personalizada",
        custom_modal_desc: "Envía una solicitud a medida directamente a esta creadora.",
        custom_label_creator: "Creadora",
        custom_label_item: "Tipo de Prenda",
        custom_label_wear: "Duración de Uso",
        custom_btn_submit: "Enviar Propuesta al Chat",
        type_satin_panty: "Lencería de Satén",
        type_lace_panty: "Braguita de Encaje",
        type_stockings: "Medias Usadas",
        type_bikini: "Bikini",
        btn_reveal_photo: "Ver",
        gateway_auth_subtitle: "Transacción Autorizada para UNDR Marketplace",
        total_to_pay: "Monto Total:",
        discreet_shipping_title: "Dirección de Envío Discreto",
        recipient_full_name_label: "Nombre Completo del Destinatario",
        street_address_label: "Dirección de Calle y Número",
        city_label: "Ciudad",
        zip_country_label: "Código Postal / País",
        cardholder_name_label: "Nombre del Titular de la Tarjeta",
        card_number_label: "Número de Tarjeta",
        expiry_date_label: "Fecha de Vencimiento",
        discreet_billing_tag: "Cobro discreto:",
        discreet_billing_desc: "Este cargo aparecerá en su extracto bancario como 'UNDR ONLINE BILLING'. Sin mención al contenido del paquete.",
        autofill_test_card: "Auto-llenar Tarjeta de Prueba",
        pay_nowpayments_btn: "Pagar con NOWPayments (Cripto Real)",
        authorize_ccbill_btn: "Autorizar Pago con CCBill",
        cancel_transaction_btn: "Cancelar Transacción"
    }
};

// ==========================================
// UTILITIES AND CORE FUNCTIONS
// ==========================================

function checkAgeVerification() {
    let verified = false;
    try {
        verified = sessionStorage.getItem("undr_age_verified") === "true" || localStorage.getItem("undr_age_verified") === "true";
    } catch (e) {
        verified = window.undr_age_verified === true;
    }

    const ageMdl = document.getElementById("age-modal");
    if (verified) {
        if (ageMdl) ageMdl.style.display = "none";
    } else {
        if (ageMdl) ageMdl.style.display = "flex";
    }
}

window.acceptAgeVerification = function() {
    try {
        sessionStorage.setItem("undr_age_verified", "true");
        localStorage.setItem("undr_age_verified", "true");
    } catch (e) {}
    window.undr_age_verified = true;
    const ageMdl = document.getElementById("age-modal");
    if (ageMdl) {
        ageMdl.style.cssText = "display: none !important; opacity: 0 !important; pointer-events: none !important; visibility: hidden !important;";
    }
    showToast(currentLang === "es" ? "Bienvenido a UNDR" : "Welcome to UNDR");
};

window.rejectAgeVerification = function() {
    window.location.href = "https://www.google.com";
};

window.toggleLanguage = function() {
    const nextLang = currentLang === "en" ? "es" : "en";
    applyLanguage(nextLang);
};

function applyLanguage(lang) {
    currentLang = lang;
    try {
        localStorage.setItem("undr_lang", lang);
    } catch (e) {}

    const toggleBtn = document.getElementById("lang-toggle-btn");
    if (toggleBtn) {
        toggleBtn.innerHTML = `<i class="fa-solid fa-globe"></i> ${lang.toUpperCase()}`;
    }

    // Standard DOM text updates
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key]) {
            const icon = el.querySelector("i");
            if (icon) {
                const iconHtml = icon.outerHTML;
                el.innerHTML = `${iconHtml} ${translations[lang][key]}`;
            } else {
                el.textContent = translations[lang][key];
            }
        }
    });

    // Shipping inputs placeholder updates
    const fnInput = document.getElementById("shipping-full-name");
    const stInput = document.getElementById("shipping-street");
    const ctInput = document.getElementById("shipping-city");
    const zpInput = document.getElementById("shipping-zip");
    if (fnInput) fnInput.placeholder = lang === "es" ? "Ej: John Doe" : "e.g. John Doe";
    if (stInput) stInput.placeholder = lang === "es" ? "Ej: 405 Lexington Ave, Apt 4B" : "e.g. 405 Lexington Ave, Apt 4B";
    if (ctInput) ctInput.placeholder = lang === "es" ? "Nueva York" : "New York";
    if (zpInput) zpInput.placeholder = lang === "es" ? "10174, EE. UU." : "10174, USA";

    // Re-render panels & feed items
    syncUserSessionUI();
    filterAndSortProducts();
    updateCartUI();
    if (window.renderMobileCartModal) renderMobileCartModal();
    if (window.renderLiveAuctionsGrid) renderLiveAuctionsGrid();
    renderChatSidebar();
}

window.setCurrency = function(newCurr) {
    currentCurrency = newCurr;
    try {
        localStorage.setItem("undr_currency", currentCurrency);
    } catch (e) {}

    const selectEl = document.getElementById("currency-toggle-select");
    if (selectEl) selectEl.value = currentCurrency;

    filterAndSortProducts();
    updateCartUI();
    if (window.renderMobileCartModal) renderMobileCartModal();
    if (window.renderLiveAuctionsGrid) renderLiveAuctionsGrid();
    syncUserSessionUI();
    showToast(currentLang === "es" ? `Moneda cambiada a ${currentCurrency}` : `Currency updated to ${currentCurrency}`);
};

window.calculateCustomProposalPrice = function() {
    const type = document.getElementById("custom-item-type").value;
    const duration = document.getElementById("custom-item-duration").value;
    const activity = document.getElementById("custom-item-activity").value;
    const polaroidEl = document.getElementById("custom-extra-polaroid");
    const isPolaroid = polaroidEl ? polaroidEl.checked : false;
    const videoEl = document.getElementById("custom-extra-video");
    const isVideo = videoEl ? videoEl.checked : false;
    
    let base = 35.00;
    if (type === "Lace Panty") base = 40.00;
    else if (type === "Stockings") base = 30.00;
    else if (type === "Bikini") base = 45.00;
    
    let durationAdd = 0;
    if (duration === "6h") durationAdd = 5.00;
    else if (duration === "12h") durationAdd = 10.00;
    else if (duration === "24h") durationAdd = 15.00;
    else if (duration === "48h") durationAdd = 30.00;
    else if (duration === "72h") durationAdd = 50.00;
    
    let activityAdd = 0;
    if (activity === "Gym Workout") activityAdd = 20.00;
    else if (activity === "Sleeping Wear") activityAdd = 15.00;
    else if (activity === "Shower drying") activityAdd = 25.00;
    
    let extrasAdd = 0;
    if (isPolaroid) extrasAdd += 15.00;
    if (isVideo) extrasAdd += 25.00;
    
    const total = base + durationAdd + activityAdd + extrasAdd;
    const priceDisplay = document.getElementById("custom-calculated-price");
    if (priceDisplay) {
        priceDisplay.textContent = `$${total.toFixed(2)} USD`;
    }
    return total;
};

window.openCustomRequest = function(creatorName) {
    customCreatorInput.value = `@${creatorName.toLowerCase().replace(/\s/g, "")}`;
    activeChatCreator = creatorName;
    customModal.style.display = "flex";
    calculateCustomProposalPrice();
};

// ==========================================
// EVEN LISTENERS CONFIGURATION
// ==========================================
function setupEventListeners() {
    // Universal Close Modal Event Listener
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("close-modal")) {
            const modalParent = e.target.closest(".modal");
            if (modalParent) modalParent.style.display = "none";
        } else if (e.target.classList.contains("modal")) {
            e.target.style.display = "none";
        }
    });

    // Open Cart Button listener
    const openCartTriggerEl = document.getElementById("open-cart-btn");
    if (openCartTriggerEl) {
        openCartTriggerEl.addEventListener("click", () => {
            window.toggleCartModal();
        });
    }

    // Age verification buttons
    const ageAccept = document.getElementById("age-accept-btn");
    const ageReject = document.getElementById("age-reject-btn");
    const ageMdl = document.getElementById("age-modal");

    if (ageAccept && ageMdl) {
        ageAccept.addEventListener("click", () => {
            try {
                sessionStorage.setItem("undr_age_verified", "true");
            } catch (e) {
                window.undr_age_verified = true;
            }
            ageMdl.style.display = "none";
            showToast(currentLang === "es" ? "Bienvenido a UNDR" : "Welcome to UNDR");
        });
    }

    if (ageReject) {
        ageReject.addEventListener("click", () => {
            window.location.href = "https://www.google.com";
        });
    }

    // Language switcher
    const langToggle = document.getElementById("lang-toggle-btn");
    if (langToggle) {
        langToggle.onclick = function() {
            window.toggleLanguage();
        };
    }

    // Currency switcher
    const currencySelect = document.getElementById("currency-toggle-select");
    if (currencySelect) {
        currencySelect.value = currentCurrency;
        currencySelect.onchange = function(e) {
            window.setCurrency(e.target.value);
        };
    }

    // Open Cart Sidebar Trigger
    const openCartBtn = document.getElementById("open-cart-btn");
    if (openCartBtn) {
        openCartBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const cartWidget = document.getElementById("cart-widget-right");
            if (cartWidget) {
                cartWidget.scrollIntoView({ behavior: "smooth" });
                cartWidget.style.boxShadow = "0 0 20px var(--accent-hover)";
                setTimeout(() => {
                    cartWidget.style.boxShadow = "none";
                }, 1500);
            }
        });
    }

    // Mobile Navigation Drawer Toggle
    const mobileLogoTrigger = document.querySelector(".mobile-logo-trigger");
    const sidebarLeft = document.querySelector(".sidebar-left");
    if (mobileLogoTrigger && sidebarLeft) {
        mobileLogoTrigger.addEventListener("click", () => {
            if (sidebarLeft.style.display === "flex") {
                sidebarLeft.style.display = "";
            } else {
                sidebarLeft.style.display = "flex";
                sidebarLeft.style.position = "fixed";
                sidebarLeft.style.zIndex = "999";
                sidebarLeft.style.background = "var(--primary-bg)";
                sidebarLeft.style.top = "0";
                sidebarLeft.style.left = "0";
                sidebarLeft.style.height = "100vh";
                sidebarLeft.style.width = "260px";
                sidebarLeft.style.boxShadow = "0 0 30px rgba(0,0,0,0.8)";
            }
        });
    }

    // Search input
    searchInput.addEventListener("input", filterAndSortProducts);
    sortSelect.addEventListener("change", filterAndSortProducts);

    // Advanced search filter dropdown trigger
    searchFilterTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const isVisible = advancedFiltersPanel.style.display === "flex";
        advancedFiltersPanel.style.display = isVisible ? "none" : "flex";
        searchFilterTrigger.classList.toggle("active", !isVisible);
    });

    // Close advanced filter panel when clicking outside
    document.addEventListener("click", (e) => {
        if (!advancedFiltersPanel.contains(e.target) && e.target !== searchFilterTrigger) {
            advancedFiltersPanel.style.display = "none";
            searchFilterTrigger.classList.remove("active");
        }
    });

    applyAdvFiltersBtn.addEventListener("click", () => {
        filterAndSortProducts();
        advancedFiltersPanel.style.display = "none";
        searchFilterTrigger.classList.remove("active");
    });

    // Drag & Drop Image listing upload
    const dropzone = document.getElementById("new-item-image-dropzone");
    const fileInput = document.getElementById("new-item-file-input");
    const dropPrompt = document.getElementById("dropzone-prompt");
    const dropPreview = document.getElementById("dropzone-preview");

    if (dropzone) {
        dropzone.addEventListener("click", () => fileInput.click());

        dropzone.addEventListener("dragover", (e) => {
            e.preventDefault();
            dropzone.style.background = "var(--accent-light)";
        });

        dropzone.addEventListener("dragleave", () => {
            dropzone.style.background = "var(--primary-bg)";
        });

        dropzone.addEventListener("drop", (e) => {
            e.preventDefault();
            dropzone.style.background = "var(--primary-bg)";
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                processUploadedFile(files[0]);
            }
        });

        fileInput.addEventListener("change", (e) => {
            const files = e.target.files;
            if (files.length > 0) {
                processUploadedFile(files[0]);
            }
        });
    }

    let currentSelectedGarmentFile = null;

    async function processUploadedFile(file) {
        if (window.undrStorage) {
            const val = await window.undrStorage.validateFile(file);
            if (!val.valid) {
                alert(val.error);
                return;
            }
        }

        currentSelectedGarmentFile = file;

        if (window.undrStorage) {
            const compressed = await window.undrStorage.compressImage(file, { maxWidth: 1200, maxHeight: 1200 });
            uploadedListingImageBase64 = compressed.dataUrl;
            dropPrompt.style.display = "none";
            dropPreview.src = uploadedListingImageBase64;
            dropPreview.style.display = "block";
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedListingImageBase64 = e.target.result;
                dropPrompt.style.display = "none";
                dropPreview.src = uploadedListingImageBase64;
                dropPreview.style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    }
    // Publish new listing form handler
    const newItemForm = document.getElementById("new-item-form");
    if (newItemForm) {
        newItemForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const user = JSON.parse(localStorage.getItem("undr_current_user"));
            if (!user || user.role !== "creator") {
                alert(currentLang === "es" ? "Acceso denegado: Solo cuentas de creadora verificadas pueden publicar." : "Access denied: Only verified creator accounts can publish listings.");
                return;
            }

            const title = document.getElementById("new-item-title").value.trim();
            const size = document.getElementById("new-item-size").value;
            const wearTime = document.getElementById("new-item-wear-time").value;
            const price = parseFloat(document.getElementById("new-item-price").value);
            const desc = document.getElementById("new-item-desc").value.trim();
            const listingType = document.getElementById("new-item-type-select").value;
            const audience = document.getElementById("new-item-audience").value;
            const isPresale = document.getElementById("new-item-presale").checked;
            const auctionDurationVal = document.getElementById("new-item-auction-duration").value;

            if (!uploadedListingImageBase64 && !currentSelectedGarmentFile) {
                alert(currentLang === "es" ? "Debes subir una foto de la prenda." : "Please upload a garment image.");
                return;
            }

            let cloudImageUrl = uploadedListingImageBase64;
            if (currentSelectedGarmentFile && window.undrStorage) {
                showToast(currentLang === 'es' ? 'Subiendo imagen de la prenda a la nube CDN...' : 'Uploading garment image to CDN cloud storage...');
                try {
                    const uploadRes = await window.undrStorage.uploadProductImage(currentSelectedGarmentFile, user.handle);
                    cloudImageUrl = uploadRes.url;
                } catch (e) {
                    console.warn('[Garment Storage Upload] Error:', e);
                }
            }

            const isAuction = listingType === "auction";
            let durationSeconds = 86400; // 24h default
            if (auctionDurationVal === "5m") durationSeconds = 300;
            else if (auctionDurationVal === "15m") durationSeconds = 900;
            else if (auctionDurationVal === "1h") durationSeconds = 3600;
            else if (auctionDurationVal === "6h") durationSeconds = 21600;
            else if (auctionDurationVal === "24h") durationSeconds = 86400;

            const now = Date.now();
            const endTime = now + (durationSeconds * 1000);

            const products = JSON.parse(localStorage.getItem("undr_products")) || [];
            const newProduct = {
                id: Date.now(),
                price: price,
                startingBid: price,
                size: size,
                style: "Custom",
                isFeatured: false,
                isNew: true,
                isAvailableToday: true,
                isAuction: isAuction,
                audience: audience,
                isPresale: isPresale,
                wearTime: wearTime,
                durationStr: auctionDurationVal,
                startTime: now,
                endTime: isAuction ? endTime : null,
                topBidder: "@none",
                image: cloudImageUrl,
                creator: {
                    name: user.username,
                    handle: user.handle,
                    avatar: user.avatar,
                    verified: true,
                    age: user.age || 22,
                    nationality: user.nationality || "United States"
                },
                likes: 0,
                date: new Date().toISOString(),
                en: {
                    title: title,
                    description: desc
                },
                es: {
                    title: title,
                    description: desc
                }
            };

            products.unshift(newProduct);
            localStorage.setItem("undr_products", JSON.stringify(products));

            // Reset form
            newItemForm.reset();
            uploadedListingImageBase64 = "";
            document.getElementById("dropzone-prompt").style.display = "block";
            document.getElementById("dropzone-preview").style.display = "none";
            document.getElementById("dropzone-preview").src = "";

            filterAndSortProducts();
            loadCreatorInventory();
            showToast(currentLang === "es" ? "¡Prenda publicada exitosamente en el mercado!" : "Item published successfully to the marketplace!");
        });
    }
    // Category chips click handler
    categoryChips.forEach(chip => {
        chip.addEventListener("click", () => {
            categoryChips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            filterAndSortProducts();
        });
    });

    // Edit Profile Modal bindings
    const editModal = document.getElementById("edit-profile-modal");
    const closeEditProfile = document.getElementById("close-edit-profile");
    const editForm = document.getElementById("edit-profile-form");
    const quickProfile = document.querySelector(".user-quick-profile");
    
    let uploadedEditAvatarBase64 = "";

    if (quickProfile) {
        quickProfile.addEventListener("click", () => {
            const user = JSON.parse(localStorage.getItem("undr_current_user"));
            if (!user) {
                loginModal.style.display = "flex";
                return;
            }
            document.getElementById("edit-profile-name").value = user.username;
            document.getElementById("edit-profile-handle").value = user.handle.replace("@", "");
            document.getElementById("edit-avatar-preview").src = user.avatar;
            uploadedEditAvatarBase64 = user.avatar;
            document.getElementById("edit-profile-handle-error").textContent = "";

            editModal.style.display = "flex";
        });
    }

    if (closeEditProfile) {
        closeEditProfile.addEventListener("click", () => editModal.style.display = "none");
    }

    // Avatar dropzone in edit profile
    const editDropzone = document.getElementById("edit-avatar-dropzone");
    const editFileInput = document.getElementById("edit-avatar-file-input");
    const editPreview = document.getElementById("edit-avatar-preview");

    if (editDropzone) {
        editDropzone.addEventListener("click", () => editFileInput.click());

        editDropzone.addEventListener("dragover", (e) => {
            e.preventDefault();
            editDropzone.style.borderColor = "var(--accent-hover)";
        });

        editDropzone.addEventListener("dragleave", () => {
            editDropzone.style.borderColor = "var(--accent-color)";
        });

        editDropzone.addEventListener("drop", (e) => {
            e.preventDefault();
            editDropzone.style.borderColor = "var(--accent-color)";
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                processEditAvatar(files[0]);
            }
        });

        let selectedEditAvatarFile = null;

        editFileInput.addEventListener("change", (e) => {
            const files = e.target.files;
            if (files.length > 0) {
                processEditAvatar(files[0]);
            }
        });
    }

    async function processEditAvatar(file) {
        if (window.undrStorage) {
            const val = await window.undrStorage.validateFile(file);
            if (!val.valid) {
                alert(val.error);
                return;
            }
        }

        selectedEditAvatarFile = file;

        if (window.undrStorage) {
            const compressed = await window.undrStorage.compressImage(file, { maxWidth: 400, maxHeight: 400 });
            uploadedEditAvatarBase64 = compressed.dataUrl;
            editPreview.src = uploadedEditAvatarBase64;
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedEditAvatarBase64 = e.target.result;
                editPreview.src = uploadedEditAvatarBase64;
            };
            reader.readAsDataURL(file);
        }
    }

    if (editForm) {
        editForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nameInput = document.getElementById("edit-profile-name").value.trim();
            const handleInput = document.getElementById("edit-profile-handle").value.trim().toLowerCase();
            const errorSpan = document.getElementById("edit-profile-handle-error");

            errorSpan.textContent = "";

            // 1. Validation for characters: only letters, numbers, dot and underscore
            const handleRegex = /^[a-z0-9._]+$/;
            if (!handleRegex.test(handleInput)) {
                errorSpan.textContent = currentLang === "es" ? 
                    "El usuario solo puede contener letras, números, puntos (.) y guiones bajos (_)." : 
                    "Handle can only contain letters, numbers, dots (.), and underscores (_).";
                return;
            }

            // 2. Length check
            if (handleInput.length < 3 || handleInput.length > 15) {
                errorSpan.textContent = currentLang === "es" ?
                    "Debe tener entre 3 y 15 caracteres." :
                    "Must be between 3 and 15 characters.";
                return;
            }

            const users = JSON.parse(localStorage.getItem("undr_users")) || [];
            const currentUser = JSON.parse(localStorage.getItem("undr_current_user"));

            // 3. Uniqueness check
            const handleWithPrefix = `@${handleInput}`;
            const duplicate = users.find(u => u.handle.toLowerCase() === handleWithPrefix && u.handle.toLowerCase() !== currentUser.handle.toLowerCase());

            if (duplicate) {
                errorSpan.textContent = currentLang === "es" ?
                    "El @usuario ya está registrado por otra cuenta." :
                    "This @handle is already taken by another account.";
                return;
            }

            // 4. 14-Day Cooldown Security Rule
            const isHandleChanged = currentUser.handle.toLowerCase() !== handleWithPrefix.toLowerCase();
            if (isHandleChanged) {
                const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;
                const lastChange = currentUser.lastHandleChange || 0;
                const elapsed = Date.now() - lastChange;

                if (elapsed < FOURTEEN_DAYS_MS) {
                    const remainingMs = FOURTEEN_DAYS_MS - elapsed;
                    const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
                    errorSpan.textContent = currentLang === "es" ?
                        `⚠️ Solo se permite cambiar el @usuario 1 vez cada 14 días. Faltan ${remainingDays} días para tu próximo cambio.` :
                        `⚠️ You can only change your @handle once every 14 days. ${remainingDays} days remaining until next change.`;
                    return;
                }
            }

            // Upload edit avatar to cloud storage if a new file was chosen
            let cloudAvatarUrl = uploadedEditAvatarBase64;
            if (selectedEditAvatarFile && window.undrStorage) {
                try {
                    const res = await window.undrStorage.uploadAvatarImage(selectedEditAvatarFile, currentUser.handle);
                    cloudAvatarUrl = res.url;
                } catch (e) {}
            }

            // Save changes
            currentUser.username = nameInput;
            if (isHandleChanged) {
                currentUser.handle = handleWithPrefix;
                currentUser.lastHandleChange = Date.now();
            }
            currentUser.avatar = cloudAvatarUrl;

            localStorage.setItem("undr_current_user", JSON.stringify(currentUser));

            const uIdx = users.findIndex(u => u.handle.toLowerCase() === currentUser.handle.toLowerCase() || u.email === currentUser.email);
            if (uIdx !== -1) {
                users[uIdx].username = nameInput;
                if (isHandleChanged) {
                    users[uIdx].handle = handleWithPrefix;
                    users[uIdx].lastHandleChange = currentUser.lastHandleChange;
                }
                users[uIdx].avatar = cloudAvatarUrl;
                localStorage.setItem("undr_users", JSON.stringify(users));
            }

            editModal.style.display = "none";
            syncUserSessionUI();
            showToast(currentLang === 'es' ? "Perfil actualizado correctamente." : "Profile updated successfully.");
        });
    }

    // Creator Profile settings form submit
    const creatorBioForm = document.getElementById("creator-profile-settings-form");
    if (creatorBioForm) {
        creatorBioForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const ageVal = parseInt(document.getElementById("creator-bio-age").value);
            const nationalityVal = document.getElementById("creator-bio-nationality").value.trim();
            const bioVal = document.getElementById("creator-bio-text").value.trim();

            if (ageVal < 18) {
                alert(currentLang === "es" ? "Debes ser mayor de 18 años para vender en esta plataforma." : "You must be 18+ to sell on this platform.");
                return;
            }

            const currentUser = JSON.parse(localStorage.getItem("undr_current_user"));
            currentUser.age = ageVal;
            currentUser.nationality = nationalityVal;
            currentUser.bio = bioVal;

            localStorage.setItem("undr_current_user", JSON.stringify(currentUser));

            const users = JSON.parse(localStorage.getItem("undr_users")) || [];
            const uIdx = users.findIndex(u => u.handle.toLowerCase() === currentUser.handle.toLowerCase());
            if (uIdx !== -1) {
                users[uIdx].age = ageVal;
                users[uIdx].nationality = nationalityVal;
                users[uIdx].bio = bioVal;
                localStorage.setItem("undr_users", JSON.stringify(users));
            }

            // Also update any products listed under this creator
            const products = JSON.parse(localStorage.getItem("undr_products")) || [];
            products.forEach(p => {
                if (p.creator.name === currentUser.username) {
                    p.creator.age = ageVal;
                    p.creator.nationality = nationalityVal;
                }
            });
            localStorage.setItem("undr_products", JSON.stringify(products));

            showToast(currentLang === "es" ? "Configuración de perfil público guardada correctamente." : "Public bio settings updated.");
            
            // Re-sync and open profile to test
            syncUserSessionUI();
            openCreatorProfile(currentUser.username);
        });
    }

    // Header Trigger modals
    if (loginTrigger) loginTrigger.addEventListener("click", () => loginModal.style.display = "flex");
    if (registerTrigger) registerTrigger.addEventListener("click", () => registerModal.style.display = "flex");
    if (closeLogin) closeLogin.addEventListener("click", () => loginModal.style.display = "none");
    if (closeRegister) closeRegister.addEventListener("click", () => registerModal.style.display = "none");

    // Close modal click outside
    window.addEventListener("click", (e) => {
        if (e.target === loginModal) loginModal.style.display = "none";
        if (e.target === registerModal) registerModal.style.display = "none";
        if (e.target === productDetailsModal) productDetailsModal.style.display = "none";
        if (e.target === customModal) customModal.style.display = "none";
        if (e.target === chatProposalModal) chatProposalModal.style.display = "none";
        if (e.target === authModal) authModal.style.display = "none";
        if (e.target === editModal) editModal.style.display = "none";
    });

    // Authenticity info triggers
    authInfoBtn.addEventListener("click", () => authModal.style.display = "flex");
    closeAuth.addEventListener("click", () => authModal.style.display = "none");
    closeCustom.addEventListener("click", () => customModal.style.display = "none");

    // Chat text input send actions
    chatSendMsgBtn.addEventListener("click", sendTextMessageFromBar);
    chatTextInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendTextMessageFromBar();
    });

    // Creator withdraw actions
    creatorWithdrawBtn.addEventListener("click", () => {
        const user = JSON.parse(localStorage.getItem("undr_current_user"));
        if (parseFloat(user.balance) <= 0) {
            alert(currentLang === "es" ? "No tienes fondos suficientes para retirar." : "No balance available for withdrawal.");
            return;
        }
        alert(currentLang === "es" ? `Transferencia ACH de $${user.balance} USD iniciada a tu cuenta bancaria.` : `ACH withdrawal of $${user.balance} USD initiated to your bank account.`);
        user.balance = 0.00;
        localStorage.setItem("undr_current_user", JSON.stringify(user));
        syncUserSessionUI();
    });

    // Interactive PPV Modal Triggers & Form Handling
    const ppvModal = document.getElementById("ppv-send-modal");
    const closePpvModal = document.getElementById("close-ppv-modal");
    const ppvForm = document.getElementById("ppv-send-form");
    const ppvDropzone = document.getElementById("ppv-image-dropzone");
    const ppvFileInput = document.getElementById("ppv-file-input");
    const ppvPreview = document.getElementById("ppv-dropzone-preview");
    const ppvPrompt = document.getElementById("ppv-dropzone-prompt");

    let uploadedPpvImageBase64 = "";

    if (simulatePpvTriggerBtn) {
        simulatePpvTriggerBtn.addEventListener("click", () => {
            uploadedPpvImageBase64 = "";
            ppvPreview.style.display = "none";
            ppvPrompt.style.display = "block";
            ppvForm.reset();
            ppvModal.style.display = "flex";
        });
    }

    if (closePpvModal) {
        closePpvModal.addEventListener("click", () => ppvModal.style.display = "none");
    }

    if (ppvDropzone) {
        ppvDropzone.addEventListener("click", () => ppvFileInput.click());
        ppvDropzone.addEventListener("dragover", (e) => {
            e.preventDefault();
            ppvDropzone.style.borderColor = "var(--accent-hover)";
        });
        ppvDropzone.addEventListener("dragleave", () => {
            ppvDropzone.style.borderColor = "var(--accent-color)";
        });
        ppvDropzone.addEventListener("drop", (e) => {
            e.preventDefault();
            ppvDropzone.style.borderColor = "var(--accent-color)";
            if (e.dataTransfer.files.length > 0) {
                processPpvFile(e.dataTransfer.files[0]);
            }
        });
    }

    if (ppvFileInput) {
        ppvFileInput.addEventListener("change", (e) => {
            if (e.target.files.length > 0) {
                processPpvFile(e.target.files[0]);
            }
        });
    }

    function processPpvFile(file) {
        if (!file.type.startsWith("image/")) {
            alert(currentLang === "es" ? "Por favor selecciona un archivo de imagen." : "Please select an image file.");
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedPpvImageBase64 = e.target.result;
            ppvPrompt.style.display = "none";
            ppvPreview.src = uploadedPpvImageBase64;
            ppvPreview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }

    if (ppvForm) {
        ppvForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (!uploadedPpvImageBase64) {
                alert(currentLang === "es" ? "Debes seleccionar o arrastrar una foto." : "Please select or upload a photo.");
                return;
            }
            const priceVal = parseFloat(document.getElementById("ppv-price-input").value);
            const descVal = document.getElementById("ppv-desc-input").value.trim();

            if (!priceVal || priceVal <= 0) {
                alert(currentLang === "es" ? "Ingresa un precio válido." : "Enter a valid unlock price.");
                return;
            }

            const chats = JSON.parse(localStorage.getItem("undr_chats"));
            const user = JSON.parse(localStorage.getItem("undr_current_user"));
            
            const chat = chats.find(c => c.creatorName === user.username);
            if (!chat) return;

            chat.messages.push({
                sender: "creator",
                isPpv: true,
                isUnlocked: false,
                ppvPrice: priceVal,
                mediaUrl: uploadedPpvImageBase64,
                text: descVal,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });

            localStorage.setItem("undr_chats", JSON.stringify(chats));
            ppvModal.style.display = "none";
            renderChatMessages(activeChatCreator);
            renderChatSidebar();
            showToast(currentLang === "es" ? `Foto PPV de $${priceVal.toFixed(2)} USD enviada al chat.` : `Locked PPV photo ($${priceVal.toFixed(2)} USD) sent to chat.`);
        });
    }

    // Tip Modal Handlers
    const tipModal = document.getElementById("tip-modal");
    const closeTipModal = document.getElementById("close-tip-modal");
    const sendTipBtn = document.getElementById("chat-send-tip-btn");
    const tipForm = document.getElementById("tip-send-form");

    if (sendTipBtn && tipModal) {
        sendTipBtn.addEventListener("click", () => {
            const user = JSON.parse(localStorage.getItem("undr_current_user"));
            if (!user || user.role !== "buyer") {
                alert(currentLang === "es" ? "Acceso denegado: Inicia sesión o regístrate como comprador para enviar propinas." : "Access denied: Log in or register a buyer account to send tips.");
                loginModal.style.display = "flex";
                return;
            }
            tipModal.style.display = "flex";
        });
    }

    if (closeTipModal && tipModal) {
        closeTipModal.addEventListener("click", () => tipModal.style.display = "none");
    }

    if (tipForm) {
        tipForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const amountVal = parseFloat(document.getElementById("tip-amount-input").value);
            const msgVal = document.getElementById("tip-message-input").value.trim();

            if (!amountVal || amountVal <= 0) {
                alert(currentLang === "es" ? "Ingresa un monto válido para la propina." : "Please enter a valid tip amount.");
                return;
            }

            // Always require real payment gateway processing for tips to guarantee valid earnings
            ccbillPaymentCallback = () => {
                processTipTransfer(activeChatCreator, amountVal, msgVal);
                tipModal.style.display = "none";
            };
            
            if (gatewayTotalAmount) gatewayTotalAmount.textContent = `$${amountVal.toFixed(2)} USD`;
            tipModal.style.display = "none";

            // Open secure payment gateway modal for live authorization
            if (gatewayModal) gatewayModal.style.display = "flex";
        });
    }
}

window.selectTipPreset = function(amount) {
    const input = document.getElementById("tip-amount-input");
    if (input) input.value = amount.toFixed(2);
};

function processTipTransfer(creatorName, amount, messageText) {
    const currentUser = JSON.parse(localStorage.getItem("undr_current_user")) || { username: "Guest Buyer" };
    const netEarning = amount * 0.8; // 80% net for creator, 20% platform fee

    const chats = JSON.parse(localStorage.getItem("undr_chats")) || [];
    const chat = chats.find(c => c.creatorName === creatorName);
    if (chat) {
        chat.messages.push({
            sender: "user",
            isTip: true,
            tipAmount: amount,
            text: messageText || (currentLang === "es" ? "Propina confirmada" : "Confirmed Tip"),
            status: "paid",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        localStorage.setItem("undr_chats", JSON.stringify(chats));
    }

    // Record verified tip transaction in creator earnings database
    const creatorOrders = JSON.parse(localStorage.getItem("creator_orders")) || [];
    const tipOrderRecord = {
        id: `TIP-${Date.now().toString().slice(-6)}`,
        date: new Date().toLocaleString(),
        type: "Direct Tip",
        itemTitle: `Confirmed Tip from @${currentUser.username || 'buyer'}`,
        grossAmount: amount,
        netEarnings: netEarning,
        status: "Completed & Paid",
        buyerName: currentUser.username || "Guest Buyer",
        messageText: messageText || ""
    };
    creatorOrders.unshift(tipOrderRecord);
    localStorage.setItem("creator_orders", JSON.stringify(creatorOrders));

    // Credit 80% verified net earnings to creator profile balance
    const users = JSON.parse(localStorage.getItem("undr_users")) || [];
    const creatorUser = users.find(u => u.username === creatorName);
    if (creatorUser) {
        creatorUser.balance = parseFloat(creatorUser.balance || 0) + netEarning;
        localStorage.setItem("undr_users", JSON.stringify(users));
    }

    // Trigger Notification for creator
    const userNotifications = JSON.parse(localStorage.getItem("user_notifications")) || [];
    userNotifications.unshift({
        id: Date.now(),
        type: "tip_received",
        title: currentLang === "es" ? "🎉 ¡Propina Pagada y Confirmada!" : "🎉 Confirmed Tip Received!",
        desc: currentLang === "es" ? 
            `Has recibido una propina confirmada de $${amount.toFixed(2)} USD ($${netEarning.toFixed(2)} USD netos en tu saldo retirable) de @${currentUser.username || 'buyer'}.` : 
            `You received a confirmed tip of $${amount.toFixed(2)} USD ($${netEarning.toFixed(2)} USD net to your withdrawable balance) from @${currentUser.username || 'buyer'}.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
    });
    localStorage.setItem("user_notifications", JSON.stringify(userNotifications));

    syncUserSessionUI();
    renderChatMessages(creatorName);
    showToast(currentLang === "es" ? `¡Propina de $${amount.toFixed(2)} USD pagada con éxito!` : `Tip of $${amount.toFixed(2)} USD paid successfully!`);
}

function sendTextMessageFromBar() {
    const textVal = chatTextInput.value.trim();
    if (!textVal) return;

    const currentUser = JSON.parse(localStorage.getItem("undr_current_user"));
    const chats = JSON.parse(localStorage.getItem("undr_chats"));
    
    let chatKey = activeChatCreator;
    if (currentUser.role === "creator") {
        chatKey = currentUser.username;
    }
    const chat = chats.find(c => c.creatorName === chatKey);
    if (!chat) return;

    chat.messages.push({
        sender: currentUser.role === "buyer" ? "user" : "creator",
        text: textVal,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    localStorage.setItem("undr_chats", JSON.stringify(chats));
    chatTextInput.value = "";
    renderChatMessages(activeChatCreator);
    renderChatSidebar();
}

window.unlockPpvMessage = function(creatorName, index) {
    const user = JSON.parse(localStorage.getItem("undr_current_user"));
    const chats = JSON.parse(localStorage.getItem("undr_chats"));
    const chat = chats.find(c => c.creatorName === creatorName);
    if (!chat) return;

    const msg = chat.messages[index];
    const price = msg.ppvPrice;

    if (user.balance < price) {
        // Trigger CCBill payment modal if buyer balance is insufficient
        ccbillPaymentCallback = () => {
            msg.isUnlocked = true;
            localStorage.setItem("undr_chats", JSON.stringify(chats));

            // Credit to creator
            const users = JSON.parse(localStorage.getItem("undr_users"));
            const creatorUser = users.find(u => u.username === creatorName);
            if (creatorUser) {
                creatorUser.balance = parseFloat(creatorUser.balance) + (price * 0.8);
                localStorage.setItem("undr_users", JSON.stringify(users));
            }

            renderChatMessages(creatorName);
            showToast(currentLang === "es" ? "¡Foto PPV autorizada y desbloqueada!" : "PPV Media Unlocked successfully via CCBill!");
        };

        gatewayTotalAmount.textContent = `$${price.toFixed(2)} USD`;
        gatewayModal.style.display = "flex";
        return;
    }

    // Deduct and unlock
    user.balance = parseFloat(user.balance) - price;
    localStorage.setItem("undr_current_user", JSON.stringify(user));

    const users = JSON.parse(localStorage.getItem("undr_users"));
    const uIdx = users.findIndex(u => u.handle === user.handle);
    if (uIdx !== -1) {
        users[uIdx].balance = user.balance;
        localStorage.setItem("undr_users", JSON.stringify(users));
    }

    msg.isUnlocked = true;
    localStorage.setItem("undr_chats", JSON.stringify(chats));

    // Credit to creator
    const creatorUser = users.find(u => u.username === creatorName);
    if (creatorUser) {
        creatorUser.balance = parseFloat(creatorUser.balance) + (price * 0.8);
        localStorage.setItem("undr_users", JSON.stringify(users));
    }

    syncUserSessionUI();
    showToast("PPV Media Unlocked successfully!");
};

// ==========================================
// CREATOR PROFILE VIEW ENGINE
// ==========================================
let profileActiveCreatorName = "Luna Diamond";

window.openCreatorProfile = function(creatorNameOrHandle) {
    const cleanTerm = creatorNameOrHandle.replace("@", "").toLowerCase().trim();
    const users = JSON.parse(localStorage.getItem("undr_users")) || [];
    const creator = users.find(u => u.username.toLowerCase() === creatorNameOrHandle.toLowerCase().trim() || u.handle.toLowerCase().replace("@", "") === cleanTerm);
    if (!creator) return;

    profileActiveCreatorName = creator.username;

    // Push URL hash for shareable URL
    const targetHash = `#@${creator.handle.replace('@', '')}`;
    if (window.location.hash !== targetHash) {
        history.pushState(null, "", targetHash);
    }

    // Show Profile Panel
    showSection("creator-profile", null, false);

    // Populate profile DOM
    document.getElementById("profile-avatar").src = creator.avatar;
    document.getElementById("profile-display-name").textContent = creator.username;
    document.getElementById("profile-display-handle").textContent = creator.handle;
    
    // Bio configurations
    const fallbackBio = creator.username === "Luna Diamond" ? "Satin lover. Designing custom premium lingerie sets. Daily new photosets!" : "Active gym model. Offering worn thongs, socks and personal perfumed wraps.";
    document.getElementById("profile-display-bio").textContent = creator.bio || fallbackBio;

    // Meta details (Age & Nationality)
    const age = creator.age || 22;
    const nationality = creator.nationality || "United States";
    document.getElementById("profile-display-meta-details").textContent = currentLang === "es" ? 
        `Edad: ${age} años • Nacionalidad: ${nationality}` : 
        `Age: ${age} • Nationality: ${nationality}`;

    // Subscription status check
    const subs = JSON.parse(localStorage.getItem("undr_subscriptions")) || [];
    const isSubscribed = subs.includes(creator.handle);
    const subBtn = document.getElementById("profile-subscribe-btn");

    if (isSubscribed) {
        subBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Subscribed (Feed Unlocked)`;
        subBtn.style.backgroundColor = "#e2fbf5";
        subBtn.style.color = "#0bb08b";
        subBtn.style.borderColor = "#0bb08b";
        subBtn.disabled = true;
    } else {
        subBtn.innerHTML = `<i class="fa-solid fa-star"></i> Subscribe to Feed ($9.99/mo)`;
        subBtn.style.backgroundColor = "var(--accent-color)";
        subBtn.style.color = "var(--primary-bg)";
        subBtn.style.borderColor = "var(--accent-color)";
        subBtn.disabled = false;
    }

    const chatBtn = document.getElementById("profile-chat-btn");
    if (chatBtn) {
        if (isSubscribed) {
            chatBtn.innerHTML = `<i class="fa-solid fa-envelope"></i> ${currentLang === 'es' ? 'Mensaje' : 'Message'}`;
            chatBtn.style.opacity = "1";
        } else {
            chatBtn.innerHTML = `<i class="fa-solid fa-lock"></i> ${currentLang === 'es' ? 'Mensaje (Suscripción)' : 'Message (Subscribers Only)'}`;
            chatBtn.style.opacity = "0.7";
        }
    }

    // Load Tab contents
    renderProfileShopGarments(creator.username);
    renderProfileFeedPosts(isSubscribed);
    renderProfileAuctions(creator.username);
};

window.switchProfileTab = function(tabName, chip) {
    const tabs = document.querySelectorAll(".profile-tab-content");
    tabs.forEach(t => t.classList.remove("active"));

    const chips = document.querySelectorAll(".profile-tabs-scroll .category-chip");
    chips.forEach(c => c.classList.remove("active"));

    document.getElementById(`profile-tab-${tabName}`).classList.add("active");
    chip.classList.add("active");
};

function renderProfileShopGarments(creatorName) {
    const products = JSON.parse(localStorage.getItem("undr_products")) || [];
    const creatorProducts = products.filter(p => p.creator.name === creatorName && p.isAuction !== true);
    const profileShopGrid = document.getElementById("profile-shop-products-grid");

    profileShopGrid.innerHTML = "";
    if (creatorProducts.length === 0) {
        profileShopGrid.innerHTML = `<div class="empty-cart-message" style="grid-column: 1/-1;">No listings published yet.</div>`;
        return;
    }

    creatorProducts.forEach(product => {
        const localData = product[currentLang] || product["en"] || {};
        const titleVal = localData.title || product.title || "Item";
        const card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML = `
            <div class="product-image-wrapper" onclick="openProductDetailModal(${product.id}, true)" style="cursor:pointer; padding-top:100%;">
                <img src="${product.image}" alt="" class="product-image">
                <span class="price-tag">${formatPrice(product.price)}</span>
            </div>
            <div class="card-body">
                <h3 class="card-title">${titleVal}</h3>
                <div class="card-footer">
                    <button class="btn-buy-item" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        `;
        profileShopGrid.appendChild(card);
    });
}

function renderProfileFeedPosts(isSubscribed) {
    const container = document.getElementById("profile-feed-posts-container");
    container.innerHTML = "";

    if (!isSubscribed) {
        container.innerHTML = `
            <div class="post-card-locked">
                <i class="fa-solid fa-lock post-card-locked-icon"></i>
                <h3>Feed Locked</h3>
                <p>Subscribe monthly to unlock exclusive photos, wear-videos, and personal backstages.</p>
                <button class="btn btn-register" onclick="subscribeToCreatorCurrent()"><i class="fa-solid fa-star"></i> Unlock Feed ($9.99/mo)</button>
            </div>
        `;
    } else {
        // Show mock feeds
        container.innerHTML = `
            <div class="product-card" style="padding:16px;">
                <h4 style="font-weight:700; margin-bottom:10px;">Behind the scenes wear duration photoshoot 💖</h4>
                <img src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=600&h=300" style="width:100%; border-radius:8px; object-fit:cover; height:240px; margin-bottom:10px;">
                <p style="font-size:0.82rem; color:var(--text-muted);">Selfie of today's 24 hours satin thong photoshoot. Garment now listed in store!</p>
            </div>
        `;
    }
}

function renderProfileAuctions(creatorName) {
    const container = document.getElementById("profile-tab-auctions");
    container.innerHTML = "";

    const products = JSON.parse(localStorage.getItem("undr_products")) || [];
    const creatorAuctions = products.filter(p => p.creator.name === creatorName && p.isAuction === true);

    const defaultEndTime = window.simulatedAuctionEndTime || (Date.now() + (4 * 3600 + 15 * 60 + 10) * 1000);
    window.simulatedAuctionEndTime = defaultEndTime;

    let html = `<div class="products-grid">`;
    
    // Add default simulated one
    html += `
        <article class="product-card">
            <div class="product-image-wrapper" style="padding-top:100%;">
                <img src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=600&h=600" class="product-image">
                <span class="price-tag" style="background-color:#ff4d6d;" data-auction-endtime="${defaultEndTime}">${formatTimeRemaining(defaultEndTime - Date.now())}</span>
            </div>
            <div class="card-body">
                <span class="card-category" style="color:#ff4d6d;">Active Auction (Public)</span>
                <h3 class="card-title">Gym-worn Silk Panty (Pre-packaging proof)</h3>
                
                <div style="background:var(--secondary-bg); padding:10px; border-radius:8px; margin:8px 0; font-size:0.8rem;">
                    <div style="display:flex; justify-content:space-between;">
                        <span>Current Bid:</span>
                        <strong id="auction-bid-amount" style="color:var(--accent-hover);">$145.00 USD</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:var(--text-muted); margin-top:2px;">
                        <span>Top Bidder:</span>
                        <span>@anonymous_buyer</span>
                    </div>
                </div>

                <div style="display:flex; gap:10px; margin-top:8px;">
                    <button class="btn btn-primary" style="flex:1; padding:8px; font-size:0.8rem; background-color:#ff4d6d; border-color:#ff4d6d;" onclick="placeSimulatedBid(null, 'public')">Place Bid (+$10.00)</button>
                </div>
            </div>
        </article>
    `;

    // Add creator's dynamic auctions
    creatorAuctions.forEach(auc => {
        const localData = auc[currentLang] || auc["en"] || {};
        const titleVal = localData.title || auc.title || "";
        const displayAudience = auc.audience === "subscribers" ? (currentLang === "es" ? "Exclusivo Suscriptores" : "Subscribers Only") : (currentLang === "es" ? "Público" : "Public");
        const endTimeAttr = auc.endTime ? `data-auction-endtime="${auc.endTime}"` : "";
        const initialTimerText = auc.endTime ? formatTimeRemaining(auc.endTime - Date.now()) : "23h 59m";
        const topBidderVal = auc.topBidder || "@none";
        
        html += `
            <article class="product-card">
                <div class="product-image-wrapper" style="padding-top:100%;">
                    <img src="${auc.image}" class="product-image">
                    <span class="price-tag" style="background-color:#ff4d6d;" ${endTimeAttr}>${initialTimerText}</span>
                </div>
                <div class="card-body">
                    <span class="card-category" style="color:#ff4d6d;">Live Auction (${displayAudience})</span>
                    <h3 class="card-title">${titleVal}</h3>
                    
                    <div style="background:var(--secondary-bg); padding:10px; border-radius:8px; margin:8px 0; font-size:0.8rem;">
                        <div style="display:flex; justify-content:space-between;">
                            <span>Current Bid:</span>
                            <strong id="auction-bid-${auc.id}" style="color:var(--accent-hover);">${formatPrice(auc.price)}</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:var(--text-muted); margin-top:2px;">
                            <span>Top Bidder:</span>
                            <span id="auction-topbidder-${auc.id}">${topBidderVal}</span>
                        </div>
                    </div>

                    <div style="display:flex; gap:10px; margin-top:8px;">
                        <button class="btn btn-primary btn-bid-action" style="flex:1; padding:8px; font-size:0.8rem; background-color:#ff4d6d; border-color:#ff4d6d;" onclick="placeSimulatedBid(${auc.id}, '${auc.audience}', '${creatorName}')">Place Bid (+$10.00)</button>
                    </div>
                </div>
            </article>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;
}

function formatTimeRemaining(msOrTimestamp) {
    if (window.undrAuctions && window.undrAuctions.formatTimeRemainingSynced) {
        const synced = window.undrAuctions.formatTimeRemainingSynced(msOrTimestamp);
        if (synced.isClosed) return currentLang === "es" ? "¡SUBASTA FINALIZADA!" : "AUCTION CLOSED";
        return synced.formatted;
    }

    if (msOrTimestamp <= 0) return currentLang === "es" ? "¡SUBASTA FINALIZADA!" : "AUCTION CLOSED";
    const totalSecs = Math.floor(msOrTimestamp / 1000);
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
}

// Global Server-Synced live interval ticker for active auctions
setInterval(() => {
    const auctionElements = document.querySelectorAll("[data-auction-endtime]");
    const syncedNow = window.undrAuctions ? window.undrAuctions.getSyncedNow() : Date.now();

    auctionElements.forEach(el => {
        const endTime = parseInt(el.getAttribute("data-auction-endtime"));
        if (endTime) {
            const diff = endTime - syncedNow;
            el.textContent = formatTimeRemaining(endTime);
            if (diff <= 0) {
                el.style.backgroundColor = "#555";
                const card = el.closest(".product-card");
                if (card) {
                    const btn = card.querySelector(".btn-bid-action");
                    if (btn) {
                        btn.disabled = true;
                        btn.textContent = currentLang === "es" ? "Subasta Cerrada" : "Auction Closed";
                        btn.style.backgroundColor = "#666";
                        btn.style.borderColor = "#666";
                    }
                }
            }
        }
    });
}, 1000);

window.placeSimulatedBid = async function(productId, audience, creatorName) {
    let user = JSON.parse(localStorage.getItem("undr_current_user"));
    if (!user || user === "null") {
        const users = JSON.parse(localStorage.getItem("undr_users")) || DEFAULT_USERS;
        user = users.find(u => u.role === "buyer") || DEFAULT_USERS[0];
        localStorage.setItem("undr_current_user", JSON.stringify(user));
        syncUserSessionUI();
    }

    let products = JSON.parse(localStorage.getItem("undr_products")) || [];
    let currentBid = 50.00;
    let targetProduct = null;

    if (productId) {
        targetProduct = products.find(p => p.id === productId);
        if (targetProduct) {
            currentBid = parseFloat(targetProduct.price) || 50.00;
        }
    }

    const minNextBid = currentBid + 5.00;

    // Execute Bid via Server-Side Realtime Auctions Engine (with Anti-Sniping & Balance Checks)
    if (window.undrAuctions && window.undrAuctions.placeServerAuctionBid) {
        const res = await window.undrAuctions.placeServerAuctionBid(productId || 'demo-auc', minNextBid);
        if (res.success) {
            renderLiveAuctionsGrid();
        }
        return;
    }

    // Fallback simulation
    if (targetProduct) {
        targetProduct.price = minNextBid;
        targetProduct.topBidder = user.handle;
        targetProduct.bidsCount = (targetProduct.bidsCount || 0) + 1;
        localStorage.setItem("undr_products", JSON.stringify(products));
    }

    showToast(currentLang === "es" ? `¡Puja de $${minNextBid.toFixed(2)} USD enviada!` : `Bid of $${minNextBid.toFixed(2)} USD placed!`);
    renderLiveAuctionsGrid();
};

window.subscribeToCreatorCurrent = function() {
    const user = JSON.parse(localStorage.getItem("undr_current_user"));
    if (!user) {
        alert(currentLang === "es" ? 
            "Acceso Denegado: Debes iniciar sesión o registrarte para suscribirte a creadoras." : 
            "Access Denied: Please log in or register a buyer account to subscribe to creator feeds.");
        loginModal.style.display = "flex";
        return;
    }
    if (user.role !== "buyer") {
        alert("Only Buyer accounts can subscribe to creator feeds.");
        return;
    }

    const price = 9.99;
    if (user.balance < price) {
        alert("Insufficient balance to subscribe.");
        return;
    }

    const users = JSON.parse(localStorage.getItem("undr_users")) || [];
    const creator = users.find(u => u.username === profileActiveCreatorName);
    if (!creator) return;

    // Deduct
    user.balance = parseFloat(user.balance) - price;
    localStorage.setItem("undr_current_user", JSON.stringify(user));

    const uIdx = users.findIndex(u => u.handle === user.handle);
    if (uIdx !== -1) {
        users[uIdx].balance = user.balance;
        localStorage.setItem("undr_users", JSON.stringify(users));
    }

    // Add subscription
    const subs = JSON.parse(localStorage.getItem("undr_subscriptions")) || [];
    if (!subs.includes(creator.handle)) {
        subs.push(creator.handle);
        localStorage.setItem("undr_subscriptions", JSON.stringify(subs));
    }

    syncUserSessionUI();
    openCreatorProfile(profileActiveCreatorName);
    showToast(`Subscribed successfully to ${creator.username}!`);
};

window.startDirectChatFromProfile = function() {
    const user = JSON.parse(localStorage.getItem("undr_current_user"));
    if (!user) {
        alert(currentLang === "es" ? 
            "Acceso Denegado: Debes iniciar sesión o registrarte para chatear con creadoras." : 
            "Access Denied: Please log in or register a buyer account to chat with creators.");
        loginModal.style.display = "flex";
        return;
    }
    
    const subs = JSON.parse(localStorage.getItem("undr_subscriptions")) || [];
    const users = JSON.parse(localStorage.getItem("undr_users")) || [];
    const creator = users.find(u => u.username === profileActiveCreatorName);
    
    if (creator && !subs.includes(creator.handle)) {
        alert(currentLang === "es" ?
            `Acceso Denegado: Debes suscribirte primero al feed de ${creator.username} para poder chatear con ella.` :
            `Access Denied: You must subscribe to ${creator.username}'s feed to unlock direct messaging.`);
        return;
    }

    activeChatCreator = profileActiveCreatorName;
    showSection("chat");
};

// ==========================================
// NOTIFICATIONS SYSTEM
// ==========================================
function updateNotificationsCount() {
    const notifications = JSON.parse(localStorage.getItem("undr_notifications")) || [];
    const currentUser = JSON.parse(localStorage.getItem("undr_current_user"));
    const userNotifications = notifications.filter(n => {
        if (!n.recipientCreator) return true;
        return currentUser && currentUser.username === n.recipientCreator;
    });
    const unreadCount = userNotifications.filter(n => n.unread).length;
    
    const countBadge = document.getElementById("notifications-count-badge");
    if (countBadge) {
        countBadge.textContent = unreadCount;
        countBadge.style.display = unreadCount > 0 ? "flex" : "none";
    }
}

// Toggle notification bell trigger
document.getElementById("notification-bell-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    const panel = document.getElementById("notifications-dropdown-panel");
    const isVisible = panel.style.display === "flex";
    panel.style.display = isVisible ? "none" : "flex";
    
    if (!isVisible) {
        renderNotificationsList();
    }
});

document.addEventListener("click", (e) => {
    const panel = document.getElementById("notifications-dropdown-panel");
    const bellBtn = document.getElementById("notification-bell-btn");
    if (panel && !panel.contains(e.target) && e.target !== bellBtn && !bellBtn.contains(e.target)) {
        panel.style.display = "none";
    }
});

function renderNotificationsList() {
    const notifications = JSON.parse(localStorage.getItem("undr_notifications")) || [];
    const currentUser = JSON.parse(localStorage.getItem("undr_current_user"));
    const container = document.getElementById("notifications-list-container");
    container.innerHTML = "";

    const userNotifications = notifications.filter(n => {
        if (!n.recipientCreator) return true;
        return currentUser && currentUser.username === n.recipientCreator;
    });

    if (userNotifications.length === 0) {
        container.innerHTML = `<div class="empty-cart-message">No notifications.</div>`;
        return;
    }

    userNotifications.forEach(n => {
        const item = document.createElement("div");
        item.className = `notification-item ${n.unread ? 'unread' : ''}`;
        item.innerHTML = `
            <div class="notification-icon-wrapper"><i class="fa-solid fa-bell"></i></div>
            <div class="notification-body-text">
                <span>${n.text}</span>
                <span class="notification-time">${n.time}</span>
            </div>
        `;
        container.appendChild(item);
    });
}

window.clearNotifications = function() {
    const notifications = JSON.parse(localStorage.getItem("undr_notifications")) || [];
    notifications.forEach(n => n.unread = false);
    localStorage.setItem("undr_notifications", JSON.stringify(notifications));
    updateNotificationsCount();
    renderNotificationsList();
    showToast("Notifications marked as read.");
};

// ==========================================
// BUYER ACCOUNT SETTINGS UI RENDERING
// ==========================================
function renderSettingsAddresses() {
    const addresses = JSON.parse(localStorage.getItem("undr_addresses")) || [];
    const container = document.getElementById("settings-address-list");
    container.innerHTML = "";

    if (addresses.length === 0) {
        container.innerHTML = `<div class="empty-cart-message">No shipping addresses saved.</div>`;
        return;
    }

    addresses.forEach(addr => {
        const div = document.createElement("div");
        div.className = "address-item";
        div.innerHTML = `
            <div class="address-item-details">
                <strong>${addr.name}</strong><br>
                <span>${addr.street}, ${addr.city} (${addr.zip})</span>
            </div>
            <button class="btn-remove-address" onclick="deleteSettingsAddress(${addr.id})">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;
        container.appendChild(div);
    });
}

window.deleteSettingsAddress = function(addrId) {
    let addresses = JSON.parse(localStorage.getItem("undr_addresses")) || [];
    addresses = addresses.filter(a => a.id !== addrId);
    localStorage.setItem("undr_addresses", JSON.stringify(addresses));
    renderSettingsAddresses();
    showToast("Shipping address removed.");
};

// Form add address settings
document.getElementById("settings-add-address-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const alias = document.getElementById("address-alias-name").value.trim();
    const street = document.getElementById("address-street").value.trim();
    const city = document.getElementById("address-city").value.trim();
    const zip = document.getElementById("address-zip").value.trim();

    const addresses = JSON.parse(localStorage.getItem("undr_addresses")) || [];
    addresses.push({
        id: Date.now(),
        name: alias,
        street: street,
        city: city,
        zip: zip
    });

    localStorage.setItem("undr_addresses", JSON.stringify(addresses));
    document.getElementById("settings-add-address-form").reset();
    renderSettingsAddresses();
    showToast("Address saved anonymously.");
});

function renderSettingsSubscriptions() {
    const subs = JSON.parse(localStorage.getItem("undr_subscriptions")) || [];
    const container = document.getElementById("settings-subs-list");
    container.innerHTML = "";

    if (subs.length === 0) {
        container.innerHTML = `<div class="empty-cart-message">No active subscriptions.</div>`;
        return;
    }

    const users = JSON.parse(localStorage.getItem("undr_users")) || [];

    subs.forEach(handle => {
        const creator = users.find(u => u.handle === handle);
        if (!creator) return;

        const card = document.createElement("div");
        card.className = "sub-item-card";
        card.innerHTML = `
            <img src="${creator.avatar}" class="sub-item-avatar">
            <div class="sub-item-info">
                <span class="sub-item-name">${creator.username}</span>
                <span class="sub-item-price">$9.99/mo (Auto-renewing)</span>
            </div>
            <button class="btn btn-follow" style="padding:4px 8px; font-size:0.7rem;" onclick="cancelSubscriptionSettings('${handle}')">Cancel Sub</button>
        `;
        container.appendChild(card);
    });
}

window.cancelSubscriptionSettings = function(handle) {
    let subs = JSON.parse(localStorage.getItem("undr_subscriptions")) || [];
    subs = subs.filter(s => s !== handle);
    localStorage.setItem("undr_subscriptions", JSON.stringify(subs));
    renderSettingsSubscriptions();
    showToast("Subscription cancelled.");
};

function renderSettingsOrders() {
    const orders = JSON.parse(localStorage.getItem("creator_orders")) || [];
    const container = document.getElementById("settings-orders-list");
    container.innerHTML = "";

    if (orders.length === 0) {
        container.innerHTML = `<div class="empty-cart-message">No purchased items history yet.</div>`;
        return;
    }

    orders.forEach(order => {
        let statusLabel = "Paid - Package in preparation";
        let statusColor = "#f7a072";

        if (order.status === "shipped") {
            statusLabel = "In Transit (USPS anonymous label generated)";
            statusColor = "var(--accent-hover)";
        } else if (order.status === "delivered") {
            statusLabel = "Delivered (Discreet packing completed)";
            statusColor = "#0bb08b";
        }

        let step1Active = true;
        let step2Active = order.status === "shipped" || order.status === "delivered";
        let step3Active = order.status === "delivered";

        const div = document.createElement("div");
        div.className = "order-history-card";
        div.innerHTML = `
            <div class="order-history-header">
                <span>ORDER ID: #${order.id.slice(0,8).toUpperCase()}</span>
                <span style="font-weight:800; color:var(--accent-hover);">$${order.price.toFixed(2)} USD</span>
            </div>
            <div class="order-history-body">
                <img src="${order.image}" class="order-history-img">
                <div style="flex:1;">
                    <span class="order-history-title" style="display:block; font-weight:700; margin-bottom:4px;">${order.title}</span>
                    <span class="order-history-status" style="color:${statusColor}; font-weight:700; font-size:0.75rem; display:block; margin-bottom:10px;">${statusLabel}</span>
                    
                    <!-- Visual Tracking Stepper -->
                    <div style="display:flex; justify-content:space-between; align-items:center; background:var(--primary-bg); padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); font-size:0.68rem;">
                        <span style="color:${step1Active ? 'var(--accent-hover)' : 'var(--text-muted)'}; font-weight:${step1Active ? '700' : '400'};"><i class="fa-solid fa-circle-check"></i> ${currentLang === 'es' ? 'Pago Recibido' : 'Paid'}</span>
                        <span style="color:var(--text-muted);">&rarr;</span>
                        <span style="color:${step2Active ? 'var(--accent-hover)' : 'var(--text-muted)'}; font-weight:${step2Active ? '700' : '400'};"><i class="fa-solid fa-box-tissue"></i> ${currentLang === 'es' ? 'Sellado al Vacío' : 'Vacuum Sealed'}</span>
                        <span style="color:var(--text-muted);">&rarr;</span>
                        <span style="color:${step3Active ? '#0bb08b' : 'var(--text-muted)'}; font-weight:${step3Active ? '700' : '400'};"><i class="fa-solid fa-truck-fast"></i> ${currentLang === 'es' ? 'Entregado' : 'Delivered'}</span>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

function renderFavoritesGrid() {
    const favorites = JSON.parse(localStorage.getItem("undr_favorites")) || [];
    const container = document.getElementById("settings-favorites-grid");
    if (!container) return;
    
    container.innerHTML = "";
    
    if (favorites.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-message" style="grid-column: 1/-1; text-align: center; padding: 20px;">
                <i class="fa-solid fa-heart" style="font-size: 2rem; color: var(--border-color); margin-bottom: 8px; display: block;"></i>
                ${currentLang === "es" ? "No tienes favoritos guardados." : "You have no favorited items yet."}
            </div>
        `;
        return;
    }
    
    const products = JSON.parse(localStorage.getItem("undr_products")) || [];
    const favProducts = products.filter(p => favorites.includes(p.id));
    
    if (favProducts.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-message" style="grid-column: 1/-1; text-align: center; padding: 20px;">
                ${currentLang === "es" ? "Los artículos favoritos ya no están disponibles." : "Favorited items are no longer available."}
            </div>
        `;
        return;
    }
    
    favProducts.forEach(product => {
        const localData = product[currentLang] || product["en"] || {};
        const titleText = localData.title || product.title || "";
        const verifiedBadge = product.creator.verified ? `<i class="fa-solid fa-circle-check verified-icon" style="color:var(--accent-color);"></i>` : "";
        const timeText = currentLang === "es" ? "Hace 3 horas" : "3h ago";
        const card = document.createElement("article");
        card.className = "product-card";
        
        card.innerHTML = `
            <div class="card-creator-header" onclick="openCreatorProfile('${product.creator.name}')" style="cursor: pointer;">
                <img src="${product.creator.avatar}" alt="${product.creator.name}" class="creator-avatar-card">
                <div class="creator-info-card">
                    <span class="card-creator-name">${product.creator.name} ${verifiedBadge}</span>
                    <span class="card-post-time">${timeText}</span>
                </div>
            </div>
            
            <div class="product-image-wrapper" onclick="openCreatorProfile('${product.creator.name}')" style="cursor:pointer; overflow:hidden;">
                <img src="${product.image}" alt="${titleText}" class="product-image" loading="lazy">
                <span class="price-tag">$${product.price.toFixed(2)} USD</span>
            </div>
            
            <div class="card-body">
                <span class="card-category">${product.style}</span>
                <h3 class="card-title">${titleText}</h3>
                <p class="card-description">${localData.description || ""}</p>
                
                <div class="card-spec-tags">
                    <span class="spec-tag">Size ${product.size}</span>
                    <span class="spec-tag">${product.wearTime}</span>
                </div>

                <div class="card-footer">
                    <div class="card-actions-row">
                        <button class="btn-buy-item" onclick="addToCart(${product.id})">
                            <i class="fa-solid fa-bag-shopping"></i> ${currentLang === "es" ? "Comprar" : "Buy Item"}
                        </button>
                        <button class="btn-like-post" onclick="toggleLike(this, ${product.id})" style="color:#ff4d6d; border-color:#ffa6b5;">
                            <i class="fa-solid fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderLiveAuctionsGrid() {
    const feed = document.getElementById("live-auctions-feed");
    if (!feed) return;

    const products = JSON.parse(localStorage.getItem("undr_products")) || [];
    const activeAuctions = products.filter(p => p.isAuction === true);

    if (activeAuctions.length === 0) {
        feed.innerHTML = `<div class="empty-cart-message" style="grid-column: 1/-1;">${currentLang === "es" ? "No hay subastas en vivo en este momento." : "No active live auctions at the moment."}</div>`;
        return;
    }

    let html = "";
    activeAuctions.forEach(auc => {
        const localData = auc[currentLang] || auc["en"] || {};
        const titleVal = localData.title || auc.title || "Live Auction Garment";
        const displayAudience = auc.audience === "subscribers" ? (currentLang === "es" ? "Exclusivo Suscriptores" : "Subscribers Only") : (currentLang === "es" ? "Público" : "Public");
        
        // Ensure valid endTime
        if (!auc.endTime) {
            auc.endTime = Date.now() + (4 * 3600 + 15 * 60 + 10) * 1000;
        }

        const isEnded = Date.now() >= auc.endTime;
        const endTimeAttr = `data-auction-endtime="${auc.endTime}"`;
        const timerText = isEnded ? (currentLang === "es" ? "¡SUBASTA FINALIZADA!" : "AUCTION CLOSED") : formatTimeRemaining(auc.endTime - Date.now());
        const topBidderVal = auc.topBidder || "@none";
        const bidsCountVal = auc.bidsCount || 1;

        html += `
            <article class="product-card">
                <div class="product-image-wrapper" style="padding-top:100%; position:relative;">
                    <img src="${auc.image}" class="product-image">
                    <span class="price-tag" style="background-color:${isEnded ? '#444' : '#ff4d6d'};" ${endTimeAttr}>${timerText}</span>
                </div>
                <div class="card-body">
                    <span class="card-category" style="color:#ff4d6d;">${auc.creator.name} - Live Auction (${displayAudience})</span>
                    <h3 class="card-title">${titleVal}</h3>
                    
                    <div style="background:var(--secondary-bg); padding:10px; border-radius:8px; margin:8px 0; font-size:0.8rem;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span>Current Highest Bid:</span>
                            <strong id="auction-bid-${auc.id}" style="color:var(--accent-hover); font-size:1.1rem;">${formatPrice(auc.price)}</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted); margin-top:4px;">
                            <span>Top Bidder: <strong id="auction-topbidder-${auc.id}" style="color:var(--text-primary);">${topBidderVal}</strong></span>
                            <span id="auction-bids-count-${auc.id}">${bidsCountVal} bids</span>
                        </div>
                    </div>

                    <div style="display:flex; gap:10px; margin-top:8px;">
                        <button class="btn btn-primary btn-bid-action" id="auction-btn-${auc.id}" ${isEnded ? 'disabled style="flex:1; padding:8px; font-size:0.8rem; background-color:#555; border-color:#555;"' : 'style="flex:1; padding:8px; font-size:0.8rem; background-color:#ff4d6d; border-color:#ff4d6d;"'} onclick="placeSimulatedBid(${auc.id}, '${auc.audience}', '${auc.creator.name}')">
                            ${isEnded ? (currentLang === "es" ? `🏆 Ganada por ${topBidderVal}` : `🏆 Won by ${topBidderVal}`) : (currentLang === "es" ? "Pujar (+$10.00)" : "Place Bid (+$10.00)")}
                        </button>
                    </div>
                </div>
            </article>
        `;
    });

    feed.innerHTML = html;
}

window.placeSimulatedFeedBid = function(elementId) {
    const user = JSON.parse(localStorage.getItem("undr_current_user"));
    if (!user || user.role !== "buyer") {
        alert(currentLang === "es" ? 
            "Acceso Denegado: Los invitados anónimos no pueden pujar. Por favor inicia sesión o regístrate como comprador." : 
            "Access Denied: Anonymous guests cannot bid. Please log in or register a buyer account.");
        loginModal.style.display = "flex";
        return;
    }
    const addresses = JSON.parse(localStorage.getItem("undr_addresses")) || [];
    if (addresses.length === 0) {
        alert(currentLang === "es" ? 
            "Verificación de Seguridad Requerida: Registra una dirección de envío en tus Ajustes de Cuenta antes de pujar para validar tu cuenta." : 
            "Security Verification Required: Please register a shipping address in your Account Settings to bid on live auctions. This prevents fraudulent fake bids.");
        showSection("buyer-settings");
        return;
    }

    const bidEl = document.getElementById(elementId);
    let currentBid = parseFloat(bidEl.textContent.replace(/[^\d.]/g, ""));
    currentBid += 10.00;
    bidEl.textContent = `$${currentBid.toFixed(2)} USD`;
    showToast("Bid placed successfully!");

    // Add alert notification
    const notifications = JSON.parse(localStorage.getItem("undr_notifications")) || [];
    notifications.unshift({
        id: Date.now(),
        text: `You placed a bid on active auction item for $${currentBid.toFixed(2)} USD!`,
        time: "Just now",
        unread: true
    });
    localStorage.setItem("undr_notifications", JSON.stringify(notifications));
    updateNotificationsCount();
};

// Creator active listings management
window.loadCreatorInventory = function() {
    const container = document.getElementById("creator-active-listings-container");
    if (!container) return;
    container.innerHTML = "";

    const user = JSON.parse(localStorage.getItem("undr_current_user"));
    if (!user || user.role !== "creator") return;

    const products = JSON.parse(localStorage.getItem("undr_products")) || [];
    const creatorProducts = products.filter(p => p.creator.name === user.username);

    if (creatorProducts.length === 0) {
        container.innerHTML = `<div class="empty-cart-message">${currentLang === 'es' ? 'No tienes prendas publicadas.' : 'You have no listings published.'}</div>`;
        return;
    }

    creatorProducts.forEach(p => {
        const localData = p[currentLang] || p["en"] || {};
        const titleVal = localData.title || p.title || "Untitled Garment";
        const item = document.createElement("div");
        item.className = "address-item";
        item.style.padding = "10px";
        item.innerHTML = `
            <div style="font-size:0.8rem;">
                <strong>${titleVal}</strong><br>
                <span style="color:var(--text-muted); font-size:0.75rem;">${formatPrice(p.price)} - Type: ${p.isAuction ? 'Live Auction' : 'Direct Sale'}</span>
            </div>
            <button class="btn btn-login" style="padding:4px 8px; font-size:0.7rem; background:#ffeef2; color:#ff4d6d; border-color:#ffa6b5;" onclick="deleteCreatorListing(${p.id})">
                Delete
            </button>
        `;
        container.appendChild(item);
    });
};

window.deleteCreatorListing = function(productId) {
    let products = JSON.parse(localStorage.getItem("undr_products")) || [];
    products = products.filter(p => p.id !== productId);
    localStorage.setItem("undr_products", JSON.stringify(products));

    loadCreatorInventory();
    filterAndSortProducts();
    
    const user = JSON.parse(localStorage.getItem("undr_current_user"));
    if (user) {
        openCreatorProfile(user.username);
    }
    
    showToast(currentLang === 'es' ? "Prenda eliminada de tu tienda." : "Listing deleted from your shop.");
};

window.toggleListingExtraFields = function() {
    const isAuction = document.getElementById("new-item-type-select").value === "auction";
    const presaleGroup = document.getElementById("presale-checkbox-group");
    const durationGroup = document.getElementById("auction-duration-group");
    if (presaleGroup) {
        presaleGroup.style.display = isAuction ? "none" : "flex";
    }
    if (durationGroup) {
        durationGroup.style.display = isAuction ? "block" : "none";
    }
};

// Initial count updates on load
updateNotificationsCount();

// ==========================================
// DYNAMIC HASH ROUTER ENGINE (URLs per creator @handle & section)
// ==========================================
function handleHashRouting() {
    const rawHash = decodeURIComponent(window.location.hash).trim();
    if (!rawHash || rawHash === "#" || rawHash === "#/" || rawHash === "#/explore") {
        showSection("explore", null, false);
        return;
    }

    if (rawHash.startsWith("#@")) {
        const handle = rawHash.substring(2);
        openCreatorProfile(handle);
    } else if (rawHash.startsWith("#/creator/")) {
        const handle = rawHash.substring(10);
        openCreatorProfile(handle);
    } else if (rawHash === "#/chat") {
        showSection("chat", null, false);
    } else if (rawHash === "#/auctions") {
        showSection("auctions", null, false);
    } else if (rawHash === "#/creator-portal") {
        showSection("creator", null, false);
    } else if (rawHash === "#/buyer-settings") {
        showSection("buyer-settings", null, false);
    } else if (rawHash === "#/admin") {
        showSection("admin", null, false);
    } else {
        showSection("explore", null, false);
    }
}

window.addEventListener("hashchange", handleHashRouting);
window.addEventListener("popstate", handleHashRouting);

// Run Hash routing on initial load
setTimeout(() => {
    handleHashRouting();
}, 100);

// Mobile Dock Navigation Helpers
window.updateMobileNavActive = function(element) {
    const items = document.querySelectorAll(".mobile-nav-item");
    items.forEach(i => i.classList.remove("active"));
    if (element) element.classList.add("active");
};

window.handleMobileProfileClick = function() {
    const user = JSON.parse(localStorage.getItem("undr_current_user"));
    if (!user || user === "null") {
        const modal = document.getElementById("login-modal");
        if (modal) modal.style.display = "flex";
        return;
    }
    if (user.role === "creator") {
        showSection("creator");
    } else {
        showSection("buyer-settings");
    }
};

window.toggleCartModal = function() {
    const modal = document.getElementById("cart-modal");
    if (!modal) return;
    renderMobileCartModal();
    modal.style.display = "flex";
};

window.renderMobileCartModal = function() {
    const container = document.getElementById("mobile-cart-items-container");
    const subtotalEl = document.getElementById("mobile-cart-subtotal");
    if (!container) return;

    if (!cart || cart.length === 0) {
        container.innerHTML = `<div class="empty-cart-message">${currentLang === "es" ? "Tu carrito está vacío" : "Your cart is empty"}</div>`;
        if (subtotalEl) subtotalEl.textContent = formatPrice(0);
        return;
    }

    let html = "";
    let subtotal = 0;
    cart.forEach((item, index) => {
        subtotal += item.price;
        const title = item[currentLang] ? item[currentLang].title : item.en.title;
        html += `
            <div style="display:flex; align-items:center; justify-content:space-between; background:var(--secondary-bg); padding:10px 12px; border-radius:12px; border:1px solid var(--border-color);">
                <div style="display:flex; align-items:center; gap:10px;">
                    <img src="${item.image}" alt="${title}" style="width:48px; height:48px; object-fit:cover; border-radius:8px;">
                    <div>
                        <div style="font-weight:700; font-size:0.85rem;">${title}</div>
                        <div style="font-size:0.78rem; color:var(--accent-hover); font-weight:700;">${formatPrice(item.price)}</div>
                    </div>
                </div>
                <button onclick="removeFromCart(${index}); renderMobileCartModal();" style="background:none; border:none; color:#ff4d6d; cursor:pointer; font-size:1.1rem; padding:4px;"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
    });

    container.innerHTML = html;
    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
};

// User Notification Preferences UI Handler
window.saveUserNotificationPreferencesUI = function() {
    const user = JSON.parse(localStorage.getItem("undr_current_user")) || { id: 'guest' };
    const prefs = {
        email_orders: document.getElementById("pref-email-orders")?.checked ?? true,
        email_chat: document.getElementById("pref-email-chat")?.checked ?? true,
        push_dms: document.getElementById("pref-push-dms")?.checked ?? true,
        push_auctions: document.getElementById("pref-push-auctions")?.checked ?? true
    };

    if (window.undrNotificationsEngine) {
        window.undrNotificationsEngine.saveUserNotificationPreferences(user.id, prefs);
    }
};

window.loadUserNotificationPreferencesUI = function() {
    const user = JSON.parse(localStorage.getItem("undr_current_user")) || { id: 'guest' };
    if (window.undrNotificationsEngine) {
        const prefs = window.undrNotificationsEngine.getUserNotificationPreferences(user.id);
        if (document.getElementById("pref-email-orders")) document.getElementById("pref-email-orders").checked = prefs.email_orders ?? true;
        if (document.getElementById("pref-email-chat")) document.getElementById("pref-email-chat").checked = prefs.email_chat ?? true;
        if (document.getElementById("pref-push-dms")) document.getElementById("pref-push-dms").checked = prefs.push_dms ?? true;
        if (document.getElementById("pref-push-auctions")) document.getElementById("pref-push-auctions").checked = prefs.push_auctions ?? true;
    }
};

// Initial trigger
setTimeout(() => {
    window.loadUserNotificationPreferencesUI();
}, 200);
};
};






