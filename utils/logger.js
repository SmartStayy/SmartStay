const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../logs');
const logFile = path.join(logsDir, 'auth.log');

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

const logAuthEvent = async (action, email, ip, reason = '') => {
    const timestamp = new Date().toISOString(); 
    
    const logEntry = JSON.stringify({
        timestamp,
        action,
        email,
        ip,
        reason
    }) + '\n';

    try {
        await fs.promises.appendFile(logFile, logEntry);
    } catch (error) {
        console.error('Помилка запису лога:', error);
    }
};

module.exports = logAuthEvent;