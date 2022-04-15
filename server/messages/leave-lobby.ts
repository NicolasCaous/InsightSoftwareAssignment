import Ajv, { JSONSchemaType } from "ajv";

export const LeaveLobbyMessageID = "LeaveLobby";

interface LeaveLobby {
  type: typeof LeaveLobbyMessageID;
  id: string;
}

const schema: JSONSchemaType<LeaveLobby> = {
  type: "object",
  properties: {
    type: {
      type: "string",
      const: LeaveLobbyMessageID,
    },
    id: {
      type: "string",
      maxLength: 127
    },
  },
  required: ["type", "id"],
  additionalProperties: false,
};

const ajv = new Ajv();
export const validateLeaveLobbyMessage = ajv.compile(schema);
