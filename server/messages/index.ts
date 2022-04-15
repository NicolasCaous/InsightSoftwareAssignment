import Ajv, { JSONSchemaType } from "ajv";

import { CreateLobbyMessageID } from "./create-lobby";
import { JoinLobbyMessageID } from "./join-lobby";
import { LeaveLobbyMessageID } from "./leave-lobby";
import { ListLobbiesMessageID } from "./list-lobbies";
import { MakeMoveMessageID } from "./make-move";

const MessageTypeIDsArr = [
  CreateLobbyMessageID,
  JoinLobbyMessageID,
  LeaveLobbyMessageID,
  ListLobbiesMessageID,
  MakeMoveMessageID,
] as const;
export type MessageTypeIDs = typeof MessageTypeIDsArr[number];

interface Message {
  type: MessageTypeIDs;
}

const schema: JSONSchemaType<Message> = {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: MessageTypeIDsArr,
    },
  },
  required: ["type"],
  additionalProperties: true,
};

const ajv = new Ajv();
export const isMessage = ajv.compile<Message>(schema);
