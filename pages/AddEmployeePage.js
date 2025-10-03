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
        this.licenseNumberInput = page.locator('div').filter({ hasText: /^Driver's License NumberLicense Expiry Date$/ }).getByRole('textbox').first();
        this.otherIdInput = page.locator('div').filter({ hasText: /^Employee IdOther Id$/ }).getByRole('textbox').nth(1);
        this.testFieldInput = page.locator('[ref="e306"]');
        this.personalDetailsSaveButton = page.locator('form').filter({ hasText: 'Employee Full Name' }).getByRole('button', { name: /save/i });
        // Marital Status Dropdown
        this.maritalStatusDropdown = page.locator('div').filter({ hasText: /^Marital Status-- Select --$/ }).locator('.oxd-select-text');
        this.maritalStatusOptions = page.locator('.oxd-select-dropdown .oxd-select-option');

        // Date of Birth
        this.dateOfBirthInput = page.locator('div').filter({ hasText: /^Date of BirthGender/ }).getByPlaceholder('yyyy-dd-mm');

        // Gender Radio Buttons
        this.maleGenderRadio = page.locator('label').filter({ hasText: /^Male$/ }).locator('span');
        this.femaleGenderRadio = page.locator('label').filter({ hasText: 'Female' }).locator('span');
        this.requiredFieldError = page.getByText('Required', { exact: true });
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
        await this.page.waitForTimeout(1000); // Add this line to wait for toast
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

    async verifySuccessMessage(timeout = 15000) {
        console.log(`[AddEmployeePage] verifySuccessMessage called with timeout: ${timeout}ms`);
        try {
            await expect(this.successMessage).toBeVisible({ timeout });
            const message = await this.successMessage.textContent();
            console.log(`[AddEmployeePage] Success message found: ${message}`);
            return (
                message.includes('Successfully Saved') ||
                message.includes('Success') ||
                message.includes('Successful')
            );
        } catch (error) {
            console.error(`[AddEmployeePage] Success message not found within ${timeout}ms:`, error.message);
            return false;
        }
    }

     async verifyRequiredErrorMessage(timeout = 15000) {
        console.log(`[AddEmployeePage] verifyErrorMessage called with timeout: ${timeout}ms`);
        try {
            await expect(this.requiredFieldError).toBeVisible({ timeout });
            const message = await this.requiredFieldError.textContent();
            console.log(`[AddEmployeePage] Required field error message found`);
            return (message.includes('Required'));
        } catch (error) {
            console.error(`[AddEmployeePage] Required field error message not found`, error.message);
            return false;
        }
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

    async clickPersonalDetailsSave() {
        console.log(`[AddEmployeePage] clickPersonalDetailsSave called`);
        await this.personalDetailsSaveButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async editPersonalDetails(editData) {
        console.log(`[AddEmployeePage] editPersonalDetails called with:`, editData);

        if (typeof this.page.isClosed === 'function' && this.page.isClosed()) {
            throw new Error('Page is closed before editing personal details.');
        }

        try {
            // Edit License Number
            if (editData.licenseNumber) {
                console.log('Filling license number...');
                await this.licenseNumberInput.waitFor({ state: 'visible', timeout: 5000 });
                await this.licenseNumberInput.fill(editData.licenseNumber);
                console.log('License number filled successfully');
            }

            // Edit Other ID - using the corrected locator
            if (editData.otherId) {
                console.log('Filling other ID...');
                try {
                    await this.otherIdInput.waitFor({ state: 'visible', timeout: 5000 });
                    console.log('Other Id visible:', await this.otherIdInput.isVisible());

                    await this.otherIdInput.fill(editData.otherId);
                    console.log('Other ID filled successfully');
                } catch (error) {
                    console.warn('Other ID field not available:', error.message);
                }
            }

            // Skip test field for now since the locator is problematic
            if (editData.testField) {
                console.log('Skipping test field due to locator issues - needs DOM inspection');
            }

            // Select Marital Status
            if (editData.maritalStatus) {
                console.log(`Selecting marital status: ${editData.maritalStatus}`);
                try {
                    await this.maritalStatusDropdown.waitFor({ state: 'visible', timeout: 5000 });

                    // Scroll into view before clicking
                    await this.maritalStatusDropdown.scrollIntoViewIfNeeded();
                    await this.page.waitForTimeout(300);

                    await this.maritalStatusDropdown.click();
                    console.log('Marital status dropdown clicked');

                    // Wait for dropdown options to appear with increased timeout
                    await this.page.waitForTimeout(500);
                    await this.maritalStatusOptions.first().waitFor({ state: 'visible', timeout: 5000 });
                    console.log('Dropdown options visible');

                    // Find and click the desired option - use exact match
                    const statusOption = this.maritalStatusOptions.getByText(editData.maritalStatus, { exact: true });
                    await statusOption.waitFor({ state: 'visible', timeout: 3000 });
                    await statusOption.click();

                    // Wait for dropdown to close
                    await this.page.waitForTimeout(300);
                    console.log('Marital status selected successfully');
                } catch (error) {
                    console.error('Marital status selection failed:', error.message);
                    // Take screenshot on failure
                    await this.page.screenshot({ path: 'marital-status-error.png', fullPage: true });
                    throw error;
                }
            }

            // TODO: Revisit and fix date picker interaction
            // Edit Date of Birth
            // if (editData.dateOfBirth) {
            //     console.log(`Filling date of birth: ${editData.dateOfBirth}`);
            //     try {
            //         await this.dateOfBirthInput.waitFor({ state: 'visible', timeout: 5000 });

            //         // Clear the field first, then fill
            //         await this.dateOfBirthInput.click();
            //         await this.dateOfBirthInput.fill('');
            //         await this.dateOfBirthInput.fill(editData.dateOfBirth);

            //         // Press Enter or Tab to confirm the date
            //         await this.dateOfBirthInput.press('Tab');
            //         console.log('Date of birth filled successfully');
            //     } catch (error) {
            //         console.warn('Date of birth field not available:', error.message);
            //     }
            // }

            // Select Gender
            if (editData.gender) {
                console.log(`Selecting gender: ${editData.gender}`);
                try {
                    if (editData.gender.toLowerCase() === 'male') {
                        await this.maleGenderRadio.waitFor({ state: 'visible', timeout: 5000 });
                        await this.maleGenderRadio.click();
                    } else if (editData.gender.toLowerCase() === 'female') {
                        await this.femaleGenderRadio.waitFor({ state: 'visible', timeout: 5000 });
                        await this.femaleGenderRadio.click();
                    }
                    console.log('Gender selected successfully');
                } catch (error) {
                    console.warn('Gender selection failed:', error.message);
                }
            }

            // Save using the specific personal details save button
            console.log('Attempting to save personal details...');
            await this.clickPersonalDetailsSave();
            console.log('Personal details save clicked successfully');

        } catch (error) {
            console.error('Error in editPersonalDetails:', error);
            throw error;
        }
    }

    async verifyEmployeeAddedByUrl() {
        const url = this.page.url();
        return url.includes('/pim/viewPersonalDetails/empNumber/');
    }

    async getLicenseNumberValue() {
        console.log(`[AddEmployeePage] getLicenseNumberValue called`);
        try {
            await this.licenseNumberInput.waitFor({ state: 'visible', timeout: 3000 });
            return await this.licenseNumberInput.inputValue();
        } catch (error) {
            console.warn('License number field not available:', error.message);
            return '';
        }
    }

}

module.exports = { AddEmployeePage };