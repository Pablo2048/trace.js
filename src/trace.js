// Diagnostic logging functionality for a JavaScript web application.
// This script provides log levels (INFO, WARNING, ERROR, VERBOSE) and a module-based filtering system.
// Levels and modules can be configured via global variables in the main HTML file.

// Configuration: Set these variables in the main HTML file to control logging.
// Example:
// <script>
//   window.LOG_LEVEL = 'VERBOSE';
//   window.ENABLED_MODULES = ['module1', 'module2'];
// </script>

(function () {
    const LEVELS = {
        ERROR: 0,
        WARNING: 1,
        INFO: 2,
        VERBOSE: 3
    };

    const COLORS = {
        ERROR: 'color: red;',
        WARNING: 'color: orange;',
        INFO: 'color: green;',
        VERBOSE: 'color: gray;'
    };

    const DEFAULT_LEVEL = LEVELS.INFO;
    const LOG_LEVEL = window.LOG_LEVEL ? LEVELS[window.LOG_LEVEL.toUpperCase()] : DEFAULT_LEVEL;
    const ENABLED_MODULES = window.ENABLED_MODULES || [];

    function getTimestamp() {
        return new Date().toISOString();
    }

    function getCurrentScriptName() {
        try {
            const error = new Error();
            const stackLines = error.stack.split("\n");
            for (const line of stackLines) {
                if (line.includes('.js') && !line.includes('trace.js')) {
                    const match = line.match(/([^\/\\]+\.js)/);
                    if (match) {
                        return match[1];
                    }
                }
            }
        } catch (e) {
            return 'unknown';
        }
        return 'unknown';
    }

    function shouldLog(module, level) {
        return level <= LOG_LEVEL && (ENABLED_MODULES.length === 0 || ENABLED_MODULES.includes('*') || ENABLED_MODULES.includes(module));
    }

    function logMessage(level, module, ...message) {
        if (!module) {
            module = getCurrentScriptName();
        }
        if (shouldLog(module, level)) {
            const timestamp = getTimestamp();
            console.log(`%c[${timestamp}] [${module}]`, COLORS[Object.keys(LEVELS)[level]], ...message);
        }
    }

    // Define logging functions similar to C++ macros
    window.TRACE_ERROR = (module, ...message) => logMessage(LEVELS.ERROR, module, ...message);
    window.TRACE_WARNING = (module, ...message) => logMessage(LEVELS.WARNING, module, ...message);
    window.TRACE_INFO = (module, ...message) => logMessage(LEVELS.INFO, module, ...message);
    window.TRACE_VERBOSE = (module, ...message) => logMessage(LEVELS.VERBOSE, module, ...message);
})();

// Example usage in a JavaScript file:
// TRACE_INFO('', 'This is an info message');
// TRACE_ERROR('module2', 'An error occurred');
// TRACE_WARNING('module1', 'This is a warning');
// TRACE_VERBOSE('', 'Verbose debug information');