import { DOMParser } from "xmldom";
import { select } from "xpath";

export const validateXmlSchema = (xmlString: string): boolean => {
  const doc = new DOMParser().parseFromString(xmlString);

  const responseNode = select("/response", doc) as Node[];
  if (responseNode.length !== 1) {
    throw new Error("XML must contain exactly one <response> root element");
  }

  const stringNode = select("/response/string", doc) as Node[];
  const errorNode = select("/response/error", doc) as Node[];

  const hasString = stringNode.length === 1;
  const hasError = errorNode.length === 1;

  if (hasString && hasError) {
    throw new Error("XML must contain either <string> or <error>, not both");
  }
  if (!hasString && !hasError) {
    throw new Error("XML must contain either <string> or <error>");
  }

  return true;
};
