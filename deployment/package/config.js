// Deployment Configuration
// Update this file with your server details before deployment

const DEPLOYMENT_CONFIG = {
    // API Server Configuration
    api: {
        host: '9.30.248.79',  // Change to your server IP or domain
        port: 5000,
        protocol: 'http'    // Change to 'https' if using SSL
    },
    
    // Web Server Configuration (for chatbot UI)
    web: {
        host: '9.30.248.79',  // Change to your server IP or domain
        port: 9090,
        protocol: 'http'    // Change to 'https' if using SSL
    },
    
    // Get full API URL
    getApiUrl() {
        return `${this.api.protocol}://${this.api.host}:${this.api.port}`;
    },
    
    // Get full Web URL
    getWebUrl() {
        return `${this.web.protocol}://${this.web.host}:${this.web.port}`;
    }
};

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DEPLOYMENT_CONFIG;
}

// Made with Bob
