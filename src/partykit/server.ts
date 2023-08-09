import type { PartyKitServer } from "partykit/server";
import { Mosaic, SyncMessage, UpdateMessage } from "./types";

function getDefaultPlayers() {
  return new Set<string>();
}

function getDefaultMosiac() {
  const challenges = [
    "A smiley face",
    "The number 3",
    "The letter A",
    "The letter T",
    "A house",
    "A tree",
    "A cat face",
    "A grinning face",
  ];
  return <Mosaic>{
    challenge: challenges[Math.floor(Math.random() * challenges.length)],
    size: 15,
    tiles: {},
    players: 0,
    turns: 0,
    startedAt: new Date().getTime(),
  };
}

export default {
  async onConnect(websocket, room) {
    let players = (await room.storage.get("players")) as Set<string>;
    let mosaic = (await room.storage.get("mosaic")) as Mosaic;

    if (!players) {
      await room.storage.put("players", getDefaultPlayers());
    }

    if (!mosaic) {
      await room.storage.put("mosaic", getDefaultMosiac());
    }

    const msg = <SyncMessage>{
      type: "sync",
      mosaic: mosaic,
    };
    websocket.send(JSON.stringify(msg));
  },

  async onMessage(message, websocket, room) {
    const msg = JSON.parse(message as string);
    if (msg.type === "turn") {
      const players = (await room.storage.get("players")) as Set<string>;
      const mosaic = (await room.storage.get("mosaic")) as Mosaic;
      players.add(websocket.id);
      await room.storage.put("players", players);
      mosaic.tiles[`${msg.tile.i},${msg.tile.j}`] = msg.tile;
      mosaic.turns++;
      mosaic.players = players.size;
      await room.storage.put("mosaic", mosaic);
      const update = <UpdateMessage>{
        type: "update",
        tile: msg.tile,
        turns: mosaic.turns,
        players: mosaic.players,
      };
      room.broadcast(JSON.stringify(update), []);
    } else if (msg.type === "reset") {
      await room.storage.put("players", getDefaultPlayers());
      const mosaic = getDefaultMosiac();
      await room.storage.put("mosaic", mosaic);
      const msg = <SyncMessage>{
        type: "sync",
        mosaic: mosaic,
      };
      room.broadcast(JSON.stringify(msg), []);
    }
  },
} satisfies PartyKitServer;
