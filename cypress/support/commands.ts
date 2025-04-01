import { PurgoMalumClient } from "../api/clients/purgoMalumClient";

declare global {
  namespace Cypress {
    interface Chainable {
      filterProfanity(
        text: string,
        format?: "plain" | "json" | "xml",
        options?: { add?: string; fillChar?: string; fillText?: string },
      ): Chainable<Cypress.Response<any>>;
    }
  }
}

Cypress.Commands.add(
  "filterProfanity",
  (text, format = "plain", options = {}) => {
    const client = new PurgoMalumClient();
    return client.filterText(text, format, options);
  },
);
