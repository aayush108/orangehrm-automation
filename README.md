# OrangeHRM Playwright Automation

Automated end-to-end testing for the OrangeHRM web application using [Playwright](https://playwright.dev/). This project covers employee management workflows, including login, employee creation, search, and editing, with robust test data management and reporting.

## 🏗️  Features

- **Automated UI Tests**: Covers login, add/search/edit employee, and validation scenarios.
- **Page Object Model**: Modular, maintainable structure for page interactions.
- **Test Data Management**: Dynamic and static test data via JSON.
- **Cross-Browser Support**: Easily configurable for Chromium, Firefox, and WebKit.
- **Reporting**: HTML reports generated after each run.
- **Environment Config**: Easily switch base URLs and settings via `.env`.

## Project Structure

```
.
├── pages/           # Page Object classes
├── tests/           # Playwright test specs
├── test-data/       # Static test data (users, employees, search criteria)
├── utils/           # Helpers for data and common utilities
├── playwright.config.js
├── .env
├── package.json
└── playwright-report/ # Test reports (generated)
```

## 🚀 Setup

1. **Clone the repository**
   ```sh
   git clone git@github.com:aayush108/orangehrm-automation.git
   cd orangehrm-automation
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Configure environment**

   Edit `.env` for base URL, timeouts, and headless mode as needed.

4. **(Optional) Update test data**

   Modify files in `test-data/` for custom users or employees.

## 🎬 Running Tests

- **Run all tests**
  ```sh
  npx playwright test --workers 1
  ```

- **Run a specific test file**
  ```sh
  npx playwright test tests/pim.spec.js
  ```

- **Run tests in headed mode**
  ```sh
  npx playwright test --headed
  ```

- **Run tests for a specific browser**
  ```sh
  npx playwright test --project=chromium
  npx playwright test --project=firefox
  npx playwright test --project=webkit
  ```

## 📊 Viewing Reports

After a test run, view the HTML report:

```sh
npx playwright show-report
```

The report will open in your default browser.


## 📚 Best Practices Implemented

### **Code Quality Standards**

#### **1. Documentation**
- **JSDoc comments** for all public methods
- **Inline comments** for complex business logic
- **Console logs** for test flow and debugging


#### **2. Testing Practices**
- **Single responsibility** per test method
- **Clear test naming** conventions with business context
- **Independent test execution** without dependencies
- **Meaningful assertions** with descriptive error messages

#### **3. Code Organization**
- **Consistent file and folder structure**
- **Clear separation of concerns** (pages, tests, data, utils)


### **Performance Optimizations**

#### **1. Execution Efficiency**
- **Parallel test execution** where possible
- **Efficient locator strategies** with proper waits
- **Browser context reuse** for related tests

#### **2. Maintenance Efficiency**
- **Data-driven approach** for scalable test creation
- **Parameterized tests** for multiple scenarios
- **Automated reporting** and failure analysi

## 🎯 Trade-offs & Future Improvements

### Trade-offs

- **Test Data Source**: Currently uses static JSON and Faker for data. A database or API-driven approach could improve realism and flexibility.
- **Browser Coverage**: Only WebKit is enabled by default for speed; others are commented out in `playwright.config.js`.
- **Error Handling**: Basic error handling is implemented; more granular logging and screenshots on failure could be added.

### Future Enhancements

- **CI/CD Integration**: Automate test runs on pull requests and merges.
- **Parallel Cross-Browser Testing**: Enable and optimize for all major browsers.
- **Advanced Reporting**: Integrate with dashboards or Slack for test notifications.
- **Data Cleanup**: Implement teardown scripts to remove test data after runs.
- **Coverage Expansion**: Add tests for more OrangeHRM modules (Leave, Recruitment, etc.).
- **Accessibility & Performance Checks**: Integrate Playwright’s accessibility and performance audits.

