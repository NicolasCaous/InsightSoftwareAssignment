import Ajv, { JSONSchemaType } from "ajv";

export const CreateLobbyMessageID = "CreateLobby";

interface CreateLobby {
  type: typeof CreateLobbyMessageID;
  color: "RED" | "YELLOW";
  name: string;
  variant: "Standard" | "PopOut";
}

const schema: JSONSchemaType<CreateLobby> = {
  type: "object",
  properties: {
    type: {
      type: "string",
      const: CreateLobbyMessageID,
    },
    color: {
      type: "string",
      enum: ["RED", "YELLOW"],
    },
    name: {
      type: "string",
      maxLength: 127,
    },
    variant: {
      type: "string",
      enum: ["Standard", "PopOut"],
    },
  },
  required: ["type", "color", "name", "variant"],
  additionalProperties: false,
};

const ajv = new Ajv();
export const validateCreateLobbyMessage = ajv.compile(schema);
