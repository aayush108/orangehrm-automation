const { test, expect } = require('@playwright/test');
const { OrangeHrmPage } = require('../pages/OrangeHrmPage');
const { INVALID_USERS } = require('../test-data/test-users');


test.describe('Login Failure Tests', () => {
    for (const user of INVALID_USERS) {
        test(`User ${user.firstName} ${user.lastName} fails to login`, { tag: ['@smoke', '@regression'] }, async ({ page }) => {
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