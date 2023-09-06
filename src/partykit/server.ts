import type {
  PartyServer,
  PartyServerOptions,
  PartyConnection,
  PartyConnectionContext,
  Party,
  PartyWorker,
} from "partykit/server";

import type { Mosaic, SyncMessage, UpdateMessage } from "./types";

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

export default class MosaicParty implements PartyServer {
  readonly options: PartyServerOptions = {
    hibernate: true,
  };

  constructor(public party: Party) {}

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

  async onConnect(connection: PartyConnection, ctx: PartyConnectionContext) {
    let mosaic = (await this.party.storage.get("mosaic")) as Mosaic;

    const msg = <SyncMessage>{
      type: "sync",
      mosaic: mosaic,
    };
    connection.send(JSON.stringify(msg));
  }

  async onMessage(message: string, connection: PartyConnection) {
    const msg = JSON.parse(message);
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
}
MosaicParty satisfies PartyWorker;
