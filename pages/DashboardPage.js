const { expect } = require('@playwright/test');

class DashboardPage {
    constructor(page) {
        this.page = page;
        this.pimMenu = page.getByRole('link', { name: 'PIM' });
        this.userDropdown = page.locator('.oxd-userdropdown-tab');
        this.logoutLink = page.getByRole('menuitem', { name: 'Logout' });
    }

    async navigateToPIM() {
        console.log(`[DashboardPage] navigateToPIM called`);
        await this.pimMenu.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async logout() {
        console.log(`[DashboardPage] logout called`);
        await this.userDropdown.click();
        await this.logoutLink.click();
        await this.page.waitForLoadState('domcontentloaded');
        console.log(`[DashboardPage] logout completed`);
    }

    async verifyDashboardLoaded() {
        console.log(`[DashboardPage] verifyDashboardLoaded called`);
        const title = await this.page.title();
        console.log(`[DashboardPage] Page title: ${title}`);
        return title.includes('Dashboard');
    }
}

module.exports = { DashboardPage };