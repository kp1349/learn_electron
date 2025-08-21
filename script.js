document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('toggleLogs');
    const logsSection = document.getElementById('logsSection');
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const logs = document.getElementById('logs');
    
    let logsVisible = false;
    
    // Make logs textarea available to the shared logger
    window.logsTextarea = logs;
    
    // Import logging functions from the shared logger
    const { logInfo, logDebug, logWarning, logError, applyLogFilter } = window.Logger;
    
    // Toggle logs section
    toggleBtn.addEventListener('click', function() {
        logsVisible = !logsVisible;
        
        if (logsVisible) {
            logsSection.classList.remove('hidden');
            logsSection.classList.add('show');
            toggleBtn.textContent = 'Hide Logs';
            logInfo('Logs section opened');
        } else {
            logsSection.classList.remove('show');
            logsSection.classList.add('hidden');
            toggleBtn.textContent = 'Show Logs';
            logInfo('Logs section closed');
        }
    });
    
    // Handle log level filter
    const logLevelFilter = document.getElementById('logLevelFilter');
    logLevelFilter.addEventListener('change', function() {
        const selectedLevel = this.value;
        applyLogFilter(selectedLevel);
        logInfo(`Log filter changed to: ${selectedLevel}`);
    });
    
    // Handle input changes
    input.addEventListener('input', function() {
        const inputText = input.value;
        output.value = `Processed: ${inputText}`;
        
        if (inputText.length > 100) {
            logWarning(`Input text is getting long (${inputText.length} characters)`);
        }
        
        if (inputText.includes('error')) {
            logError('User entered text containing "error"');
        }
        
        logInfo(`Input changed: "${inputText.substring(0, 50)}${inputText.length > 50 ? '...' : ''}"`);
        logDebug(`Input length: ${inputText.length} characters`);
    });
    
    // Initialize with welcome logs
    logInfo('Application started');
    logInfo('Ready for input');
    logDebug('Logging system initialized with INFO level');
});
