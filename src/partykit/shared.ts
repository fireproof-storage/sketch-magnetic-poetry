export const MOSAIC_ROOM_ID = "announcer";

export type Tile = {
  color: "black" | "white";
  i: number;
  j: number;
};

export type Mosaic = {
  // e.g. "Draw the number 3"
  challenge: string;
  // always a square
  size: number;
  // key: `${i},${j}`
  tiles: Record<string, Tile>;
  // count
  players: number;
  // count
  turns: number;
  // datetime
  startedAt: number;
};

export type SyncMessage = {
  type: "sync";
  mosaic: Mosaic;
};

export type UpdateMessage = {
  type: "update";
  tile: Tile;
  turns: number;
  players: number;
};

export type TurnMessage = {
  type: "turn";
  tile: Tile;
};

export type ResetMessage = {
  type: "reset";
};

export type Message = SyncMessage | UpdateMessage | TurnMessage | ResetMessage;
