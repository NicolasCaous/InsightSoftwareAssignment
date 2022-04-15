import Ajv, { JSONSchemaType } from "ajv";

export const JoinLobbyMessageID = "JoinLobby";

interface JoinLobby {
  type: typeof JoinLobbyMessageID;
  id: string;
}

const schema: JSONSchemaType<JoinLobby> = {
  type: "object",
  properties: {
    type: {
      type: "string",
      const: JoinLobbyMessageID,
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
export const validateJoinLobbyMessage = ajv.compile(schema);
