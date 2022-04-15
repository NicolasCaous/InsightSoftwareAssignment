import Ajv, { JSONSchemaType } from "ajv";

export const ListLobbiesMessageID = "ListLobbies";

interface ListLobbies {
  type: typeof ListLobbiesMessageID;
}

const schema: JSONSchemaType<ListLobbies> = {
  type: "object",
  properties: {
    type: {
      type: "string",
      const: ListLobbiesMessageID,
    },
  },
  required: ["type"],
  additionalProperties: false,
};

const ajv = new Ajv();
export const validateListLobbiesMessage = ajv.compile(schema);
