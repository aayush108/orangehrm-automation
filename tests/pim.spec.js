const { test, expect } = require('@playwright/test');
const { OrangeHrmPage } = require('../pages/OrangeHrmPage');
const { INVALID_USERS } = require('../test-data/test-users');

test.describe('PIM Module Tests', () => {
    let orangeHrm;

    test.beforeEach(async ({ page }) => {
        orangeHrm = new OrangeHrmPage(page);
        const loginSuccess = await orangeHrm.login('validUser');
        expect(loginSuccess).toBeTruthy();
    });

    test.afterEach(async () => {
        await orangeHrm.logout();
    });

    test('Add New Employee with Minimal Details', {tag: ['@smoke', '@regression']}, async ({ page }) => {

        const employeeData = orangeHrm.getEmployeeData('minimalEmployee');

        await test.step('Add new employee with minimal details', async () => {
            await orangeHrm.addEmployee('minimalEmployee');
        });

        await test.step('Verify employee added successfully', async () => {
            const isSuccess = await orangeHrm.verifyEmployeeAddedSuccessfully();
            expect(isSuccess, 'Employee should be added successfully').toBeTruthy();

            const detailsCorrect = await orangeHrm.verifyEmployeeDetails(
                // employeeData.firstName, 
                // employeeData.lastName
            );
            expect(detailsCorrect, `Employee details should match: ${employeeData.firstName} ${employeeData.lastName}`).toBeTruthy();
        });

        await test.step('Verify employee appears in search results', async () => {
            await orangeHrm.searchEmployee({ employeeName: employeeData.firstName });

            const hasResults = await orangeHrm.verifySearchResults(1);
            expect(hasResults, 'Search should return at least 1 result').toBeTruthy();
        });

    });

    test('Search and Validate Existing Employee', {tag: '@regression'}, async ({ page }) => {

        const searchData = orangeHrm.getEmployeeData('fullEmployee');

        await test.step('Search for employee by name', async () => {
            await orangeHrm.searchEmployee({ employeeName: searchData.firstName });
        });

        await test.step('Verify search results are accurate', async () => {
            const hasResults = await orangeHrm.verifySearchResults(1);
            expect(hasResults, 'Search should return at least 1 result').toBeTruthy();
            await orangeHrm.pimPage.verifySearchResultsVisible();
        });

    });

    test('Edit Employee Personal Details', {tag: '@smoke'}, async ({ page }) => {
        test.slow()
        // const orangeHrm = new OrangeHrmPage(page);
        const employeeData = orangeHrm.getEmployeeData('minimalEmployee');
        const editData = orangeHrm.getEmployeeData('fullEmployee');

        await test.step('Add new employee for editing', async () => {
            await orangeHrm.addEmployee('minimalEmployee');
            const isSuccess = await orangeHrm.verifyEmployeeAddedSuccessfully();
            expect(isSuccess, 'Employee should be added successfully').toBeTruthy();
            // Ensure we are on the personal details page before editing
            const onDetailsPage = await orangeHrm.addEmployeePage.verifyPersonalDetailsPage();
            expect(onDetailsPage).toBeTruthy();
        });

        await test.step('Edit employee personal details', async () => {
            await orangeHrm.addEmployeePage.editPersonalDetails(editData);
        });

        await test.step('Verify changes are saved correctly', async () => {
            const isSuccess = await orangeHrm.addEmployeePage.verifySuccessMessage();
            expect(isSuccess, 'Employee should be added successfully').toBeTruthy();

            const licenseNumber = await orangeHrm.addEmployeePage.getLicenseNumberValue();
            expect(licenseNumber).toBe(editData.licenseNumber);
        });

    });
});

test.describe('Login Failure Tests', () => {
    for (const user of INVALID_USERS) {
        test(`User ${user.firstName} ${user.lastName} fails to login`, {tag: ['@smoke', '@regression']}, async ({ page }) => {
            const orangeHrm = new OrangeHrmPage(page);

            await test.step('Attempt login with invalid credentials', async () => {
                await orangeHrm.loginPage.navigateToLogin();
                await orangeHrm.loginPage.login(user.firstName, user.lastName);
            });

            await test.step('Verify error message is displayed', async () => {
                const hasError = await orangeHrm.loginPage.verifyErrorMessage();
                expect(hasError).toBeTruthy();
            });
        });
    }
});