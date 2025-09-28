const { expect } = require('@playwright/test');

class LoginPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = page.getByRole('textbox', { name: /username/i });
        this.passwordInput = page.getByRole('textbox', { name: /password/i });
        this.loginButton = page.getByRole('button', { type: 'submit' });
        this.errorMessage = page.locator('.oxd-alert-content-text');
        this.dashboardHeader = page.locator('.oxd-topbar-header-breadcrumb-module');
    }

    async navigateToLogin() {
        console.log(`[LoginPage] navigateToLogin called`);
        await this.page.goto('/web/index.php/auth/login');
    }

    async enterUsername(username) {
        console.log(`[LoginPage] enterUsername called with: ${username}`);
        await this.usernameInput.fill(username);
    }

    async enterPassword(password) {
        console.log(`[LoginPage] enterPassword called with: ${password}`);
        await this.passwordInput.fill(password);
    }

    async clickLogin() {
        console.log(`[LoginPage] clickLogin called`);
        await this.loginButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async login(username, password) {
        console.log(`[LoginPage] login called with:`, { username, password });
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLogin();
    }

    async verifySuccessfulLogin() {
        console.log(`[LoginPage] verifySuccessfulLogin called`);
        await expect(this.dashboardHeader).toBeVisible();
        const headerText = await this.dashboardHeader.textContent();
        console.log(`[LoginPage] Dashboard header text: ${headerText}`);
        return headerText.includes('Dashboard');
    }

    async verifyErrorMessage() {
        console.log(`[LoginPage] verifyErrorMessage called`);
        await expect(this.errorMessage).toBeVisible();
        return true;
    }
}

module.exports = { LoginPage };