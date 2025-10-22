/**
 * Shared UI Components and Utilities
 * For AI Assistant Web Interface
 */

// Server status tracking
let isServerOnline = false;
const API_BASE_URL = 'http://localhost:8000';

/**
 * Create and show server offline warning banner
 */
function createServerOfflineWarning() {
    const existingWarning = document.getElementById('serverOfflineWarning');
    if (existingWarning) return;

    const warning = document.createElement('div');
    warning.id = 'serverOfflineWarning';
    warning.className = 'warning-banner';
    warning.innerHTML = `
        <span class="warning-icon">⚠️</span>
        <div class="warning-content">
            <div class="warning-title">Server Offline</div>
            <div class="warning-message">
                The AI server is not running. Start the server with <code style="background: rgba(0,0,0,0.3); padding: 0.2rem 0.5rem; border-radius: 4px;">start_api.bat</code> to use the AI assistant.
            </div>
        </div>
    `;

    // Insert after page header
    const main = document.querySelector('main');
    const pageHeader = document.querySelector('.page-header');
    if (pageHeader && main) {
        pageHeader.insertAdjacentElement('afterend', warning);
    } else if (main) {
        main.insertBefore(warning, main.firstChild);
    }
}

/**
 * Check if server is online
 */
async function checkServerStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/health`, {
            method: 'GET',
            signal: AbortSignal.timeout(3000)
        });
        
        const wasOffline = !isServerOnline;
        isServerOnline = response.ok;
        
        updateServerStatusUI(isServerOnline);
        
        // If server just came back online, reload data
        if (wasOffline && isServerOnline) {
            console.log('Server is back online');
            if (typeof onServerReconnect === 'function') {
                onServerReconnect();
            }
        }
        
        return isServerOnline;
    } catch (error) {
        const wasOnline = isServerOnline;
        isServerOnline = false;
        updateServerStatusUI(false);
        
        if (wasOnline) {
            console.log('Server went offline');
        }
        
        return false;
    }
}

/**
 * Update UI based on server status
 */
function updateServerStatusUI(online) {
    const warning = document.getElementById('serverOfflineWarning');
    
    if (!warning) {
        if (!online) {
            createServerOfflineWarning();
        }
        return;
    }
    
    if (online) {
        warning.classList.remove('show');
        setTimeout(() => {
            if (isServerOnline) { // Only remove if still online
                warning.style.display = 'none';
            }
        }, 300);
    } else {
        warning.style.display = 'flex';
        setTimeout(() => warning.classList.add('show'), 10);
    }
}

/**
 * Initialize server status monitoring
 */
function initServerStatusMonitoring(checkInterval = 30000) {
    // Check immediately
    checkServerStatus();
    
    // Check periodically
    setInterval(checkServerStatus, checkInterval);
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) {
        console.warn('Toast element not found');
        return;
    }
    
    const toastIcon = document.getElementById('toastIcon');
    const toastMessage = document.getElementById('toastMessage');

    if (toastIcon) toastIcon.textContent = type === 'success' ? '✓' : '✗';
    if (toastMessage) toastMessage.textContent = message;
    
    toast.className = `toast ${type}`;
    setTimeout(() => toast.classList.add('show'), 100);

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/**
 * Format uptime in human-readable format
 */
function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    } else {
        return `${secs}s`;
    }
}

/**
 * Make API request with error handling
 */
async function apiRequest(endpoint, options = {}) {
    if (!isServerOnline) {
        throw new Error('Server is offline');
    }
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000)
    };
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    });
    
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        checkServerStatus,
        initServerStatusMonitoring,
        showToast,
        formatUptime,
        apiRequest,
        API_BASE_URL
    };
}
