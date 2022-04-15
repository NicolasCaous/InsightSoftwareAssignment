import Ajv, { JSONSchemaType } from "ajv";

export const MakeMoveMessageID = "MakeMove";

type MakeMove =
  | {
      type: typeof MakeMoveMessageID;
      id: string;
      moveType: "MoveAdd";
      column: number;
      row: number;
    }
  | {
      type: typeof MakeMoveMessageID;
      id: string;
      moveType: "MovePopOut";
      column: number;
    };

const schema: JSONSchemaType<MakeMove> = {
  oneOf: [
    {
      type: "object",
      properties: {
        type: {
          type: "string",
          const: MakeMoveMessageID,
        },
        id: {
          type: "string",
          maxLength: 127,
        },
        moveType: {
          type: "string",
          const: "MoveAdd",
        },
        column: {
          type: "number",
        },
        row: {
          type: "number",
        },
      },
      required: ["type", "id", "moveType", "column", "row"],
      additionalProperties: false,
    },
    {
      type: "object",
      properties: {
        type: {
          type: "string",
          const: MakeMoveMessageID,
        },
        id: {
          type: "string",
          maxLength: 127,
        },
        moveType: {
          type: "string",
          const: "MovePopOut",
        },
        column: {
          type: "number",
        },
      },
      required: ["type", "id", "moveType", "column"],
      additionalProperties: false,
    },
  ],
};

const ajv = new Ajv();
export const validateMakeMoveMessage = ajv.compile(schema);
