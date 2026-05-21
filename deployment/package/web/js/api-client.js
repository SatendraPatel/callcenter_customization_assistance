// Configurable API Client for OMS Call Center Guides
// This version reads API URL from config.js for deployment flexibility

// Default to localhost if config not loaded
let API_BASE_URL = 'http://localhost:3000/api';

// Try to load config if available
if (typeof DEPLOYMENT_CONFIG !== 'undefined') {
    API_BASE_URL = `${DEPLOYMENT_CONFIG.getApiUrl()}/api`;
}

// Helper function to get headers with username
function getRequestHeaders() {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    // Add username if available
    if (window.OMS_USERNAME) {
        headers['X-Username'] = window.OMS_USERNAME;
        console.log('✅ Adding X-Username header:', window.OMS_USERNAME);
    } else {
        console.warn('⚠️ window.OMS_USERNAME not set, using Anonymous');
    }
    
    console.log('📤 Request headers:', headers);
    return headers;
}

// Fetch a guide by ID and return formatted HTML
async function fetchGuide(guideId) {
    try {
        const response = await fetch(`${API_BASE_URL}/guides/${guideId}/html`, {
            headers: getRequestHeaders()
        });
        const data = await response.json();
        
        if (data.success) {
            return data.html;
        } else {
            return `<div class="error">❌ Error: ${data.error}</div>`;
        }
    } catch (error) {
        console.error('Error fetching guide:', error);
        return `<div class="error">❌ Failed to load guide. Make sure the API server is running at ${API_BASE_URL.replace('/api', '')}.</div>`;
    }
}

// Search for guides by keyword
async function searchGuides(query) {
    try {
        const response = await fetch(`${API_BASE_URL}/guides/search/${encodeURIComponent(query)}`, {
            headers: getRequestHeaders()
        });
        const data = await response.json();
        
        if (data.success && data.guides.length > 0) {
            // Return the first matching guide's ID
            return data.guides[0].id;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error searching guides:', error);
        return null;
    }
}

// List all available guides
async function listGuides(category = null) {
    try {
        const url = category 
            ? `${API_BASE_URL}/guides?category=${category}`
            : `${API_BASE_URL}/guides`;
            
        const response = await fetch(url, {
            headers: getRequestHeaders()
        });
        const data = await response.json();
        
        if (data.success) {
            return data.guides;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error listing guides:', error);
        return [];
    }
}

// Check if API server is running
async function checkAPIHealth() {
    try {
        const healthUrl = API_BASE_URL.replace('/api', '/health');
        const response = await fetch(healthUrl, {
            headers: getRequestHeaders()
        });
        const data = await response.json();
        return data.status === 'ok';
    } catch (error) {
        return false;
    }
}

// Log current API URL for debugging
console.log('API Client initialized with URL:', API_BASE_URL);

// Made with Bob
