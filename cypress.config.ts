import { defineConfig } from "cypress";
import * as webpack from "@cypress/webpack-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const { getEnvironment } = require('./cypress/config/environments');

async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
): Promise<Cypress.PluginConfigOptions> {
  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    webpack({
      webpackOptions: {
        resolve: {
          extensions: [".ts", ".js", ".feature"],
          fallback: {
            "string_decoder": require.resolve('string_decoder/')
          }
        },
        module: {
          rules: [
            {
              test: /\.ts$/,
              exclude: [/node_modules/],
              use: [
                {
                  loader: "ts-loader",
                },
              ],
            },
            {
              test: /\.feature$/,
              use: [
                {
                  loader: "@badeball/cypress-cucumber-preprocessor/webpack",
                  options: config,
                },
              ],
            },
          ],
        },
        plugins: [
          new NodePolyfillPlugin()
        ]
      },
    }),
  );
  return config;
}

const envName = process.env.CYPRESS_ENV || 'test';
const envConfig = getEnvironment(envName);

export default defineConfig({
  e2e: {
    baseUrl: envConfig.baseUrl,
    specPattern: "**/*.feature",
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents,
    video: false,
    screenshotOnRunFailure: false,
    retries: {
      runMode: 2,
      openMode: 0
    },
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true
    }
  },
  env: {
    apiTimeout: envConfig.apiTimeout
  }
});