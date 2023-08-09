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
  tiles: {
    // key: `${i},${j}`
    [key: string]: Tile;
  };
  // player: websocket id
  players: Set<string>;
  // count
  turns: number;
};

export type SyncMessage = {
  type: "sync";
  mosaic: Mosaic;
};

export type UpdateMessage = {
  type: "update";
  tile: Tile;
};

export type SetMessage = {
  type: "set";
  tile: Tile;
};

export type Message = SyncMessage | UpdateMessage | SetMessage;
