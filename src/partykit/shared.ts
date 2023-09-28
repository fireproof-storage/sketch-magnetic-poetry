export const POETRY_ROOM_ID = "announcer";

export type Word = {
  id: string;
  text: string;
  // updated onDrag
  position: {
    x: number;
    y: number;
  };
}

export type Words = Record<string, Word>

export type Poem = {
  type: "poem";
  // for the database
  _id?: string;
  // set randomly from words.ts
  words: Words;
  // count
  players: number;
  // count
  turns: number;
  // datetime
  startedAt: number;
}


export type SyncMessage = {
  type: "sync";
  poem: Poem;
};

export type UpdateMessage = {
  type: "update";
  word: Word;
  turns: number;
  players: number;
};

export type TurnMessage = {
  type: "turn";
  word: Word;
};

export type ResetMessage = {
  type: "reset";
};

export type HereMessage = {
  type: "here";
  connections: number;
};

export type Message =
  | SyncMessage
  | UpdateMessage
  | TurnMessage
  | ResetMessage
  | HereMessage;
