/**
 * @fileoverview UNDR Cloud Storage Engine
 * 
 * Manages cloud media uploads, image optimization, file validation, security scanning,
 * and signed URLs using Supabase Storage (S3 + CDN).
 * 
 * Features:
 * - Client-side Image Compression (Canvas WebP/JPEG, reduces 10MB -> ~150KB)
 * - Security Validation (Magic numbers check, MIME type whitelist, file size limits)
 * - CDN Delivery for public assets (products, avatars)
 * - Pre-Signed Temporary URLs for private assets (KYC identity docs, PPV media)
 * - Automatic LocalStorage/Base64 Fallback when offline or in demo mode
 */

import { supabase, isSupabaseConfigured } from './supabase-config.js';

// ─── Configuration & Whitelists ────────────────────────────────────────────────
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB max raw input
const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm'
];

// Known Magic Number signatures for file security scanning
const MAGIC_NUMBERS = {
    'image/jpeg': [0xFF, 0xD8, 0xFF],
    'image/png': [0x89, 0x50, 0x4E, 0x47],
    'image/gif': [0x47, 0x49, 0x46, 0x38],
    'image/webp': [0x52, 0x49, 0x46, 0x46], // RIFF header
};

// ─── File Validation & Security Scanning ─────────────────────────────────────

/**
 * Validates a file for size, type, and inspects magic bytes for security.
 * @param {File} file 
 * @param {Object} options 
 * @returns {Promise<{valid: boolean, error?: string}>}
 */
export async function validateFile(file, options = {}) {
    const maxSize = options.maxSize || MAX_FILE_SIZE_BYTES;
    const allowedTypes = options.allowedTypes || ALLOWED_MIME_TYPES;

    if (!file) {
        return { valid: false, error: 'No file selected' };
    }

    // 1. Size check
    if (file.size > maxSize) {
        const sizeMb = (maxSize / (1024 * 1024)).toFixed(0);
        return { 
            valid: false, 
            error: `File size exceeds maximum limit of ${sizeMb}MB (Selected: ${(file.size / (1024 * 1024)).toFixed(1)}MB)` 
        };
    }

    // 2. MIME type check
    if (!allowedTypes.includes(file.type.toLowerCase())) {
        return { 
            valid: false, 
            error: `Unsupported file type: ${file.type}. Allowed types: images (JPG, PNG, WebP, GIF) and videos (MP4, WebM)` 
        };
    }

    // 3. Security Check: Magic Byte Inspection
    try {
        const isHeaderValid = await verifyMagicBytes(file);
        if (!isHeaderValid) {
            return {
                valid: false,
                error: 'Security Warning: File content does not match its extension or header signature.'
            };
        }
    } catch (e) {
        console.warn('[Storage] Security scan warning:', e);
    }

    return { valid: true };
}

/**
 * Inspects initial byte signatures of the file buffer to prevent disguised malicious files.
 */
async function verifyMagicBytes(file) {
    // Videos/GIFs skip deep magic byte check
    if (file.type.startsWith('video/') || file.type === 'image/gif') return true;

    const slice = file.slice(0, 12);
    const buffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    const mime = file.type.toLowerCase();
    const expected = MAGIC_NUMBERS[mime] || MAGIC_NUMBERS['image/jpeg'];

    if (!expected) return true;

    for (let i = 0; i < expected.length; i++) {
        if (bytes[i] !== expected[i]) {
            return false;
        }
    }
    return true;
}

// ─── Image Optimization & Compression Engine ─────────────────────────────────

/**
 * Resizes and compresses an image in the browser using HTML5 Canvas.
 * Converts to WebP format (or JPEG fallback) to dramatically reduce bandwidth.
 * 
 * @param {File|Blob} file - Raw image file
 * @param {Object} options - Compression options
 * @param {number} options.maxWidth - Max width in px (default 1200)
 * @param {number} options.maxHeight - Max height in px (default 1200)
 * @param {number} options.quality - Quality from 0.1 to 1.0 (default 0.85)
 * @param {string} options.format - Output format ('image/webp' or 'image/jpeg')
 * @returns {Promise<{blob: Blob, dataUrl: string, originalSize: number, compressedSize: number}>}
 */
