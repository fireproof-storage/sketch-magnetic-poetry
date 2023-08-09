import type { PartyKitServer } from "partykit/server";
import { Mosaic, SyncMessage, UpdateMessage } from "./types";

export default {
  async onConnect(websocket, room) {
    let mosaic = await room.storage.get("mosaic");
    if (!mosaic) {
      mosaic = <Mosaic>{
        challenge: "The number 3",
        size: 10,
        tiles: {},
        players: {},
        turns: 0,
      };
      await room.storage.put("mosaic", mosaic);
    }

    const msg = <SyncMessage>{
      type: "sync",
      mosaic: mosaic,
    };
    websocket.send(JSON.stringify(msg));
  },

  async onMessage(message, websocket, room) {
    const msg = JSON.parse(message as string);
    if (msg.type === "set") {
      const mosaic = (await room.storage.get("mosaic")) as Mosaic;
      mosaic.tiles[`${msg.tile.i},${msg.tile.j}`] = msg.tile;
      mosaic.turns++;
      mosaic.players.add(websocket.id);
      await room.storage.put("mosaic", mosaic);
      const update = <UpdateMessage>{
        type: "update",
        tile: msg.tile,
      };
      room.broadcast(JSON.stringify(update), [websocket.id]);
    }
  },
} satisfies PartyKitServer;
