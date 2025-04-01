# cypress-api-ts-chip

# PurgoMalum API Testing with Cypress and Cucumber

This project uses [Cypress](https://www.cypress.io/) with the [Cypress Cucumber Preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor) to test the [PurgoMalum API](https://www.purgomalum.com/), a profanity filtering service. The tests validate filtering behavior across `plain`, `json`, and `xml` formats, including custom options (`add`, `fill_char`, `fill_text`) and error handling.

## Features

- **API Client**: `PurgoMalumClient.ts` provides a reusable class for API calls with a 500ms delay.
- **BDD Testing**: Gherkin scenarios in `purgoMalum.feature` define test cases in a human-readable format.
- **Test Isolation**: Ensures each scenario/example runs independently.
- **Comprehensive Coverage**: Tests various inputs, formats, options, and error conditions.

## Project Structure

```
cypress/
├── config/
│   └── environments.ts          # Environment configurations
├── api/
│   └── PurgoMalumClient.ts       # API client with filterText method
├── e2e/api
│   └── purgoMalum.feature        # Gherkin feature file with test scenarios
├── schemas/
│   ├── jsonSchema.ts           # JSON schema validation
│   └── xmlSchema.ts            # XML schema validation
├── support/
│   ├── commands.ts              # Custom Cypress commands (if any)
│   └── e2e.ts
├── step_definitions/
│   └── purgoMalum.ts      # Step definitions for Gherkin steps
├── cypress.config.ts            # Cypress configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Git](https://git-scm.com/)

## Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/wernervorkel/cypress-api-ts-chip.git
   cd cypress-api-ts-chip
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Verify Configuration**:

   - Ensure `cypress.config.ts` includes:

     ```typescript
     const { defineConfig } = require("cypress");
     const preprocessor = require("@badeball/cypress-cucumber-preprocessor");
     const browserify = require("@badeball/cypress-cucumber-preprocessor/browserify");

     module.exports = defineConfig({
       e2e: {
         baseUrl: "https://www.purgomalum.com/service",
         specPattern: "cypress/e2e/**/*.feature",
         setupNodeEvents(on, config) {
           preprocessor.addCucumberPreprocessorPlugin(on, config);
           on("file:preprocessor", browserify.default(config));
           return config;
         },
         env: {
           apiTimeout: 10000,
         },
       },
     });
     ```

   - Ensure `tsconfig.json` includes:
     ```json
     {
       "compilerOptions": {
         "target": "es6",
         "lib": ["es6", "dom"],
         "types": [
           "cypress",
           "node",
           "@badeball/cypress-cucumber-preprocessor",
           "xml2js"
         ],
         "module": "commonjs",
         "strict": true,
         "esModuleInterop": true,
         "skipLibCheck": true,
         "forceConsistentCasingInFileNames": true
       },
       "include": ["**/*.ts", "e2e/**/*.feature"]
     }
     ```

## Usage

### Running Tests

- **Open Cypress UI**:

  ```bash
  npm run test:test:open
  ```

  - Select `purgoMalum.feature` and run all scenarios.
  - Expect ~15.5s runtime (31 tests × 500ms delay).

- **Headless Mode**:
  ```bash
  npm run test:test:run
  ```
  - Runs all tests in the terminal.

### Test Cases

The `purgoMalum.feature` includes:

- **Basic Check**: Verifies API is operational.
- **Text Inputs**: Tests various inputs (normal, special characters, symbols) across formats.
- **Custom Filtering**: Tests `add` and `fill_char`/`fill_text` options.
- **Error Handling**: Verifies error messages for invalid inputs/options.

### Example Scenarios

```gherkin
Scenario: Verify PurgoMalum API is operational with plain text
  Given I have a text "Things Happens"
  When I filter it with format "plain"
  Then the response status should be 200

Scenario Outline: Filter text with custom words and fill character across formats
  Given I have a text "<input>"
  And I add extra words to filter "<words>"
  And I use a fill character "<replace>"
  When I filter it with format "<format>"
  Then the response status should be 200
  And the result should be "<expected>"

  Examples:
    | input            | format | words      | replace | expected         |
    | Who is Super Man | plain  | man, super | _       | Who is _____ ___ |
```

## Scripts

- `npm run test:test:open`: Opens Cypress UI.
- `npm run test:test:run`: Runs tests headlessly.

Add to `package.json`:

```json
"scripts": {
  "test:test:open": "cypress open",
  "test:test:run": "cypress run"
}
```

## Troubleshooting

- **Tests Fail**:

  - Check API responses: Add logging in `PurgoMalumClient.ts`:
    ```typescript
      return cy.request({ ... }).then((response) => {
        cy.log('Response:', response.body);
        return response;
      });
    ```
  - Adjust `<expected>` values in `purgoMalum.feature` if API behavior differs.

- **Timeouts**: Increase `apiTimeout` in `cypress.config.ts`:

  ```typescript
  env: {
    apiTimeout: 15000;
  }
  ```

- **Dependencies**: Ensure all are installed:
  ```bash
  npm install cypress @badeball/cypress-cucumber-preprocessor xml2js
  ```

## Contributing

1. Fork the repo.
2. Create a branch: `git checkout -b feature/your-feature`.
3. Commit changes: `git commit -m "Add your feature"`.
4. Push: `git push origin feature/your-feature`.
5. Open a pull request.
