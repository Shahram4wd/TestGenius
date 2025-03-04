# Playwright Functional Tests for Home Genius Exteriors

This repository contains functional tests for the Jobs module of the Home Genius Exteriors website using the Playwright framework. The tests are designed to run on both the development and staging environments. However, the test framework does not support the Zope portion of the website.

## Prerequisites

Before running the tests, ensure that you have the following installed:

- Node.js (LTS version recommended)
- Playwright
- Python (for environment variable management)
- `dotenv` package for handling environment variables

## Installation

1. Clone the repository:
   ```sh
   git clone <repo_url>
   cd <repo_name>
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Install Playwright browsers:
   ```sh
   npx playwright install
   ```

4. Install `dotenv`:
   ```sh
   npm install dotenv
   ```

## Environment Configuration

Create a `.env` file in the root directory of the project with the following structure:

```
USERNAME=<your_username>
PASSWORD=<your_password>
ENV=stage
```

- Set `ENV=dev` to run tests on the development environment.
- If `ENV` is not set to `dev`, the tests will run on the staging environment.

## Running the Tests

To execute the tests, use the following command:

```sh
npx playwright test
```

To run tests in a specific environment:

```sh
ENV=dev npx playwright test  # Runs tests in the dev environment
ENV=stage npx playwright test  # Runs tests in the staging environment
```

## Running Tests in Headed Mode

To run tests with a visible browser UI:

```sh
npx playwright test --headed
```

## Generating a Report

To generate a test report after execution:

```sh
npx playwright show-report
```

## Notes

- This test suite currently covers only the Jobs module of the Home Genius Exteriors website.
- The test framework does not support the Zope portion of the website.
- Ensure you have valid credentials set in the `.env` file before running the tests.

## Contributing

If you wish to contribute to this test suite:

1. Fork the repository.
2. Create a new branch for your changes.
3. Submit a pull request with a detailed description of the changes.

## License

This project is licensed under the MIT License.

