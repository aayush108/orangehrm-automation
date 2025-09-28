const faker = require('faker');

class TestDataHelper {
    
    /**
     * Generates unique employee data using Faker library and current timestamp
     * @returns {Object} Employee data object with unique values
     */
    static generateUniqueEmployeeData() {
        return {
            firstName: `Auto${faker.name.firstName()}${Date.now()}`,
            lastName: `Auto${faker.name.lastName()}${Date.now()}`,
            middleName: faker.name.firstName(),
            employeeId: `E${Date.now()}`,
            licenseNumber: `LIC-${Date.now()}`,
            maritalStatus: 'Single',
            dateOfBirth: '1985-05-15'
        };
    }

    /**
     * Loads test data from JSON file
     * @param {string} dataType - Type of data to load (users, employees, search-criteria)
     * @returns {Object} Test data object
     */
    static loadTestData(dataType) {
        try {
            return require(`../test-data/${dataType}.json`);
        } catch (error) {
            throw new Error(`Failed to load test data for ${dataType}: ${error.message}`);
        }
    }

    /**
     * Gets user credentials from test data
     * @param {string} userType - Type of user (validUser, invalidUser)
     * @returns {Object} User credentials object
     */
    static getUserCredentials(userType = 'validUser') {
        const usersData = this.loadTestData('users');
        return usersData[userType];
    }

    /**
     * Gets employee data from test data
     * @param {string} employeeType - Type of employee data (minimalEmployee, fullEmployee)
     * @returns {Object} Employee data object
     */
    static getEmployeeData(employeeType = 'minimalEmployee') {
        const employeesData = this.loadTestData('employees');
        return employeesData[employeeType];
    }
}

module.exports = TestDataHelper;