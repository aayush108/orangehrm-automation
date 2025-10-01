const { LoginPage } = require('./LoginPage');
const { DashboardPage } = require('./DashboardPage');
const { PimPage } = require('./PimPage');
const { AddEmployeePage } = require('./AddEmployeePage');

const testData = require('../test-data/employees.json');
const userData = require('../test-data/users.json');

class OrangeHrmPage {
    constructor(page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.dashboardPage = new DashboardPage(page);
        this.pimPage = new PimPage(page);
        this.addEmployeePage = new AddEmployeePage(page);
    }

    getUserCredentials(userType = 'validUser') {
        console.log(`[OrangeHrmPage] getUserCredentials called with userType: ${userType}`);
        try {
            const creds = userData[userType];
            console.log(`[OrangeHrmPage] Credentials found:`, creds);
            return creds;
        } catch (error) {
            console.error(`[OrangeHrmPage] No credentials found for user type: ${userType}`);
            throw new Error(`No credentials found for user type: ${userType}`);
        }
    }

    getEmployeeData(employeeType = 'minimalEmployee') {
        console.log(`[OrangeHrmPage] getEmployeeData called with employeeType: ${employeeType}`);
        try {
            const emp = testData[employeeType];
            console.log(`[OrangeHrmPage] Employee data found:`, emp);
            return emp;
        } catch (error) {
            console.error(`[OrangeHrmPage] No employee data found for type: ${employeeType}`);
            throw new Error(`No employee data found for type: ${employeeType}`);
        }
    }

    async login(userType = 'validUser') {
        console.log(`[OrangeHrmPage] login called with userType: ${userType}`);
        const credentials = this.getUserCredentials(userType);
        await this.loginPage.navigateToLogin();
        await this.loginPage.login(credentials.username, credentials.password);
        const result = await this.loginPage.verifySuccessfulLogin();
        console.log(`[OrangeHrmPage] login result:`, result);
        return result;
    }

    async addEmployee(employeeType = 'minimalEmployee') {
        console.log(`[OrangeHrmPage] addEmployee called with employeeType: ${employeeType}`);
        const employeeData = this.getEmployeeData(employeeType);

        // Generate unique suffix
        const uniqueSuffix = Date.now().toString();

        // Clone and update employee data for uniqueness
        const uniqueEmployeeData = {
            ...employeeData,
            firstName: `${employeeData.firstName}_${uniqueSuffix}`,
            lastName: `${employeeData.lastName}_${uniqueSuffix}`,
        };

        await this.dashboardPage.navigateToPIM();
        await this.pimPage.clickAddEmployee();
        await this.addEmployeePage.addMinimalEmployee(
            uniqueEmployeeData.firstName,
            uniqueEmployeeData.lastName
        );
        console.log(`[OrangeHrmPage] addEmployee completed for:`, uniqueEmployeeData);
        // Store last used employee data for verification
        this.lastAddedEmployeeData = uniqueEmployeeData;
    }

    async searchEmployee(searchCriteria) {
        console.log(`[OrangeHrmPage] searchEmployee called with:`, searchCriteria);
        await this.dashboardPage.navigateToPIM();
        await this.pimPage.searchEmployee(searchCriteria.employeeName, searchCriteria.employeeId);
        console.log(`[OrangeHrmPage] searchEmployee completed for:`, searchCriteria);
    }

    async verifyEmployeeAddedSuccessfully() {
        // Try URL check first (most reliable)
        const hasCorrectUrl = await this.addEmployeePage.verifyEmployeeAddedByUrl();
        if (hasCorrectUrl) return true;

        // Fallback to success message
        const result = await this.addEmployeePage.verifySuccessMessage();
        console.log('[OrangeHrmPage] verifyEmployeeAddedSuccessfully result:', result);
        return result;
    }

    async verifySearchResults(expectedCount = 1) {
        console.log(`[OrangeHrmPage] verifySearchResults called with expectedCount: ${expectedCount}`);
        const actualCount = await this.pimPage.getSearchResultsCount();
        const result = actualCount >= expectedCount;
        console.log(`[OrangeHrmPage] verifySearchResults actualCount: ${actualCount}, result: ${result}`);
        return result;
    }

    async verifyEmployeeDetails(firstName, lastName) {
        const bothProvided = firstName && lastName;
        const noneProvided = !firstName && !lastName;

        if (bothProvided) {
            console.log(`[OrangeHrmPage] verifyEmployeeDetails called with firstName: ${firstName}, lastName: ${lastName}`);
        } else if (noneProvided) {
            if (this.lastAddedEmployeeData) {
                firstName = this.lastAddedEmployeeData.firstName;
                lastName = this.lastAddedEmployeeData.lastName;
                console.log(`[OrangeHrmPage] Using lastAddedEmployeeData for verification:`, this.lastAddedEmployeeData);
            } else {
                throw new Error('No employee details provided and no lastAddedEmployeeData available.');
            }
        } else {
            throw new Error('verifyEmployeeDetails must be called with both firstName and lastName, or with neither.');
        }

        const actualFirstName = await this.addEmployeePage.getFirstNameValue();
        const actualLastName = await this.addEmployeePage.getLastNameValue();
        const result = actualFirstName === firstName && actualLastName === lastName;
        console.log(`[OrangeHrmPage] verifyEmployeeDetails actual: { firstName: ${actualFirstName}, lastName: ${actualLastName} }, result: ${result}`);
        return result;
    }

    async logout() {
        console.log(`[OrangeHrmPage] logout called`);
        await this.dashboardPage.logout();
        console.log(`[OrangeHrmPage] logout completed`);
    }
}

module.exports = { OrangeHrmPage };