const { test, expect } = require('@playwright/test');
const { OrangeHrmPage } = require('../pages/OrangeHrmPage');
const { INVALID_USERS } = require('../test-data/test-users');

test.describe('PIM Module Tests', () => {
    
    test('Add New Employee with Minimal Details', async ({ page }) => {
        const orangeHrm = new OrangeHrmPage(page);
        const employeeData = orangeHrm.getEmployeeData('minimalEmployee');

        await test.step('Login to application', async () => {
            const loginSuccess = await orangeHrm.login('validUser');
            expect(loginSuccess).toBeTruthy();
        });

        await test.step('Add new employee with minimal details', async () => {
            await orangeHrm.addEmployee('minimalEmployee');
        });

        await test.step('Verify employee added successfully', async () => {
            const isSuccess = await orangeHrm.verifyEmployeeAddedSuccessfully();
            expect(isSuccess).toBeTruthy();

            const detailsCorrect = await orangeHrm.verifyEmployeeDetails(
                // employeeData.firstName, 
                // employeeData.lastName
            );
            expect(detailsCorrect).toBeTruthy();
        });

        await test.step('Verify employee appears in search results', async () => {
            await orangeHrm.searchEmployee({ employeeName: employeeData.firstName });
            
            const hasResults = await orangeHrm.verifySearchResults(1);
            expect(hasResults).toBeTruthy();
        });

        await test.step('Logout from application', async () => {
            await orangeHrm.logout();
        });
    });

    test('Search and Validate Existing Employee', async ({ page }) => {
        const orangeHrm = new OrangeHrmPage(page);
        const searchData = orangeHrm.getEmployeeData('fullEmployee');

        await test.step('Login to application', async () => {
            const loginSuccess = await orangeHrm.login('validUser');
            expect(loginSuccess).toBeTruthy();
        });

        await test.step('Search for employee by name', async () => {
            await orangeHrm.searchEmployee({ employeeName: searchData.firstName });
        });

        await test.step('Verify search results are accurate', async () => {
            const hasResults = await orangeHrm.verifySearchResults(1);
            expect(hasResults).toBeTruthy();
            await orangeHrm.pimPage.verifySearchResultsVisible();
        });

        await test.step('Logout from application', async () => {
            await orangeHrm.logout();
        });
    });

    test('Edit Employee Personal Details', async ({ page }) => {
        test.slow()
        const orangeHrm = new OrangeHrmPage(page);
        const employeeData = orangeHrm.getEmployeeData('minimalEmployee');
        const editData = orangeHrm.getEmployeeData('fullEmployee');

        await test.step('Login to application', async () => {
            const loginSuccess = await orangeHrm.login('validUser');
            expect(loginSuccess).toBeTruthy();
        });

        await test.step('Add new employee for editing', async () => {
            await orangeHrm.addEmployee('minimalEmployee');
            const isSuccess = await orangeHrm.verifyEmployeeAddedSuccessfully();
            expect(isSuccess).toBeTruthy();
            // Ensure we are on the personal details page before editing
            const onDetailsPage = await orangeHrm.addEmployeePage.verifyPersonalDetailsPage();
            expect(onDetailsPage).toBeTruthy();
        });

        await test.step('Edit employee personal details', async () => {
            await orangeHrm.addEmployeePage.editPersonalDetails(editData);
        });

        await test.step('Verify changes are saved correctly', async () => {
            const isSuccess = await orangeHrm.addEmployeePage.verifySuccessMessage();
            expect(isSuccess).toBeTruthy();

            const licenseNumber = await orangeHrm.addEmployeePage.getLicenseNumberValue();
            expect(licenseNumber).toBe(editData.licenseNumber);
        });

        await test.step('Logout from application', async () => {
            await orangeHrm.logout();
        });
    });
});

test.describe('Login Failure Tests', () => {
    for (const user of INVALID_USERS) {
        test(`User ${user.firstName} ${user.lastName} fails to login`, async ({ page }) => {
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