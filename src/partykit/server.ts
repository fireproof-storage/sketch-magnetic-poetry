import type * as Party from "partykit/server";

import type { Poem, SyncMessage, UpdateMessage, HereMessage, Word, Words } from "./shared";
import { POETRY_ROOM_ID } from "./shared";

import { randomWords } from './words'

function getDefaultPlayers() {
  return new Set<string>();
}

function startNewPoem() {
  const words = randomWords
    .sort(() => 0.5 - Math.random())
    .slice(0, 15)
    .map((text, index) => {
      const position = {
        x: Math.floor(30 + (index % 4) * (95 + Math.random() * 10)),
        y: Math.floor(30 + Math.floor(index / 3.8) * (60 + Math.random() * 20))
      }
      return { text, position, id: Math.random().toString(36).slice(2, 9) } as Word
    })
    .reduce((acc, word) => {
      acc[word.id] = word
      return acc
    }, {} as Words)
  return <Poem>{
    words,
    players: 0,
    turns: 0,
    startedAt: new Date().getTime(),
  };
}

export default class PoetryParty implements Party.Server {
  readonly options = {
    hibernate: true,
  };

  constructor(public party: Party.Party) { }

  async resetGame() {
    await this.party.storage.put("players", getDefaultPlayers());
    const poem = startNewPoem();
    await this.party.storage.put("poem", poem);
    return poem;
  }

  async onStart() {
    const players = (await this.party.storage.get("players")) as Set<string>;
    const poem = (await this.party.storage.get("poem")) as Poem;
    if (!players || !poem) {
      this.resetGame();
    }
  }

  async onConnect(connection: Party.Connection, ctx: Party.ConnectionContext) {
    let poem = (await this.party.storage.get("poem")) as Poem;

    const syncMsg = <SyncMessage>{
      type: "sync",
      poem: poem,
    };
    connection.send(JSON.stringify(syncMsg));

    // Also broadcast the number of connections currently here
    // Used by the ConnectionStatus badge
    const hereMsg = <HereMessage>{
      type: "here",
      connections: Array.from(this.party.getConnections()).length,
    };
    this.party.broadcast(JSON.stringify(hereMsg), []);
  }

  onClose(connection: Party.Connection) {
    // Broadcast the number of connections currently here
    // Used by the ConnectionStatus badge
    // Reduce the number of connections by 1 as this one is above to leave
    const hereMsg = <HereMessage>{
      type: "here",
      connections: Array.from(this.party.getConnections()).length - 1,
    };
    this.party.broadcast(JSON.stringify(hereMsg), []);
  }

  async onMessage(message: string | ArrayBuffer, connection: Party.Connection) {
    const msg = JSON.parse(message as string);
    if (msg.type === "turn") {
      const players = (await this.party.storage.get("players")) as Set<string>;
      const poem = (await this.party.storage.get("poem")) as Poem;

      // Record the player
      players.add(connection.id);
      await this.party.storage.put("players", players);

      // Record the position change
      poem.words[msg.word.id] = msg.word;
      poem.turns++;
      poem.players = players.size;
      await this.party.storage.put("poem", poem);

      // Broadcast the new move to all connections
      const update = <UpdateMessage>{
        type: "update",
        word: msg.word,
        turns: poem.turns,
        players: poem.players,
      };
      this.party.broadcast(JSON.stringify(update), []);
    } else if (msg.type === "reset") {
      // Reset storage to defaults, and tell the whole party
      const newPoem = await this.resetGame();
      const msg = <SyncMessage>{
        type: "sync",
        poem: newPoem,
      };
      this.party.broadcast(JSON.stringify(msg), []);
    }
  }

  // As a debug endpoint, return the current state of the game from room storage
  // The url is NEXT_PUBLIC_PARTYKIT_HOST/party/POETRY_ROOM_ID
  // e.g. in dev: http://127.0.0.1:1999/party/announcer
  async onRequest(req: Party.Request) {
    if (this.party.id !== POETRY_ROOM_ID) {
      return new Response("Not found", { status: 404 });
    }

    if (req.method === "GET") {
      const players = (await this.party.storage.get("players")) as Set<string>;
      const poem = (await this.party.storage.get("poem")) as Poem;
      const dump = {
        players: Array.from(players),
        poem: poem,
      };
      return new Response(JSON.stringify(dump, null, 2));
    }

    return new Response("Method not implemented", { status: 501 });
  }
}