export async function compressImage(file, options = {}) {
    const maxWidth = options.maxWidth || 1200;
    const maxHeight = options.maxHeight || 1200;
    const quality = options.quality || 0.85;
    const format = options.format || 'image/webp';

    // If file is GIF or Video, do not resize via Canvas
    if (file.type === 'image/gif' || file.type.startsWith('video/')) {
        const dataUrl = await fileToDataUrl(file);
        return {
            blob: file,
            dataUrl,
            originalSize: file.size,
            compressedSize: file.size
        };
    }

    return new Promise((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(objectUrl);

            let width = img.width;
            let height = img.height;

            // Calculate new aspect ratio dimensions
            if (width > maxWidth || height > maxHeight) {
                if (width / height > maxWidth / maxHeight) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                } else {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            // Use high quality image smoothing
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            // Export to Blob
            canvas.toBlob((blob) => {
                if (!blob) {
                    // Fallback to original file
                    fileToDataUrl(file).then(dataUrl => {
                        resolve({ blob: file, dataUrl, originalSize: file.size, compressedSize: file.size });
                    });
                    return;
                }

                const dataUrl = canvas.toDataURL(format, quality);
                resolve({
                    blob,
                    dataUrl,
                    originalSize: file.size,
                    compressedSize: blob.size
                });
            }, format, quality);
        };

        img.onerror = (err) => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Failed to load image for compression'));
        };

        img.src = objectUrl;
    });
}

function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ─── Supabase Cloud Storage Operations ────────────────────────────────────────

/**
 * Uploads a file to a Supabase Cloud Storage bucket.
 * Automatically falls back to compressed DataURL if Supabase is offline.
 * 
 * @param {string} bucketName - Target bucket ('product-images', 'avatars', 'kyc-documents', 'ppv-media')
 * @param {string} filePath - Path inside bucket (e.g. 'products/item_123.webp')
 * @param {File|Blob} fileBlob - File or compressed Blob to upload
 * @param {Object} options - Upload options { isPublic, contentType, fallbackDataUrl }
 * @returns {Promise<{url: string, path: string, isCloud: boolean}>}
 */
export async function uploadToStorage(bucketName, filePath, fileBlob, options = {}) {
    const contentType = options.contentType || fileBlob.type || 'image/webp';
    const fallbackDataUrl = options.fallbackDataUrl || null;

    if (!isSupabaseConfigured() || !supabase) {
        console.log(`[Storage] Demo/LocalStorage fallback for ${bucketName}/${filePath}`);
        return {
            url: fallbackDataUrl || (fileBlob instanceof File ? await fileToDataUrl(fileBlob) : ''),
            path: filePath,
            isCloud: false
        };
    }

    try {
        // Sanitize path
        const cleanPath = filePath.replace(/^\/+/, '');

        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(cleanPath, fileBlob, {
                cacheControl: '3600',
                contentType,
                upsert: true
            });

        if (error) {
            console.warn(`[Storage] Upload warning for ${bucketName}/${cleanPath}:`, error.message);
            // Fallback to data URL
            if (fallbackDataUrl) {
                return { url: fallbackDataUrl, path: cleanPath, isCloud: false };
            }
            throw error;
        }

        // Generate URL depending on bucket visibility
        let url;
        if (options.isPublic !== false) {
            url = getPublicUrl(bucketName, data.path);
        } else {
            // Private bucket -> generate signed URL valid for 1 hour
            url = await createSignedUrl(bucketName, data.path, 3600);
        }

        return {
            url,
            path: data.path,
            isCloud: true
        };
    } catch (err) {
        console.warn('[Storage] Upload exception, using fallback:', err.message);
        return {
            url: fallbackDataUrl || (fileBlob instanceof File ? await fileToDataUrl(fileBlob) : ''),
            path: filePath,
            isCloud: false
        };
    }
}

/**
 * Gets a CDN public URL for an asset in a public bucket.
 */
