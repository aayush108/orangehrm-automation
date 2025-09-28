const { expect } = require('@playwright/test');

class PimPage {
    constructor(page) {
        this.page = page;
        this.addEmployeeButton = page.getByRole('button', { name: /add/i });
        this.employeeNameSearch = page.locator('input[placeholder="Type for hints..."]').first();
        this.employeeIdSearch = page.locator('div.oxd-input-group:has(label:has-text("Employee Id")) input');
        this.searchButton = page.getByRole('button', { name: /search/i });
        this.searchResultsTable = page.locator('.oxd-table');
        this.searchResultsRows = page.locator('.oxd-table-card');
        this.employeeNameInResults = page.locator('.oxd-table-cell:first-child .oxd-text');
        this.employeeIdInResults = page.locator('.oxd-table-cell:nth-child(2) .oxd-text');
    }

    async clickAddEmployee() {
        console.log(`[PimPage] clickAddEmployee called`);
        await this.addEmployeeButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async searchEmployee(employeeName, employeeId = '') {
        console.log(`[PimPage] searchEmployee called with:`, { employeeName, employeeId });
        if (employeeName) {
            await this.employeeNameSearch.fill(employeeName);
        }
        if (employeeId) {
            await this.employeeIdSearch.fill(employeeId);
        }
        await this.searchButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async getSearchResultsCount() {
        console.log(`[PimPage] getSearchResultsCount called`);
        const count = await this.searchResultsRows.count();
        console.log(`[PimPage] Search results count: ${count}`);
        return count;
    }

    async getFirstResultEmployeeName() {
        console.log(`[PimPage] getFirstResultEmployeeName called`);
        return await this.employeeNameInResults.first().textContent();
    }

    async getFirstResultEmployeeId() {
        console.log(`[PimPage] getFirstResultEmployeeId called`);
        return await this.employeeIdInResults.first().textContent();
    }

    async clickFirstEmployeeInResults() {
        console.log(`[PimPage] clickFirstEmployeeInResults called`);
        await this.employeeNameInResults.first().click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async verifySearchResultsVisible() {
        console.log(`[PimPage] verifySearchResultsVisible called`);
        await expect(this.searchResultsTable).toBeVisible();
    }
}

module.exports = { PimPage };