// Simple REST client that should definitely work
console.log('rest-simple.js loading...');

(function() {
    'use strict';
    
    console.log('Creating simple RestClient...');
    
    // Simple test function
    async function makeTestRequest(url = 'https://www.google.com') {
        console.log('makeTestRequest called with url:', url);
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Electron-App/1.0'
                }
            });
            
            const result = {
                status: response.status,
                statusText: response.statusText,
                url: response.url,
                timestamp: new Date().toISOString()
            };
            
            console.log('Request successful:', result);
            return result;
            
        } catch (error) {
            console.error('Request failed:', error);
            throw error;
        }
    }
    
    // Set up global objects
    if (typeof window !== 'undefined') {
        console.log('Setting up window.RestClient...');
        window.RestClient = {
            test: makeTestRequest
        };
        window.makeTestRequest = makeTestRequest;
        console.log('RestClient setup complete. Available methods:', Object.keys(window.RestClient));
    }
    
    console.log('rest-simple.js setup complete');
})();
