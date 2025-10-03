const { test, expect } = require('@playwright/test');
const { OrangeHrmPage } = require('../pages/OrangeHrmPage');

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

    test('Add New Employee with Minimal Details', { tag: ['@smoke', '@regression'] }, async ({ page }) => {

        const employeeData = orangeHrm.getEmployeeData('minimalEmployee');

        await test.step('Add new employee with minimal details', async () => {
            await orangeHrm.addEmployee('minimalEmployee');
        });

        await test.step('Verify employee added successfully', async () => {
            const isSuccess = await orangeHrm.verifyEmployeeAddedSuccessfully();
            expect(isSuccess, 'Employee should be added successfully').toBeTruthy();

            const detailsCorrect = await orangeHrm.verifyEmployeeDetails();
            expect(detailsCorrect, `Employee details should match: ${employeeData.firstName} ${employeeData.lastName}`).toBeTruthy();
        });

        await test.step('Verify employee appears in search results', async () => {
            await orangeHrm.searchEmployee({ employeeName: employeeData.firstName });

            const hasResults = await orangeHrm.verifySearchResults(1);
            expect(hasResults, 'Search should return at least 1 result').toBeTruthy();
        });

    });

    test('Search and Validate Existing Employee', { tag: '@regression' }, async ({ page }) => {
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

    test('Edit Employee Personal Details', { tag: '@smoke' }, async ({ page }) => {
        test.slow()
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

test.describe('PIM Module - Negative Tests', () => {
    let orangeHrm;
    test.beforeEach(async ({ page }) => {
        orangeHrm = new OrangeHrmPage(page);
        await orangeHrm.login('validUser');
    });

    test.afterEach(async () => {
        await orangeHrm.logout();
    });

    test('Cannot add employee without first name', { tag: ['@smoke', '@regression'] }, async ({ page }) => {
        await test.step('Navigate to Add Employee page', async () => {
            await orangeHrm.dashboardPage.navigateToPIM();
            await orangeHrm.pimPage.clickAddEmployee();
        });

        await test.step('Try to save without first name', async () => {
            await orangeHrm.addEmployeePage.enterLastName('TestLast');
            await orangeHrm.addEmployeePage.clickSave();
        });

        await test.step('Verify validation error appears', async () => {
            const errorVisible = await orangeHrm.addEmployeePage.verifyRequiredErrorMessage();
            expect(errorVisible, 'Validation error should be displayed').toBeTruthy();
        });
    });

    test('Search with non-existent employee returns no results', { tag: '@regression'}, async ({ page }) => {
        const searchData = {
            employeeName: 'NonExistentEmployee12345',
            employeeId: ''
        };

        await test.step('Search for non-existent employee', async () => {
            await orangeHrm.searchEmployee(searchData);
        });

        await test.step('Verify no results found', async () => {
            const resultCount = await orangeHrm.pimPage.getSearchResultsCount();
            expect(resultCount, 'Should return 0 results for non-existent employee').toBe(0);
        });
    });
});