export function getPublicUrl(bucketName, filePath) {
    if (!isSupabaseConfigured() || !supabase) return filePath;
    if (filePath.startsWith('http') || filePath.startsWith('data:')) return filePath;

    const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

    return data.publicUrl;
}

/**
 * Creates a temporary signed URL for an asset in a private bucket.
 * @param {string} bucketName 
 * @param {string} filePath 
 * @param {number} expiresInSeconds - Expiration time (default 3600 = 1 hour)
 * @returns {Promise<string>}
 */
export async function createSignedUrl(bucketName, filePath, expiresInSeconds = 3600) {
    if (!isSupabaseConfigured() || !supabase) return filePath;
    if (filePath.startsWith('http') || filePath.startsWith('data:')) return filePath;

    try {
        const { data, error } = await supabase.storage
            .from(bucketName)
            .createSignedUrl(filePath, expiresInSeconds);

        if (error) throw error;
        return data.signedUrl;
    } catch (err) {
        console.warn('[Storage] createSignedUrl error:', err.message);
        return filePath;
    }
}

// ─── High-Level Module Helper Functions ────────────────────────────────────────

/**
 * Uploads a product image to 'product-images' bucket after validation and compression.
 */
export async function uploadProductImage(file, creatorHandle) {
    const val = await validateFile(file);
    if (!val.valid) throw new Error(val.error);

    const compressed = await compressImage(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.85 });
    const sanitizeHandle = (creatorHandle || 'general').replace(/[^a-zA-Z0-9_]/g, '');
    const filename = `products/${sanitizeHandle}/${Date.now()}_${Math.random().toString(36).slice(2, 7)}.webp`;

    return uploadToStorage('product-images', filename, compressed.blob, {
        contentType: 'image/webp',
        fallbackDataUrl: compressed.dataUrl,
        isPublic: true
    });
}

/**
 * Uploads a profile avatar image to 'avatars' bucket after validation and compression.
 */
export async function uploadAvatarImage(file, userHandle) {
    const val = await validateFile(file);
    if (!val.valid) throw new Error(val.error);

    const compressed = await compressImage(file, { maxWidth: 400, maxHeight: 400, quality: 0.85 });
    const sanitizeHandle = (userHandle || 'user').replace(/[^a-zA-Z0-9_]/g, '');
    const filename = `avatars/${sanitizeHandle}_${Date.now()}.webp`;

    return uploadToStorage('avatars', filename, compressed.blob, {
        contentType: 'image/webp',
        fallbackDataUrl: compressed.dataUrl,
        isPublic: true
    });
}

/**
 * Uploads a sensitive KYC identity document to private 'kyc-documents' bucket.
 */
export async function uploadKycDocument(file, userId, docType) {
    const val = await validateFile(file, { maxSize: 10 * 1024 * 1024 });
    if (!val.valid) throw new Error(val.error);

    const compressed = await compressImage(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.88 });
    const filename = `kyc/${userId}/${docType}_${Date.now()}.webp`;

    return uploadToStorage('kyc-documents', filename, compressed.blob, {
        contentType: 'image/webp',
        fallbackDataUrl: compressed.dataUrl,
        isPublic: false // Private bucket with signed URLs
    });
}

/**
 * Uploads locked media for PPV messages to private 'ppv-media' bucket.
 */
export async function uploadPpvMedia(file, conversationId) {
    const val = await validateFile(file);
    if (!val.valid) throw new Error(val.error);

    const compressed = await compressImage(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.85 });
    const filename = `ppv/${conversationId}/${Date.now()}_media.webp`;

    return uploadToStorage('ppv-media', filename, compressed.blob, {
        contentType: 'image/webp',
        fallbackDataUrl: compressed.dataUrl,
        isPublic: false // Private bucket
    });
}

// Expose globally for window accessibility
window.undrStorage = {
    validateFile,
    compressImage,
    uploadToStorage,
    getPublicUrl,
    createSignedUrl,
    uploadProductImage,
    uploadAvatarImage,
    uploadKycDocument,
    uploadPpvMedia
};

console.log('%c☁️ UNDR Cloud Storage Engine initialized', 'color: #3b82f6; font-weight: bold; font-size: 13px;');
