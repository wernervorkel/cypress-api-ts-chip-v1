import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { parseStringPromise } from "xml2js";
import { validateJsonSchema } from "../../schemas/jsonSchema";
import { validateXmlSchema } from "../../schemas/xmlSchema";

const aliasMap: { [key: string]: string } = {};

Given("I have a text {string}", (text: string) => {
  cy.wrap(text).as("inputText");
  aliasMap["inputText"] = text;
});

Given("I add extra words to filter {string}", (extraWords: string) => {
  cy.wrap(extraWords).as("extraWords");
  aliasMap["extraWords"] = extraWords;
});

Given("I use a fill character {string}", (fillChar: string) => {
  cy.wrap(fillChar).as("fillChar");
  aliasMap["fillChar"] = fillChar;
});

Given("I use a fill text {string}", (fillText: string) => {
  cy.wrap(fillText).as("fillText");
  aliasMap["fillText"] = fillText;
});

When("I filter it with format {string}", (format: "plain" | "json" | "xml") => {
  cy.get<string>("@inputText").then((text) => {
    const options: { add?: string; fillChar?: string; fillText?: string } = {};
    const aliases = ["extraWords", "fillChar", "fillText"];
    const optionKeys = ["add", "fillChar", "fillText"] as const;

    aliases.forEach((alias, index) => {
      if (aliasMap[alias]) {
        options[optionKeys[index]] = aliasMap[alias];
      }
    });

    cy.filterProfanity(text, format, options).as("filterResponse");
    cy.wrap(format).as("responseFormat");
  });
});

Then(
  /the result should be(?: (error with message))? "([^"]*)"/,
  (errorPrefix: string | undefined, expectedResult: string) => {
    const isErrorStep = !!errorPrefix;

    cy.get<Cypress.Response<any>>("@filterResponse").then((response) => {
      cy.get<string>("@responseFormat").then((format) => {
        if (format === "xml") {
          cy.wrap(parseStringPromise(response.body)).then((parsed: any) => {
            const parsedResponse = parsed.PurgoMalum;
            const result = isErrorStep
              ? parsedResponse.error?.[0]
              : parsedResponse.result?.[0];
            expect(
              result,
              `Expected ${isErrorStep ? "error" : "string"} to be "${expectedResult}" but got undefined. Parsed XML: ${JSON.stringify(parsed)}`,
            ).to.equal(expectedResult);
          });
        } else if (format === "json") {
          const result = isErrorStep
            ? response.body.error
            : response.body.result;
          expect(result).to.equal(expectedResult);
        } else {
          expect(response.body).to.equal(expectedResult);
        }
      });
    });
  },
);

Then("the response status should be {int}", (status: number) => {
  cy.get<Cypress.Response<any>>("@filterResponse").then((response) => {
    expect(response.status).to.equal(status);
  });
});

Then("the response schema should be valid", () => {
  cy.get<Cypress.Response<any>>("@filterResponse").then((response) => {
    cy.get<string>("@responseFormat").then((format) => {
      if (format === "json") {
        cy.wrap(validateJsonSchema(response.body)).should("be.true");
      } else if (format === "xml") {
        cy.wrap(validateXmlSchema(response.body)).should('be.true');
      } else {
        cy.log("Schema validation skipped for plain text format");
      }
    });
  });
});
