// Shared logging system for both main and renderer processes

// Log levels
const LogLevel = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR'
};

// Default log level
let currentLogLevel = LogLevel.INFO;

// Log filter level for renderer process
let logFilterLevel = LogLevel.INFO;

// Store all logs for filtering in renderer process
let allLogs = [];

// Check if we're in Node.js (main process) or browser (renderer process)
const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

// Log level colors - different implementations for Node.js vs browser
const logColors = isNode ? {
  [LogLevel.DEBUG]: '\x1b[90m',   // Gray
  [LogLevel.INFO]: '\x1b[32m',    // Green
  [LogLevel.WARNING]: '\x1b[33m', // Yellow
  [LogLevel.ERROR]: '\x1b[31m',   // Red
  RESET: '\x1b[0m'                // Reset
} : {
  [LogLevel.DEBUG]: '#888888',
  [LogLevel.INFO]: '#4CAF50',
  [LogLevel.WARNING]: '#FF9800',
  [LogLevel.ERROR]: '#F44336'
};

// Main logging function
function log(message, level = LogLevel.INFO) {
  const timestamp = new Date().toLocaleTimeString();
  const levelText = `[${level}]`;
  
  if (isNode) {
    // Node.js implementation (main process)
    const color = logColors[level] || '';
    const reset = logColors.RESET;
    console.log(`${color}[${timestamp}] ${levelText} ${message}${reset}`);
  } else {
    // Browser implementation (renderer process)
    const color = logColors[level];
    const logEntry = `[${timestamp}] ${levelText} ${message}`;
    console.log(`%c${logEntry}`, `color: ${color}; font-weight: bold;`);
    
    // Store log entry for filtering
    allLogs.push({ entry: logEntry, level: level });
    
    // If we have a logs textarea, add to it (with filtering)
    if (typeof window !== 'undefined' && window.logsTextarea) {
      if (shouldShowLog(level)) {
        window.logsTextarea.value += logEntry + '\n';
        window.logsTextarea.scrollTop = window.logsTextarea.scrollHeight;
      }
    }
  }
}

// Check if log should be shown based on filter level
function shouldShowLog(level) {
  const levelOrder = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARNING, LogLevel.ERROR];
  const filterIndex = levelOrder.indexOf(logFilterLevel);
  const logIndex = levelOrder.indexOf(level);
  return logIndex >= filterIndex;
}

// Apply log filter and refresh display
function applyLogFilter(filterLevel) {
  logFilterLevel = filterLevel;
  
  if (typeof window !== 'undefined' && window.logsTextarea) {
    // Clear current display
    window.logsTextarea.value = '';
    
    // Re-add filtered logs
    allLogs.forEach(log => {
      if (shouldShowLog(log.level)) {
        window.logsTextarea.value += log.entry + '\n';
      }
    });
    
    // Scroll to bottom
    window.logsTextarea.scrollTop = window.logsTextarea.scrollHeight;
  }
}

// Convenience functions for different log levels
function logDebug(message) {
  log(message, LogLevel.DEBUG);
}

function logInfo(message) {
  log(message, LogLevel.INFO);
}

function logWarning(message) {
  log(message, LogLevel.WARNING);
}

function logError(message) {
  log(message, LogLevel.ERROR);
}

// Set log level
function setLogLevel(level) {
  if (Object.values(LogLevel).includes(level)) {
    currentLogLevel = level;
    logInfo(`Log level set to: ${level}`);
  } else {
    logError(`Invalid log level: ${level}`);
  }
}

// Get current log level
function getLogLevel() {
  return currentLogLevel;
}

// Export for Node.js (main process)
if (isNode) {
  module.exports = {
    LogLevel,
    log,
    logDebug,
    logInfo,
    logWarning,
    logError,
    setLogLevel,
    getLogLevel
  };
} else {
  // Export for browser (renderer process)
  window.Logger = {
    LogLevel,
    log,
    logDebug,
    logInfo,
    logWarning,
    logError,
    setLogLevel,
    getLogLevel,
    applyLogFilter
  };
}
