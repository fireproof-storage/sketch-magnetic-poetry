import type * as Party from "partykit/server";

import type { Mosaic, SyncMessage, UpdateMessage } from "./shared";
import { MOSAIC_ROOM_ID } from "./shared";

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

export default class MosaicParty implements Party.Server {
  readonly options = {
    hibernate: true,
  };

  constructor(public party: Party.Party) {}

  async resetGame() {
    await this.party.storage.put("players", getDefaultPlayers());
    const mosaic = getDefaultMosiac();
    await this.party.storage.put("mosaic", mosaic);
    return mosaic;
  }

  async onStart() {
    const players = (await this.party.storage.get("players")) as Set<string>;
    const mosaic = (await this.party.storage.get("mosaic")) as Mosaic;
    if (!players || !mosaic) {
      this.resetGame();
    }
  }

  async onConnect(connection: Party.Connection, ctx: Party.ConnectionContext) {
    let mosaic = (await this.party.storage.get("mosaic")) as Mosaic;

    const msg = <SyncMessage>{
      type: "sync",
      mosaic: mosaic,
    };
    connection.send(JSON.stringify(msg));
  }

  async onMessage(message: string | ArrayBuffer, connection: Party.Connection) {
    const msg = JSON.parse(message as string);
    if (msg.type === "turn") {
      const players = (await this.party.storage.get("players")) as Set<string>;
      const mosaic = (await this.party.storage.get("mosaic")) as Mosaic;

      // Record the player
      players.add(connection.id);
      await this.party.storage.put("players", players);

      // Record the tile change
      mosaic.tiles[`${msg.tile.i},${msg.tile.j}`] = msg.tile;
      mosaic.turns++;
      mosaic.players = players.size;
      await this.party.storage.put("mosaic", mosaic);

      // Broadcast the new move to all connections
      const update = <UpdateMessage>{
        type: "update",
        tile: msg.tile,
        turns: mosaic.turns,
        players: mosaic.players,
      };
      this.party.broadcast(JSON.stringify(update), []);
    } else if (msg.type === "reset") {
      // Reset storage to defaults, and tell the whole party
      const newMosaic = await this.resetGame();
      const msg = <SyncMessage>{
        type: "sync",
        mosaic: newMosaic,
      };
      this.party.broadcast(JSON.stringify(msg), []);
    }
  }

  // As a debug endpoint, return the current state of the game from room storage
  // The url is NEXT_PUBLIC_PARTYKIT_HOST/party/MOSAIC_ROOM_ID
  // e.g. in dev: http://127.0.0.1:1999/party/announcer
  async onRequest(req: Party.Request) {
    if (this.party.id !== MOSAIC_ROOM_ID) {
      return new Response("Not found", { status: 404 });
    }

    if (req.method === "GET") {
      const players = (await this.party.storage.get("players")) as Set<string>;
      const mosaic = (await this.party.storage.get("mosaic")) as Mosaic;
      const dump = {
        players: Array.from(players),
        mosaic: mosaic,
      };
      return new Response(JSON.stringify(dump, null, 2));
    }

    return new Response("Method not implemented", { status: 501 });
  }
}
