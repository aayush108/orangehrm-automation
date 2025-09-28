const { expect } = require('@playwright/test');

class AddEmployeePage {
    constructor(page) {
        this.page = page;
        this.firstNameInput = page.getByRole('textbox', { name: /first name/i });
        this.lastNameInput = page.getByRole('textbox', { name: /last name/i });
        this.employeeIdInput = page.locator('input[class*="employeeId"]');
        this.saveButton = page.getByRole('button', { name: /save/i });
        this.successMessage = page.locator('.oxd-text--toast-title');
        this.personalDetails = page.getByRole('heading', { name: 'Personal Details' });
        this.licenseNumberInput = page.locator('.oxd-input-group:has(label:has-text("Driver\'s License Number")) input');
        this.maritalStatusDropdown = page.locator('label:has-text("Marital Status") + div .oxd-select-text');
        this.dateOfBirthInput = page.locator('label:has-text("Date of Birth") + div input');
        this.otherIdInput = page.locator('[ref="e212"]');
        this.testFieldInput = page.locator('[ref="e306"]');
    }

    async enterFirstName(firstName) {
        console.log(`[AddEmployeePage] enterFirstName called with: ${firstName}`);
        await this.firstNameInput.fill(firstName);
    }

    async enterLastName(lastName) {
        console.log(`[AddEmployeePage] enterLastName called with: ${lastName}`);
        await this.lastNameInput.fill(lastName);
    }

    async enterEmployeeId(employeeId) {
        console.log(`[AddEmployeePage] enterEmployeeId called with: ${employeeId}`);
        await this.employeeIdInput.fill(employeeId);
    }

    async clickSave() {
        console.log(`[AddEmployeePage] clickSave called`);
        await this.saveButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async addMinimalEmployee(firstName, lastName, employeeId = '') {
        console.log(`[AddEmployeePage] addMinimalEmployee called with:`, { firstName, lastName, employeeId });
        await this.enterFirstName(firstName);
        await this.enterLastName(lastName);
        if (employeeId) {
            await this.enterEmployeeId(employeeId);
        }
        await this.clickSave();
    }

    async verifySuccessMessage() {
        console.log(`[AddEmployeePage] verifySuccessMessage called`);
        await expect(this.successMessage).toBeVisible();
        const message = await this.successMessage.textContent();
        console.log(`[AddEmployeePage] Success message: ${message}`);
        return message.includes('Successfully Saved') || message.includes('Success');
    }

    async verifyPersonalDetailsPage() {
        console.log(`[AddEmployeePage] verifyPersonalDetailsPage called`);
        await expect(this.personalDetails).toBeVisible();
        return true;
    }

    async getFirstNameValue() {
        console.log(`[AddEmployeePage] getFirstNameValue called`);
        return await this.firstNameInput.inputValue();
    }

    async getLastNameValue() {
        console.log(`[AddEmployeePage] getLastNameValue called`);
        return await this.lastNameInput.inputValue();
    }

    async editPersonalDetails(editData) {
        console.log(`[AddEmployeePage] editPersonalDetails called with:`, editData);
        if (typeof this.page.isClosed === 'function' && this.page.isClosed()) {
            throw new Error('Page is closed before editing personal details.');
        }
        if (editData.licenseNumber) {
            console.log('Page identity befor licesnse:', this.page._guid);
            await this.licenseNumberInput.fill(editData.licenseNumber);
        }

        // TODO: These fields do not work as expected - investigate later
        // if (editData.maritalStatus) {
        //     await this.maritalStatusDropdown.click();
        //     // Wait for dropdown to appear and select the option
        //     const status = editData.maritalStatus;
        //     const option = page.locator('.oxd-select-dropdown span', { hasText: status });
        //     await option.click();      
        // }
        // if (editData.dateOfBirth) {
        //     await this.dateOfBirthInput.click();
        //     await this.dateOfBirthInput.clear();
        //     await this.dateOfBirthInput.fill(editData.dateOfBirth);
        // }
        if (editData.otherId) {
            console.log('Page identity after licesnse:', this.page._guid);
            console.log('Other Id locator count:', await this.otherIdInput.count());
            console.log('Other Id visible:', await this.otherIdInput.isVisible());
            await this.otherIdInput.fill(editData.otherId);
        }
        if (editData.testField) {
            console.log('Other Id visible:', await this.testFieldInput.isVisible());
            await this.testFieldInput.fill(editData.testField);
        }
        await this.clickSave();
    }

    async getLicenseNumberValue() {
        console.log(`[AddEmployeePage] getLicenseNumberValue called`);
        return await this.licenseNumberInput.inputValue();
    }
}

module.exports = { AddEmployeePage };