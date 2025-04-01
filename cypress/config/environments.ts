interface EnvironmentConfig {
  baseUrl: string;
  apiTimeout: number;
}

interface Environments {
  [key: string]: EnvironmentConfig;
}

export const environments: Environments = {
  test: {
    baseUrl: "https://www.purgomalum.com/service",
    apiTimeout: 10000,
  },
  staging: {
    baseUrl: "https://www.purgomalum.com/service",
    apiTimeout: 15000,
  },
  production: {
    baseUrl: "https://www.purgomalum.com/service",
    apiTimeout: 20000,
  },
};

export const getEnvironment = (envName: string = "test"): EnvironmentConfig => {
  return environments[envName] || environments.test;
};
