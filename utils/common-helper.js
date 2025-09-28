/**
 * Common helper functions for test automation
 */
class CommonHelper {
    
    /**
     * Waits for specified time
     * @param {number} ms - Milliseconds to wait
     * @returns {Promise} Promise that resolves after specified time
     */
    static async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Generates a random string of specified length
     * @param {number} length - Length of the random string
     * @returns {string} Random string
     */
    static generateRandomString(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * Formats date to YYYY-MM-DD format
     * @param {Date} date - Date object to format
     * @returns {string} Formatted date string
     */
    static formatDate(date) {
        return date.toISOString().split('T')[0];
    }
}

module.exports = CommonHelper;