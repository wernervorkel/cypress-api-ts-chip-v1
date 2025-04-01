import Ajv from "ajv";

const ajv = new Ajv();

const jsonSchema = {
  type: "object",
  properties: {
    result: { type: "string" },
    error: { type: "string" },
  },
  oneOf: [{ required: ["result"] }, { required: ["error"] }],
  additionalProperties: false,
};

export const validateJsonSchema = (data: any) => {
  const validate = ajv.compile(jsonSchema);
  const valid = validate(data);
  if (!valid) {
    throw new Error(
      `JSON schema validation failed: ${JSON.stringify(validate.errors)}`,
    );
  }
  return true;
};
