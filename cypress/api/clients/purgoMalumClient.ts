export class PurgoMalumClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    const configBaseUrl = baseUrl ?? Cypress.config().baseUrl;
    if (!configBaseUrl) {
      throw new Error(
        "Base URL must be provided via constructor or Cypress config",
      );
    }
    this.baseUrl = configBaseUrl;
  }

  filterText(
    text: string,
    format: "containsprofanity" | "plain" | "json" | "xml" = "plain",
    options: { add?: string; fillChar?: string; fillText?: string } = {},
  ): Cypress.Chainable<Cypress.Response<any>> {
    const qs: { [key: string]: string } = { text };

    if (options.add !== undefined && options.add !== "") {
      qs.add = options.add;
    }
    if (options.fillChar) {
      qs.fill_char = options.fillChar;
    }
    if (options.fillText) {
      qs.fill_text = options.fillText;
    }

    return cy.request({
      method: "GET",
      url: `${this.baseUrl}/${format}`,
      qs,
      failOnStatusCode: false,
      timeout: Cypress.config("env").apiTimeout || 10000,
    });
  }
}
