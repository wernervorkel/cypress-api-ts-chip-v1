// cypress/schemas/validateXmlSchema.ts
import { DOMParser } from "xmldom";

export const validateXmlSchema = (xmlString: string): boolean => {
  console.log("XML Input:", xmlString);
  const doc = new DOMParser().parseFromString(xmlString, "text/xml");
  if (doc.documentElement.nodeName === "parsererror") {
    throw new Error("Invalid XML: " + xmlString);
  }

  // Check root is PurgoMalum
  const root = doc.documentElement;
  if (root.nodeName !== "PurgoMalum") {
    throw new Error("XML must have <PurgoMalum> as root element");
  }

  // Check for result or error child
  const children = Array.from(root.childNodes).filter((node) => node.nodeType === 1); // Element nodes only
  const hasResult = children.some((node) => node.nodeName === "result");
  const hasError = children.some((node) => node.nodeName === "error");

  console.log("Has Result:", hasResult, "Has Error:", hasError);

  if (hasResult && hasError) {
    throw new Error("XML must contain either <result> or <error>, not both");
  }
  if (!hasResult && !hasError) {
    throw new Error("XML must contain either <result> or <error>");
  }

  return true;
};